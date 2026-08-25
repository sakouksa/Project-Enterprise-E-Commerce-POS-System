<?php

namespace App\Services\Inventory;

use App\Domain\Inventory\Services\InventoryService as DomainInventoryService;
use App\Repositories\Inventory\InventoryRepository;
use App\Models\Inventory\Inventory;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class InventoryService extends DomainInventoryService
{
    public function __construct(private readonly ?InventoryRepository $repository = null)
    {
    }

    // ─── Query & CRUD Methods ──────────────────────────────────────────────────

    public function getAll(array $relations = []): Collection
    {
        return $this->repository ? $this->repository->all(relations: $relations) : Inventory::with($relations)->get();
    }

    public function getPaginated(int $perPage = 15, array $relations = []): LengthAwarePaginator
    {
        return $this->repository ? $this->repository->paginate($perPage, relations: $relations) : Inventory::with($relations)->paginate($perPage);
    }

    public function getById(int|string $id, array $relations = []): Inventory
    {
        return $this->repository ? $this->repository->findById($id, relations: $relations) : Inventory::with($relations)->findOrFail($id);
    }

    public function create(array $data): Inventory
    {
        return $this->repository ? $this->repository->create($data) : Inventory::create($data);
    }

    public function update(int|string $id, array $data): Inventory
    {
        return $this->repository ? $this->repository->update($id, $data) : tap(Inventory::findOrFail($id), fn($inv) => $inv->update($data));
    }

    public function delete(int|string $id): bool
    {
        return $this->repository ? $this->repository->delete($id) : (bool) Inventory::findOrFail($id)->delete();
    }
}
