<?php

namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Product\CreateTaxRequest;
use App\Http\Requests\Product\UpdateTaxRequest;
use App\Http\Resources\Product\TaxResource;
use App\Infrastructure\Services\Product\TaxService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaxController extends BaseApiController
{
    public function __construct(private readonly TaxService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $records = $this->service->getPaginated($request->get('per_page', 15));
        return $this->successResponse(
            TaxResource::collection($records),
            'Tax list retrieved successfully'
        );
    }

    public function store(CreateTaxRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new TaxResource($record),
            'Tax created successfully',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->service->getById($id);
        return $this->successResponse(
            new TaxResource($record),
            'Tax details retrieved successfully'
        );
    }

    public function update(UpdateTaxRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new TaxResource($record),
            'Tax updated successfully'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Tax deleted successfully'
        );
    }
}
