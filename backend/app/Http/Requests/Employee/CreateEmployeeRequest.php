<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class CreateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id'      => ['required', 'integer', 'exists:companies,id'],
            'branch_id'       => ['required', 'integer', 'exists:branches,id'],
            'department_id'   => ['nullable', 'integer', 'exists:departments,id'],
            'position_id'     => ['nullable', 'integer', 'exists:positions,id'],
            'user_id'         => ['nullable', 'integer', 'exists:users,id'],
            'employee_number' => ['required', 'string', 'max:100', 'unique:employees,employee_number'],
            'name'            => ['required', 'string', 'max:255'],
            'email'           => ['nullable', 'email', 'max:255'],
            'phone'           => ['nullable', 'string', 'max:50'],
            'nik'             => ['nullable', 'string', 'max:50'],
            'gender'          => ['nullable', 'string', 'in:male,female'],
            'birth_date'      => ['nullable', 'date'],
            'address'         => ['nullable', 'string'],
            'photo'           => ['nullable', 'string'],
            'join_date'       => ['nullable', 'date'],
            'resign_date'     => ['nullable', 'date'],
            'status'          => ['nullable', 'string', 'in:active,inactive,resigned'],
            'basic_salary'    => ['nullable', 'numeric', 'min:0']
        ];
    }
}
