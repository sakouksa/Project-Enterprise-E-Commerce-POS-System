<?php

namespace App\Infrastructure\Repositories\POS;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\POS\CashRegisterTransaction;

class CashRegisterTransactionRepository extends BaseRepository
{
    public function __construct(CashRegisterTransaction $model)
    {
        parent::__construct($model);
    }
}
