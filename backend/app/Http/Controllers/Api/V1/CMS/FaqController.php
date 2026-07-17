<?php

namespace App\Http\Controllers\Api\V1\CMS;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\CMS\CreateFaqRequest;
use App\Http\Requests\CMS\UpdateFaqRequest;
use App\Http\Resources\CMS\FaqResource;
use App\Infrastructure\Services\CMS\FaqService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends BaseApiController
{
    public function __construct(private readonly FaqService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $records = $this->service->getPaginated($request->get('per_page', 15));
        return $this->successResponse(
            FaqResource::collection($records),
            'Faq list retrieved successfully'
        );
    }

    public function store(CreateFaqRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new FaqResource($record),
            'Faq created successfully',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->service->getById($id);
        return $this->successResponse(
            new FaqResource($record),
            'Faq details retrieved successfully'
        );
    }

    public function update(UpdateFaqRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new FaqResource($record),
            'Faq updated successfully'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Faq deleted successfully'
        );
    }
}
