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
        // Return placeholder categories data for pie chart
        return $this->successResponse([
            ['name' => 'Electronics', 'value' => 45],
            ['name' => 'Apparel',     'value' => 30],
            ['name' => 'Grocery',     'value' => 15],
            ['name' => 'Home',        'value' => 10],
        ]);
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
