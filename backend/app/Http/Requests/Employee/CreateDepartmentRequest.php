<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class CreateDepartmentRequest extends FormRequest
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
            'name' => ['string'],
            'code' => ['string'],
            'description' => ['string'],
            'is_active' => ['boolean']
        ];
    }
}
