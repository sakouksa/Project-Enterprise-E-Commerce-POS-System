<?php

namespace App\Infrastructure\Services\Product;

use App\Infrastructure\Repositories\Product\ProductVariantRepository;
use App\Models\Product\ProductVariant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ProductVariantService
{
    public function __construct(private readonly ProductVariantRepository $repository)
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

    public function getById(int|string $id, array $relations = []): ProductVariant
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function create(array $data): ProductVariant
    {
        return $this->repository->create($data);
    }

    public function update(int|string $id, array $data): ProductVariant
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return $this->repository->delete($id);
    }
}
