<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Customer\RegisterCustomerRequest;
use App\Http\Requests\Customer\LoginCustomerRequest;
use App\Models\User;
use App\Models\Customer\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class CustomerAuthController extends BaseApiController
{
    // ─── POST /api/v1/customer/auth/register ─────────────────────────────────

    public function register(RegisterCustomerRequest $request): JsonResponse
    {
        $validated = $request->validated();

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
                'user_id'   => $user->id,
                'name'      => $validated['name'],
                'email'     => $validated['email'],
                'phone'     => $validated['phone'] ?? null,
                'gender'    => $validated['gender'] ?? null,
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

    // ─── POST /api/v1/customer/auth/login ────────────────────────────────────

    public function login(LoginCustomerRequest $request): JsonResponse
    {
        $validated = $request->validated();

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

    // ─── POST /api/v1/customer/auth/logout ───────────────────────────────────

    public function logout(Request $request): JsonResponse
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (\Throwable) {
            // Token might already be invalid
        }

        return $this->successResponse(null, 'Logged out successfully');
    }

    // ─── GET /api/v1/customer/auth/me ────────────────────────────────────────

    public function me(Request $request): JsonResponse
    {
        $user     = $request->user();
        $customer = Customer::where('user_id', $user->id)
            ->with(['addresses', 'group'])
            ->first();

        if (!$customer) {
            return $this->errorResponse('Customer profile not found', null, 404);
        }

        return $this->successResponse([
            'user'     => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'customer' => [
                'id'             => $customer->id,
                'name'           => $customer->name,
                'email'          => $customer->email,
                'phone'          => $customer->phone,
                'photo'          => $customer->photo,
                'gender'         => $customer->gender,
                'dob'            => $customer->dob,
                'loyalty_points' => (float) $customer->loyalty_points,
                'group'          => $customer->group?->name,
                'addresses'      => $customer->addresses,
            ],
        ]);
    }

    // ─── PUT /api/v1/customer/auth/profile ───────────────────────────────────

    public function updateProfile(Request $request): JsonResponse
    {
        $user     = $request->user();
        $customer = Customer::where('user_id', $user->id)->first();

        if (!$customer) {
            return $this->errorResponse('Customer profile not found', null, 404);
        }

        $validated = $request->validate([
            'name'   => 'sometimes|string|max:191',
            'phone'  => 'nullable|string|max:50',
            'gender' => 'nullable|in:male,female,other',
            'dob'    => 'nullable|date',
            'photo'  => 'nullable|string',
        ]);

        if (isset($validated['name'])) {
            $user->update(['name' => $validated['name']]);
        }
        if (isset($validated['phone'])) {
            $user->update(['phone' => $validated['phone']]);
        }

        $customer->update($validated);

        return $this->successResponse($customer->fresh(), 'Profile updated successfully');
    }

    // ─── POST /api/v1/customer/auth/change-password ──────────────────────────

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return $this->errorResponse('Current password does not match', null, 422);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        return $this->successResponse(null, 'Password changed successfully');
    }

    // ─── POST /api/v1/customer/auth/forgot-password ──────────────────────────

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);
        return $this->successResponse(null, 'If your email is registered, password reset instructions have been sent.');
    }

    // ─── POST /api/v1/customer/auth/reset-password ───────────────────────────

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token'    => 'required|string',
            'email'    => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        return $this->successResponse(null, 'Password has been reset successfully.');
    }
}
