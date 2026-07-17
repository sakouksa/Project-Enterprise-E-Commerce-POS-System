<?php

namespace App\Infrastructure\Services\Expense;

use App\Infrastructure\Repositories\Expense\ExpenseCategoryRepository;
use App\Models\Expense\ExpenseCategory;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ExpenseCategoryService
{
    public function __construct(private readonly ExpenseCategoryRepository $repository)
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

    public function getById(int|string $id, array $relations = []): ExpenseCategory
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function create(array $data): ExpenseCategory
    {
        return $this->repository->create($data);
    }

    public function update(int|string $id, array $data): ExpenseCategory
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return $this->repository->delete($id);
    }
}
