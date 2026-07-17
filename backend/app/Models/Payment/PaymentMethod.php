<?php

namespace App\Models\Payment;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Company\Company;

class PaymentMethod extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'company_id', 'name', 'code', 'type', 'provider',
        'instructions', 'is_active', 'is_default', 'sort_order',
        'logo', 'fee_type', 'fee_value',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'is_default' => 'boolean',
        'fee_value'  => 'decimal:4',
    ];

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function scopeActive($query)  { return $query->where('is_active', true)->orderBy('sort_order'); }

    public function calculateFee(float $amount): float
    {
        return match ($this->fee_type) {
            'percent' => $amount * ($this->fee_value / 100),
            'fixed'   => (float) $this->fee_value,
            default   => 0,
        };
    }
}
