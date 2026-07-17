<?php

namespace App\Models\Supplier;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Company\Company;

use App\Traits\SoftDeletesEnterprise;

class Supplier extends Model
{
    use HasFactory, SoftDeletes, SoftDeletesEnterprise;

    protected $fillable = [
        'company_id', 'name', 'code', 'email', 'phone', 'fax', 'website',
        'tax_number', 'address', 'city', 'province', 'country', 'postal_code',
        'payment_term_days', 'credit_limit', 'currency_code',
        'bank_name', 'bank_account_name', 'bank_account_number',
        'notes', 'is_active',
    ];

    protected $casts = [
        'credit_limit'      => 'decimal:2',
        'is_active'         => 'boolean',
    ];

    public function company(): BelongsTo   { return $this->belongsTo(Company::class); }
    public function contacts(): HasMany    { return $this->hasMany(SupplierContact::class); }
    public function purchases(): HasMany   { return $this->hasMany(\App\Models\Purchase\Purchase::class); }

    public function scopeActive($query) { return $query->where('is_active', true); }
}
