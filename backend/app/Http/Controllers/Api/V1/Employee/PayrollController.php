<?php

namespace App\Http\Controllers\Api\V1\Employee;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Employee\CreatePayrollRequest;
use App\Http\Requests\Employee\UpdatePayrollRequest;
use App\Http\Resources\Employee\PayrollResource;
use App\Infrastructure\Services\Employee\PayrollService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PayrollController extends BaseApiController
{
    public function __construct(private readonly PayrollService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $records = $this->service->getPaginated($request->get('per_page', 15));
        return $this->successResponse(
            PayrollResource::collection($records),
            'Payroll list retrieved successfully'
        );
    }

    public function store(CreatePayrollRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new PayrollResource($record),
            'Payroll created successfully',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->service->getById($id);
        return $this->successResponse(
            new PayrollResource($record),
            'Payroll details retrieved successfully'
        );
    }

    public function update(UpdatePayrollRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new PayrollResource($record),
            'Payroll updated successfully'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Payroll deleted successfully'
        );
    }
}
