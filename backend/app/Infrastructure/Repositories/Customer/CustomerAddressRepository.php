<?php

namespace App\Infrastructure\Repositories\Customer;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Customer\CustomerAddress;

class CustomerAddressRepository extends BaseRepository
{
    public function __construct(CustomerAddress $model)
    {
        parent::__construct($model);
    }
}
