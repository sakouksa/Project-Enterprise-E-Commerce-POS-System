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
        DB::statement('TRUNCATE TABLE product_variant_values, product_variants, product_prices, product_images, inventories, products, attribute_values, attributes, taxes, units, brands, categories RESTART IDENTITY CASCADE;');

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
            ['id' => 1, 'attribute_id' => 1, 'value' => 'Black',  'color_code' => '#000000', 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'attribute_id' => 1, 'value' => 'White',  'color_code' => '#ffffff', 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'attribute_id' => 1, 'value' => 'Silver', 'color_code' => '#c0c0c0', 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'attribute_id' => 2, 'value' => 'S',      'color_code' => null,      'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'attribute_id' => 2, 'value' => 'M',      'color_code' => null,      'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'attribute_id' => 2, 'value' => 'L',      'color_code' => null,      'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7, 'attribute_id' => 2, 'value' => 'XL',     'color_code' => null,      'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('attribute_values')->insert($attributeValues);

        // 6. Products (100 records with real product images & variants)
        $categoryImages = [
            'smartphones' => [
                'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
            ],
            'laptops' => [
                'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
            ],
            'headphones' => [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
            ],
            'keyboards' => [
                'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80',
            ],
            'mice' => [
                'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=600&auto=format&fit=crop&q=80',
            ],
            'monitors' => [
                'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&auto=format&fit=crop&q=80',
            ],
            'cameras' => [
                'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80',
            ],
            'smartwatches' => [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
            ],
            'speakers' => [
                'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
            ],
            'chargers' => [
                'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1622445268121-ac11f17a2834?w=600&auto=format&fit=crop&q=80',
            ],
        ];

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
            $hasVariants = ($i <= 40); // First 40 products have variants, 60 are simple products without variants!

            $costPrice = rand(30, 150);
            $sellingPrice = round($costPrice * rand(12, 16) / 10, 2);
            $comparePrice = round($sellingPrice * 1.2, 2);

            $catSlug = $cat['slug'];
            $imgsList = $categoryImages[$catSlug] ?? $categoryImages['smartphones'];
            $primaryImgUrl = $imgsList[($i - 1) % count($imgsList)];

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
                'image' => $primaryImgUrl,
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
                'currency_code' => 'USD',
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
                'currency_code' => 'USD',
                'start_date' => null,
                'end_date' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Handle Product Variants if enabled
            if ($hasVariants) {
                // Size & Color Combinations (S/M/L/XL x Black/White/Silver)
                // attr_val IDs: Color Black=1, White=2, Silver=3 | Size S=4, M=5, L=6, XL=7
                $sizesList = [
                    ['code' => 'S',  'name' => 'S',  'mult' => 0.85, 'attr_val_id' => 4],
                    ['code' => 'M',  'name' => 'M',  'mult' => 1.00, 'attr_val_id' => 5],
                    ['code' => 'L',  'name' => 'L',  'mult' => 1.30, 'attr_val_id' => 6],
                    ['code' => 'XL', 'name' => 'XL', 'mult' => 1.50, 'attr_val_id' => 7],
                ];

                $colorsList = [
                    ['cIdx' => 1, 'name' => 'Black',  'attr_val_id' => 1],
                    ['cIdx' => 2, 'name' => 'White',  'attr_val_id' => 2],
                    ['cIdx' => 3, 'name' => 'Silver', 'attr_val_id' => 3],
                ];

                foreach ($sizesList as $sInfo) {
                    foreach ($colorsList as $cInfo) {
                        $sCode         = $sInfo['code'];
                        $variantName   = $name . ' - ' . $sInfo['name'] . ' / ' . $cInfo['name'];
                        $vSellingPrice = round($sellingPrice * $sInfo['mult'], 2);
                        $vSku          = $sku . '-' . $sCode . '-' . strtoupper(substr($cInfo['name'], 0, 3));
                        $variantId     = $variantsCount++;
                        $vBarcode      = '888' . str_pad((string)$variantId, 11, '0', STR_PAD_LEFT);
                        $vImgUrl       = $imgsList[($cInfo['cIdx'] - 1) % count($imgsList)];

                        $productVariants[] = [
                            'id'            => $variantId,
                            'product_id'    => $i,
                            'name'          => $variantName,
                            'sku'           => $vSku,
                            'barcode'       => $vBarcode,
                            'cost_price'    => round($costPrice * $sInfo['mult'], 2),
                            'selling_price' => $vSellingPrice,
                            'compare_price' => round($vSellingPrice * 1.2, 2),
                            'weight'        => rand(10, 50) / 10,
                            'image'         => $vImgUrl,
                            'is_active'     => true,
                            'created_at'    => now(),
                            'updated_at'    => now(),
                        ];

                        // Size attribute value
                        $productVariantValues[] = [
                            'product_variant_id' => $variantId,
                            'attribute_id'       => 2, // Size
                            'attribute_value_id' => $sInfo['attr_val_id'],
                            'created_at'         => now(),
                            'updated_at'         => now(),
                        ];

                        // Color attribute value
                        $productVariantValues[] = [
                            'product_variant_id' => $variantId,
                            'attribute_id'       => 1, // Color
                            'attribute_value_id' => $cInfo['attr_val_id'],
                            'created_at'         => now(),
                            'updated_at'         => now(),
                        ];

                        // Variant pricing
                        $productPrices[] = [
                            'product_id' => $i,
                            'product_variant_id' => $variantId,
                            'price_type' => 'retail',
                            'min_qty' => 1,
                            'price' => $vSellingPrice,
                            'currency_code' => 'USD',
                            'start_date' => null,
                            'end_date' => null,
                            'is_active' => true,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
            }
        }

        DB::table('products')->insert($products);
        DB::table('product_images')->insert($productImages);
        DB::table('product_variants')->insert($productVariants);
        DB::table('product_variant_values')->insert($productVariantValues);
        DB::table('product_prices')->insert($productPrices);

        if (DB::getDriverName() === 'pgsql') {
            $tables = ['categories', 'brands', 'units', 'taxes', 'attributes', 'attribute_values', 'products', 'product_variants', 'product_variant_values', 'inventories', 'product_images', 'product_prices'];
            foreach ($tables as $table) {
                DB::statement("SELECT setval('{$table}_id_seq', COALESCE((SELECT MAX(id) FROM {$table}), 0) + 1, false);");
            }
        }
    }
}
