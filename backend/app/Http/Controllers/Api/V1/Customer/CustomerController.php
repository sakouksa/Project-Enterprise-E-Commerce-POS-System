<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Customer\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CustomerController extends BaseApiController
{
    /**
     * GET /api/v1/customers
     */
    public function index(Request $request): JsonResponse
    {
        $customers = Customer::with(['group', 'user'])
            ->when($request->status === 'deleted', function ($q) {
                $q->onlyTrashed();
            })
            ->when($request->status && $request->status !== 'deleted' && $request->status !== 'all', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active' || $request->status === '1');
            })
            ->when($request->customer_group_id, function ($q, $groupId) {
                $q->where('customer_group_id', $groupId);
            })
            ->when($request->gender, function ($q, $gender) {
                $q->where('gender', $gender);
            })
            ->when($request->search, function ($q, $search) {
                $q->where(function($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($request->start_date, function ($q, $date) {
                $q->whereDate('created_at', '>=', $date);
            })
            ->when($request->end_date, function ($q, $date) {
                $q->whereDate('created_at', '<=', $date);
            })
            ->orderBy($request->get('sort_by', 'created_at'), $request->get('sort_order', 'desc'))
            ->paginate($request->integer('per_page', 10));

        return $this->paginatedResponse($customers);
    }

    /**
     * GET /api/v1/customers/{id}
     */
    public function show(int $id): JsonResponse
    {
        $customer = Customer::with(['group', 'user', 'addresses'])->findOrFail($id);
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
            'user_id'           => 'nullable|exists:users,id',
            'name'              => 'required|string|max:100',
            'email'             => 'nullable|email|max:100',
            'phone'             => 'nullable|string|max:50',
            'gender'            => 'nullable|string|in:male,female,other',
            'birth_date'        => 'nullable|date',
            'photo'             => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'tax_number'        => 'nullable|string|max:100',
            'notes'             => 'nullable|string',
            'is_active'         => 'sometimes|boolean',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('customers', 'public');
            $data['photo'] = Storage::url($path);
        }

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
            'user_id'           => 'nullable|exists:users,id',
            'name'              => 'sometimes|required|string|max:100',
            'email'             => 'nullable|email|max:100',
            'phone'             => 'nullable|string|max:50',
            'gender'            => 'nullable|string|in:male,female,other',
            'birth_date'        => 'nullable|date',
            'photo'             => 'nullable',
            'tax_number'        => 'nullable|string|max:100',
            'notes'             => 'nullable|string',
            'is_active'         => 'sometimes|boolean',
        ]);

        if ($request->hasFile('photo')) {
            $request->validate([
                'photo' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048'
            ]);

            if ($customer->photo) {
                $oldPath = str_replace(Storage::url(''), '', $customer->photo);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('photo')->store('customers', 'public');
            $data['photo'] = Storage::url($path);
        } elseif ($request->exists('photo') && $request->photo === null) {
            if ($customer->photo) {
                $oldPath = str_replace(Storage::url(''), '', $customer->photo);
                Storage::disk('public')->delete($oldPath);
            }
            $data['photo'] = null;
        } else {
            // Remove photo from data if it's a string (URL) to avoid overwriting with the URL string
            unset($data['photo']);
        }

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
            if ($customer->photo) {
                $oldPath = str_replace(Storage::url(''), '', $customer->photo);
                Storage::disk('public')->delete($oldPath);
            }
            $customer->forceDelete();
            return $this->successResponse(null, 'Customer permanently deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * GET /api/v1/customers/{id}/orders
     */
    public function orders(int $id): JsonResponse
    {
        $customer = Customer::findOrFail($id);
        $orders = \App\Models\Order\Order::where('customer_id', $id)->latest()->paginate(10);
        return $this->paginatedResponse($orders);
    }
}
