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
        DB::table('product_variant_values')->delete();
        DB::table('product_variants')->delete();
        DB::table('product_prices')->delete();
        DB::table('product_images')->delete();
        DB::table('inventories')->delete();
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
            $hasVariants = ($i <= 50); // First 50 products have comprehensive multi-spec variants!

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
                'unit_id' => ($catSlug === 'shoes' ? 2 : 1),
                'tax_id' => 1,
                'name' => $name,
                'slug' => $slug,
                'sku' => $sku,
                'barcode' => $barcode,
                'description' => "Detailed specifications and official description for $name in category {$cat['name']}.",
                'short_description' => "Premium {$cat['name']} by " . $brand['name'],
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
                'is_featured' => ($i % 6 === 0),
                'is_digital' => false,
                'sold_count' => rand(10, 500),
                'view_count' => rand(100, 2500),
                'rating_avg' => rand(40, 50) / 10,
                'rating_count' => rand(5, 120),
                'meta_title' => "Buy $name | Official Store",
                'meta_description' => "Order the genuine $name with warranty and quick express delivery.",
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
                'price' => round($sellingPrice * 0.9, 2),
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
                        $variantName   = $name . ' - ' . $sCode . ' / ' . $cInfo['name'];
                        $vSellingPrice = round($sellingPrice * $sInfo['mult'], 2);
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
                            'cost_price'    => round($costPrice * $sInfo['mult'], 2),
                            'selling_price' => $vSellingPrice,
                            'compare_price' => round($vSellingPrice * 1.2, 2),
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

        DB::table('products')->insert($products);
        DB::table('product_images')->insert($productImages);
        DB::table('product_variants')->insert($productVariants);
        DB::table('product_variant_values')->insert($productVariantValues);
        DB::table('product_prices')->insert($productPrices);

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
