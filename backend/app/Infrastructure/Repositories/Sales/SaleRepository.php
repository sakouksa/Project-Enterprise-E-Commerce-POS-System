<?php

namespace App\Infrastructure\Repositories\Sales;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Sales\Sale;

class SaleRepository extends BaseRepository
{
    public function __construct(Sale $model)
    {
        parent::__construct($model);
    }
}
