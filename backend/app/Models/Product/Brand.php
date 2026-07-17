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
    public function products(): HasMany { return $this->hasMany(Product::class); }
    public function scopeActive($query) { return $query->where('is_active', true); }
}
