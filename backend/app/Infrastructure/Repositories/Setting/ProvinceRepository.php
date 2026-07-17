<?php

namespace App\Infrastructure\Repositories\Setting;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Setting\Province;

class ProvinceRepository extends BaseRepository
{
    public function __construct(Province $model)
    {
        parent::__construct($model);
    }
}
