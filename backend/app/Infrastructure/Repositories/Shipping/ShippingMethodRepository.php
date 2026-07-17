<?php

namespace App\Infrastructure\Repositories\Shipping;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Shipping\ShippingMethod;

class ShippingMethodRepository extends BaseRepository
{
    public function __construct(ShippingMethod $model)
    {
        parent::__construct($model);
    }
}
