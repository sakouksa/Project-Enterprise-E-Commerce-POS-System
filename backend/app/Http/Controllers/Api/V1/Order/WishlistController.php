<?php

namespace App\Http\Controllers\Api\V1\Order;

use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Http\JsonResponse;

class WishlistController extends BaseApiController
{
    public function index(): JsonResponse
    {
        return $this->successResponse([]);
    }

    public function add(): JsonResponse
    {
        return $this->successResponse(null, 'Item added to wishlist');
    }

    public function remove(): JsonResponse
    {
        return $this->successResponse(null, 'Item removed from wishlist');
    }
}
