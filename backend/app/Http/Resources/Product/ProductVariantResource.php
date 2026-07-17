<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'product_id'    => $this->product_id,
            'name'          => $this->name,
            'sku'           => $this->sku,
            'barcode'       => $this->barcode,
            'cost_price'    => (float) $this->cost_price,
            'selling_price' => (float) $this->selling_price,
            'compare_price' => $this->compare_price ? (float) $this->compare_price : null,
            'weight'        => $this->weight ? (float) $this->weight : null,
            'image'         => $this->image ? asset('storage/' . $this->image) : null,
            'is_active'     => (bool) $this->is_active,
        ];
    }
}
