<?php

namespace App\Infrastructure\Repositories\Payment;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Payment\Transaction;

class TransactionRepository extends BaseRepository
{
    public function __construct(Transaction $model)
    {
        parent::__construct($model);
    }
}
