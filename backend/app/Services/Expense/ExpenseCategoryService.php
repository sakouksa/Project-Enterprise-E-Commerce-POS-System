<?php

namespace App\Services\Expense;

use App\Repositories\Expense\ExpenseCategoryRepository;
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

    public function getPaginated(int $perPage = 15, array $filters = [], array $relations = []): LengthAwarePaginator
    {
        $query = $this->repository->getModel()->newQuery()
            ->with($relations)
            ->withCount('expenses')
            ->withSum('expenses as total_expense_amount', 'amount');

        // Search Filter (name or code)
        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        // Status Filter
        if (isset($filters['status']) && $filters['status'] !== 'all' && $filters['status'] !== '') {
            if ($filters['status'] === 'active' || $filters['status'] === '1' || $filters['status'] === 1 || $filters['status'] === true) {
                $query->where('is_active', true);
            } elseif ($filters['status'] === 'inactive' || $filters['status'] === '0' || $filters['status'] === 0 || $filters['status'] === false) {
                $query->where('is_active', false);
            }
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'id';
        $sortOrder = strtolower($filters['sort_order'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        if (in_array($sortBy, ['id', 'name', 'code', 'is_active', 'created_at', 'expenses_count', 'total_expense_amount'])) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('id', 'desc');
        }

        return $query->paginate($perPage);
    }

    public function getById(int|string $id, array $relations = []): ExpenseCategory
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function create(array $data): ExpenseCategory
    {
        if (empty($data['code']) && !empty($data['name'])) {
            $data['code'] = 'EXP-' . strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $data['name']), 0, 3));
        }
        if (!isset($data['company_id'])) {
            $data['company_id'] = 1;
        }
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

    public function bulkDelete(array $ids): int
    {
        return $this->repository->getModel()->whereIn('id', $ids)->delete();
    }
}
