<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\BaseApiController;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;

class PermissionController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $permissions = Permission::query()
            ->when($request->search, fn($q, $v) => $q->where('name', 'like', "%{$v}%"))
            ->paginate($request->integer('per_page', 20));

        return $this->paginatedResponse($permissions);
    }
}
