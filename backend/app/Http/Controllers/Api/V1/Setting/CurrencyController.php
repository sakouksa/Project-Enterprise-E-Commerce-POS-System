<?php

namespace App\Http\Controllers\Api\V1\Setting;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Setting\Currency;
use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;

class CurrencyController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $currencies = Currency::query()
            ->when($request->search, fn($q, $v) => $q->where('name', 'like', "%{$v}%")->orWhere('code', 'like', "%{$v}%"))
            ->paginate($request->integer('per_page', 20));

        return $this->paginatedResponse($currencies);
    }
}
