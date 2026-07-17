<?php

namespace App\Infrastructure\Repositories\Purchase;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Purchase\Purchase;

class PurchaseRepository extends BaseRepository
{
    public function __construct(Purchase $model)
    {
        parent::__construct($model);
    }
}
