<?php

namespace App\Http\Resources\Inventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'warehouse_id'  => $this->warehouse_id,
            'product_id'    => $this->product_id,
            'stock_qty'     => (float) $this->quantity,
            'quantity'      => (float) $this->quantity,
            'min_stock_qty' => (float) ($this->product?->low_stock_threshold ?? 5),
            
            'product' => $this->whenLoaded('product', fn() => [
                'id'   => $this->product?->id,
                'name' => $this->product?->name,
                'sku'  => $this->product?->sku,
            ]),
            'warehouse' => $this->whenLoaded('warehouse', fn() => [
                'id'   => $this->warehouse?->id,
                'name' => $this->warehouse?->name,
            ]),
        ];
    }
}
