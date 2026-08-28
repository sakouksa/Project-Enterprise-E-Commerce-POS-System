<?php

namespace App\Http\Resources\Supplier;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'company_id'          => $this->company_id,
            'name'                => $this->name,
            'code'                => $this->code,
            'email'               => $this->email,
            'phone'               => $this->phone,
            'fax'                 => $this->fax,
            'address'             => $this->address,
            'city'                => $this->city,
            'province'            => $this->province,
            'country'             => $this->country,
            'postal_code'         => $this->postal_code,
            'tax_number'          => $this->tax_number,
            'bank_name'           => $this->bank_name,
            'bank_account_number' => $this->bank_account_number,
            'bank_account_name'   => $this->bank_account_name,
            'notes'               => $this->notes,
            'is_active'           => (bool)$this->is_active,
            'created_at'          => $this->created_at ? $this->created_at->toIso8601String() : null,
            'updated_at'          => $this->updated_at ? $this->updated_at->toIso8601String() : null,
            'contacts'            => $this->relationLoaded('contacts') ? SupplierContactResource::collection($this->contacts) : [],
        ];
    }
}
