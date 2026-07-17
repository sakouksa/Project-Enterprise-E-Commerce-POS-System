<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payroll extends Model
{
    use HasFactory;

    protected $fillable = ['employee_id', 'period_month', 'working_days', 'present_days', 'basic_salary', 'allowances', 'deductions', 'overtime_pay', 'net_salary', 'status', 'paid_at', 'notes'];

    protected $casts = [
        'basic_salary' => 'decimal:2',
        'allowances' => 'decimal:2',
        'deductions' => 'decimal:2',
        'overtime_pay' => 'decimal:2',
        'net_salary' => 'decimal:2',
        'paid_at' => 'date'
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Employee\Employee::class);
    }
}
