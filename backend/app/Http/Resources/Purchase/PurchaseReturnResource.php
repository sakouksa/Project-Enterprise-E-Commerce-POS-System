<?php

namespace App\Http\Resources\Purchase;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseReturnResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'company_id'       => $this->company_id,
            'purchase_id'      => $this->purchase_id,
            'supplier_id'      => $this->supplier_id,
            'user_id'          => $this->user_id,
            'reference_number' => $this->reference_number,
            'date'             => $this->date ? $this->date->format('Y-m-d') : null,
            'total_amount'     => (float)$this->total_amount,
            'reason'           => $this->reason,
            'status'           => $this->status,
            'created_at'       => $this->created_at ? $this->created_at->toIso8601String() : null,
            'updated_at'       => $this->updated_at ? $this->updated_at->toIso8601String() : null,
            'purchase'         => $this->relationLoaded('purchase') && $this->purchase ? [
                'id'               => $this->purchase->id,
                'reference_number' => $this->purchase->reference_number,
            ] : null,
            'supplier'         => $this->relationLoaded('supplier') ? $this->supplier : null,
            'user'             => $this->relationLoaded('user') && $this->user ? [
                'id'   => $this->user->id,
                'name' => $this->user->name,
            ] : null,
            'items'            => $this->relationLoaded('items') ? PurchaseReturnItemResource::collection($this->items) : [],
        ];
    }
}
