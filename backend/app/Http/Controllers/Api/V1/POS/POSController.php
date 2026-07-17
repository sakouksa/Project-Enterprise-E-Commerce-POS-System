<?php

namespace App\Http\Controllers\Api\V1\POS;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Sales\Sale;
use App\Models\Product\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class POSController extends BaseApiController
{
    /**
     * GET /api/v1/pos/sales
     */
    public function index(Request $request): JsonResponse
    {
        $sales = Sale::with(['customer', 'cashier'])
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return $this->paginatedResponse($sales);
    }

    /**
     * GET /api/v1/pos/sales/{id}
     */
    public function show(int $id): JsonResponse
    {
        $sale = Sale::with(['customer', 'cashier', 'items.product'])->findOrFail($id);
        return $this->successResponse($sale);
    }

    /**
     * POST /api/v1/pos/sales
     */
    public function sale(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id'      => 'required|exists:companies,id',
            'branch_id'       => 'required|exists:branches,id',
            'store_id'        => 'required|exists:stores,id',
            'warehouse_id'    => 'required|exists:warehouses,id',
            'customer_id'     => 'nullable|exists:customers,id',
            'invoice_number'  => 'required|string|unique:sales,invoice_number',
            'subtotal'        => 'required|numeric',
            'tax_amount'      => 'required|numeric',
            'discount_amount' => 'required|numeric',
            'grand_total'     => 'required|numeric',
            'paid_amount'     => 'required|numeric',
            'change_amount'   => 'required|numeric',
            'items'           => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|numeric|min:0.0001',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $sale = DB::transaction(function () use ($data) {
            $items = $data['items'];
            unset($data['items']);

            $data['user_id'] = auth()->id() ?? 1;
            $data['date']    = now();
            $data['status']  = 'completed';
            $sale = Sale::create($data);

            foreach ($items as $item) {
                $item['total'] = $item['quantity'] * $item['unit_price'];
                $item['product_name'] = Product::find($item['product_id'])?->name ?? 'Product';
                $item['sku'] = Product::find($item['product_id'])?->sku ?? 'SKU';
                $sale->items()->create($item);

                // Reduce inventory if track inventory is true
                $product = Product::find($item['product_id']);
                if ($product && $product->track_inventory) {
                    $inv = \App\Models\Inventory\Inventory::where('warehouse_id', $data['warehouse_id'])
                        ->where('product_id', $product->id)
                        ->first();
                    if ($inv) {
                        $inv->decrement('quantity', $item['quantity']);
                    }
                }
            }

            return $sale;
        });

        return $this->successResponse($sale->load('items'), 'POS Transaction completed successfully', 201);
    }
}
