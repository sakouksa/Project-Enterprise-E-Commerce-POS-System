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
        DB::table('cart_items')->delete();
        DB::table('wishlists')->delete();
        DB::table('review_images')->delete();
        DB::table('product_reviews')->delete();
        DB::table('flash_sale_products')->delete();
        DB::table('coupon_products')->delete();
        DB::table('sale_return_items')->delete();
        DB::table('sale_items')->delete();
        DB::table('order_items')->delete();
        DB::table('purchase_return_items')->delete();
        DB::table('purchase_items')->delete();
        DB::table('stock_adjustment_items')->delete();
        DB::table('stock_transfer_items')->delete();
        DB::table('stock_opname_items')->delete();
        DB::table('inventory_movements')->delete();
        DB::table('inventories')->delete();
        DB::table('product_variant_values')->delete();
        DB::table('product_variants')->delete();
        DB::table('product_prices')->delete();
        DB::table('product_images')->delete();
        DB::table('products')->delete();
        DB::table('attribute_values')->delete();
        DB::table('attributes')->delete();
        DB::table('taxes')->delete();
        DB::table('units')->delete();
        DB::table('brands')->delete();
        DB::table('categories')->delete();

        $companyId = Company::value('id') ?? 1;

        // 1. Categories (10 distinct standard categories)
        $categories = [
            ['name' => 'Smartphones',  'slug' => 'smartphones',  'sort_order' => 1, 'image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80'],
            ['name' => 'Laptops',      'slug' => 'laptops',      'sort_order' => 2, 'image' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&auto=format&fit=crop&q=80'],
            ['name' => 'Monitors',     'slug' => 'monitors',     'sort_order' => 3, 'image' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80'],
            ['name' => 'Smartwatches', 'slug' => 'smartwatches', 'sort_order' => 4, 'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80'],
            ['name' => 'Keyboards',    'slug' => 'keyboards',    'sort_order' => 5, 'image' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80'],
            ['name' => 'Audio',        'slug' => 'audio',        'sort_order' => 6, 'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80'],
            ['name' => 'Cameras',      'slug' => 'cameras',      'sort_order' => 7, 'image' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=80'],
            ['name' => 'Chargers',     'slug' => 'chargers',     'sort_order' => 8, 'image' => 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80'],
            ['name' => 'Shoes',        'slug' => 'shoes',        'sort_order' => 9, 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80'],
            ['name' => 'Apparel',      'slug' => 'apparel',      'sort_order' => 10, 'image' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80'],
        ];
        foreach ($categories as $i => &$cat) {
            $cat['id'] = $i + 1;
            $cat['company_id'] = $companyId;
            $cat['parent_id'] = null;
            $cat['description'] = "High quality " . strtolower($cat['name']);
            $cat['is_active'] = true;
            $cat['created_at'] = now();
            $cat['updated_at'] = now();
        }
        unset($cat);
        DB::table('categories')->insert($categories);

        // 2. Brands (10 records)
        $brands = [
            ['name' => 'Apple',    'slug' => 'apple',    'logo' => 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&auto=format&fit=crop&q=80', 'description' => 'Premium electronics, iPhone, iPad and Mac'],
            ['name' => 'Samsung',  'slug' => 'samsung',  'logo' => 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&auto=format&fit=crop&q=80', 'description' => 'Leading innovation in Galaxy smartphones and displays'],
            ['name' => 'Xiaomi',   'slug' => 'xiaomi',   'logo' => 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&auto=format&fit=crop&q=80', 'description' => 'Smart hardware and lifestyle electronics'],
            ['name' => 'Oppo',     'slug' => 'oppo',     'logo' => 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300&auto=format&fit=crop&q=80', 'description' => 'Mobile photography and smart devices'],
            ['name' => 'Asus',     'slug' => 'asus',     'logo' => 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&auto=format&fit=crop&q=80', 'description' => 'ROG Gaming laptops and motherboard components'],
            ['name' => 'HP',       'slug' => 'hp',       'logo' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80', 'description' => 'Enterprise workstations and sleek laptops'],
            ['name' => 'Dell',     'slug' => 'dell',     'logo' => 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&auto=format&fit=crop&q=80', 'description' => 'XPS series and high performance computing'],
            ['name' => 'Sony',     'slug' => 'sony',     'logo' => 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80', 'description' => 'Alpha cameras, PlayStation and studio audio'],
            ['name' => 'JBL',      'slug' => 'jbl',      'logo' => 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&auto=format&fit=crop&q=80', 'description' => 'Pro acoustic speakers and wireless sound'],
            ['name' => 'Logitech', 'slug' => 'logitech', 'logo' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&auto=format&fit=crop&q=80', 'description' => 'MX Master peripherals and gaming keyboards'],
        ];
        foreach ($brands as $i => &$brand) {
            $brand['id'] = $i + 1;
            $brand['company_id'] = $companyId;
            $brand['is_active'] = true;
            $brand['created_at'] = now();
            $brand['updated_at'] = now();
        }
        unset($brand);
        DB::table('brands')->insert($brands);

        // 3. Units (3 records)
        $units = [
            ['id' => 1, 'company_id' => $companyId, 'name' => 'Piece', 'symbol' => 'pcs',  'description' => 'Single item unit', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'company_id' => $companyId, 'name' => 'Pair',  'symbol' => 'pair', 'description' => 'Pair of items',    'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'company_id' => $companyId, 'name' => 'Box',   'symbol' => 'box',  'description' => 'Box of items',     'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('units')->insert($units);

        // 4. Taxes (3 records)
        $taxes = [
            ['id' => 1, 'company_id' => $companyId, 'name' => 'VAT 10%',   'rate' => 10.0000, 'type' => 'percentage', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'company_id' => $companyId, 'name' => 'Service 5%', 'rate' => 5.0000,  'type' => 'percentage', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'company_id' => $companyId, 'name' => 'Zero Tax',   'rate' => 0.0000,  'type' => 'fixed',      'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('taxes')->insert($taxes);

        // 5. Attributes (Color + Category-specific attributes)
        $attributes = [
            ['id' => 1,  'company_id' => $companyId, 'name' => 'Color',                     'type' => 'color',  'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2,  'company_id' => $companyId, 'name' => 'Storage & RAM',             'type' => 'button', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3,  'company_id' => $companyId, 'name' => 'RAM & Storage',             'type' => 'button', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4,  'company_id' => $companyId, 'name' => 'Display Resolution & Rate', 'type' => 'button', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5,  'company_id' => $companyId, 'name' => 'Case Size & Connectivity',  'type' => 'button', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6,  'company_id' => $companyId, 'name' => 'Switch Type & Format',      'type' => 'button', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7,  'company_id' => $companyId, 'name' => 'Audio Spec & Features',     'type' => 'button', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 8,  'company_id' => $companyId, 'name' => 'Lens Kit & Sensor Spec',     'type' => 'button', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 9,  'company_id' => $companyId, 'name' => 'Output Wattage & Ports',     'type' => 'button', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 10, 'company_id' => $companyId, 'name' => 'Shoe Size',                 'type' => 'button', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 11, 'company_id' => $companyId, 'name' => 'Clothing Size',             'type' => 'button', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('attributes')->insert($attributes);

        // Attribute Values
        $attributeValues = [
            // Colors (Attribute 1)
            ['id' => 1,  'attribute_id' => 1, 'value' => 'Black',            'color_code' => '#111827', 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2,  'attribute_id' => 1, 'value' => 'White',            'color_code' => '#ffffff', 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3,  'attribute_id' => 1, 'value' => 'Silver',           'color_code' => '#c0c0c0', 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4,  'attribute_id' => 1, 'value' => 'Space Gray',       'color_code' => '#4b5563', 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5,  'attribute_id' => 1, 'value' => 'Natural Titanium', 'color_code' => '#94a3b8', 'sort_order' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6,  'attribute_id' => 1, 'value' => 'Midnight',         'color_code' => '#1e293b', 'sort_order' => 6, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7,  'attribute_id' => 1, 'value' => 'Starlight',        'color_code' => '#f1f5f9', 'sort_order' => 7, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 8,  'attribute_id' => 1, 'value' => 'Navy',             'color_code' => '#1e3a8a', 'sort_order' => 8, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 9,  'attribute_id' => 1, 'value' => 'Red',              'color_code' => '#ef4444', 'sort_order' => 9, 'created_at' => now(), 'updated_at' => now()],

            // Smartphones Storage (Attribute 2)
            ['id' => 10, 'attribute_id' => 2, 'value' => '128GB', 'color_code' => null, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 11, 'attribute_id' => 2, 'value' => '256GB', 'color_code' => null, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 12, 'attribute_id' => 2, 'value' => '512GB', 'color_code' => null, 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 13, 'attribute_id' => 2, 'value' => '1TB',   'color_code' => null, 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],

            // Laptops RAM & Storage (Attribute 3)
            ['id' => 14, 'attribute_id' => 3, 'value' => '8GB / 256GB',  'color_code' => null, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 15, 'attribute_id' => 3, 'value' => '16GB / 512GB', 'color_code' => null, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 16, 'attribute_id' => 3, 'value' => '16GB / 1TB',   'color_code' => null, 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 17, 'attribute_id' => 3, 'value' => '32GB / 1TB',   'color_code' => null, 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],

            // Monitors Display (Attribute 4)
            ['id' => 18, 'attribute_id' => 4, 'value' => '24" FHD 1080p',     'color_code' => null, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 19, 'attribute_id' => 4, 'value' => '27" QHD 144Hz',     'color_code' => null, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 20, 'attribute_id' => 4, 'value' => '27" 4K UHD',        'color_code' => null, 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 21, 'attribute_id' => 4, 'value' => '34" Ultrawide 144Hz','color_code' => null, 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],

            // Smartwatches Case (Attribute 5)
            ['id' => 22, 'attribute_id' => 5, 'value' => '40mm / GPS',      'color_code' => null, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 23, 'attribute_id' => 5, 'value' => '44mm / Cellular', 'color_code' => null, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 24, 'attribute_id' => 5, 'value' => '49mm Ultra',      'color_code' => null, 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],

            // Keyboards Switch (Attribute 6)
            ['id' => 25, 'attribute_id' => 6, 'value' => 'Red Switch',   'color_code' => null, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 26, 'attribute_id' => 6, 'value' => 'Blue Switch',  'color_code' => null, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 27, 'attribute_id' => 6, 'value' => 'Brown Switch', 'color_code' => null, 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 28, 'attribute_id' => 6, 'value' => 'Wireless RGB', 'color_code' => null, 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],

            // Audio Spec (Attribute 7)
            ['id' => 29, 'attribute_id' => 7, 'value' => 'Standard Wired',         'color_code' => null, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 30, 'attribute_id' => 7, 'value' => 'Wireless Bluetooth',     'color_code' => null, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 31, 'attribute_id' => 7, 'value' => 'Active Noise Canceling', 'color_code' => null, 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 32, 'attribute_id' => 7, 'value' => 'Pro Studio 50W',         'color_code' => null, 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],

            // Cameras Lens (Attribute 8)
            ['id' => 33, 'attribute_id' => 8, 'value' => 'Body Only',        'color_code' => null, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 34, 'attribute_id' => 8, 'value' => 'Kit Lens 18-55mm', 'color_code' => null, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 35, 'attribute_id' => 8, 'value' => 'Pro Zoom 24-70mm', 'color_code' => null, 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],

            // Chargers Wattage (Attribute 9)
            ['id' => 36, 'attribute_id' => 9, 'value' => '20W USB-C',            'color_code' => null, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 37, 'attribute_id' => 9, 'value' => '35W Dual USB-C',       'color_code' => null, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 38, 'attribute_id' => 9, 'value' => '65W GaN Fast Charger', 'color_code' => null, 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 39, 'attribute_id' => 9, 'value' => '100W GaN Pro',         'color_code' => null, 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],

            // Shoes Size (Attribute 10)
            ['id' => 40, 'attribute_id' => 10, 'value' => 'EU 39', 'color_code' => null, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 41, 'attribute_id' => 10, 'value' => 'EU 40', 'color_code' => null, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 42, 'attribute_id' => 10, 'value' => 'EU 41', 'color_code' => null, 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 43, 'attribute_id' => 10, 'value' => 'EU 42', 'color_code' => null, 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 44, 'attribute_id' => 10, 'value' => 'EU 43', 'color_code' => null, 'sort_order' => 5, 'created_at' => now(), 'updated_at' => now()],

            // Apparel Size (Attribute 11)
            ['id' => 45, 'attribute_id' => 11, 'value' => 'S',   'color_code' => null, 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 46, 'attribute_id' => 11, 'value' => 'M',   'color_code' => null, 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 47, 'attribute_id' => 11, 'value' => 'L',   'color_code' => null, 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 48, 'attribute_id' => 11, 'value' => 'XL',  'color_code' => null, 'sort_order' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['id' => 49, 'attribute_id' => 11, 'value' => 'XXL', 'color_code' => null, 'sort_order' => 5, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('attribute_values')->insert($attributeValues);

        // Curated Image URLs per Category
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
            'monitors' => [
                'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&auto=format&fit=crop&q=80',
            ],
            'smartwatches' => [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
            ],
            'keyboards' => [
                'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80',
            ],
            'audio' => [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80',
            ],
            'cameras' => [
                'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80',
            ],
            'chargers' => [
                'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1622445268121-ac11f17a2834?w=600&auto=format&fit=crop&q=80',
            ],
            'shoes' => [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80',
            ],
            'apparel' => [
                'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
            ],
        ];

        // Specific category matrix specs configuration
        $categorySpecs = [
            'smartphones' => [
                'attr_id' => 2,
                'specs' => [
                    ['code' => '128GB', 'mult' => 1.00, 'attr_val_id' => 10],
                    ['code' => '256GB', 'mult' => 1.20, 'attr_val_id' => 11],
                    ['code' => '512GB', 'mult' => 1.45, 'attr_val_id' => 12],
                    ['code' => '1TB',   'mult' => 1.75, 'attr_val_id' => 13],
                ],
                'colors' => [
                    ['name' => 'Black',            'attr_val_id' => 1, 'cIdx' => 1],
                    ['name' => 'Natural Titanium', 'attr_val_id' => 5, 'cIdx' => 2],
                    ['name' => 'Silver',           'attr_val_id' => 3, 'cIdx' => 3],
                ],
            ],
            'laptops' => [
                'attr_id' => 3,
                'specs' => [
                    ['code' => '8GB / 256GB',  'mult' => 1.00, 'attr_val_id' => 14],
                    ['code' => '16GB / 512GB', 'mult' => 1.25, 'attr_val_id' => 15],
                    ['code' => '16GB / 1TB',   'mult' => 1.45, 'attr_val_id' => 16],
                    ['code' => '32GB / 1TB',   'mult' => 1.70, 'attr_val_id' => 17],
                ],
                'colors' => [
                    ['name' => 'Space Gray', 'attr_val_id' => 4, 'cIdx' => 1],
                    ['name' => 'Silver',     'attr_val_id' => 3, 'cIdx' => 2],
                    ['name' => 'Midnight',   'attr_val_id' => 6, 'cIdx' => 3],
                ],
            ],
            'monitors' => [
                'attr_id' => 4,
                'specs' => [
                    ['code' => '24" FHD 1080p',      'mult' => 1.00, 'attr_val_id' => 18],
                    ['code' => '27" QHD 144Hz',      'mult' => 1.30, 'attr_val_id' => 19],
                    ['code' => '27" 4K UHD',         'mult' => 1.60, 'attr_val_id' => 20],
                    ['code' => '34" Ultrawide 144Hz','mult' => 2.10, 'attr_val_id' => 21],
                ],
                'colors' => [
                    ['name' => 'Black',  'attr_val_id' => 1, 'cIdx' => 1],
                    ['name' => 'White',  'attr_val_id' => 2, 'cIdx' => 2],
                    ['name' => 'Silver', 'attr_val_id' => 3, 'cIdx' => 3],
                ],
            ],
            'smartwatches' => [
                'attr_id' => 5,
                'specs' => [
                    ['code' => '40mm / GPS',      'mult' => 1.00, 'attr_val_id' => 22],
                    ['code' => '44mm / Cellular', 'mult' => 1.15, 'attr_val_id' => 23],
                    ['code' => '49mm Ultra',      'mult' => 1.50, 'attr_val_id' => 24],
                ],
                'colors' => [
                    ['name' => 'Midnight',  'attr_val_id' => 6, 'cIdx' => 1],
                    ['name' => 'Starlight', 'attr_val_id' => 7, 'cIdx' => 2],
                    ['name' => 'Silver',    'attr_val_id' => 3, 'cIdx' => 3],
                ],
            ],
            'keyboards' => [
                'attr_id' => 6,
                'specs' => [
                    ['code' => 'Red Switch',   'mult' => 1.00, 'attr_val_id' => 25],
                    ['code' => 'Blue Switch',  'mult' => 1.00, 'attr_val_id' => 26],
                    ['code' => 'Brown Switch', 'mult' => 1.00, 'attr_val_id' => 27],
                    ['code' => 'Wireless RGB', 'mult' => 1.15, 'attr_val_id' => 28],
                ],
                'colors' => [
                    ['name' => 'Black',  'attr_val_id' => 1, 'cIdx' => 1],
                    ['name' => 'White',  'attr_val_id' => 2, 'cIdx' => 2],
                    ['name' => 'Silver', 'attr_val_id' => 3, 'cIdx' => 3],
                ],
            ],
            'audio' => [
                'attr_id' => 7,
                'specs' => [
                    ['code' => 'Standard Wired',         'mult' => 1.00, 'attr_val_id' => 29],
                    ['code' => 'Wireless Bluetooth',     'mult' => 1.20, 'attr_val_id' => 30],
                    ['code' => 'Active Noise Canceling', 'mult' => 1.50, 'attr_val_id' => 31],
                    ['code' => 'Pro Studio 50W',         'mult' => 1.80, 'attr_val_id' => 32],
                ],
                'colors' => [
                    ['name' => 'Black', 'attr_val_id' => 1, 'cIdx' => 1],
                    ['name' => 'White', 'attr_val_id' => 2, 'cIdx' => 2],
                    ['name' => 'Navy',  'attr_val_id' => 8, 'cIdx' => 3],
                ],
            ],
            'cameras' => [
                'attr_id' => 8,
                'specs' => [
                    ['code' => 'Body Only',        'mult' => 1.00, 'attr_val_id' => 33],
                    ['code' => 'Kit Lens 18-55mm', 'mult' => 1.20, 'attr_val_id' => 34],
                    ['code' => 'Pro Zoom 24-70mm', 'mult' => 1.90, 'attr_val_id' => 35],
                ],
                'colors' => [
                    ['name' => 'Black',  'attr_val_id' => 1, 'cIdx' => 1],
                    ['name' => 'Silver', 'attr_val_id' => 3, 'cIdx' => 2],
                ],
            ],
            'chargers' => [
                'attr_id' => 9,
                'specs' => [
                    ['code' => '20W USB-C',            'mult' => 1.00, 'attr_val_id' => 36],
                    ['code' => '35W Dual USB-C',       'mult' => 1.30, 'attr_val_id' => 37],
                    ['code' => '65W GaN Fast Charger', 'mult' => 1.60, 'attr_val_id' => 38],
                    ['code' => '100W GaN Pro',         'mult' => 2.00, 'attr_val_id' => 39],
                ],
                'colors' => [
                    ['name' => 'Black', 'attr_val_id' => 1, 'cIdx' => 1],
                    ['name' => 'White', 'attr_val_id' => 2, 'cIdx' => 2],
                ],
            ],
            'shoes' => [
                'attr_id' => 10,
                'specs' => [
                    ['code' => 'EU 39', 'mult' => 1.00, 'attr_val_id' => 40],
                    ['code' => 'EU 40', 'mult' => 1.00, 'attr_val_id' => 41],
                    ['code' => 'EU 41', 'mult' => 1.00, 'attr_val_id' => 42],
                    ['code' => 'EU 42', 'mult' => 1.00, 'attr_val_id' => 43],
                    ['code' => 'EU 43', 'mult' => 1.00, 'attr_val_id' => 44],
                ],
                'colors' => [
                    ['name' => 'Black', 'attr_val_id' => 1, 'cIdx' => 1],
                    ['name' => 'White', 'attr_val_id' => 2, 'cIdx' => 2],
                    ['name' => 'Red',   'attr_val_id' => 9, 'cIdx' => 3],
                ],
            ],
            'apparel' => [
                'attr_id' => 11,
                'specs' => [
                    ['code' => 'S',   'mult' => 0.90, 'attr_val_id' => 45],
                    ['code' => 'M',   'mult' => 1.00, 'attr_val_id' => 46],
                    ['code' => 'L',   'mult' => 1.10, 'attr_val_id' => 47],
                    ['code' => 'XL',  'mult' => 1.20, 'attr_val_id' => 48],
                    ['code' => 'XXL', 'mult' => 1.30, 'attr_val_id' => 49],
                ],
                'colors' => [
                    ['name' => 'Black', 'attr_val_id' => 1, 'cIdx' => 1],
                    ['name' => 'White', 'attr_val_id' => 2, 'cIdx' => 2],
                    ['name' => 'Navy',  'attr_val_id' => 8, 'cIdx' => 3],
                ],
            ],
        ];

        // 100 Authentic Commercial Products Catalog
        $productCatalog = [
            // 1. Smartphones (IDs 1-10)
            1  => ['name' => 'Apple iPhone 15 Pro Max',         'brand_id' => 1,  'cat_idx' => 0, 'sku' => 'SKU-APL-IP15PM',   'barcode' => '8880150001015', 'cost' => 890.00,  'price' => 1199.00, 'short' => 'Flagship Titanium design with A17 Pro chip and 5x Telephoto camera.'],
            2  => ['name' => 'Samsung Galaxy S24 Ultra 5G',     'brand_id' => 2,  'cat_idx' => 0, 'sku' => 'SKU-SAM-S24U',     'barcode' => '8880150001022', 'cost' => 820.00,  'price' => 1099.00, 'short' => 'Galaxy AI flagship with built-in S Pen, Titanium frame, and 200MP camera.'],
            3  => ['name' => 'Xiaomi 14 Ultra Leica Pro',       'brand_id' => 3,  'cat_idx' => 0, 'sku' => 'SKU-XIA-14U',      'barcode' => '8880150001039', 'cost' => 680.00,  'price' => 920.00,  'short' => 'Quad Leica camera system with stepless variable aperture and Snapdragon 8 Gen 3.'],
            4  => ['name' => 'Oppo Find X7 Ultra Dual-Periscope','brand_id' => 4, 'cat_idx' => 0, 'sku' => 'SKU-OPP-FX7U',     'barcode' => '8880150001046', 'cost' => 650.00,  'price' => 870.00,  'short' => 'World first Dual-Periscope telephoto camera with Hasselblad portrait engine.'],
            5  => ['name' => 'Apple iPhone 15 Plus',            'brand_id' => 1,  'cat_idx' => 0, 'sku' => 'SKU-APL-IP15P',    'barcode' => '8880150001053', 'cost' => 650.00,  'price' => 899.00,  'short' => 'Dynamic Island, 48MP Main camera, and all-day battery life in a 6.7-inch display.'],
            6  => ['name' => 'Samsung Galaxy Z Fold 5',         'brand_id' => 2,  'cat_idx' => 0, 'sku' => 'SKU-SAM-ZF5',      'barcode' => '8880150001060', 'cost' => 1100.00, 'price' => 1499.00, 'short' => 'Premium foldable smartphone with massive 7.6-inch Dynamic AMOLED 2X display.'],
            7  => ['name' => 'Asus ROG Phone 8 Pro Edition',    'brand_id' => 5,  'cat_idx' => 0, 'sku' => 'SKU-ASU-ROG8P',    'barcode' => '8880150001077', 'cost' => 750.00,  'price' => 999.00,  'short' => 'Ultimate gaming smartphone with AniMe Vision Matrix and 165Hz AMOLED display.'],
            8  => ['name' => 'Xiaomi Redmi Note 13 Pro+ 5G',    'brand_id' => 3,  'cat_idx' => 0, 'sku' => 'SKU-XIA-RN13P',    'barcode' => '8880150001084', 'cost' => 260.00,  'price' => 379.00,  'short' => '200MP OIS camera with 120W HyperCharge and curved 1.5K CrystalRes display.'],
            9  => ['name' => 'Oppo Reno 11 Pro 5G',             'brand_id' => 4,  'cat_idx' => 0, 'sku' => 'SKU-OPP-R11P',     'barcode' => '8880150001091', 'cost' => 310.00,  'price' => 449.00,  'short' => '32MP Telephoto portrait camera with 80W SUPERVOOC Flash Charge.'],
            10 => ['name' => 'Samsung Galaxy A55 5G',           'brand_id' => 2,  'cat_idx' => 0, 'sku' => 'SKU-SAM-A55',      'barcode' => '8880150001107', 'cost' => 280.00,  'price' => 399.00,  'short' => 'Metal frame with Knox Vault security and 50MP optical image stabilization.'],

            // 2. Laptops (IDs 11-20)
            11 => ['name' => 'Apple MacBook Pro 16 M3 Max',     'brand_id' => 1,  'cat_idx' => 1, 'sku' => 'SKU-APL-MBP16M3',  'barcode' => '8880150001114', 'cost' => 2400.00, 'price' => 3199.00, 'short' => 'Liquid Retina XDR display with M3 Max 16-core CPU and 40-core GPU.'],
            12 => ['name' => 'Apple MacBook Air 15 M3',         'brand_id' => 1,  'cat_idx' => 1, 'sku' => 'SKU-APL-MBA15M3',  'barcode' => '8880150001121', 'cost' => 980.00,  'price' => 1299.00, 'short' => 'Strikingly thin design with up to 18 hours battery life and 15.3-inch Liquid Retina.'],
            13 => ['name' => 'Dell XPS 15 9530 Core i7',        'brand_id' => 7,  'cat_idx' => 1, 'sku' => 'SKU-DEL-XPS15',    'barcode' => '8880150001138', 'cost' => 1350.00, 'price' => 1799.00, 'short' => 'InfinityEdge OLED 3.5K touch display with Intel Core i7 and RTX 4060 graphics.'],
            14 => ['name' => 'Dell Latitude 7440 Enterprise',   'brand_id' => 7,  'cat_idx' => 1, 'sku' => 'SKU-DEL-LAT7440',  'barcode' => '8880150001145', 'cost' => 950.00,  'price' => 1290.00, 'short' => 'Ultralight magnesium business laptop with Intel vPro and AI noise reduction.'],
            15 => ['name' => 'HP Spectre x360 14 OLED 2-in-1',  'brand_id' => 6,  'cat_idx' => 1, 'sku' => 'SKU-HP-SPEC14',    'barcode' => '8880150001152', 'cost' => 1150.00, 'price' => 1549.00, 'short' => '2.8K OLED touchscreen with Intel Core Ultra 7 and 9MP AI camera with night mode.'],
            16 => ['name' => 'HP EliteBook 840 G10 Enterprise', 'brand_id' => 6,  'cat_idx' => 1, 'sku' => 'SKU-HP-EB840G10',  'barcode' => '8880150001169', 'cost' => 920.00,  'price' => 1250.00, 'short' => 'Premium hybrid work enterprise notebook with HP Wolf Security protection.'],
            17 => ['name' => 'Asus ROG Strix SCAR 18 RTX 4090', 'brand_id' => 5,  'cat_idx' => 1, 'sku' => 'SKU-ASU-ROG18',    'barcode' => '8880150001176', 'cost' => 2700.00, 'price' => 3499.00, 'short' => 'Intel Core i9 14900HX, RTX 4090 175W, and 18-inch 2.5K 240Hz Nebula HDR display.'],
            18 => ['name' => 'Asus Zenbook 14 OLED Ultra 7',    'brand_id' => 5,  'cat_idx' => 1, 'sku' => 'SKU-ASU-ZB14',     'barcode' => '8880150001183', 'cost' => 820.00,  'price' => 1099.00, 'short' => 'Ultra-portable 1.2kg chassis with 120Hz 3K Lumina OLED display and NPU AI boost.'],
            19 => ['name' => 'Dell Alienware m16 R2 Gaming',    'brand_id' => 7,  'cat_idx' => 1, 'sku' => 'SKU-DEL-ALW16',    'barcode' => '8880150001190', 'cost' => 1600.00, 'price' => 2199.00, 'short' => 'Cryo-tech cooling with QHD+ 240Hz display and NVIDIA GeForce RTX 4070.'],
            20 => ['name' => 'HP Omen 16 RTX 4070 Gaming',      'brand_id' => 6,  'cat_idx' => 1, 'sku' => 'SKU-HP-OMEN16',    'barcode' => '8880150001206', 'cost' => 1200.00, 'price' => 1599.00, 'short' => 'Omen Tempest Cooling architecture with 240Hz QHD display and RGB keyboard.'],

            // 3. Monitors (IDs 21-30)
            21 => ['name' => 'Samsung Odyssey OLED G9 49" Curv','brand_id' => 2,  'cat_idx' => 2, 'sku' => 'SKU-SAM-G9OLED',   'barcode' => '8880150001213', 'cost' => 1100.00, 'price' => 1499.00, 'short' => '49-inch Dual QHD 240Hz 0.03ms curved gaming monitor with Neo Quantum Processor.'],
            22 => ['name' => 'Dell UltraSharp 32 4K USB-C Hub', 'brand_id' => 7,  'cat_idx' => 2, 'sku' => 'SKU-DEL-U3224KB',  'barcode' => '8880150001220', 'cost' => 720.00,  'price' => 980.00,  'short' => 'IPS Black technology with 4K HDR, 90W power delivery hub and 4K HDR webcam.'],
            23 => ['name' => 'Asus ROG Swift OLED PG32UCDM 4K', 'brand_id' => 5,  'cat_idx' => 2, 'sku' => 'SKU-ASU-PG32U',    'barcode' => '8880150001237', 'cost' => 950.00,  'price' => 1299.00, 'short' => '32-inch 4K QD-OLED panel with 240Hz refresh rate and custom heatsink cooling.'],
            24 => ['name' => 'Samsung ViewFinity S9 5K Pro',    'brand_id' => 2,  'cat_idx' => 2, 'sku' => 'SKU-SAM-S95K',     'barcode' => '8880150001244', 'cost' => 900.00,  'price' => 1199.00, 'short' => '27-inch 5K (5120 x 2880) resolution display with 99% DCI-P3 and Smart Calibration.'],
            25 => ['name' => 'Dell Gaming S2721DGF 165Hz QHD',  'brand_id' => 7,  'cat_idx' => 2, 'sku' => 'SKU-DEL-S2721',    'barcode' => '8880150001251', 'cost' => 240.00,  'price' => 349.00,  'short' => 'Fast IPS QHD display with 165Hz refresh rate and AMD FreeSync Premium Pro.'],
            26 => ['name' => 'HP Series 7 Pro 4K Conference',   'brand_id' => 6,  'cat_idx' => 2, 'sku' => 'SKU-HP-S7PRO',     'barcode' => '8880150001268', 'cost' => 480.00,  'price' => 650.00,  'short' => 'Professional 31.5-inch 4K monitor with integrated 5MP pop-up privacy webcam.'],
            27 => ['name' => 'Asus ProArt Display 27 4K HDR',   'brand_id' => 5,  'cat_idx' => 2, 'sku' => 'SKU-ASU-PA279CV',  'barcode' => '8880150001275', 'cost' => 380.00,  'price' => 520.00,  'short' => 'Factory pre-calibrated 100% sRGB/Rec.709 with Calman Verification for designers.'],
            28 => ['name' => 'Samsung Odyssey Neo G7 32" 4K',   'brand_id' => 2,  'cat_idx' => 2, 'sku' => 'SKU-SAM-G7MINI',   'barcode' => '8880150001282', 'cost' => 620.00,  'price' => 849.00,  'short' => 'Quantum Mini-LED 165Hz 1ms curved gaming monitor with Quantum HDR 2000.'],
            29 => ['name' => 'Dell UltraSharp 27 4K USB-C Hub', 'brand_id' => 7,  'cat_idx' => 2, 'sku' => 'SKU-DEL-U2723QE',  'barcode' => '8880150001299', 'cost' => 410.00,  'price' => 569.00,  'short' => 'Exceptional contrast 2000:1 with IPS Black and daisy chain multi-stream support.'],
            30 => ['name' => 'Asus TUF Gaming VG28UQL1A 4K',    'brand_id' => 5,  'cat_idx' => 2, 'sku' => 'SKU-ASU-VG28U',    'barcode' => '8880150001305', 'cost' => 440.00,  'price' => 599.00,  'short' => '28-inch 4K 144Hz Fast IPS with HDMI 2.1 for PS5, Xbox Series X, and PC gaming.'],

            // 4. Smartwatches (IDs 31-40)
            31 => ['name' => 'Apple Watch Ultra 2 Titanium',    'brand_id' => 1,  'cat_idx' => 3, 'sku' => 'SKU-APL-WULTRA2',  'barcode' => '8880150001312', 'cost' => 620.00,  'price' => 799.00,  'short' => 'Rugged 49mm titanium case with Precision dual-frequency GPS and 3000 nits display.'],
            32 => ['name' => 'Apple Watch Series 9 GPS 45mm',   'brand_id' => 1,  'cat_idx' => 3, 'sku' => 'SKU-APL-WS945',    'barcode' => '8880150001329', 'cost' => 320.00,  'price' => 429.00,  'short' => 'S9 SiP chip with Double Tap gesture control and advanced health sensors.'],
            33 => ['name' => 'Samsung Galaxy Watch6 Classic',   'brand_id' => 2,  'cat_idx' => 3, 'sku' => 'SKU-SAM-GW6C',     'barcode' => '8880150001336', 'cost' => 260.00,  'price' => 369.00,  'short' => 'Rotating bezel with Sapphire Crystal glass and BioActive sleep coaching sensor.'],
            34 => ['name' => 'Xiaomi Watch 2 Pro WearOS LTE',   'brand_id' => 3,  'cat_idx' => 3, 'sku' => 'SKU-XIA-W2PRO',    'barcode' => '8880150001343', 'cost' => 180.00,  'price' => 259.00,  'short' => 'Snapdragon W5+ Gen 1 with Google Wear OS, LTE eSIM and body composition analysis.'],
            35 => ['name' => 'Oppo Watch X Dual-Engine AMOLED', 'brand_id' => 4,  'cat_idx' => 3, 'sku' => 'SKU-OPP-WX',       'barcode' => '8880150001350', 'cost' => 210.00,  'price' => 299.00,  'short' => 'Dual-engine architecture with up to 100 hours battery life in smart mode.'],
            36 => ['name' => 'Apple Watch SE 2nd Gen 44mm',     'brand_id' => 1,  'cat_idx' => 3, 'sku' => 'SKU-APL-WSE44',    'barcode' => '8880150001367', 'cost' => 190.00,  'price' => 269.00,  'short' => 'Essential health and fitness tracking with Crash Detection and Retina OLED display.'],
            37 => ['name' => 'Samsung Galaxy Watch6 40mm',      'brand_id' => 2,  'cat_idx' => 3, 'sku' => 'SKU-SAM-GW640',    'barcode' => '8880150001374', 'cost' => 180.00,  'price' => 249.00,  'short' => 'Slim aluminum design with ECG monitoring and personalized heart rate zones.'],
            38 => ['name' => 'Xiaomi Smart Band 8 Pro AMOLED',  'brand_id' => 3,  'cat_idx' => 3, 'sku' => 'SKU-XIA-BAND8P',   'barcode' => '8880150001381', 'cost' => 45.00,   'price' => 75.00,   'short' => '1.74-inch large AMOLED screen with built-in GNSS satellite positioning.'],
            39 => ['name' => 'Samsung Galaxy Watch5 Pro 45mm',  'brand_id' => 2,  'cat_idx' => 3, 'sku' => 'SKU-SAM-GW5PRO',   'barcode' => '8880150001398', 'cost' => 220.00,  'price' => 319.00,  'short' => 'Titanium outdoor smartwatch with Track Back GPS navigation and huge 590mAh battery.'],
            40 => ['name' => 'Apple Watch Series 9 GPS 41mm',   'brand_id' => 1,  'cat_idx' => 3, 'sku' => 'SKU-APL-WS941',    'barcode' => '8880150001404', 'cost' => 290.00,  'price' => 399.00,  'short' => 'Compact 41mm case with on-device Siri processing and Precision Finding for iPhone.'],

            // 5. Keyboards (IDs 41-50)
            41 => ['name' => 'Logitech MX Mechanical Wireless', 'brand_id' => 10, 'cat_idx' => 4, 'sku' => 'SKU-LOG-MXMECH',   'barcode' => '8880150001411', 'cost' => 120.00,  'price' => 169.00, 'short' => 'Low-profile mechanical keys with tactile quiet switches and smart smart-backlighting.'],
            42 => ['name' => 'Asus ROG Azoth 75% Custom OLED',  'brand_id' => 5,  'cat_idx' => 4, 'sku' => 'SKU-ASU-AZOTH',    'barcode' => '8880150001428', 'cost' => 180.00,  'price' => 249.00, 'short' => 'Gasket mount mechanical keyboard with OLED display, hot-swappable ROG NX switches.'],
            43 => ['name' => 'Logitech G915 LIGHTSPEED RGB',    'brand_id' => 10, 'cat_idx' => 4, 'sku' => 'SKU-LOG-G915',     'barcode' => '8880150001435', 'cost' => 160.00,  'price' => 229.00, 'short' => 'Ultra-thin aircraft-grade aluminum mechanical keyboard with pro-grade wireless.'],
            44 => ['name' => 'Asus ROG Strix Scope II 96 RGB',  'brand_id' => 5,  'cat_idx' => 4, 'sku' => 'SKU-ASU-SCOPE2',   'barcode' => '8880150001442', 'cost' => 130.00,  'price' => 179.00, 'short' => '96% compact wireless keyboard with sound-dampening foam and multi-function button.'],
            45 => ['name' => 'Logitech MX Keys S Illuminated',  'brand_id' => 10, 'cat_idx' => 4, 'sku' => 'SKU-LOG-MXKEYS',   'barcode' => '8880150001459', 'cost' => 80.00,   'price' => 119.00, 'short' => 'Fluid spherically-dished keys with Smart Actions and multi-device Bluetooth Easy-Switch.'],
            46 => ['name' => 'Logitech G PRO X TKL Wireless',   'brand_id' => 10, 'cat_idx' => 4, 'sku' => 'SKU-LOG-GPROX',    'barcode' => '8880150001466', 'cost' => 140.00,  'price' => 199.00, 'short' => 'Champion-proven tenkeyless design engineered with LIGHTSPEED wireless and dual-shot PBT.'],
            47 => ['name' => 'Asus ROG Falchion RX 65% Slim',   'brand_id' => 5,  'cat_idx' => 4, 'sku' => 'SKU-ASU-FALCH',    'barcode' => '8880150001473', 'cost' => 120.00,  'price' => 169.00, 'short' => '65% low-profile wireless keyboard with pre-lubed ROG RX Optical switches and touch panel.'],
            48 => ['name' => 'Logitech Wave Keys Ergonomic',    'brand_id' => 10, 'cat_idx' => 4, 'sku' => 'SKU-LOG-WAVEK',    'barcode' => '8880150001480', 'cost' => 45.00,   'price' => 69.00,  'short' => 'Cushioned palm rest wave design certified by United States Ergonomics for all-day comfort.'],
            49 => ['name' => 'Apple Magic Keyboard Touch ID',   'brand_id' => 1,  'cat_idx' => 4, 'sku' => 'SKU-APL-MGKBTID',  'barcode' => '8880150001497', 'cost' => 130.00,  'price' => 179.00, 'short' => 'Wireless rechargeable keyboard with fast, easy, and secure authentication via Touch ID.'],
            50 => ['name' => 'Dell Premier Multi-Device KB700', 'brand_id' => 7,  'cat_idx' => 4, 'sku' => 'SKU-DEL-KB700',    'barcode' => '8880150001503', 'cost' => 55.00,   'price' => 79.00,  'short' => 'Seamlessly connect up to 3 devices across 2.4GHz RF and Bluetooth 5.0 with 36-month battery.'],

            // 6. Audio (IDs 51-60)
            51 => ['name' => 'Sony WH-1000XM5 ANC Headphones',  'brand_id' => 8,  'cat_idx' => 5, 'sku' => 'SKU-SNY-WH1000XM5','barcode' => '8880150001510', 'cost' => 260.00,  'price' => 379.00, 'short' => 'Industry-leading noise canceling with 8 microphones, Auto NC Optimizer, and 30hr battery.'],
            52 => ['name' => 'Apple AirPods Pro 2 USB-C ANC',   'brand_id' => 1,  'cat_idx' => 5, 'sku' => 'SKU-APL-APP2',     'barcode' => '8880150001527', 'cost' => 180.00,  'price' => 249.00, 'short' => 'H2 chip with Adaptive Audio, Transparency mode, and Personalized Spatial Audio.'],
            53 => ['name' => 'JBL PartyBox Stage 320 Bluetooth','brand_id' => 9,  'cat_idx' => 5, 'sku' => 'SKU-JBL-PB320',    'barcode' => '8880150001534', 'cost' => 420.00,  'price' => 599.00, 'short' => 'Powerful 240W RMS JBL Pro Sound with dynamic light show and telescopic handle with wheels.'],
            54 => ['name' => 'Sony WF-1000XM5 Wireless Earbuds','brand_id' => 8,  'cat_idx' => 5, 'sku' => 'SKU-SNY-WF1000XM5','barcode' => '8880150001541', 'cost' => 200.00,  'price' => 299.00, 'short' => 'Integrated Processor V2 with Dynamic Driver X for studio-grade Hi-Res Audio Wireless.'],
            55 => ['name' => 'JBL Quantum 910 Wireless Gaming', 'brand_id' => 9,  'cat_idx' => 5, 'sku' => 'SKU-JBL-Q910',     'barcode' => '8880150001558', 'cost' => 190.00,  'price' => 279.00, 'short' => 'QuantumSPHERE 360 audio with head-tracking and active noise canceling for esports.'],
            56 => ['name' => 'JBL Boombox 3 Portable Speaker',  'brand_id' => 9,  'cat_idx' => 5, 'sku' => 'SKU-JBL-BB3',      'barcode' => '8880150001565', 'cost' => 320.00,  'price' => 449.00, 'short' => 'Massive sound and deepest bass with 3-way speaker system and IP67 dust/water resistance.'],
            57 => ['name' => 'Apple AirPods Max Spatial Audio', 'brand_id' => 1,  'cat_idx' => 5, 'sku' => 'SKU-APL-APMAX',    'barcode' => '8880150001572', 'cost' => 390.00,  'price' => 549.00, 'short' => 'Computational audio with custom acoustic design and anodized aluminum ear cups.'],
            58 => ['name' => 'Sony SRS-RA5000 360 Audio Home',  'brand_id' => 8,  'cat_idx' => 5, 'sku' => 'SKU-SNY-RA5000',   'barcode' => '8880150001589', 'cost' => 450.00,  'price' => 620.00, 'short' => 'Ambient Room-Filling Sound with 7 driver units and automatic sound calibration.'],
            59 => ['name' => 'JBL Charge 5 Waterproof Speaker', 'brand_id' => 9,  'cat_idx' => 5, 'sku' => 'SKU-JBL-CHG5',     'barcode' => '8880150001596', 'cost' => 110.00,  'price' => 159.00, 'short' => 'Bold JBL Original Pro Sound with separate tweeter and built-in powerbank charger.'],
            60 => ['name' => 'Sony LinkBuds S Ultra-Light ANC', 'brand_id' => 8,  'cat_idx' => 5, 'sku' => 'SKU-SNY-LINKS',    'barcode' => '8880150001602', 'cost' => 120.00,  'price' => 179.00, 'short' => 'Ultra-small and lightweight design with smart automated listening behavior switching.'],

            // 7. Cameras (IDs 61-70)
            61 => ['name' => 'Sony Alpha 7 IV Full-Frame Hybrid','brand_id' => 8, 'cat_idx' => 6, 'sku' => 'SKU-SNY-A7M4',     'barcode' => '8880150001619', 'cost' => 1800.00, 'price' => 2399.00, 'short' => '33MP Exmor R sensor with BIONZ XR engine and 4K 60p 10-bit 4:2:2 movie recording.'],
            62 => ['name' => 'Sony FX3 Cinema Line Full-Frame',  'brand_id' => 8, 'cat_idx' => 6, 'sku' => 'SKU-SNY-FX3',      'barcode' => '8880150001626', 'cost' => 2900.00, 'price' => 3899.00, 'short' => 'Compact cage-free cinema body with cooling fan, XLR handle unit, and S-Cinetone colors.'],
            63 => ['name' => 'Sony Alpha 7C II Compact Hybrid',  'brand_id' => 8, 'cat_idx' => 6, 'sku' => 'SKU-SNY-A7C2',     'barcode' => '8880150001633', 'cost' => 1600.00, 'price' => 2199.00, 'short' => '33.0MP full-frame image sensor with dedicated AI processing unit for subject tracking.'],
            64 => ['name' => 'Sony ZV-E1 Full-Frame Vlog Camera','brand_id' => 8, 'cat_idx' => 6, 'sku' => 'SKU-SNY-ZVE1',     'barcode' => '8880150001640', 'cost' => 1650.00, 'price' => 2199.00, 'short' => 'Interchangeable-lens vlog camera with AI Auto Framing and Multiple Microphone capsules.'],
            65 => ['name' => 'Sony FE 24-70mm F2.8 GM II Lens',  'brand_id' => 8, 'cat_idx' => 6, 'sku' => 'SKU-SNY-2470GM2',  'barcode' => '8880150001657', 'cost' => 1700.00, 'price' => 2299.00, 'short' => 'Flagship standard zoom G Master lens with exceptional sharpness and four XD Linear Motors.'],
            66 => ['name' => 'Sony Alpha 6700 APS-C Hybrid',    'brand_id' => 8,  'cat_idx' => 6, 'sku' => 'SKU-SNY-A6700',    'barcode' => '8880150001664', 'cost' => 1050.00, 'price' => 1399.00, 'short' => '26.0MP back-illuminated Exmor R CMOS sensor with 4K 120p high-frame-rate capture.'],
            67 => ['name' => 'Sony FE 70-200mm F2.8 GM OSS II', 'brand_id' => 8,  'cat_idx' => 6, 'sku' => 'SKU-SNY-70200GM2', 'barcode' => '8880150001671', 'cost' => 2000.00, 'price' => 2699.00, 'short' => 'Lightest large-aperture F2.8 telephoto zoom lens with optical SteadyShot stabilization.'],
            68 => ['name' => 'Sony ZV-1 II Compact Vlogging',   'brand_id' => 8,  'cat_idx' => 6, 'sku' => 'SKU-SNY-ZV1M2',    'barcode' => '8880150001688', 'cost' => 620.00,  'price' => 799.00,  'short' => '18-50mm wide-angle zoom lens with Product Showcase Setting and Cinematic Vlog setting.'],
            69 => ['name' => 'Sony FE 50mm F1.4 GM Prime Lens', 'brand_id' => 8,  'cat_idx' => 6, 'sku' => 'SKU-SNY-50GM14',   'barcode' => '8880150001695', 'cost' => 950.00,  'price' => 1299.00, 'short' => 'Stunning G Master resolution and gorgeous bokeh in a compact, lightweight 50mm prime.'],
            70 => ['name' => 'Sony Alpha 7R V High-Res 61MP',   'brand_id' => 8,  'cat_idx' => 6, 'sku' => 'SKU-SNY-A7R5',     'barcode' => '8880150001701', 'cost' => 2800.00, 'price' => 3699.00, 'short' => '61.0MP full-frame Exmor R sensor with next-generation AI autofocus recognition.'],

            // 8. Chargers (IDs 71-80)
            71 => ['name' => 'Apple 70W USB-C Power Adapter',   'brand_id' => 1,  'cat_idx' => 7, 'sku' => 'SKU-APL-70WUSBC',  'barcode' => '8880150001718', 'cost' => 42.00,   'price' => 59.00,   'short' => 'Fast, efficient charging for MacBook Air, MacBook Pro, and iPad Pro USB-C devices.'],
            72 => ['name' => 'Xiaomi 120W HyperCharge GaN Pro', 'brand_id' => 3,  'cat_idx' => 7, 'sku' => 'SKU-XIA-120WGAN',  'barcode' => '8880150001725', 'cost' => 35.00,   'price' => 55.00,   'short' => 'High-power GaN semiconductor with multi-protocol fast charging and ten-layer security.'],
            73 => ['name' => 'Samsung 45W Power Adapter Trio',  'brand_id' => 2,  'cat_idx' => 7, 'sku' => 'SKU-SAM-45WTRIO',  'barcode' => '8880150001732', 'cost' => 28.00,   'price' => 45.00,   'short' => 'Simultaneously charge 3 devices with dual USB-C (45W/15W) and single USB-A (9W) ports.'],
            74 => ['name' => 'Xiaomi 67W GaN 2C1A Fast Charger','brand_id' => 3,  'cat_idx' => 7, 'sku' => 'SKU-XIA-67WGAN',   'barcode' => '8880150001749', 'cost' => 22.00,   'price' => 36.00,   'short' => 'Compact third-generation GaN technology with universal USB-C Power Delivery support.'],
            75 => ['name' => 'Apple 35W Dual USB-C Port Compact','brand_id' => 1, 'cat_idx' => 7, 'sku' => 'SKU-APL-35WDUAL',  'barcode' => '8880150001756', 'cost' => 40.00,   'price' => 59.00,   'short' => 'Simultaneously charge two devices at home, in the office, or on the go with folding prongs.'],
            76 => ['name' => 'Samsung 25W USB-C Wall Charger',  'brand_id' => 2,  'cat_idx' => 7, 'sku' => 'SKU-SAM-25WUSBC',  'barcode' => '8880150001763', 'cost' => 12.00,   'price' => 22.00,   'short' => 'Super Fast Charging up to 25W for Galaxy S-series and A-series with Power Delivery 3.0.'],
            77 => ['name' => 'Dell 130W USB-C GaN AC Adapter',  'brand_id' => 7,  'cat_idx' => 7, 'sku' => 'SKU-DEL-130WGAN',  'barcode' => '8880150001770', 'cost' => 58.00,   'price' => 85.00,   'short' => 'Compact OEM high-wattage power adapter designed for Dell XPS and Precision workstations.'],
            78 => ['name' => 'HP 65W USB-C Slim Power Adapter', 'brand_id' => 6,  'cat_idx' => 7, 'sku' => 'SKU-HP-65WUSBC',   'barcode' => '8880150001787', 'cost' => 38.00,   'price' => 55.00,   'short' => 'Slim, lightweight USB-C adapter with surge protection for HP Spectre and EliteBook.'],
            79 => ['name' => 'Apple MagSafe Charger 15W Qi2',   'brand_id' => 1,  'cat_idx' => 7, 'sku' => 'SKU-APL-MAGSAFE',  'barcode' => '8880150001794', 'cost' => 26.00,   'price' => 39.00,   'short' => 'Perfect magnetic alignment for faster wireless charging on iPhone 12 through iPhone 15.'],
            80 => ['name' => 'Xiaomi 50W Wireless Charging Stand','brand_id' => 3, 'cat_idx' => 7, 'sku' => 'SKU-XIA-50WSTAND', 'barcode' => '8880150001800', 'cost' => 32.00,   'price' => 49.00,   'short' => 'Ergonomic tilt design with built-in silent cooling fan for optimal thermal dissipation.'],

            // 9. Shoes (IDs 81-90)
            81 => ['name' => 'Nike Air Max 270 React Lifestyle', 'brand_id' => 3, 'cat_idx' => 8, 'sku' => 'SKU-NK-AM270',    'barcode' => '8880150001817', 'cost' => 85.00,   'price' => 135.00,  'short' => 'Max Air 270 unit delivers all-day cushioning with lightweight React foam technology.'],
            82 => ['name' => 'Adidas Ultraboost Light Running',  'brand_id' => 3,  'cat_idx' => 8, 'sku' => 'SKU-AD-UBLIGHT',  'barcode' => '8880150001824', 'cost' => 110.00,  'price' => 165.00,  'short' => 'Lightest Ultraboost ever made with 30% lighter Light BOOST foam and Primeknit+ upper.'],
            83 => ['name' => 'New Balance 990v6 Classic USA',   'brand_id' => 3,  'cat_idx' => 8, 'sku' => 'SKU-NB-990V6',    'barcode' => '8880150001831', 'cost' => 140.00,  'price' => 199.00,  'short' => 'FuelCell foam midsole with ENCAP cushioning for premium comfort and timeless style.'],
            84 => ['name' => 'Nike Air Force 1 07 Triple White','brand_id' => 3,  'cat_idx' => 8, 'sku' => 'SKU-NK-AF107',    'barcode' => '8880150001848', 'cost' => 68.00,   'price' => 110.00,  'short' => 'Classic stitched overlays, pristine crisp leather, and full-length encapsulated Air sole.'],
            85 => ['name' => 'Asics GEL-Kayano 30 Stability',   'brand_id' => 3,  'cat_idx' => 8, 'sku' => 'SKU-ASC-KAYANO30','barcode' => '8880150001855', 'cost' => 95.00,   'price' => 145.00,  'short' => '4D GUIDANCE SYSTEM provides adaptive stability and pureGEL technology for soft landings.'],
            86 => ['name' => 'On Cloudmonster Max Cushioning',  'brand_id' => 3,  'cat_idx' => 8, 'sku' => 'SKU-ON-CLDMON',   'barcode' => '8880150001862', 'cost' => 115.00,  'price' => 170.00,  'short' => 'Monster CloudTec with Helion superfoam for maximum rebound and ultra-soft cushioning.'],
            87 => ['name' => 'Salomon XT-6 Advanced Trail Shoe','brand_id' => 3,  'cat_idx' => 8, 'sku' => 'SKU-SLM-XT6',     'barcode' => '8880150001879', 'cost' => 130.00,  'price' => 185.00,  'short' => 'ACS (Agile Chassis System) downhill chassis and lug geometry for all-terrain stability.'],
            88 => ['name' => 'Puma Slipstream Heritage Leather', 'brand_id' => 3, 'cat_idx' => 8, 'sku' => 'SKU-PM-SLIPSTR',  'barcode' => '8880150001886', 'cost' => 55.00,   'price' => 89.00,   'short' => 'Retro basketball court roots reimagined with premium leather upper and rubber outsole.'],
            89 => ['name' => 'Vans Old Skool Classic Skate',    'brand_id' => 3,  'cat_idx' => 8, 'sku' => 'SKU-VNS-OLDSK',   'barcode' => '8880150001893', 'cost' => 42.00,   'price' => 65.00,   'short' => 'Iconic side stripe skate shoe with durable suede and canvas uppers and waffle outsoles.'],
            90 => ['name' => 'Converse Chuck 70 Vintage High',   'brand_id' => 3,  'cat_idx' => 8, 'sku' => 'SKU-CV-CHK70',    'barcode' => '8880150001909', 'cost' => 48.00,   'price' => 75.00,   'short' => 'Heavyweight 12oz canvas with archival rubber taping and OrthoLite insole cushioning.'],

            // 10. Apparel (IDs 91-100)
            91 => ['name' => 'Nike Dri-FIT Club Fleece Hoodie', 'brand_id' => 3,  'cat_idx' => 9, 'sku' => 'SKU-NK-DFHOOD',   'barcode' => '8880150001916', 'cost' => 38.00,   'price' => 65.00,   'short' => 'Brushed-back fleece provides cozy warmth with sweat-wicking Dri-FIT performance.'],
            92 => ['name' => 'Adidas Essentials 3-Stripes Top', 'brand_id' => 3,  'cat_idx' => 9, 'sku' => 'SKU-AD-TRKJCKT',  'barcode' => '8880150001923', 'cost' => 35.00,   'price' => 60.00,   'short' => 'Classic stand-up collar track jacket made with recycled Primegreen performance fabric.'],
            93 => ['name' => 'Under Armour Tech 2.0 Short Tee', 'brand_id' => 3,  'cat_idx' => 9, 'sku' => 'SKU-UA-TECHTEE',  'barcode' => '8880150001930', 'cost' => 14.00,   'price' => 28.00,   'short' => 'UA Tech fabric is quick-drying, ultra-soft and has a more natural athletic feel.'],
            94 => ['name' => 'Champion Reverse Weave Crewneck', 'brand_id' => 3,  'cat_idx' => 9, 'sku' => 'SKU-CH-RWCREW',   'barcode' => '8880150001947', 'cost' => 32.00,   'price' => 55.00,   'short' => 'Iconic heavyweight 12oz fleece cut on cross-grain to resist vertical shrinkage.'],
            95 => ['name' => 'Arc\'teryx Atom LT Insulated Hoody','brand_id' => 3, 'cat_idx' => 9, 'sku' => 'SKU-ARC-ATOMLT', 'barcode' => '8880150001954', 'cost' => 160.00,  'price' => 249.00,  'short' => 'Coreloft Compact insulation with breathable stretch side panels for active warmth.'],
            96 => ['name' => 'The North Face 1996 Retro Nuptse', 'brand_id' => 3, 'cat_idx' => 9, 'sku' => 'SKU-TNF-NUPTSE96','barcode' => '8880150001961', 'cost' => 180.00,  'price' => 299.00,  'short' => '700-fill goose down jacket with water-repellent ripstop shell and stowable hood.'],
            97 => ['name' => 'Uniqlo AIRism Cotton Oversized Tee','brand_id' => 3, 'cat_idx' => 9, 'sku' => 'SKU-UQ-AIRISMTEE','barcode' => '8880150001978', 'cost' => 10.00,   'price' => 22.00,   'short' => 'AIRism technology exterior cotton blend with relaxed modern dropped-shoulder fit.'],
            98 => ['name' => 'Puma Iconic T7 Athletic Track Pant','brand_id' => 3, 'cat_idx' => 9, 'sku' => 'SKU-PM-T7PANTS', 'barcode' => '8880150001985', 'cost' => 28.00,   'price' => 50.00,   'short' => 'Signature 7cm T7 side stripes with ergonomic tapered cut and elasticated waistband.'],
            99 => ['name' => 'Levi\'s 511 Slim Fit Stretch Denim','brand_id' => 3, 'cat_idx' => 9, 'sku' => 'SKU-LEV-511SLIM', 'barcode' => '8880150001992', 'cost' => 42.00,   'price' => 79.00,   'short' => 'Modern slim-fitting jeans with room to move, woven with Levi\'s Flex advanced stretch.'],
            100=> ['name' => 'Columbia Steens Mountain Full Zip', 'brand_id' => 3, 'cat_idx' => 9, 'sku' => 'SKU-COL-STEENSFZ','barcode' => '8880150002005', 'cost' => 30.00,   'price' => 52.00,   'short' => 'Ultra-soft MTR filament fleece jacket with zippered hand pockets for outdoor comfort.'],
        ];

        $products = [];
        $productImages = [];
        $productVariants = [];
        $productVariantValues = [];
        $productPrices = [];
        
        $statuses = ['active', 'active', 'active', 'active', 'inactive'];
        $variantsCount = 1;

        for ($i = 1; $i <= 100; $i++) {
            $pInfo = $productCatalog[$i];
            $cat = $categories[$pInfo['cat_idx']];
            $brandId = $pInfo['brand_id'];
            $brandObj = collect($brands)->firstWhere('id', $brandId) ?? $brands[0];
            
            $name = $pInfo['name'];
            $slug = Str::slug($name);
            $sku = $pInfo['sku'];
            $barcode = $pInfo['barcode'];
            $hasVariants = ($i <= 50); // First 50 products have comprehensive multi-spec variants

            $costPrice = $pInfo['cost'];
            $sellingPrice = $pInfo['price'];
            $comparePrice = round($sellingPrice * 1.15, 2);

            $catSlug = $cat['slug'];
            $imgsList = $categoryImages[$catSlug] ?? $categoryImages['smartphones'];
            $primaryImgUrl = $imgsList[($i - 1) % count($imgsList)];

            $products[] = [
                'id' => $i,
                'company_id' => $companyId,
                'category_id' => $cat['id'],
                'brand_id' => $brandId,
                'unit_id' => ($catSlug === 'shoes' ? 2 : 1),
                'tax_id' => 1,
                'name' => $name,
                'slug' => $slug,
                'sku' => $sku,
                'barcode' => $barcode,
                'description' => "Genuine official product specifications for $name. Includes manufacturer warranty and certified quality.",
                'short_description' => $pInfo['short'],
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
                'status' => $statuses[$i % count($statuses)],
                'is_featured' => ($i % 5 === 0),
                'is_digital' => false,
                'sold_count' => rand(15, 600),
                'view_count' => rand(150, 3500),
                'rating_avg' => round(4.2 + (($i % 8) / 10), 1),
                'rating_count' => rand(10, 150),
                'meta_title' => "Buy $name | Official Store",
                'meta_description' => "Order genuine $name in Cambodia with official warranty and fast express delivery.",
                'meta_keywords' => "$slug, " . strtolower($brandObj['name']) . ", " . strtolower($cat['slug']),
                'created_at' => now()->subDays(120 - $i),
                'updated_at' => now(),
            ];

            // Primary Product Image - 100% PRESERVED
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
                'price' => round($sellingPrice * 0.88, 2),
                'currency_code' => 'USD',
                'start_date' => null,
                'end_date' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Handle Category-Specific Product Variants
            if ($hasVariants && isset($categorySpecs[$catSlug])) {
                $cConfig = $categorySpecs[$catSlug];
                $specAttrId = $cConfig['attr_id'];
                $specsList = $cConfig['specs'];
                $colorsList = $cConfig['colors'];

                foreach ($specsList as $sInfo) {
                    foreach ($colorsList as $cInfo) {
                        $sCode         = $sInfo['code'];
                        $variantName   = $name . ' (' . $sCode . ', ' . $cInfo['name'] . ')';
                        $vSellingPrice = round($sellingPrice * $sInfo['mult'], 2);
                        $vCostPrice    = round($costPrice * $sInfo['mult'], 2);
                        $cleanSpecCode = preg_replace('/[^A-Za-z0-9]/', '', $sCode);
                        $vSku          = $sku . '-' . substr($cleanSpecCode, 0, 6) . '-' . strtoupper(substr($cInfo['name'], 0, 3));
                        $variantId     = $variantsCount++;
                        $vBarcode      = '888' . str_pad((string)$variantId, 11, '0', STR_PAD_LEFT);
                        $vImgUrl       = $imgsList[($cInfo['cIdx'] - 1) % count($imgsList)];

                        $productVariants[] = [
                            'id'            => $variantId,
                            'product_id'    => $i,
                            'name'          => $variantName,
                            'sku'           => $vSku,
                            'barcode'       => $vBarcode,
                            'cost_price'    => $vCostPrice,
                            'selling_price' => $vSellingPrice,
                            'compare_price' => round($vSellingPrice * 1.15, 2),
                            'weight'        => rand(10, 50) / 10,
                            'image'         => $vImgUrl,
                            'is_active'     => true,
                            'created_at'    => now(),
                            'updated_at'    => now(),
                        ];

                        // Category Spec attribute value mapping
                        $productVariantValues[] = [
                            'product_variant_id' => $variantId,
                            'attribute_id'       => $specAttrId,
                            'attribute_value_id' => $sInfo['attr_val_id'],
                            'created_at'         => now(),
                            'updated_at'         => now(),
                        ];

                        // Color attribute value mapping
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

        foreach (array_chunk($products, 50) as $chunk) {
            DB::table('products')->insert($chunk);
        }
        foreach (array_chunk($productImages, 50) as $chunk) {
            DB::table('product_images')->insert($chunk);
        }
        foreach (array_chunk($productVariants, 50) as $chunk) {
            DB::table('product_variants')->insert($chunk);
        }
        foreach (array_chunk($productVariantValues, 100) as $chunk) {
            DB::table('product_variant_values')->insert($chunk);
        }
        foreach (array_chunk($productPrices, 100) as $chunk) {
            DB::table('product_prices')->insert($chunk);
        }

        if (DB::getDriverName() === 'pgsql') {
            $tables = ['categories', 'brands', 'units', 'taxes', 'attributes', 'attribute_values', 'products', 'product_variants', 'product_variant_values', 'inventories', 'product_images', 'product_prices'];
            foreach ($tables as $table) {
                try {
                    DB::statement("SELECT setval('{$table}_id_seq', COALESCE((SELECT MAX(id) FROM {$table}), 0) + 1, false);");
                } catch (\Throwable $e) {}
            }
        }
    }
}
