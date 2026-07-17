<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class CreatePayrollRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => ['integer', 'exists:employees,id'],
            'period_month' => ['string'],
            'working_days' => ['integer'],
            'present_days' => ['integer'],
            'basic_salary' => ['numeric'],
            'allowances' => ['numeric'],
            'deductions' => ['numeric'],
            'overtime_pay' => ['numeric'],
            'net_salary' => ['numeric'],
            'status' => ['string'],
            'paid_at' => ['string'],
            'notes' => ['string']
        ];
    }
}
