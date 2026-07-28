<?php

namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Product\Category;
use App\Http\Requests\Product\StoreCategoryRequest;
use App\Http\Requests\Product\UpdateCategoryRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends BaseApiController
{
    /**
     * GET /api/v1/categories
     */
    public function index(Request $request): JsonResponse
    {
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['name', 'slug', 'description', 'is_active', 'created_at'];
        $sortBy = in_array($sortBy, $allowedSorts) ? $sortBy : 'created_at';
        $sortOrder = in_array(strtolower($sortOrder), ['asc', 'desc']) ? $sortOrder : 'desc';

        $categories = Category::with('parent')
            ->when($request->status === 'deleted', function ($q) {
                $q->onlyTrashed();
            })
            ->when($request->status && $request->status !== 'deleted', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active');
            })
            ->when($request->search, fn($q, $v) => $q->where('name', 'like', "%{$v}%"))
            ->orderBy($sortBy, $sortOrder)
            ->paginate($request->integer('per_page', 10));

        return $this->paginatedResponse($categories);
    }

    /**
     * GET /api/v1/categories/{id}
     */
    public function show(int $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        return $this->successResponse($category);
    }

    /**
     * POST /api/v1/categories
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $data = $request->validated();
        if (!isset($data['slug']) || empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('categories', 'public');
            $data['image'] = $path;
        }

        $category = Category::create($data);

        return $this->successResponse($category, 'Category created successfully', 201);
    }

    /**
     * PUT /api/v1/categories/{id}
     */
    public function update(UpdateCategoryRequest $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $data = $request->validated();

        if (isset($data['name']) && (!isset($data['slug']) || empty($data['slug']))) {
            $data['slug'] = Str::slug($data['name']);
        }

        if ($request->hasFile('image_file')) {
            if ($category->image && \Illuminate\Support\Facades\Storage::disk('public')->exists($category->image)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($category->image);
            }
            $path = $request->file('image_file')->store('categories', 'public');
            $data['image'] = $path;
        }

        $category->update($data);

        return $this->successResponse($category, 'Category updated successfully');
    }

    /**
     * DELETE /api/v1/categories/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $category = Category::findOrFail($id);
            $category->delete();
            return $this->successResponse(null, 'Category deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * POST /api/v1/categories/{id}/restore
     */
    public function restore(int $id): JsonResponse
    {
        try {
            $category = Category::onlyTrashed()->findOrFail($id);
            $category->restore();
            return $this->successResponse(null, 'Category restored successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * DELETE /api/v1/categories/{id}/force
     */
    public function forceDelete(int $id): JsonResponse
    {
        try {
            $category = Category::withTrashed()->findOrFail($id);
            
            // Clean up physical image file if exists
            if ($category->image && \Illuminate\Support\Facades\Storage::disk('public')->exists($category->image)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($category->image);
            }
            
            $category->forceDelete();
            return $this->successResponse(null, 'Category permanently deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * GET /api/v1/store/categories/{slug}
     */
    public function showBySlug(string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        return $this->successResponse($category);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = 0;
        foreach ($ids as $id) {
            $category = Category::find($id);
            if ($category) {
                $category->delete();
                $count++;
            }
        }
        return $this->successResponse(null, "{$count} categories deleted successfully");
    }

    public function bulkRestore(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = 0;
        foreach ($ids as $id) {
            $category = Category::onlyTrashed()->find($id);
            if ($category) {
                $category->restore();
                $count++;
            }
        }
        return $this->successResponse(null, "{$count} categories restored successfully");
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename=categories_export_' . now()->format('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function () use ($request) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, ['Parent Category', 'Name', 'Slug', 'Description', 'Image', 'Sort Order', 'Active']);

            $categories = Category::with('parent')->get();

            foreach ($categories as $cat) {
                fputcsv($file, [
                    $cat->parent?->name ?? '',
                    $cat->name,
                    $cat->slug,
                    $cat->description ?? '',
                    $cat->image ?? '',
                    $cat->sort_order,
                    $cat->is_active ? '1' : '0'
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
            if (Category::where('slug', $slug)->exists()) {
                $errors[] = "Line {$line}: Category slug '{$slug}' already exists.";
                continue;
            }

            $parentId = null;
            if ($parentName = trim($data['parent_category'] ?? $data['parent category'] ?? '')) {
                $parentId = Category::where('name', $parentName)->value('id');
            }

            Category::create([
                'company_id'  => $request->user()->company_id ?? 1,
                'parent_id'   => $parentId,
                'name'        => $name,
                'slug'        => $slug,
                'description' => trim($data['description'] ?? '') ?: null,
                'image'       => trim($data['image'] ?? '') ?: null,
                'sort_order'  => intval($data['sort_order'] ?? $data['sort order'] ?? 0),
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
