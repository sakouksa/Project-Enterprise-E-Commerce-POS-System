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
        $groupNames = [
            'General Retail',
            'VIP Platinum',
            'Gold Member',
            'Silver Member',
            'Wholesale Buyer',
            'Company Partner',
            'Employee Family',
            'Distributor tier 1',
            'Distributor tier 2',
            'Dropshipper'
        ];
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
        DB::table('customer_groups')->upsert($groups, ['id'], ['name', 'description', 'discount_percent', 'is_active', 'updated_at']);

        // Authentic Cambodian Customer Names
        $khmerMaleNames = [
            'Sok Dara', 'Chan Vanna', 'Heng Piseth', 'Bun Rotha', 'Chea Sothea',
            'Kim Seng', 'Seng Sovann', 'Ouk Panha', 'Rath Vicheka', 'Tep Rithy',
            'Long Vannak', 'Chhim Kosal', 'Ung Sambath', 'Prak Visal', 'Mao Sarath',
            'Vannak Thavry', 'Kheng Sophal', 'Noun Virak', 'Kong Pisey', 'Em Samnang',
            'Samnang Rath', 'Pich Ponlok', 'Srey Vuthy', 'Ros Chandara', 'Taing Meng',
            'Pheng Chanthou', 'Neth Sovannarith', 'Yim Phearom', 'Thon Samat', 'Mey Serey'
        ];

        $khmerFemaleNames = [
            'Meas Sreypov', 'Lim Socheata', 'Pich Chanmony', 'Tep Bopha', 'Nuon Chantrea',
            'Chhorn Sreyleak', 'Keo Kolap', 'Mam Theary', 'Ly Sreynich', 'Khim Malis',
            'Chenda Phalla', 'Sophal Devi', 'Vanny Khemara', 'Nita Sovanny', 'Thyda Pich',
            'Sreyka Mom', 'Roth Neary', 'Bopha Romduol', 'Dany Kunthea', 'Channary Leak',
            'Sophea Kalyan', 'Malis Chanda', 'Sina Phary', 'Vicheka Thida', 'Channy Solika',
            'Kalyan Raksmey', 'Sovanna Sreymom', 'Neary Rathana', 'Socheat Vanny', 'Borey Kunthea'
        ];

        $khmerProvinces = [
            'Phnom Penh', 'Kandal', 'Siem Reap', 'Battambang', 'Tbong Khmum',
            'Kampong Cham', 'Kampot', 'Sihanoukville (Preah Sihanouk)', 'Takeo',
            'Kampong Speu', 'Prey Veng', 'Svay Rieng', 'Banteay Meanchey', 'Pursat',
            'Kampong Chhnang', 'Kampong Thom', 'Kratie', 'Stung Treng', 'Ratanakiri',
            'Mondulkiri', 'Koh Kong', 'Kep', 'Pailin', 'Oddar Meanchey', 'Preah Vihear'
        ];

        $phonePrefixes = ['012', '093', '071', '085', '096', '089', '010', '078', '088', '097'];

        // 2. Customers (100 records)
        $customers = [];
        for ($i = 1; $i <= 100; $i++) {
            $isMale = ($i % 2 === 1);
            $gender = $isMale ? 'male' : 'female';
            $namePool = $isMale ? $khmerMaleNames : $khmerFemaleNames;
            $baseName = $namePool[($i - 1) % count($namePool)];
            $customerName = ($i > count($namePool)) ? $baseName . ' ' . (intdiv($i, count($namePool)) + 1) : $baseName;

            $cleanSlug = strtolower(preg_replace('/[^A-Za-z0-9]/', '.', $customerName));
            $email = $cleanSlug . ($i > count($namePool) ? $i : '') . '@gmail.com';
            
            $prefix = $phonePrefixes[($i - 1) % count($phonePrefixes)];
            $phone = $prefix . ' ' . rand(100, 999) . ' ' . str_pad($i, 3, '0', STR_PAD_LEFT);

            $customers[] = [
                'id' => $i,
                'company_id' => $companyId,
                'customer_group_id' => rand(1, 10),
                'name' => $customerName,
                'email' => $email,
                'phone' => $phone,
                'gender' => $gender,
                'birth_date' => '19' . rand(80, 99) . '-' . str_pad(rand(1, 12), 2, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT),
                'photo' => null,
                'loyalty_points' => rand(20, 950),
                'tax_number' => 'K00' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'is_active' => true,
                'created_at' => now()->subDays(rand(1, 180)),
                'updated_at' => now(),
            ];
        }
        DB::table('customers')->upsert($customers, ['id'], ['company_id', 'customer_group_id', 'name', 'email', 'phone', 'gender', 'birth_date', 'photo', 'loyalty_points', 'tax_number', 'is_active', 'updated_at']);

        // 3. Customer Addresses (100 records, authentic Cambodian locations)
        $addresses = [];
        for ($i = 1; $i <= 100; $i++) {
            $province = $khmerProvinces[($i - 1) % count($khmerProvinces)];
            $cityName = ($province === 'Phnom Penh') ? 'Phnom Penh' : 'Krong ' . explode(' ', $province)[0];
            $streetNo = rand(10, 450);

            $addresses[] = [
                'id' => $i,
                'customer_id' => $i,
                'label' => ($i % 3 === 0) ? 'Office' : 'Home',
                'name' => $customers[$i - 1]['name'],
                'phone' => $customers[$i - 1]['phone'],
                'address' => "House #" . $streetNo . ", Street " . rand(100, 598) . ", Sangkat " . (($i % 4) + 1),
                'city' => $cityName,
                'province' => $province,
                'country' => 'Cambodia',
                'postal_code' => '120' . str_pad($i % 100, 2, '0', STR_PAD_LEFT),
                'is_default' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('customer_addresses')->upsert($addresses, ['id'], ['customer_id', 'label', 'name', 'phone', 'address', 'city', 'province', 'country', 'postal_code', 'is_default', 'updated_at']);
    }
}
