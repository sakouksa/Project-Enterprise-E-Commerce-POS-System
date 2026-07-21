<?php

namespace App\Http\Resources\Inventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'warehouse_id'       => $this->warehouse_id,
            'product_id'         => $this->product_id,
            'stock_qty'          => (float) $this->quantity,
            'quantity'           => (float) $this->quantity,
            'reserved_quantity'  => (float) $this->reserved_quantity,
            'available_quantity' => (float) $this->available_quantity,
            'reorder_point'      => (float) $this->reorder_point,
            'reorder_qty'        => (float) $this->reorder_qty,
            'min_stock_qty'      => (float) ($this->product?->low_stock_threshold ?? 5),
            'created_at'         => $this->created_at?->toIso8601String(),
            'updated_at'         => $this->updated_at?->toIso8601String(),
            
            'product' => $this->whenLoaded('product', fn() => [
                'id'       => $this->product?->id,
                'name'     => $this->product?->name,
                'sku'      => $this->product?->sku,
                'category' => $this->product?->category ? [
                    'id'   => $this->product->category->id,
                    'name' => $this->product->category->name,
                ] : null,
                'brand' => $this->product?->brand ? [
                    'id'   => $this->product->brand->id,
                    'name' => $this->product->brand->name,
                ] : null,
                'unit' => $this->product?->unit ? [
                    'id'   => $this->product->unit->id,
                    'name' => $this->product->unit->name,
                ] : null,
            ]),
            'warehouse' => $this->whenLoaded('warehouse', fn() => [
                'id'   => $this->warehouse?->id,
                'name' => $this->warehouse?->name,
            ]),
        ];
    }
}
