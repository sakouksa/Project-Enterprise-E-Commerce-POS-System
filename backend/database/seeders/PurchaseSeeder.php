<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Company\Company;
use App\Models\Company\Branch;
use App\Models\Company\Warehouse;
use App\Models\Supplier\Supplier;
use App\Models\Product\Product;

class PurchaseSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = Company::value('id') ?? 1;
        $branchId = Branch::value('id') ?? 1;
        $warehouseId = Warehouse::value('id') ?? 1;

        $purchases = [];
        $purchaseItems = [];
        $purchaseReturns = [];
        $purchaseReturnItems = [];

        $pItemCount = 1;
        $prItemCount = 1;

        // Generate 100 purchases
        for ($pId = 1; $pId <= 100; $pId++) {
            $suppId = rand(1, 50);
            $subtotal = 0;
            $itemsInPurchase = 4; // Generate exactly 4 items per purchase to reach 400 items total

            // Create items first to calculate subtotal
            $tempItems = [];
            for ($itemIdx = 1; $itemIdx <= $itemsInPurchase; $itemIdx++) {
                $productId = rand(1, 100);
                $qty = rand(10, 50);
                $unitCost = rand(50, 200) * 1000;
                $discPercent = rand(0, 5);
                $discAmt = ($qty * $unitCost) * $discPercent / 100;
                $taxPercent = 11.0000;
                $taxAmt = (($qty * $unitCost) - $discAmt) * $taxPercent / 100;
                $itemSubtotal = ($qty * $unitCost);
                $itemTotal = $itemSubtotal - $discAmt + $taxAmt;

                $subtotal += $itemTotal;

                $tempItems[] = [
                    'id' => $pItemCount++,
                    'purchase_id' => $pId,
                    'product_id' => $productId,
                    'product_variant_id' => null,
                    'quantity' => $qty,
                    'quantity_received' => $qty,
                    'unit_cost' => $unitCost,
                    'discount_percent' => $discPercent,
                    'discount_amount' => $discAmt,
                    'tax_percent' => $taxPercent,
                    'tax_amount' => $taxAmt,
                    'subtotal' => $itemSubtotal,
                    'total' => $itemTotal,
                    'notes' => 'Bulk supply order item ' . $itemIdx,
                    'created_at' => now()->subDays(60 - $pId),
                    'updated_at' => now()->subDays(60 - $pId),
                ];
            }

            $discountAmount = $subtotal * rand(0, 5) / 100;
            $taxAmount = ($subtotal - $discountAmount) * 11 / 100;
            $shippingCost = rand(50, 150) * 1000;
            $grandTotal = $subtotal - $discountAmount + $taxAmount + $shippingCost;
            $paymentStatus = $pId % 5 === 0 ? 'unpaid' : ($pId % 5 === 1 ? 'partial' : 'paid');
            $paidAmount = $paymentStatus === 'paid' ? $grandTotal : ($paymentStatus === 'partial' ? $grandTotal * 0.5 : 0);
            $dueAmount = $grandTotal - $paidAmount;

            $purchases[] = [
                'id' => $pId,
                'company_id' => $companyId,
                'branch_id' => $branchId,
                'warehouse_id' => $warehouseId,
                'supplier_id' => $suppId,
                'user_id' => 1,
                'reference_number' => 'PO-' . date('Ymd') . '-' . str_pad($pId, 4, '0', STR_PAD_LEFT),
                'date' => now()->subDays(60 - $pId)->format('Y-m-d'),
                'due_date' => now()->subDays(60 - $pId)->addDays(30)->format('Y-m-d'),
                'status' => 'received',
                'payment_status' => $paymentStatus,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'discount_amount' => $discountAmount,
                'shipping_cost' => $shippingCost,
                'grand_total' => $grandTotal,
                'paid_amount' => $paidAmount,
                'due_amount' => $dueAmount,
                'currency_code' => 'IDR',
                'exchange_rate' => 1.000000,
                'notes' => 'Warehouse replenishment purchase order ' . $pId,
                'created_at' => now()->subDays(60 - $pId),
                'updated_at' => now()->subDays(60 - $pId),
            ];

            foreach ($tempItems as $item) {
                $purchaseItems[] = $item;
            }

            // Create purchase returns (let's create 15 purchase returns total)
            if ($pId <= 15) {
                $retItemId = rand(0, $itemsInPurchase - 1);
                $retItem = $tempItems[$retItemId];
                $retQty = rand(1, 3);
                $retTotal = $retQty * $retItem['unit_cost'];

                $purchaseReturns[] = [
                    'id' => $pId,
                    'company_id' => $companyId,
                    'purchase_id' => $pId,
                    'supplier_id' => $suppId,
                    'user_id' => 1,
                    'reference_number' => 'PRT-' . date('Ymd') . '-' . str_pad($pId, 4, '0', STR_PAD_LEFT),
                    'date' => now()->subDays(60 - $pId)->addDays(5)->format('Y-m-d'),
                    'total_amount' => $retTotal,
                    'reason' => 'Defective or broken item return ' . $pId,
                    'status' => 'approved',
                    'created_at' => now()->subDays(60 - $pId)->addDays(5),
                    'updated_at' => now()->subDays(60 - $pId)->addDays(5),
                ];

                $purchaseReturnItems[] = [
                    'id' => $prItemCount++,
                    'purchase_return_id' => $pId,
                    'purchase_item_id' => $retItem['id'],
                    'product_id' => $retItem['product_id'],
                    'product_variant_id' => null,
                    'quantity' => $retQty,
                    'unit_cost' => $retItem['unit_cost'],
                    'total' => $retTotal,
                    'notes' => 'Returned due to physical damage',
                    'created_at' => now()->subDays(60 - $pId)->addDays(5),
                    'updated_at' => now()->subDays(60 - $pId)->addDays(5),
                ];
            }
        }

        // Batch insert purchases
        DB::table('purchases')->insert($purchases);
        
        // Batch insert purchase items in chunks of 100
        foreach (array_chunk($purchaseItems, 100) as $chunk) {
            DB::table('purchase_items')->insert($chunk);
        }

        // Batch insert returns
        DB::table('purchase_returns')->insert($purchaseReturns);
        DB::table('purchase_return_items')->insert($purchaseReturnItems);
    }
}
