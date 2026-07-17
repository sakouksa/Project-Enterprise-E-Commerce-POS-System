<?php

namespace App\Infrastructure\Repositories\Order;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Order\CartItem;

class CartItemRepository extends BaseRepository
{
    public function __construct(CartItem $model)
    {
        parent::__construct($model);
    }
}
