<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        // Seed 10 Companies
        $companies = [];
        for ($i = 1; $i <= 10; $i++) {
            $companies[] = [
                'id' => $i,
                'name' => $i === 1 ? 'NexTech Tbong Khmum' : "Enterprise Co. $i",
                'slug' => $i === 1 ? 'nextech-tbong-khmum' : "enterprise-co-$i",
                'email' => $i === 1 ? 'tbongkhmum@enterprise-pos.com' : "admin$i@enterprise.com",
                'phone' => $i === 1 ? '+855 71 888 999' : "+62-21-9900110$i",
                'website' => $i === 1 ? 'https://www.enterprise-pos.com' : "https://enterprise-co-$i.com",
                'address' => $i === 1 ? 'ក្រុងសួង, ខេត្តត្បូងឃ្មុំ, ព្រះរាជាណាចក្រកម្ពុជា' : "Jalan Business Park Block $i",
                'city' => $i === 1 ? 'ក្រុងសួង (Suong)' : 'Jakarta',
                'province' => $i === 1 ? 'ត្បូងឃ្មុំ (Tbong Khmum)' : 'DKI Jakarta',
                'country' => $i === 1 ? 'KH' : 'ID',
                'postal_code' => $i === 1 ? '030101' : ('1022' . ($i - 1)),
                'currency_code' => $i === 1 ? 'USD' : 'IDR',
                'timezone' => $i === 1 ? 'Asia/Phnom_Penh' : 'Asia/Jakarta',
                'language' => $i === 1 ? 'km' : 'id',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('companies')->insert($companies);

        // Seed 10 Branches (1 per company)
        $branches = [];
        for ($i = 1; $i <= 10; $i++) {
            $branches[] = [
                'id' => $i,
                'company_id' => $i,
                'name' => $i === 1 ? 'សាខាខេត្តត្បូងឃ្មុំ (Tbong Khmum Branch)' : "Head Office $i",
                'code' => $i === 1 ? 'BR-TBK-01' : "BR-$i-HO",
                'email' => $i === 1 ? 'tbongkhmum@enterprise-pos.com' : "ho$i@enterprise.com",
                'phone' => $i === 1 ? '+855 71 888 999' : "+62-21-8800110$i",
                'address' => $i === 1 ? 'ក្រុងសួង, ខេត្តត្បូងឃ្មុំ, ព្រះរាជាណាចក្រកម្ពុជា' : "Jalan Office Block $i",
                'city' => $i === 1 ? 'ក្រុងសួង' : 'Jakarta',
                'province' => $i === 1 ? 'ត្បូងឃ្មុំ' : 'DKI Jakarta',
                'postal_code' => $i === 1 ? '030101' : ('1022' . ($i - 1)),
                'is_main' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('branches')->insert($branches);

        // Seed 10 Stores
        $stores = [];
        for ($i = 1; $i <= 10; $i++) {
            $stores[] = [
                'id' => $i,
                'company_id' => $i,
                'branch_id' => $i,
                'name' => "Retail Store $i",
                'slug' => "retail-store-$i",
                'domain' => "store$i.enterprise.com",
                'email' => "store$i@enterprise.com",
                'phone' => "+62-21-7700110$i",
                'address' => "Jalan Mall Avenue No. $i",
                'logo' => "stores/logo-$i.png",
                'banner' => "stores/banner-$i.png",
                'description' => "Official store for Enterprise Co. $i",
                'type' => 'hybrid',
                'is_active' => true,
                'settings' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('stores')->insert($stores);

        // Seed 10 Warehouses (let's map company 1 to warehouse 1 & 2 for transfers)
        $warehouses = [];
        for ($i = 1; $i <= 10; $i++) {
            $warehouses[] = [
                'id' => $i,
                'company_id' => $i === 2 ? 1 : $i, // Warehouse 2 belongs to company 1 so company 1 has at least 2 warehouses (id 1 and id 2)
                'branch_id' => $i === 2 ? 1 : $i,
                'name' => "Warehouse $i",
                'code' => "WH-" . str_pad($i, 3, '0', STR_PAD_LEFT),
                'address' => "Jalan Gudang No. $i",
                'city' => "Jakarta",
                'province' => "DKI Jakarta",
                'phone' => "+62-21-6600110$i",
                'pic_name' => "PIC Warehouse $i",
                'is_main' => $i === 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('warehouses')->insert($warehouses);
    }
}
