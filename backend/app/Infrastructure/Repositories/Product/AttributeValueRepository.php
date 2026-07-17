<?php

namespace App\Infrastructure\Repositories\Product;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Product\AttributeValue;

class AttributeValueRepository extends BaseRepository
{
    public function __construct(AttributeValue $model)
    {
        parent::__construct($model);
    }
}
