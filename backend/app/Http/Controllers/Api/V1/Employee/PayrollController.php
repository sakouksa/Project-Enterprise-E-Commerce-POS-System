<?php
namespace App\Http\Controllers\Api\V1\Employee;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Employee\CreatePayrollRequest;
use App\Http\Requests\Employee\UpdatePayrollRequest;
use App\Http\Resources\Employee\PayrollResource;
use App\Infrastructure\Services\Employee\PayrollService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PayrollController extends BaseApiController
{
    public function __construct(private readonly PayrollService $service)
    {
    }

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

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=payrolls_export_' . now()->format('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function () use ($request) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, [
                'Employee Number', 'Employee Name', 'Period Month', 'Working Days',
                'Present Days', 'Basic Salary', 'Allowances', 'Deductions',
                'Overtime Pay', 'Net Salary', 'Status', 'Paid At', 'Notes'
            ]);

            $payrolls = \App\Models\Employee\Payroll::with('employee')->when($request->search, function($q, $v) {
                $q->whereHas('employee', function($sq) use ($v) {
                    $sq->where('name', 'like', "%{$v}%")
                      ->orWhere('employee_number', 'like', "%{$v}%");
                });
            })->get();

            foreach ($payrolls as $pay) {
                fputcsv($file, [
                    $pay->employee?->employee_number ?? '',
                    $pay->employee?->name ?? '',
                    $pay->period_month,
                    $pay->working_days,
                    $pay->present_days,
                    $pay->basic_salary,
                    $pay->allowances,
                    $pay->deductions,
                    $pay->overtime_pay,
                    $pay->net_salary,
                    $pay->status,
                    $pay->paid_at ? $pay->paid_at->format('Y-m-d') : '',
                    $pay->notes ?? ''
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function import(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('payroll.create')) {
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
            $period_month = trim($data['period_month'] ?? $data['period month'] ?? '');
            $working_days = intval($data['working_days'] ?? $data['working days'] ?? 0);
            $present_days = intval($data['present_days'] ?? $data['present days'] ?? 0);
            $basic_salary = floatval($data['basic_salary'] ?? $data['basic salary'] ?? 0);
            $allowances = floatval($data['allowances'] ?? 0);
            $deductions = floatval($data['deductions'] ?? 0);
            $overtime_pay = floatval($data['overtime_pay'] ?? $data['overtime pay'] ?? 0);
            $status = strtolower(trim($data['status'] ?? 'draft'));
            $paid_at = trim($data['paid_at'] ?? $data['paid at'] ?? '');
            $notes = trim($data['notes'] ?? '');

            if (empty($employee_number)) {
                $errors[] = "Line {$line}: Employee Number is required.";
                continue;
            }

            if (empty($period_month)) {
                $errors[] = "Line {$line}: Period Month is required.";
                continue;
            }

            $emp = \App\Models\Employee\Employee::where('employee_number', $employee_number)->first();
            if (!$emp) {
                $errors[] = "Line {$line}: Employee with number '{$employee_number}' not found.";
                continue;
            }

            $exists = \App\Models\Employee\Payroll::where('employee_id', $emp->id)->where('period_month', $period_month)->exists();
            if ($exists) {
                $errors[] = "Line {$line}: Payroll record for employee '{$employee_number}' on period {$period_month} already exists.";
                continue;
            }

            $net_salary = $basic_salary + $allowances + $overtime_pay - $deductions;

            \App\Models\Employee\Payroll::create([
                'employee_id'  => $emp->id,
                'period_month' => $period_month,
                'working_days' => $working_days,
                'present_days' => $present_days,
                'basic_salary' => $basic_salary,
                'allowances'   => $allowances,
                'deductions'   => $deductions,
                'overtime_pay' => $overtime_pay,
                'net_salary'   => $net_salary,
                'status'       => in_array($status, ['draft', 'approved', 'paid']) ? $status : 'draft',
                'paid_at'      => $paid_at ?: null,
                'notes'        => $notes ?: null
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
