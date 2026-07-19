<?php
namespace App\Http\Controllers\Api\V1\Employee;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Employee\CreateDepartmentRequest;
use App\Http\Requests\Employee\UpdateDepartmentRequest;
use App\Http\Resources\Employee\DepartmentResource;
use App\Infrastructure\Services\Employee\DepartmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends BaseApiController
{
    public function __construct(private readonly DepartmentService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('department.view')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $records = $this->service->getPaginated(
            $request->integer('per_page', 10),
            $request->all(),
            $request->get('sort_by', 'created_at'),
            $request->get('sort_order', 'desc')
        );

        return $this->paginatedResourceResponse(
            DepartmentResource::collection($records),
            $records,
            'Department list retrieved successfully'
        );
    }

    public function store(CreateDepartmentRequest $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('department.create')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new DepartmentResource($record),
            'Department created successfully',
            201
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('department.view')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $record = $this->service->getById($id);
        return $this->successResponse(
            new DepartmentResource($record),
            'Department details retrieved successfully'
        );
    }

    public function update(UpdateDepartmentRequest $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('department.update')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new DepartmentResource($record),
            'Department updated successfully'
        );
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('department.delete')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Department deleted successfully'
        );
    }

    public function restore(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('department.update')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $this->service->restore($id);
        return $this->successResponse(
            null,
            'Department restored successfully'
        );
    }

    public function forceDelete(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('department.delete')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $this->service->forceDelete($id);
        return $this->successResponse(
            null,
            'Department permanently deleted'
        );
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('department.delete')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = $this->service->bulkDelete($ids);

        return $this->successResponse(
            null,
            "{$count} departments deleted successfully"
        );
    }

    public function bulkRestore(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('department.update')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = $this->service->bulkRestore($ids);

        return $this->successResponse(
            null,
            "{$count} departments restored successfully"
        );
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=departments_export_' . now()->format('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function () use ($request) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, ['ID', 'Name', 'Code', 'Description', 'Status']);

            $departments = \App\Models\Employee\Department::when($request->search, function($q, $v) {
                $q->where('name', 'like', "%{$v}%")
                  ->orWhere('code', 'like', "%{$v}%");
            })->get();

            foreach ($departments as $dept) {
                fputcsv($file, [
                    $dept->id,
                    $dept->name,
                    $dept->code,
                    $dept->description,
                    $dept->is_active ? 'Active' : 'Inactive'
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function import(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('department.create')) {
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
            
            // Pad or slice row to match headers count
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

            $name = trim($data['name'] ?? '');
            $code = trim($data['code'] ?? '');
            $description = trim($data['description'] ?? '');
            $is_active = filter_var($data['status'] ?? $data['is_active'] ?? 'active', FILTER_VALIDATE_BOOLEAN) || strtolower($data['status'] ?? '') === 'active' || strtolower($data['status'] ?? '') === '1';

            if (empty($name)) {
                $errors[] = "Line {$line}: Name is required.";
                continue;
            }

            $exists = \App\Models\Employee\Department::where('name', $name)
                ->orWhere(function ($q) use ($code) {
                    if ($code) $q->where('code', $code);
                })
                ->exists();

            if ($exists) {
                $errors[] = "Line {$line}: Department with name '{$name}' or code '{$code}' already exists.";
                continue;
            }

            \App\Models\Employee\Department::create([
                'company_id' => $request->user()->company_id ?? 1,
                'branch_id'  => $request->user()->branch_id ?? 1,
                'name'       => $name,
                'code'       => $code ?: null,
                'description'=> $description ?: null,
                'is_active'  => $is_active
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
