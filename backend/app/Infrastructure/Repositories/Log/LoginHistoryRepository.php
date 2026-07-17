<?php

namespace App\Infrastructure\Repositories\Log;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Log\LoginHistory;

class LoginHistoryRepository extends BaseRepository
{
    public function __construct(LoginHistory $model)
    {
        parent::__construct($model);
    }
}
