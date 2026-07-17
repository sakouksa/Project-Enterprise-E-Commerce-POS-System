<?php

namespace App\Infrastructure\Repositories\Sales;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Sales\SaleReturn;

class SaleReturnRepository extends BaseRepository
{
    public function __construct(SaleReturn $model)
    {
        parent::__construct($model);
    }
}
