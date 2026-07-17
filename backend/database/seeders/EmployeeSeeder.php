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
        $depts = [];
        $deptNames = ['Human Resources', 'Finance', 'Information Technology', 'Sales & Marketing', 'Operations', 'Purchasing', 'Warehouse', 'Customer Service', 'Quality Assurance', 'Legal'];
        foreach ($deptNames as $i => $name) {
            $depts[] = [
                'id' => $i + 1,
                'company_id' => $companyId,
                'branch_id' => $branchId,
                'name' => $name,
                'code' => 'DEPT-' . strtoupper(substr($name, 0, 3)),
                'description' => "Department of $name",
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('departments')->insert($depts);

        // 2. Positions
        $positions = [];
        $posNames = ['Manager', 'Supervisor', 'Staff', 'Officer', 'Analyst', 'Specialist', 'Lead', 'Coordinator', 'Director', 'Associate'];
        foreach ($posNames as $i => $name) {
            $positions[] = [
                'id' => $i + 1,
                'company_id' => $companyId,
                'department_id' => rand(1, 10),
                'name' => $name,
                'code' => 'POS-' . strtoupper(substr($name, 0, 3)),
                'description' => "Position of $name",
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('positions')->insert($positions);

        // 3. Employees
        $employees = [];
        $genders = ['male', 'female'];
        for ($i = 1; $i <= 15; $i++) {
            $employees[] = [
                'id' => $i,
                'company_id' => $companyId,
                'branch_id' => $branchId,
                'department_id' => rand(1, 10),
                'position_id' => rand(1, 10),
                'user_id' => null, // Will align in UserSeeder if needed
                'employee_number' => 'EMP-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'name' => "Employee $i",
                'email' => "employee$i@enterprise-pos.com",
                'phone' => '0812345678' . $i,
                'nik' => '327301020304000' . $i,
                'gender' => $genders[$i % 2],
                'birth_date' => '1990-01-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'address' => "Jalan Raya Employee No. $i",
                'photo' => null,
                'join_date' => '2024-01-01',
                'resign_date' => null,
                'status' => 'active',
                'basic_salary' => rand(5000000, 15000000),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('employees')->insert($employees);

        // 4. Attendance (at least 10 records per employee)
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
                    'date' => $dateStr,
                    'check_in' => $checkIn,
                    'check_out' => $checkOut,
                    'status' => $status,
                    'notes' => $status === 'late' ? 'Traffic jam' : null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('attendance')->insert($attendance);

        // 5. Payrolls (at least 10 records total, e.g. for last 2 months for all employees)
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
                    'employee_id' => $empId,
                    'period_month' => $month,
                    'working_days' => 22,
                    'present_days' => rand(20, 22),
                    'basic_salary' => $salary,
                    'allowances' => $allowances,
                    'deductions' => $deductions,
                    'overtime_pay' => $overtime,
                    'net_salary' => $net,
                    'status' => 'paid',
                    'paid_at' => "$month-25",
                    'notes' => 'Monthly payroll paid automatically',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        DB::table('payrolls')->insert($payrolls);
    }
}
