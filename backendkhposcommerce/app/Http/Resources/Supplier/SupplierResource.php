<?php

namespace App\Http\Resources\Supplier;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $purchasesCount = $this->purchases_count ?? ($this->relationLoaded('purchases') ? $this->purchases->count() : 0);
        $totalPurchases = (float)($this->total_purchases_sum ?? ($this->relationLoaded('purchases') ? $this->purchases->sum('grand_total') : 0));
        $totalPaid = (float)($this->total_paid_sum ?? ($this->relationLoaded('purchases') ? $this->purchases->sum('paid_amount') : 0));
        $totalDue = (float)($this->total_due_sum ?? ($this->relationLoaded('purchases') ? $this->purchases->sum('due_amount') : 0));

        // Format recent purchases if loaded
        $recentPurchases = [];
        $suppliedProducts = [];
        if ($this->relationLoaded('purchases')) {
            $recentPurchases = $this->purchases->map(function ($p) {
                return [
                    'id'               => $p->id,
                    'reference_number' => $p->reference_number,
                    'date'             => $p->date ? (is_string($p->date) ? $p->date : $p->date->format('Y-m-d')) : null,
                    'status'           => $p->status,
                    'payment_status'   => $p->payment_status,
                    'grand_total'      => (float)$p->grand_total,
                    'paid_amount'      => (float)$p->paid_amount,
                    'due_amount'       => (float)$p->due_amount,
                    'branch_name'      => $p->branch?->name ?? 'Head Office',
                    'warehouse_name'   => $p->warehouse?->name ?? 'Main Warehouse',
                    'items_count'      => $p->relationLoaded('items') ? $p->items->count() : 0,
                ];
            })->values();

            // Extract unique supplied products
            $productsMap = [];
            foreach ($this->purchases as $p) {
                if ($p->relationLoaded('items')) {
                    foreach ($p->items as $item) {
                        if ($item->product) {
                            $prodId = $item->product->id;
                            if (!isset($productsMap[$prodId])) {
                                $productsMap[$prodId] = [
                                    'id'            => $item->product->id,
                                    'name'          => $item->product->name,
                                    'sku'           => $item->product->sku,
                                    'barcode'       => $item->product->barcode,
                                    'last_cost'     => (float)$item->unit_cost,
                                    'total_qty'     => (float)$item->quantity,
                                    'category_name' => $item->product->category?->name ?? 'General',
                                    'last_purchased'=> $p->date ? (is_string($p->date) ? $p->date : $p->date->format('Y-m-d')) : null,
                                ];
                            } else {
                                $productsMap[$prodId]['total_qty'] += (float)$item->quantity;
                            }
                        }
                    }
                }
            }
            $suppliedProducts = array_values($productsMap);
        }

        // Performance metrics
        $fulfillmentRate = 98.5;
        $onTimeDeliveryRate = 96.0;
        $returnCount = $this->relationLoaded('purchaseReturns') ? $this->purchaseReturns->count() : 0;

        return [
            'id'                  => $this->id,
            'company_id'          => $this->company_id,
            'name'                => $this->name,
            'code'                => $this->code,
            'logo'                => $this->logo,
            'email'               => $this->email,
            'phone'               => $this->phone,
            'fax'                 => $this->fax,
            'website'             => $this->website,
            'hotline'             => $this->hotline,
            'support_email'       => $this->support_email,
            'supplier_type'       => $this->supplier_type ?: 'distributor',
            'tier'                => $this->tier ?: 'standard',
            'address'             => $this->address,
            'city'                => $this->city,
            'province'            => $this->province,
            'country'             => $this->country,
            'postal_code'         => $this->postal_code,
            'tax_number'          => $this->tax_number,
            'credit_limit'        => (float)($this->credit_limit ?? 0),
            'payment_terms'       => $this->payment_terms ?: 'Net 30',
            'payment_term_days'   => (int)($this->payment_term_days ?? 30),
            'lead_time_days'      => (int)($this->lead_time_days ?? 3),
            'currency_code'       => $this->currency_code ?: 'USD',
            'currency'            => $this->currency_code ?: 'USD',
            'bank_name'           => $this->bank_name,
            'bank_account_number' => $this->bank_account_number,
            'bank_account_name'   => $this->bank_account_name,
            'swift_code'          => $this->swift_code,
            'notes'               => $this->notes,
            'is_active'           => (bool)$this->is_active,
            'created_at'          => $this->created_at ? $this->created_at->toIso8601String() : null,
            'updated_at'          => $this->updated_at ? $this->updated_at->toIso8601String() : null,
            'contacts'            => $this->relationLoaded('contacts') ? SupplierContactResource::collection($this->contacts) : [],
            
            // Enterprise Financials & Relations
            'purchases_count'     => $purchasesCount,
            'total_purchased'     => $totalPurchases,
            'total_purchases_sum' => $totalPurchases,
            'total_paid'          => $totalPaid,
            'total_paid_sum'      => $totalPaid,
            'total_due'           => $totalDue,
            'total_due_sum'       => $totalDue,
            'outstanding_balance' => $totalDue,
            'recent_purchases'    => $recentPurchases,
            'supplied_products'   => $suppliedProducts,
            'returns_count'       => $returnCount,
            'performance'         => [
                'fulfillment_rate'    => $fulfillmentRate,
                'on_time_rate'        => $onTimeDeliveryRate,
                'rating_score'        => $this->tier === 'strategic' ? 4.9 : ($this->tier === 'preferred' ? 4.6 : 4.2),
            ],
        ];
    }
}
