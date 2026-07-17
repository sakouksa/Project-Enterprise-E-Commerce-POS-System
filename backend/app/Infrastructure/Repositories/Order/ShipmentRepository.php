<?php

namespace App\Infrastructure\Repositories\Order;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Order\Shipment;

class ShipmentRepository extends BaseRepository
{
    public function __construct(Shipment $model)
    {
        parent::__construct($model);
    }
}
