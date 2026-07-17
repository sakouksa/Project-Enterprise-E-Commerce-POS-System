<?php

namespace App\Http\Controllers\Api\V1\POS;

use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Http\JsonResponse;

class CashRegisterController extends BaseApiController
{
    public function index(): JsonResponse
    {
        return $this->successResponse([]);
    }
}
