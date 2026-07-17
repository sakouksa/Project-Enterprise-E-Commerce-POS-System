<?php

namespace App\Http\Controllers\Api\V1\Order;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Review\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends BaseApiController
{
    /** Admin: list all reviews with filters */
    public function index(Request $request): JsonResponse
    {
        $query = Review::with(['user', 'product'])
            ->when($request->filled('search'), fn($q) =>
                $q->where('comment', 'like', "%{$request->search}%")
            )
            ->when($request->filled('status'), fn($q) =>
                $q->where('status', $request->status)
            )
            ->when($request->filled('rating'), fn($q) =>
                $q->where('rating', $request->rating)
            )
            ->orderBy('created_at', 'desc');

        $reviews = $query->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($reviews);
    }

    /** Customer: submit a review */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id'   => 'nullable|exists:orders,id',
            'rating'     => 'required|integer|min:1|max:5',
            'title'      => 'nullable|string|max:255',
            'comment'    => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['status']  = 'pending';

        $review = Review::create($validated);

        return $this->successResponse($review, 'Review submitted successfully.', 201);
    }

    /** Admin: approve a review */
    public function approve(int $id): JsonResponse
    {
        $review = Review::findOrFail($id);
        $review->update(['status' => 'approved']);

        return $this->successResponse($review, 'Review approved.');
    }

    /** Admin: reject a review */
    public function reject(int $id): JsonResponse
    {
        $review = Review::findOrFail($id);
        $review->update(['status' => 'rejected']);

        return $this->successResponse($review, 'Review rejected.');
    }

    /** Admin: delete a review */
    public function destroy(int $id): JsonResponse
    {
        Review::findOrFail($id)->delete();

        return $this->successResponse(null, 'Review deleted.');
    }
}
