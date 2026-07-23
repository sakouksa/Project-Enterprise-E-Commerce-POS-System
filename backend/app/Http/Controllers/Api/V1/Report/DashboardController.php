<?php

namespace App\Http\Controllers\Api\V1\Report;

use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Sales\Sale;
use App\Models\Order\Order;
use App\Models\Customer\Customer;
use App\Models\Product\Product;
use App\Models\Inventory\Inventory;
use Illuminate\Support\Facades\DB;

class DashboardController extends BaseApiController
{
    /**
     * GET /api/v1/dashboard/stats
     */
    public function stats(Request $request): JsonResponse
    {
        $today = now()->startOfDay();

        $todaySales = (float) Sale::completed()->whereDate('date', $today)->sum('grand_total');
        $todayOrders = (int) Order::whereDate('created_at', $today)->count();
        $totalCustomers = (int) Customer::count();
        $totalProducts = (int) Product::count();

        // Calculate sales growth
        $yesterday = now()->subDay()->startOfDay();
        $yesterdaySales = (float) Sale::completed()->whereDate('date', $yesterday)->sum('grand_total');
        $salesGrowth = $yesterdaySales > 0 ? (($todaySales - $yesterdaySales) / $yesterdaySales) * 100 : 0;

        return $this->successResponse([
            'today_sales'      => $todaySales,
            'today_orders'     => $todayOrders,
            'total_customers'  => $totalCustomers,
            'total_products'   => $totalProducts,
            'sales_growth'     => round($salesGrowth, 2),
            'orders_growth'    => 0,
            'customers_growth' => 0,
        ]);
    }

    /**
     * GET /api/v1/dashboard/sales-chart
     */
    public function salesChart(Request $request): JsonResponse
    {
        // Get last 30 days sales grouped by date
        $startDate = now()->subDays(30)->startOfDay();

        $sales = Sale::completed()
            ->where('date', '>=', $startDate)
            ->select(DB::raw('DATE(date) as date'), DB::raw('SUM(grand_total) as total'))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return $this->successResponse($sales);
    }

    /**
     * GET /api/v1/dashboard/top-products
     */
    public function topProducts(Request $request): JsonResponse
    {
        // Real top-selling products from POS sale_items
        $topFromSales = DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->where('sales.status', 'completed')
            ->whereNull('sales.deleted_at')
            ->whereNull('products.deleted_at')
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(sale_items.quantity) as total_qty'),
                DB::raw('SUM(sale_items.total) as total_revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        // Also include e-commerce order_items
        $topFromOrders = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereIn('orders.status', ['completed', 'delivered'])
            ->whereNull('orders.deleted_at')
            ->whereNull('products.deleted_at')
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_qty'),
                DB::raw('SUM(order_items.total) as total_revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        // Merge and aggregate by product id, take top 5
        $merged = $topFromSales->concat($topFromOrders)
            ->groupBy('id')
            ->map(function ($items) {
                $first = $items->first();
                return [
                    'id'            => $first->id,
                    'name'          => $first->name,
                    'value'         => (float) $items->sum('total_qty'),
                    'total_revenue' => (float) $items->sum('total_revenue'),
                ];
            })
            ->sortByDesc('value')
            ->values()
            ->take(5);

        // If no real data, return category-based fallback
        if ($merged->isEmpty()) {
            $merged = DB::table('products')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->whereNull('products.deleted_at')
                ->where('products.status', 'active')
                ->select('categories.name', DB::raw('COUNT(products.id) as value'))
                ->groupBy('categories.id', 'categories.name')
                ->orderByDesc('value')
                ->limit(5)
                ->get()
                ->map(fn($r) => ['name' => $r->name, 'value' => (int) $r->value]);
        }

        return $this->successResponse($merged);
    }

    /**
     * GET /api/v1/dashboard/recent-orders
     */
    public function recentOrders(Request $request): JsonResponse
    {
        $orders = Order::with('customer')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($o) => [
                'id'            => $o->id,
                'order_number'  => $o->order_number,
                'customer_name' => $o->customer?->name,
                'grand_total'   => (float) $o->grand_total,
                'status'        => $o->status,
            ]);

        return $this->successResponse($orders);
    }

    /**
     * GET /api/v1/dashboard/low-stock
     */
    public function lowStock(Request $request): JsonResponse
    {
        $lowStock = Inventory::with(['product', 'warehouse'])
            ->lowStock()
            ->limit(5)
            ->get()
            ->map(fn($i) => [
                'id'             => $i->id,
                'product_name'   => $i->product?->name,
                'warehouse_name' => $i->warehouse?->name,
                'quantity'       => (float) $i->quantity,
            ]);

        return $this->successResponse($lowStock);
    }
}
