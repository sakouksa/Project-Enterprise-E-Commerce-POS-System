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
        $id = $this->route('product_variant');
        $variantId = is_object($id) ? $id->id : $id;

        return [
            'product_id'    => ['sometimes', 'required', 'integer', 'exists:products,id'],
            'name'          => ['sometimes', 'required', 'string', 'max:255'],
            'sku'           => ["sometimes", "required", "string", "max:255", "unique:product_variants,sku,{$variantId}"],
            'barcode'       => ["nullable", "string", "max:255", "unique:product_variants,barcode,{$variantId}"],
            'cost_price'    => ['sometimes', 'numeric', 'min:0'],
            'selling_price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'compare_price' => ['nullable', 'numeric', 'min:0'],
            'weight'        => ['nullable', 'numeric', 'min:0'],
            'image'         => ['nullable', 'string'],
            'is_active'     => ['sometimes', 'boolean']
        ];
    }
}
