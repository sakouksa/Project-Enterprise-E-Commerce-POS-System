<?php

namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Product\Attribute;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttributeController extends BaseApiController
{
    /**
     * GET /api/v1/attributes
     */
    public function index(Request $request): JsonResponse
    {
        $attributes = Attribute::with('values')
            ->when($request->search, fn($q, $v) => $q->where('name', 'like', "%{$v}%"))
            ->paginate($request->integer('per_page', 10));

        return $this->paginatedResponse($attributes);
    }

    /**
     * GET /api/v1/attributes/{id}
     */
    public function show(int $id): JsonResponse
    {
        $attribute = Attribute::with('values')->findOrFail($id);
        return $this->successResponse($attribute);
    }

    /**
     * POST /api/v1/attributes
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'name'       => 'required|string|max:100',
        ]);

        $attribute = Attribute::create($data);

        return $this->successResponse($attribute, 'Attribute created successfully', 201);
    }

    /**
     * PUT /api/v1/attributes/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $attribute = Attribute::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:100',
        ]);

        $attribute->update($data);

        return $this->successResponse($attribute, 'Attribute updated successfully');
    }

    /**
     * DELETE /api/v1/attributes/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $attribute = Attribute::findOrFail($id);
        $attribute->delete();

        return $this->successResponse(null, 'Attribute deleted successfully');
    }
}
