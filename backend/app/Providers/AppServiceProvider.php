<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Infrastructure\Repositories\Product\ProductRepository;
use App\Infrastructure\Services\Auth\AuthService;
use App\Infrastructure\Services\Product\ProductService;

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
            \App\Infrastructure\Repositories\Auth\ProfileRepository::class
        );
        $this->app->singleton(\App\Infrastructure\Services\Auth\ProfileService::class, \App\Infrastructure\Services\Auth\ProfileService::class);

        // ─── Product ──────────────────────────────────────────────────────────
        $this->app->singleton(
            \App\Domain\Contracts\Repositories\Product\ProductRepositoryInterface::class,
            \App\Infrastructure\Repositories\Product\ProductRepository::class
        );
        $this->app->singleton(
            \App\Domain\Contracts\Repositories\Product\CategoryRepositoryInterface::class,
            \App\Infrastructure\Repositories\Product\CategoryRepository::class
        );
        $this->app->singleton(ProductService::class, ProductService::class);

        // ─── Order ────────────────────────────────────────────────────────────
        $this->app->singleton(
            \App\Domain\Contracts\Repositories\Order\OrderRepositoryInterface::class,
            \App\Infrastructure\Repositories\Order\OrderRepository::class
        );
        $this->app->singleton(OrderService::class, OrderService::class);
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
