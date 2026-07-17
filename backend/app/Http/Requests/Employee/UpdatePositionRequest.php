<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePositionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => ['integer', 'exists:companies,id'],
            'department_id' => ['integer', 'exists:departments,id'],
            'name' => ['string'],
            'code' => ['string'],
            'description' => ['string'],
            'is_active' => ['boolean']
        ];
    }
}
