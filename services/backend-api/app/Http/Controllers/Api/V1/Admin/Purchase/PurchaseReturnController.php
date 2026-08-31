<?php

namespace App\Http\Controllers\Api\V1\Admin\Purchase;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Purchase\PurchaseReturnRequest;
use App\Http\Requests\Purchase\UpdatePurchaseReturnRequest;
use App\Http\Resources\Purchase\PurchaseReturnResource;
use App\Services\Purchase\PurchaseReturnService;
use App\Models\Purchase\PurchaseReturn;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseReturnController extends BaseApiController
{
    public function __construct(private readonly PurchaseReturnService $service)
    {
    }

    /**
     * GET /api/v1/purchase-returns or GET /api/v1/purchases/returns
     */
    public function index(Request $request): JsonResponse
    {
        $query = PurchaseReturn::with(['purchase', 'supplier', 'user', 'items']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference_number', 'like', "%{$search}%")
                  ->orWhere('reason', 'like', "%{$search}%")
                  ->orWhereHas('supplier', function ($sq) use ($search) {
                      $sq->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('purchase', function ($pq) use ($search) {
                      $pq->where('reference_number', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->supplier_id) {
            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->purchase_id) {
            $query->where('purchase_id', $request->purchase_id);
        }

        if ($request->date) {
            $query->whereDate('date', $request->date);
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedFields = ['id', 'reference_number', 'date', 'total_amount', 'status', 'created_at'];
        if (in_array($sortBy, $allowedFields)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $returns = $query->paginate($request->integer('per_page', 10));

        $returns->setCollection(PurchaseReturnResource::collection($returns->getCollection())->collection);

        return $this->paginatedResponse($returns);
    }

    /**
     * GET /api/v1/purchase-returns/{id}
     */
    public function show(int $id): JsonResponse
    {
        $return = PurchaseReturn::with(['purchase', 'supplier', 'user', 'items.variant', 'items.product'])->findOrFail($id);
        return $this->successResponse(new PurchaseReturnResource($return), 'Purchase return details retrieved successfully');
    }

    /**
     * POST /api/v1/purchase-returns
     */
    public function store(PurchaseReturnRequest $request): JsonResponse
    {
        try {
            $return = $this->service->createReturn($request->validated());
            $return->load(['purchase', 'supplier', 'user', 'items']);
            return $this->successResponse(new PurchaseReturnResource($return), 'Purchase return created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    /**
     * POST /api/v1/purchase-returns/{id}/approve
     */
    public function approve(int $id): JsonResponse
    {
        try {
            $return = $this->service->approveReturn($id);
            $return->load(['purchase', 'supplier', 'user', 'items']);
            return $this->successResponse(new PurchaseReturnResource($return), 'Purchase return approved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    /**
     * POST /api/v1/purchase-returns/{id}/cancel
     */
    public function cancel(int $id): JsonResponse
    {
        try {
            $return = $this->service->cancelReturn($id);
            return $this->successResponse(new PurchaseReturnResource($return), 'Purchase return cancelled successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    /**
     * PUT /api/v1/purchase-returns/{id}
     */
    public function update(UpdatePurchaseReturnRequest $request, int $id): JsonResponse
    {
        try {
            $return = $this->service->update($id, $request->validated());
            return $this->successResponse(new PurchaseReturnResource($return), 'Purchase return updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    /**
     * DELETE /api/v1/purchase-returns/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->service->delete($id);
            return $this->successResponse(null, 'Purchase return deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    /**
     * POST /api/v1/purchase-returns/bulk-delete
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $request->validate(['ids' => 'required|array']);
        try {
            $count = $this->service->bulkDelete($request->ids);
            return $this->successResponse(['count' => $count], "{$count} purchase returns deleted successfully");
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }
}
