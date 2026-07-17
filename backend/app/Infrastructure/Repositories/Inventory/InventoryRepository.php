<?php

namespace App\Infrastructure\Repositories\Inventory;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Inventory\Inventory;

class InventoryRepository extends BaseRepository
{
    public function __construct(Inventory $model)
    {
        parent::__construct($model);
    }
}
