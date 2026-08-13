<?php

namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Product\Brand;
use App\Http\Requests\Product\StoreBrandRequest;
use App\Http\Requests\Product\UpdateBrandRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BrandController extends BaseApiController
{
    /**
     * GET /api/v1/brands
     */
    public function index(Request $request): JsonResponse
    {
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['id', 'name', 'slug', 'description', 'is_active', 'created_at'];
        $sortBy = in_array($sortBy, $allowedSorts) ? $sortBy : 'id';
        $sortOrder = in_array(strtolower($sortOrder), ['asc', 'desc']) ? $sortOrder : 'desc';

        $brands = Brand::when($request->status === 'deleted', function ($q) {
                $q->onlyTrashed();
            })
            ->when($request->status && $request->status !== 'deleted', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active');
            })
            ->when($request->search, fn($q, $v) => $q->where('name', 'like', "%{$v}%"))
            ->orderBy($sortBy, $sortOrder)
            ->paginate($request->integer('per_page', 10));

        return $this->paginatedResponse($brands);
    }

    /**
     * GET /api/v1/brands/{id}
     */
    public function show(int $id): JsonResponse
    {
        $brand = Brand::findOrFail($id);
        return $this->successResponse($brand);
    }

    /**
     * POST /api/v1/brands
     */
    public function store(StoreBrandRequest $request): JsonResponse
    {
        $data = $request->validated();
        if (!isset($data['slug']) || empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $uploadedLogo = $request->file('logo_file') ?? $request->file('logo');
        if ($uploadedLogo) {
            $path = $uploadedLogo->store('brands', 'public');
            $data['logo'] = $path;
        }

        $brand = Brand::create($data);

        return $this->successResponse($brand, 'Brand created successfully', 201);
    }

    /**
     * PUT /api/v1/brands/{id}
     */
    public function update(UpdateBrandRequest $request, int $id): JsonResponse
    {
        $brand = Brand::findOrFail($id);
        $data = $request->validated();

        if (isset($data['name']) && (!isset($data['slug']) || empty($data['slug']))) {
            $data['slug'] = Str::slug($data['name']);
        }

        $uploadedLogo = $request->file('logo_file') ?? $request->file('logo');
        if ($uploadedLogo) {
            if ($brand->logo && \Illuminate\Support\Facades\Storage::disk('public')->exists($brand->logo)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($brand->logo);
            }
            $path = $uploadedLogo->store('brands', 'public');
            $data['logo'] = $path;
        }

        $brand->update($data);

        return $this->successResponse($brand, 'Brand updated successfully');
    }

    /**
     * DELETE /api/v1/brands/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $brand = Brand::findOrFail($id);
            $brand->delete();
            return $this->successResponse(null, 'Brand deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * POST /api/v1/brands/{id}/restore
     */
    public function restore(int $id): JsonResponse
    {
        try {
            $brand = Brand::onlyTrashed()->findOrFail($id);
            $brand->restore();
            return $this->successResponse(null, 'Brand restored successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * DELETE /api/v1/brands/{id}/force
     */
    public function forceDelete(int $id): JsonResponse
    {
        try {
            $brand = Brand::withTrashed()->findOrFail($id);
            
            // Clean up physical logo file if exists
            if ($brand->logo && \Illuminate\Support\Facades\Storage::disk('public')->exists($brand->logo)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($brand->logo);
            }
            
            $brand->forceDelete();
            return $this->successResponse(null, 'Brand permanently deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = 0;
        foreach ($ids as $id) {
            $brand = Brand::find($id);
            if ($brand) {
                $brand->delete();
                $count++;
            }
        }
        return $this->successResponse(null, "{$count} brands deleted successfully");
    }

    public function bulkRestore(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = 0;
        foreach ($ids as $id) {
            $brand = Brand::onlyTrashed()->find($id);
            if ($brand) {
                $brand->restore();
                $count++;
            }
        }
        return $this->successResponse(null, "{$count} brands restored successfully");
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename=brands_export_' . now()->format('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function () use ($request) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, ['Name', 'Slug', 'Description', 'Logo', 'Active']);

            $brands = Brand::all();

            foreach ($brands as $brand) {
                fputcsv($file, [
                    $brand->name,
                    $brand->slug,
                    $brand->description ?? '',
                    $brand->logo ?? '',
                    $brand->is_active ? '1' : '0'
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');
        if ($handle === false) {
            return response()->json(['success' => false, 'message' => 'Cannot open file'], 400);
        }

        $bom = fread($handle, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            rewind($handle);
        }

        $headers = fgetcsv($handle);
        if (!$headers) {
            fclose($handle);
            return response()->json(['success' => false, 'message' => 'Empty CSV'], 400);
        }
        $headers = array_map(fn($h) => strtolower(trim($h)), $headers);

        $successCount = 0;
        $errors = [];
        $line = 1;

        while (($row = fgetcsv($handle)) !== false) {
            $line++;
            if (count($row) < count($headers)) {
                $row = array_pad($row, count($headers), '');
            } else {
                $row = array_slice($row, 0, count($headers));
            }
            $data = array_combine($headers, $row);

            $name = trim($data['name'] ?? '');
            if (!$name) {
                $errors[] = "Line {$line}: Name is required.";
                continue;
            }

            $slug = trim($data['slug'] ?? '') ?: Str::slug($name);
            if (Brand::where('slug', $slug)->exists()) {
                $errors[] = "Line {$line}: Brand slug '{$slug}' already exists.";
                continue;
            }

            Brand::create([
                'company_id'  => $request->user()->company_id ?? 1,
                'name'        => $name,
                'slug'        => $slug,
                'description' => trim($data['description'] ?? '') ?: null,
                'logo'        => trim($data['logo'] ?? '') ?: null,
                'is_active'   => filter_var($data['active'] ?? $data['is_active'] ?? true, FILTER_VALIDATE_BOOLEAN)
            ]);
            $successCount++;
        }
        fclose($handle);

        return response()->json([
            'success' => true,
            'message' => 'Import completed',
            'data' => [
                'success_count' => $successCount,
                'errors' => $errors
            ]
        ]);
    }
}
