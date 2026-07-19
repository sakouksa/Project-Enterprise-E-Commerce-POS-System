<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Inventory\Inventory;
use App\Models\Company\Warehouse;
use App\Models\Product\Product;
use App\Models\Product\Category;
use App\Models\Product\Brand;
use App\Http\Resources\Inventory\InventoryResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends BaseApiController
{
    /**
     * GET /api/v1/inventory
     */
    public function index(Request $request): JsonResponse
    {
        $query = Inventory::with([
            'product.category',
            'product.brand',
            'product.unit',
            'product.primaryImage',
            'variant',
            'warehouse'
        ]);

        // Filters
        $query->when($request->warehouse_id, fn($q, $w) => $q->where('warehouse_id', $w))
            ->when($request->category_id, function ($q, $catId) {
                $q->whereHas('product', fn($pq) => $pq->where('category_id', $catId));
            })
            ->when($request->brand_id, function ($q, $brandId) {
                $q->whereHas('product', fn($pq) => $pq->where('brand_id', $brandId));
            })
            ->when($request->status, function ($q, $status) {
                if ($status === 'low_stock') {
                    $q->whereRaw('quantity <= reorder_point');
                } elseif ($status === 'out_of_stock') {
                    $q->where('quantity', '<=', 0);
                } elseif ($status === 'overstock') {
                    $q->where('quantity', '>', 100);
                } elseif ($status === 'healthy') {
                    $q->whereRaw('quantity > reorder_point');
                }
            });

        // Search
        $query->when($request->search, function ($q, $search) {
            $q->where(function ($sq) use ($search) {
                $sq->whereHas('product', function ($pq) use ($search) {
                    $pq->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('barcode', 'like', "%{$search}%");
                })
                ->orWhereHas('warehouse', function ($wq) use ($search) {
                    $wq->where('name', 'like', "%{$search}%");
                });
            });
        });

        // Sorting
        $sortField = $request->input('sort_by', 'updated_at');
        $sortOrder = $request->input('sort_order', 'desc');

        if (in_array($sortField, ['quantity', 'reserved_quantity', 'available_quantity', 'updated_at'])) {
            $query->orderBy($sortField, $sortOrder);
        } else {
            $query->orderBy('updated_at', 'desc');
        }

        $inventory = $query->paginate($request->integer('per_page', 10));
        $resourceCollection = InventoryResource::collection($inventory);

        return $this->paginatedResourceResponse($resourceCollection, $inventory);
    }

    /**
     * GET /api/v1/inventory/stats
     */
    public function stats(Request $request): JsonResponse
    {
        // 12 Stats Card Calculations
        $totalItems = Inventory::count();
        $totalQty = (float) Inventory::sum('quantity');
        $availableQty = (float) Inventory::sum('available_quantity');
        $reservedQty = (float) Inventory::sum('reserved_quantity');
        
        $lowStockCount = Inventory::whereRaw('quantity <= reorder_point')->count();
        $outOfStockCount = Inventory::where('quantity', '<=', 0)->count();
        $overstockCount = Inventory::where('quantity', '>', 100)->count();
        $warehouseCount = Warehouse::where('is_active', true)->count();

        // Calculate Cost & Value
        $inventoryCost = 0.0;
        $inventoryValue = 0.0;
        
        $allInventory = Inventory::with('product')->get();
        foreach ($allInventory as $inv) {
            $cost = $inv->product ? (float) $inv->product->cost_price : 0.0;
            $price = $inv->product ? (float) $inv->product->selling_price : 0.0;
            $inventoryCost += ($inv->quantity * $cost);
            $inventoryValue += ($inv->quantity * $price);
        }
        
        $profitPotential = $inventoryValue - $inventoryCost;
        $turnoverRate = 4.2; // Standard turnover index representation

        // Stock by Warehouse Group
        $byWarehouse = DB::table('inventories')
            ->join('warehouses', 'inventories.warehouse_id', '=', 'warehouses.id')
            ->select('warehouses.name', DB::raw('SUM(inventories.quantity) as total_qty'))
            ->groupBy('warehouses.name')
            ->get()
            ->map(fn($row) => [
                'name' => $row->name,
                'value' => (float) $row->total_qty
            ]);

        // Stock by Category Group
        $byCategory = DB::table('inventories')
            ->join('products', 'inventories.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('SUM(inventories.quantity) as total_qty'))
            ->groupBy('categories.name')
            ->get()
            ->map(fn($row) => [
                'name' => $row->name,
                'value' => (float) $row->total_qty
            ]);

        // Stock by Brand Group
        $byBrand = DB::table('inventories')
            ->join('products', 'inventories.product_id', '=', 'products.id')
            ->join('brands', 'products.brand_id', '=', 'brands.id')
            ->select('brands.name', DB::raw('SUM(inventories.quantity) as total_qty'))
            ->groupBy('brands.name')
            ->get()
            ->map(fn($row) => [
                'name' => $row->name,
                'value' => (float) $row->total_qty
            ]);

        // Time Series Mock Charts for Dashboard visual lines
        $monthlyMovement = [
            ['month' => 'Jan', 'in' => 540, 'out' => 480],
            ['month' => 'Feb', 'in' => 610, 'out' => 520],
            ['month' => 'Mar', 'in' => 750, 'out' => 680],
            ['month' => 'Apr', 'in' => 490, 'out' => 510],
            ['month' => 'May', 'in' => 820, 'out' => 700],
            ['month' => 'Jun', 'in' => 960, 'out' => 880]
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_items' => $totalItems,
                    'total_qty' => $totalQty,
                    'available_qty' => $availableQty,
                    'reserved_qty' => $reservedQty,
                    'low_stock' => $lowStockCount,
                    'out_of_stock' => $outOfStockCount,
                    'overstock' => $overstockCount,
                    'warehouses' => $warehouseCount,
                    'inventory_cost' => $inventoryCost,
                    'inventory_value' => $inventoryValue,
                    'profit_potential' => $profitPotential,
                    'turnover_rate' => $turnoverRate,
                ],
                'charts' => [
                    'by_warehouse' => $byWarehouse,
                    'by_category' => $byCategory,
                    'by_brand' => $byBrand,
                    'monthly_movement' => $monthlyMovement,
                ]
            ]
        ]);
    }

    /**
     * GET /api/v1/inventory/low-stock
     */
    public function lowStock(Request $request): JsonResponse
    {
        $lowStock = Inventory::with(['product', 'variant', 'warehouse'])
            ->lowStock()
            ->paginate($request->integer('per_page', 10));

        $resourceCollection = InventoryResource::collection($lowStock);
        return $this->paginatedResourceResponse($resourceCollection, $lowStock);
    }

    /**
     * GET /api/v1/inventory/export
     */
    public function export(Request $request)
    {
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=inventory_levels_" . date('Ymd_His') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function() {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Warehouse', 'Product Name', 'SKU', 'Barcode', 'Quantity', 'Reserved Quantity', 'Available Quantity', 'Reorder Point']);

            Inventory::with(['product', 'warehouse'])
                ->chunk(100, function($levels) use ($file) {
                    foreach ($levels as $lvl) {
                        fputcsv($file, [
                            $lvl->id,
                            $lvl->warehouse ? $lvl->warehouse->name : 'N/A',
                            $lvl->product ? $lvl->product->name : 'N/A',
                            $lvl->product ? $lvl->product->sku : 'N/A',
                            $lvl->product ? $lvl->product->barcode : 'N/A',
                            $lvl->quantity,
                            $lvl->reserved_quantity,
                            $lvl->available_quantity,
                            $lvl->reorder_point
                        ]);
                    }
                });
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * POST /api/v1/inventory/import
     */
    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();

        $rows = array_map('str_getcsv', file($path));
        $header = array_shift($rows);

        $imported = 0;
        foreach ($rows as $row) {
            if (count($row) < 9) continue;
            // Lookup product and warehouse to match IDs
            $warehouseName = $row[1];
            $sku = $row[3];
            $qty = (float) $row[5];
            $reorder = (float) $row[8];

            $prod = Product::where('sku', $sku)->first();
            $wh = Warehouse::where('name', $warehouseName)->first();

            if ($prod && $wh) {
                Inventory::updateOrCreate([
                    'warehouse_id' => $wh->id,
                    'product_id' => $prod->id,
                ], [
                    'company_id' => 1,
                    'quantity' => $qty,
                    'reorder_point' => $reorder,
                ]);
                $imported++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Successfully imported {$imported} inventory records."
        ]);
    }

    /**
     * GET /api/v1/inventory/{id}
     */
    public function show(int $id): JsonResponse
    {
        $item = Inventory::with(['product.category', 'product.brand', 'product.unit', 'variant', 'warehouse'])->findOrFail($id);
        return $this->successResponse(new InventoryResource($item));
    }
}
