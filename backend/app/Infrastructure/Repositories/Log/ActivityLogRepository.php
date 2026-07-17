<?php

namespace App\Infrastructure\Repositories\Log;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Log\ActivityLog;

class ActivityLogRepository extends BaseRepository
{
    public function __construct(ActivityLog $model)
    {
        parent::__construct($model);
    }
}
