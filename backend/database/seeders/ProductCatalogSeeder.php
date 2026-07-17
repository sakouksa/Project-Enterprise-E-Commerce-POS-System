<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Company\Company;
use Illuminate\Support\Str;

class ProductCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = Company::value('id') ?? 1;

        // 1. Categories (10 records)
        $categories = [
            ['name' => 'Smartphones', 'slug' => 'smartphones', 'sort_order' => 1],
            ['name' => 'Laptops', 'slug' => 'laptops', 'sort_order' => 2],
            ['name' => 'Headphones', 'slug' => 'headphones', 'sort_order' => 3],
            ['name' => 'Keyboards', 'slug' => 'keyboards', 'sort_order' => 4],
            ['name' => 'Mice', 'slug' => 'mice', 'sort_order' => 5],
            ['name' => 'Monitors', 'slug' => 'monitors', 'sort_order' => 6],
            ['name' => 'Cameras', 'slug' => 'cameras', 'sort_order' => 7],
            ['name' => 'Smartwatches', 'slug' => 'smartwatches', 'sort_order' => 8],
            ['name' => 'Speakers', 'slug' => 'speakers', 'sort_order' => 9],
            ['name' => 'Chargers', 'slug' => 'chargers', 'sort_order' => 10],
        ];
        foreach ($categories as $i => &$cat) {
            $cat['id'] = $i + 1;
            $cat['company_id'] = $companyId;
            $cat['parent_id'] = null;
            $cat['description'] = "High quality " . strtolower($cat['name']);
            $cat['image'] = "categories/" . $cat['slug'] . ".png";
            $cat['is_active'] = true;
            $cat['created_at'] = now();
            $cat['updated_at'] = now();
        }
        DB::table('categories')->insert($categories);

        // 2. Brands (10 records)
        $brands = [
            ['name' => 'Apple', 'slug' => 'apple'],
            ['name' => 'Samsung', 'slug' => 'samsung'],
            ['name' => 'Xiaomi', 'slug' => 'xiaomi'],
            ['name' => 'Oppo', 'slug' => 'oppo'],
            ['name' => 'Asus', 'slug' => 'asus'],
            ['name' => 'HP', 'slug' => 'hp'],
            ['name' => 'Dell', 'slug' => 'dell'],
            ['name' => 'Sony', 'slug' => 'sony'],
            ['name' => 'JBL', 'slug' => 'jbl'],
            ['name' => 'Logitech', 'slug' => 'logitech'],
        ];
        foreach ($brands as $i => &$brand) {
            $brand['id'] = $i + 1;
            $brand['company_id'] = $companyId;
            $brand['description'] = "Products by " . $brand['name'];
            $brand['logo'] = "brands/" . $brand['slug'] . ".png";
            $brand['is_active'] = true;
            $brand['created_at'] = now();
            $brand['updated_at'] = now();
        }
        DB::table('brands')->insert($brands);

        // 3. Units (3 records)
        $units = [
            ['id' => 1, 'company_id' => $companyId, 'name' => 'Piece', 'symbol' => 'pcs', 'description' => 'Single item unit', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'company_id' => $companyId, 'name' => 'Pack', 'symbol' => 'pack', 'description' => 'Pack of items', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'company_id' => $companyId, 'name' => 'Box', 'symbol' => 'box', 'description' => 'Box of items', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('units')->insert($units);

        // 4. Taxes (3 records)
        $taxes = [
            ['id' => 1, 'company_id' => $companyId, 'name' => 'VAT 11%', 'rate' => 11.0000, 'type' => 'percentage', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'company_id' => $companyId, 'name' => 'Service 5%', 'rate' => 5.0000, 'type' => 'percentage', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'company_id' => $companyId, 'name' => 'Fixed Tax 10', 'rate' => 10.0000, 'type' => 'fixed', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('taxes')->insert($taxes);

        // 5. Attributes & Values
        $attributes = [
            ['id' => 1, 'company_id' => $companyId, 'name' => 'Color', 'type' => 'color', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'company_id' => $companyId, 'name' => 'Size', 'type' => 'button', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('attributes')->insert($attributes);

        $attributeValues = [
            ['id' => 1, 'attribute_id' => 1, 'value' => 'Black', 'color_code' => '#000000', 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'attribute_id' => 1, 'value' => 'White', 'color_code' => '#ffffff', 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'attribute_id' => 1, 'value' => 'Silver', 'color_code' => '#c0c0c0', 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'attribute_id' => 2, 'value' => 'Standard', 'color_code' => null, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'attribute_id' => 2, 'value' => 'Large', 'color_code' => null, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('attribute_values')->insert($attributeValues);

        // 6. Products (100 records)
        $products = [];
        $productImages = [];
        $productVariants = [];
        $productVariantValues = [];
        $productPrices = [];
        
        $statuses = ['active', 'active', 'active', 'inactive', 'draft'];
        $variantsCount = 1;

        for ($i = 1; $i <= 100; $i++) {
            $cat = $categories[($i - 1) % 10];
            $brand = $brands[rand(0, 9)];
            $name = $brand['name'] . ' ' . Str::singular($cat['name']) . ' ' . $i;
            $slug = Str::slug($name);
            $sku = 'SKU-' . strtoupper(substr($brand['slug'], 0, 3)) . '-' . strtoupper(substr($cat['slug'], 0, 3)) . '-' . str_pad($i, 4, '0', STR_PAD_LEFT);
            $barcode = '888' . str_pad($i, 10, '0', STR_PAD_LEFT);
            $hasVariants = ($i <= 10); // Let the first 10 products have variants

            $costPrice = rand(500, 1500) * 10000;
            $sellingPrice = $costPrice * rand(12, 16) / 10;
            $comparePrice = $sellingPrice * 1.2;

            $products[] = [
                'id' => $i,
                'company_id' => $companyId,
                'category_id' => $cat['id'],
                'brand_id' => $brand['id'],
                'unit_id' => rand(1, 3),
                'tax_id' => rand(1, 3),
                'name' => $name,
                'slug' => $slug,
                'sku' => $sku,
                'barcode' => $barcode,
                'description' => "Detailed specifications and description for $name.",
                'short_description' => "Premium quality $name by " . $brand['name'],
                'cost_price' => $costPrice,
                'selling_price' => $sellingPrice,
                'compare_price' => $comparePrice,
                'weight' => rand(10, 50) / 10, // kg
                'length' => rand(10, 50), // cm
                'width' => rand(10, 50),
                'height' => rand(10, 50),
                'has_variants' => $hasVariants,
                'track_inventory' => true,
                'low_stock_threshold' => 5,
                'status' => $statuses[rand(0, 4)],
                'is_featured' => ($i % 8 === 0),
                'is_digital' => false,
                'sold_count' => rand(0, 500),
                'view_count' => rand(100, 2000),
                'rating_avg' => rand(35, 50) / 10,
                'rating_count' => rand(1, 100),
                'meta_title' => "Buy $name | Best Deal Online",
                'meta_description' => "Order the new $name now with premium support and quick delivery.",
                'meta_keywords' => "$slug, " . strtolower($brand['name']) . ", " . strtolower($cat['slug']),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Primary Product Image
            $productImages[] = [
                'product_id' => $i,
                'image' => "products/" . $slug . ".jpg",
                'alt_text' => $name,
                'sort_order' => 1,
                'is_primary' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Product prices (multi-tier pricing)
            $productPrices[] = [
                'product_id' => $i,
                'product_variant_id' => null,
                'price_type' => 'retail',
                'min_qty' => 1,
                'price' => $sellingPrice,
                'currency_code' => 'IDR',
                'start_date' => null,
                'end_date' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $productPrices[] = [
                'product_id' => $i,
                'product_variant_id' => null,
                'price_type' => 'wholesale',
                'min_qty' => 10,
                'price' => $sellingPrice * 0.9,
                'currency_code' => 'IDR',
                'start_date' => null,
                'end_date' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Handle Product Variants if enabled
            if ($hasVariants) {
                // Color Variant
                for ($v = 1; $v <= 3; $v++) {
                    $variantName = $name . ' - ' . ($v === 1 ? 'Black' : ($v === 2 ? 'White' : 'Silver'));
                    $vSku = $sku . '-V' . $v;
                    $vBarcode = $barcode . '9' . $v;
                    $variantId = $variantsCount++;

                    $productVariants[] = [
                        'id' => $variantId,
                        'product_id' => $i,
                        'name' => $variantName,
                        'sku' => $vSku,
                        'barcode' => $vBarcode,
                        'cost_price' => $costPrice,
                        'selling_price' => $sellingPrice,
                        'compare_price' => $comparePrice,
                        'weight' => rand(10, 50) / 10,
                        'image' => "products/" . $slug . "-v$v.jpg",
                        'is_active' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    // Match variant values
                    $productVariantValues[] = [
                        'product_variant_id' => $variantId,
                        'attribute_id' => 1, // Color
                        'attribute_value_id' => $v, // Black/White/Silver
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    // Variant pricing
                    $productPrices[] = [
                        'product_id' => $i,
                        'product_variant_id' => $variantId,
                        'price_type' => 'retail',
                        'min_qty' => 1,
                        'price' => $sellingPrice,
                        'currency_code' => 'IDR',
                        'start_date' => null,
                        'end_date' => null,
                        'is_active' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        DB::table('products')->insert($products);
        DB::table('product_images')->insert($productImages);
        DB::table('product_variants')->insert($productVariants);
        DB::table('product_variant_values')->insert($productVariantValues);
        DB::table('product_prices')->insert($productPrices);
    }
}
