<?php

namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Product\Attribute;
use App\Http\Requests\Product\StoreAttributeRequest;
use App\Http\Requests\Product\UpdateAttributeRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttributeController extends BaseApiController
{
    /**
     * GET /api/v1/attributes
     */
    public function index(Request $request): JsonResponse
    {
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['id', 'name', 'type', 'is_active', 'created_at'];
        $sortBy = in_array($sortBy, $allowedSorts) ? $sortBy : 'id';
        $sortOrder = in_array(strtolower($sortOrder), ['asc', 'desc']) ? $sortOrder : 'desc';

        $attributes = Attribute::with(['values' => fn($q) => $q->orderBy('sort_order')->orderBy('id')])
            ->when($request->status === 'deleted', function ($q) {
                $q->onlyTrashed();
            })
            ->when($request->status && $request->status !== 'deleted', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active');
            })
            ->when($request->search, fn($q, $v) => $q->where('name', 'like', "%{$v}%"))
            ->orderBy($sortBy, $sortOrder)
            ->paginate($request->integer('per_page', 10));

        return $this->paginatedResponse($attributes);
    }

    public function show(int $id): JsonResponse
    {
        $attribute = Attribute::with('values')->findOrFail($id);
        return $this->successResponse($attribute);
    }

    public function store(StoreAttributeRequest $request): JsonResponse
    {
        $attribute = Attribute::create($request->validated());
        if ($request->has('values') && is_array($request->values)) {
            foreach ($request->values as $val) {
                if (!empty($val['value'])) {
                    $attribute->values()->create([
                        'value'      => $val['value'],
                        'color_code' => $val['color_code'] ?? null,
                        'sort_order' => $val['sort_order'] ?? 0,
                    ]);
                }
            }
        }
        return $this->successResponse($attribute->load('values'), 'Attribute created successfully', 201);
    }

    public function update(UpdateAttributeRequest $request, int $id): JsonResponse
    {
        $attribute = Attribute::findOrFail($id);
        $attribute->update($request->validated());
        if ($request->has('values') && is_array($request->values)) {
            $attribute->values()->delete();
            foreach ($request->values as $val) {
                if (!empty($val['value'])) {
                    $attribute->values()->create([
                        'value'      => $val['value'],
                        'color_code' => $val['color_code'] ?? null,
                        'sort_order' => $val['sort_order'] ?? 0,
                    ]);
                }
            }
        }
        return $this->successResponse($attribute->load('values'), 'Attribute updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $attribute = Attribute::findOrFail($id);
        $attribute->delete();
        return $this->successResponse(null, 'Attribute deleted successfully');
    }

    public function restore(int $id): JsonResponse
    {
        $attribute = Attribute::onlyTrashed()->findOrFail($id);
        $attribute->restore();
        return $this->successResponse($attribute, 'Attribute restored successfully');
    }

    public function forceDelete(int $id): JsonResponse
    {
        $attribute = Attribute::withTrashed()->findOrFail($id);
        $attribute->forceDelete();
        return $this->successResponse(null, 'Attribute permanently deleted successfully');
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = 0;
        foreach ($ids as $id) {
            $attribute = Attribute::find($id);
            if ($attribute) {
                $attribute->delete();
                $count++;
            }
        }
        return $this->successResponse(null, "{$count} attributes deleted successfully");
    }

    public function bulkRestore(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = 0;
        foreach ($ids as $id) {
            $attribute = Attribute::onlyTrashed()->find($id);
            if ($attribute) {
                $attribute->restore();
                $count++;
            }
        }
        return $this->successResponse(null, "{$count} attributes restored successfully");
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename=attributes_export_' . now()->format('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function () use ($request) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, ['Name', 'Type', 'Active']);

            $attributes = Attribute::all();

            foreach ($attributes as $attr) {
                fputcsv($file, [
                    $attr->name,
                    $attr->type,
                    $attr->is_active ? '1' : '0'
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');
        if ($handle === false) {
            return response()->json(['success' => false, 'message' => 'Cannot open file'], 400);
        }

        $bom = fread($handle, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            rewind($handle);
        }

        $headers = fgetcsv($handle);
        if (!$headers) {
            fclose($handle);
            return response()->json(['success' => false, 'message' => 'Empty CSV'], 400);
        }
        $headers = array_map(fn($h) => strtolower(trim($h)), $headers);

        $successCount = 0;
        $errors = [];
        $line = 1;

        while (($row = fgetcsv($handle)) !== false) {
            $line++;
            if (count($row) < count($headers)) {
                $row = array_pad($row, count($headers), '');
            } else {
                $row = array_slice($row, 0, count($headers));
            }
            $data = array_combine($headers, $row);

            $name = trim($data['name'] ?? '');
            if (!$name) {
                $errors[] = "Line {$line}: Name is required.";
                continue;
            }

            Attribute::create([
                'company_id' => $request->user()->company_id ?? 1,
                'name'       => $name,
                'type'       => trim($data['type'] ?? 'select'),
                'is_active'  => filter_var($data['active'] ?? $data['is_active'] ?? true, FILTER_VALIDATE_BOOLEAN)
            ]);
            $successCount++;
        }
        fclose($handle);

        return response()->json([
            'success' => true,
            'message' => 'Import completed',
            'data' => [
                'success_count' => $successCount,
                'errors' => $errors
            ]
        ]);
    }
}
