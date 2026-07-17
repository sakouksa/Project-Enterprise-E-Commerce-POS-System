<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, LogsActivity, SoftDeletes;

    protected $guard_name = 'api';

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'gender',
        'date_of_birth',
        'address',
        'country',
        'province',
        'city',
        'company_id',
        'branch_id',
        'timezone',
        'language',
        'email_notify',
        'push_notify',
        'sms_notify',
        'is_active',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at'     => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
            'date_of_birth'     => 'date',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'is_active'])
            ->logOnlyDirty()
            ->useLogName('user');
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company\Company::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Company\Branch::class);
    }

    public function employee(): HasOne
    {
        return $this->hasOne(Employee\Employee::class);
    }

    public function customer(): HasOne
    {
        return $this->hasOne(Customer\Customer::class);
    }

    public function loginHistories(): HasMany
    {
        return $this->hasMany(Log\LoginHistory::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
