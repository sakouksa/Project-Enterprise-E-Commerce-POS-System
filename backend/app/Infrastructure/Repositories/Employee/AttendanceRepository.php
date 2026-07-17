<?php

namespace App\Infrastructure\Repositories\Employee;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Employee\Attendance;

class AttendanceRepository extends BaseRepository
{
    public function __construct(Attendance $model)
    {
        parent::__construct($model);
    }
}
