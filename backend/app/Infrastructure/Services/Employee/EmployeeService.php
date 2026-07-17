<?php

namespace App\Infrastructure\Services\Employee;

use App\Infrastructure\Repositories\Employee\EmployeeRepository;
use App\Models\Employee\Employee;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EmployeeService
{
    public function __construct(private readonly EmployeeRepository $repository)
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

    public function getById(int|string $id, array $relations = []): Employee
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function create(array $data): Employee
    {
        return $this->repository->create($data);
    }

    public function update(int|string $id, array $data): Employee
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return $this->repository->delete($id);
    }
}
