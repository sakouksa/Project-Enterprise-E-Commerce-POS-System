<?php

namespace App\Infrastructure\Repositories\Log;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Log\AuditLog;

class AuditLogRepository extends BaseRepository
{
    public function __construct(AuditLog $model)
    {
        parent::__construct($model);
    }
}
