<?php

namespace App\Infrastructure\Repositories\Product;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Product\Unit;

class UnitRepository extends BaseRepository
{
    public function __construct(Unit $model)
    {
        parent::__construct($model);
    }
}
