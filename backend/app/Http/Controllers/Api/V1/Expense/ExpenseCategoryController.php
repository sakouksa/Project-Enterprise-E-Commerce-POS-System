<?php

namespace App\Http\Controllers\Api\V1\Expense;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Expense\CreateExpenseCategoryRequest;
use App\Http\Requests\Expense\UpdateExpenseCategoryRequest;
use App\Http\Resources\Expense\ExpenseCategoryResource;
use App\Infrastructure\Services\Expense\ExpenseCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseCategoryController extends BaseApiController
{
    public function __construct(private readonly ExpenseCategoryService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $records = $this->service->getPaginated($request->get('per_page', 15));
        return $this->successResponse(
            ExpenseCategoryResource::collection($records),
            'ExpenseCategory list retrieved successfully'
        );
    }

    public function store(CreateExpenseCategoryRequest $request): JsonResponse
    {
        $record = $this->service->create($request->validated());
        return $this->successResponse(
            new ExpenseCategoryResource($record),
            'ExpenseCategory created successfully',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->service->getById($id);
        return $this->successResponse(
            new ExpenseCategoryResource($record),
            'ExpenseCategory details retrieved successfully'
        );
    }

    public function update(UpdateExpenseCategoryRequest $request, int $id): JsonResponse
    {
        $record = $this->service->update($id, $request->validated());
        return $this->successResponse(
            new ExpenseCategoryResource($record),
            'ExpenseCategory updated successfully'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(
            null,
            'ExpenseCategory deleted successfully'
        );
    }
}
