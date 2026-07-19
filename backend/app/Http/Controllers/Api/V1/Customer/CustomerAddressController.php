<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Customer\CreateCustomerAddressRequest;
use App\Http\Requests\Customer\UpdateCustomerAddressRequest;
use App\Http\Resources\Customer\CustomerAddressResource;
use App\Infrastructure\Services\Customer\CustomerAddressService;
use App\Models\Customer\CustomerAddress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerAddressController extends BaseApiController
{
    public function __construct(private readonly CustomerAddressService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $records = CustomerAddress::with(['customer'])
            ->when($request->customer_id, function ($q, $customerId) {
                $q->where('customer_id', $customerId);
            })
            ->when($request->search, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('label', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%")
                        ->orWhere('province', 'like', "%{$search}%")
                        ->orWhere('country', 'like', "%{$search}%")
                        ->orWhere('postal_code', 'like', "%{$search}%");
                });
            })
            ->orderBy($request->get('sort_by', 'created_at'), $request->get('sort_order', 'desc'))
            ->paginate($request->integer('per_page', 15));

        return $this->successResponse(
            CustomerAddressResource::collection($records),
            'CustomerAddress list retrieved successfully'
        );
    }

    public function store(CreateCustomerAddressRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new CustomerAddressResource($record),
            'CustomerAddress created successfully',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->service->getById($id, ['customer']);
        return $this->successResponse(
            new CustomerAddressResource($record),
            'CustomerAddress details retrieved successfully'
        );
    }

    public function update(UpdateCustomerAddressRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new CustomerAddressResource($record),
            'CustomerAddress updated successfully'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(
            null,
            'CustomerAddress deleted successfully'
        );
    }
}
