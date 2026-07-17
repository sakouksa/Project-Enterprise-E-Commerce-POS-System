<?php

namespace App\Infrastructure\Repositories\Product;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Product\ProductVariantValue;

class ProductVariantValueRepository extends BaseRepository
{
    public function __construct(ProductVariantValue $model)
    {
        parent::__construct($model);
    }
}
