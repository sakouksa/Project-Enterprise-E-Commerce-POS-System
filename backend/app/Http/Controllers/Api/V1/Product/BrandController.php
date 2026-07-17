<?php

namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Product\Brand;
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
        $brands = Brand::when($request->status === 'deleted', function ($q) {
                $q->onlyTrashed();
            })
            ->when($request->status && $request->status !== 'deleted', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active');
            })
            ->when($request->search, fn($q, $v) => $q->where('name', 'like', "%{$v}%"))
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
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id'  => 'required|exists:companies,id',
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string',
            'is_active'   => 'sometimes|boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $brand = Brand::create($data);

        return $this->successResponse($brand, 'Brand created successfully', 201);
    }

    /**
     * PUT /api/v1/brands/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $brand = Brand::findOrFail($id);

        $data = $request->validate([
            'name'        => 'sometimes|required|string|max:100',
            'description' => 'nullable|string',
            'is_active'   => 'sometimes|boolean',
        ]);

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
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
}
