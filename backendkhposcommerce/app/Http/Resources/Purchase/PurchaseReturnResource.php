<?php

namespace App\Http\Resources\Purchase;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseReturnResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'company_id'        => $this->company_id,
            'purchase_id'       => $this->purchase_id,
            'supplier_id'       => $this->supplier_id,
            'user_id'           => $this->user_id,
            'reference_number'  => $this->reference_number,
            'rma_number'        => $this->rma_number,
            'date'              => $this->date ? $this->date->format('Y-m-d') : null,
            'total_amount'      => (float)$this->total_amount,
            'currency_code'     => $this->currency_code ?? 'USD',
            'exchange_rate'     => (float)($this->exchange_rate ?? 1),
            'total_amount_base' => (float)($this->total_amount_base ?? $this->total_amount),
            'reason'            => $this->reason,
            'status'            => $this->status,
            'shipping_carrier'  => $this->shipping_carrier,
            'tracking_number'   => $this->tracking_number,
            'refund_status'     => $this->refund_status ?? 'pending',
            'refund_method'     => $this->refund_method,
            'refund_amount'     => (float)($this->refund_amount ?? 0),
            'refund_date'       => $this->refund_date ? $this->refund_date->format('Y-m-d') : null,
            'attachment_url'    => $this->attachment_url,
            'settlement_notes'  => $this->settlement_notes,
            'created_at'        => $this->created_at ? $this->created_at->toIso8601String() : null,
            'updated_at'        => $this->updated_at ? $this->updated_at->toIso8601String() : null,
            'purchase'          => $this->relationLoaded('purchase') && $this->purchase ? [
                'id'               => $this->purchase->id,
                'reference_number' => $this->purchase->reference_number,
                'status'           => $this->purchase->status,
                'payment_status'   => $this->purchase->payment_status,
                'grand_total'      => (float)$this->purchase->grand_total,
                'paid_amount'      => (float)$this->purchase->paid_amount,
                'due_amount'       => (float)$this->purchase->due_amount,
                'warehouse_id'     => $this->purchase->warehouse_id,
            ] : null,
            'supplier'          => $this->relationLoaded('supplier') ? $this->supplier : null,
            'user'              => $this->relationLoaded('user') && $this->user ? [
                'id'   => $this->user->id,
                'name' => $this->user->name,
            ] : null,
            'items'             => $this->relationLoaded('items') ? PurchaseReturnItemResource::collection($this->items) : [],
        ];
    }
}
