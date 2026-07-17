<?php

namespace App\Http\Controllers\Api\V1\Employee;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Employee\CreateDepartmentRequest;
use App\Http\Requests\Employee\UpdateDepartmentRequest;
use App\Http\Resources\Employee\DepartmentResource;
use App\Infrastructure\Services\Employee\DepartmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends BaseApiController
{
    public function __construct(private readonly DepartmentService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $records = $this->service->getPaginated($request->get('per_page', 15));
        return $this->successResponse(
            DepartmentResource::collection($records),
            'Department list retrieved successfully'
        );
    }

    public function store(CreateDepartmentRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new DepartmentResource($record),
            'Department created successfully',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->service->getById($id);
        return $this->successResponse(
            new DepartmentResource($record),
            'Department details retrieved successfully'
        );
    }

    public function update(UpdateDepartmentRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new DepartmentResource($record),
            'Department updated successfully'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Department deleted successfully'
        );
    }
}
