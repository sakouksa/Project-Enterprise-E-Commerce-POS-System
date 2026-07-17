<?php

namespace App\Infrastructure\Repositories\Inventory;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Inventory\StockTransferItem;

class StockTransferItemRepository extends BaseRepository
{
    public function __construct(StockTransferItem $model)
    {
        parent::__construct($model);
    }
}
