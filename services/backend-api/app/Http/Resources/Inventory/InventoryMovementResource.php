<?php

namespace App\Http\Resources\Inventory;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryMovementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'warehouse_id'    => $this->warehouse_id,
            'product_id'      => $this->product_id,
            'user_id'         => $this->user_id,
            'reference_type'  => $this->reference_type,
            'reference_id'    => $this->reference_id,
            'type'            => $this->type,
            'quantity'        => (float) $this->quantity,
            'quantity_before' => (float) $this->quantity_before,
            'quantity_after'  => (float) $this->quantity_after,
            'unit_cost'       => $this->unit_cost ? (float) $this->unit_cost : null,
            'notes'           => $this->notes,
            'reason'          => $this->notes, // Alias for frontend
            'created_at'      => $this->created_at?->toIso8601String(),
            'updated_at'      => $this->updated_at?->toIso8601String(),
            
            'product' => [
                'id'   => $this->product?->id,
                'name' => $this->product?->name,
                'sku'  => $this->product?->sku,
            ],
            'warehouse' => [
                'id'   => $this->warehouse?->id,
                'name' => $this->warehouse?->name,
            ],
        ];
    }
}
