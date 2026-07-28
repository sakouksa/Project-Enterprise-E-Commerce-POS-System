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
            filters: $request->only([
                'search', 'category_id', 'brand_id', 'unit_id', 'tax_id',
                'status', 'is_featured', 'is_digital', 'inventory', 'has_variants',
                'created_start', 'created_end', 'updated_start', 'updated_end',
                'start_date', 'end_date', 'created_from', 'created_to', 'date_from', 'date_to',
                'stock_level', 'price_min', 'price_max'
            ]),
            perPage: $request->integer('per_page', 10),
            sort: $request->get('sort_by', $request->get('sort', 'created_at')),
            order: $request->get('sort_order', $request->get('order', 'desc'))
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

    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = 0;
        foreach ($ids as $id) {
            try {
                $this->productService->deleteProduct($id);
                $count++;
            } catch (\Exception $e) {
                // Ignore or log
            }
        }
        return $this->successResponse(null, "{$count} products deleted successfully");
    }

    public function bulkRestore(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])['ids'];
        $count = 0;
        foreach ($ids as $id) {
            try {
                $this->productService->restoreProduct($id);
                $count++;
            } catch (\Exception $e) {
                // Ignore or log
            }
        }
        return $this->successResponse(null, "{$count} products restored successfully");
    }

    public function stats(Request $request): JsonResponse
    {
        $companyId = auth()->user()?->company_id ?? 1;

        $totalProducts = \App\Models\Product\Product::where('company_id', $companyId)->count();
        $activeProducts = \App\Models\Product\Product::where('company_id', $companyId)->where('status', 'active')->count();
        $inactiveProducts = \App\Models\Product\Product::where('company_id', $companyId)->where('status', 'inactive')->count();
        $draftProducts = \App\Models\Product\Product::where('company_id', $companyId)->where('status', 'draft')->count();
        $archivedProducts = \App\Models\Product\Product::where('company_id', $companyId)->where('status', 'archived')->count();
        $featuredProducts = \App\Models\Product\Product::where('company_id', $companyId)->where('is_featured', true)->count();
        $digitalProducts = \App\Models\Product\Product::where('company_id', $companyId)->where('is_digital', true)->count();
        $productsWithVariants = \App\Models\Product\Product::where('company_id', $companyId)->where('has_variants', true)->count();

        $categoriesCount = \App\Models\Product\Category::count();
        $brandsCount = \App\Models\Product\Brand::count();
        $attributesCount = \App\Models\Product\Attribute::count();
        $variantsCount = \App\Models\Product\ProductVariant::count();

        $outOfStock = \App\Models\Product\Product::where('company_id', $companyId)
            ->where('track_inventory', true)
            ->whereRaw('(SELECT COALESCE(SUM(quantity), 0) FROM inventories WHERE inventories.product_id = products.id) <= 0')
            ->count();

        $lowStockProducts = \App\Models\Product\Product::where('company_id', $companyId)
            ->where('track_inventory', true)
            ->whereRaw('(SELECT COALESCE(SUM(quantity), 0) FROM inventories WHERE inventories.product_id = products.id) <= products.low_stock_threshold')
            ->count();

        $costValue = (float) (\App\Models\Product\Product::where('company_id', $companyId)
            ->selectRaw('COALESCE(SUM(cost_price * (SELECT COALESCE(SUM(quantity), 0) FROM inventories WHERE inventories.product_id = products.id)), 0) as val')
            ->value('val') ?? 0);

        $sellingValue = (float) (\App\Models\Product\Product::where('company_id', $companyId)
            ->selectRaw('COALESCE(SUM(selling_price * (SELECT COALESCE(SUM(quantity), 0) FROM inventories WHERE inventories.product_id = products.id)), 0) as val')
            ->value('val') ?? 0);

        $potentialProfit = max(0, $sellingValue - $costValue);

        $avgPrice = (float) (\App\Models\Product\Product::where('company_id', $companyId)->avg('selling_price') ?? 0);
        $averageRating = (float) (\App\Models\Product\Product::where('company_id', $companyId)->avg('rating_avg') ?? 0);
        $totalViews = (int) (\App\Models\Product\Product::where('company_id', $companyId)->sum('view_count') ?? 0);
        $totalSold = (int) (\App\Models\Product\Product::where('company_id', $companyId)->sum('sold_count') ?? 0);

        $todayNew = \App\Models\Product\Product::where('company_id', $companyId)->whereDate('created_at', now()->today())->count();
        $productsOnSale = \App\Models\Product\Product::where('company_id', $companyId)->whereNotNull('compare_price')->count();
        $productsWithDiscount = \App\Models\Product\Product::where('company_id', $companyId)->where('is_featured', true)->count();
        $recentlyUpdated = \App\Models\Product\Product::where('company_id', $companyId)->where('updated_at', '>=', now()->subDays(7))->count();

        return $this->successResponse([
            'total_products'         => $totalProducts,
            'active_products'        => $activeProducts,
            'inactive_products'      => $inactiveProducts,
            'draft_products'         => $draftProducts,
            'archived_products'      => $archivedProducts,
            'out_of_stock'           => $outOfStock,

            'categories'             => $categoriesCount,
            'brands'                 => $brandsCount,
            'attributes'             => $attributesCount,
            'variants'               => $variantsCount,

            'cost_value'             => round($costValue, 2),
            'selling_value'          => round($sellingValue, 2),
            'potential_profit'       => round($potentialProfit, 2),
            'inventory_value'        => round($sellingValue, 2),
            'profit_value'           => round($potentialProfit, 2),
            'average_price'          => round($avgPrice, 2),

            'best_selling'           => (int) $totalSold,
            'low_selling'            => 0,
            'most_viewed'            => (int) $totalViews,
            'average_rating'         => round($averageRating, 2),

            'today_new_products'     => $todayNew,
            'low_stock'              => $lowStockProducts,
            'low_stock_products'     => $lowStockProducts,
            'products_on_sale'       => $productsOnSale,
            'products_with_discount' => $productsWithDiscount,
            'recently_updated'       => $recentlyUpdated,
        ], 'Product statistics retrieved successfully');
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename=products_export_' . now()->format('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function () use ($request) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, [
                'SKU', 'Name', 'Slug', 'Barcode', 'Category', 'Brand', 'Unit', 'Tax',
                'Cost Price', 'Selling Price', 'Compare Price', 'Weight', 'Length', 'Width', 'Height',
                'Track Inventory', 'Low Stock Threshold', 'Status', 'Featured', 'Digital'
            ]);

            $query = \App\Models\Product\Product::with(['category', 'brand', 'unit', 'tax']);

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('sku', 'like', "%{$search}%")
                      ->orWhere('barcode', 'like', "%{$search}%");
                });
            }

            if ($request->filled('status')) {
                if ($request->status === 'deleted') {
                    $query->onlyTrashed();
                } else {
                    $query->where('status', $request->status);
                }
            }

            if ($request->filled('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            if ($request->filled('brand_id')) {
                $query->where('brand_id', $request->brand_id);
            }

            $products = $query->latest()->get();

            foreach ($products as $prod) {
                // Prevent Excel scientific notation for barcode (e.g. 8.88E+12)
                $barcode = $prod->barcode ? '="' . $prod->barcode . '"' : '';

                fputcsv($file, [
                    $prod->sku,
                    $prod->name,
                    $prod->slug,
                    $barcode,
                    $prod->category?->name ?? '',
                    $prod->brand?->name ?? '',
                    $prod->unit?->name ?? '',
                    $prod->tax?->name ?? '',
                    number_format((float) $prod->cost_price, 2, '.', ''),
                    number_format((float) $prod->selling_price, 2, '.', ''),
                    $prod->compare_price !== null ? number_format((float) $prod->compare_price, 2, '.', '') : '',
                    $prod->weight !== null ? number_format((float) $prod->weight, 2, '.', '') : '',
                    $prod->length !== null ? number_format((float) $prod->length, 2, '.', '') : '',
                    $prod->width !== null ? number_format((float) $prod->width, 2, '.', '') : '',
                    $prod->height !== null ? number_format((float) $prod->height, 2, '.', '') : '',
                    $prod->track_inventory ? '1' : '0',
                    $prod->low_stock_threshold,
                    $prod->status,
                    $prod->is_featured ? '1' : '0',
                    $prod->is_digital ? '1' : '0'
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

            $sku = trim($data['sku'] ?? '');
            $name = trim($data['name'] ?? '');
            if (!$sku || !$name) {
                $errors[] = "Line {$line}: SKU and Name are required.";
                continue;
            }

            if (\App\Models\Product\Product::where('sku', $sku)->exists()) {
                $errors[] = "Line {$line}: SKU '{$sku}' already exists.";
                continue;
            }

            $catId = null;
            if ($catName = trim($data['category'] ?? '')) {
                $catId = \App\Models\Product\Category::where('name', $catName)->value('id');
            }
            $brandId = null;
            if ($brandName = trim($data['brand'] ?? '')) {
                $brandId = \App\Models\Product\Brand::where('name', $brandName)->value('id');
            }
            $unitId = null;
            if ($unitName = trim($data['unit'] ?? '')) {
                $unitId = \App\Models\Product\Unit::where('name', $unitName)->value('id');
            }
            $taxId = null;
            if ($taxName = trim($data['tax'] ?? '')) {
                $taxId = \App\Models\Product\Tax::where('name', $taxName)->value('id');
            }

            $rawBarcode = trim($data['barcode'] ?? '');
            $barcode = trim(trim($rawBarcode, '="\''));

            \App\Models\Product\Product::create([
                'company_id'          => $request->user()->company_id ?? 1,
                'sku'                 => $sku,
                'name'                => $name,
                'slug'                => trim($data['slug'] ?? '') ?: \Illuminate\Support\Str::slug($name),
                'barcode'             => $barcode ?: null,
                'category_id'         => $catId,
                'brand_id'            => $brandId,
                'unit_id'             => $unitId,
                'tax_id'              => $taxId,
                'cost_price'          => floatval($data['cost_price'] ?? $data['cost price'] ?? 0),
                'selling_price'       => floatval($data['selling_price'] ?? $data['selling price'] ?? 0),
                'compare_price'       => floatval($data['compare_price'] ?? $data['compare price'] ?? 0) ?: null,
                'weight'              => floatval($data['weight'] ?? 0) ?: null,
                'length'              => floatval($data['length'] ?? 0) ?: null,
                'width'               => floatval($data['width'] ?? 0) ?: null,
                'height'              => floatval($data['height'] ?? 0) ?: null,
                'track_inventory'     => filter_var($data['track_inventory'] ?? $data['track inventory'] ?? true, FILTER_VALIDATE_BOOLEAN),
                'low_stock_threshold' => intval($data['low_stock_threshold'] ?? $data['low stock threshold'] ?? 5),
                'status'              => trim($data['status'] ?? 'active'),
                'is_featured'         => filter_var($data['featured'] ?? $data['is_featured'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'is_digital'          => filter_var($data['digital'] ?? $data['is_digital'] ?? false, FILTER_VALIDATE_BOOLEAN)
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
