<?php

namespace App\Infrastructure\Repositories\Purchase;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Purchase\PurchaseReturnItem;

class PurchaseReturnItemRepository extends BaseRepository
{
    public function __construct(PurchaseReturnItem $model)
    {
        parent::__construct($model);
    }
}
