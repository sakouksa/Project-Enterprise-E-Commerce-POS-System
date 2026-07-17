<?php

namespace App\Infrastructure\Repositories\Expense;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Expense\Expense;

class ExpenseRepository extends BaseRepository
{
    public function __construct(Expense $model)
    {
        parent::__construct($model);
    }
}
