<?php

namespace App\Infrastructure\Services\Auth;

use App\Models\User;
use App\Models\Employee\Employee;
use App\Models\Log\LoginHistory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AuthService
{
    public function __construct(private readonly JwtTokenService $jwtTokenService)
    {
    }

    public function login(string $usernameInput, string $password, bool $rememberDevice = false, ?array $clientInfo = null): array
    {
        $identifier = trim($usernameInput);

        if (empty($identifier)) {
            return ['success' => false, 'message' => 'Username required.', 'code' => 422];
        }

        if (empty($password)) {
            return ['success' => false, 'message' => 'Password required.', 'code' => 422];
        }

        // 1. Search by Username, Email, or Phone
        $user = User::withTrashed()
            ->where('username', $identifier)
            ->orWhere('email', $identifier)
            ->orWhere('phone', $identifier)
            ->first();

        // 2. If not found by Username/Phone, search by Employee Number (EMP-XXXX)
        if (!$user) {
            $employee = Employee::where('employee_number', $identifier)->first();
            if ($employee && $employee->user_id) {
                $user = User::withTrashed()->find($employee->user_id);
            }
        }

        // 3. User Existence Check
        if (!$user) {
            return ['success' => false, 'message' => 'Username does not exist.', 'code' => 404];
        }

        // 4. Soft Deleted User Check
        if ($user->trashed()) {
            return ['success' => false, 'message' => 'This account no longer exists.', 'code' => 404];
        }

        // 5. Check if Account is Temporarily Locked
        if ($user->isLocked()) {
            return [
                'success' => false,
                'message' => 'Account is temporarily locked due to 5 failed attempts. Please try again after 15 minutes.',
                'code'    => 429,
            ];
        }

        // 6. Check Active Status
        if (!$user->is_active) {
            return [
                'success' => false,
                'message' => 'Your account has been disabled. Please contact the administrator.',
                'code'    => 403,
            ];
        }

        // 7. Check Employee Status if linked
        if ($user->employee) {
            $empStatus = strtolower($user->employee->status ?? '');
            if ($empStatus === 'inactive') {
                return [
                    'success' => false,
                    'message' => 'Your employee account is inactive.',
                    'code'    => 403,
                ];
            }
            if ($empStatus === 'resigned' || $empStatus === 'terminated') {
                return [
                    'success' => false,
                    'message' => 'Your account is no longer active.',
                    'code'    => 403,
                ];
            }
        }

        // 8. Password Verification
        if (!Hash::check($password, $user->password)) {
            $newAttempts = $user->failed_login_attempts + 1;
            $lockedUntil = null;

            if ($newAttempts >= 5) {
                $lockedUntil = Carbon::now()->addMinutes(15);
            }

            $user->update([
                'failed_login_attempts' => $newAttempts,
                'locked_until'          => $lockedUntil,
            ]);

            $this->logLoginAttempt($user->id, false, $clientInfo);

            if ($newAttempts >= 5) {
                return [
                    'success' => false,
                    'message' => 'Account is temporarily locked due to 5 failed attempts. Please try again after 15 minutes.',
                    'code'    => 429,
                ];
            }

            return ['success' => false, 'message' => 'Incorrect password.', 'code' => 401];
        }

        // 9. Login Success - Reset Security Counters
        $user->update([
            'failed_login_attempts' => 0,
            'locked_until'          => null,
            'last_login_at'         => Carbon::now(),
        ]);

        $this->logLoginAttempt($user->id, true, $clientInfo);

        // 10. Generate Tokens
        $tokenData = $this->jwtTokenService->generateAccessToken($user);
        $refreshToken = $this->jwtTokenService->createRefreshToken($user, $clientInfo);

        return [
            'success'       => true,
            'user'          => $user,
            'access_token'  => $tokenData['token'],
            'refresh_token' => $refreshToken,
            'expires_in'    => $tokenData['ttl'],
        ];
    }

    public function refreshToken(string $refreshToken, ?array $clientInfo = null): array
    {
        $result = $this->jwtTokenService->rotateRefreshToken($refreshToken, $clientInfo);

        if (!$result) {
            return ['success' => false, 'message' => 'Unable to refresh your session.', 'code' => 401];
        }

        return [
            'success'       => true,
            'user'          => $result['user'],
            'access_token'  => $result['access_token'],
            'refresh_token' => $result['refresh_token'],
            'expires_in'    => $result['expires_in'],
        ];
    }

    public function logout(string $refreshToken): void
    {
        $this->jwtTokenService->revokeRefreshToken($refreshToken);
    }

    public function logoutAllDevices(int $userId): void
    {
        $this->jwtTokenService->revokeAllUserTokens($userId);
    }

    public function changePassword(User $user, string $currentPassword, string $newPassword): bool
    {
        if (!Hash::check($currentPassword, $user->password)) {
            return false;
        }

        $user->update(['password' => Hash::make($newPassword)]);
        $this->jwtTokenService->revokeAllUserTokens($user->id);

        return true;
    }

    private function logLoginAttempt(int $userId, bool $success, ?array $clientInfo = null): void
    {
        LoginHistory::create([
            'user_id'    => $userId,
            'ip_address' => $clientInfo['ip_address'] ?? request()->ip(),
            'user_agent' => $clientInfo['user_agent'] ?? request()->userAgent(),
            'device'     => $clientInfo['device'] ?? 'Desktop/Browser',
            'browser'    => $clientInfo['browser'] ?? 'Browser',
            'platform'   => $clientInfo['os'] ?? 'Unknown OS',
            'country'    => $clientInfo['country'] ?? 'Internal',
            'os'         => $clientInfo['os'] ?? 'Unknown OS',
            'success'    => $success,
        ]);
    }
}
