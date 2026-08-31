<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Company\Company;
use App\Models\Company\Branch;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = Company::value('id') ?? 1;
        $branchId = Branch::value('id') ?? 1;

        // 1. Departments
        $deptNames = ['Human Resources', 'Finance', 'Information Technology', 'Sales & Marketing', 'Operations', 'Purchasing', 'Warehouse', 'Customer Service', 'Quality Assurance', 'Legal'];
        foreach ($deptNames as $i => $name) {
            DB::table('departments')->updateOrInsert(
                ['id' => $i + 1],
                [
                    'company_id'  => $companyId,
                    'branch_id'   => $branchId,
                    'name'        => $name,
                    'code'        => 'DEPT-' . strtoupper(substr($name, 0, 3)),
                    'description' => "Department of $name",
                    'is_active'   => true,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]
            );
        }

        // 2. Positions
        $posNames = ['Manager', 'Supervisor', 'Staff', 'Officer', 'Analyst', 'Specialist', 'Lead', 'Coordinator', 'Director', 'Associate'];
        foreach ($posNames as $i => $name) {
            DB::table('positions')->updateOrInsert(
                ['id' => $i + 1],
                [
                    'company_id'    => $companyId,
                    'department_id' => rand(1, 10),
                    'name'          => $name,
                    'code'          => 'POS-' . strtoupper(substr($name, 0, 3)),
                    'description'   => "Position of $name",
                    'is_active'     => true,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ]
            );
        }

        // 3. Employees
        $genders = ['female', 'male'];
        $photos = [
            1  => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
            2  => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
            3  => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
            4  => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
            5  => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
            6  => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
            7  => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
            8  => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
            9  => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
            10 => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
            11 => 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256',
            12 => 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256',
            13 => 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=256',
            14 => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
            15 => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
        ];
        for ($i = 1; $i <= 15; $i++) {
            DB::table('employees')->updateOrInsert(
                ['id' => $i],
                [
                    'company_id'      => $companyId,
                    'branch_id'       => $branchId,
                    'department_id'   => rand(1, 10),
                    'position_id'     => rand(1, 10),
                    'user_id'         => $i <= 10 ? $i : null,
                    'employee_number' => 'EMP-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                    'name'            => "Employee $i",
                    'email'           => "employee$i@enterprise-pos.com",
                    'phone'           => '0812345678' . $i,
                    'nik'             => '327301020304000' . $i,
                    'gender'          => $genders[($i - 1) % 2],
                    'birth_date'      => '1990-01-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                    'address'         => "Jalan Raya Employee No. $i",
                    'photo'           => $photos[$i] ?? null,
                    'join_date'       => '2024-01-01',
                    'resign_date'     => null,
                    'status'          => 'active',
                    'basic_salary'    => rand(5000000, 15000000),
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ]
            );
        }

        // 4. Attendance
        DB::table('attendance')->delete();
        $attendance = [];
        $states = ['present', 'present', 'present', 'present', 'late', 'absent'];
        $dateStart = now()->subDays(12);
        for ($day = 0; $day < 11; $day++) {
            $dateStr = $dateStart->copy()->addDays($day)->format('Y-m-d');
            for ($empId = 1; $empId <= 15; $empId++) {
                $status = $states[rand(0, 5)];
                $checkIn = $status === 'absent' ? null : ($status === 'late' ? '09:15:00' : '08:00:00');
                $checkOut = $status === 'absent' ? null : '17:00:00';
                $attendance[] = [
                    'employee_id' => $empId,
                    'date'        => $dateStr,
                    'check_in'    => $checkIn,
                    'check_out'   => $checkOut,
                    'status'      => $status,
                    'notes'       => $status === 'late' ? 'Traffic jam' : null,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ];
            }
        }
        DB::table('attendance')->insert($attendance);

        // 5. Payrolls
        DB::table('payrolls')->delete();
        $payrolls = [];
        $months = ['2026-05', '2026-06'];
        foreach ($months as $month) {
            for ($empId = 1; $empId <= 15; $empId++) {
                $salary = rand(5000000, 15000000);
                $allowances = rand(500000, 1500000);
                $deductions = rand(100000, 500000);
                $overtime = rand(200000, 800000);
                $net = $salary + $allowances + $overtime - $deductions;
                $payrolls[] = [
                    'employee_id'  => $empId,
                    'period_month' => $month,
                    'working_days' => 22,
                    'present_days' => rand(20, 22),
                    'basic_salary' => $salary,
                    'allowances'   => $allowances,
                    'deductions'   => $deductions,
                    'overtime_pay' => $overtime,
                    'net_salary'   => $net,
                    'status'       => 'paid',
                    'paid_at'      => "$month-25",
                    'notes'        => 'Monthly payroll paid automatically',
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ];
            }
        }
        DB::table('payrolls')->insert($payrolls);
    }
}
