<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => ['integer', 'exists:companies,id'],
            'payment_id' => ['integer', 'exists:payments,id'],
            'type' => ['string'],
            'amount' => ['numeric'],
            'description' => ['string'],
            'reference_type' => ['string'],
            'reference_id' => ['integer', 'exists:references,id']
        ];
    }
}
