<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Inventory\StockTransfer;
use App\Models\Inventory\StockTransferItem;
use App\Models\Inventory\Inventory;
use App\Models\Inventory\InventoryMovement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class StockTransferController extends BaseApiController
{
    /**
     * GET /api/v1/stock-transfers
     */
    public function index(Request $request): JsonResponse
    {
        $transfers = StockTransfer::with(['fromWarehouse', 'toWarehouse', 'user', 'items.product', 'items.variant'])
            ->when($request->search, function ($q, $search) {
                $q->where('reference_number', 'like', "%{$search}%");
            })
            ->paginate($request->integer('per_page', 15));

        return $this->paginatedResponse($transfers);
    }

    /**
     * POST /api/v1/stock-transfers
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'from_warehouse_id' => 'required|exists:warehouses,id',
            'to_warehouse_id'   => 'required|exists:warehouses,id|different:from_warehouse_id',
            'items'             => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity'   => 'required|numeric|min:0.0001',
            'notes'             => 'nullable|string',
        ]);

        $refNumber = 'TRF-' . date('Ymd') . '-' . mt_rand(1000, 9999);

        $transfer = DB::transaction(function () use ($validated, $refNumber) {
            $tr = StockTransfer::create([
                'company_id'        => 1,
                'from_warehouse_id' => $validated['from_warehouse_id'],
                'to_warehouse_id'   => $validated['to_warehouse_id'],
                'user_id'           => Auth::id() ?? 1,
                'reference_number'  => $refNumber,
                'date'              => date('Y-m-d'),
                'notes'             => $validated['notes'] ?? '',
                'status'            => 'received', // Auto-process to complete transfer directly for ease-of-use
                'shipped_at'        => now(),
                'received_at'       => now(),
            ]);

            foreach ($validated['items'] as $item) {
                $productId = $item['product_id'];
                $variantId = $item['variant_id'] ?? null;
                $quantity = $item['quantity'];

                // Deduct from source warehouse
                $fromInv = Inventory::where([
                    'warehouse_id'       => $validated['from_warehouse_id'],
                    'product_id'         => $productId,
                    'product_variant_id' => $variantId,
                ])->first();

                $fromBefore = $fromInv ? $fromInv->quantity : 0;
                $fromAfter = $fromBefore - $quantity;

                if ($fromInv) {
                    $fromInv->update(['quantity' => $fromAfter]);
                } else {
                    Inventory::create([
                        'company_id'         => 1,
                        'warehouse_id'       => $validated['from_warehouse_id'],
                        'product_id'         => $productId,
                        'product_variant_id' => $variantId,
                        'quantity'           => $fromAfter,
                        'reserved_quantity'  => 0,
                    ]);
                }

                // Add to destination warehouse
                $toInv = Inventory::where([
                    'warehouse_id'       => $validated['to_warehouse_id'],
                    'product_id'         => $productId,
                    'product_variant_id' => $variantId,
                ])->first();

                $toBefore = $toInv ? $toInv->quantity : 0;
                $toAfter = $toBefore + $quantity;

                if ($toInv) {
                    $toInv->update(['quantity' => $toAfter]);
                } else {
                    Inventory::create([
                        'company_id'         => 1,
                        'warehouse_id'       => $validated['to_warehouse_id'],
                        'product_id'         => $productId,
                        'product_variant_id' => $variantId,
                        'quantity'           => $toAfter,
                        'reserved_quantity'  => 0,
                    ]);
                }

                // Create transfer items
                StockTransferItem::create([
                    'stock_transfer_id'  => $tr->id,
                    'product_id'         => $productId,
                    'product_variant_id' => $variantId,
                    'quantity_requested' => $quantity,
                    'quantity_sent'      => $quantity,
                    'quantity_received'  => $quantity,
                    'notes'              => $validated['notes'] ?? null,
                ]);

                // Record source movement (out)
                InventoryMovement::create([
                    'company_id'         => 1,
                    'warehouse_id'       => $validated['from_warehouse_id'],
                    'product_id'         => $productId,
                    'product_variant_id' => $variantId,
                    'user_id'            => Auth::id() ?? 1,
                    'reference_type'     => StockTransfer::class,
                    'reference_id'       => $tr->id,
                    'type'               => 'transfer_out',
                    'quantity'           => -$quantity,
                    'quantity_before'    => $fromBefore,
                    'quantity_after'     => $fromAfter,
                    'notes'              => "Transfer to warehouse " . $validated['to_warehouse_id'],
                ]);

                // Record destination movement (in)
                InventoryMovement::create([
                    'company_id'         => 1,
                    'warehouse_id'       => $validated['to_warehouse_id'],
                    'product_id'         => $productId,
                    'product_variant_id' => $variantId,
                    'user_id'            => Auth::id() ?? 1,
                    'reference_type'     => StockTransfer::class,
                    'reference_id'       => $tr->id,
                    'type'               => 'transfer_in',
                    'quantity'           => $quantity,
                    'quantity_before'    => $toBefore,
                    'quantity_after'     => $toAfter,
                    'notes'              => "Transfer from warehouse " . $validated['from_warehouse_id'],
                ]);
            }

            return $tr;
        });

        return $this->successResponse($transfer, 'Stock transfer completed successfully', 201);
    }
}
