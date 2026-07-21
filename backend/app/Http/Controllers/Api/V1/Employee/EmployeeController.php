<?php
namespace App\Http\Controllers\Api\V1\Employee;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Employee\CreateEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Http\Resources\Employee\EmployeeResource;
use App\Infrastructure\Services\Employee\EmployeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployeeController extends BaseApiController
{
    public function __construct(private readonly EmployeeService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('employee.view')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $records = $this->service->getPaginated(
            $request->integer('per_page', 10),
            $request->all(),
            $request->get('sort_by', 'created_at'),
            $request->get('sort_order', 'desc')
        );

        return $this->paginatedResourceResponse(
            EmployeeResource::collection($records),
            $records,
            'Employee list retrieved successfully'
        );
    }

    public function store(CreateEmployeeRequest $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('employee.create')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $data = $request->validated();
        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('employees', 'public');
        }

        $record = $this->service->create($data);
        return $this->successResponse(
            new EmployeeResource($record),
            'Employee created successfully',
            201
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('employee.view')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $record = $this->service->getById($id);
        return $this->successResponse(
            new EmployeeResource($record),
            'Employee details retrieved successfully'
        );
    }

    public function update(UpdateEmployeeRequest $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('employee.update')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $data = $request->validated();
        if ($request->hasFile('photo')) {
            $employee = $this->service->getById($id);
            if ($employee && $employee->photo && \Illuminate\Support\Facades\Storage::disk('public')->exists($employee->photo)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($employee->photo);
            }
            $data['photo'] = $request->file('photo')->store('employees', 'public');
        }

        $record = $this->service->update($id, $data);
        return $this->successResponse(
            new EmployeeResource($record),
            'Employee updated successfully'
        );
    }

    public function uploadPhoto(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif,webp,svg|max:5120',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('employees', 'public');
            return $this->successResponse([
                'path' => $path,
                'url'  => \Illuminate\Support\Facades\Storage::url($path),
            ], 'Photo uploaded successfully');
        }

        return $this->errorResponse('No file uploaded', null, 400);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('employee.delete')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Employee deleted successfully'
        );
    }

    public function restore(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('employee.update')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $this->service->restore($id);
        return $this->successResponse(
            null,
            'Employee restored successfully'
        );
    }

    public function forceDelete(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('employee.delete')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $this->service->forceDelete($id);
        return $this->successResponse(
            null,
            'Employee permanently deleted'
        );
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('employee.delete')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = $this->service->bulkDelete($ids);

        return $this->successResponse(
            null,
            "{$count} employees deleted successfully"
        );
    }

    public function bulkRestore(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('employee.update')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = $this->service->bulkRestore($ids);

        return $this->successResponse(
            null,
            "{$count} employees restored successfully"
        );
    }

    public function stats(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('employee.view')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $totalEmployees = \App\Models\Employee\Employee::count();
        $activeEmployees = \App\Models\Employee\Employee::where('status', 'active')->count();
        $resignedEmployees = \App\Models\Employee\Employee::where('status', 'resigned')->count();
        $newTodayEmployees = \App\Models\Employee\Employee::whereDate('created_at', today())->count();
        
        $totalDepartments = \App\Models\Employee\Department::count();
        $totalPositions = \App\Models\Employee\Position::count();

        $today = now()->toDateString();
        $presentToday = \App\Models\Employee\Attendance::where('date', $today)->where('status', 'present')->count();
        $absentToday = \App\Models\Employee\Attendance::where('date', $today)->where('status', 'absent')->count();
        $lateToday = \App\Models\Employee\Attendance::where('date', $today)->where('status', 'late')->count();
        $leaveToday = \App\Models\Employee\Attendance::where('date', $today)->where('status', 'leave')->count();
        $holidayToday = \App\Models\Employee\Attendance::where('date', $today)->where('status', 'holiday')->count();

        $payrollDraft = \App\Models\Employee\Payroll::where('status', 'draft')->count();
        $payrollApproved = \App\Models\Employee\Payroll::where('status', 'approved')->count();
        $payrollPaid = \App\Models\Employee\Payroll::where('status', 'paid')->count();

        $currentMonth = now()->format('Y-m');
        $monthlySalaryExpense = \App\Models\Employee\Payroll::where('period_month', $currentMonth)
            ->whereIn('status', ['approved', 'paid'])
            ->sum('net_salary');
        if ($monthlySalaryExpense == 0) {
            $monthlySalaryExpense = \App\Models\Employee\Employee::where('status', 'active')->sum('basic_salary');
        }

        $averageSalary = \App\Models\Employee\Employee::where('status', 'active')->avg('basic_salary') ?? 0;

        return $this->successResponse([
            'total_employees'      => $totalEmployees,
            'active_employees'     => $activeEmployees,
            'resigned_employees'   => $resignedEmployees,
            'new_today_employees'  => $newTodayEmployees,
            'total_departments'    => $totalDepartments,
            'total_positions'      => $totalPositions,
            'attendance_today'     => [
                'present' => $presentToday,
                'absent'  => $absentToday,
                'late'    => $lateToday,
                'leave'   => $leaveToday,
                'holiday' => $holidayToday,
            ],
            'payroll_draft'        => $payrollDraft,
            'payroll_approved'     => $payrollApproved,
            'payroll_paid'         => $payrollPaid,
            'monthly_salary_expense'=> (float)$monthlySalaryExpense,
            'average_salary'       => (float)$averageSalary,
        ], 'Employee statistics retrieved successfully');
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=employees_export_' . now()->format('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function () use ($request) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, [
                'Employee Number', 'Name', 'Email', 'Phone', 'NIK', 'Gender',
                'Birth Date', 'Address', 'Department', 'Position', 'Basic Salary',
                'Join Date', 'Resign Date', 'Status'
            ]);

            $employees = \App\Models\Employee\Employee::with(['department', 'position'])->when($request->search, function($q, $v) {
                $q->where('name', 'like', "%{$v}%")
                  ->orWhere('employee_number', 'like', "%{$v}%")
                  ->orWhere('email', 'like', "%{$v}%");
            })->get();

            foreach ($employees as $emp) {
                fputcsv($file, [
                    $emp->employee_number,
                    $emp->name,
                    $emp->email ?? '',
                    $emp->phone ?? '',
                    $emp->nik ?? '',
                    $emp->gender ?? '',
                    $emp->birth_date ? $emp->birth_date->format('Y-m-d') : '',
                    $emp->address ?? '',
                    $emp->department?->name ?? '',
                    $emp->position?->name ?? '',
                    $emp->basic_salary,
                    $emp->join_date ? $emp->join_date->format('Y-m-d') : '',
                    $emp->resign_date ? $emp->resign_date->format('Y-m-d') : '',
                    $emp->status
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function import(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('employee.create')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $filePath = $file->getRealPath();

        $handle = fopen($filePath, 'r');
        if ($handle === false) {
            return $this->errorResponse('Cannot open the uploaded file.');
        }

        $bom = fread($handle, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            rewind($handle);
        }

        $headers = fgetcsv($handle);
        if (!$headers) {
            fclose($handle);
            return $this->errorResponse('Empty CSV file.');
        }

        $headers = array_map(fn($h) => strtolower(trim($h)), $headers);

        $successCount = 0;
        $errors = [];
        $line = 1;

        while (($row = fgetcsv($handle)) !== false) {
            $line++;
            
            if (count($row) < count($headers)) {
                $row = array_pad($row, count($headers), '');
            } elseif (count($row) > count($headers)) {
                $row = array_slice($row, 0, count($headers));
            }

            $data = array_combine($headers, $row);
            if (!$data) {
                $errors[] = "Line {$line}: Mismatched columns count.";
                continue;
            }

            $employee_number = trim($data['employee_number'] ?? $data['employee number'] ?? '');
            $name = trim($data['name'] ?? '');
            $email = trim($data['email'] ?? '');
            $phone = trim($data['phone'] ?? '');
            $nik = trim($data['nik'] ?? $data['national id'] ?? '');
            $gender = strtolower(trim($data['gender'] ?? ''));
            $birth_date = trim($data['birth_date'] ?? $data['birth date'] ?? '');
            $address = trim($data['address'] ?? '');
            $departmentName = trim($data['department'] ?? '');
            $positionName = trim($data['position'] ?? '');
            $basic_salary = floatval($data['basic_salary'] ?? $data['basic salary'] ?? 0);
            $join_date = trim($data['join_date'] ?? $data['join date'] ?? '');
            $resign_date = trim($data['resign_date'] ?? $data['resign date'] ?? '');
            $status = strtolower(trim($data['status'] ?? 'active'));

            if (empty($employee_number)) {
                $errors[] = "Line {$line}: Employee Number is required.";
                continue;
            }

            if (empty($name)) {
                $errors[] = "Line {$line}: Name is required.";
                continue;
            }

            $exists = \App\Models\Employee\Employee::where('employee_number', $employee_number)->exists();
            if ($exists) {
                $errors[] = "Line {$line}: Employee with number '{$employee_number}' already exists.";
                continue;
            }

            $deptId = null;
            if ($departmentName) {
                $dept = \App\Models\Employee\Department::where('name', $departmentName)->first();
                $deptId = $dept?->id;
                if (!$deptId) {
                    $errors[] = "Line {$line}: Department '{$departmentName}' not found.";
                    continue;
                }
            }

            $posId = null;
            if ($positionName) {
                $pos = \App\Models\Employee\Position::where('name', $positionName)->first();
                $posId = $pos?->id;
                if (!$posId) {
                    $errors[] = "Line {$line}: Position '{$positionName}' not found.";
                    continue;
                }
            }

            \App\Models\Employee\Employee::create([
                'company_id'      => $request->user()->company_id ?? 1,
                'branch_id'       => $request->user()->branch_id ?? 1,
                'department_id'   => $deptId,
                'position_id'     => $posId,
                'user_id'         => null,
                'employee_number' => $employee_number,
                'name'            => $name,
                'email'           => $email ?: null,
                'phone'           => $phone ?: null,
                'nik'             => $nik ?: null,
                'gender'          => in_array($gender, ['male', 'female']) ? $gender : null,
                'birth_date'      => $birth_date ?: null,
                'address'         => $address ?: null,
                'photo'           => null,
                'join_date'       => $join_date ?: null,
                'resign_date'     => $resign_date ?: null,
                'status'          => in_array($status, ['active', 'inactive', 'resigned']) ? $status : 'active',
                'basic_salary'    => $basic_salary
            ]);

            $successCount++;
        }

        fclose($handle);

        return $this->successResponse([
            'success_count' => $successCount,
            'errors'        => $errors
        ], "Import completed. {$successCount} records imported successfully.");
    }
}
