<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => ['integer', 'exists:companies,id'],
            'branch_id' => ['integer', 'exists:branches,id'],
            'department_id' => ['integer', 'exists:departments,id'],
            'position_id' => ['integer', 'exists:positions,id'],
            'user_id' => ['integer', 'exists:users,id'],
            'employee_number' => ['string'],
            'name' => ['string'],
            'email' => ['string'],
            'phone' => ['string'],
            'nik' => ['string'],
            'gender' => ['string'],
            'birth_date' => ['string'],
            'address' => ['string'],
            'photo' => ['string'],
            'join_date' => ['string'],
            'resign_date' => ['string'],
            'status' => ['string'],
            'basic_salary' => ['numeric']
        ];
    }
}
