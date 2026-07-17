<?php

namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Product\Category;
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
        $categories = Category::when($request->status === 'deleted', function ($q) {
                $q->onlyTrashed();
            })
            ->when($request->status && $request->status !== 'deleted', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active');
            })
            ->when($request->search, fn($q, $v) => $q->where('name', 'like', "%{$v}%"))
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
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id'  => 'required|exists:companies,id',
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string',
            'is_active'   => 'sometimes|boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $category = Category::create($data);

        return $this->successResponse($category, 'Category created successfully', 201);
    }

    /**
     * PUT /api/v1/categories/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $data = $request->validate([
            'name'        => 'sometimes|required|string|max:100',
            'description' => 'nullable|string',
            'is_active'   => 'sometimes|boolean',
        ]);

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
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
}
