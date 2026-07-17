<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Company\Company;
use App\Models\Company\Store;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = Company::value('id') ?? 1;
        $storeId = Store::value('id') ?? 1;

        // 1. Customer Groups (10 records)
        $groups = [];
        $groupNames = ['General Retail', 'VIP Platinum', 'Gold Member', 'Silver Member', 'Wholesale Buyer', 'Company Partner', 'Employee Family', 'Distributor tier 1', 'Distributor tier 2', 'Dropshipper'];
        foreach ($groupNames as $i => $name) {
            $groups[] = [
                'id' => $i + 1,
                'company_id' => $companyId,
                'name' => $name,
                'description' => "Group for " . $name,
                'discount_percent' => rand(0, 15),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('customer_groups')->insert($groups);

        // 2. Customers (100 records)
        $customers = [];
        $genders = ['male', 'female'];
        for ($i = 1; $i <= 100; $i++) {
            $customers[] = [
                'id' => $i,
                'company_id' => $companyId,
                'customer_group_id' => rand(1, 10),
                'name' => "Customer $i",
                'email' => "customer$i@example.com",
                'phone' => "085290123" . str_pad($i, 3, '0', STR_PAD_LEFT),
                'gender' => $genders[$i % 2],
                'birth_date' => '1985-05-' . str_pad(($i % 28) + 1, 2, '0', STR_PAD_LEFT),
                'loyalty_points' => rand(0, 500),
                'tax_number' => '01.002.003.4-005.0' . str_pad($i, 2, '0', STR_PAD_LEFT), // NPWP format
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('customers')->insert($customers);

        // 3. Customer Addresses (100 records, 1 per customer)
        $addresses = [];
        for ($i = 1; $i <= 100; $i++) {
            $addresses[] = [
                'customer_id' => $i,
                'label' => 'Home ' . $i,
                'name' => "Recipient Customer $i",
                'phone' => "085290123" . str_pad($i, 3, '0', STR_PAD_LEFT),
                'address' => "Housing Complex Block D No. $i, Subdistrict No. " . (($i % 5) + 1),
                'city' => 'Jakarta',
                'province' => 'DKI Jakarta',
                'country' => 'ID',
                'postal_code' => '1200' . ($i % 10),
                'is_default' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('customer_addresses')->insert($addresses);

        // 4. Shopping Carts & Items (15 active carts)
        $carts = [];
        $cartItems = [];
        for ($cId = 1; $cId <= 15; $cId++) {
            $carts[] = [
                'id' => $cId,
                'store_id' => $storeId,
                'customer_id' => $cId,
                'currency_code' => 'IDR',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // 2 items in cart
            for ($itemIdx = 1; $itemIdx <= 2; $itemIdx++) {
                $cartItems[] = [
                    'cart_id' => $cId,
                    'product_id' => rand(1, 100),
                    'product_variant_id' => null,
                    'quantity' => rand(1, 5),
                    'unit_price' => rand(10, 100) * 1000,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('carts')->insert($carts);
        DB::table('cart_items')->insert($cartItems);
    }
}
