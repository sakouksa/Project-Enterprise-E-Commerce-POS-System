<?php

namespace App\Repositories\Employee;

use App\Repositories\BaseRepository;
use App\Models\Employee\LeaveRequest;
use App\Models\Employee\LeaveBalance;
use Illuminate\Pagination\LengthAwarePaginator;

class LeaveRequestRepository extends BaseRepository
{
    public function __construct(LeaveRequest $model)
    {
        parent::__construct($model);
    }

    public function paginateWithFilters(
        array $filters = [],
        int $perPage = 10,
        string $sort = 'created_at',
        string $order = 'desc'
    ): LengthAwarePaginator {
        $query = $this->model
            ->with([
                'employee:id,name,employee_number,photo,department_id,position_id',
                'employee.department:id,name',
                'employee.position:id,name',
                'approver:id,name',
                'company:id,name',
                'branch:id,name',
            ])
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->where(function ($sq) use ($search) {
                    $sq->where('reason', 'like', "%{$search}%")
                       ->orWhere('leave_type', 'like', "%{$search}%")
                       ->orWhereHas('employee', function ($eq) use ($search) {
                           $eq->where('name', 'like', "%{$search}%")
                              ->orWhere('employee_number', 'like', "%{$search}%");
                       });
                });
            })
            ->when($filters['company_id'] ?? null, fn($q, $v) => $q->where('company_id', $v))
            ->when($filters['branch_id'] ?? null, fn($q, $v) => $q->where('branch_id', $v))
            ->when($filters['employee_id'] ?? null, fn($q, $v) => $q->where('employee_id', $v))
            ->when($filters['leave_type'] ?? null, fn($q, $v) => $q->where('leave_type', $v))
            ->when($filters['status'] ?? null, fn($q, $v) => $q->where('status', $v))
            ->when($filters['start_date'] ?? null, fn($q, $v) => $q->where('start_date', '>=', $v))
            ->when($filters['end_date'] ?? null, fn($q, $v) => $q->where('end_date', '<=', $v));

        return $query->orderBy($sort, $order === 'asc' ? 'asc' : 'desc')
                     ->paginate($perPage);
    }

    public function getBalance(int $employeeId, int $year): LeaveBalance
    {
        return LeaveBalance::firstOrCreate(
            ['employee_id' => $employeeId, 'year' => $year],
            [
                'company_id'            => \App\Models\Employee\Employee::where('id', $employeeId)->value('company_id') ?? 1,
                'annual_leave_total'    => 18.0,
                'annual_leave_used'     => 0.0,
                'sick_leave_total'      => 15.0,
                'sick_leave_used'       => 0.0,
                'special_leave_total'   => 7.0,
                'special_leave_used'    => 0.0,
                'maternity_leave_total' => 90.0,
                'maternity_leave_used'  => 0.0,
            ]
        );
    }
}
