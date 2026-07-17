<?php

namespace App\Infrastructure\Repositories\Setting;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Setting\Language;

class LanguageRepository extends BaseRepository
{
    public function __construct(Language $model)
    {
        parent::__construct($model);
    }
}
