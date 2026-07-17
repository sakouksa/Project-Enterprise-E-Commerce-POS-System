<?php

namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\Product\ProductResource;
use App\Http\Resources\Product\ProductCollection;
use App\Infrastructure\Services\Product\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends BaseApiController
{
    public function __construct(private readonly ProductService $productService)
    {
    }

    /**
     * GET /api/v1/products
     */
    public function index(Request $request): JsonResponse
    {
        $products = $this->productService->getPaginatedProducts(
            filters: $request->only(['search', 'category_id', 'brand_id', 'status', 'is_featured']),
            perPage: $request->integer('per_page', 10),
            sort: $request->get('sort', 'created_at'),
            order: $request->get('order', 'desc')
        );

        $resourceCollection = ProductResource::collection($products);

        return response()->json([
            'success'    => true,
            'message'    => 'Success',
            'data'       => $resourceCollection->resolve(),
            'pagination' => [
                'total'        => $products->total(),
                'per_page'     => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
                'from'         => $products->firstItem(),
                'to'           => $products->lastItem(),
            ],
        ]);
    }

    /**
     * GET /api/v1/products/{id}
     */
    public function show(int $id): JsonResponse
    {
        $product = $this->productService->getProductById($id);

        return $this->successResponse(new ProductResource($product));
    }

    /**
     * POST /api/v1/products
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->productService->createProduct($request->validated());

        return $this->successResponse(new ProductResource($product), 'Product created successfully', 201);
    }

    /**
     * PUT /api/v1/products/{id}
     */
    public function update(UpdateProductRequest $request, int $id): JsonResponse
    {
        $product = $this->productService->updateProduct($id, $request->validated());

        return $this->successResponse(new ProductResource($product), 'Product updated successfully');
    }

    /**
     * DELETE /api/v1/products/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->productService->deleteProduct($id);
            return $this->successResponse(null, 'Product deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * POST /api/v1/products/{id}/restore
     */
    public function restore(int $id): JsonResponse
    {
        try {
            $this->productService->restoreProduct($id);
            return $this->successResponse(null, 'Product restored successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * DELETE /api/v1/products/{id}/force
     */
    public function forceDelete(int $id): JsonResponse
    {
        try {
            $this->productService->forceDeleteProduct($id);
            return $this->successResponse(null, 'Product permanently deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * POST /api/v1/products/{id}/images
     */
    public function uploadImages(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'images'         => 'required|array|max:10',
            'images.*'       => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'primary_index'  => 'sometimes|integer|min:0',
        ], [
            'images.*.image' => 'Upload failed',
            'images.*.mimes' => 'Invalid image format',
            'images.*.max'   => 'File too large',
        ]);

        $images = $this->productService->uploadProductImages($id, $request->file('images'), $request->integer('primary_index', 0));

        return $this->successResponse($images, 'Images uploaded successfully');
    }

    /**
     * DELETE /api/v1/products/{product}/images/{image}
     */
    public function deleteImage(int $productId, int $imageId): JsonResponse
    {
        $productImage = \App\Models\Product\ProductImage::where('product_id', $productId)->findOrFail($imageId);

        // Delete physical file
        if (\Illuminate\Support\Facades\Storage::disk('public')->exists($productImage->image)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($productImage->image);
        }

        // Delete thumbnail file
        $thumbPath = str_replace('products/' . $productId . '/', 'products/' . $productId . '/thumbs/', $productImage->image);
        if (\Illuminate\Support\Facades\Storage::disk('public')->exists($thumbPath)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($thumbPath);
        }

        $productImage->delete();

        return $this->successResponse(null, 'Image removed successfully');
    }

    /**
     * GET /api/v1/products/{id}/variants
     */
    public function variants(int $id): JsonResponse
    {
        $variants = $this->productService->getProductVariants($id);

        return $this->successResponse($variants);
    }

    /**
     * GET /api/v1/store/products/{slug}
     */
    public function showBySlug(string $slug): JsonResponse
    {
        $product = \App\Models\Product\Product::where('slug', $slug)
            ->with(['category', 'brand', 'unit', 'tax', 'images', 'variants', 'prices'])
            ->firstOrFail();

        return $this->successResponse(new ProductResource($product));
    }
}
