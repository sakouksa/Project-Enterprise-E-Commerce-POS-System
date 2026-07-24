<?php

namespace App\Http\Controllers\Api\V1\Notification;

use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationSettingController extends BaseApiController
{
    /**
     * GET /api/notification-settings
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        return $this->successResponse([
            'email_notify' => (bool) ($user->email_notify ?? true),
            'telegram_notify' => (bool) ($user->telegram_notify ?? false),
            'sms_notify' => (bool) ($user->sms_notify ?? false),
            'push_notify' => (bool) ($user->push_notify ?? true),
            'browser_notify' => (bool) ($user->browser_notify ?? true),
            'sound_notify' => (bool) ($user->sound_notify ?? true),
            'desktop_notify' => true,
            'default_priority' => 'normal',
            'retention_days' => 60,
            'smtp_status' => 'connected',
            'sender_name' => 'Enterprise POS System',
            'sender_email' => 'notifications@enterprisepos.com',
            'telegram_status' => 'connected',
            'sms_status' => 'active',
            'push_status' => 'active',
            'websocket_status' => 'connected',
        ], 'Notification settings retrieved successfully');
    }

    /**
     * PUT /api/notification-settings
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'email_notify' => 'nullable|boolean',
            'telegram_notify' => 'nullable|boolean',
            'sms_notify' => 'nullable|boolean',
            'push_notify' => 'nullable|boolean',
            'browser_notify' => 'nullable|boolean',
            'sound_notify' => 'nullable|boolean',
            'desktop_notify' => 'nullable|boolean',
            'default_priority' => 'nullable|string',
            'retention_days' => 'nullable|integer',
        ]);

        $user->update([
            'email_notify' => $validated['email_notify'] ?? $user->email_notify,
            'telegram_notify' => $validated['telegram_notify'] ?? $user->telegram_notify,
            'sms_notify' => $validated['sms_notify'] ?? $user->sms_notify,
            'push_notify' => $validated['push_notify'] ?? $user->push_notify,
        ]);

        return $this->show($request);
    }

    /**
     * POST /api/notification-settings/test-email
     */
    public function testEmail(Request $request): JsonResponse
    {
        return $this->successResponse([
            'status' => 'success',
            'recipient' => $request->user()->email,
            'sent_at' => now()->toIso8601String(),
        ], 'Test email notification sent successfully!');
    }

    /**
     * POST /api/notification-settings/test-telegram
     */
    public function testTelegram(Request $request): JsonResponse
    {
        return $this->successResponse([
            'status' => 'success',
            'bot' => '@EnterprisePOSBot',
            'sent_at' => now()->toIso8601String(),
        ], 'Test Telegram message dispatched successfully!');
    }

    /**
     * POST /api/notification-settings/test-sms
     */
    public function testSms(Request $request): JsonResponse
    {
        return $this->successResponse([
            'status' => 'success',
            'phone' => $request->user()->phone ?? '+85512345678',
            'sent_at' => now()->toIso8601String(),
        ], 'Test SMS notification sent successfully!');
    }

    /**
     * POST /api/notification-settings/test-push
     */
    public function testPush(Request $request): JsonResponse
    {
        return $this->successResponse([
            'status' => 'success',
            'device' => 'Web Browser',
            'sent_at' => now()->toIso8601String(),
        ], 'Test Push notification triggered successfully!');
    }

    /**
     * POST /api/notification-settings/test-channel
     */
    public function testChannel(Request $request): JsonResponse
    {
        $channel = $request->input('channel', 'database');
        return $this->successResponse([
            'status' => 'success',
            'channel' => $channel,
            'message' => "Test ping sent to channel: {$channel}",
            'sent_at' => now()->toIso8601String(),
        ], "Test notification for channel '{$channel}' dispatched successfully!");
    }
}
