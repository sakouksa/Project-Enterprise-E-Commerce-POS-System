<?php

namespace App\Infrastructure\Services\Auth;

use App\Models\User;
use App\Models\Auth\JwtRefreshToken;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Exception;

class JwtTokenService
{
    private string $secret;
    private string $algo;
    private int $accessTtlMinutes;
    private int $refreshTtlDays;

    public function __construct()
    {
        $this->secret = config('app.jwt_secret', config('app.key', 'enterprise_jwt_default_secret_key_32bytes!'));
        $this->algo = 'HS256';
        $this->accessTtlMinutes = (int) config('app.jwt_access_ttl', 60); // 60 mins
        $this->refreshTtlDays = (int) config('app.jwt_refresh_ttl', 30);   // 30 days
    }

    /**
     * Generate Access Token (JWT)
     */
    public function generateAccessToken(User $user): array
    {
        $now = time();
        $expiresAt = $now + ($this->accessTtlMinutes * 60);

        $roles = $user->roles->pluck('name')->toArray();
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();

        $payload = [
            'iss'        => config('app.url', 'http://127.0.0.1:8001'),
            'sub'        => (string) $user->id,
            'iat'        => $now,
            'exp'        => $expiresAt,
            'nbf'        => $now,
            'user'       => [
                'id'         => $user->id,
                'username'   => $user->username,
                'name'       => $user->name,
                'email'      => $user->email,
                'company_id' => $user->company_id,
                'branch_id'  => $user->branch_id,
            ],
            'roles'       => $roles,
            'permissions' => $permissions,
        ];

        $token = JWT::encode($payload, $this->getSecretKey(), $this->algo);

        return [
            'token'      => $token,
            'expires_at' => $expiresAt,
            'ttl'        => $this->accessTtlMinutes * 60,
        ];
    }

    /**
     * Decode and validate Access Token
     */
    public function decodeAccessToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key($this->getSecretKey(), $this->algo));
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Generate & Store Refresh Token
     */
    public function createRefreshToken(User $user, ?array $clientInfo = null): string
    {
        $plainToken = Str::random(80);
        $expiresAt = Carbon::now()->addDays($this->refreshTtlDays);

        JwtRefreshToken::create([
            'user_id'    => $user->id,
            'token'      => hash('sha256', $plainToken),
            'device'     => $clientInfo['device'] ?? null,
            'browser'    => $clientInfo['browser'] ?? null,
            'os'         => $clientInfo['os'] ?? null,
            'ip_address' => $clientInfo['ip_address'] ?? null,
            'expires_at' => $expiresAt,
            'revoked'    => false,
        ]);

        return $plainToken;
    }

    /**
     * Rotate Refresh Token (revokes old, issues new access + refresh pair)
     */
    public function rotateRefreshToken(string $plainRefreshToken, ?array $clientInfo = null): ?array
    {
        $hashed = hash('sha256', $plainRefreshToken);
        $refreshTokenRecord = JwtRefreshToken::where('token', $hashed)->first();

        if (!$refreshTokenRecord || !$refreshTokenRecord->isValid()) {
            return null;
        }

        $user = $refreshTokenRecord->user;
        if (!$user || !$user->is_active || $user->isLocked() || $user->trashed()) {
            return null;
        }

        // Revoke current token (rotation)
        $refreshTokenRecord->update(['revoked' => true]);

        // Issue new tokens
        $accessTokenData = $this->generateAccessToken($user);
        $newRefreshToken = $this->createRefreshToken($user, $clientInfo);

        return [
            'user'          => $user,
            'access_token'  => $accessTokenData['token'],
            'refresh_token' => $newRefreshToken,
            'expires_in'    => $accessTokenData['ttl'],
        ];
    }

    /**
     * Revoke single Refresh Token
     */
    public function revokeRefreshToken(string $plainRefreshToken): void
    {
        $hashed = hash('sha256', $plainRefreshToken);
        JwtRefreshToken::where('token', $hashed)->update(['revoked' => true]);
    }

    /**
     * Revoke all Refresh Tokens for User
     */
    public function revokeAllUserTokens(int $userId): void
    {
        JwtRefreshToken::where('user_id', $userId)->update(['revoked' => true]);
    }

    private function getSecretKey(): string
    {
        return $this->secret;
    }
}
