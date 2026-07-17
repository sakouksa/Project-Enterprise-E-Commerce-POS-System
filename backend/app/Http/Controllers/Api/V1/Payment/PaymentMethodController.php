<?php

namespace App\Http\Controllers\Api\V1\Payment;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Payment\PaymentMethod;
use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;

class PaymentMethodController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $methods = PaymentMethod::query()
            ->when($request->search, fn($q, $v) => $q->where('name', 'like', "%{$v}%")->orWhere('code', 'like', "%{$v}%"))
            ->paginate($request->integer('per_page', 20));

        return $this->paginatedResponse($methods);
    }
}
