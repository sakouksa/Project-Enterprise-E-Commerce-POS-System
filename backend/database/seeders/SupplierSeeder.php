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

        // Seed 50 Suppliers
        $suppliers = [];
        $supplierNames = [
            'Global Tech Distribution', 'Pioneer Electronics', 'Apex IT Solutions', 'Supreme Mobile Corp', 'Direct Source Inc',
            'Quantum Parts', 'NexGen Electronics', 'Micro-Hardware Co', 'Titan Logistics', 'Vanguard Suppliers',
            'Orion Products Ltd', 'Horizon Supplies', 'Summit Distributors', 'Genesis Tech', 'Starlight Logistics',
            'Polaris Imports', 'Eclipse Components', 'Omega Trading Group', 'Delta Wholesalers', 'Alpha Prime Corp',
            'Centurion Supplies', 'Matrix Systems', 'Nexus Trade', 'Phoenix Sourcing', 'Velocity Cargo',
            'Spectra Tech', 'Cosmo Electronics', 'Astral Importers', 'Aero Parts Co', 'Aura Trade Services',
            'Beacon Supplies', 'Catalyst Solutions', 'Core Distributors', 'Dynamic Importers', 'EcoTrade Corp',
            'Element Hardware', 'Elite Sourcing Group', 'Equinox Trade', 'Evergreen Logistics', 'First Class Tech',
            'Future Devices Co', 'Infinity Trade', 'Integrity Solutions', 'Legacy Trading', 'Liberty Supplies',
            'Magnetic Sourcing', 'Milestone Tech', 'Monolith Distributors', 'National Importers', 'Nova Tech Group'
        ];

        foreach ($supplierNames as $i => $name) {
            $suppliers[] = [
                'id' => $i + 1,
                'company_id' => $companyId,
                'name' => $name,
                'code' => 'SPL-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'email' => 'sales@' . strtolower(str_replace([' ', ','], '', $name)) . '.com',
                'phone' => '+62-21-5500' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'fax' => '+62-21-5500' . str_pad($i + 50, 4, '0', STR_PAD_LEFT),
                'address' => "Industrial Zone Block " . chr(65 + ($i % 6)) . " No. " . ($i + 1),
                'city' => 'Jakarta',
                'province' => 'DKI Jakarta',
                'country' => 'ID',
                'postal_code' => '144' . str_pad($i % 10, 2, '0', STR_PAD_LEFT),
                'tax_number' => '01.002.003.4-005.' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                'bank_name' => 'Bank Mandiri',
                'bank_account_number' => '123-00-998877-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                'bank_account_name' => 'PT ' . $name,
                'notes' => 'Key supply vendor for consumer electronics and IT gear.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('suppliers')->insert($suppliers);

        // Seed Supplier Contacts (at least 20 records)
        $contacts = [];
        for ($i = 1; $i <= 20; $i++) {
            $contacts[] = [
                'supplier_id' => $i,
                'name' => "Contact Person $i",
                'title' => 'Key Account Manager',
                'email' => "contact$i@example-supplier.com",
                'phone' => '+62-812-9090-00' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'is_primary' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('supplier_contacts')->insert($contacts);
    }
}
