<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductImage extends Model
{
    use HasFactory;
    protected $fillable = ['product_id', 'image', 'alt_text', 'sort_order', 'is_primary'];
    protected $casts    = ['is_primary' => 'boolean'];
    public function product() { return $this->belongsTo(Product::class); }
}

