<?php

namespace App\Services\Employee;

use App\Models\Employee\AttendanceQrSession;
use App\Models\Employee\Shift;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class QrAttendanceService
{
    /**
     * Generate a new dynamic QR token for a company kiosk display.
     */
    public function generateDynamicQr(
        int $companyId,
        int $branchId,
        ?int $shiftId = null,
        int $intervalSeconds = 30
    ): array {
        $uuid = (string) Str::uuid();
        $expiresAt = Carbon::now()->addSeconds($intervalSeconds + 5); // 5s buffer for network latency
        $date = Carbon::now()->format('Y-m-d');
        
        $payload = [
            'company_id'  => $companyId,
            'branch_id'   => $branchId,
            'shift_id'    => $shiftId,
            'date'        => $date,
            'random_uuid' => $uuid,
            'expires_at'  => $expiresAt->timestamp,
        ];

        $jsonPayload = json_encode($payload);
        $signature = hash_hmac('sha256', $jsonPayload, config('app.key'));
        $payload['signature'] = $signature;

        $encryptedToken = Crypt::encrypt($payload);

        AttendanceQrSession::create([
            'company_id'       => $companyId,
            'branch_id'        => $branchId,
            'shift_id'         => $shiftId,
            'qr_token'         => $encryptedToken,
            'random_uuid'      => $uuid,
            'secret_signature' => $signature,
            'qr_expired_at'    => $expiresAt,
            'interval_seconds' => $intervalSeconds,
        ]);

        return [
            'qr_token'         => $encryptedToken,
            'expires_at'       => $expiresAt->toIso8601String(),
            'interval_seconds' => $intervalSeconds,
            'company_id'       => $companyId,
            'branch_id'        => $branchId,
            'shift_id'         => $shiftId,
        ];
    }

    /**
     * Decrypt and validate QR payload token.
     */
    public function validateQrToken(string $encryptedToken, int $employeeCompanyId, int $employeeBranchId): array
    {
        try {
            $payload = Crypt::decrypt($encryptedToken);
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'qr_token' => ['Invalid or tampered QR Code token.']
            ]);
        }

        if (!isset($payload['expires_at'], $payload['signature'], $payload['company_id'], $payload['branch_id'])) {
            throw ValidationException::withMessages([
                'qr_token' => ['Malformed QR Code structure.']
            ]);
        }

        // 1. Check expiration
        if (Carbon::now()->timestamp > $payload['expires_at']) {
            throw ValidationException::withMessages([
                'qr_token' => ['QR Code has expired. Please scan the newly generated QR Code on the kiosk.']
            ]);
        }

        // 2. Validate HMAC signature
        $unsignedPayload = [
            'company_id'  => $payload['company_id'],
            'branch_id'   => $payload['branch_id'],
            'shift_id'    => $payload['shift_id'] ?? null,
            'date'        => $payload['date'],
            'random_uuid' => $payload['random_uuid'],
            'expires_at'  => $payload['expires_at'],
        ];
        $expectedSignature = hash_hmac('sha256', json_encode($unsignedPayload), config('app.key'));

        if (!hash_equals($expectedSignature, $payload['signature'])) {
            throw ValidationException::withMessages([
                'qr_token' => ['QR Code digital signature verification failed.']
            ]);
        }

        // 3. Verify company & branch match
        if ($payload['company_id'] != $employeeCompanyId) {
            throw ValidationException::withMessages([
                'company_id' => ['QR Code belongs to another company. Access denied.']
            ]);
        }

        if ($payload['branch_id'] != $employeeBranchId) {
            throw ValidationException::withMessages([
                'branch_id' => ['QR Code belongs to another branch location. Access denied.']
            ]);
        }

        return $payload;
    }
}
