<?php

namespace App\Infrastructure\Repositories\Sales;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Sales\SaleItem;

class SaleItemRepository extends BaseRepository
{
    public function __construct(SaleItem $model)
    {
        parent::__construct($model);
    }
}
