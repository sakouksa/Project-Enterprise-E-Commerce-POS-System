<?php

namespace App\Traits;

use App\Models\Company\Company;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToCompany
{
    /**
     * Relationship to Company.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    /**
     * Scope query to a specific company ID.
     */
    public function scopeForCompany(Builder $query, ?int $companyId = null): Builder
    {
        if ($companyId) {
            return $query->where($this->qualifyColumn('company_id'), $companyId);
        }

        $userCompanyId = auth()->user()?->company_id;
        if ($userCompanyId) {
            return $query->where($this->qualifyColumn('company_id'), $userCompanyId);
        }

        return $query;
    }
}
