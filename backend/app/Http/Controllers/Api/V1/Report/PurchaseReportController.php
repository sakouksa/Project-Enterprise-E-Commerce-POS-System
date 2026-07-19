<?php

namespace App\Http\Controllers\Api\V1\Report;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Purchase\Purchase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseReportController extends BaseApiController
{
    /**
     * GET /api/v1/purchase-report
     */
    public function index(Request $request): JsonResponse
    {
        $startDate = $request->start_date ?? $request->date_from;
        $endDate   = $request->end_date   ?? $request->date_to;

        $query = Purchase::where('status', '!=', 'cancelled');

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        $purchases = $query->get();

        $totalPurchases = $purchases->sum('grand_total_base');
        $purchasesCount = $purchases->count();
        $totalPaid      = $purchases->sum('paid_amount_base');
        $totalDue       = $purchases->sum('due_amount_base');

        // Status breakdown
        $statusBreakdown = Purchase::select('status', DB::raw('count(*) as count'), DB::raw('sum(grand_total_base) as total'))
            ->when($startDate, fn($q) => $q->where('date', '>=', $startDate))
            ->when($endDate, fn($q) => $q->where('date', '<=', $endDate))
            ->groupBy('status')
            ->get();

        // Top Suppliers
        $topSuppliers = Purchase::select('supplier_id', DB::raw('sum(grand_total_base) as total'), DB::raw('count(*) as count'))
            ->with('supplier')
            ->when($startDate, fn($q) => $q->where('date', '>=', $startDate))
            ->when($endDate, fn($q) => $q->where('date', '<=', $endDate))
            ->where('status', '!=', 'cancelled')
            ->groupBy('supplier_id')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'supplier_name' => $item->supplier->name ?? 'Unknown',
                    'total'         => (float)$item->total,
                    'count'         => $item->count,
                ];
            });

        // Monthly Trend (Last 6 Months) — PostgreSQL compatible
        $monthlyTrend = Purchase::select(
            DB::raw("TO_CHAR(date, 'YYYY-MM') as month"),
            DB::raw('SUM(grand_total_base) as total'),
            DB::raw('SUM(paid_amount_base) as paid')
        )
            ->where('status', '!=', 'cancelled')
            ->where('date', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy(DB::raw("TO_CHAR(date, 'YYYY-MM')"))
            ->orderBy(DB::raw("TO_CHAR(date, 'YYYY-MM')"), 'asc')
            ->get();

        return $this->successResponse([
            'total_purchases'  => (float)$totalPurchases,
            'purchases_count'  => $purchasesCount,
            'total_paid'       => (float)$totalPaid,
            'total_due'        => (float)$totalDue,
            'status_breakdown' => $statusBreakdown,
            'top_suppliers'    => $topSuppliers,
            'monthly_trend'    => $monthlyTrend,
        ]);
    }
}
