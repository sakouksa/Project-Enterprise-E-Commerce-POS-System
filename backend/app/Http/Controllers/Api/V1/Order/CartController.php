<?php

namespace App\Http\Controllers\Api\V1\Order;

use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Http\JsonResponse;

class CartController extends BaseApiController
{
    public function show(): JsonResponse
    {
        return $this->successResponse(['items' => []]);
    }

    public function add(): JsonResponse
    {
        return $this->successResponse(null, 'Item added to cart');
    }

    public function update(): JsonResponse
    {
        return $this->successResponse(null, 'Cart updated');
    }

    public function remove(): JsonResponse
    {
        return $this->successResponse(null, 'Item removed from cart');
    }

    public function checkout(): JsonResponse
    {
        return $this->successResponse(null, 'Checkout successful');
    }
}
