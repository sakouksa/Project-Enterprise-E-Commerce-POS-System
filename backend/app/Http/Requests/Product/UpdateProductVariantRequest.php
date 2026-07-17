<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductVariantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['integer', 'exists:products,id'],
            'name' => ['string'],
            'sku' => ['string'],
            'barcode' => ['string'],
            'cost_price' => ['numeric'],
            'selling_price' => ['numeric'],
            'compare_price' => ['numeric'],
            'weight' => ['numeric'],
            'image' => ['string'],
            'is_active' => ['boolean']
        ];
    }
}
