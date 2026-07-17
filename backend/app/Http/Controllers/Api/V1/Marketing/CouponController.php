<?php

namespace App\Http\Controllers\Api\V1\Marketing;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Marketing\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CouponController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $query = Coupon::query()
            ->when($request->filled('search'), fn($q) =>
                $q->where('code', 'like', "%{$request->search}%")
                  ->orWhere('name', 'like', "%{$request->search}%")
            )
            ->when($request->filled('is_active'), fn($q) =>
                $q->where('is_active', (bool) $request->is_active)
            )
            ->latest();

        $coupons = $query->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($coupons);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'code'              => 'required|string|max:50|unique:coupons,code',
            'type'              => 'required|in:fixed,percentage,free_shipping',
            'value'             => 'required|numeric|min:0',
            'minimum_amount'    => 'nullable|numeric|min:0',
            'maximum_discount'  => 'nullable|numeric|min:0',
            'usage_limit'       => 'nullable|integer|min:1',
            'usage_per_user'    => 'nullable|integer|min:1',
            'starts_at'         => 'nullable|date',
            'expires_at'        => 'nullable|date|after_or_equal:starts_at',
            'is_active'         => 'boolean',
        ]);

        $coupon = Coupon::create($validated);

        return $this->successResponse($coupon, 'Coupon created successfully.', 201);
    }

    public function show(int $id): JsonResponse
    {
        return $this->successResponse(Coupon::findOrFail($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $coupon = Coupon::findOrFail($id);

        $validated = $request->validate([
            'name'              => 'sometimes|required|string|max:255',
            'code'              => "sometimes|required|string|max:50|unique:coupons,code,{$id}",
            'type'              => 'sometimes|required|in:fixed,percentage,free_shipping',
            'value'             => 'sometimes|required|numeric|min:0',
            'minimum_amount'    => 'nullable|numeric|min:0',
            'maximum_discount'  => 'nullable|numeric|min:0',
            'usage_limit'       => 'nullable|integer|min:1',
            'is_active'         => 'boolean',
            'expires_at'        => 'nullable|date',
        ]);

        $coupon->update($validated);

        return $this->successResponse($coupon, 'Coupon updated successfully.');
    }

    public function destroy(int $id): JsonResponse
    {
        Coupon::findOrFail($id)->delete();

        return $this->successResponse(null, 'Coupon deleted successfully.');
    }

    /** Generate a random unique coupon code */
    public function generateCode(): JsonResponse
    {
        do {
            $code = strtoupper(Str::random(8));
        } while (Coupon::where('code', $code)->exists());

        return $this->successResponse(['code' => $code]);
    }
}
