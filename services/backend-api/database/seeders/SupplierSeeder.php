<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Company\Company;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = Company::value('id') ?? 1;

        // Authentic Domestic & Regional Suppliers for Cambodia Retail/POS
        $supplierTemplates = [
            // Domestic Cambodian Authorized Distributors
            ['name' => 'K-Tech Distribution Cambodia', 'country' => 'Cambodia', 'city' => 'Khan Sen Sok', 'province' => 'Phnom Penh', 'phone' => '+855 23 888 101', 'bank' => 'ABA Bank', 'curr' => 'USD', 'type' => 'authorized_dealer', 'tier' => 'tier_1'],
            ['name' => 'Angkor IT Solutions Co., Ltd.', 'country' => 'Cambodia', 'city' => 'Khan Tuol Kouk', 'province' => 'Phnom Penh', 'phone' => '+855 23 888 102', 'bank' => 'ACLEDA Bank Plc', 'curr' => 'USD', 'type' => 'distributor', 'tier' => 'tier_1'],
            ['name' => 'Sovannaphum Electronics Supply', 'country' => 'Cambodia', 'city' => 'Khan Daun Penh', 'province' => 'Phnom Penh', 'phone' => '+855 12 889 001', 'bank' => 'Canadia Bank', 'curr' => 'USD', 'type' => 'wholesaler', 'tier' => 'tier_2'],
            ['name' => 'Phnom Penh Mobile Direct Source', 'country' => 'Cambodia', 'city' => 'Khan Chamkarmon', 'province' => 'Phnom Penh', 'phone' => '+855 93 770 110', 'bank' => 'Wing Bank', 'curr' => 'USD', 'type' => 'distributor', 'tier' => 'tier_1'],
            ['name' => 'Mekong POS Hardware Supplies', 'country' => 'Cambodia', 'city' => 'Khan Chroy Changvar', 'province' => 'Phnom Penh', 'phone' => '+855 23 888 105', 'bank' => 'Sathapana Bank', 'curr' => 'USD', 'type' => 'manufacturer', 'tier' => 'tier_1'],
            ['name' => 'Siem Reap Smart Devices Depot', 'country' => 'Cambodia', 'city' => 'Krong Siem Reap', 'province' => 'Siem Reap', 'phone' => '+855 63 963 111', 'bank' => 'ABA Bank', 'curr' => 'USD', 'type' => 'wholesaler', 'tier' => 'tier_2'],
            ['name' => 'Battambang Tech Wholesale', 'country' => 'Cambodia', 'city' => 'Krong Battambang', 'province' => 'Battambang', 'phone' => '+855 53 952 111', 'bank' => 'ACLEDA Bank Plc', 'curr' => 'USD', 'type' => 'wholesaler', 'tier' => 'tier_2'],
            ['name' => 'Sihanoukville Port Logistics & Gear', 'country' => 'Cambodia', 'city' => 'Krong Preah Sihanouk', 'province' => 'Sihanoukville (Preah Sihanouk)', 'phone' => '+855 34 934 111', 'bank' => 'Canadia Bank', 'curr' => 'USD', 'type' => 'logistics_supplier', 'tier' => 'tier_1'],
            ['name' => 'Tbong Khmum Ag-Tech & Electronics', 'country' => 'Cambodia', 'city' => 'Krong Suong', 'province' => 'Tbong Khmum', 'phone' => '+855 71 888 995', 'bank' => 'ABA Bank', 'curr' => 'USD', 'type' => 'distributor', 'tier' => 'tier_2'],
            ['name' => 'Kampong Cham Digital Source', 'country' => 'Cambodia', 'city' => 'Krong Kampong Cham', 'province' => 'Kampong Cham', 'phone' => '+855 42 941 111', 'bank' => 'Wing Bank', 'curr' => 'USD', 'type' => 'wholesaler', 'tier' => 'tier_3'],

            // Regional Technology Import Suppliers (ASEAN / Asia Cross-Border Trade)
            ['name' => 'Siam Micro-Electronics (Bangkok)', 'country' => 'Thailand', 'city' => 'Bangkok', 'province' => 'Bangkok', 'phone' => '+66 2 123 4567', 'bank' => 'Kasikornbank', 'curr' => 'USD', 'type' => 'manufacturer', 'tier' => 'tier_1'],
            ['name' => 'Saigon Components Tech Group', 'country' => 'Vietnam', 'city' => 'Ho Chi Minh City', 'province' => 'Ho Chi Minh', 'phone' => '+84 28 3822 1000', 'bank' => 'Vietcombank', 'curr' => 'USD', 'type' => 'manufacturer', 'tier' => 'tier_1'],
            ['name' => 'Shenzhen Smart POS Hardware Co.', 'country' => 'China', 'city' => 'Shenzhen', 'province' => 'Guangdong', 'phone' => '+86 755 8888 9999', 'bank' => 'Bank of China', 'curr' => 'USD', 'type' => 'manufacturer', 'tier' => 'tier_1'],
            ['name' => 'Lion City IT Sourcing Singapore', 'country' => 'Singapore', 'city' => 'Singapore', 'province' => 'Central', 'phone' => '+65 6789 0123', 'bank' => 'DBS Bank', 'curr' => 'USD', 'type' => 'direct_importer', 'tier' => 'tier_1'],
            ['name' => 'Tokyo Precision Optical Devices', 'country' => 'Japan', 'city' => 'Tokyo', 'province' => 'Kanto', 'phone' => '+81 3 5555 0100', 'bank' => 'MUFG Bank', 'curr' => 'USD', 'type' => 'manufacturer', 'tier' => 'tier_1'],
        ];

        DB::table('suppliers')->truncate();
        $suppliers = [];

        for ($i = 1; $i <= 50; $i++) {
            $tpl = $supplierTemplates[($i - 1) % count($supplierTemplates)];
            $suffix = ($i > count($supplierTemplates)) ? ' ' . (intdiv($i, count($supplierTemplates)) + 1) : '';
            $name = $tpl['name'] . $suffix;
            $code = 'SPL-' . str_pad($i, 4, '0', STR_PAD_LEFT);
            $cleanEmail = strtolower(preg_replace('/[^A-Za-z0-9]/', '', $tpl['name'])) . ($i > count($supplierTemplates) ? $i : '') . '@supplier.com';

            $suppliers[] = [
                'id' => $i,
                'company_id' => $companyId,
                'name' => $name,
                'code' => $code,
                'logo' => null,
                'email' => $cleanEmail,
                'phone' => $tpl['phone'],
                'fax' => null, // Deprecated in Cambodia
                'website' => 'https://www.' . strtolower(preg_replace('/[^A-Za-z0-9]/', '', $tpl['name'])) . '.com',
                'hotline' => $tpl['phone'],
                'support_email' => 'support@' . strtolower(preg_replace('/[^A-Za-z0-9]/', '', $tpl['name'])) . '.com',
                'supplier_type' => $tpl['type'],
                'tier' => $tpl['tier'],
                'address' => "Street " . (($i * 12) % 400 + 1) . ", Commercial Trade Zone",
                'city' => $tpl['city'],
                'province' => $tpl['province'],
                'country' => $tpl['country'],
                'postal_code' => '120' . str_pad($i % 100, 2, '0', STR_PAD_LEFT),
                'tax_number' => 'K00' . str_pad($i, 7, '0', STR_PAD_LEFT),
                'credit_limit' => rand(5000, 100000),
                'payment_terms' => 'Net 30',
                'payment_term_days' => 30,
                'lead_time_days' => $tpl['country'] === 'Cambodia' ? 1 : 5,
                'currency_code' => $tpl['curr'],
                'bank_name' => $tpl['bank'],
                'bank_account_number' => '00' . rand(100, 999) . '-' . rand(100, 999) . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'bank_account_name' => strtoupper($name),
                'swift_code' => $tpl['country'] === 'Cambodia' ? 'ABAKKHPP' : 'SWIFT' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'notes' => "Official verified supply vendor for enterprise hardware and consumer devices.",
                'is_active' => true,
                'created_at' => now()->subDays(rand(5, 120)),
                'updated_at' => now(),
            ];
        }
        DB::table('suppliers')->insert($suppliers);

        // Seed Supplier Contacts
        DB::table('supplier_contacts')->truncate();
        $contacts = [];
        $khmerContactNames = [
            'Chan Vathana', 'Heng Piseth', 'Sok Visal', 'Chea Sothea', 'Pich Ponlok',
            'Ung Sambath', 'Mao Sarath', 'Nuon Virak', 'Kong Pisey', 'Em Samnang',
            'Meas Sreypov', 'Lim Socheata', 'Tep Bopha', 'Keo Kolap', 'Mam Theary'
        ];

        for ($i = 1; $i <= 35; $i++) {
            $contactName = $khmerContactNames[($i - 1) % count($khmerContactNames)];
            $contacts[] = [
                'supplier_id' => $i,
                'name' => $contactName,
                'title' => ($i % 3 === 0) ? 'Chief Operations Officer' : (($i % 2 === 0) ? 'Enterprise Account Director' : 'Senior Sales Manager'),
                'email' => strtolower(str_replace(' ', '.', $contactName)) . '@supplier.com',
                'phone' => '+855 ' . (['12', '93', '71', '85', '96'][($i - 1) % 5]) . ' ' . rand(100, 999) . ' ' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'is_primary' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('supplier_contacts')->insert($contacts);
    }
}
