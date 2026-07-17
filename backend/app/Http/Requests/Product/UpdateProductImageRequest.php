<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['integer', 'exists:products,id'],
            'image' => ['string'],
            'alt_text' => ['string'],
            'sort_order' => ['integer'],
            'is_primary' => ['boolean']
        ];
    }
}
