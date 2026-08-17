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
        DB::table('customer_groups')->upsert($groups, ['id'], ['name', 'description', 'discount_percent', 'is_active', 'updated_at']);

        // Curated portrait avatars for realistic enterprise customer view
        $malePhotos = [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1531891437562-4301cf092a9d?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        ];

        $femalePhotos = [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=150&auto=format&fit=crop&q=80',
        ];

        // 2. Customers (100 records)
        $customers = [];
        $genders = ['male', 'female'];
        for ($i = 1; $i <= 100; $i++) {
            $gender = $genders[$i % 2];
            $photoList = $gender === 'male' ? $malePhotos : $femalePhotos;
            $photoUrl = $photoList[($i - 1) % count($photoList)];

            $customers[] = [
                'id' => $i,
                'company_id' => $companyId,
                'customer_group_id' => rand(1, 10),
                'name' => "Customer $i",
                'email' => "customer$i@example.com",
                'phone' => "085290123" . str_pad($i, 3, '0', STR_PAD_LEFT),
                'gender' => $gender,
                'birth_date' => '1985-05-' . str_pad(($i % 28) + 1, 2, '0', STR_PAD_LEFT),
                'photo' => $photoUrl,
                'loyalty_points' => rand(0, 500),
                'tax_number' => '01.002.003.4-005.0' . str_pad($i, 2, '0', STR_PAD_LEFT), // NPWP format
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('customers')->upsert($customers, ['id'], ['company_id', 'customer_group_id', 'name', 'email', 'phone', 'gender', 'birth_date', 'photo', 'loyalty_points', 'tax_number', 'is_active', 'updated_at']);

        // 3. Customer Addresses (100 records, 1 per customer)
        $addresses = [];
        for ($i = 1; $i <= 100; $i++) {
            $addresses[] = [
                'id' => $i,
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
        DB::table('customer_addresses')->upsert($addresses, ['id'], ['customer_id', 'label', 'name', 'phone', 'address', 'city', 'province', 'country', 'postal_code', 'is_default', 'updated_at']);
    }
}
