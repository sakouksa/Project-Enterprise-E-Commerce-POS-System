<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Company\Company;
use App\Models\Company\Branch;
use App\Models\Company\Store;
use App\Models\Company\Warehouse;
use App\Models\Customer\Customer;
use App\Models\Product\Product;

class SaleSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = Company::value('id') ?? 1;
        $branchId = Branch::value('id') ?? 1;
        $storeId = Store::value('id') ?? 1;
        $warehouseId = Warehouse::value('id') ?? 1;

        // 1. Payment Methods (10 records)
        $paymentMethods = [
            ['name' => 'Cash', 'code' => 'cash', 'type' => 'cash'],
            ['name' => 'Bank Transfer Mandiri', 'code' => 'bank_transfer_mandiri', 'type' => 'bank_transfer'],
            ['name' => 'Bank Transfer BCA', 'code' => 'bank_transfer_bca', 'type' => 'bank_transfer'],
            ['name' => 'Credit Card Visa', 'code' => 'cc_visa', 'type' => 'credit_card'],
            ['name' => 'Credit Card Master', 'code' => 'cc_master', 'type' => 'credit_card'],
            ['name' => 'GoPay', 'code' => 'ewallet_gopay', 'type' => 'ewallet'],
            ['name' => 'OVO', 'code' => 'ewallet_ovo', 'type' => 'ewallet'],
            ['name' => 'ShopeePay', 'code' => 'ewallet_shopeepay', 'type' => 'ewallet'],
            ['name' => 'QRIS GoPay', 'code' => 'qris_gopay', 'type' => 'qris'],
            ['name' => 'QRIS ShopeePay', 'code' => 'qris_shopeepay', 'type' => 'qris'],
        ];
        foreach ($paymentMethods as $i => &$pm) {
            $pm['id'] = $i + 1;
            $pm['company_id'] = $companyId;
            $pm['logo'] = "payments/" . $pm['code'] . ".png";
            $pm['config'] = null;
            $pm['fee_percent'] = $pm['type'] === 'credit_card' ? 2.5000 : 0.0000;
            $pm['fee_fixed'] = 0.00;
            $pm['is_active'] = true;
            $pm['available_pos'] = true;
            $pm['available_online'] = true;
            $pm['created_at'] = now();
            $pm['updated_at'] = now();
        }
        DB::table('payment_methods')->insert($paymentMethods);

        // 2. Shipping Methods (10 records)
        $shippingMethods = [];
        $providers = ['JNE', 'J&T', 'SiCepat', 'TIKI', 'Pos Indonesia', 'Anteraja', 'Ninja Xpress', 'Wahana', 'Lion Parcel', 'GrabExpress'];
        foreach ($providers as $i => $prov) {
            $shippingMethods[] = [
                'id' => $i + 1,
                'company_id' => $companyId,
                'name' => "$prov Regular",
                'code' => strtolower(str_replace([' ', '&'], '_', $prov)) . '_reg',
                'provider' => $prov,
                'base_price' => rand(9, 25) * 1000,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('shipping_methods')->insert($shippingMethods);

        // 3. Shipping Zones (10 records)
        $shippingZones = [];
        for ($i = 1; $i <= 10; $i++) {
            $shippingZones[] = [
                'id' => $i,
                'company_id' => $companyId,
                'name' => "Zone region " . $i,
                'countries' => json_encode(['ID']),
                'provinces' => json_encode(['DKI Jakarta', 'Jawa Barat']),
                'cities' => json_encode(['Jakarta', 'Bandung']),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('shipping_zones')->insert($shippingZones);

        // 4. Shipping Rates (10 records)
        $shippingRates = [];
        for ($i = 1; $i <= 10; $i++) {
            $shippingRates[] = [
                'shipping_method_id' => rand(1, 10),
                'shipping_zone_id' => rand(1, 10),
                'min_weight' => 0.000,
                'max_weight' => 10.000,
                'price' => rand(10, 30) * 1000,
                'estimated_days_min' => 2,
                'estimated_days_max' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('shipping_rates')->insert($shippingRates);

        // 5. Wishlists (15 records)
        $wishlists = [];
        for ($i = 1; $i <= 15; $i++) {
            $wishlists[] = [
                'customer_id' => $i,
                'product_id' => rand(1, 100),
                'product_variant_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('wishlists')->insert($wishlists);

        // 6. POS Sales (150 sales) and Sale Items (500+ items)
        $sales = [];
        $saleItems = [];
        $saleItemCount = 1;
        
        $saleReturns = [];
        $saleReturnItems = [];
        $srItemCount = 1;

        $payments = [];
        $paymentCount = 1;

        $transactions = [];
        $transactionCount = 1;

        for ($sId = 1; $sId <= 150; $sId++) {
            $subtotal = 0;
            // Generate exactly 4 items per sale to get 600 items total (which meets the 500 requirement)
            $tempSaleItems = [];
            for ($itemIdx = 1; $itemIdx <= 4; $itemIdx++) {
                $pId = rand(1, 100);
                $qty = rand(1, 5);
                $price = rand(10, 100) * 1000;
                $discAmt = ($qty * $price) * rand(0, 5) / 100;
                $taxAmt = (($qty * $price) - $discAmt) * 11 / 100;
                $itemSubtotal = ($qty * $price);
                $itemTotal = $itemSubtotal - $discAmt + $taxAmt;

                $subtotal += $itemTotal;

                $tempSaleItems[] = [
                    'id' => $saleItemCount++,
                    'sale_id' => $sId,
                    'product_id' => $pId,
                    'product_variant_id' => null,
                    'product_name' => "Smartphone Product X $pId",
                    'sku' => "SKU-PROD-$pId",
                    'quantity' => $qty,
                    'unit_price' => $price,
                    'discount_percent' => 0.0000,
                    'discount_amount' => $discAmt,
                    'tax_percent' => 11.0000,
                    'tax_amount' => $taxAmt,
                    'subtotal' => $itemSubtotal,
                    'total' => $itemTotal,
                    'created_at' => now()->subDays(60 - ($sId / 3)),
                    'updated_at' => now()->subDays(60 - ($sId / 3)),
                ];
            }

            $discountAmount = $subtotal * rand(0, 5) / 100;
            $taxAmount = ($subtotal - $discountAmount) * 11 / 100;
            $grandTotal = $subtotal - $discountAmount + $taxAmount;
            
            $status = $sId % 20 === 0 ? 'cancelled' : ($sId % 20 === 1 ? 'refunded' : 'completed');
            $paidAmount = $status === 'completed' ? $grandTotal : 0;
            $changeAmount = 0;

            $sales[] = [
                'id' => $sId,
                'company_id' => $companyId,
                'branch_id' => $branchId,
                'store_id' => $storeId,
                'warehouse_id' => $warehouseId,
                'customer_id' => rand(1, 100),
                'user_id' => 1,
                'invoice_number' => 'INV-' . date('Ymd') . '-' . str_pad($sId, 6, '0', STR_PAD_LEFT),
                'date' => now()->subDays(60 - ($sId / 3))->format('Y-m-d H:i:s'),
                'status' => $status,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'discount_amount' => $discountAmount,
                'grand_total' => $grandTotal,
                'paid_amount' => $paidAmount,
                'change_amount' => $changeAmount,
                'currency_code' => 'IDR',
                'payment_method_id' => rand(1, 10),
                'notes' => 'Point of Sale transaction ' . $sId,
                'created_at' => now()->subDays(60 - ($sId / 3)),
                'updated_at' => now()->subDays(60 - ($sId / 3)),
            ];

            foreach ($tempSaleItems as $item) {
                $saleItems[] = $item;
            }

            // Create payments and ledger transactions
            if ($status === 'completed') {
                $pIdVal = $paymentCount++;
                $payments[] = [
                    'id' => $pIdVal,
                    'company_id' => $companyId,
                    'payment_method_id' => rand(1, 10),
                    'payable_type' => 'App\Models\Sales\Sale',
                    'payable_id' => $sId,
                    'transaction_id' => 'TXN-POS-' . $sId . '-' . mt_rand(1000, 9999),
                    'reference_number' => 'REF-' . mt_rand(100000, 999999),
                    'amount' => $grandTotal,
                    'fee_amount' => 0.00,
                    'currency_code' => 'IDR',
                    'status' => 'completed',
                    'gateway_response' => null,
                    'paid_at' => now()->subDays(60 - ($sId / 3)),
                    'notes' => 'Payment for invoice ' . $sId,
                    'created_at' => now()->subDays(60 - ($sId / 3)),
                    'updated_at' => now()->subDays(60 - ($sId / 3)),
                ];

                $transactions[] = [
                    'id' => $transactionCount++,
                    'company_id' => $companyId,
                    'payment_id' => $pIdVal,
                    'type' => 'debit',
                    'amount' => $grandTotal,
                    'description' => 'Received payment from POS invoice ' . $sId,
                    'reference_type' => 'App\Models\Sales\Sale',
                    'reference_id' => $sId,
                    'created_at' => now()->subDays(60 - ($sId / 3)),
                    'updated_at' => now()->subDays(60 - ($sId / 3)),
                ];
            }

            // Create returns (let's create 15 sale returns)
            if ($status === 'refunded' && count($saleReturns) < 15) {
                $retItemId = rand(0, 3);
                $retItem = $tempSaleItems[$retItemId];
                $retQty = 1;
                $retTotal = $retQty * $retItem['unit_price'];
                $srIdVal = count($saleReturns) + 1;

                $saleReturns[] = [
                    'id' => $srIdVal,
                    'company_id' => $companyId,
                    'sale_id' => $sId,
                    'user_id' => 1,
                    'reference_number' => 'SRT-' . date('Ymd') . '-' . str_pad($srIdVal, 4, '0', STR_PAD_LEFT),
                    'date' => now()->subDays(60 - ($sId / 3))->addDays(2)->format('Y-m-d H:i:s'),
                    'total_amount' => $retTotal,
                    'refund_amount' => $retTotal,
                    'refund_method' => 'cash',
                    'reason' => 'Customer return request ' . $srIdVal,
                    'status' => 'approved',
                    'created_at' => now()->subDays(60 - ($sId / 3))->addDays(2),
                    'updated_at' => now()->subDays(60 - ($sId / 3))->addDays(2),
                ];

                $saleReturnItems[] = [
                    'id' => $srItemCount++,
                    'sale_return_id' => $srIdVal,
                    'sale_item_id' => $retItem['id'],
                    'product_id' => $retItem['product_id'],
                    'product_variant_id' => null,
                    'quantity' => $retQty,
                    'unit_price' => $retItem['unit_price'],
                    'total' => $retTotal,
                    'notes' => 'Returned due to customer changing mind',
                    'created_at' => now()->subDays(60 - ($sId / 3))->addDays(2),
                    'updated_at' => now()->subDays(60 - ($sId / 3))->addDays(2),
                ];
            }
        }
        
        DB::table('sales')->insert($sales);
        foreach (array_chunk($saleItems, 100) as $chunk) {
            DB::table('sale_items')->insert($chunk);
        }
        DB::table('sale_returns')->insert($saleReturns);
        DB::table('sale_return_items')->insert($saleReturnItems);

        // Update Customers' total_spent, order_count, loyalty_points based on completed sales
        $customerSalesStats = DB::table('sales')
            ->where('status', 'completed')
            ->whereNotNull('customer_id')
            ->groupBy('customer_id')
            ->select(
                'customer_id',
                DB::raw('COUNT(*) as order_count'),
                DB::raw('SUM(grand_total) as total_spent')
            )
            ->get();

        foreach ($customerSalesStats as $stat) {
            $spent = (float) $stat->total_spent;
            $points = round($spent, 2);
            DB::table('customers')->where('id', $stat->customer_id)->update([
                'total_spent'    => $spent,
                'order_count'    => (int) $stat->order_count,
                'loyalty_points' => $points,
            ]);
        }

        // 7. Cash Registers & Register Transactions (10 registers)
        $cashRegisters = [];
        $crTransactions = [];
        $crTxCount = 1;
        for ($crId = 1; $crId <= 10; $crId++) {
            $cashRegisters[] = [
                'id' => $crId,
                'company_id' => $companyId,
                'branch_id' => $branchId,
                'store_id' => $storeId,
                'name' => "Cashier Register $crId",
                'code' => "REG-00$crId",
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Open cash register transaction
            $crTransactions[] = [
                'id' => $crTxCount++,
                'cash_register_id' => $crId,
                'user_id' => 1,
                'type' => 'open',
                'amount' => 500000, // Open float cash
                'balance_before' => 0,
                'balance_after' => 500000,
                'reference_type' => null,
                'reference_id' => null,
                'notes' => 'Register opened with standard float',
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ];
        }
        DB::table('cash_registers')->insert($cashRegisters);
        DB::table('cash_register_transactions')->insert($crTransactions);

        // 8. E-Commerce Orders (150 orders) and Order Items (400+ items)
        $orders = [];
        $orderItems = [];
        $orderItemCount = 1;
        
        $shipments = [];
        $shipmentCount = 1;

        $orderHistories = [];
        $ohCount = 1;

        for ($oId = 1; $oId <= 150; $oId++) {
            $subtotal = 0;
            $itemsInOrder = 3; // Generate 3 items per order to reach 450 items total (meets 400 requirement)
            $tempOrderItems = [];
            
            for ($itemIdx = 1; $itemIdx <= $itemsInOrder; $itemIdx++) {
                $pId = rand(1, 100);
                $qty = rand(1, 4);
                $price = rand(15, 90) * 1000;
                $discAmt = ($qty * $price) * rand(0, 5) / 100;
                $taxAmt = (($qty * $price) - $discAmt) * 11 / 100;
                $itemSubtotal = ($qty * $price);
                $itemTotal = $itemSubtotal - $discAmt + $taxAmt;

                $subtotal += $itemTotal;

                $tempOrderItems[] = [
                    'id' => $orderItemCount++,
                    'order_id' => $oId,
                    'product_id' => $pId,
                    'product_variant_id' => null,
                    'product_name' => "E-Commerce Digital Gear $pId",
                    'product_sku' => "SKU-ONLINE-$pId",
                    'product_image' => "products/ecom-gear-$pId.jpg",
                    'quantity' => $qty,
                    'unit_price' => $price,
                    'discount_amount' => $discAmt,
                    'tax_amount' => $taxAmt,
                    'subtotal' => $itemSubtotal,
                    'total' => $itemTotal,
                    'created_at' => now()->subDays(60 - ($oId / 3.5)),
                    'updated_at' => now()->subDays(60 - ($oId / 3.5)),
                ];
            }

            $discountAmount = $subtotal * rand(0, 5) / 100;
            $taxAmount = ($subtotal - $discountAmount) * 11 / 100;
            $shippingCost = rand(15, 30) * 1000;
            $grandTotal = $subtotal - $discountAmount + $taxAmount + $shippingCost;

            $status = $oId % 10 === 0 ? 'cancelled' : ($oId % 10 === 1 ? 'pending' : 'completed');
            $paymentStatus = $status === 'completed' ? 'paid' : 'unpaid';

            $orders[] = [
                'id' => $oId,
                'company_id' => $companyId,
                'store_id' => $storeId,
                'customer_id' => rand(1, 100),
                'warehouse_id' => $warehouseId,
                'order_number' => 'ORD-' . date('Ymd') . '-' . str_pad($oId, 6, '0', STR_PAD_LEFT),
                'status' => $status,
                'payment_status' => $paymentStatus,
                'fulfillment_status' => $status === 'completed' ? 'fulfilled' : 'unfulfilled',
                'shipping_name' => "Recipient Order $oId",
                'shipping_phone' => '0898765432' . $oId,
                'shipping_address' => "Jalan Online Delivery Block " . chr(65 + ($oId % 5)) . " No. $oId",
                'shipping_city' => 'Jakarta',
                'shipping_province' => 'DKI Jakarta',
                'shipping_country' => 'Indonesia',
                'shipping_postal_code' => '1200' . ($oId % 10),
                'shipping_method_id' => rand(1, 10),
                'shipping_cost' => $shippingCost,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'discount_amount' => $discountAmount,
                'grand_total' => $grandTotal,
                'paid_amount' => $paymentStatus === 'paid' ? $grandTotal : 0,
                'coupon_code' => null,
                'currency_code' => 'IDR',
                'exchange_rate' => 1.000000,
                'customer_notes' => 'Deliver during business hours.',
                'admin_notes' => 'Dispatched from central warehouse.',
                'created_at' => now()->subDays(60 - ($oId / 3.5)),
                'updated_at' => now()->subDays(60 - ($oId / 3.5)),
            ];

            foreach ($tempOrderItems as $item) {
                $orderItems[] = $item;
            }

            // Shipments (150 shipments)
            $shipments[] = [
                'id' => $shipmentCount++,
                'order_id' => $oId,
                'shipping_method_id' => rand(1, 10),
                'tracking_number' => 'TRK-' . mt_rand(10000000, 99999999),
                'carrier' => 'JNE Express',
                'status' => $status === 'completed' ? 'delivered' : 'pending',
                'shipped_at' => $status === 'completed' ? now()->subDays(60 - ($oId / 3.5))->addHours(6) : null,
                'delivered_at' => $status === 'completed' ? now()->subDays(60 - ($oId / 3.5))->addDays(2) : null,
                'created_at' => now()->subDays(60 - ($oId / 3.5)),
                'updated_at' => now()->subDays(60 - ($oId / 3.5)),
            ];

            // Order status history
            $orderHistories[] = [
                'id' => $ohCount++,
                'order_id' => $oId,
                'user_id' => 1,
                'status' => 'pending',
                'comment' => 'Order created successfully.',
                'notify_customer' => true,
                'created_at' => now()->subDays(60 - ($oId / 3.5)),
                'updated_at' => now()->subDays(60 - ($oId / 3.5)),
            ];

            if ($status === 'completed') {
                $orderHistories[] = [
                    'id' => $ohCount++,
                    'order_id' => $oId,
                    'user_id' => 1,
                    'status' => 'completed',
                    'comment' => 'Order finalized and shipped.',
                    'notify_customer' => true,
                    'created_at' => now()->subDays(60 - ($oId / 3.5))->addDays(2),
                    'updated_at' => now()->subDays(60 - ($oId / 3.5))->addDays(2),
                ];

                // Create payment & ledger transaction for E-commerce order
                $pIdVal = $paymentCount++;
                $payments[] = [
                    'id' => $pIdVal,
                    'company_id' => $companyId,
                    'payment_method_id' => rand(1, 10),
                    'payable_type' => 'App\Models\Order\Order',
                    'payable_id' => $oId,
                    'transaction_id' => 'TXN-ECOMM-' . $oId . '-' . mt_rand(1000, 9999),
                    'reference_number' => 'REF-ECOMM-' . mt_rand(100000, 999999),
                    'amount' => $grandTotal,
                    'fee_amount' => 0.00,
                    'currency_code' => 'IDR',
                    'status' => 'completed',
                    'gateway_response' => null,
                    'paid_at' => now()->subDays(60 - ($oId / 3.5)),
                    'notes' => 'E-Commerce credit card settlement for order ' . $oId,
                    'created_at' => now()->subDays(60 - ($oId / 3.5)),
                    'updated_at' => now()->subDays(60 - ($oId / 3.5)),
                ];

                $transactions[] = [
                    'id' => $transactionCount++,
                    'company_id' => $companyId,
                    'payment_id' => $pIdVal,
                    'type' => 'debit',
                    'amount' => $grandTotal,
                    'description' => 'Received online settlement for order ' . $oId,
                    'reference_type' => 'App\Models\Order\Order',
                    'reference_id' => $oId,
                    'created_at' => now()->subDays(60 - ($oId / 3.5)),
                    'updated_at' => now()->subDays(60 - ($oId / 3.5)),
                ];
            }
        }

        DB::table('orders')->insert($orders);
        foreach (array_chunk($orderItems, 100) as $chunk) {
            DB::table('order_items')->insert($chunk);
        }
        DB::table('shipments')->insert($shipments);
        DB::table('order_status_histories')->insert($orderHistories);
        
        // Batch insert payments & transactions
        DB::table('payments')->insert($payments);
        DB::table('transactions')->insert($transactions);
    }
}
