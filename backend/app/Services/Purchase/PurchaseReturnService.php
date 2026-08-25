<?php

namespace App\Services\Purchase;

use App\Repositories\Purchase\PurchaseReturnRepository;
use App\Models\Purchase\Purchase;
use App\Models\Purchase\PurchaseItem;
use App\Models\Purchase\PurchaseReturn;
use App\Models\Purchase\PurchaseReturnItem;
use App\Models\Inventory\Inventory;
use App\Models\Inventory\InventoryMovement;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PurchaseReturnService
{
    public function __construct(private readonly PurchaseReturnRepository $repository)
    {
    }

    public function getAll(array $relations = []): Collection
    {
        return $this->repository->all(relations: $relations);
    }

    public function getPaginated(int $perPage = 15, array $relations = []): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage, relations: $relations);
    }

    public function getById(int|string $id, array $relations = []): PurchaseReturn
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function createReturn(array $data): PurchaseReturn
    {
        return DB::transaction(function () use ($data) {
            $items = $data['items'];
            unset($data['items']);

            $purchase = Purchase::findOrFail($data['purchase_id']);

            $data['company_id'] = $purchase->company_id;
            $data['supplier_id'] = $purchase->supplier_id;
            $data['user_id'] = Auth::id() ?? 1;
            $data['reference_number'] = 'PR-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
            $data['date'] = $data['date'] ?? now()->toDateString();
            $data['status'] = 'draft';

            $totalAmount = 0;
            $itemsToCreate = [];

            foreach ($items as $item) {
                $purchaseItem = PurchaseItem::findOrFail($item['purchase_item_id']);
                $qty = (float)$item['quantity'];

                // Calculate already returned amount
                $alreadyReturned = PurchaseReturnItem::where('purchase_item_id', $purchaseItem->id)
                    ->whereHas('purchaseReturn', function ($query) {
                        $query->where('status', 'approved');
                    })->sum('quantity');

                $available = (float)$purchaseItem->quantity_received - (float)$alreadyReturned;

                if ($qty > $available) {
                    $productName = $purchaseItem->product->name ?? "Product #{$purchaseItem->product_id}";
                    throw new \Exception("Returned quantity ({$qty}) cannot exceed available return quantity ({$available}) for product: {$productName}");
                }

                $cost = (float)$item['unit_cost'];
                $itemTotal = $qty * $cost;

                $totalAmount += $itemTotal;

                $itemsToCreate[] = [
                    'purchase_item_id'   => $item['purchase_item_id'],
                    'product_id'         => $purchaseItem->product_id,
                    'product_variant_id' => $purchaseItem->product_variant_id,
                    'quantity'           => $qty,
                    'unit_cost'          => $cost,
                    'total'              => $itemTotal,
                    'notes'              => $item['notes'] ?? null,
                ];
            }

            $data['total_amount'] = $totalAmount;
            $return = PurchaseReturn::create($data);

            foreach ($itemsToCreate as $itemData) {
                $return->items()->create($itemData);
            }

            return $return;
        });
    }

    public function approveReturn(int $id): PurchaseReturn
    {
        return DB::transaction(function () use ($id) {
            $return = PurchaseReturn::with(['items', 'purchase'])->findOrFail($id);

            if ($return->status !== 'draft') {
                throw new \Exception('Only draft returns can be approved.');
            }

            // Update inventory
            foreach ($return->items as $item) {
                $inventory = Inventory::where([
                    'company_id'         => $return->company_id,
                    'warehouse_id'       => $return->purchase->warehouse_id,
                    'product_id'         => $item->product_id,
                    'product_variant_id' => $item->product_variant_id ?? null,
                ])->first();

                if (!$inventory || $inventory->quantity < $item->quantity) {
                    throw new \Exception("Insufficient stock in warehouse to process return for product ID: {$item->product_id}");
                }

                $qtyBefore = (float)$inventory->quantity;
                $qtyAfter = $qtyBefore - (float)$item->quantity;

                $inventory->update(['quantity' => $qtyAfter]);

                // Log movement
                InventoryMovement::create([
                    'company_id'         => $return->company_id,
                    'warehouse_id'       => $return->purchase->warehouse_id,
                    'product_id'         => $item->product_id,
                    'product_variant_id' => $item->product_variant_id ?? null,
                    'user_id'            => Auth::id() ?? 1,
                    'reference_type'     => PurchaseReturn::class,
                    'reference_id'       => $return->id,
                    'type'               => 'purchase_return',
                    'quantity'           => -$item->quantity,
                    'quantity_before'    => $qtyBefore,
                    'quantity_after'     => $qtyAfter,
                    'unit_cost'          => $item->unit_cost,
                    'notes'              => "Goods Return to Supplier (Return #{$return->reference_number})",
                ]);
            }

            $return->update(['status' => 'approved']);

            return $return;
        });
    }

    public function cancelReturn(int $id): PurchaseReturn
    {
        return DB::transaction(function () use ($id) {
            $return = PurchaseReturn::with(['items', 'purchase'])->findOrFail($id);

            if ($return->status === 'cancelled') {
                throw new \Exception('Return is already cancelled.');
            }

            if ($return->status === 'approved') {
                // Rollback stock
                foreach ($return->items as $item) {
                    $inventory = Inventory::where([
                        'company_id'         => $return->company_id,
                        'warehouse_id'       => $return->purchase->warehouse_id,
                        'product_id'         => $item->product_id,
                        'product_variant_id' => $item->product_variant_id ?? null,
                    ])->first();

                    if (!$inventory) {
                        $inventory = Inventory::create([
                            'company_id'         => $return->company_id,
                            'warehouse_id'       => $return->purchase->warehouse_id,
                            'product_id'         => $item->product_id,
                            'product_variant_id' => $item->product_variant_id ?? null,
                            'quantity'           => 0,
                            'reserved_quantity'  => 0,
                        ]);
                    }

                    $qtyBefore = (float)$inventory->quantity;
                    $qtyAfter = $qtyBefore + (float)$item->quantity;

                    $inventory->update(['quantity' => $qtyAfter]);

                    // Log rollback movement
                    InventoryMovement::create([
                        'company_id'         => $return->company_id,
                        'warehouse_id'       => $return->purchase->warehouse_id,
                        'product_id'         => $item->product_id,
                        'product_variant_id' => $item->product_variant_id ?? null,
                        'user_id'            => Auth::id() ?? 1,
                        'reference_type'     => PurchaseReturn::class,
                        'reference_id'       => $return->id,
                        'type'               => 'in',
                        'quantity'           => $item->quantity,
                        'quantity_before'    => $qtyBefore,
                        'quantity_after'     => $qtyAfter,
                        'unit_cost'          => $item->unit_cost,
                        'notes'              => "Rollback: Cancelled Return #{$return->reference_number}",
                    ]);
                }
            }

            $return->update(['status' => 'cancelled']);

            return $return;
        });
    }

    public function update(int|string $id, array $data): PurchaseReturn
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return DB::transaction(function () use ($id) {
            $return = PurchaseReturn::with(['items', 'purchase'])->findOrFail($id);

            if ($return->status === 'approved') {
                // Rollback stock
                foreach ($return->items as $item) {
                    $inventory = Inventory::where([
                        'company_id'         => $return->company_id,
                        'warehouse_id'       => $return->purchase->warehouse_id,
                        'product_id'         => $item->product_id,
                        'product_variant_id' => $item->product_variant_id ?? null,
                    ])->first();

                    if ($inventory) {
                        $qtyBefore = (float)$inventory->quantity;
                        $qtyAfter = $qtyBefore + (float)$item->quantity;

                        $inventory->update(['quantity' => $qtyAfter]);

                        // Log rollback movement
                        InventoryMovement::create([
                            'company_id'         => $return->company_id,
                            'warehouse_id'       => $return->purchase->warehouse_id,
                            'product_id'         => $item->product_id,
                            'product_variant_id' => $item->product_variant_id ?? null,
                            'user_id'            => Auth::id() ?? 1,
                            'reference_type'     => PurchaseReturn::class,
                            'reference_id'       => $return->id,
                            'type'               => 'in',
                            'quantity'           => $item->quantity,
                            'quantity_before'    => $qtyBefore,
                            'quantity_after'     => $qtyAfter,
                            'unit_cost'          => $item->unit_cost,
                            'notes'              => "Rollback: Deleted Return #{$return->reference_number}",
                        ]);
                    }
                }
            }

            // Perform Soft Delete
            return (bool)$return->delete();
        });
    }

    public function bulkDelete(array $ids): int
    {
        return DB::transaction(function () use ($ids) {
            $count = 0;
            foreach ($ids as $id) {
                if ($this->delete($id)) {
                    $count++;
                }
            }
            return $count;
        });
    }
}
