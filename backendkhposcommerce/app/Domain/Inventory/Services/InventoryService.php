<?php

namespace App\Domain\Inventory\Services;

use App\Models\Inventory\Inventory;
use App\Models\Inventory\InventoryMovement;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class InventoryService
{
    /**
     * Increment or decrement inventory stock and record an immutable inventory movement log.
     */
    public function adjustStock(
        int $companyId,
        int $warehouseId,
        int $productId,
        ?int $variantId,
        float $qtyChange,
        string $movementType,
        ?string $referenceType = null,
        ?int $referenceId = null,
        ?float $unitCost = null,
        ?string $notes = null,
        ?int $userId = null
    ): Inventory {
        return DB::transaction(function () use (
            $companyId,
            $warehouseId,
            $productId,
            $variantId,
            $qtyChange,
            $movementType,
            $referenceType,
            $referenceId,
            $unitCost,
            $notes,
            $userId
        ) {
            // Lock row for update to prevent race conditions
            $inventory = Inventory::where('warehouse_id', $warehouseId)
                ->where('product_id', $productId)
                ->where('product_variant_id', $variantId)
                ->lockForUpdate()
                ->first();

            if (!$inventory) {
                $inventory = new Inventory([
                    'company_id'         => $companyId,
                    'warehouse_id'       => $warehouseId,
                    'product_id'         => $productId,
                    'product_variant_id' => $variantId,
                    'quantity'           => 0,
                    'reserved_quantity'  => 0,
                    'reorder_point'      => 0,
                    'reorder_qty'        => 0,
                ]);
            }

            $beforeQty = (float) $inventory->quantity;
            $afterQty  = $beforeQty + $qtyChange;

            $inventory->quantity = $afterQty;
            $inventory->save();

            // Record Movement History
            InventoryMovement::create([
                'company_id'         => $companyId,
                'warehouse_id'       => $warehouseId,
                'product_id'         => $productId,
                'product_variant_id' => $variantId,
                'user_id'            => $userId ?: auth()->id(),
                'reference_type'     => $referenceType,
                'reference_id'       => $referenceId,
                'type'               => $movementType,
                'quantity'           => abs($qtyChange),
                'quantity_before'    => $beforeQty,
                'quantity_after'     => $afterQty,
                'unit_cost'          => $unitCost,
                'notes'              => $notes,
            ]);

            return $inventory;
        });
    }

    /**
     * Get available physical stock (quantity minus reserved quantity).
     */
    public function getAvailableStock(int $warehouseId, int $productId, ?int $variantId = null): float
    {
        $inventory = Inventory::where('warehouse_id', $warehouseId)
            ->where('product_id', $productId)
            ->where('product_variant_id', $variantId)
            ->first();

        if (!$inventory) {
            return 0.0;
        }

        return max(0.0, (float) $inventory->quantity - (float) $inventory->reserved_quantity);
    }

    /**
     * Check if warehouse has sufficient available stock.
     */
    public function checkStockAvailability(int $warehouseId, int $productId, ?int $variantId, float $requiredQty): bool
    {
        return $this->getAvailableStock($warehouseId, $productId, $variantId) >= $requiredQty;
    }

    /**
     * Reserve stock for pending orders.
     */
    public function reserveStock(int $warehouseId, int $productId, ?int $variantId, float $quantity): bool
    {
        return DB::transaction(function () use ($warehouseId, $productId, $variantId, $quantity) {
            $inventory = Inventory::where('warehouse_id', $warehouseId)
                ->where('product_id', $productId)
                ->where('product_variant_id', $variantId)
                ->lockForUpdate()
                ->first();

            if (!$inventory) {
                return false;
            }

            $available = (float) $inventory->quantity - (float) $inventory->reserved_quantity;
            if ($available < $quantity) {
                return false;
            }

            $inventory->reserved_quantity = (float) $inventory->reserved_quantity + $quantity;
            $inventory->save();

            return true;
        });
    }

    /**
     * Release previously reserved stock.
     */
    public function releaseReservedStock(int $warehouseId, int $productId, ?int $variantId, float $quantity): void
    {
        DB::transaction(function () use ($warehouseId, $productId, $variantId, $quantity) {
            $inventory = Inventory::where('warehouse_id', $warehouseId)
                ->where('product_id', $productId)
                ->where('product_variant_id', $variantId)
                ->lockForUpdate()
                ->first();

            if ($inventory) {
                $inventory->reserved_quantity = max(0.0, (float) $inventory->reserved_quantity - $quantity);
                $inventory->save();
            }
        });
    }
}
