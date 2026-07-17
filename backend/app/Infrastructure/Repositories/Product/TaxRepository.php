<?php

namespace App\Infrastructure\Repositories\Product;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Product\Tax;

class TaxRepository extends BaseRepository
{
    public function __construct(Tax $model)
    {
        parent::__construct($model);
    }
}
