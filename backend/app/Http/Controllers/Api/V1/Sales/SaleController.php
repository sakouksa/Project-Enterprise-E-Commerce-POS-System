<?php

namespace App\Http\Controllers\Api\V1\Sales;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Sales\Sale;
use App\Models\Sales\SaleItem;
use App\Models\Product\Product;
use App\Models\Product\ProductVariant;
use App\Models\Marketing\Coupon;
use App\Models\Inventory\Inventory;
use App\Models\Inventory\InventoryMovement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SaleController extends BaseApiController
{
    /**
     * GET /api/v1/sales
     */
    public function index(Request $request): JsonResponse
    {
        $sales = Sale::with(['customer', 'cashier', 'items.product'])
            ->when($request->search, function($q, $v) {
                $q->where(function($sub) use ($v) {
                    $sub->where('invoice_number', 'like', "%{$v}%")
                        ->orWhereHas('customer', fn($c) => $c->where('name', 'like', "%{$v}%")->orWhere('phone', 'like', "%{$v}%"));
                });
            })
            ->when($request->status, fn($q, $v) => $q->where('status', $v))
            ->when($request->payment_status, fn($q, $v) => $q->where('payment_status', $v))
            ->when($request->payment_method, fn($q, $v) => $q->where('payment_method', $v))
            ->when($request->date_from ?? $request->start_date, fn($q, $v) => $q->whereDate('date', '>=', $v))
            ->when($request->date_to ?? $request->end_date, fn($q, $v) => $q->whereDate('date', '<=', $v))
            ->when($request->min_total, fn($q, $v) => $q->where('grand_total', '>=', (float)$v))
            ->when($request->max_total, fn($q, $v) => $q->where('grand_total', '<=', (float)$v))
            ->latest()
            ->paginate($request->integer('per_page', 12));

        return $this->paginatedResponse($sales);
    }

    /**
     * POST /api/v1/sales - Process POS Checkout & Create Sale Invoice
     */
    public function store(Request $request): JsonResponse
    {
        $subtotalInput = $request->input('subtotal') ?? $request->input('sub_total');
        $taxInput = $request->input('tax_amount') ?? $request->input('vat_amount') ?? 0;
        $totalInput = $request->input('grand_total') ?? $request->input('total_amount');

        $request->merge([
            'subtotal'    => $subtotalInput,
            'tax_amount' => $taxInput,
            'grand_total' => $totalInput,
        ]);

        $validated = $request->validate([
            'customer_id'                => 'nullable|integer',
            'payment_status'             => 'nullable|string',
            'payment_method'             => 'nullable|string',
            'payment_details'            => 'nullable|array',
            'coupon_code'                => 'nullable|string',
            'subtotal'                   => 'required|numeric|min:0',
            'discount_amount'            => 'nullable|numeric|min:0',
            'tax_amount'                 => 'nullable|numeric|min:0',
            'grand_total'                => 'required|numeric|min:0',
            'paid_amount'                => 'nullable|numeric|min:0',
            'items'                      => 'required|array|min:1',
            'items.*.product_id'         => 'required|integer',
            'items.*.product_variant_id' => 'nullable|integer',
            'items.*.quantity'           => 'nullable|numeric|min:0.01',
            'items.*.qty'                => 'nullable|numeric|min:0.01',
            'items.*.unit_price'         => 'nullable|numeric|min:0',
            'items.*.price'              => 'nullable|numeric|min:0',
            'items.*.discount_amount'    => 'nullable|numeric|min:0',
            'items.*.total'              => 'nullable|numeric|min:0',
        ]);

        $user = auth()->user();
        $invoiceNumber = 'POS-' . date('Ymd') . '-' . strtoupper(Str::random(6));

        $sale = DB::transaction(function () use ($validated, $user, $invoiceNumber) {
            $subtotal = (float) $validated['subtotal'];
            $discount = (float) ($validated['discount_amount'] ?? 0);
            $tax = (float) ($validated['tax_amount'] ?? 0);
            $grandTotal = (float) $validated['grand_total'];
            $paidAmount = (float) ($validated['paid_amount'] ?? $grandTotal);
            $changeAmount = max(0, $paidAmount - $grandTotal);

            $paymentDetails = $validated['payment_details'] ?? null;
            $paymentMethod = $validated['payment_method'] ?? 'card';

            $notesText = 'POS Terminal Transaction';
            if ($paymentDetails) {
                $bank = $paymentDetails['bank_name'] ?? 'Bank';
                if (!empty($paymentDetails['txn_reference'])) {
                    $ref = $paymentDetails['txn_reference'];
                    $acc = $paymentDetails['account_number'] ?? '';
                    $notesText .= " | Bank Transfer: {$bank} (Acc: {$acc}), Txn Ref: #{$ref}";
                } else {
                    $card = $paymentDetails['card_type'] ?? 'Card';
                    $code = $paymentDetails['approval_code'] ?? '';
                    $notesText .= " | Card Payment: {$card} ({$bank}), Approval Code: {$code}";
                }
            }

            // 1. Create Sale Header
            $sale = Sale::create([
                'company_id'      => $user->company_id ?? 1,
                'branch_id'       => $user->branch_id ?? 1,
                'store_id'        => $user->store_id ?? 1,
                'warehouse_id'    => $user->warehouse_id ?? 1,
                'customer_id'     => array_key_exists('customer_id', $validated) ? $validated['customer_id'] : null,
                'user_id'         => $user->id ?? 1,
                'invoice_number'  => $invoiceNumber,
                'date'            => now(),
                'status'          => 'completed',
                'subtotal'        => $subtotal,
                'tax_amount'      => $tax,
                'discount_amount' => $discount,
                'grand_total'     => $grandTotal,
                'paid_amount'     => $paidAmount,
                'change_amount'   => $changeAmount,
                'currency_code'   => 'USD',
                'payment_method'  => $paymentMethod,
                'payment_details' => $paymentDetails,
                'notes'           => $notesText,
            ]);

            // 2. Create Sale Items, Deduct Inventory Stock & Record Inventory Movement
            foreach ($validated['items'] as $itemData) {
                $productId = (int) $itemData['product_id'];
                $variantId = !empty($itemData['product_variant_id']) ? (int) $itemData['product_variant_id'] : null;
                $quantity  = (float) ($itemData['quantity'] ?? $itemData['qty'] ?? 1);
                $unitPrice = (float) ($itemData['unit_price'] ?? $itemData['price'] ?? 0);
                $itemTotal = (float) ($itemData['total'] ?? ($unitPrice * $quantity));

                $product = Product::find($productId);
                $variant = $variantId ? ProductVariant::find($variantId) : null;

                SaleItem::create([
                    'sale_id'            => $sale->id,
                    'product_id'         => $productId,
                    'product_variant_id' => $variantId,
                    'product_name'       => $product->name ?? ('Product #' . $productId),
                    'sku'                => $variant->sku ?? $product->sku ?? ('SKU-' . $productId),
                    'quantity'           => $quantity,
                    'unit_price'         => $unitPrice,
                    'discount_amount'    => (float) ($itemData['discount_amount'] ?? 0),
                    'subtotal'           => (float) ($unitPrice * $quantity),
                    'total'              => (float) $itemTotal,
                ]);

                // Query or initialize Inventory record for warehouse + product
                $inventory = Inventory::where('warehouse_id', $sale->warehouse_id)
                    ->where('product_id', $productId)
                    ->when($variantId, fn($q) => $q->where('product_variant_id', $variantId), fn($q) => $q->whereNull('product_variant_id'))
                    ->first();

                if (!$inventory) {
                    $inventory = Inventory::where('product_id', $productId)
                        ->when($variantId, fn($q) => $q->where('product_variant_id', $variantId))
                        ->first();
                }

                $qtyBefore = $inventory ? (float) $inventory->quantity : (float) ($product->stock ?? 100);
                $qtyAfter  = max(0, $qtyBefore - $quantity);

                if ($inventory) {
                    $inventory->quantity = $qtyAfter;
                    $inventory->save();
                } else {
                    $inventory = Inventory::create([
                        'company_id'         => $sale->company_id,
                        'warehouse_id'       => $sale->warehouse_id,
                        'product_id'         => $productId,
                        'product_variant_id' => $variantId,
                        'quantity'           => $qtyAfter,
                        'reserved_quantity'  => 0,
                    ]);
                }

                // Create Inventory Movement Record
                InventoryMovement::create([
                    'company_id'         => $sale->company_id,
                    'warehouse_id'       => $sale->warehouse_id,
                    'product_id'         => $productId,
                    'product_variant_id' => $variantId,
                    'user_id'            => $sale->user_id,
                    'reference_type'     => 'sale',
                    'reference_id'       => $sale->id,
                    'type'               => 'out',
                    'quantity'           => -$quantity,
                    'quantity_before'    => $qtyBefore,
                    'quantity_after'     => $qtyAfter,
                    'unit_cost'          => $unitPrice,
                    'notes'              => "POS Checkout Invoice #{$sale->invoice_number}",
                ]);

                // Update product stock and sold count
                if ($product) {
                    if (isset($product->stock)) {
                        $product->decrement('stock', (int) ceil($quantity));
                    }
                    $product->increment('sold_count', (int) ceil($quantity));
                }
                if ($variant && isset($variant->stock)) {
                    $variant->decrement('stock', (int) ceil($quantity));
                }
            }

            // 3. Increment Coupon usage count if coupon applied
            if (!empty($validated['coupon_code'])) {
                $couponCode = strtoupper(trim($validated['coupon_code']));
                $coupon = Coupon::where('code', $couponCode)->first();
                if ($coupon) {
                    $coupon->increment('used_count');
                }
            }

            return $sale;
        });

        $sale->load(['items.product', 'customer', 'cashier']);

        return $this->successResponse([
            'reference_no' => $sale->invoice_number,
            'sale'         => $sale,
        ], 'Sale processed successfully.', 201);
    }

    /**
     * GET /api/v1/sales/{id}
     */
    public function show(int $id): JsonResponse
    {
        $sale = Sale::with(['customer', 'cashier', 'items.product'])->findOrFail($id);
        return $this->successResponse($sale);
    }

    /**
     * DELETE /api/v1/sales/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $sale = Sale::findOrFail($id);
        $sale->delete();
        return $this->successResponse(null, 'Sale invoice deleted successfully.');
    }
}
