<?php

namespace App\Http\Controllers\Api\V1\Admin\Employee;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Employee\CreatePayrollRequest;
use App\Http\Requests\Employee\UpdatePayrollRequest;
use App\Http\Resources\Employee\PayrollResource;
use App\Services\Employee\PayrollService;
use App\Models\Employee\Employee;
use App\Models\Employee\Payroll;
use App\Services\Support\CsvService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PayrollController extends BaseApiController
{
    public function __construct(
        private readonly PayrollService $service,
        protected CsvService $csvService
    ) {}

    public function index(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('payroll.view')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $records = $this->service->getPaginated(
            $request->integer('per_page', 10),
            $request->all(),
            $request->get('sort_by', 'period_month'),
            $request->get('sort_order', 'desc')
        );

        return $this->paginatedResourceResponse(
            PayrollResource::collection($records),
            $records,
            'Payroll list retrieved successfully'
        );
    }

    public function store(CreatePayrollRequest $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('payroll.create')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new PayrollResource($record),
            'Payroll created successfully',
            201
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('payroll.view')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $record = $this->service->getById($id);
        return $this->successResponse(
            new PayrollResource($record),
            'Payroll details retrieved successfully'
        );
    }

    public function update(UpdatePayrollRequest $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('payroll.update')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new PayrollResource($record),
            'Payroll updated successfully'
        );
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('payroll.delete')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Payroll deleted successfully'
        );
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('payroll.delete')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = $this->service->bulkDelete($ids);

        return $this->successResponse(
            null,
            "{$count} payroll records deleted successfully"
        );
    }

    public function export(Request $request): StreamedResponse
    {
        $headers = [
            'Payroll ID', 'Employee Number', 'Employee Name', 'Period Month',
            'Working Days', 'Present Days', 'Basic Salary', 'Allowances',
            'Deductions', 'Overtime Pay', 'Net Salary', 'Status', 'Paid At', 'Notes'
        ];

        $payrolls = Payroll::with('employee')->when($request->search, function ($q, $v) {
            $q->whereHas('employee', function ($eq) use ($v) {
                $eq->where('name', 'like', "%{$v}%")
                   ->orWhere('employee_number', 'like', "%{$v}%");
            });
        })->get();

        return $this->csvService->streamExport(
            filename: 'payrolls_export_' . now()->format('Y-m-d') . '.csv',
            headers: $headers,
            rows: $payrolls,
            rowMapper: fn(Payroll $p) => [
                $p->id,
                $p->employee?->employee_number ?? '',
                $p->employee?->name ?? '',
                $p->period_month,
                $p->working_days,
                $p->present_days,
                $p->basic_salary,
                $p->allowances,
                $p->deductions,
                $p->overtime_pay,
                $p->net_salary,
                $p->status,
                $p->paid_at ? $p->paid_at->format('Y-m-d H:i') : '',
                $p->notes ?? '',
            ]
        );
    }

    public function import(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('payroll.create')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        $result = $this->csvService->parseCsv($request->file('file'), ['employee_number', 'period_month']);
        if (!$result['success']) {
            return $this->errorResponse($result['message'], $result['errors'], 400);
        }

        $successCount = 0;
        $errors = [];

        foreach ($result['rows'] as $rowItem) {
            $line = $rowItem['_line'];
            $data = $rowItem['data'];

            $employeeNumber = trim($data['employee_number'] ?? $data['employee number'] ?? '');
            $periodMonth = trim($data['period_month'] ?? $data['period month'] ?? '');
            $workingDays = (int) ($data['working_days'] ?? $data['working days'] ?? 0);
            $presentDays = (int) ($data['present_days'] ?? $data['present days'] ?? 0);
            $basicSalary = (float) ($data['basic_salary'] ?? $data['basic salary'] ?? 0);
            $allowances = (float) ($data['allowances'] ?? 0);
            $deductions = (float) ($data['deductions'] ?? 0);
            $overtimePay = (float) ($data['overtime_pay'] ?? $data['overtime pay'] ?? 0);
            $status = strtolower(trim($data['status'] ?? 'draft'));
            $paidAt = trim($data['paid_at'] ?? $data['paid at'] ?? '');
            $notes = trim($data['notes'] ?? '');

            if (empty($employeeNumber)) {
                $errors[] = "Line {$line}: Employee Number is required.";
                continue;
            }

            if (empty($periodMonth)) {
                $errors[] = "Line {$line}: Period Month is required.";
                continue;
            }

            $emp = Employee::where('employee_number', $employeeNumber)->first();
            if (!$emp) {
                $errors[] = "Line {$line}: Employee with number '{$employeeNumber}' not found.";
                continue;
            }

            $exists = Payroll::where('employee_id', $emp->id)->where('period_month', $periodMonth)->exists();
            if ($exists) {
                $errors[] = "Line {$line}: Payroll record for employee '{$employeeNumber}' on period {$periodMonth} already exists.";
                continue;
            }

            $netSalary = $basicSalary + $allowances + $overtimePay - $deductions;

            Payroll::create([
                'employee_id'  => $emp->id,
                'period_month' => $periodMonth,
                'working_days' => $workingDays,
                'present_days' => $presentDays,
                'basic_salary' => $basicSalary,
                'allowances'   => $allowances,
                'deductions'   => $deductions,
                'overtime_pay' => $overtimePay,
                'net_salary'   => $netSalary,
                'status'       => in_array($status, ['draft', 'approved', 'paid']) ? $status : 'draft',
                'paid_at'      => $paidAt ?: null,
                'notes'        => $notes ?: null,
            ]);

            $successCount++;
        }

        return $this->successResponse([
            'success_count' => $successCount,
            'errors'        => $errors,
        ], "Import completed. {$successCount} records imported successfully.");
    }
}
