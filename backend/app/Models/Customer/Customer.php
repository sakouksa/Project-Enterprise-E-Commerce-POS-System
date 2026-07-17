<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

use App\Traits\SoftDeletesEnterprise;

class Customer extends Model
{
    use HasFactory, SoftDeletes, SoftDeletesEnterprise;

    protected $fillable = [
        'company_id', 'customer_group_id', 'user_id',
        'name', 'email', 'phone', 'gender', 'birth_date',
        'photo', 'total_spent', 'order_count', 'loyalty_points',
        'tax_number', 'notes', 'is_active',
    ];

    protected $casts = [
        'birth_date'     => 'date',
        'total_spent'    => 'decimal:2',
        'loyalty_points' => 'decimal:2',
        'is_active'      => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(CustomerGroup::class, 'customer_group_id');
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(CustomerAddress::class);
    }

    public function defaultAddress(): HasMany
    {
        return $this->addresses()->where('is_default', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
