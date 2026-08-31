<?php
namespace App\Http\Controllers\Api\V1\Admin\Employee;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Employee\CreateAttendanceRequest;
use App\Http\Requests\Employee\UpdateAttendanceRequest;
use App\Http\Resources\Employee\AttendanceResource;
use App\Services\Employee\AttendanceService;
use App\Services\Employee\QrAttendanceService;
use App\Models\Employee\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends BaseApiController
{
    public function __construct(
        private readonly AttendanceService $service,
        private readonly QrAttendanceService $qrService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $records = $this->service->getPaginated(
            $request->integer('per_page', 10),
            $request->all(),
            $request->get('sort_by', 'attendance_date'),
            $request->get('sort_order', 'desc')
        );

        return $this->paginatedResourceResponse(
            AttendanceResource::collection($records),
            $records,
            'Attendance list retrieved successfully'
        );
    }

    public function store(CreateAttendanceRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new AttendanceResource($record),
            'Attendance created successfully',
            201
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $record = $this->service->getById($id, ['employee', 'department', 'position', 'shift', 'company', 'branch']);
        return $this->successResponse(
            new AttendanceResource($record),
            'Attendance details retrieved successfully'
        );
    }

    public function update(UpdateAttendanceRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new AttendanceResource($record),
            'Attendance updated successfully'
        );
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Attendance deleted successfully'
        );
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = $this->service->bulkDelete($ids);

        return $this->successResponse(
            null,
            "{$count} attendance records deleted successfully"
        );
    }

    // ─── DYNAMIC QR GENERATOR (ADMIN / KIOSK) ───────────────────────────────
    public function generateQr(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'company_id'       => 'nullable|integer|exists:companies,id',
            'branch_id'        => 'nullable|integer|exists:branches,id',
            'shift_id'         => 'nullable|integer|exists:shifts,id',
            'interval_seconds' => 'nullable|integer|in:30,60',
        ]);

        $companyId = $validated['company_id'] ?? \App\Models\Company\Company::first()?->id ?? 1;
        $branchId = $validated['branch_id'] ?? \App\Models\Company\Branch::first()?->id ?? 1;

        $data = $this->qrService->generateDynamicQr(
            (int) $companyId,
            (int) $branchId,
            $validated['shift_id'] ?? null,
            (int) ($validated['interval_seconds'] ?? 30)
        );

        return $this->successResponse($data, 'Dynamic QR Token generated successfully');
    }

    // ─── MOBILE QR SCAN ATTENDANCE (EMPLOYEE SCAN) ──────────────────────────
    public function scanQr(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'qr_token'        => 'required|string',
            'device_id'       => 'required|string',
            'device_name'     => 'nullable|string',
            'device_platform' => 'nullable|string|in:android,ios,web',
            'device_ip'       => 'nullable|string',
            'gps_latitude'    => 'nullable|numeric',
            'gps_longitude'   => 'nullable|numeric',
            'type'            => 'nullable|string|in:check_in,check_out',
            'employee_id'     => 'nullable|integer|exists:employees,id',
        ]);

        // Determine employee either from authenticated user or explicit employee_id
        if ($request->user() && $request->user()->employee) {
            $employee = $request->user()->employee;
        } elseif (!empty($validated['employee_id'])) {
            $employee = Employee::findOrFail($validated['employee_id']);
        } else {
            // Default to first active employee if testing/simulation
            $employee = Employee::firstOrFail();
        }

        $record = $this->service->scanQrCode($validated, $employee);

        return $this->successResponse(
            new AttendanceResource($record),
            "Attendance successfully recorded via Mobile QR Scan."
        );
    }

    // ─── DASHBOARD STATISTICS API ──────────────────────────────────────────
    public function dashboardStats(Request $request): JsonResponse
    {
        $stats = $this->service->getDashboardStats(
            $request->integer('company_id'),
            $request->integer('branch_id'),
            $request->get('date')
        );

        return $this->successResponse($stats, 'Attendance dashboard metrics retrieved successfully');
    }

    // ─── EXPORT CSV ─────────────────────────────────────────────────────────
    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=attendances_export_' . now()->format('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function () use ($request) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, ['Employee Number', 'Employee Name', 'Date', 'Check In', 'Check Out', 'Worked Hours', 'Late Minutes', 'Early Leave', 'Overtime', 'Status', 'Device', 'Notes']);

            $attendances = \App\Models\Employee\Attendance::with('employee')->when($request->search, function($q, $v) {
                $q->whereHas('employee', function($sq) use ($v) {
                    $sq->where('name', 'like', "%{$v}%")
                      ->orWhere('employee_number', 'like', "%{$v}%");
                });
            })->get();

            foreach ($attendances as $att) {
                fputcsv($file, [
                    $att->employee?->employee_number ?? '',
                    $att->employee?->name ?? '',
                    $att->attendance_date ? (is_string($att->attendance_date) ? $att->attendance_date : $att->attendance_date->format('Y-m-d')) : ($att->date ? (is_string($att->date) ? $att->date : $att->date->format('Y-m-d')) : ''),
                    $att->check_in ?? '',
                    $att->check_out ?? '',
                    $att->worked_hours_formatted,
                    $att->late_minutes ?? 0,
                    $att->early_leave_minutes ?? 0,
                    $att->overtime_minutes ?? 0,
                    $att->status,
                    $att->device_name ?? 'Web',
                    $att->notes ?? ''
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    // ─── IMPORT CSV ─────────────────────────────────────────────────────────
    public function import(Request $request): JsonResponse
    {
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
            $date = trim($data['date'] ?? '');
            $check_in = trim($data['check_in'] ?? $data['check in'] ?? '');
            $check_out = trim($data['check_out'] ?? $data['check out'] ?? '');
            $status = strtolower(trim($data['status'] ?? 'present'));
            $notes = trim($data['notes'] ?? '');

            if (empty($employee_number) || empty($date)) {
                $errors[] = "Line {$line}: Employee Number and Date are required.";
                continue;
            }

            $emp = Employee::where('employee_number', $employee_number)->first();
            if (!$emp) {
                $errors[] = "Line {$line}: Employee with number '{$employee_number}' not found.";
                continue;
            }

            $this->service->create([
                'company_id'      => $emp->company_id,
                'branch_id'       => $emp->branch_id,
                'employee_id'     => $emp->id,
                'department_id'   => $emp->department_id,
                'position_id'     => $emp->position_id,
                'attendance_date' => $date,
                'date'            => $date,
                'check_in'        => $check_in ?: null,
                'check_out'       => $check_out ?: null,
                'status'          => in_array($status, ['present', 'absent', 'late', 'leave', 'holiday']) ? $status : 'present',
                'notes'           => $notes ?: null
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
