<?php

namespace App\Infrastructure\Repositories\Supplier;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Supplier\SupplierContact;

class SupplierContactRepository extends BaseRepository
{
    public function __construct(SupplierContact $model)
    {
        parent::__construct($model);
    }
}
