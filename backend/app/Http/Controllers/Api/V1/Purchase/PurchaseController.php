<?php

namespace App\Http\Controllers\Api\V1\Purchase;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Purchase\Purchase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseController extends BaseApiController
{
    /**
     * GET /api/v1/purchases
     */
    public function index(Request $request): JsonResponse
    {
        $purchases = Purchase::with(['supplier', 'warehouse'])
            ->when($request->search, fn($q, $v) => $q->where('po_number', 'like', "%{$v}%"))
            ->paginate($request->integer('per_page', 10));

        return $this->paginatedResponse($purchases);
    }

    /**
     * GET /api/v1/purchases/{id}
     */
    public function show(int $id): JsonResponse
    {
        $purchase = Purchase::with(['supplier', 'warehouse', 'items.product'])->findOrFail($id);
        return $this->successResponse($purchase);
    }

    /**
     * POST /api/v1/purchases
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id'    => 'required|exists:companies,id',
            'warehouse_id'  => 'required|exists:warehouses,id',
            'supplier_id'   => 'required|exists:suppliers,id',
            'po_number'     => 'required|string|unique:purchases,po_number',
            'date'          => 'required|date',
            'grand_total'   => 'required|numeric',
            'items'         => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.ordered_qty'=> 'required|numeric|min:0.0001',
            'items.*.unit_cost'  => 'required|numeric|min:0',
        ]);

        $purchase = DB::transaction(function () use ($data) {
            $items = $data['items'];
            unset($data['items']);

            $data['user_id'] = auth()->id() ?? 1; // Default to admin
            $data['status']  = 'ordered';
            $purchase = Purchase::create($data);

            foreach ($items as $item) {
                $item['total'] = $item['ordered_qty'] * $item['unit_cost'];
                $item['product_name'] = \App\Models\Product\Product::find($item['product_id'])?->name ?? 'Product';
                $purchase->items()->create($item);
            }

            return $purchase;
        });

        return $this->successResponse($purchase->load('items'), 'Purchase order created successfully', 201);
    }

    /**
     * PUT /api/v1/purchases/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $purchase = Purchase::findOrFail($id);

        $data = $request->validate([
            'reference'   => 'nullable|string',
            'status'      => 'sometimes|required|string|in:ordered,received,cancelled',
            'notes'       => 'nullable|string',
        ]);

        $purchase->update($data);

        return $this->successResponse($purchase, 'Purchase updated successfully');
    }

    /**
     * DELETE /api/v1/purchases/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $purchase = Purchase::findOrFail($id);
        $purchase->delete();

        return $this->successResponse(null, 'Purchase deleted successfully');
    }
}
