<?php

namespace App\Http\Resources\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $photoUrl = $this->photo;
        if ($photoUrl && !str_starts_with($photoUrl, 'http://') && !str_starts_with($photoUrl, 'https://')) {
            $clean = ltrim($photoUrl, '/');
            $photoUrl = str_starts_with($clean, 'storage/') ? asset($clean) : asset('storage/' . $clean);
        }

        return [
            'id'                => $this->id,
            'company_id'        => $this->company_id,
            'customer_group_id' => $this->customer_group_id,
            'user_id'           => $this->user_id,
            'name'              => $this->name,
            'email'             => $this->email,
            'phone'             => $this->phone,
            'gender'            => $this->gender,
            'birth_date'        => $this->birth_date?->toDateString(),
            'photo'             => $photoUrl,
            'avatar'            => $photoUrl,
            'total_spent'       => (float) $this->total_spent,
            'order_count'       => (int) $this->order_count,
            'loyalty_points'    => (float) $this->loyalty_points,
            'tax_number'        => $this->tax_number,
            'notes'             => $this->notes,
            'is_active'         => (bool) $this->is_active,
            'group'             => $this->whenLoaded('group', fn() => [
                'id'   => $this->group?->id,
                'name' => $this->group?->name,
            ]),
            'addresses'         => $this->whenLoaded('addresses'),
            'created_at'        => $this->created_at?->toIso8601String(),
            'updated_at'        => $this->updated_at?->toIso8601String(),
        ];
    }
}
