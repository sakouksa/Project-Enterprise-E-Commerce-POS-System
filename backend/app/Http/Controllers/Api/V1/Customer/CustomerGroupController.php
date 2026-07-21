<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Customer\CustomerGroup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerGroupController extends BaseApiController
{
    /**
     * GET /api/v1/customer-groups
     */
    public function index(Request $request): JsonResponse
    {
        $groups = CustomerGroup::withCount('customers')
            ->when($request->status === 'deleted', function ($q) {
                $q->onlyTrashed();
            })
            ->when($request->status && $request->status !== 'deleted' && $request->status !== 'all', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active' || $request->status === '1');
            })
            ->when($request->search, function ($q, $search) {
                $q->where(function($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy($request->get('sort_by', 'created_at'), $request->get('sort_order', 'desc'))
            ->paginate($request->integer('per_page', 20));

        return $this->paginatedResponse($groups);
    }

    /**
     * GET /api/v1/customer-groups/{id}
     */
    public function show(int $id): JsonResponse
    {
        $group = CustomerGroup::findOrFail($id);
        return $this->successResponse($group);
    }

    /**
     * POST /api/v1/customer-groups
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id'       => 'required|exists:companies,id',
            'name'             => 'required|string|max:100',
            'description'      => 'nullable|string',
            'discount_percent' => 'required|numeric|min:0|max:100',
            'is_active'        => 'sometimes|boolean',
        ]);

        $group = CustomerGroup::create($data);

        return $this->successResponse($group, 'Customer group created successfully', 201);
    }

    /**
     * PUT /api/v1/customer-groups/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $group = CustomerGroup::findOrFail($id);

        $data = $request->validate([
            'name'             => 'sometimes|required|string|max:100',
            'description'      => 'nullable|string',
            'discount_percent' => 'sometimes|required|numeric|min:0|max:100',
            'is_active'        => 'sometimes|boolean',
        ]);

        $group->update($data);

        return $this->successResponse($group, 'Customer group updated successfully');
    }

    /**
     * DELETE /api/v1/customer-groups/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $group = CustomerGroup::findOrFail($id);
            $group->delete();
            return $this->successResponse(null, 'Customer group deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * POST /api/v1/customer-groups/{id}/restore
     */
    public function restore(int $id): JsonResponse
    {
        try {
            $group = CustomerGroup::onlyTrashed()->findOrFail($id);
            $group->restore();
            return $this->successResponse(null, 'Customer group restored successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * DELETE /api/v1/customer-groups/{id}/force
     */
    public function forceDelete(int $id): JsonResponse
    {
        try {
            $group = CustomerGroup::withTrashed()->findOrFail($id);
            $group->forceDelete();
            return $this->successResponse(null, 'Customer group permanently deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=customer_groups_export_' . now()->format('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function () use ($request) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, [
                'ID', 'Name', 'Description', 'Discount Percent', 'Is Active'
            ]);

            $groups = CustomerGroup::withTrashed()->get();

            foreach ($groups as $g) {
                fputcsv($file, [
                    $g->id,
                    $g->name,
                    $g->description ?? '',
                    $g->discount_percent,
                    $g->is_active ? '1' : '0'
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

            CustomerGroup::create([
                'company_id' => 1,
                'name' => $name,
                'description' => trim($data['description'] ?? '') ?: null,
                'discount_percent' => floatval($data['discount percent'] ?? $data['discount_percent'] ?? 0),
                'is_active' => ($data['is active'] ?? $data['is_active'] ?? '1') === '1',
            ]);

            $successCount++;
        }

        fclose($handle);

        return response()->json([
            'success' => true,
            'message' => "Imported {$successCount} customer groups successfully. " . count($errors) . " errors.",
            'errors' => $errors
        ]);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        CustomerGroup::whereIn('id', $ids)->delete();
        return $this->successResponse(null, 'Selected customer groups deleted successfully');
    }

    public function bulkRestore(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        CustomerGroup::onlyTrashed()->whereIn('id', $ids)->restore();
        return $this->successResponse(null, 'Selected customer groups restored successfully');
    }
}
