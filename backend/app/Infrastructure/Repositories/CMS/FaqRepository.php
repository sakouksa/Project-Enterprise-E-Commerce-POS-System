<?php

namespace App\Infrastructure\Repositories\CMS;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\CMS\Faq;

class FaqRepository extends BaseRepository
{
    public function __construct(Faq $model)
    {
        parent::__construct($model);
    }
}
