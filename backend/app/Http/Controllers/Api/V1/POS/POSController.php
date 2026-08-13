<?php

namespace App\Http\Controllers\Api\V1\POS;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Sales\Sale;
use App\Models\Sales\SaleItem;
use App\Models\Sales\SaleReturn;
use App\Models\Sales\SaleReturnItem;
use App\Models\Product\Product;
use App\Models\Inventory\Inventory;
use App\Models\Inventory\InventoryMovement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class POSController extends BaseApiController
{
    // ─── Generate a unique invoice number ────────────────────────────────────
    private function generateInvoiceNumber(): string
    {
        $prefix = 'INV-' . now()->format('Ymd') . '-';
        do {
            $number = $prefix . strtoupper(Str::random(6));
        } while (Sale::where('invoice_number', $number)->exists());

        return $number;
    }

    // ─── GET /api/v1/pos/sales ────────────────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        $sales = Sale::with(['customer:id,name,phone', 'cashier:id,name'])
            ->when($request->filled('date'), fn($q) => $q->whereDate('date', $request->date))
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->latest('date')
            ->paginate($request->integer('per_page', 15));

        return $this->paginatedResponse($sales);
    }

    // ─── GET /api/v1/pos/sales/{id} ───────────────────────────────────────────
    public function show(int $id): JsonResponse
    {
        $sale = Sale::with([
            'customer:id,name,phone,email',
            'cashier:id,name',
            'items.product:id,name,sku',
            'items.variant:id,name,sku',
        ])->findOrFail($id);

        return $this->successResponse($sale);
    }

    // ─── GET /api/v1/pos/product-search ──────────────────────────────────────
    public function productSearch(Request $request): JsonResponse
    {
        $query   = $request->get('q', $request->get('search', ''));
        $warehouseId = $request->get('warehouse_id');

        $products = Product::with([
            'primaryImage',
            'images:id,product_id,image,is_primary',
            'category:id,name',
            'brand:id,name',
            'tax:id,name,rate,type',
            'variants:id,product_id,name,sku,barcode,selling_price,cost_price,image',
            'inventories',
        ])
        ->where('status', 'active')
        ->when(trim($query) !== '', function ($q) use ($query) {
            $q->search($query);
        })
        ->withSum('inventories as stock', 'quantity')
        ->limit(30)
        ->get();

        return $this->successResponse($products);
    }

    // ─── POST /api/v1/pos/apply-coupon ───────────────────────────────────────
    public function applyCoupon(Request $request): JsonResponse
    {
        $request->validate([
            'code'   => 'required|string',
            'amount' => 'required|numeric|min:0',
        ]);

        $code   = strtoupper(trim($request->code));
        $amount = (float) $request->amount;

        // Look up in marketing coupons table if it exists
        $couponTable = DB::getSchemaBuilder()->hasTable('coupons');
        if ($couponTable) {
            $coupon = DB::table('coupons')
                ->where('code', $code)
                ->where('is_active', true)
                ->where(function ($q) {
                    $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
                })
                ->first();

            if ($coupon) {
                $discount = $coupon->type === 'percentage'
                    ? round($amount * ($coupon->value / 100), 2)
                    : min((float) $coupon->value, $amount);

                return $this->successResponse([
                    'code'     => $coupon->code,
                    'type'     => $coupon->type,
                    'value'    => $coupon->value,
                    'discount' => $discount,
                ], 'Coupon applied successfully');
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid or expired coupon code.',
        ], 422);
    }

    // ─── POST /api/v1/pos/sales ───────────────────────────────────────────────
    public function sale(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id'      => 'nullable|exists:companies,id',
            'branch_id'       => 'nullable|exists:branches,id',
            'store_id'        => 'nullable|exists:stores,id',
            'warehouse_id'    => 'nullable|exists:warehouses,id',
            'customer_id'     => 'nullable|exists:customers,id',
            'invoice_number'  => 'nullable|string|unique:sales,invoice_number',
            'subtotal'        => 'required|numeric|min:0',
            'tax_amount'      => 'required|numeric|min:0',
            'discount_amount' => 'required|numeric|min:0',
            'grand_total'     => 'required|numeric|min:0',
            'paid_amount'     => 'required|numeric|min:0',
            'change_amount'   => 'required|numeric|min:0',
            'payment_method'  => 'nullable|string',
            'payment_details' => 'nullable|array',
            'coupon_code'     => 'nullable|string',
            'notes'           => 'nullable|string',
            'items'           => 'required|array|min:1',
            'items.*.product_id'         => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity'           => 'required|numeric|min:0.0001',
            'items.*.unit_price'         => 'required|numeric|min:0',
            'items.*.cost_price'         => 'nullable|numeric|min:0',
            'items.*.discount_amount'    => 'nullable|numeric|min:0',
            'items.*.tax_percent'        => 'nullable|numeric|min:0',
            'items.*.tax_amount'         => 'nullable|numeric|min:0',
        ]);

        $sale = DB::transaction(function () use ($data, $request) {
            $authUser  = auth()->user();
            $companyId = $data['company_id'] ?? $authUser?->company_id ?? 1;

            // Resolve IDs — default to first available record if not provided
            $branchId    = $data['branch_id']    ?? DB::table('branches')->where('company_id', $companyId)->value('id') ?? 1;
            $warehouseId = $data['warehouse_id'] ?? DB::table('warehouses')->where('company_id', $companyId)->value('id') ?? 1;
            $storeId     = $data['store_id']     ?? DB::table('stores')->where('company_id', $companyId)->value('id');

            // Auto-generate invoice number if not provided
            $invoiceNumber = $data['invoice_number'] ?? $this->generateInvoiceNumber();

            // Eager-load all products to avoid N+1
            $productIds  = collect($data['items'])->pluck('product_id')->unique()->toArray();
            $productsMap = Product::with('tax')
                ->whereIn('id', $productIds)
                ->get()
                ->keyBy('id');

            // Ensure PostgreSQL primary key sequences are synced before creating sale record
            try {
                $maxSalesId = DB::table('sales')->max('id') ?: 1;
                DB::statement("SELECT setval(pg_get_serial_sequence('sales', 'id'), {$maxSalesId})");
            } catch (\Throwable $e) {
                // Ignore if not PostgreSQL or sequence unavailable
            }

            // Create the sale record
            $sale = Sale::create([
                'company_id'      => $companyId,
                'branch_id'       => $branchId,
                'store_id'        => $storeId,
                'warehouse_id'    => $warehouseId,
                'customer_id'     => $data['customer_id'] ?? null,
                'user_id'         => $authUser?->id,
                'invoice_number'  => $invoiceNumber,
                'date'            => now(),
                'status'          => 'completed',
                'subtotal'        => $data['subtotal'],
                'tax_amount'      => $data['tax_amount'],
                'discount_amount' => $data['discount_amount'],
                'grand_total'     => $data['grand_total'],
                'paid_amount'     => $data['paid_amount'],
                'change_amount'   => $data['change_amount'],
                'payment_method'  => $data['payment_method'] ?? 'cash',
                'payment_details' => $data['payment_details'] ?? null,
                'notes'           => $data['notes'] ?? null,
                'currency_code'   => 'USD',
            ]);

            // Process each sale item
            foreach ($data['items'] as $item) {
                $product   = $productsMap[$item['product_id']];
                $variantId = $item['product_variant_id'] ?? null;
                $qty       = (float) $item['quantity'];
                $unitPrice = (float) $item['unit_price'];
                $costPrice = (float) ($item['cost_price'] ?? $product->cost_price ?? 0);
                $discAmt   = (float) ($item['discount_amount'] ?? 0);

                // Calculate per-item tax from product tax if not provided
                $taxRate = 0;
                if ($product->tax) {
                    $taxRate = $product->tax->type === 'percentage'
                        ? (float) $product->tax->rate
                        : 0;
                }
                $taxPercent = (float) ($item['tax_percent'] ?? $taxRate);
                $lineSubtotal = ($unitPrice * $qty) - $discAmt;
                $taxAmount    = (float) ($item['tax_amount'] ?? round($lineSubtotal * ($taxPercent / 100), 2));
                $lineTotal    = $lineSubtotal + $taxAmount;

                $sale->items()->create([
                    'product_id'         => $product->id,
                    'product_variant_id' => $variantId,
                    'product_name'       => $product->name,
                    'sku'                => $product->sku,
                    'quantity'           => $qty,
                    'unit_price'         => $unitPrice,
                    'cost_price'         => $costPrice,
                    'discount_amount'    => $discAmt,
                    'tax_percent'        => $taxPercent,
                    'tax_amount'         => $taxAmount,
                    'subtotal'           => round($lineSubtotal, 2),
                    'total'              => round($lineTotal, 2),
                ]);

                // ── Decrease inventory stock ───────────────────────────────
                $inventory = Inventory::where('warehouse_id', $warehouseId)
                    ->where('product_id', $product->id)
                    ->when($variantId, fn($q) => $q->where('product_variant_id', $variantId))
                    ->first();

                $qtyBefore = $inventory ? (float) $inventory->quantity : 100.0;
                $qtyAfter  = max(0.0, $qtyBefore - $qty);

                if ($inventory) {
                    $inventory->decrement('quantity', $qty);
                } else {
                    // Initialize warehouse inventory with default initial stock (100) minus sold quantity
                    Inventory::create([
                        'company_id'         => $companyId,
                        'warehouse_id'       => $warehouseId,
                        'product_id'         => $product->id,
                        'product_variant_id' => $variantId,
                        'quantity'           => $qtyAfter,
                        'reserved_quantity'  => 0,
                    ]);
                }

                // ── Create inventory movement audit record ─────────────
                InventoryMovement::create([
                    'company_id'         => $companyId,
                    'warehouse_id'       => $warehouseId,
                    'product_id'         => $product->id,
                    'product_variant_id' => $variantId,
                    'user_id'            => $authUser?->id,
                    'reference_type'     => 'sale',
                    'reference_id'       => $sale->id,
                    'type'               => 'out',
                    'quantity'           => $qty,
                    'quantity_before'    => $qtyBefore,
                    'quantity_after'     => $qtyAfter,
                    'unit_cost'          => $unitPrice,
                    'notes'              => "POS Sale: {$invoiceNumber}",
                ]);

                // ── Increment product sold_count ───────────────────────────
                $product->increment('sold_count', (int) $qty);
            }

            return $sale;
        });

        return $this->successResponse(
            $sale->load(['items.product:id,name,sku', 'customer:id,name', 'cashier:id,name']),
            'POS Transaction completed successfully',
            201
        );
    }

    // ─── POST /api/v1/pos/sales/{id}/return ──────────────────────────────────
    public function processReturn(Request $request, int $id): JsonResponse
    {
        $sale = Sale::with('items')->findOrFail($id);

        if (!$request->has('items') || empty($request->input('items'))) {
            $defaultItems = [];
            foreach ($sale->items as $item) {
                $defaultItems[] = [
                    'sale_item_id'       => $item->id,
                    'product_id'         => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'quantity'           => (float) $item->quantity,
                ];
            }
            $request->merge(['items' => $defaultItems]);
        }

        $data = $request->validate([
            'reason'        => 'nullable|string',
            'refund_method' => 'nullable|string|in:cash,store_credit,original_payment',
            'items'         => 'required|array|min:1',
            'items.*.sale_item_id'       => 'required|exists:sale_items,id',
            'items.*.product_id'         => 'required|exists:products,id',
            'items.*.product_variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity'           => 'required|numeric|min:0.0001',
        ]);

        $saleReturn = DB::transaction(function () use ($id, $data) {
            $sale     = Sale::with('items')->findOrFail($id);
            $authUser = auth()->user();

            $refNumber = 'RET-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
            $totalRefund = 0;

            $saleReturn = SaleReturn::create([
                'company_id'       => $sale->company_id,
                'sale_id'          => $sale->id,
                'user_id'          => $authUser?->id,
                'reference_number' => $refNumber,
                'date'             => now(),
                'refund_method'    => $data['refund_method'] ?? 'cash',
                'reason'           => $data['reason'] ?? null,
                'status'           => 'approved',
            ]);

            foreach ($data['items'] as $item) {
                $saleItem = SaleItem::findOrFail($item['sale_item_id']);
                $qty      = (float) $item['quantity'];
                $unitPrice = (float) $saleItem->unit_price;
                $lineTotal = round($qty * $unitPrice, 2);
                $totalRefund += $lineTotal;

                SaleReturnItem::create([
                    'sale_return_id'     => $saleReturn->id,
                    'sale_item_id'       => $saleItem->id,
                    'product_id'         => $item['product_id'],
                    'product_variant_id' => $item['product_variant_id'] ?? null,
                    'quantity'           => $qty,
                    'unit_price'         => $unitPrice,
                    'total'              => $lineTotal,
                ]);

                // ── Restore inventory stock ──────────────────────────────
                $product = Product::find($item['product_id']);
                if ($product && $product->track_inventory) {
                    $inventory = Inventory::where('warehouse_id', $sale->warehouse_id)
                        ->where('product_id', $product->id)
                        ->when($item['product_variant_id'] ?? null, fn($q) => $q->where('product_variant_id', $item['product_variant_id']))
                        ->first();

                    $qtyBefore = $inventory ? (float) $inventory->quantity : 0;

                    if ($inventory) {
                        $inventory->increment('quantity', $qty);
                    } else {
                        Inventory::create([
                            'company_id'         => $sale->company_id,
                            'warehouse_id'       => $sale->warehouse_id,
                            'product_id'         => $product->id,
                            'product_variant_id' => $item['product_variant_id'] ?? null,
                            'quantity'           => $qty,
                        ]);
                    }

                    // ── Inventory movement for return ────────────────────
                    InventoryMovement::create([
                        'company_id'         => $sale->company_id,
                        'warehouse_id'       => $sale->warehouse_id,
                        'product_id'         => $product->id,
                        'product_variant_id' => $item['product_variant_id'] ?? null,
                        'user_id'            => $authUser?->id,
                        'reference_type'     => 'sale_return',
                        'reference_id'       => $saleReturn->id,
                        'type'               => 'in',
                        'quantity'           => $qty,
                        'quantity_before'    => $qtyBefore,
                        'quantity_after'     => $qtyBefore + $qty,
                        'unit_cost'          => $unitPrice,
                        'notes'              => "Sale Return: {$refNumber}",
                    ]);

                    // Decrement sold_count
                    $product->decrement('sold_count', (int) $qty);
                }
            }

            $saleReturn->update([
                'total_amount'  => $totalRefund,
                'refund_amount' => $totalRefund,
            ]);

            // Mark original sale as refunded if all items returned
            $sale->update(['status' => 'refunded']);

            return $saleReturn;
        });

        return $this->successResponse($saleReturn->load('items'), 'Sale return processed successfully', 201);
    }
}
