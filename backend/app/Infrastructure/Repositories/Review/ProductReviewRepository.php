<?php

namespace App\Infrastructure\Repositories\Review;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Review\ProductReview;

class ProductReviewRepository extends BaseRepository
{
    public function __construct(ProductReview $model)
    {
        parent::__construct($model);
    }
}
