<?php

namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Product\CreateUnitRequest;
use App\Http\Requests\Product\UpdateUnitRequest;
use App\Http\Resources\Product\UnitResource;
use App\Infrastructure\Services\Product\UnitService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UnitController extends BaseApiController
{
    public function __construct(private readonly UnitService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['name', 'symbol', 'description', 'is_active', 'created_at'];
        $sortBy = in_array($sortBy, $allowedSorts) ? $sortBy : 'created_at';
        $sortOrder = in_array(strtolower($sortOrder), ['asc', 'desc']) ? $sortOrder : 'desc';

        $query = \App\Models\Product\Unit::when($request->status === 'deleted', function ($q) {
                $q->onlyTrashed();
            })
            ->when($request->status && $request->status !== 'deleted', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active');
            })
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('symbol', 'like', "%{$search}%");
            });

        $records = $query->orderBy($sortBy, $sortOrder)
                          ->paginate($request->integer('per_page', 10));

        return $this->paginatedResourceResponse(
            UnitResource::collection($records),
            $records,
            'Unit list retrieved successfully'
        );
    }

    public function store(CreateUnitRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new UnitResource($record),
            'Unit created successfully',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->service->getById($id);
        return $this->successResponse(
            new UnitResource($record),
            'Unit details retrieved successfully'
        );
    }

    public function update(UpdateUnitRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new UnitResource($record),
            'Unit updated successfully'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Unit deleted successfully'
        );
    }

    public function restore(int $id): JsonResponse
    {
        $record = \App\Models\Product\Unit::onlyTrashed()->findOrFail($id);
        $record->restore();
        return $this->successResponse(new UnitResource($record), 'Unit restored successfully');
    }

    public function forceDelete(int $id): JsonResponse
    {
        $record = \App\Models\Product\Unit::withTrashed()->findOrFail($id);
        $record->forceDelete();
        return $this->successResponse(null, 'Unit permanently deleted successfully');
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = 0;
        foreach ($ids as $id) {
            $record = \App\Models\Product\Unit::find($id);
            if ($record) {
                $record->delete();
                $count++;
            }
        }
        return $this->successResponse(null, "{$count} units deleted successfully");
    }

    public function bulkRestore(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = 0;
        foreach ($ids as $id) {
            $record = \App\Models\Product\Unit::onlyTrashed()->find($id);
            if ($record) {
                $record->restore();
                $count++;
            }
        }
        return $this->successResponse(null, "{$count} units restored successfully");
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename=units_export_' . now()->format('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function () use ($request) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, ['Name', 'Symbol', 'Description', 'Active']);

            $records = \App\Models\Product\Unit::all();

            foreach ($records as $rec) {
                fputcsv($file, [
                    $rec->name,
                    $rec->symbol,
                    $rec->description ?? '',
                    $rec->is_active ? '1' : '0'
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
            $symbol = trim($data['symbol'] ?? '');
            if (!$name || !$symbol) {
                $errors[] = "Line {$line}: Name and Symbol are required.";
                continue;
            }

            \App\Models\Product\Unit::create([
                'company_id'  => $request->user()->company_id ?? 1,
                'name'        => $name,
                'symbol'      => $symbol,
                'description' => trim($data['description'] ?? '') ?: null,
                'is_active'   => filter_var($data['active'] ?? $data['is_active'] ?? true, FILTER_VALIDATE_BOOLEAN)
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
