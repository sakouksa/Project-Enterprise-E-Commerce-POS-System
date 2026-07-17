<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductPriceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['integer', 'exists:products,id'],
            'product_variant_id' => ['integer', 'exists:product_variants,id'],
            'price_type' => ['string'],
            'min_qty' => ['integer'],
            'price' => ['numeric'],
            'currency_code' => ['string'],
            'start_date' => ['string'],
            'end_date' => ['string'],
            'is_active' => ['boolean']
        ];
    }
}
