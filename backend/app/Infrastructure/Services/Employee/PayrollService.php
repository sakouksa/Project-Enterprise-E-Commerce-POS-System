<?php

namespace App\Infrastructure\Services\Employee;

use App\Infrastructure\Repositories\Employee\PayrollRepository;
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

    public function getPaginated(int $perPage = 15, array $relations = []): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage, relations: $relations);
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
}
