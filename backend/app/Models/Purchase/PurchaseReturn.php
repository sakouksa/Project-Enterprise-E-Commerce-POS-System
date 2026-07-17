<?php

namespace App\Models\Purchase;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

class PurchaseReturn extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'company_id', 'purchase_id', 'supplier_id', 'user_id',
        'return_number', 'date', 'total_amount', 'reason', 'status',
    ];
    protected $casts = ['date' => 'date', 'total_amount' => 'decimal:2'];
    public function purchase(): BelongsTo { return $this->belongsTo(Purchase::class); }
    public function user(): BelongsTo     { return $this->belongsTo(User::class); }
    public function items(): HasMany      { return $this->hasMany(PurchaseReturnItem::class); }
}
