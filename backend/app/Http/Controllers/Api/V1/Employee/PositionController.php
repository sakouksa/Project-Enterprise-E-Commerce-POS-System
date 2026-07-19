<?php
namespace App\Http\Controllers\Api\V1\Employee;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Employee\CreatePositionRequest;
use App\Http\Requests\Employee\UpdatePositionRequest;
use App\Http\Resources\Employee\PositionResource;
use App\Infrastructure\Services\Employee\PositionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PositionController extends BaseApiController
{
    public function __construct(private readonly PositionService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('position.view')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $records = $this->service->getPaginated(
            $request->integer('per_page', 10),
            $request->all(),
            $request->get('sort_by', 'created_at'),
            $request->get('sort_order', 'desc')
        );

        return $this->paginatedResourceResponse(
            PositionResource::collection($records),
            $records,
            'Position list retrieved successfully'
        );
    }

    public function store(CreatePositionRequest $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('position.create')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new PositionResource($record),
            'Position created successfully',
            201
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('position.view')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $record = $this->service->getById($id);
        return $this->successResponse(
            new PositionResource($record),
            'Position details retrieved successfully'
        );
    }

    public function update(UpdatePositionRequest $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('position.update')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new PositionResource($record),
            'Position updated successfully'
        );
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('position.delete')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $this->service->delete($id);
        return $this->successResponse(
            null,
            'Position deleted successfully'
        );
    }

    public function restore(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('position.update')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $this->service->restore($id);
        return $this->successResponse(
            null,
            'Position restored successfully'
        );
    }

    public function forceDelete(Request $request, int $id): JsonResponse
    {
        if ($request->user() && !$request->user()->can('position.delete')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $this->service->forceDelete($id);
        return $this->successResponse(
            null,
            'Position permanently deleted'
        );
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('position.delete')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = $this->service->bulkDelete($ids);

        return $this->successResponse(
            null,
            "{$count} positions deleted successfully"
        );
    }

    public function bulkRestore(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('position.update')) {
            return $this->errorResponse('Unauthorized', null, 403);
        }

        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = $this->service->bulkRestore($ids);

        return $this->successResponse(
            null,
            "{$count} positions restored successfully"
        );
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=positions_export_' . now()->format('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function () use ($request) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, ['ID', 'Name', 'Code', 'Department', 'Description', 'Status']);

            $positions = \App\Models\Employee\Position::with('department')->when($request->search, function($q, $v) {
                $q->where('name', 'like', "%{$v}%")
                  ->orWhere('code', 'like', "%{$v}%");
            })->get();

            foreach ($positions as $pos) {
                fputcsv($file, [
                    $pos->id,
                    $pos->name,
                    $pos->code,
                    $pos->department?->name ?? '',
                    $pos->description,
                    $pos->is_active ? 'Active' : 'Inactive'
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function import(Request $request): JsonResponse
    {
        if ($request->user() && !$request->user()->can('position.create')) {
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

            $name = trim($data['name'] ?? '');
            $code = trim($data['code'] ?? '');
            $departmentName = trim($data['department'] ?? '');
            $description = trim($data['description'] ?? '');
            $is_active = filter_var($data['status'] ?? $data['is_active'] ?? 'active', FILTER_VALIDATE_BOOLEAN) || strtolower($data['status'] ?? '') === 'active' || strtolower($data['status'] ?? '') === '1';

            if (empty($name)) {
                $errors[] = "Line {$line}: Name is required.";
                continue;
            }

            if (empty($departmentName)) {
                $errors[] = "Line {$line}: Department is required.";
                continue;
            }

            $dept = \App\Models\Employee\Department::where('name', $departmentName)->first();
            if (!$dept) {
                $errors[] = "Line {$line}: Department '{$departmentName}' not found.";
                continue;
            }

            $exists = \App\Models\Employee\Position::where('name', $name)
                ->where('department_id', $dept->id)
                ->orWhere(function ($q) use ($code) {
                    if ($code) $q->where('code', $code);
                })
                ->exists();

            if ($exists) {
                $errors[] = "Line {$line}: Position with name '{$name}' or code '{$code}' already exists.";
                continue;
            }

            \App\Models\Employee\Position::create([
                'company_id'    => $request->user()->company_id ?? 1,
                'department_id' => $dept->id,
                'name'          => $name,
                'code'          => $code ?: null,
                'description'   => $description ?: null,
                'is_active'     => $is_active
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
