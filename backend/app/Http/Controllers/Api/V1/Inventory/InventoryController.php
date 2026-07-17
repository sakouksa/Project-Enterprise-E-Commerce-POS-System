<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Inventory\Inventory;
use App\Http\Resources\Inventory\InventoryResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends BaseApiController
{
    /**
     * GET /api/v1/inventory
     */
    public function index(Request $request): JsonResponse
    {
        $inventory = Inventory::with(['product', 'variant', 'warehouse'])
            ->when($request->warehouse_id, fn($q, $w) => $q->where('warehouse_id', $w))
            ->when($request->search, function ($q, $search) {
                $q->whereHas('product', fn($pq) => $pq->where('name', 'like', "%{$search}%")->orWhere('sku', 'like', "%{$search}%"));
            })
            ->paginate($request->integer('per_page', 10));

        $resourceCollection = InventoryResource::collection($inventory);

        return $this->paginatedResourceResponse($resourceCollection, $inventory);
    }

    /**
     * GET /api/v1/inventory/low-stock
     */
    public function lowStock(Request $request): JsonResponse
    {
        $lowStock = Inventory::with(['product', 'variant', 'warehouse'])
            ->lowStock()
            ->paginate($request->integer('per_page', 10));

        $resourceCollection = InventoryResource::collection($lowStock);

        return $this->paginatedResourceResponse($resourceCollection, $lowStock);
    }

    /**
     * GET /api/v1/inventory/{id}
     */
    public function show(int $id): JsonResponse
    {
        $item = Inventory::with(['product', 'variant', 'warehouse'])->findOrFail($id);
        return $this->successResponse(new InventoryResource($item));
    }
}
