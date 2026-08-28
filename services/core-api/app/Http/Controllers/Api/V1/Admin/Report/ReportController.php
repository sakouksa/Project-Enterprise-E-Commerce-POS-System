<?php

namespace App\Http\Controllers\Api\V1\Admin\Report;

use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Sales\Sale;
use App\Models\Purchase\Purchase;
use App\Models\Expense\Expense;
use App\Models\Inventory\Inventory;

class ReportController extends BaseApiController
{
    /**
     * GET /api/v1/reports/sales
     */
    public function sales(Request $request): JsonResponse
    {
        $startDate = $request->start_date ?? $request->date_from;
        $endDate   = $request->end_date   ?? $request->date_to;

        $sales = Sale::completed()
            ->when($startDate, fn($q, $sd) => $q->where('date', '>=', $sd))
            ->when($endDate, fn($q, $ed) => $q->where('date', '<=', $ed))
            ->get();

        return $this->successResponse([
            'total_sales'      => $sales->sum('grand_total'),
            'total_tax'        => $sales->sum('tax_amount'),
            'total_discount'   => $sales->sum('discount_amount'),
            'sales_count'      => $sales->count(),
            'average_ticket'   => $sales->count() > 0 ? $sales->sum('grand_total') / $sales->count() : 0,
        ]);
    }

    /**
     * GET /api/v1/reports/purchases
     */
    public function purchases(Request $request): JsonResponse
    {
        $startDate = $request->start_date ?? $request->date_from;
        $endDate   = $request->end_date   ?? $request->date_to;

        $purchases = Purchase::received()
            ->when($startDate, fn($q, $sd) => $q->where('date', '>=', $sd))
            ->when($endDate, fn($q, $ed) => $q->where('date', '<=', $ed))
            ->get();

        return $this->successResponse([
            'total_purchases' => $purchases->sum('grand_total'),
            'purchases_count' => $purchases->count(),
        ]);
    }

    /**
     * GET /api/v1/reports/inventory
     */
    public function inventory(Request $request): JsonResponse
    {
        $totalItems = Inventory::sum('quantity');
        $lowStockItems = Inventory::lowStock()->count();

        return $this->successResponse([
            'total_items'     => $totalItems,
            'low_stock_items' => $lowStockItems,
        ]);
    }

    /**
     * GET /api/v1/reports/export-inventory
     */
    public function exportInventory(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=inventory_export_' . now()->format('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function () {
            $file = fopen('php://output', 'w');

            // UTF-8 BOM
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, [
                'ID',
                'Product Name',
                'SKU',
                'Barcode',
                'Category',
                'Brand',
                'Selling Price',
                'Cost Price',
                'Stock Quantity',
                'Status'
            ]);

            $products = \App\Models\Product\Product::with(['category', 'brand', 'inventories'])->get();

            foreach ($products as $product) {
                fputcsv($file, [
                    $product->id,
                    $product->name,
                    $product->sku,
                    $product->barcode ?? '',
                    $product->category?->name ?? '',
                    $product->brand?->name ?? '',
                    $product->selling_price,
                    $product->cost_price ?? 0,
                    $product->inventories->sum('quantity'),
                    $product->status
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * GET /api/v1/reports/export-sales
     */
    public function exportSales(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=sales_export_' . now()->format('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function () use ($request) {
            $file = fopen('php://output', 'w');

            // UTF-8 BOM
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, [
                'ID',
                'Sale Date',
                'Invoice No',
                'Customer Name',
                'Sub Total',
                'Tax Amount',
                'Discount Amount',
                'Grand Total',
                'Payment Status',
                'Payment Method'
            ]);

            $startDate = $request->start_date ?? $request->date_from;
            $endDate   = $request->end_date   ?? $request->date_to;

            $sales = Sale::with(['customer', 'paymentMethod'])
                ->when($startDate, fn($q, $sd) => $q->where('date', '>=', $sd))
                ->when($endDate, fn($q, $ed) => $q->where('date', '<=', $ed))
                ->get();

            foreach ($sales as $sale) {
                fputcsv($file, [
                    $sale->id,
                    $sale->date,
                    $sale->invoice_no,
                    $sale->customer?->name ?? 'Walk-in Customer',
                    $sale->sub_total,
                    $sale->tax_amount,
                    $sale->discount_amount,
                    $sale->grand_total,
                    $sale->payment_status,
                    $sale->paymentMethod?->name ?? 'Cash'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
