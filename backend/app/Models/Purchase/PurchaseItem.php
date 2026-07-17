<?php

namespace App\Models\Purchase;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Product\Product;
use App\Models\Product\ProductVariant;

class PurchaseItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'purchase_id', 'product_id', 'product_variant_id', 'product_name', 'sku',
        'ordered_qty', 'received_qty', 'unit_cost', 'tax_percent', 'tax_amount',
        'discount_percent', 'discount_amount', 'subtotal', 'total',
    ];
    protected $casts = [
        'ordered_qty'      => 'decimal:4',
        'received_qty'     => 'decimal:4',
        'unit_cost'        => 'decimal:2',
        'tax_percent'      => 'decimal:4',
        'tax_amount'       => 'decimal:2',
        'discount_percent' => 'decimal:4',
        'discount_amount'  => 'decimal:2',
        'subtotal'         => 'decimal:2',
        'total'            => 'decimal:2',
    ];
    public function purchase(): BelongsTo { return $this->belongsTo(Purchase::class); }
    public function product(): BelongsTo  { return $this->belongsTo(Product::class); }
    public function variant(): BelongsTo  { return $this->belongsTo(ProductVariant::class, 'product_variant_id'); }
}
