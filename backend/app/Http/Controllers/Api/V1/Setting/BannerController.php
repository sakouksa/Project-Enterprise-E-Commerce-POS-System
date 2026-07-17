<?php

namespace App\Http\Controllers\Api\V1\Setting;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Marketing\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BannerController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $query = Banner::query();

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $banners = $query->orderBy('sort_order')->paginate($request->get('per_page', 10));

        return $this->paginatedResponse($banners);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'      => 'required|string|max:255',
            'image_url'  => 'required|string',
            'link_url'   => 'nullable|string',
            'position'   => 'nullable|string|in:home_hero,home_secondary,category,popup',
            'sort_order' => 'nullable|integer',
            'is_active'  => 'boolean',
            'starts_at'  => 'nullable|date',
            'ends_at'    => 'nullable|date|after_or_equal:starts_at',
        ]);

        $banner = Banner::create($validated);

        return $this->successResponse($banner, 'Banner created successfully.', 201);
    }

    public function show(int $id): JsonResponse
    {
        $banner = Banner::findOrFail($id);

        return $this->successResponse($banner);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $banner = Banner::findOrFail($id);

        $validated = $request->validate([
            'title'      => 'sometimes|required|string|max:255',
            'image_url'  => 'sometimes|required|string',
            'link_url'   => 'nullable|string',
            'position'   => 'nullable|string|in:home_hero,home_secondary,category,popup',
            'sort_order' => 'nullable|integer',
            'is_active'  => 'boolean',
            'starts_at'  => 'nullable|date',
            'ends_at'    => 'nullable|date|after_or_equal:starts_at',
        ]);

        $banner->update($validated);

        return $this->successResponse($banner, 'Banner updated successfully.');
    }

    public function destroy(int $id): JsonResponse
    {
        Banner::findOrFail($id)->delete();

        return $this->successResponse(null, 'Banner deleted successfully.');
    }
}
