<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Company\Company;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = Company::value('id') ?? 1;

        // 1. Settings (15 keys)
        $settings = [
            ['key' => 'site_name', 'value' => 'Enterprise E-Commerce', 'type' => 'string', 'group' => 'general'],
            ['key' => 'site_email', 'value' => 'info@enterprise-pos.com', 'type' => 'string', 'group' => 'general'],
            ['key' => 'allow_registration', 'value' => 'true', 'type' => 'boolean', 'group' => 'general'],
            ['key' => 'pos_receipt_header', 'value' => 'Thank you for shopping with us!', 'type' => 'string', 'group' => 'pos'],
            ['key' => 'pos_receipt_footer', 'value' => 'Please visit again.', 'type' => 'string', 'group' => 'pos'],
            ['key' => 'tax_rate_default', 'value' => '11', 'type' => 'integer', 'group' => 'tax'],
            ['key' => 'currency_base', 'value' => 'IDR', 'type' => 'string', 'group' => 'currency'],
            ['key' => 'loyalty_points_multiplier', 'value' => '1', 'type' => 'integer', 'group' => 'loyalty'],
            ['key' => 'loyalty_points_min_spend', 'value' => '10000', 'type' => 'integer', 'group' => 'loyalty'],
            ['key' => 'enable_low_stock_warnings', 'value' => 'true', 'type' => 'boolean', 'group' => 'inventory'],
            ['key' => 'default_warehouse_id', 'value' => '1', 'type' => 'integer', 'group' => 'inventory'],
            ['key' => 'company_address', 'value' => 'Jl. Sudirman No. 1, Jakarta', 'type' => 'string', 'group' => 'company'],
            ['key' => 'company_phone', 'value' => '+62-21-12345678', 'type' => 'string', 'group' => 'company'],
            ['key' => 'smtp_host', 'value' => 'smtp.mailtrap.io', 'type' => 'string', 'group' => 'mail'],
            ['key' => 'smtp_port', 'value' => '2525', 'type' => 'string', 'group' => 'mail'],
        ];
        foreach ($settings as $s) {
            DB::table('settings')->updateOrInsert(
                ['company_id' => $companyId, 'key' => $s['key']],
                ['value' => $s['value'], 'type' => $s['type'], 'group' => $s['group'], 'created_at' => now(), 'updated_at' => now()]
            );
        }

        // 2. Currencies (10 records)
        $currencies = [
            ['name' => 'Indonesian Rupiah', 'code' => 'IDR', 'symbol' => 'Rp', 'exchange_rate' => 1.000000, 'is_default' => true],
            ['name' => 'US Dollar', 'code' => 'USD', 'symbol' => '$', 'exchange_rate' => 16000.000000, 'is_default' => false],
            ['name' => 'Euro', 'code' => 'EUR', 'symbol' => '€', 'exchange_rate' => 17300.000000, 'is_default' => false],
            ['name' => 'Singapore Dollar', 'code' => 'SGD', 'symbol' => 'S$', 'exchange_rate' => 11800.000000, 'is_default' => false],
            ['name' => 'Malaysian Ringgit', 'code' => 'MYR', 'symbol' => 'RM', 'exchange_rate' => 3380.000000, 'is_default' => false],
            ['name' => 'Thai Baht', 'code' => 'THB', 'symbol' => '฿', 'exchange_rate' => 438.000000, 'is_default' => false],
            ['name' => 'Cambodian Riel', 'code' => 'KHR', 'symbol' => '៛', 'exchange_rate' => 3.900000, 'is_default' => false],
            ['name' => 'Japanese Yen', 'code' => 'JPY', 'symbol' => '¥', 'exchange_rate' => 101.000000, 'is_default' => false],
            ['name' => 'British Pound', 'code' => 'GBP', 'symbol' => '£', 'exchange_rate' => 20100.000000, 'is_default' => false],
            ['name' => 'Australian Dollar', 'code' => 'AUD', 'symbol' => 'A$', 'exchange_rate' => 10400.000000, 'is_default' => false],
        ];
        foreach ($currencies as $curr) {
            DB::table('currencies')->updateOrInsert(
                ['code' => $curr['code']],
                ['name' => $curr['name'], 'symbol' => $curr['symbol'], 'exchange_rate' => $curr['exchange_rate'], 'is_default' => $curr['is_default'], 'is_active' => true, 'created_at' => now(), 'updated_at' => now()]
            );
        }

        // 3. Languages (10 records)
        $languages = [
            ['name' => 'Indonesian', 'code' => 'id', 'is_default' => true],
            ['name' => 'English', 'code' => 'en', 'is_default' => false],
            ['name' => 'Khmer', 'code' => 'km', 'is_default' => false],
            ['name' => 'Malay', 'code' => 'ms', 'is_default' => false],
            ['name' => 'Thai', 'code' => 'th', 'is_default' => false],
            ['name' => 'Japanese', 'code' => 'ja', 'is_default' => false],
            ['name' => 'Chinese', 'code' => 'zh', 'is_default' => false],
            ['name' => 'Spanish', 'code' => 'es', 'is_default' => false],
            ['name' => 'French', 'code' => 'fr', 'is_default' => false],
            ['name' => 'German', 'code' => 'de', 'is_default' => false],
        ];
        foreach ($languages as $lang) {
            DB::table('languages')->updateOrInsert(
                ['code' => $lang['code']],
                ['name' => $lang['name'], 'is_default' => $lang['is_default'], 'is_active' => true, 'direction' => 'ltr', 'created_at' => now(), 'updated_at' => now()]
            );
        }

        // 4. Countries (10 records)
        $countries = [
            ['id' => 1, 'name' => 'Indonesia', 'code' => 'ID', 'phone_code' => '+62'],
            ['id' => 2, 'name' => 'United States', 'code' => 'US', 'phone_code' => '+1'],
            ['id' => 3, 'name' => 'Singapore', 'code' => 'SG', 'phone_code' => '+65'],
            ['id' => 4, 'name' => 'Malaysia', 'code' => 'MY', 'phone_code' => '+60'],
            ['id' => 5, 'name' => 'Thailand', 'code' => 'TH', 'phone_code' => '+66'],
            ['id' => 6, 'name' => 'Cambodia', 'code' => 'KH', 'phone_code' => '+855'],
            ['id' => 7, 'name' => 'Japan', 'code' => 'JP', 'phone_code' => '+81'],
            ['id' => 8, 'name' => 'United Kingdom', 'code' => 'GB', 'phone_code' => '+44'],
            ['id' => 9, 'name' => 'Australia', 'code' => 'AU', 'phone_code' => '+61'],
            ['id' => 10, 'name' => 'Germany', 'code' => 'DE', 'phone_code' => '+49'],
        ];
        foreach ($countries as $c) {
            DB::table('countries')->updateOrInsert(
                ['id' => $c['id']],
                ['name' => $c['name'], 'code' => $c['code'], 'phone_code' => $c['phone_code'], 'is_active' => true, 'created_at' => now(), 'updated_at' => now()]
            );
        }

        // 5. Provinces (10 records under country ID 1)
        $provinces = [];
        $provNames = ['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten', 'Bali', 'Sumatera Utara', 'Sumatera Selatan', 'Sulawesi Selatan', 'Kalimantan Timur'];
        foreach ($provNames as $i => $name) {
            $provinces[] = [
                'id' => $i + 1,
                'country_id' => 1,
                'name' => $name,
                'code' => 'PROV-' . ($i + 1),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('provinces')->insert($provinces);

        // 6. Cities (10 records under province ID 1 & 2)
        $cities = [];
        $cityNames = ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Utara', 'Jakarta Timur', 'Bandung', 'Bekasi', 'Depok', 'Bogor', 'Tangerang'];
        foreach ($cityNames as $i => $name) {
            $cities[] = [
                'id' => $i + 1,
                'province_id' => $i < 5 ? 1 : 2,
                'name' => $name,
                'type' => $i < 5 ? 'Kota' : 'Kabupaten',
                'postal_code' => '1000' . $i,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('cities')->insert($cities);
    }
}
