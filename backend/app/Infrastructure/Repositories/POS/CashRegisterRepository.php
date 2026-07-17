<?php

namespace App\Infrastructure\Repositories\POS;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\POS\CashRegister;

class CashRegisterRepository extends BaseRepository
{
    public function __construct(CashRegister $model)
    {
        parent::__construct($model);
    }
}
