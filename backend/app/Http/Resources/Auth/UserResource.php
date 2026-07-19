<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $avatarUrl = $this->avatar;
        if ($avatarUrl && !str_starts_with($avatarUrl, 'http') && !str_starts_with($avatarUrl, 'https')) {
            if (str_starts_with($avatarUrl, '/storage') || str_starts_with($avatarUrl, 'storage')) {
                $avatarUrl = asset($avatarUrl);
            } else {
                $avatarUrl = asset('storage/' . $avatarUrl);
            }
        }

        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'email'        => $this->email,
            'phone'        => $this->phone,
            'avatar'       => $avatarUrl,
            'is_active'    => $this->is_active,
            'last_login_at' => $this->last_login_at?->toIso8601String(),
            'roles'        => $this->whenLoaded('roles', fn() => $this->getRoleNames()),
            'permissions'  => $this->whenLoaded('permissions', fn() => $this->getAllPermissions()->pluck('name')),
            'company'      => $this->whenLoaded('company', fn() => [
                'id'   => $this->company?->id,
                'name' => $this->company?->name,
                'logo' => $this->company?->logo,
            ]),
            'branch' => $this->whenLoaded('branch', fn() => [
                'id'   => $this->branch?->id,
                'name' => $this->branch?->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
