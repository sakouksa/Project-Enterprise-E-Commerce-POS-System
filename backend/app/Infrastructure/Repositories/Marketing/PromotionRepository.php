<?php

namespace App\Infrastructure\Repositories\Marketing;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Marketing\Promotion;

class PromotionRepository extends BaseRepository
{
    public function __construct(Promotion $model)
    {
        parent::__construct($model);
    }
}
