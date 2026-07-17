<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Inventory\StockAdjustment;
use App\Models\Inventory\StockAdjustmentItem;
use App\Models\Inventory\Inventory;
use App\Models\Inventory\InventoryMovement;
use App\Http\Resources\Inventory\StockAdjustmentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class StockAdjustmentController extends BaseApiController
{
    /**
     * GET /api/v1/stock-adjustments
     */
    public function index(Request $request): JsonResponse
    {
        $adjustments = StockAdjustment::with(['warehouse', 'user', 'items.product', 'items.variant'])
            ->when($request->search, function ($q, $search) {
                $q->where('reference_number', 'like', "%{$search}%")
                  ->orWhere('reason', 'like', "%{$search}%");
            })
            ->paginate($request->integer('per_page', 10));

        $resourceCollection = StockAdjustmentResource::collection($adjustments);

        return response()->json([
            'success'    => true,
            'message'    => 'Success',
            'data'       => $resourceCollection->resolve(),
            'pagination' => [
                'total'        => $adjustments->total(),
                'per_page'     => $adjustments->perPage(),
                'current_page' => $adjustments->currentPage(),
                'last_page'    => $adjustments->lastPage(),
                'from'         => $adjustments->firstItem(),
                'to'           => $adjustments->lastItem(),
            ],
        ]);
    }

    /**
     * POST /api/v1/stock-adjustments
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'type'         => 'required|in:addition,subtraction,recount',
            'reason'       => 'nullable|string',
            'notes'        => 'nullable|string',
            'product_id'   => 'required|exists:products,id',
            'variant_id'   => 'nullable|exists:product_variants,id',
            'quantity'     => 'required|numeric|min:0.0001',
        ]);

        $refNumber = 'ADJ-' . date('Ymd') . '-' . mt_rand(1000, 9999);

        $adjustment = DB::transaction(function () use ($validated, $refNumber) {
            $adj = StockAdjustment::create([
                'company_id'       => 1,
                'warehouse_id'     => $validated['warehouse_id'],
                'user_id'          => Auth::id() ?? 1,
                'reference_number' => $refNumber,
                'date'             => date('Y-m-d'),
                'type'             => $validated['type'],
                'reason'           => $validated['reason'] ?? $validated['notes'] ?? '',
                'status'           => 'approved', // Auto-approve to make adjustment immediate for POS/ERP flow
                'approved_by'      => Auth::id() ?? 1,
                'approved_at'      => now(),
            ]);

            // Query current stock levels
            $currentStock = Inventory::where([
                'warehouse_id'       => $validated['warehouse_id'],
                'product_id'         => $validated['product_id'],
                'product_variant_id' => $validated['variant_id'] ?? null,
            ])->first();

            $qtyBefore = $currentStock ? $currentStock->quantity : 0;
            $qtyAdjusted = $validated['quantity'];

            if ($validated['type'] === 'subtraction') {
                $qtyAfter = $qtyBefore - $qtyAdjusted;
            } else if ($validated['type'] === 'recount') {
                $qtyAfter = $qtyAdjusted;
                $qtyAdjusted = $qtyAfter - $qtyBefore;
            } else {
                $qtyAfter = $qtyBefore + $qtyAdjusted;
            }

            // Create adjustment item
            StockAdjustmentItem::create([
                'stock_adjustment_id' => $adj->id,
                'product_id'          => $validated['product_id'],
                'product_variant_id'  => $validated['variant_id'] ?? null,
                'quantity_before'     => $qtyBefore,
                'quantity_adjusted'   => $qtyAdjusted,
                'quantity_after'      => $qtyAfter,
                'notes'               => $validated['reason'] ?? null,
            ]);

            // Update or Create Inventory record
            if ($currentStock) {
                $currentStock->update(['quantity' => $qtyAfter]);
            } else {
                Inventory::create([
                    'company_id'         => 1,
                    'warehouse_id'       => $validated['warehouse_id'],
                    'product_id'         => $validated['product_id'],
                    'product_variant_id' => $validated['variant_id'] ?? null,
                    'quantity'           => $qtyAfter,
                    'reserved_quantity'  => 0,
                ]);
            }

            // Record movement
            InventoryMovement::create([
                'company_id'         => 1,
                'warehouse_id'       => $validated['warehouse_id'],
                'product_id'         => $validated['product_id'],
                'product_variant_id' => $validated['variant_id'] ?? null,
                'user_id'            => Auth::id() ?? 1,
                'reference_type'     => StockAdjustment::class,
                'reference_id'       => $adj->id,
                'type'               => 'adjustment',
                'quantity'           => $qtyAdjusted,
                'quantity_before'    => $qtyBefore,
                'quantity_after'     => $qtyAfter,
                'notes'              => $validated['reason'] ?? 'Stock adjustment auto-approved',
            ]);

            return $adj;
        });

        return $this->successResponse(new StockAdjustmentResource($adjustment), 'Stock adjustment processed successfully', 201);
    }

    /**
     * POST /api/v1/stock-adjustments/{id}/approve
     */
    public function approve(int $id): JsonResponse
    {
        $adjustment = StockAdjustment::findOrFail($id);
        if ($adjustment->status === 'approved') {
            return $this->errorResponse('Adjustment is already approved.');
        }

        DB::transaction(function () use ($adjustment) {
            $adjustment->update([
                'status'      => 'approved',
                'approved_by' => Auth::id() ?? 1,
                'approved_at' => now(),
            ]);

            foreach ($adjustment->items as $item) {
                // Update stock levels
                $currentStock = Inventory::where([
                    'warehouse_id'       => $adjustment->warehouse_id,
                    'product_id'         => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                ])->first();

                $qtyBefore = $currentStock ? $currentStock->quantity : 0;
                $qtyAfter = $qtyBefore + $item->quantity_adjusted;

                if ($currentStock) {
                    $currentStock->update(['quantity' => $qtyAfter]);
                } else {
                    Inventory::create([
                        'company_id'         => 1,
                        'warehouse_id'       => $adjustment->warehouse_id,
                        'product_id'         => $item->product_id,
                        'product_variant_id' => $item->product_variant_id,
                        'quantity'           => $qtyAfter,
                        'reserved_quantity'  => 0,
                    ]);
                }

                // Record movement
                InventoryMovement::create([
                    'company_id'         => 1,
                    'warehouse_id'       => $adjustment->warehouse_id,
                    'product_id'         => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'user_id'            => Auth::id() ?? 1,
                    'reference_type'     => StockAdjustment::class,
                    'reference_id'       => $adjustment->id,
                    'type'               => 'adjustment',
                    'quantity'           => $item->quantity_adjusted,
                    'quantity_before'    => $qtyBefore,
                    'quantity_after'     => $qtyAfter,
                    'notes'              => 'Stock adjustment approved',
                ]);
            }
        });

        return $this->successResponse(new StockAdjustmentResource($adjustment), 'Stock adjustment approved successfully');
    }
}
