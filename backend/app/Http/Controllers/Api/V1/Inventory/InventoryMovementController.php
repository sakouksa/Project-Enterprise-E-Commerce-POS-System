<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Inventory\CreateInventoryMovementRequest;
use App\Http\Requests\Inventory\UpdateInventoryMovementRequest;
use App\Http\Resources\Inventory\InventoryMovementResource;
use App\Infrastructure\Services\Inventory\InventoryMovementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryMovementController extends BaseApiController
{
    public function __construct(private readonly InventoryMovementService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $query = \App\Models\Inventory\InventoryMovement::with([
            'product:id,name,sku',
            'warehouse:id,name',
            'user:id,name'
        ])
        ->when($request->product_id, fn($q, $productId) => $q->where('product_id', $productId))
        ->when($request->warehouse_id, fn($q, $warehouseId) => $q->where('warehouse_id', $warehouseId))
        ->when($request->type, fn($q, $type) => $q->where('type', $type))
        ->when($request->user_id, fn($q, $userId) => $q->where('user_id', $userId))
        ->when($request->start_date ?? $request->created_start, fn($q, $start) => $q->whereDate('created_at', '>=', $start))
        ->when($request->end_date ?? $request->created_end, fn($q, $end) => $q->whereDate('created_at', '<=', $end))
        ->when($request->search, function ($q, $search) {
            $q->where(function ($sq) use ($search) {
                $sq->whereHas('product', fn($pq) => $pq->where('name', 'like', "%{$search}%")->orWhere('sku', 'like', "%{$search}%"))
                   ->orWhere('notes', 'like', "%{$search}%")
                   ->orWhere('reference_type', 'like', "%{$search}%");
            });
        })
        ->orderBy('created_at', 'desc');

        $records = $query->paginate($request->integer('per_page', 10));

        return $this->paginatedResourceResponse(
            InventoryMovementResource::collection($records),
            $records,
            'InventoryMovement list retrieved successfully'
        );
    }

    public function store(CreateInventoryMovementRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new InventoryMovementResource($record),
            'InventoryMovement created successfully',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->service->getById($id);
        return $this->successResponse(
            new InventoryMovementResource($record),
            'InventoryMovement details retrieved successfully'
        );
    }

    public function update(UpdateInventoryMovementRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new InventoryMovementResource($record),
            'InventoryMovement updated successfully'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(
            null,
            'InventoryMovement deleted successfully'
        );
    }
}
