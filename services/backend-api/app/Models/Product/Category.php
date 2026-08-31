<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Company\Company;

use App\Traits\SoftDeletesEnterprise;

class Category extends Model
{
    use HasFactory, SoftDeletes, SoftDeletesEnterprise;

    protected $fillable = [
        'company_id', 'parent_id', 'name', 'slug',
        'description', 'image', 'sort_order', 'is_active',
    ];

    protected $casts   = ['is_active' => 'boolean'];
    protected $appends = ['image_url'];

    /** Return a full, publicly accessible URL for the category image. */
    public function getImageUrlAttribute(): ?string
    {
        $img = $this->attributes['image'] ?? null;
        if (!$img) return null;
        if (str_starts_with($img, 'http://') || str_starts_with($img, 'https://')) return $img;
        $clean = ltrim(preg_replace('#^storage/#', '', $img), '/');
        return url('api/v1/storage/' . $clean);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }
}
