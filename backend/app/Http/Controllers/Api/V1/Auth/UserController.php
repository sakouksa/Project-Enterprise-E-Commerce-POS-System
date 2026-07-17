<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends BaseApiController
{
    /**
     * GET /api/v1/users
     */
    public function index(Request $request): JsonResponse
    {
        $users = User::with('roles')
            ->when($request->search, fn($q, $v) => $q->where('name', 'like', "%{$v}%")->orWhere('email', 'like', "%{$v}%"))
            ->paginate($request->integer('per_page', 15));

        return $this->paginatedResponse($users);
    }

    /**
     * GET /api/v1/users/{id}
     */
    public function show(int $id): JsonResponse
    {
        $user = User::with('roles')->findOrFail($id);
        return $this->successResponse($user);
    }

    /**
     * POST /api/v1/users
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'       => 'required|string|max:100',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|string|min:6',
            'role'       => 'required|string|exists:roles,name',
            'company_id' => 'required|exists:companies,id',
            'branch_id'  => 'required|exists:branches,id',
        ]);

        $role = $data['role'];
        unset($data['role']);

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);
        $user->assignRole($role);

        return $this->successResponse($user, 'User created successfully', 201);
    }

    /**
     * PUT /api/v1/users/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name'  => 'sometimes|required|string|max:100',
            'email' => "sometimes|required|email|unique:users,email,{$id}",
            'role'  => 'sometimes|required|string|exists:roles,name',
        ]);

        if (isset($data['role'])) {
            $user->syncRoles([$data['role']]);
            unset($data['role']);
        }

        $user->update($data);

        return $this->successResponse($user, 'User updated successfully');
    }

    /**
     * DELETE /api/v1/users/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();

        return $this->successResponse(null, 'User deleted successfully');
    }
}
