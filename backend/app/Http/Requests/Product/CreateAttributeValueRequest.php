<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class CreateAttributeValueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'attribute_id' => ['integer', 'exists:attributes,id'],
            'value' => ['string'],
            'color_code' => ['string'],
            'sort_order' => ['integer']
        ];
    }
}
