<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['integer', 'exists:customers,id'],
            'label' => ['string'],
            'name' => ['string'],
            'phone' => ['string'],
            'address' => ['string'],
            'city' => ['string'],
            'province' => ['string'],
            'country' => ['string'],
            'postal_code' => ['string'],
            'latitude' => ['numeric'],
            'longitude' => ['numeric'],
            'is_default' => ['boolean']
        ];
    }
}
