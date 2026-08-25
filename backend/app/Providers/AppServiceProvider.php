<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Product\ProductRepository;
use App\Repositories\Product\CategoryRepository;
use App\Repositories\Auth\ProfileRepository;
use App\Repositories\Order\OrderRepository;
use App\Services\Auth\AuthService;
use App\Services\Auth\ProfileService;
use App\Services\Product\ProductService;
use App\Services\Inventory\InventoryService;
use App\Services\Sales\PricingService;
use App\Services\Sales\SaleService;
use App\Services\Order\OrderService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Repository + Service bindings
     */
    public array $bindings = [];

    public function register(): void
    {
        // ─── Auth ─────────────────────────────────────────────────────────────
        $this->app->singleton(AuthService::class, AuthService::class);
        $this->app->singleton(
            \App\Domain\Contracts\Repositories\Auth\ProfileRepositoryInterface::class,
            ProfileRepository::class
        );
        $this->app->singleton(ProfileService::class, ProfileService::class);

        // ─── Product ──────────────────────────────────────────────────────────
        $this->app->singleton(
            \App\Domain\Contracts\Repositories\Product\ProductRepositoryInterface::class,
            ProductRepository::class
        );
        $this->app->singleton(
            \App\Domain\Contracts\Repositories\Product\CategoryRepositoryInterface::class,
            CategoryRepository::class
        );
        $this->app->singleton(ProductService::class, ProductService::class);

        // ─── Order ────────────────────────────────────────────────────────────
        $this->app->singleton(
            \App\Domain\Contracts\Repositories\Order\OrderRepositoryInterface::class,
            OrderRepository::class
        );
        $this->app->singleton(OrderService::class, OrderService::class);

        // ─── Unified Domain / Application Services ────────────────────────────
        $this->app->singleton(InventoryService::class, InventoryService::class);
        $this->app->singleton(PricingService::class, PricingService::class);
        $this->app->singleton(SaleService::class, SaleService::class);

        // ─── Legacy / Compatibility Bridges ──────────────────────────────────
        $this->app->singleton(\App\Domain\Inventory\Services\InventoryService::class, function ($app) {
            return $app->make(InventoryService::class);
        });
        $this->app->singleton(\App\Domain\Sales\Services\PricingService::class, function ($app) {
            return $app->make(PricingService::class);
        });
        $this->app->singleton(\App\Infrastructure\Services\Auth\AuthService::class, function ($app) {
            return $app->make(AuthService::class);
        });
        $this->app->singleton(\App\Infrastructure\Services\Product\ProductService::class, function ($app) {
            return $app->make(ProductService::class);
        });

        // ─── Application Actions (Use Cases) ──────────────────────────────────
        $this->app->singleton(\App\Application\Purchase\ReceivePurchaseAction::class);
        $this->app->singleton(\App\Application\Sales\CreateSaleAction::class);
        $this->app->singleton(\App\Application\Order\CheckoutAction::class);
    }

    public function boot(): void
    {
        // Enforce HTTPS in production and when behind cloud reverse proxies (Render / Cloudflare)
        if ($this->app->environment('production') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') || request()->header('X-Forwarded-Proto') === 'https') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        // Global Spatie Activity log interceptor to store IP and User Agent in properties
        \Spatie\Activitylog\Models\Activity::creating(function ($activity) {
            $properties = $activity->properties ? $activity->properties->toArray() : [];
            $properties['ip'] = request()->ip();
            $properties['user_agent'] = request()->userAgent();
            $activity->properties = collect($properties);
        });

        // Enforce JSON responses for API
        \Illuminate\Support\Facades\Response::macro('api', function ($data, string $message = 'Success', int $code = 200) {
            return response()->json([
                'success' => $code < 400,
                'message' => $message,
                'data'    => $data,
            ], $code);
        });

        // Telescope only in non-production
        if ($this->app->environment('local', 'staging')) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
        }
    }
}
