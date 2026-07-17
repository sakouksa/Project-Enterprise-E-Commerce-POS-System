<?php

namespace App\Infrastructure\Repositories\Product;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Product\ProductPrice;

class ProductPriceRepository extends BaseRepository
{
    public function __construct(ProductPrice $model)
    {
        parent::__construct($model);
    }
}
