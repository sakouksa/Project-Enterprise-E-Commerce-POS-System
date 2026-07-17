<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductVariantValueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_variant_id' => ['integer', 'exists:product_variants,id'],
            'attribute_id' => ['integer', 'exists:attributes,id'],
            'attribute_value_id' => ['integer', 'exists:attribute_values,id']
        ];
    }
}
