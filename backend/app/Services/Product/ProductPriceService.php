<?php

namespace App\Services\Product;

use App\Repositories\Product\ProductPriceRepository;
use App\Models\Product\ProductPrice;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ProductPriceService
{
    public function __construct(private readonly ProductPriceRepository $repository)
    {
    }

    public function getAll(array $relations = []): Collection
    {
        return $this->repository->all(relations: $relations);
    }

    public function getPaginated(int $perPage = 15, array $relations = []): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage, relations: $relations);
    }

    public function getById(int|string $id, array $relations = []): ProductPrice
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function create(array $data): ProductPrice
    {
        return $this->repository->create($data);
    }

    public function update(int|string $id, array $data): ProductPrice
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return $this->repository->delete($id);
    }
}
