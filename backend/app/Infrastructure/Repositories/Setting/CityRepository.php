<?php

namespace App\Infrastructure\Repositories\Setting;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Setting\City;

class CityRepository extends BaseRepository
{
    public function __construct(City $model)
    {
        parent::__construct($model);
    }
}
