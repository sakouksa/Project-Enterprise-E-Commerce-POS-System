<?php

namespace App\Services\Employee;

use App\Repositories\Employee\PayrollRepository;
use App\Models\Employee\Payroll;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PayrollService
{
    public function __construct(private readonly PayrollRepository $repository)
    {
    }

    public function getAll(array $relations = []): Collection
    {
        return $this->repository->all(relations: $relations);
    }

    public function getPaginated(int $perPage = 15, array $filters = [], string $sort = 'period_month', string $order = 'desc'): LengthAwarePaginator
    {
        return $this->repository->paginateWithFilters($filters, $perPage, $sort, $order);
    }

    public function getById(int|string $id, array $relations = []): Payroll
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function create(array $data): Payroll
    {
        return $this->repository->create($data);
    }

    public function update(int|string $id, array $data): Payroll
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return $this->repository->delete($id);
    }

    public function bulkDelete(array $ids): int
    {
        return $this->repository->bulkDelete($ids);
    }
}
