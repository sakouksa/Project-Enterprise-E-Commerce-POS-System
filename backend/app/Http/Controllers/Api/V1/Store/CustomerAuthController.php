<?php

namespace App\Http\Controllers\Api\V1\Store;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\User;
use App\Models\Customer\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class CustomerAuthController extends BaseApiController
{
    // ─── POST /api/v1/store/auth/register ────────────────────────────────────

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:191',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone'    => 'nullable|string|max:50',
            'gender'   => 'nullable|in:male,female,other',
        ]);

        $result = DB::transaction(function () use ($validated) {
            // Create user account
            $user = User::create([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone'    => $validated['phone'] ?? null,
            ]);

            // Assign customer role
            $user->assignRole('customer');

            // Create customer profile
            $customer = Customer::create([
                'user_id' => $user->id,
                'name'    => $validated['name'],
                'email'   => $validated['email'],
                'phone'   => $validated['phone'] ?? null,
                'gender'  => $validated['gender'] ?? null,
                'is_active' => true,
            ]);

            return compact('user', 'customer');
        });

        // Generate JWT
        $token = JWTAuth::fromUser($result['user']);

        return $this->successResponse([
            'user'         => [
                'id'    => $result['user']->id,
                'name'  => $result['user']->name,
                'email' => $result['user']->email,
            ],
            'customer'     => [
                'id'    => $result['customer']->id,
                'name'  => $result['customer']->name,
                'email' => $result['customer']->email,
            ],
            'access_token' => $token,
            'token_type'   => 'bearer',
        ], 'Registration successful', 201);
    }

    // ─── POST /api/v1/store/auth/login ───────────────────────────────────────

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
            'remember' => 'boolean',
        ]);

        $credentials = [
            'email'    => $validated['email'],
            'password' => $validated['password'],
        ];

        if (!$token = JWTAuth::attempt($credentials)) {
            return $this->errorResponse('Invalid email or password', null, 401);
        }

        $user     = auth()->user();
        $customer = Customer::where('user_id', $user->id)->first();

        if (!$customer || !$customer->is_active) {
            return $this->errorResponse('Your account is inactive. Please contact support.', null, 403);
        }

        return $this->successResponse([
            'user'         => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
            'customer'     => [
                'id'             => $customer->id,
                'name'           => $customer->name,
                'email'          => $customer->email,
                'phone'          => $customer->phone,
                'photo'          => $customer->photo,
                'loyalty_points' => (float) $customer->loyalty_points,
            ],
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => config('jwt.ttl') * 60,
        ], 'Login successful');
    }

    // ─── POST /api/v1/store/auth/logout ──────────────────────────────────────

    public function logout(Request $request): JsonResponse
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (\Exception) {
            // Token might already be invalid
        }

        return $this->successResponse(null, 'Logged out successfully');
    }

    // ─── GET /api/v1/store/auth/me ───────────────────────────────────────────

    public function me(Request $request): JsonResponse
    {
        $user     = $request->user();
        $customer = Customer::where('user_id', $user->id)
            ->with(['addresses', 'group'])
            ->first();

        return $this->successResponse([
            'user'     => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'customer' => $customer ? [
                'id'             => $customer->id,
                'name'           => $customer->name,
                'email'          => $customer->email,
                'phone'          => $customer->phone,
                'gender'         => $customer->gender,
                'birth_date'     => $customer->birth_date?->format('Y-m-d'),
                'photo'          => $customer->photo,
                'loyalty_points' => (float) $customer->loyalty_points,
                'total_spent'    => (float) $customer->total_spent,
                'order_count'    => (int) $customer->order_count,
                'group'          => $customer->group?->name,
                'addresses'      => $customer->addresses,
            ] : null,
        ]);
    }

    // ─── PUT /api/v1/store/auth/profile ──────────────────────────────────────

    public function updateProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'       => 'sometimes|string|max:191',
            'phone'      => 'nullable|string|max:50',
            'gender'     => 'nullable|in:male,female,other',
            'birth_date' => 'nullable|date',
        ]);

        $user     = $request->user();
        $customer = Customer::where('user_id', $user->id)->first();

        DB::transaction(function () use ($user, $customer, $validated) {
            if (isset($validated['name'])) {
                $user->update(['name' => $validated['name'], 'phone' => $validated['phone'] ?? $user->phone]);
            }

            if ($customer) {
                $customer->update(array_filter([
                    'name'       => $validated['name'] ?? null,
                    'phone'      => $validated['phone'] ?? null,
                    'gender'     => $validated['gender'] ?? null,
                    'birth_date' => $validated['birth_date'] ?? null,
                ]));
            }
        });

        return $this->successResponse(null, 'Profile updated successfully');
    }

    // ─── POST /api/v1/store/auth/change-password ─────────────────────────────

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return $this->errorResponse('Current password is incorrect', null, 422);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        return $this->successResponse(null, 'Password changed successfully');
    }

    // ─── POST /api/v1/store/auth/forgot-password ─────────────────────────────

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Don't reveal if email exists
            return $this->successResponse(null, 'If this email exists, a reset link has been sent.');
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        // In production: dispatch email notification
        // Mail::to($user->email)->send(new PasswordResetMail($token));

        return $this->successResponse(
            ['reset_token' => $token], // In production: remove this, only send via email
            'Password reset link has been sent to your email'
        );
    }

    // ─── POST /api/v1/store/auth/reset-password ──────────────────────────────

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'token'    => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $reset = DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->first();

        if (!$reset || !Hash::check($validated['token'], $reset->token)) {
            return $this->errorResponse('Invalid or expired reset token', null, 422);
        }

        if (now()->diffInHours($reset->created_at) > 24) {
            DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();
            return $this->errorResponse('Reset token has expired', null, 422);
        }

        $user = User::where('email', $validated['email'])->first();
        if (!$user) {
            return $this->errorResponse('User not found', null, 404);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();

        return $this->successResponse(null, 'Password reset successfully');
    }
}
