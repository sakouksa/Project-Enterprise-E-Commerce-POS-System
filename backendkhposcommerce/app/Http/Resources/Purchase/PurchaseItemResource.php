<?php

namespace App\Http\Resources\Purchase;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'purchase_id'        => $this->purchase_id,
            'product_id'         => $this->product_id,
            'product_variant_id' => $this->product_variant_id,
            'product_name'       => $this->product_name ?: ($this->product?->name ?? 'Unknown Product'),
            'sku'                => $this->sku ?: ($this->product?->sku ?? ''),
            'quantity'           => (float)$this->quantity,
            'quantity_received'  => (float)$this->quantity_received,
            'already_returned'   => (float)$this->already_returned,
            'unit_cost'          => (float)$this->unit_cost,
            'discount_percent'   => (float)$this->discount_percent,
            'discount_amount'    => (float)$this->discount_amount,
            'tax_percent'        => (float)$this->tax_percent,
            'tax_amount'         => (float)$this->tax_amount,
            'subtotal'           => (float)$this->subtotal,
            'total'              => (float)$this->total,
            'currency_code'      => $this->currency_code,
            'exchange_rate'      => (float)$this->exchange_rate,
            'unit_cost_base'     => (float)$this->unit_cost_base,
            'subtotal_base'      => (float)$this->subtotal_base,
            'total_base'         => (float)$this->total_base,
            'notes'              => $this->notes,
            'product'            => $this->relationLoaded('product') ? $this->product : null,
            'variant'            => $this->relationLoaded('variant') ? $this->variant : null,
        ];
    }
}
