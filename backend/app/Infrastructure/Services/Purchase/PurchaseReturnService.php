<?php

namespace App\Infrastructure\Services\Purchase;

use App\Infrastructure\Repositories\Purchase\PurchaseReturnRepository;
use App\Models\Purchase\PurchaseReturn;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PurchaseReturnService
{
    public function __construct(private readonly PurchaseReturnRepository $repository)
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

    public function getById(int|string $id, array $relations = []): PurchaseReturn
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function create(array $data): PurchaseReturn
    {
        return $this->repository->create($data);
    }

    public function update(int|string $id, array $data): PurchaseReturn
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return $this->repository->delete($id);
    }
}
