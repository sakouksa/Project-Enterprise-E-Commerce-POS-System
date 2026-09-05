<?php

namespace App\Domain\Contracts\Repositories\Product;

use App\Domain\Contracts\Repositories\BaseRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface extends BaseRepositoryInterface
{
    public function paginateWithFilters(
        array $filters = [],
        int $perPage = 10,
        string $sort = 'created_at',
        string $order = 'desc'
    ): LengthAwarePaginator;
}
