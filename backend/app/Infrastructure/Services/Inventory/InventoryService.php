<?php

namespace App\Infrastructure\Services\Inventory;

use App\Infrastructure\Repositories\Inventory\InventoryRepository;
use App\Models\Inventory\Inventory;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class InventoryService
{
    public function __construct(private readonly InventoryRepository $repository)
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

    public function getById(int|string $id, array $relations = []): Inventory
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function create(array $data): Inventory
    {
        return $this->repository->create($data);
    }

    public function update(int|string $id, array $data): Inventory
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return $this->repository->delete($id);
    }
}
