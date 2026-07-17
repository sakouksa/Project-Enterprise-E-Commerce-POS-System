<?php

namespace App\Infrastructure\Services\Employee;

use App\Infrastructure\Repositories\Employee\AttendanceRepository;
use App\Models\Employee\Attendance;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class AttendanceService
{
    public function __construct(private readonly AttendanceRepository $repository)
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

    public function getById(int|string $id, array $relations = []): Attendance
    {
        return $this->repository->findById($id, relations: $relations);
    }

    public function create(array $data): Attendance
    {
        return $this->repository->create($data);
    }

    public function update(int|string $id, array $data): Attendance
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int|string $id): bool
    {
        return $this->repository->delete($id);
    }
}
