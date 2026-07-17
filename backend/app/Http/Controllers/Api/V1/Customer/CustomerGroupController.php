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
        $groups = CustomerGroup::when($request->status === 'deleted', function ($q) {
                $q->onlyTrashed();
            })
            ->when($request->status && $request->status !== 'deleted', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active');
            })
            ->when($request->search, fn($q, $v) => $q->where('name', 'like', "%{$v}%"))
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
            'discount_percent' => 'sometimes|numeric|min:0|max:100',
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
            'discount_percent' => 'sometimes|numeric|min:0|max:100',
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
}
