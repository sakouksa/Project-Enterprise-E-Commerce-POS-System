<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Customer\CreateCustomerAddressRequest;
use App\Http\Requests\Customer\UpdateCustomerAddressRequest;
use App\Http\Resources\Customer\CustomerAddressResource;
use App\Infrastructure\Services\Customer\CustomerAddressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerAddressController extends BaseApiController
{
    public function __construct(private readonly CustomerAddressService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $records = $this->service->getPaginated($request->get('per_page', 15), ['customer']);
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
        $record = $this->service->getById($id);
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
