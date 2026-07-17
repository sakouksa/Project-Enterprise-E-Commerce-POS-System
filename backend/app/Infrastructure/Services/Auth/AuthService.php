<?php

namespace App\Infrastructure\Services\Auth;

use App\Models\User;
use App\Models\Log\LoginHistory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuthService
{
    public function login(string $email, string $password, bool $remember = false): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            $this->logLoginAttempt($user?->id, false);
            return ['success' => false, 'message' => 'Invalid credentials'];
        }

        if (!$user->is_active) {
            return ['success' => false, 'message' => 'Account is disabled'];
        }

        $user->update(['last_login_at' => now()]);
        $this->logLoginAttempt($user->id, true);

        $token = $user->createToken('api-token', ['*'], $remember ? null : now()->addWeek())->plainTextToken;

        return ['success' => true, 'user' => $user, 'token' => $token];
    }

    public function register(array $data): array
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'phone'    => $data['phone'] ?? null,
        ]);

        $user->assignRole('customer');

        $token = $user->createToken('api-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    public function logoutAllDevices(User $user): void
    {
        $user->tokens()->delete();
    }

    public function updateProfile(User $user, array $data): User
    {
        $user->update(array_filter([
            'name'  => $data['name'] ?? null,
            'phone' => $data['phone'] ?? null,
        ]));

        return $user->fresh();
    }

    public function changePassword(User $user, string $currentPassword, string $newPassword): bool
    {
        if (!Hash::check($currentPassword, $user->password)) {
            return false;
        }

        $user->update(['password' => Hash::make($newPassword)]);
        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

        return true;
    }

    private function logLoginAttempt(?int $userId, bool $success): void
    {
        if ($userId) {
            LoginHistory::create([
                'user_id'    => $userId,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'success'    => $success,
            ]);
        }
    }
}
