<?php

namespace App\Http\Controllers\Api\V1\Employee;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Employee\CreateAttendanceRequest;
use App\Http\Requests\Employee\UpdateAttendanceRequest;
use App\Http\Resources\Employee\AttendanceResource;
use App\Infrastructure\Services\Employee\AttendanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends BaseApiController
{
    public function __construct(private readonly AttendanceService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $records = $this->service->getPaginated($request->get('per_page', 15));
        return $this->successResponse(
            AttendanceResource::collection($records),
            'Attendance list retrieved successfully'
        );
    }

    public function store(CreateAttendanceRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new AttendanceResource($record),
            'Attendance created successfully',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->service->getById($id);
        return $this->successResponse(
            new AttendanceResource($record),
            'Attendance details retrieved successfully'
        );
    }

    public function update(UpdateAttendanceRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new AttendanceResource($record),
            'Attendance updated successfully'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Attendance deleted successfully'
        );
    }
}
