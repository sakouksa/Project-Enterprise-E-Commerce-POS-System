<?php

namespace App\Http\Controllers\Api\V1\Setting;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Marketing\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $query = Banner::query();

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $banners = $query->orderBy('sort_order')->orderByDesc('id')->paginate($request->get('per_page', 10));

        return $this->paginatedResponse($banners);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'company_id' => 'nullable|integer',
            'store_id'   => 'nullable|integer',
            'title'      => 'required|string|max:255',
            'subtitle'   => 'nullable|string|max:255',
            'image'      => 'nullable',
            'image_url'  => 'nullable',
            'image_file' => 'nullable',
            'link'       => 'nullable|string',
            'link_url'   => 'nullable|string',
            'position'   => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active'  => 'nullable',
            'starts_at'  => 'nullable|date',
            'ends_at'    => 'nullable|date',
        ]);

        $validated['company_id'] = $request->input('company_id') ?? auth()->user()?->company_id ?? 1;
        $validated['image'] = $this->processBannerImage($request);
        $validated['link'] = $request->input('link') ?? $request->input('link_url');
        $validated['is_active'] = filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN);

        unset($validated['image_url'], $validated['link_url'], $validated['image_file']);

        $positionMap = [
            'home_hero'      => 'hero',
            'home_secondary' => 'sidebar',
            'category'       => 'sidebar',
        ];
        if (isset($validated['position']) && isset($positionMap[$validated['position']])) {
            $validated['position'] = $positionMap[$validated['position']];
        }

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
            'company_id' => 'nullable|integer',
            'store_id'   => 'nullable|integer',
            'title'      => 'sometimes|required|string|max:255',
            'subtitle'   => 'nullable|string|max:255',
            'image'      => 'nullable',
            'image_url'  => 'nullable',
            'image_file' => 'nullable',
            'link'       => 'nullable|string',
            'link_url'   => 'nullable|string',
            'position'   => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active'  => 'nullable',
            'starts_at'  => 'nullable|date',
            'ends_at'    => 'nullable|date',
        ]);

        $validated['image'] = $this->processBannerImage($request, $banner->image);

        if ($request->has('link') || $request->has('link_url')) {
            $validated['link'] = $request->input('link') ?? $request->input('link_url');
        }

        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        unset($validated['image_url'], $validated['link_url'], $validated['image_file']);

        $positionMap = [
            'home_hero'      => 'hero',
            'home_secondary' => 'sidebar',
            'category'       => 'sidebar',
        ];
        if (isset($validated['position']) && isset($positionMap[$validated['position']])) {
            $validated['position'] = $positionMap[$validated['position']];
        }

        $banner->update($validated);

        return $this->successResponse($banner, 'Banner updated successfully.');
    }

    public function destroy(int $id): JsonResponse
    {
        $banner = Banner::findOrFail($id);
        $banner->forceDelete();

        return $this->successResponse(null, 'Banner deleted successfully.');
    }

    private function processBannerImage(Request $request, ?string $existingImage = null): ?string
    {
        // 1. Check for Multipart File Upload
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            if ($file && $file->isValid()) {
                return $file->store('banners', 'public');
            }
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            if ($file && is_object($file) && method_exists($file, 'store') && $file->isValid()) {
                return $file->store('banners', 'public');
            }
        }

        // 2. Check for Base64 Encoded Image Data (AVIF, WEBP, PNG, JPEG, SVG, GIF, BMP, etc.)
        $rawImage = $request->input('image') ?? $request->input('image_url');
        if (is_array($rawImage)) {
            $rawImage = reset($rawImage) ?: null;
        }

        if (is_string($rawImage) && str_starts_with($rawImage, 'data:image')) {
            try {
                $parts = explode(',', $rawImage);
                if (count($parts) === 2) {
                    $header = strtolower($parts[0]); // e.g. "data:image/avif;base64" or "data:image/svg+xml;base64"
                    $data = $parts[1];

                    $ext = 'jpg';
                    if (preg_match('/data:image\/([^;]+);base64/', $header, $matches)) {
                        $rawSub = strtolower($matches[1]);
                        if ($rawSub === 'svg+xml') {
                            $ext = 'svg';
                        } elseif ($rawSub === 'jpeg') {
                            $ext = 'jpg';
                        } elseif (preg_match('/^[a-z0-9]+$/', $rawSub)) {
                            $ext = $rawSub; // supports avif, webp, png, gif, bmp, ico, etc.
                        }
                    }

                    $decoded = base64_decode($data);
                    if ($decoded !== false && strlen($decoded) > 0) {
                        $fileName = 'banners/banner_' . time() . '_' . uniqid() . '.' . $ext;
                        Storage::disk('public')->put($fileName, $decoded);
                        return $fileName;
                    }
                }
            } catch (\Throwable $e) {
                // Ignore base64 error
            }
        }

        // 3. Check for Existing String URL or relative path
        if (is_string($rawImage) && !empty($rawImage) && $rawImage !== '[]' && $rawImage !== '""' && !str_starts_with($rawImage, 'blob:')) {
            if (str_contains($rawImage, '/storage/')) {
                return substr($rawImage, strpos($rawImage, '/storage/') + 9);
            }
            return $rawImage;
        }

        // 4. Preserve existing image if editing
        if (!empty($existingImage) && $existingImage !== '[]' && !str_contains($existingImage, 'blob:http')) {
            return $existingImage;
        }

        return 'banners/promo-banner-1.jpg';
    }
}
