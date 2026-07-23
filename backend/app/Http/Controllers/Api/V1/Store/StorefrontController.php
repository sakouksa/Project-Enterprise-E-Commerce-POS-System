<?php

namespace App\Http\Controllers\Api\V1\Store;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Product\Product;
use App\Models\Product\Category;
use App\Models\Product\Brand;
use App\Models\Marketing\Banner;
use App\Models\Marketing\FlashSale;
use App\Models\Review\ProductReview;
use App\Models\CMS\Blog;
use App\Models\Setting\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class StorefrontController extends BaseApiController
{
    // ─── GET /api/v1/store/homepage ─────────────────────────────────────────

    public function homepage(Request $request): JsonResponse
    {
        $data = Cache::remember('storefront_homepage', 300, function () {
            return [
                'banners'          => $this->getBanners(),
                'flash_sale'       => $this->getActiveFlashSale(),
                'featured_products' => $this->getFeaturedProducts(12),
                'best_sellers'     => $this->getBestSellers(12),
                'new_arrivals'     => $this->getNewArrivals(12),
                'top_categories'   => $this->getTopCategories(8),
                'top_brands'       => $this->getTopBrands(8),
                'today_deals'      => $this->getTodayDeals(8),
                'blog_preview'     => $this->getBlogPreview(3),
                'stats'            => $this->getStoreStats(),
            ];
        });

        return $this->successResponse($data);
    }

    // ─── GET /api/v1/store/featured ─────────────────────────────────────────

    public function featured(Request $request): JsonResponse
    {
        $type  = $request->input('type', 'featured'); // featured, best_sellers, new_arrivals, deals
        $limit = (int) $request->input('limit', 12);

        $products = match ($type) {
            'best_sellers'  => $this->getBestSellers($limit),
            'new_arrivals'  => $this->getNewArrivals($limit),
            'deals'         => $this->getTodayDeals($limit),
            default         => $this->getFeaturedProducts($limit),
        };

        return $this->successResponse($products);
    }

    // ─── GET /api/v1/store/search ────────────────────────────────────────────

    public function search(Request $request): JsonResponse
    {
        $query    = $request->input('q', '');
        $perPage  = $request->integer('per_page', 20);
        $sortBy   = $request->input('sort', 'relevance');
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');
        $category = $request->input('category');
        $brand    = $request->input('brand');
        $rating   = $request->input('rating');
        $inStock  = $request->boolean('in_stock');

        $productQuery = Product::active()
            ->with(['primaryImage', 'category', 'brand', 'inventories'])
            ->when($query, fn($q) => $q->search($query))
            ->when($minPrice, fn($q) => $q->where('selling_price', '>=', $minPrice))
            ->when($maxPrice, fn($q) => $q->where('selling_price', '<=', $maxPrice))
            ->when($category, fn($q) => $q->whereHas('category', fn($qc) => $qc->where('slug', $category)->orWhere('id', $category)))
            ->when($brand, fn($q) => $q->whereHas('brand', fn($qb) => $qb->where('slug', $brand)->orWhere('id', $brand)));

        // Sort
        match ($sortBy) {
            'price_asc'   => $productQuery->orderBy('selling_price', 'asc'),
            'price_desc'  => $productQuery->orderBy('selling_price', 'desc'),
            'newest'      => $productQuery->orderBy('created_at', 'desc'),
            'name_asc'    => $productQuery->orderBy('name', 'asc'),
            default       => $productQuery->orderByDesc('is_featured')->orderBy('name'),
        };

        $products = $productQuery->paginate($perPage);

        // Search suggestions if no results
        $suggestions = [];
        if ($query && $products->total() === 0) {
            $suggestions = Product::active()
                ->where('name', 'like', '%' . substr($query, 0, 3) . '%')
                ->limit(5)
                ->pluck('name');
        }

        // Save to search history if authenticated
        if ($query && $request->user()) {
            $this->saveSearchHistory($request->user()->id, $query);
        }

        return $this->successResponse([
            'results'     => $this->formatProductList($products->items()),
            'total'       => $products->total(),
            'per_page'    => $products->perPage(),
            'current_page' => $products->currentPage(),
            'last_page'   => $products->lastPage(),
            'suggestions' => $suggestions,
            'query'       => $query,
        ]);
    }

    // ─── GET /api/v1/store/search/autocomplete ───────────────────────────────

    public function autocomplete(Request $request): JsonResponse
    {
        $q       = $request->input('q', '');
        $results = [];

        if (strlen($q) >= 2) {
            $results = Product::active()
                ->where('name', 'like', "%{$q}%")
                ->orWhere('sku', 'like', "%{$q}%")
                ->select('id', 'name', 'slug', 'sku', 'selling_price')
                ->with('primaryImage')
                ->limit(8)
                ->get()
                ->map(fn($p) => [
                    'id'    => $p->id,
                    'name'  => $p->name,
                    'slug'  => $p->slug,
                    'price' => (float) $p->selling_price,
                    'image' => $p->primaryImage?->url,
                ]);
        }

        return $this->successResponse($results);
    }

    // ─── GET /api/v1/store/trending-searches ────────────────────────────────

    public function trendingSearches(): JsonResponse
    {
        $trending = Cache::remember('trending_searches', 3600, function () {
            return DB::table('search_histories')
                ->select('query', DB::raw('COUNT(*) as count'))
                ->where('created_at', '>=', now()->subDays(7))
                ->groupBy('query')
                ->orderByDesc('count')
                ->limit(10)
                ->pluck('query');
        });

        return $this->successResponse($trending);
    }

    // ─── GET /api/v1/store/categories (enhanced hierarchical) ──────────────

    public function categories(Request $request): JsonResponse
    {
        $withChildren = $request->boolean('with_children', false);

        $query = Category::active()->orderBy('sort_order')->orderBy('name');

        if ($withChildren) {
            $query->with(['children' => fn($q) => $q->active()->orderBy('sort_order')]);
            $query->whereNull('parent_id'); // Root categories only
        }

        $categories = $query->get()->map(fn($c) => $this->formatCategory($c, $withChildren));

        return $this->successResponse($categories);
    }

    // ─── GET /api/v1/store/brands ────────────────────────────────────────────

    public function brands(Request $request): JsonResponse
    {
        $brands = Brand::active()
            ->withCount(['products' => fn($q) => $q->active()])
            ->orderByDesc('products_count')
            ->get()
            ->map(fn($b) => [
                'id'             => $b->id,
                'name'           => $b->name,
                'slug'           => $b->slug,
                'logo'           => $b->logo,
                'product_count'  => $b->products_count,
            ]);

        return $this->successResponse($brands);
    }

    // ─── GET /api/v1/store/products (public listing) ────────────────────────

    public function products(Request $request): JsonResponse
    {
        $perPage  = $request->integer('per_page', 20);
        $sortBy   = $request->input('sort', 'featured');
        $category = $request->input('category');
        $brand    = $request->input('brand');
        $search   = $request->input('search');
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');
        $featured = $request->boolean('featured');
        $tag      = $request->input('tag');

        $query = Product::active()
            ->with(['primaryImage', 'category', 'brand'])
            ->when($search, fn($q) => $q->search($search))
            ->when($category, fn($q) => $q->whereHas('category', fn($qc) =>
                $qc->where('slug', $category)->orWhere('id', $category)
            ))
            ->when($brand, fn($q) => $q->whereHas('brand', fn($qb) =>
                $qb->where('slug', $brand)->orWhere('id', $brand)
            ))
            ->when($minPrice, fn($q) => $q->where('selling_price', '>=', $minPrice))
            ->when($maxPrice, fn($q) => $q->where('selling_price', '<=', $maxPrice))
            ->when($featured, fn($q) => $q->featured());

        match ($sortBy) {
            'price_asc'   => $query->orderBy('selling_price', 'asc'),
            'price_desc'  => $query->orderBy('selling_price', 'desc'),
            'newest'      => $query->orderBy('created_at', 'desc'),
            'name_asc'    => $query->orderBy('name', 'asc'),
            default       => $query->orderByDesc('is_featured')->orderBy('name'),
        };

        $products = $query->paginate($perPage);

        return $this->paginatedResponse(tap($products, fn($p) =>
            $p->setCollection($p->getCollection()->map(fn($product) => $this->formatProduct($product)))
        ));
    }

    // ─── GET /api/v1/store/products/{slug} (public detail) ──────────────────

    public function productDetail(Request $request, string $slug): JsonResponse
    {
        $product = Product::active()
            ->where('slug', $slug)
            ->with([
                'images',
                'primaryImage',
                'category.parent',
                'brand',
                'unit',
                'tax',
                'variants.attributeValues.attribute',
                'reviews' => fn($q) => $q->where('status', 'approved')->with('customer')->latest()->limit(10),
            ])
            ->firstOrFail();

        // Related products
        $related = Product::active()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with('primaryImage')
            ->limit(8)
            ->get()
            ->map(fn($p) => $this->formatProduct($p));

        // Rating summary
        $ratingSummary = [
            'average'      => round((float) $product->reviews->avg('rating'), 1),
            'total'        => $product->reviews->count(),
            'distribution' => $product->reviews->groupBy('rating')
                ->map->count()
                ->toArray(),
        ];

        return $this->successResponse([
            'id'               => $product->id,
            'name'             => $product->name,
            'slug'             => $product->slug,
            'sku'              => $product->sku,
            'barcode'          => $product->barcode,
            'description'      => $product->description,
            'short_description' => $product->short_description,
            'selling_price'    => (float) $product->selling_price,
            'compare_price'    => (float) $product->compare_price,
            'cost_price'       => null, // Don't expose to customers
            'discount_percent' => $product->discount_percent_attribute,
            'has_variants'     => $product->has_variants,
            'is_digital'       => $product->is_digital,
            'weight'           => (float) $product->weight,
            'status'           => $product->status,
            'meta_title'       => $product->meta_title ?? $product->name,
            'meta_description' => $product->meta_description ?? $product->short_description,
            'images'           => $product->images->map(fn($i) => [
                'id'       => $i->id,
                'url'      => $i->url,
                'alt'      => $i->alt ?? $product->name,
                'is_primary' => $i->is_primary,
            ]),
            'category'         => $product->category ? [
                'id'     => $product->category->id,
                'name'   => $product->category->name,
                'slug'   => $product->category->slug,
                'parent' => $product->category->parent ? [
                    'name' => $product->category->parent->name,
                    'slug' => $product->category->parent->slug,
                ] : null,
            ] : null,
            'brand'            => $product->brand ? [
                'id'   => $product->brand->id,
                'name' => $product->brand->name,
                'logo' => $product->brand->logo,
            ] : null,
            'variants'         => $product->variants->map(fn($v) => [
                'id'            => $v->id,
                'name'          => $v->name,
                'sku'           => $v->sku,
                'barcode'       => $v->barcode,
                'selling_price' => (float) $v->selling_price,
                'compare_price' => (float) $v->compare_price,
                'attribute_values' => $v->attributeValues->map(fn($av) => [
                    'attribute'   => $av->attribute?->name,
                    'value'       => $av->value,
                ]),
            ]),
            'reviews'          => $product->reviews->map(fn($r) => [
                'id'         => $r->id,
                'name'       => $r->name ?? $r->customer?->name,
                'rating'     => $r->rating,
                'title'      => $r->title,
                'body'       => $r->body,
                'is_verified' => $r->is_verified_purchase,
                'created_at' => $r->created_at?->toISOString(),
            ]),
            'rating_summary'   => $ratingSummary,
            'related_products' => $related,
        ]);
    }

    // ─── GET /api/v1/store/flash-sale ────────────────────────────────────────

    public function flashSale(): JsonResponse
    {
        $flashSale = $this->getActiveFlashSale();
        return $this->successResponse($flashSale);
    }

    // ─── GET /api/v1/store/banners ───────────────────────────────────────────

    public function banners(): JsonResponse
    {
        return $this->successResponse($this->getBanners());
    }

    // ─── POST /api/v1/store/coupons/validate ────────────────────────────────

    public function validateCoupon(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code'     => 'required|string',
            'subtotal' => 'nullable|numeric|min:0',
        ]);

        $coupon = \App\Models\Marketing\Coupon::active()
            ->where('code', strtoupper($validated['code']))
            ->first();

        if (!$coupon) {
            return $this->errorResponse('Invalid or expired coupon code', null, 422);
        }

        $subtotal = $validated['subtotal'] ?? 0;

        if ($coupon->min_purchase && $subtotal < $coupon->min_purchase) {
            return $this->errorResponse(
                "Minimum purchase of {$coupon->min_purchase} required",
                null,
                422
            );
        }

        $discount = match ($coupon->type) {
            'percentage' => min(
                $subtotal * ($coupon->value / 100),
                $coupon->max_discount ?? PHP_FLOAT_MAX
            ),
            'fixed'      => min($coupon->value, $subtotal),
            default      => 0,
        };

        return $this->successResponse([
            'valid'    => true,
            'coupon'   => [
                'code'        => $coupon->code,
                'name'        => $coupon->name,
                'type'        => $coupon->type,
                'value'       => (float) $coupon->value,
                'expires_at'  => $coupon->expires_at?->toISOString(),
            ],
            'discount' => round($discount, 2),
        ], 'Coupon is valid');
    }

    // ─── GET /api/v1/store/blog ──────────────────────────────────────────────

    public function blog(Request $request): JsonResponse
    {
        // Try to get blogs — gracefully handle if Blog model doesn't exist
        try {
            $blogs = \App\Models\CMS\Blog::where('status', 'published')
                ->with(['category', 'author'])
                ->when($request->input('category'), fn($q, $cat) =>
                    $q->whereHas('category', fn($qc) => $qc->where('slug', $cat)->orWhere('id', $cat))
                )
                ->when($request->input('search'), fn($q, $s) =>
                    $q->where('title', 'like', "%{$s}%")
                )
                ->orderBy('published_at', 'desc')
                ->paginate($request->integer('per_page', 9));

            return $this->paginatedResponse($blogs);
        } catch (\Exception $e) {
            return $this->successResponse([]);
        }
    }

    // ─── GET /api/v1/store/settings ─────────────────────────────────────────

    public function settings(): JsonResponse
    {
        $settings = Cache::remember('storefront_settings', 1800, function () {
            $keys = [
                'store_name', 'store_description', 'store_logo',
                'store_favicon', 'store_email', 'store_phone',
                'store_address', 'store_currency', 'store_languages',
                'social_facebook', 'social_instagram', 'social_twitter',
                'social_youtube', 'social_telegram', 'social_whatsapp',
            ];

            return DB::table('settings')
                ->whereIn('key', $keys)
                ->pluck('value', 'key');
        });

        return $this->successResponse($settings);
    }

    // ─── Private Data Helpers ─────────────────────────────────────────────────

    private function getBanners(): array
    {
        try {
            return \App\Models\Marketing\Banner::active()
                ->orderBy('sort_order')
                ->get()
                ->map(fn($b) => [
                    'id'          => $b->id,
                    'title'       => $b->title,
                    'subtitle'    => $b->subtitle,
                    'image'       => $b->image,
                    'link'        => $b->link,
                    'button_text' => $b->button_text,
                    'type'        => $b->type,
                    'position'    => $b->position,
                ])
                ->toArray();
        } catch (\Exception) {
            return [];
        }
    }

    private function getActiveFlashSale(): ?array
    {
        try {
            $sale = \App\Models\Marketing\FlashSale::where('is_active', true)
                ->where('starts_at', '<=', now())
                ->where('ends_at', '>=', now())
                ->with(['items.product.primaryImage'])
                ->first();

            if (!$sale) {
                return null;
            }

            return [
                'id'         => $sale->id,
                'name'       => $sale->name,
                'ends_at'    => $sale->ends_at?->toISOString(),
                'products'   => $sale->items->map(fn($item) => $this->formatProduct($item->product, [
                    'flash_price'    => (float) $item->sale_price,
                    'discount_pct'   => $item->discount_percent,
                ]))->filter()->values(),
            ];
        } catch (\Exception) {
            return null;
        }
    }

    private function getFeaturedProducts(int $limit): array
    {
        return Product::active()->featured()
            ->with(['primaryImage', 'category', 'brand'])
            ->orderBy('name')
            ->limit($limit)
            ->get()
            ->map(fn($p) => $this->formatProduct($p))
            ->toArray();
    }

    private function getBestSellers(int $limit): array
    {
        $topIds = DB::table('sale_items')
            ->select('product_id', DB::raw('SUM(quantity) as total_qty'))
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->limit($limit)
            ->pluck('product_id');

        if ($topIds->isEmpty()) {
            return $this->getFeaturedProducts($limit);
        }

        return Product::active()
            ->whereIn('id', $topIds)
            ->with(['primaryImage', 'category', 'brand'])
            ->get()
            ->map(fn($p) => $this->formatProduct($p))
            ->toArray();
    }

    private function getNewArrivals(int $limit): array
    {
        return Product::active()
            ->with(['primaryImage', 'category', 'brand'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(fn($p) => $this->formatProduct($p))
            ->toArray();
    }

    private function getTodayDeals(int $limit): array
    {
        return Product::active()
            ->whereNotNull('compare_price')
            ->whereColumn('selling_price', '<', 'compare_price')
            ->with(['primaryImage', 'category', 'brand'])
            ->orderByRaw('((compare_price - selling_price) / compare_price) DESC')
            ->limit($limit)
            ->get()
            ->map(fn($p) => $this->formatProduct($p))
            ->toArray();
    }

    private function getTopCategories(int $limit): array
    {
        return Category::active()
            ->withCount(['products' => fn($q) => $q->active()])
            ->orderByDesc('products_count')
            ->limit($limit)
            ->get()
            ->map(fn($c) => $this->formatCategory($c, false))
            ->toArray();
    }

    private function getTopBrands(int $limit): array
    {
        return Brand::active()
            ->withCount(['products' => fn($q) => $q->active()])
            ->orderByDesc('products_count')
            ->limit($limit)
            ->get()
            ->map(fn($b) => [
                'id'            => $b->id,
                'name'          => $b->name,
                'slug'          => $b->slug,
                'logo'          => $b->logo,
                'product_count' => $b->products_count,
            ])
            ->toArray();
    }

    private function getBlogPreview(int $limit): array
    {
        try {
            return \App\Models\CMS\Blog::where('status', 'published')
                ->with('category')
                ->orderBy('published_at', 'desc')
                ->limit($limit)
                ->get()
                ->map(fn($b) => [
                    'id'           => $b->id,
                    'title'        => $b->title,
                    'slug'         => $b->slug,
                    'excerpt'      => $b->excerpt,
                    'thumbnail'    => $b->thumbnail,
                    'category'     => $b->category?->name,
                    'published_at' => $b->published_at?->toISOString(),
                ])
                ->toArray();
        } catch (\Exception) {
            return [];
        }
    }

    private function getStoreStats(): array
    {
        return Cache::remember('storefront_stats', 3600, function () {
            return [
                'products'  => Product::active()->count(),
                'brands'    => Brand::active()->count(),
                'customers' => \App\Models\Customer\Customer::active()->count(),
                'orders'    => \App\Models\Order\Order::whereIn('status', ['completed', 'delivered'])->count(),
            ];
        });
    }

    private function formatProduct($product, array $extra = []): array
    {
        if (!$product) {
            return [];
        }

        return array_merge([
            'id'             => $product->id,
            'name'           => $product->name,
            'slug'           => $product->slug,
            'sku'            => $product->sku,
            'selling_price'  => (float) $product->selling_price,
            'compare_price'  => (float) $product->compare_price,
            'discount_pct'   => $product->discount_percent_attribute ?? 0,
            'is_featured'    => $product->is_featured,
            'has_variants'   => $product->has_variants,
            'image'          => $product->primaryImage?->url,
            'category'       => $product->category?->name,
            'brand'          => $product->brand?->name,
        ], $extra);
    }

    private function formatCategory($category, bool $withChildren): array
    {
        $data = [
            'id'            => $category->id,
            'name'          => $category->name,
            'slug'          => $category->slug,
            'icon'          => $category->icon,
            'image'         => $category->image,
            'description'   => $category->description,
            'product_count' => $category->products_count ?? 0,
        ];

        if ($withChildren && $category->relationLoaded('children')) {
            $data['children'] = $category->children->map(fn($c) => $this->formatCategory($c, false))->toArray();
        }

        return $data;
    }

    private function formatProductList(array $products): array
    {
        return array_map(fn($p) => $this->formatProduct($p), $products);
    }

    private function saveSearchHistory(int $userId, string $query): void
    {
        try {
            DB::table('search_histories')->updateOrInsert(
                ['user_id' => $userId, 'query' => $query],
                ['updated_at' => now(), 'created_at' => now()]
            );
        } catch (\Exception) {
            // Silently fail if table doesn't exist yet
        }
    }
}
