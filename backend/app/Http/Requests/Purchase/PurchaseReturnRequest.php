<?php

namespace App\Http\Requests\Purchase;

use Illuminate\Foundation\Http\FormRequest;

class PurchaseReturnRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id'            => ['required', 'integer', 'exists:companies,id'],
            'purchase_id'           => ['required', 'integer', 'exists:purchases,id'],
            'supplier_id'           => ['required', 'integer', 'exists:suppliers,id'],
            'date'                  => ['required', 'date'],
            'reason'                => ['required', 'string'],
            'status'                => ['required', 'string', 'in:draft,approved,cancelled'],
            'items'                 => ['required', 'array', 'min:1'],
            'items.*.purchase_item_id' => ['required', 'integer', 'exists:purchase_items,id'],
            'items.*.product_id'     => ['required', 'integer', 'exists:products,id'],
            'items.*.product_variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'items.*.quantity'      => ['required', 'numeric', 'gt:0'],
            'items.*.unit_cost'     => ['required', 'numeric', 'gte:0'],
            'items.*.notes'         => ['nullable', 'string'],
        ];
    }
}
