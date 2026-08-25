<?php

namespace App\Http\Controllers\Api\V1\Admin\Setting;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Setting\CreateCountryRequest;
use App\Http\Requests\Setting\UpdateCountryRequest;
use App\Http\Resources\Setting\CountryResource;
use App\Services\Setting\CountryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CountryController extends BaseApiController
{
    public function __construct(private readonly CountryService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $records = $this->service->getPaginated($request->get('per_page', 15));
        return $this->successResponse(
            CountryResource::collection($records),
            'Country list retrieved successfully'
        );
    }

    public function store(CreateCountryRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new CountryResource($record),
            'Country created successfully',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->service->getById($id);
        return $this->successResponse(
            new CountryResource($record),
            'Country details retrieved successfully'
        );
    }

    public function update(UpdateCountryRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new CountryResource($record),
            'Country updated successfully'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Country deleted successfully'
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
        return $this->successResponse(null, "{$count} countries deleted successfully");
    }
}
