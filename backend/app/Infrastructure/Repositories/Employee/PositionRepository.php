<?php

namespace App\Infrastructure\Repositories\Employee;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Employee\Position;

class PositionRepository extends BaseRepository
{
    public function __construct(Position $model)
    {
        parent::__construct($model);
    }
}
