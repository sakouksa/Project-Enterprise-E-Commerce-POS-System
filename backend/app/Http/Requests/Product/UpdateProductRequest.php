<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('product'); // assuming route parameter name is product

        return [
            'name'                => 'sometimes|required|string|max:255',
            'sku'                 => "sometimes|required|string|max:100|unique:products,sku,{$id}",
            'barcode'             => "nullable|string|max:100|unique:products,barcode,{$id}",
            'category_id'         => 'nullable|integer|exists:categories,id',
            'brand_id'            => 'nullable|integer|exists:brands,id',
            'unit_id'             => 'nullable|integer|exists:units,id',
            'tax_id'              => 'nullable|integer|exists:taxes,id',
            'cost_price'          => 'nullable|numeric|min:0',
            'selling_price'       => 'sometimes|required|numeric|min:0',
            'compare_price'       => 'nullable|numeric|min:0',
            'description'         => 'nullable|string',
            'short_description'   => 'nullable|string',
            'weight'              => 'nullable|numeric|min:0',
            'length'              => 'nullable|numeric|min:0',
            'width'               => 'nullable|numeric|min:0',
            'height'              => 'nullable|numeric|min:0',
            'track_inventory'     => 'boolean',
            'low_stock_threshold' => 'integer|min:0',
            'status'              => 'sometimes|required|string|in:active,inactive,draft,archived',
            'is_featured'         => 'boolean',
            'is_digital'          => 'boolean',
            'meta_title'          => 'nullable|string|max:255',
            'meta_description'    => 'nullable|string',
            'meta_keywords'       => 'nullable|string',
        ];
    }
}
