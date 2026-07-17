<?php

namespace App\Http\Controllers\Api\V1\Sales;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Sales\Sale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SaleController extends BaseApiController
{
    /**
     * GET /api/v1/sales
     */
    public function index(Request $request): JsonResponse
    {
        $sales = Sale::with(['customer', 'cashier'])
            ->when($request->search, fn($q, $v) => $q->where('invoice_number', 'like', "%{$v}%"))
            ->when($request->status, fn($q, $v) => $q->where('status', $v))
            ->when($request->date_from, fn($q, $v) => $q->whereDate('date', '>=', $v))
            ->when($request->date_to, fn($q, $v) => $q->whereDate('date', '<=', $v))
            ->paginate($request->integer('per_page', 10));

        return $this->paginatedResponse($sales);
    }

    /**
     * GET /api/v1/sales/{id}
     */
    public function show(int $id): JsonResponse
    {
        $sale = Sale::with(['customer', 'cashier', 'items.product'])->findOrFail($id);
        return $this->successResponse($sale);
    }
}
