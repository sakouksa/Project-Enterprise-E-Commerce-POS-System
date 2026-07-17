<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Inventory\StockOpname;
use App\Models\Inventory\StockOpnameItem;
use App\Models\Inventory\Inventory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class StockOpnameController extends BaseApiController
{
    /**
     * GET /api/v1/stock-opnames
     */
    public function index(Request $request): JsonResponse
    {
        $opnames = StockOpname::with(['warehouse', 'user', 'items.product', 'items.variant'])
            ->when($request->search, function ($q, $search) {
                $q->where('reference_number', 'like', "%{$search}%");
            })
            ->paginate($request->integer('per_page', 15));

        return $this->paginatedResponse($opnames);
    }

    /**
     * POST /api/v1/stock-opnames
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'notes'        => 'nullable|string',
        ]);

        $refNumber = 'OPN-' . date('Ymd') . '-' . mt_rand(1000, 9999);

        $opname = DB::transaction(function () use ($validated, $refNumber) {
            $op = StockOpname::create([
                'company_id'       => 1,
                'warehouse_id'     => $validated['warehouse_id'],
                'user_id'          => Auth::id() ?? 1,
                'reference_number' => $refNumber,
                'date'             => date('Y-m-d'),
                'notes'            => $validated['notes'] ?? '',
                'status'           => 'done', // Auto-complete for seamless integration
                'completed_at'     => now(),
            ]);

            // Snap current system quantities from inventories table
            $inventories = Inventory::where('warehouse_id', $validated['warehouse_id'])->get();

            foreach ($inventories as $inv) {
                StockOpnameItem::create([
                    'stock_opname_id'    => $op->id,
                    'product_id'         => $inv->product_id,
                    'product_variant_id' => $inv->product_variant_id,
                    'system_quantity'    => $inv->quantity,
                    'physical_quantity'  => $inv->quantity,
                    'difference'         => 0,
                    'notes'              => 'Auto-matched physical stock count',
                ]);
            }

            return $op;
        });

        return $this->successResponse($opname, 'Stock opname recorded successfully', 201);
    }
}
