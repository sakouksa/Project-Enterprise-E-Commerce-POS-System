<?php

namespace App\Http\Controllers\Api\V1\Purchase;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Supplier\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends BaseApiController
{
    /**
     * GET /api/v1/suppliers
     */
    public function index(Request $request): JsonResponse
    {
        $suppliers = Supplier::when($request->status === 'deleted', function ($q) {
                $q->onlyTrashed();
            })
            ->when($request->status && $request->status !== 'deleted', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active');
            })
            ->when($request->search, function ($q, $v) {
                $q->where(function($sub) use ($v) {
                    $sub->where('name', 'like', "%{$v}%")
                        ->orWhere('code', 'like', "%{$v}%")
                        ->orWhere('email', 'like', "%{$v}%");
                });
            })
            ->paginate($request->integer('per_page', 10));

        return $this->paginatedResponse($suppliers);
    }

    /**
     * GET /api/v1/suppliers/{id}
     */
    public function show(int $id): JsonResponse
    {
        $supplier = Supplier::with('contacts')->findOrFail($id);
        return $this->successResponse($supplier);
    }

    /**
     * POST /api/v1/suppliers
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id'          => 'required|exists:companies,id',
            'name'                => 'required|string|max:100',
            'code'                => 'required|string|unique:suppliers,code',
            'email'               => 'nullable|email|max:100',
            'phone'               => 'nullable|string|max:50',
            'fax'                 => 'nullable|string|max:50',
            'address'             => 'nullable|string',
            'city'                => 'nullable|string|max:100',
            'province'            => 'nullable|string|max:100',
            'country'             => 'nullable|string|max:100',
            'postal_code'         => 'nullable|string|max:20',
            'tax_number'          => 'nullable|string|max:100',
            'bank_name'           => 'nullable|string|max:100',
            'bank_account_number' => 'nullable|string|max:100',
            'bank_account_name'   => 'nullable|string|max:150',
            'notes'               => 'nullable|string',
            'is_active'           => 'sometimes|boolean',
        ]);

        $supplier = Supplier::create($data);

        return $this->successResponse($supplier, 'Supplier created successfully', 201);
    }

    /**
     * PUT /api/v1/suppliers/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $supplier = Supplier::findOrFail($id);

        $data = $request->validate([
            'name'                => 'sometimes|required|string|max:100',
            'code'                => "sometimes|required|string|unique:suppliers,code,{$id}",
            'email'               => 'nullable|email|max:100',
            'phone'               => 'nullable|string|max:50',
            'fax'                 => 'nullable|string|max:50',
            'address'             => 'nullable|string',
            'city'                => 'nullable|string|max:100',
            'province'            => 'nullable|string|max:100',
            'country'             => 'nullable|string|max:100',
            'postal_code'         => 'nullable|string|max:20',
            'tax_number'          => 'nullable|string|max:100',
            'bank_name'           => 'nullable|string|max:100',
            'bank_account_number' => 'nullable|string|max:100',
            'bank_account_name'   => 'nullable|string|max:150',
            'notes'               => 'nullable|string',
            'is_active'           => 'sometimes|boolean',
        ]);

        $supplier->update($data);

        return $this->successResponse($supplier, 'Supplier updated successfully');
    }

    /**
     * DELETE /api/v1/suppliers/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $supplier = Supplier::findOrFail($id);
            $supplier->delete();
            return $this->successResponse(null, 'Supplier deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * POST /api/v1/suppliers/{id}/restore
     */
    public function restore(int $id): JsonResponse
    {
        try {
            $supplier = Supplier::onlyTrashed()->findOrFail($id);
            $supplier->restore();
            return $this->successResponse(null, 'Supplier restored successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * DELETE /api/v1/suppliers/{id}/force
     */
    public function forceDelete(int $id): JsonResponse
    {
        try {
            $supplier = Supplier::withTrashed()->findOrFail($id);
            $supplier->forceDelete();
            return $this->successResponse(null, 'Supplier permanently deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
