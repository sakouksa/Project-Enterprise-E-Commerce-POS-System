<?php

namespace App\Infrastructure\Repositories\Employee;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Employee\Payroll;

class PayrollRepository extends BaseRepository
{
    public function __construct(Payroll $model)
    {
        parent::__construct($model);
    }
}
