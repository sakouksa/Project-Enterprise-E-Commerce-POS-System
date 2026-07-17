<?php

namespace App\Infrastructure\Repositories\Expense;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Expense\ExpenseCategory;

class ExpenseCategoryRepository extends BaseRepository
{
    public function __construct(ExpenseCategory $model)
    {
        parent::__construct($model);
    }
}
