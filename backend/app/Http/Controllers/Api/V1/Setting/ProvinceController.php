<?php

namespace App\Http\Controllers\Api\V1\Setting;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Setting\CreateProvinceRequest;
use App\Http\Requests\Setting\UpdateProvinceRequest;
use App\Http\Resources\Setting\ProvinceResource;
use App\Infrastructure\Services\Setting\ProvinceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProvinceController extends BaseApiController
{
    public function __construct(private readonly ProvinceService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $records = $this->service->getPaginated($request->get('per_page', 15));
        return $this->successResponse(
            ProvinceResource::collection($records),
            'Province list retrieved successfully'
        );
    }

    public function store(CreateProvinceRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new ProvinceResource($record),
            'Province created successfully',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->service->getById($id);
        return $this->successResponse(
            new ProvinceResource($record),
            'Province details retrieved successfully'
        );
    }

    public function update(UpdateProvinceRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new ProvinceResource($record),
            'Province updated successfully'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Province deleted successfully'
        );
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = 0;
        foreach ($ids as $id) {
            try {
                $this->service->delete($id);
                $count++;
            } catch (\Exception $e) {}
        }
        return $this->successResponse(null, "{$count} provinces deleted successfully");
    }
}
