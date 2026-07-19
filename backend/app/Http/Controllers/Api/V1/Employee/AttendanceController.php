<?php
namespace App\Http\Controllers\Api\V1\Employee;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Employee\CreateAttendanceRequest;
use App\Http\Requests\Employee\UpdateAttendanceRequest;
use App\Http\Resources\Employee\AttendanceResource;
use App\Infrastructure\Services\Employee\AttendanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends BaseApiController
{
    public function __construct(private readonly AttendanceService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('attendance.view')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $records = $this->service->getPaginated(
            $request->integer('per_page', 10),
            $request->all(),
            $request->get('sort_by', 'date'),
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
        if ($request->user() && !$request->user()->can('attendance.create')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new AttendanceResource($record),
            'Attendance created successfully',
            201
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('attendance.view')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $record = $this->service->getById($id);
        return $this->successResponse(
            new AttendanceResource($record),
            'Attendance details retrieved successfully'
        );
    }

    public function update(UpdateAttendanceRequest $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('attendance.update')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new AttendanceResource($record),
            'Attendance updated successfully'
        );
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('attendance.delete')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Attendance deleted successfully'
        );
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('attendance.delete')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = $this->service->bulkDelete($ids);

        return $this->successResponse(
            null,
            "{$count} attendance records deleted successfully"
        );
    }

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

            fputcsv($file, ['Employee Number', 'Employee Name', 'Date', 'Check In', 'Check Out', 'Status', 'Notes']);

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
                    $att->date->format('Y-m-d'),
                    $att->check_in ?? '',
                    $att->check_out ?? '',
                    $att->status,
                    $att->notes ?? ''
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function import(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('attendance.create')) {
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
            $date = trim($data['date'] ?? '');
            $check_in = trim($data['check_in'] ?? $data['check in'] ?? '');
            $check_out = trim($data['check_out'] ?? $data['check out'] ?? '');
            $status = strtolower(trim($data['status'] ?? 'present'));
            $notes = trim($data['notes'] ?? '');

            if (empty($employee_number)) {
                $errors[] = "Line {$line}: Employee Number is required.";
                continue;
            }

            if (empty($date)) {
                $errors[] = "Line {$line}: Date is required.";
                continue;
            }

            $emp = \App\Models\Employee\Employee::where('employee_number', $employee_number)->first();
            if (!$emp) {
                $errors[] = "Line {$line}: Employee with number '{$employee_number}' not found.";
                continue;
            }

            $exists = \App\Models\Employee\Attendance::where('employee_id', $emp->id)->where('date', $date)->exists();
            if ($exists) {
                $errors[] = "Line {$line}: Attendance record for employee '{$employee_number}' on {$date} already exists.";
                continue;
            }

            \App\Models\Employee\Attendance::create([
                'employee_id' => $emp->id,
                'date'        => $date,
                'check_in'    => $check_in ?: null,
                'check_out'   => $check_out ?: null,
                'status'      => in_array($status, ['present', 'absent', 'late', 'leave', 'holiday']) ? $status : 'present',
                'notes'       => $notes ?: null
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
