<?php

namespace App\Infrastructure\Repositories\Inventory;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Inventory\StockAdjustmentItem;

class StockAdjustmentItemRepository extends BaseRepository
{
    public function __construct(StockAdjustmentItem $model)
    {
        parent::__construct($model);
    }
}
