<?php

namespace App\Infrastructure\Repositories\Notification;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Notification\NotificationLog;

class NotificationLogRepository extends BaseRepository
{
    public function __construct(NotificationLog $model)
    {
        parent::__construct($model);
    }
}
