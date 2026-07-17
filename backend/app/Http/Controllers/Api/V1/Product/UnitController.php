<?php

namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Product\CreateUnitRequest;
use App\Http\Requests\Product\UpdateUnitRequest;
use App\Http\Resources\Product\UnitResource;
use App\Infrastructure\Services\Product\UnitService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UnitController extends BaseApiController
{
    public function __construct(private readonly UnitService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $query = \App\Models\Product\Unit::when($request->search, function ($q, $search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('symbol', 'like', "%{$search}%");
        });

        $records = $query->paginate($request->integer('per_page', 10));

        return $this->paginatedResourceResponse(
            UnitResource::collection($records),
            $records,
            'Unit list retrieved successfully'
        );
    }

    public function store(CreateUnitRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new UnitResource($record),
            'Unit created successfully',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->service->getById($id);
        return $this->successResponse(
            new UnitResource($record),
            'Unit details retrieved successfully'
        );
    }

    public function update(UpdateUnitRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new UnitResource($record),
            'Unit updated successfully'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Unit deleted successfully'
        );
    }
}
