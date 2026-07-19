<?php

namespace App\Infrastructure\Repositories\Employee;

use App\Infrastructure\Repositories\BaseRepository;
use App\Models\Employee\Attendance;

class AttendanceRepository extends BaseRepository
{
    public function __construct(Attendance $model)
    {
        parent::__construct($model);
    }

    public function paginateWithFilters(
        array $filters = [],
        int $perPage = 10,
        string $sort = 'date',
        string $order = 'desc'
    ): \Illuminate\Pagination\LengthAwarePaginator {
        $query = $this->model
            ->with(['employee:id,name,employee_number,photo'])
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->whereHas('employee', function ($sq) use ($search) {
                    $sq->where('name', 'like', "%{$search}%")
                       ->orWhere('employee_number', 'like', "%{$search}%");
                });
            })
            ->when($filters['employee_id'] ?? null, fn($q, $v) => $q->where('employee_id', $v))
            ->when($filters['date'] ?? null, fn($q, $v) => $q->where('date', $v))
            ->when($filters['date_start'] ?? null, fn($q, $v) => $q->where('date', '>=', $v))
            ->when($filters['date_end'] ?? null, fn($q, $v) => $q->where('date', '<=', $v))
            ->when($filters['status'] ?? null, fn($q, $v) => $q->where('status', $v));

        $allowedSorts = ['date', 'check_in', 'check_out', 'status', 'created_at'];
        $sort = in_array($sort, $allowedSorts) ? $sort : 'date';

        return $query->orderBy($sort, $order === 'asc' ? 'asc' : 'desc')
                     ->paginate($perPage);
    }
}
