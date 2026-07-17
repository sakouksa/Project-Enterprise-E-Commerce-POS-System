<?php

namespace App\Infrastructure\Repositories\Shipping;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Shipping\ShippingRate;

class ShippingRateRepository extends BaseRepository
{
    public function __construct(ShippingRate $model)
    {
        parent::__construct($model);
    }
}
