<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\SoftDeletesEnterprise;

class Brand extends Model
{
    use HasFactory, SoftDeletes, SoftDeletesEnterprise;
    protected $fillable = ['company_id', 'name', 'slug', 'description', 'logo', 'is_active'];
    protected $casts    = ['is_active' => 'boolean'];
    protected $appends  = ['logo_url'];

    /** Return a full, publicly accessible URL for the brand logo. */
    public function getLogoUrlAttribute(): ?string
    {
        $logo = $this->attributes['logo'] ?? null;
        if (!$logo) return null;
        if (str_starts_with($logo, 'http://') || str_starts_with($logo, 'https://')) return $logo;
        $clean = ltrim(preg_replace('#^storage/#', '', $logo), '/');
        return url('api/v1/storage/' . $clean);
    }

    public function products(): HasMany { return $this->hasMany(Product::class); }
    public function scopeActive($query) { return $query->where('is_active', true); }
}
