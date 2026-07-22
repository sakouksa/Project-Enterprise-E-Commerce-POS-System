<?php

namespace App\Models\Marketing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Company\Company;
use App\Models\Company\Store;

class Banner extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'company_id', 'store_id', 'title', 'subtitle', 'image',
        'mobile_image', 'link', 'position', 'sort_order', 'starts_at',
        'ends_at', 'is_active',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at'   => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $appends = ['image_url', 'link_url'];

    public function getImageUrlAttribute(): ?string
    {
        $img = $this->attributes['image'] ?? null;
        
        if (!$img || $img === '[]' || $img === '""' || $img === 'null' || str_contains($img, 'blob:http') || str_contains($img, '/storage/[]')) {
            return 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80';
        }

        if (str_starts_with($img, 'http://') || str_starts_with($img, 'https://') || str_starts_with($img, 'data:')) {
            return $img;
        }

        return url('storage/' . ltrim($img, '/'));
    }

    public function getLinkUrlAttribute(): ?string
    {
        return $this->attributes['link'] ?? null;
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
