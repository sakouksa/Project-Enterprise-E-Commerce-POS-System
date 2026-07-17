<?php

namespace App\Infrastructure\Repositories\Customer;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Customer\Customer;

class CustomerRepository extends BaseRepository
{
    public function __construct(Customer $model)
    {
        parent::__construct($model);
    }
}
