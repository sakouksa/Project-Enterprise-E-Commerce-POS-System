<?php

namespace App\Infrastructure\Repositories\CMS;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\CMS\Page;

class PageRepository extends BaseRepository
{
    public function __construct(Page $model)
    {
        parent::__construct($model);
    }
}
