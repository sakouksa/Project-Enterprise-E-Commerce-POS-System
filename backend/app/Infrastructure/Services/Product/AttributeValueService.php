<?php

namespace App\Infrastructure\Services\Product;

use App\Infrastructure\Repositories\Product\AttributeValueRepository;
use App\Models\Product\AttributeValue;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class AttributeValueService
{
    public function __construct(private readonly AttributeValueRepository $repository)
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

    public function getById(int|string $id, array $relations = []): AttributeValue
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function create(array $data): AttributeValue
    {
        return $this->repository->create($data);
    }

    public function update(int|string $id, array $data): AttributeValue
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return $this->repository->delete($id);
    }
}
