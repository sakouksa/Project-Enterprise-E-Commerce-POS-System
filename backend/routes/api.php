<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Product\ProductController;
use App\Http\Controllers\Api\V1\Product\CategoryController;
use App\Http\Controllers\Api\V1\Product\BrandController;
use App\Http\Controllers\Api\V1\Product\AttributeController;
use App\Http\Controllers\Api\V1\Inventory\InventoryController;
use App\Http\Controllers\Api\V1\Inventory\StockTransferController;
use App\Http\Controllers\Api\V1\Inventory\StockAdjustmentController;
use App\Http\Controllers\Api\V1\Inventory\StockOpnameController;
use App\Http\Controllers\Api\V1\Purchase\SupplierController;
use App\Http\Controllers\Api\V1\Purchase\PurchaseController;
use App\Http\Controllers\Api\V1\Customer\CustomerController;
use App\Http\Controllers\Api\V1\Customer\CustomerGroupController;
use App\Http\Controllers\Api\V1\Sales\SaleController;
use App\Http\Controllers\Api\V1\Order\OrderController;
use App\Http\Controllers\Api\V1\Payment\PaymentController;
use App\Http\Controllers\Api\V1\Payment\PaymentMethodController;
use App\Http\Controllers\Api\V1\POS\POSController;
use App\Http\Controllers\Api\V1\POS\CashRegisterController;
use App\Http\Controllers\Api\V1\Company\CompanyController;
use App\Http\Controllers\Api\V1\Company\BranchController;
use App\Http\Controllers\Api\V1\Company\StoreController;
use App\Http\Controllers\Api\V1\Company\WarehouseController;
use App\Http\Controllers\Api\V1\Setting\SettingController;
use App\Http\Controllers\Api\V1\Setting\CurrencyController;
use App\Http\Controllers\Api\V1\Setting\LanguageController;
use App\Http\Controllers\Api\V1\Setting\BannerController;
use App\Http\Controllers\Api\V1\Marketing\CouponController;
use App\Http\Controllers\Api\V1\Marketing\FlashSaleController;
use App\Http\Controllers\Api\V1\Order\ReviewController;
use App\Http\Controllers\Api\V1\Log\ActivityLogController;
use App\Http\Controllers\Api\V1\Report\ReportController;
use App\Http\Controllers\Api\V1\Report\DashboardController;
use App\Http\Controllers\Api\V1\Auth\ProfileController;

// ─── API Version 1 ────────────────────────────────────────────────────────────
Route::prefix('v1')->group(function () {

    // ─── Authentication ──────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('login',    [AuthController::class, 'login']);
        Route::post('register', [AuthController::class, 'register']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout',          [AuthController::class, 'logout']);
            Route::get('profile',          [AuthController::class, 'profile']);
            Route::put('profile',          [AuthController::class, 'updateProfile']);
            Route::post('change-password', [AuthController::class, 'changePassword']);
        });
    });

    Route::middleware('auth:sanctum')->group(function () {

        // ─── Profile ───────────────────────────────────────────────────────
        Route::prefix('profile')->group(function () {
            Route::get('/',                 [ProfileController::class, 'show']);
            Route::put('/',                 [ProfileController::class, 'update']);
            Route::post('avatar',           [ProfileController::class, 'uploadAvatar']);
            Route::delete('avatar',         [ProfileController::class, 'removeAvatar']);
            Route::post('change-password',  [ProfileController::class, 'changePassword']);
            Route::get('permissions',       [ProfileController::class, 'permissions']);
            Route::get('activity-logs',     [ProfileController::class, 'activityLogs']);
            Route::get('login-history',     [ProfileController::class, 'loginHistory']);
            Route::post('logout-devices',   [ProfileController::class, 'logoutDevices']);
        });

        // ─── Dashboard ────────────────────────────────────────────────────
        Route::prefix('dashboard')->group(function () {
            Route::get('stats',        [DashboardController::class, 'stats']);
            Route::get('sales-chart',  [DashboardController::class, 'salesChart']);
            Route::get('top-products', [DashboardController::class, 'topProducts']);
            Route::get('recent-orders',[DashboardController::class, 'recentOrders']);
            Route::get('low-stock',    [DashboardController::class, 'lowStock']);
        });

        // ─── Company ───────────────────────────────────────────────────────
        Route::apiResource('companies',  CompanyController::class);
        Route::apiResource('branches',   BranchController::class);
        Route::post('branches/{id}/restore', [BranchController::class, 'restore']);
        Route::delete('branches/{id}/force', [BranchController::class, 'forceDelete']);
        Route::apiResource('stores',     StoreController::class);
        Route::post('stores/{id}/restore', [StoreController::class, 'restore']);
        Route::delete('stores/{id}/force', [StoreController::class, 'forceDelete']);
        Route::apiResource('warehouses', WarehouseController::class);
        Route::post('warehouses/{id}/restore', [WarehouseController::class, 'restore']);
        Route::delete('warehouses/{id}/force', [WarehouseController::class, 'forceDelete']);

        // ─── Products ──────────────────────────────────────────────────────
        Route::apiResource('products',   ProductController::class);
        Route::post('products/{id}/restore',       [ProductController::class, 'restore']);
        Route::delete('products/{id}/force',       [ProductController::class, 'forceDelete']);
        Route::post('products/{product}/images',   [ProductController::class, 'uploadImages']);
        Route::delete('products/{product}/images/{image}', [ProductController::class, 'deleteImage']);
        Route::get('products/{product}/variants',  [ProductController::class, 'variants']);
        Route::apiResource('categories', CategoryController::class);
        Route::post('categories/{id}/restore', [CategoryController::class, 'restore']);
        Route::delete('categories/{id}/force', [CategoryController::class, 'forceDelete']);
        Route::apiResource('brands',     BrandController::class);
        Route::post('brands/{id}/restore', [BrandController::class, 'restore']);
        Route::delete('brands/{id}/force', [BrandController::class, 'forceDelete']);
        Route::apiResource('attributes', AttributeController::class);

        // ─── Inventory ─────────────────────────────────────────────────────
        Route::get('inventory',                [InventoryController::class, 'index']);
        Route::get('inventory/{id}',           [InventoryController::class, 'show']);
        Route::get('inventory/low-stock',      [InventoryController::class, 'lowStock']);
        Route::get('inventory/product/{pid}',  [InventoryController::class, 'byProduct']);
        Route::apiResource('stock-adjustments', StockAdjustmentController::class);
        Route::post('stock-adjustments/{id}/approve', [StockAdjustmentController::class, 'approve']);
        Route::apiResource('stock-transfers',  StockTransferController::class);
        Route::post('stock-transfers/{id}/ship',    [StockTransferController::class, 'ship']);
        Route::post('stock-transfers/{id}/receive', [StockTransferController::class, 'receive']);
        Route::apiResource('stock-opnames',    StockOpnameController::class);
        Route::post('stock-opnames/{id}/complete', [StockOpnameController::class, 'complete']);

        // ─── Suppliers & Purchases ─────────────────────────────────────────
        Route::apiResource('suppliers',        SupplierController::class);
        Route::post('suppliers/{id}/restore',  [SupplierController::class, 'restore']);
        Route::delete('suppliers/{id}/force',  [SupplierController::class, 'forceDelete']);
        Route::apiResource('purchases',        PurchaseController::class);
        Route::post('purchases/{id}/receive',  [PurchaseController::class, 'receive']);
        Route::post('purchases/{id}/cancel',   [PurchaseController::class, 'cancel']);
        Route::prefix('purchases/{purchase}')->group(function () {
            Route::apiResource('returns', \App\Http\Controllers\Api\V1\Purchase\PurchaseReturnController::class);
        });

        // ─── Customers ─────────────────────────────────────────────────────
        Route::apiResource('customers',        CustomerController::class);
        Route::post('customers/{id}/restore',  [CustomerController::class, 'restore']);
        Route::delete('customers/{id}/force',  [CustomerController::class, 'forceDelete']);
        Route::get('customers/{id}/orders',    [CustomerController::class, 'orders']);
        Route::apiResource('customer-groups',  CustomerGroupController::class);
        Route::post('customer-groups/{id}/restore', [CustomerGroupController::class, 'restore']);
        Route::delete('customer-groups/{id}/force', [CustomerGroupController::class, 'forceDelete']);

        // ─── POS ───────────────────────────────────────────────────────────
        Route::prefix('pos')->group(function () {
            Route::post('sales',                   [POSController::class, 'sale']);
            Route::get('sales',                    [POSController::class, 'index']);
            Route::get('sales/{id}',               [POSController::class, 'show']);
            Route::post('sales/{id}/return',       [POSController::class, 'processReturn']);
            Route::get('product-search',           [POSController::class, 'productSearch']);
            Route::post('apply-coupon',            [POSController::class, 'applyCoupon']);
            Route::apiResource('cash-registers',   CashRegisterController::class);
            Route::post('cash-registers/{id}/open',  [CashRegisterController::class, 'open']);
            Route::post('cash-registers/{id}/close', [CashRegisterController::class, 'close']);
        });

        // ─── Sales ─────────────────────────────────────────────────────────
        Route::apiResource('sales', SaleController::class);

        // ─── Orders (E-Commerce) ───────────────────────────────────────────
        Route::apiResource('orders', OrderController::class);
        Route::post('orders/{id}/confirm',  [OrderController::class, 'confirm']);
        Route::post('orders/{id}/ship',     [OrderController::class, 'ship']);
        Route::post('orders/{id}/deliver',  [OrderController::class, 'deliver']);
        Route::post('orders/{id}/complete', [OrderController::class, 'complete']);
        Route::post('orders/{id}/cancel',   [OrderController::class, 'cancel']);
        Route::post('orders/{id}/refund',   [OrderController::class, 'refund']);
        Route::get('orders/{id}/tracking',  [OrderController::class, 'tracking']);
        Route::get('orders/{id}/invoice',   [OrderController::class, 'invoice']);   // PDF

        // ─── Payments ──────────────────────────────────────────────────────
        Route::apiResource('payment-methods', PaymentMethodController::class);
        Route::get('payments',                [PaymentController::class, 'index']);
        Route::get('payments/{id}',           [PaymentController::class, 'show']);
        Route::post('payments/process',       [PaymentController::class, 'process']);

        // ─── Reports ───────────────────────────────────────────────────────
        Route::prefix('reports')->group(function () {
            Route::get('sales',        [ReportController::class, 'sales']);
            Route::get('purchases',    [ReportController::class, 'purchases']);
            Route::get('inventory',    [ReportController::class, 'inventory']);
            Route::get('products',     [ReportController::class, 'products']);
            Route::get('customers',    [ReportController::class, 'customers']);
            Route::get('expenses',     [ReportController::class, 'expenses']);
            Route::get('profit-loss',  [ReportController::class, 'profitLoss']);
            Route::get('export-sales', [ReportController::class, 'exportSales']);   // Excel
            Route::get('export-inventory', [ReportController::class, 'exportInventory']); // Excel
        });

        // ─── Settings ──────────────────────────────────────────────────────
        Route::get('settings',     [SettingController::class, 'index']);
        Route::post('settings',    [SettingController::class, 'bulkUpdate']);
        Route::get('settings/{key}',    [SettingController::class, 'show']);
        Route::put('settings/{key}',    [SettingController::class, 'update']);
        Route::apiResource('currencies', CurrencyController::class);
        Route::apiResource('languages',  LanguageController::class);

        // ─── Roles & Permissions ───────────────────────────────────────────
        Route::get('roles',                     [\Spatie\Permission\Models\Role::class, 'all']);
        Route::apiResource('roles',             \App\Http\Controllers\Api\V1\Auth\RoleController::class);
        Route::apiResource('permissions',       \App\Http\Controllers\Api\V1\Auth\PermissionController::class);
        Route::post('users/{id}/assign-role',   [\App\Http\Controllers\Api\V1\Auth\UserRoleController::class, 'assign']);
        Route::post('users/{id}/remove-role',   [\App\Http\Controllers\Api\V1\Auth\UserRoleController::class, 'remove']);

        // ─── Users ─────────────────────────────────────────────────────────
        Route::apiResource('users', \App\Http\Controllers\Api\V1\Auth\UserController::class);

        // ─── Marketing: Banners ────────────────────────────────────────────
        Route::apiResource('banners', BannerController::class);

        // ─── Marketing: Coupons ────────────────────────────────────────────
        Route::apiResource('coupons', CouponController::class);
        Route::get('coupons/generate-code', [CouponController::class, 'generateCode']);

        // ─── Marketing: Flash Sales ───────────────────────────────────────
        Route::apiResource('flash-sales', FlashSaleController::class);

        // ─── Reviews (Admin Moderation) ───────────────────────────────────
        Route::get('reviews',              [ReviewController::class, 'index']);
        Route::post('reviews/{id}/approve',[ReviewController::class, 'approve']);
        Route::post('reviews/{id}/reject', [ReviewController::class, 'reject']);
        Route::delete('reviews/{id}',      [ReviewController::class, 'destroy']);

        // ─── Activity Logs ────────────────────────────────────────────────
        Route::get('activity-logs',        [ActivityLogController::class, 'index']);
        Route::get('activity-logs/{id}',   [ActivityLogController::class, 'show']);
        Route::delete('activity-logs/{id}',[ActivityLogController::class, 'destroy']);

        // ─── Automated Sync Routes ─────────────────────────────────────────
        Route::apiResource('departments', \App\Http\Controllers\Api\V1\Employee\DepartmentController::class);
        Route::apiResource('positions', \App\Http\Controllers\Api\V1\Employee\PositionController::class);
        Route::apiResource('employees', \App\Http\Controllers\Api\V1\Employee\EmployeeController::class);
        Route::apiResource('attendances', \App\Http\Controllers\Api\V1\Employee\AttendanceController::class);
        Route::apiResource('payrolls', \App\Http\Controllers\Api\V1\Employee\PayrollController::class);
        Route::apiResource('blog-categories', \App\Http\Controllers\Api\V1\CMS\BlogCategoryController::class);
        Route::apiResource('blog-tags', \App\Http\Controllers\Api\V1\CMS\BlogTagController::class);
        Route::apiResource('blogs', \App\Http\Controllers\Api\V1\CMS\BlogController::class);
        Route::post('blogs/{id}/restore', [\App\Http\Controllers\Api\V1\CMS\BlogController::class, 'restore']);
        Route::delete('blogs/{id}/force', [\App\Http\Controllers\Api\V1\CMS\BlogController::class, 'forceDelete']);
        Route::apiResource('pages', \App\Http\Controllers\Api\V1\CMS\PageController::class);
        Route::apiResource('faqs', \App\Http\Controllers\Api\V1\CMS\FaqController::class);
        Route::apiResource('expense-categories', \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::class);
        Route::apiResource('expenses', \App\Http\Controllers\Api\V1\Expense\ExpenseController::class);
        Route::post('expenses/{id}/restore', [\App\Http\Controllers\Api\V1\Expense\ExpenseController::class, 'restore']);
        Route::delete('expenses/{id}/force', [\App\Http\Controllers\Api\V1\Expense\ExpenseController::class, 'forceDelete']);
        Route::apiResource('shipping-methods', \App\Http\Controllers\Api\V1\Shipping\ShippingMethodController::class);
        Route::apiResource('shipping-zones', \App\Http\Controllers\Api\V1\Shipping\ShippingZoneController::class);
        Route::apiResource('shipping-rates', \App\Http\Controllers\Api\V1\Shipping\ShippingRateController::class);
        Route::apiResource('shipments', \App\Http\Controllers\Api\V1\Order\ShipmentController::class);
        Route::apiResource('countries', \App\Http\Controllers\Api\V1\Setting\CountryController::class);
        Route::apiResource('provinces', \App\Http\Controllers\Api\V1\Setting\ProvinceController::class);
        Route::apiResource('cities', \App\Http\Controllers\Api\V1\Setting\CityController::class);
        Route::apiResource('taxes', \App\Http\Controllers\Api\V1\Product\TaxController::class);
        Route::apiResource('units', \App\Http\Controllers\Api\V1\Product\UnitController::class);
        Route::apiResource('promotions', \App\Http\Controllers\Api\V1\Marketing\PromotionController::class);
        Route::apiResource('transactions', \App\Http\Controllers\Api\V1\Payment\TransactionController::class);

        // ─── Sub-Tables Automated Sync Routes ──────────────────────────────
        Route::apiResource('attribute-values', \App\Http\Controllers\Api\V1\Product\AttributeValueController::class);
        Route::apiResource('audit-logs', \App\Http\Controllers\Api\V1\Log\AuditLogController::class);
        Route::apiResource('cart-items', \App\Http\Controllers\Api\V1\Order\CartItemController::class);
        Route::apiResource('carts', \App\Http\Controllers\Api\V1\Order\CartController::class);
        Route::apiResource('cash-register-transactions', \App\Http\Controllers\Api\V1\POS\CashRegisterTransactionController::class);
        Route::apiResource('cash-registers', \App\Http\Controllers\Api\V1\POS\CashRegisterController::class);
        Route::apiResource('customer-addresses', \App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class);
        Route::apiResource('inventories', \App\Http\Controllers\Api\V1\Inventory\InventoryController::class);
        Route::apiResource('inventory-movements', \App\Http\Controllers\Api\V1\Inventory\InventoryMovementController::class);
        Route::apiResource('languages', \App\Http\Controllers\Api\V1\Setting\LanguageController::class);
        Route::apiResource('login-histories', \App\Http\Controllers\Api\V1\Log\LoginHistoryController::class);
        Route::apiResource('notification-logs', \App\Http\Controllers\Api\V1\Notification\NotificationLogController::class);
        Route::apiResource('order-items', \App\Http\Controllers\Api\V1\Order\OrderItemController::class);
        Route::apiResource('order-status-histories', \App\Http\Controllers\Api\V1\Order\OrderStatusHistoryController::class);
        Route::apiResource('product-images', \App\Http\Controllers\Api\V1\Product\ProductImageController::class);
        Route::apiResource('product-prices', \App\Http\Controllers\Api\V1\Product\ProductPriceController::class);
        Route::apiResource('product-reviews', \App\Http\Controllers\Api\V1\Review\ProductReviewController::class);
        Route::apiResource('product-variant-values', \App\Http\Controllers\Api\V1\Product\ProductVariantValueController::class);
        Route::apiResource('product-variants', \App\Http\Controllers\Api\V1\Product\ProductVariantController::class);
        Route::apiResource('purchase-items', \App\Http\Controllers\Api\V1\Purchase\PurchaseItemController::class);
        Route::apiResource('purchase-return-items', \App\Http\Controllers\Api\V1\Purchase\PurchaseReturnItemController::class);
        Route::apiResource('purchase-returns', \App\Http\Controllers\Api\V1\Purchase\PurchaseReturnController::class);
        Route::apiResource('sale-items', \App\Http\Controllers\Api\V1\Sales\SaleItemController::class);
        Route::apiResource('sale-return-items', \App\Http\Controllers\Api\V1\Sales\SaleReturnItemController::class);
        Route::apiResource('sale-returns', \App\Http\Controllers\Api\V1\Sales\SaleReturnController::class);
        Route::apiResource('stock-adjustment-items', \App\Http\Controllers\Api\V1\Inventory\StockAdjustmentItemController::class);
        Route::apiResource('stock-opname-items', \App\Http\Controllers\Api\V1\Inventory\StockOpnameItemController::class);
        Route::apiResource('stock-transfer-items', \App\Http\Controllers\Api\V1\Inventory\StockTransferItemController::class);
        Route::apiResource('supplier-contacts', \App\Http\Controllers\Api\V1\Supplier\SupplierContactController::class);
        Route::apiResource('wishlists', \App\Http\Controllers\Api\V1\Order\WishlistController::class);
    });

    // ─── Public E-Commerce Storefront Routes ──────────────────────────────────
    Route::prefix('store')->group(function () {
        Route::get('products',              [ProductController::class, 'index']);
        Route::get('products/{slug}',       [ProductController::class, 'showBySlug']);
        Route::get('categories',            [CategoryController::class, 'index']);
        Route::get('categories/{slug}',     [CategoryController::class, 'showBySlug']);
        Route::get('banners',               [\App\Http\Controllers\Api\V1\Setting\BannerController::class, 'index']);
        Route::get('flash-sales',           [\App\Http\Controllers\Api\V1\Marketing\FlashSaleController::class, 'active']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('cart',              [\App\Http\Controllers\Api\V1\Order\CartController::class, 'show']);
            Route::post('cart/add',         [\App\Http\Controllers\Api\V1\Order\CartController::class, 'add']);
            Route::put('cart/update',       [\App\Http\Controllers\Api\V1\Order\CartController::class, 'update']);
            Route::delete('cart/remove',    [\App\Http\Controllers\Api\V1\Order\CartController::class, 'remove']);
            Route::post('cart/checkout',    [\App\Http\Controllers\Api\V1\Order\CartController::class, 'checkout']);
            Route::get('wishlist',          [\App\Http\Controllers\Api\V1\Order\WishlistController::class, 'index']);
            Route::post('wishlist/add',     [\App\Http\Controllers\Api\V1\Order\WishlistController::class, 'add']);
            Route::delete('wishlist/{id}',  [\App\Http\Controllers\Api\V1\Order\WishlistController::class, 'remove']);
            Route::post('reviews',          [\App\Http\Controllers\Api\V1\Order\ReviewController::class, 'store']);
            Route::get('orders',            [OrderController::class, 'myOrders']);
            Route::get('orders/{number}',   [OrderController::class, 'trackByNumber']);
        });
    });
});
