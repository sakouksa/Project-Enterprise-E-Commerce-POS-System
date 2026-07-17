<?php

namespace App\Infrastructure\Repositories\Order;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Order\OrderItem;

class OrderItemRepository extends BaseRepository
{
    public function __construct(OrderItem $model)
    {
        parent::__construct($model);
    }
}
