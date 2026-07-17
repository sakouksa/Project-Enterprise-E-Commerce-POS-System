<?php

namespace App\Http\Controllers\Api\V1\Purchase;

use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Http\JsonResponse;

use App\Models\Purchase\PurchaseReturn;
use App\Http\Resources\Purchase\PurchaseReturnResource;
use Illuminate\Http\Request;

class PurchaseReturnController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $returns = PurchaseReturn::with(['purchase', 'user'])
            ->when($request->search, function ($q, $search) {
                $q->where('return_number', 'like', "%{$search}%")
                  ->orWhere('reason', 'like', "%{$search}%");
            })
            ->when($request->status, fn($q, $v) => $q->where('status', $v))
            ->orderBy('id', 'desc')
            ->paginate($request->integer('per_page', 20));

        return $this->successResponse(PurchaseReturnResource::collection($returns));
    }
}
