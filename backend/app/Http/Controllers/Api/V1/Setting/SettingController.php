<?php

namespace App\Http\Controllers\Api\V1\Setting;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Setting\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

        return $this->successResponse(Setting::all(), 'Settings updated successfully');
    }
}
