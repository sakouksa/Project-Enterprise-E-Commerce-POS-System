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

        $users = [
            [
                'email'    => 'superadmin@enterprise-pos.com',
                'username' => 'superadmin',
                'name'     => 'Super Admin',
                'password' => Hash::make('password'),
                'phone'    => '+62-812-0000-0001',
                'role'     => 'super_admin',
            ],
            [
                'email'    => 'admin@enterprise-pos.com',
                'username' => 'admin',
                'name'     => 'Admin User',
                'password' => Hash::make('password'),
                'phone'    => '+62-812-0000-0002',
                'role'     => 'admin',
            ],
            [
                'email'    => 'manager@enterprise-pos.com',
                'username' => 'manager',
                'name'     => 'Store Manager',
                'password' => Hash::make('password'),
                'phone'    => '+62-812-0000-0003',
                'role'     => 'manager',
            ],
            [
                'email'    => 'cashier@enterprise-pos.com',
                'username' => 'cashier',
                'name'     => 'Cashier 1',
                'password' => Hash::make('password'),
                'phone'    => '+62-812-0000-0004',
                'role'     => 'cashier',
            ],
            [
                'email'    => 'cashier2@enterprise-pos.com',
                'username' => 'cashier2',
                'name'     => 'Cashier 2',
                'password' => Hash::make('password'),
                'phone'    => '+62-812-0000-0005',
                'role'     => 'cashier',
            ],
            [
                'email'    => 'warehouse1@enterprise-pos.com',
                'username' => 'warehouse1',
                'name'     => 'Warehouse Staff 1',
                'password' => Hash::make('password'),
                'phone'    => '+62-812-0000-0006',
                'role'     => 'warehouse_staff',
            ],
            [
                'email'    => 'warehouse2@enterprise-pos.com',
                'username' => 'warehouse2',
                'name'     => 'Warehouse Staff 2',
                'password' => Hash::make('password'),
                'phone'    => '+62-812-0000-0007',
                'role'     => 'warehouse_staff',
            ],
            [
                'email'    => 'accountant@enterprise-pos.com',
                'username' => 'accountant',
                'name'     => 'Corporate Accountant',
                'password' => Hash::make('password'),
                'phone'    => '+62-812-0000-0008',
                'role'     => 'manager',
            ],
            [
                'email'    => 'customer1@enterprise-pos.com',
                'username' => 'customer1',
                'name'     => 'Customer User 1',
                'password' => Hash::make('password'),
                'phone'    => '+62-812-0000-0009',
                'role'     => 'customer',
            ],
            [
                'email'    => 'inactive@enterprise-pos.com',
                'username' => 'inactive',
                'name'     => 'Inactive Staff',
                'password' => Hash::make('password'),
                'phone'    => '+62-812-0000-0010',
                'is_active'=> false,
                'role'     => 'cashier',
            ],
        ];

        foreach ($users as $userData) {
            $role = $userData['role'];
            unset($userData['role']);

            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                array_merge([
                    'company_id' => $company?->id,
                    'branch_id'  => $branch?->id,
                    'is_active'  => true,
                ], $userData)
            );

            if ($role) {
                $user->syncRoles([$role]);
            }
        }

        $this->command->info('Enterprise JWT demo users seeded with usernames and roles.');
    }
}
