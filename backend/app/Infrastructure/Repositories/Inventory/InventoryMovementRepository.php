<?php

namespace App\Infrastructure\Repositories\Inventory;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Inventory\InventoryMovement;

class InventoryMovementRepository extends BaseRepository
{
    public function __construct(InventoryMovement $model)
    {
        parent::__construct($model);
    }
}
