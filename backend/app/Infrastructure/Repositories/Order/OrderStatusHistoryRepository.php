<?php

namespace App\Infrastructure\Repositories\Order;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Order\OrderStatusHistory;

class OrderStatusHistoryRepository extends BaseRepository
{
    public function __construct(OrderStatusHistory $model)
    {
        parent::__construct($model);
    }
}
