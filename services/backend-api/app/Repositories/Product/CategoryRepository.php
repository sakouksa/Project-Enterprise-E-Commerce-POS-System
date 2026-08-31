<?php

namespace App\Repositories\Product;

use App\Repositories\BaseRepository;
use App\Models\Product\Category;

use App\Domain\Contracts\Repositories\Product\CategoryRepositoryInterface;

class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }
}
