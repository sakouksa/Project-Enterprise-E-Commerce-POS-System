<?php

namespace App\Infrastructure\Services\Expense;

use App\Infrastructure\Repositories\Expense\ExpenseRepository;
use App\Models\Expense\Expense;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ExpenseService
{
    public function __construct(private readonly ExpenseRepository $repository)
    {
    }

    public function getAll(array $relations = []): Collection
    {
        return $this->repository->all(relations: $relations);
    }

    public function getPaginated(int $perPage = 15, array $filters = [], array $relations = []): LengthAwarePaginator
    {
        $query = $this->repository->getModel()->newQuery()->with($relations);

        if (isset($filters['status']) && $filters['status'] === 'deleted') {
            $query->onlyTrashed();
        } elseif (isset($filters['status']) && $filters['status'] !== 'deleted') {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%")
                  ->orWhere('reference_number', 'like', "%{$filters['search']}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function getById(int|string $id, array $relations = []): Expense
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function create(array $data): Expense
    {
        return $this->repository->create($data);
    }

    public function update(int|string $id, array $data): Expense
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return $this->repository->delete($id);
    }

    public function restore(int|string $id): bool
    {
        return $this->repository->restore($id);
    }

    public function forceDelete(int|string $id): bool
    {
        $expense = $this->repository->getModel()->withTrashed()->findOrFail($id);
        
        // Clean physical receipt file if exists
        if ($expense->receipt && \Illuminate\Support\Facades\Storage::disk('public')->exists($expense->receipt)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($expense->receipt);
        }

        return $this->repository->forceDelete($id);
    }
}
