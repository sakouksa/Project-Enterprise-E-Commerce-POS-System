<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Company\Company;
use App\Models\Company\Branch;

class AttendanceQrSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'branch_id',
        'shift_id',
        'qr_token',
        'random_uuid',
        'secret_signature',
        'qr_expired_at',
        'interval_seconds',
    ];

    protected $casts = [
        'qr_expired_at'    => 'datetime',
        'interval_seconds' => 'integer',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }
}
