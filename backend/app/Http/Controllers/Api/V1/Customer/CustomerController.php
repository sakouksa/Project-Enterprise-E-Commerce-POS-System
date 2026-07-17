<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Customer\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends BaseApiController
{
    /**
     * GET /api/v1/customers
     */
    public function index(Request $request): JsonResponse
    {
        $customers = Customer::with(['group'])
            ->when($request->status === 'deleted', function ($q) {
                $q->onlyTrashed();
            })
            ->when($request->status && $request->status !== 'deleted', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active');
            })
            ->when($request->search, function ($q, $search) {
                $q->where(function($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->paginate($request->integer('per_page', 10));

        return $this->paginatedResponse($customers);
    }

    /**
     * GET /api/v1/customers/{id}
     */
    public function show(int $id): JsonResponse
    {
        $customer = Customer::with(['group', 'addresses'])->findOrFail($id);
        return $this->successResponse($customer);
    }

    /**
     * POST /api/v1/customers
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id'        => 'required|exists:companies,id',
            'customer_group_id' => 'nullable|exists:customer_groups,id',
            'name'              => 'required|string|max:100',
            'email'             => 'nullable|email|max:100',
            'phone'             => 'nullable|string|max:50',
            'gender'            => 'nullable|string|in:male,female,other',
            'birth_date'        => 'nullable|date',
            'tax_number'        => 'nullable|string|max:100',
            'loyalty_points'    => 'nullable|numeric|min:0',
            'notes'             => 'nullable|string',
            'is_active'         => 'sometimes|boolean',
        ]);

        $customer = Customer::create($data);

        return $this->successResponse($customer, 'Customer created successfully', 201);
    }

    /**
     * PUT /api/v1/customers/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $customer = Customer::findOrFail($id);

        $data = $request->validate([
            'customer_group_id' => 'nullable|exists:customer_groups,id',
            'name'              => 'sometimes|required|string|max:100',
            'email'             => 'nullable|email|max:100',
            'phone'             => 'nullable|string|max:50',
            'gender'            => 'nullable|string|in:male,female,other',
            'birth_date'        => 'nullable|date',
            'tax_number'        => 'nullable|string|max:100',
            'loyalty_points'    => 'nullable|numeric|min:0',
            'notes'             => 'nullable|string',
            'is_active'         => 'sometimes|boolean',
        ]);

        $customer->update($data);

        return $this->successResponse($customer, 'Customer updated successfully');
    }

    /**
     * DELETE /api/v1/customers/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $customer = Customer::findOrFail($id);
            $customer->delete();
            return $this->successResponse(null, 'Customer deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * POST /api/v1/customers/{id}/restore
     */
    public function restore(int $id): JsonResponse
    {
        try {
            $customer = Customer::onlyTrashed()->findOrFail($id);
            $customer->restore();
            return $this->successResponse(null, 'Customer restored successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * DELETE /api/v1/customers/{id}/force
     */
    public function forceDelete(int $id): JsonResponse
    {
        try {
            $customer = Customer::withTrashed()->findOrFail($id);
            $customer->forceDelete();
            return $this->successResponse(null, 'Customer permanently deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
