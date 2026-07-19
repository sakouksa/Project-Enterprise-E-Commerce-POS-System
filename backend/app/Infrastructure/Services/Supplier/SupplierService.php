<?php

namespace App\Infrastructure\Services\Supplier;

use App\Infrastructure\Repositories\Supplier\SupplierRepository;
use App\Models\Supplier\Supplier;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class SupplierService
{
    public function __construct(private readonly SupplierRepository $repository)
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

    public function getById(int|string $id, array $relations = []): Supplier
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function create(array $data): Supplier
    {
        return $this->repository->create($data);
    }

    public function update(int|string $id, array $data): Supplier
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return $this->repository->delete($id);
    }
}
