<?php

namespace App\Infrastructure\Repositories\Product;

use App\Domain\Contracts\Repositories\BaseRepositoryInterface;
use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Product\Product;
use Illuminate\Pagination\LengthAwarePaginator;

use App\Domain\Contracts\Repositories\Product\ProductRepositoryInterface;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    public function paginateWithFilters(
        array $filters = [],
        int $perPage = 10,
        string $sort = 'created_at',
        string $order = 'desc'
    ): LengthAwarePaginator {
        $query = $this->model
            ->with(['category:id,name', 'brand:id,name', 'primaryImage', 'unit:id,name,symbol', 'inventories'])
            ->when($filters['search'] ?? null, fn($q, $v) => $q->search($v))
            ->when($filters['category_id'] ?? null, fn($q, $v) => $q->where('category_id', $v))
            ->when($filters['brand_id'] ?? null, fn($q, $v) => $q->where('brand_id', $v))
            ->when($filters['status'] ?? null, fn($q, $v) => $v === 'deleted' ? $q->onlyTrashed() : $q->where('status', $v))
            ->when($filters['is_featured'] ?? null, fn($q, $v) => $q->where('is_featured', (bool) $v))
            ->when($filters['company_id'] ?? null, fn($q, $v) => $q->where('company_id', $v));

        $allowedSorts = ['name', 'selling_price', 'created_at', 'sold_count', 'rating_avg'];
        $sort = in_array($sort, $allowedSorts) ? $sort : 'created_at';

        return $query->orderBy($sort, $order === 'asc' ? 'asc' : 'desc')
                     ->paginate($perPage);
    }
}
