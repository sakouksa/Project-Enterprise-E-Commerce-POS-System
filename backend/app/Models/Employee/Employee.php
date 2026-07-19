<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\SoftDeletesEnterprise;

class Employee extends Model
{
    use HasFactory, SoftDeletes, SoftDeletesEnterprise;

    protected $fillable = ['company_id', 'branch_id', 'department_id', 'position_id', 'user_id', 'employee_number', 'name', 'email', 'phone', 'nik', 'gender', 'birth_date', 'address', 'photo', 'join_date', 'resign_date', 'status', 'basic_salary'];

    protected $casts = [
        'birth_date' => 'date',
        'join_date' => 'date',
        'resign_date' => 'date',
        'basic_salary' => 'decimal:2'
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Company\Company::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Company\Branch::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Employee\Department::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Employee\Position::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function attendances(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Models\Employee\Attendance::class);
    }

    public function attendance(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Models\Employee\Attendance::class);
    }

    public function payrolls(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Models\Employee\Payroll::class);
    }
}
