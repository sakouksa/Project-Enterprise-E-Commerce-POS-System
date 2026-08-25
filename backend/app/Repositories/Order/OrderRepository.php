<?php

namespace App\Repositories\Order;

use App\Repositories\BaseRepository;
use App\Models\Order\Order;

use App\Domain\Contracts\Repositories\Order\OrderRepositoryInterface;

class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{
    public function __construct(Order $model)
    {
        parent::__construct($model);
    }
}
