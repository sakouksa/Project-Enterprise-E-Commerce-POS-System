<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\UserResource;
use App\Infrastructure\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends BaseApiController
{
    public function __construct(private readonly AuthService $authService)
    {
    }

    /**
     * POST /api/v1/auth/login
     */
     public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(
            $request->email,
            $request->password,
            $request->remember ?? false
        );

        if (!$result['success']) {
            return $this->errorResponse($result['message'], null, 401);
        }

        $user = $result['user']->load(['roles', 'permissions', 'company', 'branch']);

        return $this->successResponse([
            'user'  => new UserResource($user),
            'token' => $result['token'],
        ], 'Login successful');
    }

    /**
     * POST /api/v1/auth/register
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        $user = $result['user']->load(['roles', 'permissions', 'company', 'branch']);

        return $this->successResponse([
            'user'  => new UserResource($user),
            'token' => $result['token'],
        ], 'Registration successful', 201);
    }

    /**
     * POST /api/v1/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return $this->successResponse(null, 'Logged out successfully');
    }

    /**
     * GET /api/v1/auth/profile
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user()->load(['roles', 'permissions', 'company', 'branch']);

        return $this->successResponse(new UserResource($user));
    }

    /**
     * PUT /api/v1/auth/profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $this->authService->updateProfile($request->user(), $request->validated());
        $user->load(['roles', 'permissions', 'company', 'branch']);

        return $this->successResponse(new UserResource($user), 'Profile updated successfully');
    }

    /**
     * POST /api/v1/auth/change-password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        $result = $this->authService->changePassword(
            $request->user(),
            $request->current_password,
            $request->password
        );

        if (!$result) {
            return $this->errorResponse('Current password is incorrect', null, 422);
        }

        return $this->successResponse(null, 'Password changed successfully');
    }
}
