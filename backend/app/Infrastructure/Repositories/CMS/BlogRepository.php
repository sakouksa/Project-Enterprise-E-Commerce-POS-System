<?php

namespace App\Infrastructure\Repositories\CMS;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\CMS\Blog;

class BlogRepository extends BaseRepository
{
    public function __construct(Blog $model)
    {
        parent::__construct($model);
    }
}
