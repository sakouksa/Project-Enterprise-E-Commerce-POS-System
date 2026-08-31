<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Company\Company;
use App\Models\Company\Branch;

class PromotionSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = Company::value('id') ?? 1;
        $branchId = Branch::value('id') ?? 1;

        // 1. Coupons (10 records)
        $coupons = [];
        for ($i = 1; $i <= 10; $i++) {
            $coupons[] = [
                'id' => $i,
                'company_id' => $companyId,
                'name' => "Discount Coupon $i",
                'code' => "PROMO" . str_pad($i, 3, '0', STR_PAD_LEFT),
                'type' => $i % 3 === 0 ? 'free_shipping' : ($i % 3 === 1 ? 'fixed' : 'percentage'),
                'value' => $i % 3 === 2 ? 10.00 : 25000.00,
                'min_purchase' => 100000.00,
                'max_discount' => 50000.00,
                'usage_limit' => 100,
                'usage_limit_per_customer' => 1,
                'used_count' => rand(5, 50),
                'starts_at' => now()->subDays(5),
                'expires_at' => now()->addDays(30),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('coupons')->insert($coupons);

        // 2. Coupon Products (10 records)
        $couponProducts = [];
        for ($i = 1; $i <= 10; $i++) {
            $couponProducts[] = [
                'coupon_id' => $i,
                'product_id' => $i * 5,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('coupon_products')->insert($couponProducts);

        // 3. Flash Sales (10 records)
        $flashSales = [];
        for ($i = 1; $i <= 10; $i++) {
            $flashSales[] = [
                'id' => $i,
                'company_id' => $companyId,
                'name' => "Mega Flash Sale $i",
                'starts_at' => now()->subDays(1),
                'ends_at' => now()->addDays(2),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('flash_sales')->insert($flashSales);

        // 4. Flash Sale Products (10 records)
        $flashSaleProducts = [];
        for ($i = 1; $i <= 10; $i++) {
            $flashSaleProducts[] = [
                'flash_sale_id' => $i,
                'product_id' => $i * 6,
                'product_variant_id' => null,
                'flash_price' => 150000.00,
                'discount_percent' => 20.0000,
                'quota' => 50,
                'sold_count' => rand(1, 10),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('flash_sale_products')->insert($flashSaleProducts);

        // 5. Promotions (10 records)
        $promotions = [];
        $promoTypes = ['buy_x_get_y', 'bundle', 'percentage', 'fixed', 'free_item'];
        for ($i = 1; $i <= 10; $i++) {
            $promotions[] = [
                'id' => $i,
                'company_id' => $companyId,
                'name' => "Marketing Campaign Promo $i",
                'description' => "Get best deal with promo campaign $i",
                'type' => $promoTypes[$i % 5],
                'conditions' => json_encode(['min_qty' => 2]),
                'rewards' => json_encode(['discount_percent' => 5]),
                'starts_at' => now()->subDays(2),
                'ends_at' => now()->addDays(25),
                'priority' => $i,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('promotions')->insert($promotions);

        // 6. Product Reviews (10 records)
        $reviews = [];
        for ($i = 1; $i <= 10; $i++) {
            $reviews[] = [
                'id' => $i,
                'product_id' => $i * 4,
                'customer_id' => $i,
                'order_item_id' => null,
                'name' => "Reviewer $i",
                'email' => "reviewer$i@example.com",
                'rating' => rand(4, 5),
                'title' => 'Excellent Product quality ' . $i,
                'body' => 'I bought this product recently and it works flawlessly. Highly recommend it to others!',
                'status' => 'approved',
                'is_verified_purchase' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('product_reviews')->insert($reviews);

        // 7. Review Images (10 records)
        $reviewImages = [];
        for ($i = 1; $i <= 10; $i++) {
            $reviewImages[] = [
                'product_review_id' => $i,
                'image' => "reviews/review-image-$i.jpg",
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('review_images')->insert($reviewImages);

        // 8. Expense Categories (10 records)
        $expenseCategories = [];
        $expNames = ['Office Supplies', 'Rent Utilities', 'Internet & Phone', 'Warehouse Electricity', 'Employee Meals', 'Shipping Packaging', 'Logistics Fuel', 'Advertising Ads', 'Server Cloud hosting', 'Miscellaneous'];
        foreach ($expNames as $i => $name) {
            $expenseCategories[] = [
                'id' => $i + 1,
                'company_id' => $companyId,
                'name' => $name,
                'code' => 'EXP-' . strtoupper(substr($name, 0, 3)),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('expense_categories')->insert($expenseCategories);

        // 9. Expenses (10 records)
        $expenses = [];
        $realisticAmounts = [45.50, 250.00, 35.00, 120.00, 28.50, 65.00, 45.00, 110.00, 55.00, 30.00];
        for ($i = 1; $i <= 10; $i++) {
            $expenses[] = [
                'company_id' => $companyId,
                'branch_id' => $branchId,
                'expense_category_id' => $i,
                'user_id' => 1,
                'reference_number' => 'EXP-REF-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'title' => "Monthly Outlay for " . $expNames[$i - 1],
                'description' => 'Regular business operational expense.',
                'amount' => $realisticAmounts[$i - 1] ?? 50.00,
                'date' => now()->subDays(10 - $i)->format('Y-m-d'),
                'receipt' => "receipts/receipt-$i.jpg",
                'status' => 'approved',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('expenses')->insert($expenses);
    }
}
