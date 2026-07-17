<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Company\Company;
use App\Models\Company\Branch;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::first();
        $branch  = Branch::first();

        // 1. Super Admin
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@enterprise-pos.com'],
            [
                'name'        => 'Super Admin',
                'password'    => Hash::make('password'),
                'phone'       => '+62-812-0000-0001',
                'company_id'  => $company->id,
                'branch_id'   => $branch->id,
                'is_active'   => true,
            ]
        );
        $superAdmin->assignRole('super_admin');

        // 2. Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@enterprise-pos.com'],
            [
                'name'        => 'Admin User',
                'password'    => Hash::make('password'),
                'phone'       => '+62-812-0000-0002',
                'company_id'  => $company->id,
                'branch_id'   => $branch->id,
                'is_active'   => true,
            ]
        );
        $admin->assignRole('admin');

        // 3. Store Manager
        $manager = User::firstOrCreate(
            ['email' => 'manager@enterprise-pos.com'],
            [
                'name'        => 'Store Manager',
                'password'    => Hash::make('password'),
                'company_id'  => $company->id,
                'branch_id'   => $branch->id,
                'is_active'   => true,
            ]
        );
        $manager->assignRole('manager');

        // 4. Cashier 1
        $cashier1 = User::firstOrCreate(
            ['email' => 'cashier@enterprise-pos.com'],
            [
                'name'        => 'Cashier 1',
                'password'    => Hash::make('password'),
                'company_id'  => $company->id,
                'branch_id'   => $branch->id,
                'is_active'   => true,
            ]
        );
        $cashier1->assignRole('cashier');

        // 5. Cashier 2
        $cashier2 = User::firstOrCreate(
            ['email' => 'cashier2@enterprise-pos.com'],
            [
                'name'        => 'Cashier 2',
                'password'    => Hash::make('password'),
                'company_id'  => $company->id,
                'branch_id'   => $branch->id,
                'is_active'   => true,
            ]
        );
        $cashier2->assignRole('cashier');

        // 6. Warehouse Staff 1
        $wh1 = User::firstOrCreate(
            ['email' => 'warehouse1@enterprise-pos.com'],
            [
                'name'        => 'Warehouse Staff 1',
                'password'    => Hash::make('password'),
                'company_id'  => $company->id,
                'branch_id'   => $branch->id,
                'is_active'   => true,
            ]
        );
        $wh1->assignRole('warehouse_staff');

        // 7. Warehouse Staff 2
        $wh2 = User::firstOrCreate(
            ['email' => 'warehouse2@enterprise-pos.com'],
            [
                'name'        => 'Warehouse Staff 2',
                'password'    => Hash::make('password'),
                'company_id'  => $company->id,
                'branch_id'   => $branch->id,
                'is_active'   => true,
            ]
        );
        $wh2->assignRole('warehouse_staff');

        // 8. Accountant
        $accountant = User::firstOrCreate(
            ['email' => 'accountant@enterprise-pos.com'],
            [
                'name'        => 'Corporate Accountant',
                'password'    => Hash::make('password'),
                'company_id'  => $company->id,
                'branch_id'   => $branch->id,
                'is_active'   => true,
            ]
        );
        $accountant->assignRole('manager'); // Grant manager permissions for finance audit

        // 9. Customer User 1
        $customer1 = User::firstOrCreate(
            ['email' => 'customer1@enterprise-pos.com'],
            [
                'name'        => 'Customer User 1',
                'password'    => Hash::make('password'),
                'company_id'  => $company->id,
                'branch_id'   => $branch->id,
                'is_active'   => true,
            ]
        );
        $customer1->assignRole('customer');

        // 10. Customer User 2
        $customer2 = User::firstOrCreate(
            ['email' => 'customer2@enterprise-pos.com'],
            [
                'name'        => 'Customer User 2',
                'password'    => Hash::make('password'),
                'company_id'  => $company->id,
                'branch_id'   => $branch->id,
                'is_active'   => true,
            ]
        );
        $customer2->assignRole('customer');

        // 11. Customer User 3
        $customer3 = User::firstOrCreate(
            ['email' => 'customer3@enterprise-pos.com'],
            [
                'name'        => 'Customer User 3',
                'password'    => Hash::make('password'),
                'company_id'  => $company->id,
                'branch_id'   => $branch->id,
                'is_active'   => true,
            ]
        );
        $customer3->assignRole('customer');

        // 12. Inactive User
        $inactive = User::firstOrCreate(
            ['email' => 'inactive@enterprise-pos.com'],
            [
                'name'        => 'Inactive Staff',
                'password'    => Hash::make('password'),
                'company_id'  => $company->id,
                'branch_id'   => $branch->id,
                'is_active'   => false,
            ]
        );
        $inactive->assignRole('cashier');

        $this->command->info('Demo users seeded. Passwords: password');
    }
}
