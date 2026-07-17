<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class CreateAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => ['integer', 'exists:employees,id'],
            'date' => ['string'],
            'check_in' => ['string'],
            'check_out' => ['string'],
            'status' => ['string'],
            'notes' => ['string']
        ];
    }
}
