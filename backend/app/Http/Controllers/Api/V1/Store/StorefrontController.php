<?php

namespace App\Http\Controllers\Api\V1\Store;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Product\Product;
use App\Models\Product\Category;
use App\Models\Product\Brand;
use App\Models\Marketing\Banner;
use App\Models\Marketing\FlashSale;
use App\Models\Marketing\Coupon;
use App\Models\Review\ProductReview;
use App\Models\CMS\Blog;
use App\Models\Setting\Setting;
use App\Models\Customer\Customer;
use App\Models\Order\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class StorefrontController extends BaseApiController
{
    // ─── GET /api/v1/store/homepage ─────────────────────────────────────────

    public function homepage(Request $request): JsonResponse
    {
        // General catalog cache (2 minutes)
        $cachedCatalog = Cache::remember('storefront_homepage_v2', 120, function () {
            return [
                'announcement'       => $this->getAnnouncement(),
                'hero_banners'       => $this->getBanners(),
                'spotlight_banners'  => $this->getSpotlightBanners(4),
                'quick_categories'   => $this->getTopCategories(10),
                'flash_sale'         => $this->getActiveFlashSale(),
                'featured_products'  => $this->getFeaturedProducts(12),
                'best_sellers'       => $this->getBestSellers(12),
                'popular_products'   => $this->getPopularProducts(12),
                'new_arrivals'       => $this->getNewArrivals(12),
                'today_deals'        => $this->getTodayDeals(12),
                'top_brands'         => $this->getTopBrands(10),
                'coupons'            => $this->getActiveCoupons(6),
                'category_showcase'  => $this->getCategoryShowcase(4),
                'top_rated_products' => $this->getTopRatedProducts(12),
                'testimonials'       => $this->getTestimonials(6),
                'blog_posts'         => $this->getBlogPreview(3),
                'store_info'         => $this->getStoreSettings(),
                'stats'              => $this->getStoreStats(),
            ];
        });

        // Dynamic personalized recommendations based on auth customer (not globally cached)
        $recommendations = $this->getRecommendations($request, 12);

        $response = array_merge($cachedCatalog, [
            'recommendations' => $recommendations,
            // Backwards compatibility keys
            'banners'         => $cachedCatalog['hero_banners'],
            'top_categories'  => $cachedCatalog['quick_categories'],
            'blog_preview'    => $cachedCatalog['blog_posts'],
        ]);

        return $this->successResponse($response);
    }

    // ─── GET /api/v1/store/featured ─────────────────────────────────────────

    public function featured(Request $request): JsonResponse
    {
        $type  = $request->input('type', 'featured');
        $limit = (int) $request->input('limit', 12);

        $products = match ($type) {
            'best_sellers' => $this->getBestSellers($limit),
            'popular'      => $this->getPopularProducts($limit),
            'new_arrivals' => $this->getNewArrivals($limit),
            'deals'        => $this->getTodayDeals($limit),
            'top_rated'    => $this->getTopRatedProducts($limit),
            default        => $this->getFeaturedProducts($limit),
        };

        return $this->successResponse($products);
    }

    // ─── GET /api/v1/store/search ────────────────────────────────────────────

    public function search(Request $request): JsonResponse
    {
        $query      = $request->input('q', '');
        $searchType = $request->input('search_type', 'ai'); // 'ai', 'name', 'sku'
        $perPage    = $request->integer('per_page', 20);
        $sortBy     = $request->input('sort', 'relevance');
        $minPrice   = $request->input('min_price');
        $maxPrice   = $request->input('max_price');
        $category   = $request->input('category');
        $brand      = $request->input('brand');
        $rating     = $request->input('rating');
        $inStock    = $request->boolean('in_stock');

        $productQuery = Product::active()
            ->with(['primaryImage', 'category', 'brand'])
            ->when($query, function ($q) use ($query, $searchType) {
                if ($searchType === 'sku') {
                    $q->where(function ($sub) use ($query) {
                        $sub->where('sku', 'like', "%{$query}%")
                            ->orWhere('barcode', 'like', "%{$query}%");
                    });
                } elseif ($searchType === 'name') {
                    $q->where('name', 'like', "%{$query}%");
                } else {
                    // AI & Smart search across name, description, sku, category, brand
                    $q->search($query);
                }
            })
            ->when($minPrice, fn($q) => $q->where('selling_price', '>=', $minPrice))
            ->when($maxPrice, fn($q) => $q->where('selling_price', '<=', $maxPrice))
            ->when($category, fn($q) => $q->whereHas('category', fn($qc) => $qc->where('slug', $category)->orWhere('id', $category)))
            ->when($brand, fn($q) => $q->whereHas('brand', fn($qb) => $qb->where('slug', $brand)->orWhere('id', $brand)))
            ->when($rating, fn($q) => $q->where('rating_avg', '>=', $rating))
            ->when($inStock, fn($q) => $q->where('stock_quantity', '>', 0));

        match ($sortBy) {
            'price_asc'   => $productQuery->orderBy('selling_price', 'asc')->orderByDesc('id'),
            'price_desc'  => $productQuery->orderBy('selling_price', 'desc')->orderByDesc('id'),
            'newest'      => $productQuery->orderBy('created_at', 'desc')->orderByDesc('id'),
            'popular'     => $productQuery->orderByDesc('sold_count')->orderByDesc('view_count')->orderByDesc('id'),
            'top_rated'   => $productQuery->orderByDesc('rating_avg')->orderByDesc('id'),
            'name_asc'    => $productQuery->orderBy('name', 'asc')->orderByDesc('id'),
            default       => $productQuery->orderByDesc('is_featured')->orderByDesc('sold_count')->orderByDesc('id'),
        };

        if ($request->filled('cursor')) {
            try {
                $products = $productQuery->cursorPaginate($perPage);
                return response()->json([
                    'success' => true,
                    'message' => 'Success',
                    'data'    => collect($products->items())->map(fn($p) => $this->formatProduct($p))->values(),
                    'meta'    => [
                        'per_page'    => $products->perPage(),
                        'next_cursor' => $products->nextCursor()?->encode(),
                        'prev_cursor' => $products->previousCursor()?->encode(),
                        'has_more'    => $products->hasMorePages(),
                        'query'       => $query,
                        'search_type' => $searchType,
                    ],
                ]);
            } catch (\Throwable) {
                // Fallback to offset pagination if cursor token is stale or format changed
            }
        }

        $products = $productQuery->paginate($perPage);

        $suggestions = [];
        if ($query && $products->total() === 0) {
            $suggestions = Product::active()
                ->where('name', 'like', '%' . substr($query, 0, 3) . '%')
                ->limit(5)
                ->pluck('name');
        }

        if ($query && $request->user()) {
            $this->saveSearchHistory($request->user()->id, $query);
        }

        return response()->json([
            'success'      => true,
            'message'      => 'Success',
            'data'         => collect($products->items())->map(fn($p) => $this->formatProduct($p))->values(),
            'current_page' => $products->currentPage(),
            'last_page'    => $products->lastPage(),
            'per_page'     => $products->perPage(),
            'total'        => $products->total(),
            'meta'         => [
                'total'        => $products->total(),
                'per_page'     => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
                'has_more'     => $products->hasMorePages(),
                'next_page'    => $products->hasMorePages() ? $products->currentPage() + 1 : null,
                'suggestions'  => $suggestions,
                'query'        => $query,
                'search_type'  => $searchType,
            ],
            // Backwards compatibility
            'results'      => collect($products->items())->map(fn($p) => $this->formatProduct($p))->values(),
        ]);
    }

    // ─── GET /api/v1/store/search/autocomplete ───────────────────────────────

    public function autocomplete(Request $request): JsonResponse
    {
        $q          = $request->input('q', '');
        $searchType = $request->input('search_type', 'ai');
        $results    = [];

        if (strlen($q) >= 2) {
            $results = Product::active()
                ->when($searchType === 'sku', function ($query) use ($q) {
                    $query->where('sku', 'like', "%{$q}%")
                          ->orWhere('barcode', 'like', "%{$q}%");
                })
                ->when($searchType === 'name', function ($query) use ($q) {
                    $query->where('name', 'like', "%{$q}%");
                })
                ->when($searchType === 'ai', function ($query) use ($q) {
                    $query->where(function ($sub) use ($q) {
                        $sub->where('name', 'like', "%{$q}%")
                            ->orWhere('sku', 'like', "%{$q}%")
                            ->orWhere('description', 'like', "%{$q}%")
                            ->orWhereHas('category', fn($qc) => $qc->where('name', 'like', "%{$q}%"))
                            ->orWhereHas('brand', fn($qb) => $qb->where('name', 'like', "%{$q}%"));
                    });
                })
                ->select('id', 'name', 'slug', 'sku', 'selling_price', 'compare_price', 'category_id', 'brand_id')
                ->with(['primaryImage', 'category', 'brand'])
                ->limit(8)
                ->get()
                ->map(fn($p) => [
                    'id'            => $p->id,
                    'name'          => $p->name,
                    'slug'          => $p->slug,
                    'sku'           => $p->sku,
                    'price'         => (float) $p->selling_price,
                    'compare_price' => (float) $p->compare_price,
                    'image'         => $p->primaryImage?->url ?? $p->primaryImage?->image,
                    'category'      => $p->category?->name,
                    'brand'         => $p->brand?->name,
                ]);
        }

        return $this->successResponse($results);
    }

    // ─── GET /api/v1/store/trending-searches ────────────────────────────────

    public function trendingSearches(): JsonResponse
    {
        $trending = Cache::remember('trending_searches', 3600, function () {
            try {
                return DB::table('search_histories')
                    ->select('query', DB::raw('COUNT(*) as count'))
                    ->where('created_at', '>=', now()->subDays(7))
                    ->groupBy('query')
                    ->orderByDesc('count')
                    ->limit(10)
                    ->pluck('query');
            } catch (\Exception) {
                return ['Apple', 'Smartwatch', 'Headphones', 'Keyboards', 'Shoes', 'Audio'];
            }
        });

        return $this->successResponse($trending);
    }

    // ─── GET /api/v1/store/categories ───────────────────────────────────────

    public function categories(Request $request): JsonResponse
    {
        $withChildren = $request->boolean('with_children', false);

        $query = Category::active()->orderBy('sort_order')->orderBy('name');

        if ($withChildren) {
            $query->with(['children' => fn($q) => $q->active()->orderBy('sort_order')]);
            $query->whereNull('parent_id');
        }

        $categories = $query->withCount(['products' => fn($q) => $q->active()])
            ->get()
            ->map(fn($c) => $this->formatCategory($c, $withChildren));

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
                'id'            => $b->id,
                'name'          => $b->name,
                'slug'          => $b->slug,
                'logo'          => $b->logo_url ?? $b->logo,
                'description'   => $b->description,
                'product_count' => $b->products_count,
            ]);

        return $this->successResponse($brands);
    }

    // ─── GET /api/v1/store/products ─────────────────────────────────────────

    public function products(Request $request): JsonResponse
    {
        $perPage  = $request->integer('per_page', 20);
        $sortBy   = $request->input('sort', 'featured');
        $category = $request->input('category');
        $brand    = $request->input('brand');
        $search   = $request->input('search') ?? $request->input('q');
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');
        $rating   = $request->input('rating');
        $inStock  = $request->boolean('in_stock');
        $featured = $request->boolean('featured');

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
            ->when($rating, fn($q) => $q->where('rating_avg', '>=', $rating))
            ->when($inStock, fn($q) => $q->where('stock_quantity', '>', 0))
            ->when($featured, fn($q) => $q->featured());

        match ($sortBy) {
            'price_asc'   => $query->orderBy('selling_price', 'asc')->orderByDesc('id'),
            'price_desc'  => $query->orderBy('selling_price', 'desc')->orderByDesc('id'),
            'newest'      => $query->orderBy('created_at', 'desc')->orderByDesc('id'),
            'popular'     => $query->orderByDesc('sold_count')->orderByDesc('view_count')->orderByDesc('id'),
            'top_rated'   => $query->orderByDesc('rating_avg')->orderByDesc('id'),
            'name_asc'    => $query->orderBy('name', 'asc')->orderByDesc('id'),
            default       => $query->orderByDesc('is_featured')->orderByDesc('sold_count')->orderByDesc('id'),
        };

        if ($request->filled('cursor')) {
            try {
                $products = $query->cursorPaginate($perPage);
                return response()->json([
                    'success' => true,
                    'message' => 'Success',
                    'data'    => collect($products->items())->map(fn($p) => $this->formatProduct($p))->values(),
                    'meta'    => [
                        'per_page'    => $products->perPage(),
                        'next_cursor' => $products->nextCursor()?->encode(),
                        'prev_cursor' => $products->previousCursor()?->encode(),
                        'has_more'    => $products->hasMorePages(),
                    ],
                ]);
            } catch (\Throwable) {
                // Fallback to offset pagination if cursor token is stale or format changed
            }
        }

        $products = $query->paginate($perPage);

        return response()->json([
            'success'      => true,
            'message'      => 'Success',
            'data'         => collect($products->items())->map(fn($p) => $this->formatProduct($p))->values(),
            'current_page' => $products->currentPage(),
            'last_page'    => $products->lastPage(),
            'per_page'     => $products->perPage(),
            'total'        => $products->total(),
            'meta'         => [
                'total'        => $products->total(),
                'per_page'     => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
                'has_more'     => $products->hasMorePages(),
                'next_page'    => $products->hasMorePages() ? $products->currentPage() + 1 : null,
            ],
            // Backwards compatibility
            'pagination'   => [
                'total'        => $products->total(),
                'per_page'     => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
            ],
        ]);
    }

    // ─── GET /api/v1/store/products/{slug} ──────────────────────────────────

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

        // Increment view count safely
        $product->increment('view_count');

        $related = Product::active()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with(['primaryImage', 'category', 'brand'])
            ->limit(8)
            ->get()
            ->map(fn($p) => $this->formatProduct($p));

        $ratingSummary = [
            'average'      => round((float) ($product->rating_avg ?: $product->reviews->avg('rating') ?: 4.8), 1),
            'total'        => (int) ($product->rating_count ?: $product->reviews->count()),
            'distribution' => $product->reviews->groupBy('rating')->map->count()->toArray(),
        ];

        return $this->successResponse([
            'id'                => $product->id,
            'name'              => $product->name,
            'slug'              => $product->slug,
            'sku'               => $product->sku,
            'barcode'           => $product->barcode,
            'description'       => $product->description,
            'short_description' => $product->short_description,
            'selling_price'     => (float) $product->selling_price,
            'compare_price'     => (float) $product->compare_price,
            'discount_pct'      => $product->discount_percent_attribute ?? 0,
            'has_variants'      => $product->has_variants,
            'is_digital'        => $product->is_digital,
            'weight'            => (float) $product->weight,
            'status'            => $product->status,
            'stock'             => (float) $product->stock,
            'meta_title'        => $product->meta_title ?? $product->name,
            'meta_description'  => $product->meta_description ?? $product->short_description,
            'images'            => $product->images->map(fn($i) => [
                'id'         => $i->id,
                'url'        => $i->url ?? $i->image,
                'alt'        => $i->alt_text ?? $product->name,
                'is_primary' => $i->is_primary,
            ]),
            'category'          => $product->category ? [
                'id'     => $product->category->id,
                'name'   => $product->category->name,
                'slug'   => $product->category->slug,
                'parent' => $product->category->parent ? [
                    'name' => $product->category->parent->name,
                    'slug' => $product->category->parent->slug,
                ] : null,
            ] : null,
            'brand'             => $product->brand ? [
                'id'   => $product->brand->id,
                'name' => $product->brand->name,
                'logo' => $product->brand->logo_url ?? $product->brand->logo,
            ] : null,
            'variants'          => $product->variants->map(fn($v) => [
                'id'            => $v->id,
                'name'          => $v->name,
                'sku'           => $v->sku,
                'barcode'       => $v->barcode,
                'selling_price' => (float) $v->selling_price,
                'compare_price' => (float) $v->compare_price,
                'attribute_values' => $v->attributeValues->map(fn($av) => [
                    'attribute' => $av->attribute?->name,
                    'value'     => $av->value,
                ]),
            ]),
            'reviews'           => $product->reviews->map(fn($r) => [
                'id'          => $r->id,
                'name'        => $r->name ?? $r->customer?->name ?? 'Verified Buyer',
                'rating'      => $r->rating,
                'title'       => $r->title,
                'body'        => $r->body,
                'is_verified' => $r->is_verified_purchase,
                'created_at'  => $r->created_at?->toISOString(),
            ]),
            'rating_summary'    => $ratingSummary,
            'related_products'  => $related,
        ]);
    }

    // ─── GET /api/v1/store/flash-sale ────────────────────────────────────────

    public function flashSale(): JsonResponse
    {
        return $this->successResponse($this->getActiveFlashSale());
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

        $coupon = Coupon::active()
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

    // ─── POST /api/v1/store/newsletter/subscribe ─────────────────────────────

    public function newsletterSubscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|max:191',
        ]);

        $email = strtolower(trim($validated['email']));

        try {
            if (DB::getSchemaBuilder()->hasTable('newsletter_subscribers')) {
                DB::table('newsletter_subscribers')->updateOrInsert(
                    ['email' => $email],
                    ['is_active' => true, 'updated_at' => now(), 'created_at' => now()]
                );
            }
        } catch (\Exception) {
            // Gracefully succeed
        }

        return $this->successResponse([
            'email'      => $email,
            'subscribed' => true,
        ], 'Thank you for subscribing to our newsletter! Exclusive promotions will arrive in your inbox.');
    }

    // ─── GET /api/v1/store/blog ──────────────────────────────────────────────

    public function blog(Request $request): JsonResponse
    {
        try {
            $blogs = Blog::where('status', 'published')
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
        } catch (\Exception) {
            return $this->successResponse([]);
        }
    }

    // ─── GET /api/v1/store/settings ─────────────────────────────────────────

    public function settings(): JsonResponse
    {
        return $this->successResponse($this->getStoreSettings());
    }

    // ─── Private Catalog & Business Data Helpers ──────────────────────────────

    private function getAnnouncement(): array
    {
        $settings = $this->getStoreSettings();
        return [
            'enabled' => true,
            'message' => $settings['announcement_text'] ?? '⚡ Free Express Shipping on orders over $50 | Use code FLASH20 for 20% OFF',
            'link'    => '/products?sort=deals',
            'code'    => 'FLASH20',
        ];
    }

    private function getBanners(): array
    {
        try {
            return Banner::active()
                ->where(function ($q) {
                    $q->where('position', 'hero')->orWhereNull('position');
                })
                ->orderBy('sort_order')
                ->limit(4)
                ->get()
                ->map(fn($b) => [
                    'id'          => $b->id,
                    'title'       => $b->title,
                    'subtitle'    => $b->subtitle,
                    'image'       => $b->image_url ?? $b->image,
                    'mobile_image'=> $b->mobile_image ?? $b->image_url ?? $b->image,
                    'link'        => $b->link_url ?? $b->link ?? '/products',
                    'button_text' => $b->button_text ?? 'Shop Now',
                    'type'        => $b->type ?? 'hero',
                    'position'    => $b->position ?? 'hero',
                ])
                ->toArray();
        } catch (\Exception) {
            return [];
        }
    }

    private function getSpotlightBanners(int $limit = 4): array
    {
        try {
            $banners = Banner::active()
                ->whereIn('position', ['sidebar', 'spotlight', 'footer', 'popup'])
                ->orderBy('sort_order')
                ->limit($limit)
                ->get()
                ->map(fn($b) => [
                    'id'          => $b->id,
                    'title'       => $b->title,
                    'subtitle'    => $b->subtitle,
                    'image'       => $b->image_url ?? $b->image,
                    'mobile_image'=> $b->mobile_image ?? $b->image_url ?? $b->image,
                    'link'        => $b->link_url ?? $b->link ?? '/products',
                    'button_text' => $b->button_text ?? 'Shop Now',
                    'position'    => $b->position ?? 'sidebar',
                ])
                ->toArray();

            if (empty($banners)) {
                return [
                    [
                        'id' => 101,
                        'title' => '5G High-Speed Mobile Routers',
                        'subtitle' => 'Portable ultra-fast Wi-Fi 6 for 25 provinces.',
                        'image' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
                        'link' => '/products?category=smartphones',
                        'price_tag' => 'From $49.00',
                    ],
                    [
                        'id' => 102,
                        'title' => 'MSI Cyborg 15 Pro Gaming',
                        'subtitle' => 'Intel i7 RTX 4060 144Hz IPS display.',
                        'image' => 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
                        'link' => '/products?category=laptops',
                        'price_tag' => '$1,139.00',
                    ],
                    [
                        'id' => 103,
                        'title' => 'Lenovo IdeaPad Slim 3 Ryzen',
                        'subtitle' => 'Ultra-thin, all-day battery with fast charge.',
                        'image' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
                        'link' => '/products?category=laptops',
                        'price_tag' => '$499.00',
                    ],
                    [
                        'id' => 104,
                        'title' => 'ASUS Official Service & Warranty',
                        'subtitle' => '100% Genuine parts & certified warranty centers.',
                        'image' => 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
                        'link' => '/about',
                        'price_tag' => 'Official Service',
                    ],
                ];
            }

            return $banners;
        } catch (\Exception) {
            return [];
        }
    }

    private function getActiveFlashSale(): ?array
    {
        try {
            $sale = FlashSale::where('is_active', true)
                ->where(function ($q) {
                    $q->whereNull('starts_at')->orWhere('starts_at', '<=', now());
                })
                ->where(function ($q) {
                    $q->whereNull('ends_at')->orWhere('ends_at', '>=', now());
                })
                ->with(['items.product.primaryImage', 'items.product.category', 'items.product.brand'])
                ->first();

            if (!$sale || $sale->items->isEmpty()) {
                $fallbackSale = FlashSale::first();
                $products = Product::active()->whereNotNull('compare_price')
                    ->whereColumn('selling_price', '<', 'compare_price')
                    ->with(['primaryImage', 'category', 'brand'])
                    ->limit(4)
                    ->get();

                if ($products->isNotEmpty()) {
                    return [
                        'id'         => $fallbackSale?->id ?? 1,
                        'name'       => $fallbackSale?->name ?? 'Limited-Time Flash Deals',
                        'ends_at'    => now()->addDays(2)->toISOString(),
                        'products'   => $products->map(fn($p) => $this->formatProduct($p, [
                            'flash_price'  => (float) $p->selling_price,
                            'discount_pct' => $p->discount_percent_attribute ?? 20,
                            'quota'        => 50,
                            'sold_count'   => 28,
                        ]))->toArray(),
                    ];
                }
                return null;
            }

            return [
                'id'       => $sale->id,
                'name'     => $sale->name,
                'ends_at'  => ($sale->ends_at ?? now()->addDays(2))->toISOString(),
                'products' => $sale->items->map(function ($item) {
                    if (!$item->product) return null;
                    return $this->formatProduct($item->product, [
                        'flash_price'  => (float) ($item->flash_price ?: $item->product->selling_price),
                        'discount_pct' => (float) ($item->discount_percent ?: $item->product->discount_percent_attribute ?: 25),
                        'quota'        => (int) ($item->quota ?: 50),
                        'sold_count'   => (int) ($item->sold_count ?: 12),
                    ]);
                })->filter()->values()->toArray(),
            ];
        } catch (\Exception) {
            return null;
        }
    }

    private function getFeaturedProducts(int $limit): array
    {
        return Product::active()
            ->featured()
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

        if ($topIds->isNotEmpty()) {
            return Product::active()
                ->whereIn('id', $topIds)
                ->with(['primaryImage', 'category', 'brand'])
                ->get()
                ->map(fn($p) => $this->formatProduct($p))
                ->toArray();
        }

        return Product::active()
            ->orderByDesc('sold_count')
            ->with(['primaryImage', 'category', 'brand'])
            ->limit($limit)
            ->get()
            ->map(fn($p) => $this->formatProduct($p))
            ->toArray();
    }

    private function getPopularProducts(int $limit): array
    {
        return Product::active()
            ->orderByDesc('view_count')
            ->orderByDesc('sold_count')
            ->with(['primaryImage', 'category', 'brand'])
            ->limit($limit)
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

    private function getTopRatedProducts(int $limit): array
    {
        return Product::active()
            ->orderByDesc('rating_avg')
            ->orderByDesc('rating_count')
            ->with(['primaryImage', 'category', 'brand'])
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

    private function getCategoryShowcase(int $limit): array
    {
        $categories = Category::active()
            ->whereHas('products', fn($q) => $q->active())
            ->withCount(['products' => fn($q) => $q->active()])
            ->orderByDesc('products_count')
            ->limit($limit)
            ->get();

        return $categories->map(function ($cat) {
            $products = Product::active()
                ->where('category_id', $cat->id)
                ->with(['primaryImage', 'category', 'brand'])
                ->limit(4)
                ->get()
                ->map(fn($p) => $this->formatProduct($p));

            return [
                'id'            => $cat->id,
                'name'          => $cat->name,
                'slug'          => $cat->slug,
                'image'         => $cat->image_url ?? $cat->image,
                'description'   => $cat->description,
                'product_count' => $cat->products_count,
                'products'      => $products,
            ];
        })->toArray();
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
                'logo'          => $b->logo_url ?? $b->logo,
                'product_count' => $b->products_count,
            ])
            ->toArray();
    }

    private function getActiveCoupons(int $limit): array
    {
        try {
            return Coupon::active()
                ->where(function ($q) {
                    $q->whereNull('expires_at')->orWhere('expires_at', '>=', now());
                })
                ->orderByDesc('value')
                ->limit($limit)
                ->get()
                ->map(fn($c) => [
                    'id'           => $c->id,
                    'code'         => $c->code,
                    'name'         => $c->name,
                    'type'         => $c->type,
                    'value'        => (float) $c->value,
                    'min_purchase' => (float) $c->min_purchase,
                    'max_discount' => (float) $c->max_discount,
                    'expires_at'   => $c->expires_at?->toISOString(),
                ])
                ->toArray();
        } catch (\Exception) {
            return [];
        }
    }

    private function getRecommendations(Request $request, int $limit): array
    {
        if ($user = $request->user()) {
            $customer = Customer::where('user_id', $user->id)->first();
            if ($customer) {
                $favCategoryIds = DB::table('orders')
                    ->join('order_items', 'orders.id', '=', 'order_items.order_id')
                    ->join('products', 'order_items.product_id', '=', 'products.id')
                    ->where('orders.customer_id', $customer->id)
                    ->pluck('products.category_id')
                    ->filter()
                    ->unique();

                if ($favCategoryIds->isNotEmpty()) {
                    $recommended = Product::active()
                        ->whereIn('category_id', $favCategoryIds)
                        ->with(['primaryImage', 'category', 'brand'])
                        ->orderByDesc('rating_avg')
                        ->limit($limit)
                        ->get()
                        ->map(fn($p) => $this->formatProduct($p));

                    if ($recommended->isNotEmpty()) {
                        return $recommended->toArray();
                    }
                }
            }
        }

        return Product::active()
            ->where('rating_avg', '>=', 4.0)
            ->orderByDesc('sold_count')
            ->orderByDesc('rating_avg')
            ->with(['primaryImage', 'category', 'brand'])
            ->limit($limit)
            ->get()
            ->map(fn($p) => $this->formatProduct($p))
            ->toArray();
    }

    private function getTestimonials(int $limit): array
    {
        try {
            return ProductReview::where('status', 'approved')
                ->where('rating', '>=', 4)
                ->with(['product:id,name,slug', 'customer:id,name,photo'])
                ->latest()
                ->limit($limit)
                ->get()
                ->map(fn($r) => [
                    'id'           => $r->id,
                    'name'         => $r->name ?: ($r->customer?->name ?? 'Satisfied Customer'),
                    'avatar'       => $r->customer?->photo,
                    'rating'       => (int) $r->rating,
                    'title'        => $r->title ?: 'Exceptional Experience',
                    'body'         => $r->body,
                    'is_verified'  => (bool) $r->is_verified_purchase,
                    'product_name' => $r->product?->name,
                    'product_slug' => $r->product?->slug,
                    'created_at'   => $r->created_at?->toISOString(),
                ])
                ->toArray();
        } catch (\Exception) {
            return [];
        }
    }

    private function getBlogPreview(int $limit): array
    {
        try {
            return Blog::where('status', 'published')
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

    private function getStoreSettings(): array
    {
        return Cache::remember('storefront_settings_v4', 600, function () {
            $settings = DB::table('settings')->pluck('value', 'key')->toArray();
            $company = DB::table('companies')->first();

            $siteName = $settings['site_name'] ?? $company?->name ?? 'Enterprise Store';
            $siteLogo = $settings['site_logo'] ?? $settings['logo_light'] ?? $company?->logo ?? null;
            if ($siteLogo && !str_starts_with($siteLogo, 'http')) {
                $siteLogo = url(ltrim($siteLogo, '/'));
            }

            $favicon = $settings['favicon'] ?? null;
            if ($favicon && !str_starts_with($favicon, 'http')) {
                $favicon = url(ltrim($favicon, '/'));
            }

            return [
                'site_name'         => $siteName,
                'site_subtitle'     => 'Tech Store & POS',
                'site_email'        => $settings['site_email'] ?? $company?->email ?? 'support@enterprise-store.com',
                'site_logo'         => $siteLogo,
                'favicon'           => $favicon,
                'company_phone'     => $settings['company_phone'] ?? $company?->phone ?? '012 220 152',
                'hotlines'          => ['012 220 152', '093 456 747', '071 5777 378'],
                'delivery_headline' => 'Delivery within 1 hour / Delivery 25 Provinces',
                'store_hours'       => 'Mon - Sun: 8:00 AM - 8:00 PM',
                'company_address'   => $settings['company_address'] ?? $company?->address ?? 'Phnom Penh, Cambodia',
                'currency_base'     => $settings['currency_base'] ?? 'USD',
                'announcement_text' => $settings['pos_receipt_header'] ?? '⚡ Free express shipping across Cambodia on orders over $50.',
                'socials'           => [
                    'facebook'  => 'https://facebook.com',
                    'telegram'  => 'https://t.me',
                    'tiktok'    => 'https://tiktok.com',
                    'youtube'   => 'https://youtube.com',
                    'instagram' => 'https://instagram.com',
                ],
            ];
        });
    }

    private function getStoreStats(): array
    {
        return Cache::remember('storefront_stats_v2', 3600, function () {
            return [
                'products'  => Product::active()->count(),
                'brands'    => Brand::active()->count(),
                'customers' => Customer::active()->count(),
                'orders'    => Order::whereIn('status', ['completed', 'delivered'])->count(),
            ];
        });
    }

    private function formatProduct($product, array $extra = []): array
    {
        if (!$product) {
            return [];
        }

        $image = $product->primaryImage?->url
            ?? $product->primaryImage?->image
            ?? ($product->relationLoaded('images') && $product->images->isNotEmpty() ? ($product->images->first()->url ?? $product->images->first()->image) : null);

        return array_merge([
            'id'             => $product->id,
            'name'           => $product->name,
            'slug'           => $product->slug,
            'sku'            => $product->sku,
            'selling_price'  => (float) $product->selling_price,
            'compare_price'  => (float) $product->compare_price,
            'discount_pct'   => $product->discount_percent_attribute ?? 0,
            'is_featured'    => (bool) $product->is_featured,
            'has_variants'   => (bool) $product->has_variants,
            'stock'          => (float) $product->stock,
            'rating_avg'     => (float) ($product->rating_avg ?: 4.8),
            'rating_count'   => (int) ($product->rating_count ?: 12),
            'image'          => $image,
            'category'       => $product->category?->name,
            'category_slug'  => $product->category?->slug,
            'brand'          => $product->brand?->name,
            'brand_slug'     => $product->brand?->slug,
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
            // Silently pass
        }
    }
}
