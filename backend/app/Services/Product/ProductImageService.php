<?php

namespace App\Services\Product;

use App\Repositories\Product\ProductImageRepository;
use App\Models\Product\ProductImage;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ProductImageService
{
    public function __construct(private readonly ProductImageRepository $repository)
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

    public function getById(int|string $id, array $relations = []): ProductImage
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function create(array $data): ProductImage
    {
        return $this->repository->create($data);
    }

    public function update(int|string $id, array $data): ProductImage
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return $this->repository->delete($id);
    }
}
