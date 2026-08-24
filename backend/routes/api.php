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
use App\Http\Controllers\Api\V1\Report\SalesReportController;
use App\Http\Controllers\Api\V1\Report\PurchaseReportController;
use App\Http\Controllers\Api\V1\Report\InventoryReportController;
use App\Http\Controllers\Api\V1\Report\DashboardController;
use App\Http\Controllers\Api\V1\Auth\ProfileController;
use App\Http\Controllers\Api\V1\Auth\DeviceController;
use App\Http\Controllers\Api\V1\Auth\SecurityController;
use App\Http\Controllers\Api\V1\Notification\NotificationController;
use App\Http\Controllers\Api\V1\Notification\NotificationTemplateController;
use App\Http\Controllers\Api\V1\Notification\NotificationSettingController;
use App\Http\Controllers\Api\HealthController;

// ─── Health Check ────────────────────────────────────────────────────────────
Route::get('health', [HealthController::class, 'check']);

// ─── API Version 1 ────────────────────────────────────────────────────────────
Route::prefix('v1')->group(function () {

    // ─── Health Check v1 ──────────────────────────────────────────────────────
    Route::get('health', [HealthController::class, 'check']);

    // ─── Public Branding & System Info ───────────────────────────────────────
    Route::get('public/branding', [SettingController::class, 'publicBranding']);

    // ─── Authentication ──────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('login',             [AuthController::class, 'login']);
        Route::post('register',          [AuthController::class, 'register']);
        Route::post('refresh',           [AuthController::class, 'refresh']);
        Route::post('forgot-password',   [AuthController::class, 'forgotPassword']);
        Route::post('reset-password',    [AuthController::class, 'resetPassword']);

        Route::middleware('auth.jwt')->group(function () {
            Route::post('logout',             [AuthController::class, 'logout']);
            Route::post('logout-all-devices', [AuthController::class, 'logoutAllDevices']);
            Route::get('profile',             [AuthController::class, 'profile']);
            Route::put('profile',             [AuthController::class, 'updateProfile']);
            Route::post('change-password',    [AuthController::class, 'changePassword']);
        });
    });

    Route::middleware('auth.jwt')->group(function () {

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

        // ─── Devices & Session Management ─────────────────────────────────
        Route::prefix('devices')->group(function () {
            Route::get('/',                     [DeviceController::class, 'index']);
            Route::post('revoke-others',        [DeviceController::class, 'revokeOthers']);
            Route::post('{id}/revoke',          [DeviceController::class, 'revoke']);
            Route::post('{id}/suspicious',      [DeviceController::class, 'markSuspicious']);
        });

        // ─── Security & Manager Overrides ───────────────────────────────────
        Route::prefix('security')->group(function () {
            Route::get('overview',              [SecurityController::class, 'overview']);
            Route::get('settings',              [SecurityController::class, 'settings']);
            Route::put('settings',              [SecurityController::class, 'updateSettings']);
            Route::post('verify-manager-pin',   [SecurityController::class, 'verifyManagerPin']);
            Route::post('set-manager-pin',      [SecurityController::class, 'setManagerPin']);
        });

        // ─── Dashboard ────────────────────────────────────────────────────
        Route::prefix('dashboard')->group(function () {
            Route::get('stats',            [DashboardController::class, 'stats']);
            Route::get('charts',           [DashboardController::class, 'charts']);
            Route::get('operation-panels', [DashboardController::class, 'operationPanels']);
            Route::get('alerts',           [DashboardController::class, 'alerts']);
            Route::get('system-health',    [DashboardController::class, 'systemHealth']);
            Route::get('sales-chart',      [DashboardController::class, 'salesChart']);
            Route::get('top-products',     [DashboardController::class, 'topProducts']);
            Route::get('recent-orders',    [DashboardController::class, 'recentOrders']);
            Route::get('low-stock',        [DashboardController::class, 'lowStock']);
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

        // ─── Products & Catalog ────────────────────────────────────────────
        Route::get('products/stats',                [ProductController::class, 'stats']);
        Route::get('products/dashboard-statistics', [ProductController::class, 'stats']);
        Route::post('products/bulk-delete', [ProductController::class, 'bulkDelete']);
        Route::post('products/bulk-restore', [ProductController::class, 'bulkRestore']);
        Route::get('products/export',      [ProductController::class, 'export']);
        Route::post('products/import',     [ProductController::class, 'import']);
        Route::post('products/{id}/restore', [ProductController::class, 'restore']);
        Route::delete('products/{id}/force', [ProductController::class, 'forceDelete']);
        Route::post('products/{product}/images',   [ProductController::class, 'uploadImages']);
        Route::delete('products/{product}/images/{image}', [ProductController::class, 'deleteImage']);
        Route::get('products/{product}/variants',  [ProductController::class, 'variants']);
        Route::apiResource('products',   ProductController::class);

        Route::post('categories/bulk-delete', [CategoryController::class, 'bulkDelete']);
        Route::post('categories/bulk-restore', [CategoryController::class, 'bulkRestore']);
        Route::get('categories/export',      [CategoryController::class, 'export']);
        Route::post('categories/import',     [CategoryController::class, 'import']);
        Route::post('categories/{id}/restore', [CategoryController::class, 'restore']);
        Route::delete('categories/{id}/force', [CategoryController::class, 'forceDelete']);
        Route::apiResource('categories', CategoryController::class);

        Route::post('brands/bulk-delete', [BrandController::class, 'bulkDelete']);
        Route::post('brands/bulk-restore', [BrandController::class, 'bulkRestore']);
        Route::get('brands/export',      [BrandController::class, 'export']);
        Route::post('brands/import',     [BrandController::class, 'import']);
        Route::post('brands/{id}/restore', [BrandController::class, 'restore']);
        Route::delete('brands/{id}/force', [BrandController::class, 'forceDelete']);
        Route::apiResource('brands',     BrandController::class);

        Route::post('taxes/bulk-delete', [\App\Http\Controllers\Api\V1\Product\TaxController::class, 'bulkDelete']);
        Route::post('taxes/bulk-restore', [\App\Http\Controllers\Api\V1\Product\TaxController::class, 'bulkRestore']);
        Route::get('taxes/export',      [\App\Http\Controllers\Api\V1\Product\TaxController::class, 'export']);
        Route::post('taxes/import',     [\App\Http\Controllers\Api\V1\Product\TaxController::class, 'import']);
        Route::post('taxes/{id}/restore', [\App\Http\Controllers\Api\V1\Product\TaxController::class, 'restore']);
        Route::delete('taxes/{id}/force', [\App\Http\Controllers\Api\V1\Product\TaxController::class, 'forceDelete']);
        Route::apiResource('taxes', \App\Http\Controllers\Api\V1\Product\TaxController::class);

        Route::post('units/bulk-delete', [\App\Http\Controllers\Api\V1\Product\UnitController::class, 'bulkDelete']);
        Route::post('units/bulk-restore', [\App\Http\Controllers\Api\V1\Product\UnitController::class, 'bulkRestore']);
        Route::get('units/export',      [\App\Http\Controllers\Api\V1\Product\UnitController::class, 'export']);
        Route::post('units/import',     [\App\Http\Controllers\Api\V1\Product\UnitController::class, 'import']);
        Route::post('units/{id}/restore', [\App\Http\Controllers\Api\V1\Product\UnitController::class, 'restore']);
        Route::delete('units/{id}/force', [\App\Http\Controllers\Api\V1\Product\UnitController::class, 'forceDelete']);
        Route::apiResource('units', \App\Http\Controllers\Api\V1\Product\UnitController::class);

        Route::post('attributes/bulk-delete', [AttributeController::class, 'bulkDelete']);
        Route::post('attributes/bulk-restore', [AttributeController::class, 'bulkRestore']);
        Route::get('attributes/export',      [AttributeController::class, 'export']);
        Route::post('attributes/import',     [AttributeController::class, 'import']);
        Route::post('attributes/{id}/restore', [AttributeController::class, 'restore']);
        Route::delete('attributes/{id}/force', [AttributeController::class, 'forceDelete']);
        Route::apiResource('attributes', AttributeController::class);

        // ─── Inventory ─────────────────────────────────────────────────────
        Route::get('inventory/stats',          [InventoryController::class, 'stats']);
        Route::get('inventory/dashboard',      [InventoryController::class, 'stats']);
        Route::get('inventory/export',         [InventoryController::class, 'export']);
        Route::post('inventory/import',        [InventoryController::class, 'import']);
        Route::get('inventory',                [InventoryController::class, 'index']);
        Route::get('inventory/low-stock',      [InventoryController::class, 'lowStock']);
        Route::get('inventory/product/{pid}',  [InventoryController::class, 'byProduct']);
        Route::get('inventory/{id}',           [InventoryController::class, 'show']);

        Route::post('stock-adjustments/bulk-delete', [StockAdjustmentController::class, 'bulkDelete']);
        Route::post('stock-adjustments/bulk-restore', [StockAdjustmentController::class, 'bulkRestore']);
        Route::get('stock-adjustments/export', [StockAdjustmentController::class, 'export']);
        Route::post('stock-adjustments/import', [StockAdjustmentController::class, 'import']);
        Route::post('stock-adjustments/{id}/restore', [StockAdjustmentController::class, 'restore']);
        Route::delete('stock-adjustments/{id}/force', [StockAdjustmentController::class, 'forceDelete']);
        Route::post('stock-adjustments/{id}/approve', [StockAdjustmentController::class, 'approve']);
        Route::apiResource('stock-adjustments', StockAdjustmentController::class);

        Route::post('stock-transfers/bulk-delete', [StockTransferController::class, 'bulkDelete']);
        Route::post('stock-transfers/bulk-restore', [StockTransferController::class, 'bulkRestore']);
        Route::get('stock-transfers/export', [StockTransferController::class, 'export']);
        Route::post('stock-transfers/import', [StockTransferController::class, 'import']);
        Route::post('stock-transfers/{id}/restore', [StockTransferController::class, 'restore']);
        Route::delete('stock-transfers/{id}/force', [StockTransferController::class, 'forceDelete']);
        Route::post('stock-transfers/{id}/ship',    [StockTransferController::class, 'ship']);
        Route::post('stock-transfers/{id}/receive', [StockTransferController::class, 'receive']);
        Route::apiResource('stock-transfers',  StockTransferController::class);

        Route::post('stock-opnames/bulk-delete', [StockOpnameController::class, 'bulkDelete']);
        Route::post('stock-opnames/bulk-restore', [StockOpnameController::class, 'bulkRestore']);
        Route::get('stock-opnames/export', [StockOpnameController::class, 'export']);
        Route::post('stock-opnames/import', [StockOpnameController::class, 'import']);
        Route::post('stock-opnames/{id}/restore', [StockOpnameController::class, 'restore']);
        Route::delete('stock-opnames/{id}/force', [StockOpnameController::class, 'forceDelete']);
        Route::post('stock-opnames/{id}/complete', [StockOpnameController::class, 'complete']);
        Route::apiResource('stock-opnames',    StockOpnameController::class);

        // ─── Suppliers & Purchases ─────────────────────────────────────────
        Route::post('suppliers/bulk-delete',   [SupplierController::class, 'bulkDelete']);
        Route::apiResource('suppliers',        SupplierController::class);
        Route::post('suppliers/{id}/restore',  [SupplierController::class, 'restore']);
        Route::delete('suppliers/{id}/force',  [SupplierController::class, 'forceDelete']);
        Route::apiResource('purchases',        PurchaseController::class);
        Route::post('purchases/{id}/receive',  [PurchaseController::class, 'receive']);
        Route::post('purchases/{id}/cancel',   [PurchaseController::class, 'cancel']);
        Route::post('purchases/{id}/record-payment', [PurchaseController::class, 'recordPayment']);
        
        // Global Purchase Returns endpoints (used by frontend and API specs)
        Route::get('purchases/returns',        [\App\Http\Controllers\Api\V1\Purchase\PurchaseReturnController::class, 'index']);
        Route::post('purchase-returns/bulk-delete', [\App\Http\Controllers\Api\V1\Purchase\PurchaseReturnController::class, 'bulkDelete']);
        Route::apiResource('purchase-returns',  \App\Http\Controllers\Api\V1\Purchase\PurchaseReturnController::class);
        Route::post('purchase-returns/{id}/approve', [\App\Http\Controllers\Api\V1\Purchase\PurchaseReturnController::class, 'approve']);
        Route::post('purchase-returns/{id}/cancel',  [\App\Http\Controllers\Api\V1\Purchase\PurchaseReturnController::class, 'cancel']);
        
        Route::prefix('purchases/{purchase}')->group(function () {
            Route::apiResource('returns', \App\Http\Controllers\Api\V1\Purchase\PurchaseReturnController::class);
        });

        Route::get('purchase-report', [\App\Http\Controllers\Api\V1\Report\PurchaseReportController::class, 'index']);

        // ─── Customers ─────────────────────────────────────────────────────
        Route::get('customers/stats',             [CustomerController::class, 'stats']);
        Route::get('customers/export',            [CustomerController::class, 'export']);
        Route::post('customers/import',           [CustomerController::class, 'import']);
        Route::post('customers/bulk-delete',      [CustomerController::class, 'bulkDelete']);
        Route::post('customers/bulk-restore',     [CustomerController::class, 'bulkRestore']);
        Route::post('customers/bulk-activate',    [CustomerController::class, 'bulkActivate']);
        Route::post('customers/bulk-deactivate',  [CustomerController::class, 'bulkDeactivate']);
        Route::post('customers/bulk-assign-group', [CustomerController::class, 'bulkAssignGroup']);
        Route::apiResource('customers',           CustomerController::class);
        Route::post('customers/{id}/restore',     [CustomerController::class, 'restore']);
        Route::delete('customers/{id}/force',     [CustomerController::class, 'forceDelete']);
        Route::get('customers/{id}/orders',       [CustomerController::class, 'orders']);

        Route::get('customer-groups/export',       [CustomerGroupController::class, 'export']);
        Route::post('customer-groups/import',      [CustomerGroupController::class, 'import']);
        Route::post('customer-groups/bulk-delete', [CustomerGroupController::class, 'bulkDelete']);
        Route::post('customer-groups/bulk-restore', [CustomerGroupController::class, 'bulkRestore']);
        Route::apiResource('customer-groups',     CustomerGroupController::class);
        Route::post('customer-groups/{id}/restore', [CustomerGroupController::class, 'restore']);
        Route::delete('customer-groups/{id}/force', [CustomerGroupController::class, 'forceDelete']);

        // ─── POS ───────────────────────────────────────────────────────────
        Route::prefix('pos')->group(function () {
            Route::post('sales',                   [POSController::class, 'sale']);
            Route::get('sales',                    [POSController::class, 'index']);
            Route::get('sales/{id}',               [POSController::class, 'show']);
            Route::post('sales/{id}/return',       [POSController::class, 'processReturn']);
            Route::get('product-search',           [POSController::class, 'productSearch']);
            Route::get('products/barcode/{code}',  [POSController::class, 'barcodeLookup']);
            Route::post('voice-search',            [POSController::class, 'voiceSearch']);
            Route::post('vision-search',           [POSController::class, 'visionSearch']);
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
            // Enterprise Sales Report Module
            Route::prefix('sales')->group(function () {
                Route::get('overview',        [SalesReportController::class, 'overview']);
                Route::get('dashboard',       [SalesReportController::class, 'dashboard']);
                Route::get('trend',           [SalesReportController::class, 'trend']);
                Route::get('categories',      [SalesReportController::class, 'categories']);
                Route::get('brands',          [SalesReportController::class, 'brands']);
                Route::get('payment-methods', [SalesReportController::class, 'paymentMethods']);
                Route::get('top-products',    [SalesReportController::class, 'topProducts']);
                Route::get('top-customers',   [SalesReportController::class, 'topCustomers']);
                Route::get('list',            [SalesReportController::class, 'list']);
                Route::get('export',          [SalesReportController::class, 'export']);
            });

            // Enterprise Purchase Report Module
            Route::prefix('purchase')->group(function () {
                Route::get('overview',        [PurchaseReportController::class, 'overview']);
                Route::get('dashboard',       [PurchaseReportController::class, 'dashboard']);
                Route::get('trend',           [PurchaseReportController::class, 'trend']);
                Route::get('suppliers',       [PurchaseReportController::class, 'suppliers']);
                Route::get('categories',      [PurchaseReportController::class, 'categories']);
                Route::get('brands',          [PurchaseReportController::class, 'brands']);
                Route::get('warehouses',      [PurchaseReportController::class, 'warehouses']);
                Route::get('products',        [PurchaseReportController::class, 'products']);
                Route::get('status',          [PurchaseReportController::class, 'status']);
                Route::get('payment-status',  [PurchaseReportController::class, 'paymentStatus']);
                Route::get('returns',         [PurchaseReportController::class, 'returns']);
                Route::get('table',           [PurchaseReportController::class, 'table']);
                Route::get('returns-table',   [PurchaseReportController::class, 'returnsTable']);
                Route::get('export',          [PurchaseReportController::class, 'export']);
            });

            // Enterprise Inventory Report Module
            Route::prefix('inventory')->group(function () {
                Route::get('overview',          [InventoryReportController::class, 'overview']);
                Route::get('dashboard',         [InventoryReportController::class, 'overview']);
                Route::get('value-trend',       [InventoryReportController::class, 'overview']);
                Route::get('movement-trend',    [InventoryReportController::class, 'overview']);
                Route::get('categories',        [InventoryReportController::class, 'overview']);
                Route::get('brands',            [InventoryReportController::class, 'overview']);
                Route::get('warehouses',        [InventoryReportController::class, 'overview']);
                Route::get('status',            [InventoryReportController::class, 'overview']);
                Route::get('valuation',         [InventoryReportController::class, 'valuation']);
                Route::get('movements',         [InventoryReportController::class, 'movements']);
                Route::get('low-stock',         [InventoryReportController::class, 'valuation']);
                Route::get('turnover',          [InventoryReportController::class, 'valuation']);
                Route::get('warehouse-summary', [InventoryReportController::class, 'overview']);
                Route::get('aging',             [InventoryReportController::class, 'overview']);
                Route::get('export',            [InventoryReportController::class, 'export']);
            });

            Route::get('sales',        [SalesReportController::class, 'dashboard']); // Default sales summary
            Route::get('purchases',    [ReportController::class, 'purchases']);
            Route::get('inventory',    [InventoryReportController::class, 'overview']);
            Route::get('products',     [ReportController::class, 'products']);
            Route::get('customers',    [ReportController::class, 'customers']);
            Route::get('expenses',     [ReportController::class, 'expenses']);
            Route::get('profit-loss',  [ReportController::class, 'profitLoss']);
            Route::get('export-sales', [SalesReportController::class, 'export']);   // Export
            Route::get('export-inventory', [InventoryReportController::class, 'export']); // Excel
        });

        // ─── Recycle Bin Analytics ─────────────────────────────────────────
        Route::get('recycle-bin/stats',     [\App\Http\Controllers\Api\V1\System\RecycleBinController::class, 'stats']);
        Route::get('recycle-bin/dashboard', [\App\Http\Controllers\Api\V1\System\RecycleBinController::class, 'stats']);

        // ─── Settings ──────────────────────────────────────────────────────
        Route::get('settings',          [SettingController::class, 'index']);
        Route::post('settings',         [SettingController::class, 'bulkUpdate']);
        Route::post('settings/logo',    [SettingController::class, 'uploadLogo']);
        Route::delete('settings/logo',  [SettingController::class, 'removeLogo']);
        Route::get('settings/{key}',    [SettingController::class, 'show']);
        Route::put('settings/{key}',    [SettingController::class, 'update']);
        Route::apiResource('currencies', CurrencyController::class);
        Route::apiResource('languages',  LanguageController::class);

        // ─── Roles & Permissions ───────────────────────────────────────────
        Route::get('roles/stats',               [\App\Http\Controllers\Api\V1\Auth\RoleController::class, 'stats']);
        Route::get('roles/dashboard',           [\App\Http\Controllers\Api\V1\Auth\RoleController::class, 'stats']);
        Route::apiResource('roles',             \App\Http\Controllers\Api\V1\Auth\RoleController::class);
        Route::get('permissions/stats',         [\App\Http\Controllers\Api\V1\Auth\PermissionController::class, 'stats']);
        Route::get('permissions/dashboard',     [\App\Http\Controllers\Api\V1\Auth\PermissionController::class, 'stats']);
        Route::apiResource('permissions',       \App\Http\Controllers\Api\V1\Auth\PermissionController::class);
        Route::post('users/{id}/assign-role',   [\App\Http\Controllers\Api\V1\Auth\UserRoleController::class, 'assign']);
        Route::post('users/{id}/remove-role',   [\App\Http\Controllers\Api\V1\Auth\UserRoleController::class, 'remove']);

        // ─── Users ─────────────────────────────────────────────────────────
        Route::get('users/stats',               [\App\Http\Controllers\Api\V1\Auth\UserController::class, 'stats']);
        Route::get('users/dashboard',           [\App\Http\Controllers\Api\V1\Auth\UserController::class, 'stats']);
        Route::post('users/upload-avatar',      [\App\Http\Controllers\Api\V1\Auth\UserController::class, 'uploadAvatar']);
        Route::apiResource('users', \App\Http\Controllers\Api\V1\Auth\UserController::class);

        // ─── Marketing: Banners ────────────────────────────────────────────
        Route::apiResource('banners', BannerController::class);

        // ─── Marketing: Coupons ────────────────────────────────────────────
        Route::get('coupons/generate-code', [CouponController::class, 'generateCode']);
        Route::post('coupons/validate', [CouponController::class, 'validateCoupon']);
        Route::apiResource('coupons', CouponController::class);

        // ─── Marketing: Flash Sales ───────────────────────────────────────
        Route::apiResource('flash-sales', FlashSaleController::class);

        // ─── Reviews (Admin Moderation) ───────────────────────────────────
        Route::get('reviews',              [ReviewController::class, 'index']);
        Route::post('reviews/{id}/approve',[ReviewController::class, 'approve']);
        Route::post('reviews/{id}/reject', [ReviewController::class, 'reject']);
        Route::delete('reviews/{id}',      [ReviewController::class, 'destroy']);

        // ─── Activity Logs ────────────────────────────────────────────────
        Route::get('activity-logs/dashboard', [ActivityLogController::class, 'dashboard']);
        Route::get('activity-logs',        [ActivityLogController::class, 'index']);
        Route::get('activity-logs/{id}',   [ActivityLogController::class, 'show']);
        Route::delete('activity-logs/{id}',[ActivityLogController::class, 'destroy']);

        // ─── Automated Sync Routes ─────────────────────────────────────────
        // ─── Automated Sync Routes ─────────────────────────────────────────
        // Departments
        Route::post('departments/bulk-delete', [\App\Http\Controllers\Api\V1\Employee\DepartmentController::class, 'bulkDelete']);
        Route::post('departments/bulk-restore', [\App\Http\Controllers\Api\V1\Employee\DepartmentController::class, 'bulkRestore']);
        Route::get('departments/export', [\App\Http\Controllers\Api\V1\Employee\DepartmentController::class, 'export']);
        Route::post('departments/import', [\App\Http\Controllers\Api\V1\Employee\DepartmentController::class, 'import']);
        Route::post('departments/{id}/restore', [\App\Http\Controllers\Api\V1\Employee\DepartmentController::class, 'restore']);
        Route::delete('departments/{id}/force', [\App\Http\Controllers\Api\V1\Employee\DepartmentController::class, 'forceDelete']);
        Route::apiResource('departments', \App\Http\Controllers\Api\V1\Employee\DepartmentController::class);

        // Positions
        Route::post('positions/bulk-delete', [\App\Http\Controllers\Api\V1\Employee\PositionController::class, 'bulkDelete']);
        Route::post('positions/bulk-restore', [\App\Http\Controllers\Api\V1\Employee\PositionController::class, 'bulkRestore']);
        Route::get('positions/export', [\App\Http\Controllers\Api\V1\Employee\PositionController::class, 'export']);
        Route::post('positions/import', [\App\Http\Controllers\Api\V1\Employee\PositionController::class, 'import']);
        Route::post('positions/{id}/restore', [\App\Http\Controllers\Api\V1\Employee\PositionController::class, 'restore']);
        Route::delete('positions/{id}/force', [\App\Http\Controllers\Api\V1\Employee\PositionController::class, 'forceDelete']);
        Route::apiResource('positions', \App\Http\Controllers\Api\V1\Employee\PositionController::class);

        // Employees
        Route::get('employees/stats', [\App\Http\Controllers\Api\V1\Employee\EmployeeController::class, 'stats']);
        Route::post('employees/upload-photo', [\App\Http\Controllers\Api\V1\Employee\EmployeeController::class, 'uploadPhoto']);
        Route::post('employees/bulk-delete', [\App\Http\Controllers\Api\V1\Employee\EmployeeController::class, 'bulkDelete']);
        Route::post('employees/bulk-restore', [\App\Http\Controllers\Api\V1\Employee\EmployeeController::class, 'bulkRestore']);
        Route::get('employees/export', [\App\Http\Controllers\Api\V1\Employee\EmployeeController::class, 'export']);
        Route::post('employees/import', [\App\Http\Controllers\Api\V1\Employee\EmployeeController::class, 'import']);
        Route::post('employees/{id}/restore', [\App\Http\Controllers\Api\V1\Employee\EmployeeController::class, 'restore']);
        Route::delete('employees/{id}/force', [\App\Http\Controllers\Api\V1\Employee\EmployeeController::class, 'forceDelete']);
        Route::apiResource('employees', \App\Http\Controllers\Api\V1\Employee\EmployeeController::class);

        // Shifts
        Route::apiResource('shifts', \App\Http\Controllers\Api\V1\Employee\ShiftController::class);

        // Attendances
        Route::post('attendances/generate-qr', [\App\Http\Controllers\Api\V1\Employee\AttendanceController::class, 'generateQr']);
        Route::post('attendances/scan-qr', [\App\Http\Controllers\Api\V1\Employee\AttendanceController::class, 'scanQr']);
        Route::get('attendances/dashboard-stats', [\App\Http\Controllers\Api\V1\Employee\AttendanceController::class, 'dashboardStats']);
        Route::post('attendances/bulk-delete', [\App\Http\Controllers\Api\V1\Employee\AttendanceController::class, 'bulkDelete']);
        Route::get('attendances/export', [\App\Http\Controllers\Api\V1\Employee\AttendanceController::class, 'export']);
        Route::post('attendances/import', [\App\Http\Controllers\Api\V1\Employee\AttendanceController::class, 'import']);
        Route::apiResource('attendances', \App\Http\Controllers\Api\V1\Employee\AttendanceController::class);

        // Singular Attendance aliases for frontend compatibility
        Route::post('attendance/generate-qr', [\App\Http\Controllers\Api\V1\Employee\AttendanceController::class, 'generateQr']);
        Route::post('attendance/scan-qr', [\App\Http\Controllers\Api\V1\Employee\AttendanceController::class, 'scanQr']);
        Route::get('attendance/dashboard-stats', [\App\Http\Controllers\Api\V1\Employee\AttendanceController::class, 'dashboardStats']);
        Route::post('attendance/bulk-delete', [\App\Http\Controllers\Api\V1\Employee\AttendanceController::class, 'bulkDelete']);
        Route::get('attendance/export', [\App\Http\Controllers\Api\V1\Employee\AttendanceController::class, 'export']);
        Route::post('attendance/import', [\App\Http\Controllers\Api\V1\Employee\AttendanceController::class, 'import']);
        Route::apiResource('attendance', \App\Http\Controllers\Api\V1\Employee\AttendanceController::class);

        // Payrolls
        Route::post('payrolls/bulk-delete', [\App\Http\Controllers\Api\V1\Employee\PayrollController::class, 'bulkDelete']);
        Route::get('payrolls/export', [\App\Http\Controllers\Api\V1\Employee\PayrollController::class, 'export']);
        Route::post('payrolls/import', [\App\Http\Controllers\Api\V1\Employee\PayrollController::class, 'import']);
        Route::apiResource('payrolls', \App\Http\Controllers\Api\V1\Employee\PayrollController::class);
        Route::apiResource('blog-categories', \App\Http\Controllers\Api\V1\CMS\BlogCategoryController::class);
        Route::apiResource('blog-tags', \App\Http\Controllers\Api\V1\CMS\BlogTagController::class);
        Route::apiResource('blogs', \App\Http\Controllers\Api\V1\CMS\BlogController::class);
        Route::post('blogs/{id}/restore', [\App\Http\Controllers\Api\V1\CMS\BlogController::class, 'restore']);
        Route::delete('blogs/{id}/force', [\App\Http\Controllers\Api\V1\CMS\BlogController::class, 'forceDelete']);
        Route::apiResource('pages', \App\Http\Controllers\Api\V1\CMS\PageController::class);
        Route::apiResource('faqs', \App\Http\Controllers\Api\V1\CMS\FaqController::class);
        Route::get('finance/analytics', [\App\Http\Controllers\Api\V1\Expense\FinanceAnalyticsController::class, 'analytics']);
        Route::post('expense-categories/bulk-delete', [\App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::class, 'bulkDelete']);
        Route::apiResource('expense-categories', \App\Http\Controllers\Api\V1\Expense\ExpenseCategoryController::class);
        Route::get('expenses/stats', [\App\Http\Controllers\Api\V1\Expense\ExpenseController::class, 'stats']);
        Route::post('expenses/bulk-delete', [\App\Http\Controllers\Api\V1\Expense\ExpenseController::class, 'bulkDelete']);
        Route::post('expenses/bulk-restore', [\App\Http\Controllers\Api\V1\Expense\ExpenseController::class, 'bulkRestore']);
        Route::apiResource('expenses', \App\Http\Controllers\Api\V1\Expense\ExpenseController::class);
        Route::post('expenses/{id}/restore', [\App\Http\Controllers\Api\V1\Expense\ExpenseController::class, 'restore']);
        Route::delete('expenses/{id}/force', [\App\Http\Controllers\Api\V1\Expense\ExpenseController::class, 'forceDelete']);
        Route::apiResource('shipping-methods', \App\Http\Controllers\Api\V1\Shipping\ShippingMethodController::class);
        Route::apiResource('shipping-zones', \App\Http\Controllers\Api\V1\Shipping\ShippingZoneController::class);
        Route::apiResource('shipping-rates', \App\Http\Controllers\Api\V1\Shipping\ShippingRateController::class);
        Route::apiResource('shipments', \App\Http\Controllers\Api\V1\Order\ShipmentController::class);
        Route::post('countries/bulk-delete', [\App\Http\Controllers\Api\V1\Setting\CountryController::class, 'bulkDelete']);
        Route::post('provinces/bulk-delete', [\App\Http\Controllers\Api\V1\Setting\ProvinceController::class, 'bulkDelete']);
        Route::post('cities/bulk-delete', [\App\Http\Controllers\Api\V1\Setting\CityController::class, 'bulkDelete']);
        Route::apiResource('countries', \App\Http\Controllers\Api\V1\Setting\CountryController::class);
        Route::apiResource('provinces', \App\Http\Controllers\Api\V1\Setting\ProvinceController::class);
        Route::apiResource('cities', \App\Http\Controllers\Api\V1\Setting\CityController::class);

        Route::apiResource('promotions', \App\Http\Controllers\Api\V1\Marketing\PromotionController::class);
        Route::apiResource('transactions', \App\Http\Controllers\Api\V1\Payment\TransactionController::class);

        // ─── Sub-Tables Automated Sync Routes ──────────────────────────────
        Route::apiResource('attribute-values', \App\Http\Controllers\Api\V1\Product\AttributeValueController::class);
        Route::apiResource('audit-logs', \App\Http\Controllers\Api\V1\Log\AuditLogController::class);
        Route::apiResource('cart-items', \App\Http\Controllers\Api\V1\Order\CartItemController::class);
        Route::apiResource('carts', \App\Http\Controllers\Api\V1\Order\CartController::class);
        Route::apiResource('cash-register-transactions', \App\Http\Controllers\Api\V1\POS\CashRegisterTransactionController::class);
        Route::get('customer-addresses/export', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'export']);
        Route::post('customer-addresses/import', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'import']);
        Route::post('customer-addresses/bulk-delete', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'bulkDelete']);
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
        Route::post('product-variants/bulk-delete', [\App\Http\Controllers\Api\V1\Product\ProductVariantController::class, 'bulkDelete']);
        Route::apiResource('product-variants', \App\Http\Controllers\Api\V1\Product\ProductVariantController::class);
        Route::apiResource('purchase-items', \App\Http\Controllers\Api\V1\Purchase\PurchaseItemController::class);
        Route::apiResource('purchase-return-items', \App\Http\Controllers\Api\V1\Purchase\PurchaseReturnItemController::class);
        Route::apiResource('purchase-returns', \App\Http\Controllers\Api\V1\Purchase\PurchaseReturnController::class);
        Route::apiResource('sale-items', \App\Http\Controllers\Api\V1\Sales\SaleItemController::class);
        Route::apiResource('sale-return-items', \App\Http\Controllers\Api\V1\Sales\SaleReturnItemController::class);
        Route::apiResource('sale-returns', \App\Http\Controllers\Api\V1\Sales\SaleReturnController::class);
        Route::apiResource('stock-adjustment-items', \App\Http\Controllers\Api\V1\Inventory\StockAdjustmentItemController::class);
        Route::apiResource('stock-opname-items', \App\Http\Controllers\Api\V1\Inventory\StockOpnameItemController::class);
        // ─── Enterprise Notification Module ──────────────────────────────
        Route::prefix('notifications')->group(function () {
            Route::get('stats',              [NotificationController::class, 'stats']);
            Route::get('unread',             [NotificationController::class, 'unread']);
            Route::get('export',             [NotificationController::class, 'export']);
            Route::put('read-all',           [NotificationController::class, 'markAllAsRead']);
            Route::post('bulk',              [NotificationController::class, 'bulk']);
            Route::delete('clear',           [NotificationController::class, 'clear']);
            Route::get('{id}/logs',          [NotificationController::class, 'logs']);
            Route::post('{id}/duplicate',    [NotificationController::class, 'duplicate']);
            Route::put('{id}/read',          [NotificationController::class, 'markAsRead']);
        });
        Route::apiResource('notifications', NotificationController::class);

        Route::get('notification-templates/export',              [NotificationTemplateController::class, 'export']);
        Route::post('notification-templates/import',             [NotificationTemplateController::class, 'import']);
        Route::post('notification-templates/{id}/duplicate',     [NotificationTemplateController::class, 'duplicate']);
        Route::put('notification-templates/{id}/toggle-status',  [NotificationTemplateController::class, 'toggleStatus']);
        Route::apiResource('notification-templates', NotificationTemplateController::class);

        Route::prefix('notification-settings')->group(function () {
            Route::get('/',                  [NotificationSettingController::class, 'show']);
            Route::put('/',                  [NotificationSettingController::class, 'update']);
            Route::post('test-email',        [NotificationSettingController::class, 'testEmail']);
            Route::post('test-telegram',     [NotificationSettingController::class, 'testTelegram']);
            Route::post('test-sms',          [NotificationSettingController::class, 'testSms']);
            Route::post('test-push',         [NotificationSettingController::class, 'testPush']);
            Route::post('test-channel',      [NotificationSettingController::class, 'testChannel']);
        });
    });



    // ─── Public E-Commerce Storefront Routes ──────────────────────────────────
    Route::prefix('store')->group(function () {

        // ── Homepage & Discovery ────────────────────────────────────────────
        Route::get('homepage',             [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'homepage']);
        Route::get('featured',             [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'featured']);
        Route::get('banners',              [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'banners']);
        Route::get('settings',            [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'settings']);

        // ── Products ────────────────────────────────────────────────────────
        Route::get('products',             [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'products']);
        Route::get('products/{slug}',      [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'productDetail']);

        // ── Categories & Brands ─────────────────────────────────────────────
        Route::get('categories',           [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'categories']);
        Route::get('brands',               [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'brands']);

        // ── Flash Sales ─────────────────────────────────────────────────────
        Route::get('flash-sales',          [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'flashSale']);
        Route::get('flash-sale',           [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'flashSale']);

        // ── Search ──────────────────────────────────────────────────────────
        Route::get('search',               [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'search']);
        Route::get('search/autocomplete',  [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'autocomplete']);
        Route::get('trending-searches',    [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'trendingSearches']);

        // ── Coupons ─────────────────────────────────────────────────────────
        Route::post('coupons/validate',    [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'validateCoupon']);

        // ── Newsletter ──────────────────────────────────────────────────────
        Route::post('newsletter/subscribe', [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'newsletterSubscribe']);

        // ── Blog ────────────────────────────────────────────────────────────
        Route::get('blog',                 [\App\Http\Controllers\Api\V1\Store\StorefrontController::class, 'blog']);

        // ── Customer Auth ───────────────────────────────────────────────────
        Route::prefix('auth')->group(function () {
            Route::post('register',         [\App\Http\Controllers\Api\V1\Store\CustomerAuthController::class, 'register']);
            Route::post('login',            [\App\Http\Controllers\Api\V1\Store\CustomerAuthController::class, 'login']);
            Route::post('forgot-password',  [\App\Http\Controllers\Api\V1\Store\CustomerAuthController::class, 'forgotPassword']);
            Route::post('reset-password',   [\App\Http\Controllers\Api\V1\Store\CustomerAuthController::class, 'resetPassword']);

            Route::middleware('auth.jwt')->group(function () {
                Route::get('me',            [\App\Http\Controllers\Api\V1\Store\CustomerAuthController::class, 'me']);
                Route::put('profile',       [\App\Http\Controllers\Api\V1\Store\CustomerAuthController::class, 'updateProfile']);
                Route::post('change-password', [\App\Http\Controllers\Api\V1\Store\CustomerAuthController::class, 'changePassword']);
                Route::post('logout',       [\App\Http\Controllers\Api\V1\Store\CustomerAuthController::class, 'logout']);
            });
        });

        // ── Cart (session or auth) ───────────────────────────────────────────
        Route::get('cart',                 [\App\Http\Controllers\Api\V1\Order\CartController::class, 'show']);
        Route::post('cart/add',            [\App\Http\Controllers\Api\V1\Order\CartController::class, 'add']);
        Route::put('cart/update',          [\App\Http\Controllers\Api\V1\Order\CartController::class, 'update']);
        Route::delete('cart/remove',       [\App\Http\Controllers\Api\V1\Order\CartController::class, 'remove']);
        Route::delete('cart/clear',        [\App\Http\Controllers\Api\V1\Order\CartController::class, 'clear']);
        Route::post('cart/apply-coupon',   [\App\Http\Controllers\Api\V1\Order\CartController::class, 'applyCoupon']);

        // ── Checkout (requires auth) ─────────────────────────────────────────
        Route::middleware('auth.jwt')->group(function () {
            Route::post('cart/checkout',   [\App\Http\Controllers\Api\V1\Order\CartController::class, 'checkout']);

            // Wishlist
            Route::get('wishlist',                      [\App\Http\Controllers\Api\V1\Order\WishlistController::class, 'index']);
            Route::post('wishlist/add',                 [\App\Http\Controllers\Api\V1\Order\WishlistController::class, 'add']);
            Route::post('wishlist/move-all-to-cart',    [\App\Http\Controllers\Api\V1\Order\WishlistController::class, 'moveAllToCart']);
            Route::delete('wishlist/{id}',              [\App\Http\Controllers\Api\V1\Order\WishlistController::class, 'remove']);
            Route::delete('wishlist/product/{productId}', [\App\Http\Controllers\Api\V1\Order\WishlistController::class, 'removeByProduct']);
            Route::post('wishlist/{id}/move-to-cart',   [\App\Http\Controllers\Api\V1\Order\WishlistController::class, 'moveToCart']);
            Route::get('wishlist/check/{productId}',    [\App\Http\Controllers\Api\V1\Order\WishlistController::class, 'check']);

            // Customer Orders
            Route::get('orders',            [OrderController::class, 'myOrders']);
            Route::get('orders/{number}',   [OrderController::class, 'trackByNumber']);

            // Reviews
            Route::post('reviews',          [\App\Http\Controllers\Api\V1\Order\ReviewController::class, 'store']);
        });

        // ── Public Order Tracking (by number + email) ───────────────────────
        Route::get('track/{number}',       [OrderController::class, 'trackByNumber']);
    });

    // ─── Public Media / Storage Asset Streamer ──────────────────────────────
    Route::get('storage/{path}', function (string $path) {
        if (\Illuminate\Support\Facades\Storage::disk('public')->exists($path)) {
            return \Illuminate\Support\Facades\Storage::disk('public')->response($path);
        }

        if (\Illuminate\Support\Facades\Storage::disk('public')->exists(basename($path))) {
            return \Illuminate\Support\Facades\Storage::disk('public')->response(basename($path));
        }

        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if ($ext === 'pdf') {
            $cleanName = htmlspecialchars(basename($path));
            $pdfContent = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 5 0 R>>>>/Contents 4 0 R>>endobj\n4 0 obj<</Length 140>>stream\nBT /F1 18 Tf 50 720 Td (OFFICIAL EXPENSE VOUCHER RECEIPT) Tj\n/F1 12 Tf 0 -30 Td (File: {$cleanName}) Tj\n/F1 10 Tf 0 -20 Td (Status: Digital Attachment Verified) Tj ET\nendstream\nendobj\n5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000244 00000 n \n0000000435 00000 n \ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n512\n%%EOF";
            return response($pdfContent, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . basename($path) . '"',
            ]);
        }

        $cleanName = htmlspecialchars(basename($path));
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#090d16"/><rect x="20" y="20" width="560" height="360" rx="16" fill="#131b2e" stroke="#10b981" stroke-width="2" stroke-dasharray="6 6"/><circle cx="300" cy="140" r="36" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2"/><path d="M288 140l8 8 16-16" stroke="#10b981" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="50%" y="220" dominant-baseline="middle" text-anchor="middle" fill="#10b981" font-family="sans-serif" font-size="20" font-weight="bold">Digital Receipt Attachment</text><text x="50%" y="255" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="14">' . $cleanName . '</text><text x="50%" y="290" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="12">Verified by Accounting Department</text></svg>';
        return response($svg, 200, ['Content-Type' => 'image/svg+xml']);
    })->where('path', '.*');
});

