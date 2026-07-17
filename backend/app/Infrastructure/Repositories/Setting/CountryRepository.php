<?php

namespace App\Infrastructure\Repositories\Setting;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Setting\Country;

class CountryRepository extends BaseRepository
{
    public function __construct(Country $model)
    {
        parent::__construct($model);
    }
}
