<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Company\Company;
use App\Models\Company\Warehouse;
use App\Models\Product\Product;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE stock_opname_items, stock_opnames, stock_transfer_items, stock_transfers, stock_adjustment_items, stock_adjustments, inventory_movements, inventories RESTART IDENTITY CASCADE;');

        $companyId = Company::value('id') ?? 1;

        // 1. Seed initial inventories for all 100 products
        $inventories = [];
        $movements = [];
        $mCount = 1;

        // We seed for warehouse 1 (Main Warehouse of Company 1)
        // and warehouse 2 (Second Warehouse of Company 1)
        for ($pId = 1; $pId <= 100; $pId++) {
            $qty1 = rand(50, 200);
            $qty2 = rand(30, 100);

            // Warehouse 1
            $inventories[] = [
                'company_id' => $companyId,
                'warehouse_id' => 1,
                'product_id' => $pId,
                'product_variant_id' => null,
                'quantity' => $qty1,
                'reserved_quantity' => 0,
                'reorder_point' => 5,
                'reorder_qty' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Initial movement (Opening Balance)
            $movements[] = [
                'company_id' => $companyId,
                'warehouse_id' => 1,
                'product_id' => $pId,
                'product_variant_id' => null,
                'user_id' => 1,
                'reference_type' => 'opening_balance',
                'reference_id' => null,
                'type' => 'in',
                'quantity' => $qty1,
                'quantity_before' => 0,
                'quantity_after' => $qty1,
                'unit_cost' => rand(100, 500) * 1000,
                'notes' => 'Initial stock opening balance',
                'created_at' => now()->subDays(60),
                'updated_at' => now()->subDays(60),
            ];

            // Warehouse 2
            $inventories[] = [
                'company_id' => $companyId,
                'warehouse_id' => 2,
                'product_id' => $pId,
                'product_variant_id' => null,
                'quantity' => $qty2,
                'reserved_quantity' => 0,
                'reorder_point' => 5,
                'reorder_qty' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $movements[] = [
                'company_id' => $companyId,
                'warehouse_id' => 2,
                'product_id' => $pId,
                'product_variant_id' => null,
                'user_id' => 1,
                'reference_type' => 'opening_balance',
                'reference_id' => null,
                'type' => 'in',
                'quantity' => $qty2,
                'quantity_before' => 0,
                'quantity_after' => $qty2,
                'unit_cost' => rand(100, 500) * 1000,
                'notes' => 'Initial stock opening balance',
                'created_at' => now()->subDays(60),
                'updated_at' => now()->subDays(60),
            ];
        }

        // Also seed inventories for warehouses 3 to 10
        for ($wId = 3; $wId <= 10; $wId++) {
            for ($pId = 1; $pId <= 10; $pId++) { // Seed 10 products each for other companies
                $qty = rand(40, 150);
                $comp = DB::table('warehouses')->where('id', $wId)->value('company_id');
                $inventories[] = [
                    'company_id' => $comp,
                    'warehouse_id' => $wId,
                    'product_id' => $pId,
                    'product_variant_id' => null,
                    'quantity' => $qty,
                    'reserved_quantity' => 0,
                    'reorder_point' => 5,
                    'reorder_qty' => 20,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('inventories')->insert($inventories);

        // 2. Stock Adjustments (at least 15 records)
        $adjustments = [];
        $adjustmentItems = [];
        for ($adjId = 1; $adjId <= 15; $adjId++) {
            $adjustments[] = [
                'id' => $adjId,
                'company_id' => $companyId,
                'warehouse_id' => 1,
                'user_id' => 1,
                'reference_number' => 'ADJ-' . date('Ymd') . '-' . str_pad($adjId, 4, '0', STR_PAD_LEFT),
                'date' => now()->subDays(15 - $adjId)->format('Y-m-d'),
                'type' => $adjId % 2 === 0 ? 'addition' : 'subtraction',
                'reason' => 'Inventory correction ' . $adjId,
                'status' => 'approved',
                'approved_by' => 1,
                'approved_at' => now(),
                'created_at' => now()->subDays(15 - $adjId),
                'updated_at' => now()->subDays(15 - $adjId),
            ];

            // 2 items per adjustment
            for ($itemIdx = 1; $itemIdx <= 2; $itemIdx++) {
                $pId = rand(1, 100);
                $adjustedQty = rand(2, 8);
                $adjustmentItems[] = [
                    'stock_adjustment_id' => $adjId,
                    'product_id' => $pId,
                    'product_variant_id' => null,
                    'quantity_before' => 50,
                    'quantity_adjusted' => $adjustedQty,
                    'quantity_after' => $adjId % 2 === 0 ? (50 + $adjustedQty) : (50 - $adjustedQty),
                    'notes' => 'Item adjustment notes ' . $itemIdx,
                    'created_at' => now()->subDays(15 - $adjId),
                    'updated_at' => now()->subDays(15 - $adjId),
                ];

                // Append adjustment movements
                $movements[] = [
                    'company_id' => $companyId,
                    'warehouse_id' => 1,
                    'product_id' => $pId,
                    'product_variant_id' => null,
                    'user_id' => 1,
                    'reference_type' => 'stock_adjustment',
                    'reference_id' => $adjId,
                    'type' => $adjId % 2 === 0 ? 'in' : 'out',
                    'quantity' => $adjustedQty,
                    'quantity_before' => 50,
                    'quantity_after' => $adjId % 2 === 0 ? (50 + $adjustedQty) : (50 - $adjustedQty),
                    'unit_cost' => 150000,
                    'notes' => 'Adjusted via ADJ-' . $adjId,
                    'created_at' => now()->subDays(15 - $adjId),
                    'updated_at' => now()->subDays(15 - $adjId),
                ];
            }
        }
        DB::table('stock_adjustments')->insert($adjustments);
        DB::table('stock_adjustment_items')->insert($adjustmentItems);

        // 3. Stock Transfers (at least 15 transfers from warehouse 1 to 2)
        $transfers = [];
        $transferItems = [];
        for ($stId = 1; $stId <= 15; $stId++) {
            $transfers[] = [
                'id' => $stId,
                'company_id' => $companyId,
                'from_warehouse_id' => 1,
                'to_warehouse_id' => 2,
                'user_id' => 1,
                'reference_number' => 'TRF-' . date('Ymd') . '-' . str_pad($stId, 4, '0', STR_PAD_LEFT),
                'date' => now()->subDays(20 - $stId)->format('Y-m-d'),
                'notes' => 'Inter-warehouse stock transfer ' . $stId,
                'status' => 'received',
                'shipped_at' => now()->subDays(20 - $stId)->addHours(2),
                'received_at' => now()->subDays(20 - $stId)->addHours(6),
                'created_at' => now()->subDays(20 - $stId),
                'updated_at' => now()->subDays(20 - $stId),
            ];

            // 2 items per transfer
            for ($itemIdx = 1; $itemIdx <= 2; $itemIdx++) {
                $pId = rand(1, 100);
                $qty = rand(5, 15);
                $transferItems[] = [
                    'stock_transfer_id' => $stId,
                    'product_id' => $pId,
                    'product_variant_id' => null,
                    'quantity_requested' => $qty,
                    'quantity_sent' => $qty,
                    'quantity_received' => $qty,
                    'notes' => 'Safe transit ' . $itemIdx,
                    'created_at' => now()->subDays(20 - $stId),
                    'updated_at' => now()->subDays(20 - $stId),
                ];

                // Append transfer movements
                $movements[] = [
                    'company_id' => $companyId,
                    'warehouse_id' => 1, // OUT from warehouse 1
                    'product_id' => $pId,
                    'product_variant_id' => null,
                    'user_id' => 1,
                    'reference_type' => 'stock_transfer_out',
                    'reference_id' => $stId,
                    'type' => 'out',
                    'quantity' => $qty,
                    'quantity_before' => 100,
                    'quantity_after' => 100 - $qty,
                    'unit_cost' => 150000,
                    'notes' => 'Transferred out to WH-002',
                    'created_at' => now()->subDays(20 - $stId),
                    'updated_at' => now()->subDays(20 - $stId),
                ];

                $movements[] = [
                    'company_id' => $companyId,
                    'warehouse_id' => 2, // IN to warehouse 2
                    'product_id' => $pId,
                    'product_variant_id' => null,
                    'user_id' => 1,
                    'reference_type' => 'stock_transfer_in',
                    'reference_id' => $stId,
                    'type' => 'in',
                    'quantity' => $qty,
                    'quantity_before' => 50,
                    'quantity_after' => 50 + $qty,
                    'unit_cost' => 150000,
                    'notes' => 'Transferred in from WH-001',
                    'created_at' => now()->subDays(20 - $stId),
                    'updated_at' => now()->subDays(20 - $stId),
                ];
            }
        }
        DB::table('stock_transfers')->insert($transfers);
        DB::table('stock_transfer_items')->insert($transferItems);

        // 4. Stock Opnames (at least 15 records, status is 'done')
        $opnames = [];
        $opnameItems = [];
        for ($opId = 1; $opId <= 15; $opId++) {
            $opnames[] = [
                'id' => $opId,
                'company_id' => $companyId,
                'warehouse_id' => 1,
                'user_id' => 1,
                'reference_number' => 'OPN-' . date('Ymd') . '-' . str_pad($opId, 4, '0', STR_PAD_LEFT),
                'date' => now()->subDays(25 - $opId)->format('Y-m-d'),
                'notes' => 'Monthly stock take audit ' . $opId,
                'status' => 'done',
                'completed_at' => now()->subDays(25 - $opId)->addHours(4),
                'created_at' => now()->subDays(25 - $opId),
                'updated_at' => now()->subDays(25 - $opId),
            ];

            // 2 items per opname
            for ($itemIdx = 1; $itemIdx <= 2; $itemIdx++) {
                $pId = rand(1, 100);
                $sysQty = rand(40, 60);
                $physQty = $sysQty + rand(-2, 2);
                $diff = $physQty - $sysQty;

                $opnameItems[] = [
                    'stock_opname_id' => $opId,
                    'product_id' => $pId,
                    'product_variant_id' => null,
                    'system_quantity' => $sysQty,
                    'physical_quantity' => $physQty,
                    'difference' => $diff,
                    'notes' => 'Opname variance checks ' . $itemIdx,
                    'created_at' => now()->subDays(25 - $opId),
                    'updated_at' => now()->subDays(25 - $opId),
                ];

                if ($diff !== 0) {
                    $movements[] = [
                        'company_id' => $companyId,
                        'warehouse_id' => 1,
                        'product_id' => $pId,
                        'product_variant_id' => null,
                        'user_id' => 1,
                        'reference_type' => 'stock_opname',
                        'reference_id' => $opId,
                        'type' => $diff > 0 ? 'in' : 'out',
                        'quantity' => abs($diff),
                        'quantity_before' => $sysQty,
                        'quantity_after' => $physQty,
                        'unit_cost' => 150000,
                        'notes' => 'Opname adjustment discrepancy',
                        'created_at' => now()->subDays(25 - $opId),
                        'updated_at' => now()->subDays(25 - $opId),
                    ];
                }
            }
        }
        DB::table('stock_opnames')->insert($opnames);
        DB::table('stock_opname_items')->insert($opnameItems);

        // 5. Insert movements (ensure we meet the 500 minimum request)
        // We already added 200 initial balance, 30 adjustment movements, 60 transfer movements, and several opname movements.
        // Let's add additional ledger movements to reach 500+ items.
        while (count($movements) < 550) {
            $pId = rand(1, 100);
            $qty = rand(5, 20);
            $movements[] = [
                'company_id' => $companyId,
                'warehouse_id' => rand(1, 2),
                'product_id' => $pId,
                'product_variant_id' => null,
                'user_id' => 1,
                'reference_type' => 'manual_correction',
                'reference_id' => null,
                'type' => rand(0, 1) === 0 ? 'in' : 'out',
                'quantity' => $qty,
                'quantity_before' => 100,
                'quantity_after' => rand(0, 1) === 0 ? (100 + $qty) : (100 - $qty),
                'unit_cost' => rand(100, 300) * 1000,
                'notes' => 'Random historical buffer movements ' . count($movements),
                'created_at' => now()->subDays(rand(1, 60)),
                'updated_at' => now()->subDays(rand(1, 60)),
            ];
        }

        // Batch insert movements in chunks of 100 to prevent SQL bind limit errors
        foreach (array_chunk($movements, 100) as $chunk) {
            DB::table('inventory_movements')->insert($chunk);
        }
    }
}
