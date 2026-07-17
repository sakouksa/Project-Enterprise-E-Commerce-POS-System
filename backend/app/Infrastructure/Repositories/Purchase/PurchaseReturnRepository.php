<?php

namespace App\Infrastructure\Repositories\Purchase;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Purchase\PurchaseReturn;

class PurchaseReturnRepository extends BaseRepository
{
    public function __construct(PurchaseReturn $model)
    {
        parent::__construct($model);
    }
}
