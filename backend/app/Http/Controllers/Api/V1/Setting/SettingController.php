<?php

namespace App\Http\Controllers\Api\V1\Setting;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Setting\Setting;
use App\Models\Company\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends BaseApiController
{
    /**
     * GET /api/v1/settings
     */
    public function index(Request $request): JsonResponse
    {
        $settings = Setting::all();
        return $this->successResponse($settings);
    }

    /**
     * POST /api/v1/settings
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'settings'   => 'required|array',
        ]);

        foreach ($data['settings'] as $key => $value) {
            Setting::updateOrCreate(
                ['company_id' => $data['company_id'], 'key' => $key],
                ['value' => is_array($value) ? json_encode($value) : (string) $value]
            );
        }

        // If site_name or site_logo was updated, sync with Company model as well
        if (isset($data['settings']['site_name']) && !empty($data['settings']['site_name'])) {
            $name = (string) $data['settings']['site_name'];
            Company::where('id', $data['company_id'])->update(['name' => $name]);
            Company::query()->update(['name' => $name]);
        }
        if (isset($data['settings']['site_logo']) && !empty($data['settings']['site_logo'])) {
            $logo = (string) $data['settings']['site_logo'];
            Company::where('id', $data['company_id'])->update(['logo' => $logo]);
            Company::query()->update(['logo' => $logo]);
        }

        // Clear Storefront cache so customer website reflects changes immediately
        $this->clearStorefrontCache();

        return $this->successResponse(Setting::all(), 'Settings updated successfully');
    }

    /**
     * Helper to clear storefront cache
     */
    protected function clearStorefrontCache(): void
    {
        \Illuminate\Support\Facades\Cache::forget('storefront_settings_v4');
        \Illuminate\Support\Facades\Cache::forget('storefront_settings_v5');
        \Illuminate\Support\Facades\Cache::forget('storefront_home_data_v4');
        \Illuminate\Support\Facades\Cache::forget('storefront_stats_v2');
    }

    /**
     * GET /api/v1/public/branding
     */
    public function publicBranding(): JsonResponse
    {
        $company = \App\Models\Company\Company::where('is_active', true)->orderBy('id')->first();
        $siteName = Setting::where('key', 'site_name')->value('value') ?: ($company?->name ?: 'NexPOS');
        $siteEmail = Setting::where('key', 'site_email')->value('value') ?: ($company?->email ?: 'support@nexpos.io');
        $sitePhone = Setting::where('key', 'company_phone')->value('value') ?: ($company?->phone ?: '+855 23 888 999');
        $siteLogo = Setting::where('key', 'site_logo')->value('value');
        $logo = $siteLogo ?: ($company?->logo ?: '/logo.svg');

        return $this->successResponse([
            'brand_name'       => $siteName,
            'brand_tagline'    => 'Next-Generation Enterprise POS & Omni-Channel Commerce',
            'brand_tagline_km' => 'ប្រព័ន្ធគ្រប់គ្រងការលក់ និងពាណិជ្ជកម្មឆ្លាតវៃជំនាន់ក្រោយ',
            'company_name'     => $company?->name ?: 'NexPOS Retail Enterprise',
            'logo'             => $logo,
            'email'            => $siteEmail,
            'phone'            => $sitePhone,
            'address'          => $company?->address ?: 'Phnom Penh, Cambodia',
            'currency'         => $company?->currency_code ?: 'USD',
            'timezone'         => $company?->timezone ?: 'Asia/Phnom_Penh',
        ], 'Public branding retrieved successfully.');
    }

    /**
     * Delete previous custom logo file from public storage if it exists and is not a default asset
     */
    protected function deleteOldLogoFile(?string $oldPath): void
    {
        if (empty($oldPath)) {
            return;
        }

        // Clean relative path, e.g. "storage/companies/logo_xxx.jpg" -> "companies/logo_xxx.jpg"
        $relPath = preg_replace('#^/?(storage/)?#', '', $oldPath);

        // Do not delete default templates or system logos
        $protectedFiles = [
            'companies/company-logo.png',
            'companies/nexpos-logo.jpg',
            'settings/logo-light.png',
            'settings/logo-dark.png',
            'settings/favicon.ico',
            'logo.svg',
            'nexpos-logo.jpg',
        ];

        if (in_array($relPath, $protectedFiles) || in_array(basename($relPath), $protectedFiles)) {
            return;
        }

        // Only delete files inside companies/ or settings/ directories
        if (str_starts_with($relPath, 'companies/') || str_starts_with($relPath, 'settings/')) {
            if (Storage::disk('public')->exists($relPath)) {
                Storage::disk('public')->delete($relPath);
            }
            $fullPath = public_path('storage/' . $relPath);
            if (file_exists($fullPath) && is_file($fullPath)) {
                @unlink($fullPath);
            }
        }
    }

    /**
     * POST /api/v1/settings/logo
     */
    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo'        => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:10240',
            'company_id'  => 'nullable|integer',
        ]);

        $companyId = $request->input('company_id', 1);
        $company = Company::find($companyId) ?: Company::first();

        // 1. Identify previous old custom logo before storing new one
        $oldLogo = Setting::where('key', 'site_logo')->value('value')
            ?: ($company?->logo ?: null);

        // 2. Store new logo file
        $file = $request->file('logo');
        $filename = 'logo_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $storedRel = $file->storeAs('companies', $filename, 'public');
        $path = 'storage/' . $storedRel;

        // 3. Delete previous old logo file from disk to prevent storage accumulation
        $this->deleteOldLogoFile($oldLogo);

        // 4. Update Database
        if ($company) {
            $company->update(['logo' => $path]);
        }
        // Also update all companies so multi-tenant default stays consistent
        Company::query()->update(['logo' => $path]);

        Setting::updateOrCreate(
            ['company_id' => $company?->id ?? 1, 'key' => 'site_logo'],
            ['value' => $path, 'type' => 'string', 'group' => 'general']
        );

        $this->clearStorefrontCache();

        return $this->successResponse([
            'logo_url'     => $path,
            'company_id'   => $company?->id,
            'company_name' => $company?->name,
        ], 'Logo uploaded and old file cleaned up successfully.');
    }

    /**
     * DELETE /api/v1/settings/logo
     */
    public function removeLogo(Request $request): JsonResponse
    {
        $companyId = $request->input('company_id', 1);
        $company = Company::find($companyId) ?: Company::first();

        // 1. Delete previous custom logo file from disk
        $oldLogo = Setting::where('key', 'site_logo')->value('value')
            ?: ($company?->logo ?: null);
        $this->deleteOldLogoFile($oldLogo);

        // 2. Reset back to official default logo
        $defaultLogo = 'storage/companies/nexpos-logo.jpg';
        if ($company) {
            $company->update(['logo' => $defaultLogo]);
        }
        Company::query()->update(['logo' => $defaultLogo]);

        Setting::updateOrCreate(
            ['company_id' => $company?->id ?? 1, 'key' => 'site_logo'],
            ['value' => $defaultLogo, 'type' => 'string', 'group' => 'general']
        );

        $this->clearStorefrontCache();

        return $this->successResponse([
            'logo_url'     => $defaultLogo,
            'company_id'   => $company?->id,
            'company_name' => $company?->name,
        ], 'Logo removed from disk and reset to default successfully.');
    }
}
