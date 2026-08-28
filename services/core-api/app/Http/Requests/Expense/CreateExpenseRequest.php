<?php

namespace App\Http\Requests\Expense;

use Illuminate\Foundation\Http\FormRequest;

class CreateExpenseRequest extends FormRequest
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
            'expense_category_id' => ['integer', 'exists:expense_categories,id'],
            'user_id' => ['integer', 'exists:users,id'],
            'reference_number' => ['string'],
            'title' => ['string'],
            'description' => ['string'],
            'amount' => ['numeric'],
            'date' => ['string'],
            'receipt' => ['string'],
            'status' => ['string']
        ];
    }
}
