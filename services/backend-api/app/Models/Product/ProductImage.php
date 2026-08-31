<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductImage extends Model
{
    use HasFactory;
    protected $fillable = ['product_id', 'image', 'alt_text', 'sort_order', 'is_primary'];
    protected $casts    = ['is_primary' => 'boolean'];
    protected $appends  = ['url'];

    public function getUrlAttribute(): ?string
    {
        $img = $this->attributes['image'] ?? null;
        if (!$img) {
            return null;
        }

        if (str_starts_with($img, 'http://') || str_starts_with($img, 'https://') || str_starts_with($img, 'data:')) {
            return $img;
        }

        $cleanPath = preg_replace('#^storage/#', '', ltrim($img, '/'));
        return url('api/v1/storage/' . $cleanPath);
    }

    public function product() { return $this->belongsTo(Product::class); }
}

