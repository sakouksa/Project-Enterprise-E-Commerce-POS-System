<?php

namespace App\Http\Controllers\Api\V1\Employee;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Employee\CreatePositionRequest;
use App\Http\Requests\Employee\UpdatePositionRequest;
use App\Http\Resources\Employee\PositionResource;
use App\Infrastructure\Services\Employee\PositionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PositionController extends BaseApiController
{
    public function __construct(private readonly PositionService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $records = $this->service->getPaginated($request->get('per_page', 15));
        return $this->successResponse(
            PositionResource::collection($records),
            'Position list retrieved successfully'
        );
    }

    public function store(CreatePositionRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new PositionResource($record),
            'Position created successfully',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->service->getById($id);
        return $this->successResponse(
            new PositionResource($record),
            'Position details retrieved successfully'
        );
    }

    public function update(UpdatePositionRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new PositionResource($record),
            'Position updated successfully'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Position deleted successfully'
        );
    }
}
