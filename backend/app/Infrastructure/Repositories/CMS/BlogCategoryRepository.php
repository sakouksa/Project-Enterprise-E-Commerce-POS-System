<?php

namespace App\Infrastructure\Repositories\CMS;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\CMS\BlogCategory;

class BlogCategoryRepository extends BaseRepository
{
    public function __construct(BlogCategory $model)
    {
        parent::__construct($model);
    }
}
