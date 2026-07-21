<?php

namespace App\Http\Controllers\Api\V1\Payment;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Payment\PaymentMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentMethodController extends BaseApiController
{
    public function index(Request $request): JsonResponse
    {
        $methods = PaymentMethod::query()
            ->when($request->search, fn($q, $v) => $q->where('name', 'like', "%{$v}%")->orWhere('code', 'like', "%{$v}%"))
            ->paginate($request->integer('per_page', 20));

        return $this->paginatedResponse($methods);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'company_id' => 'sometimes|integer',
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:payment_methods,code',
            'type' => 'required|string|in:cash,bank_transfer,credit_card,debit_card,ewallet,qris,other',
            'logo' => 'nullable|string',
            'config' => 'nullable|array',
            'fee_percent' => 'sometimes|numeric|min:0',
            'fee_fixed' => 'sometimes|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'available_pos' => 'sometimes|boolean',
            'available_online' => 'sometimes|boolean',
        ]);

        if (!isset($validated['company_id'])) {
            $validated['company_id'] = 1;
        }

        $record = PaymentMethod::create($validated);
        return $this->successResponse($record, 'Payment method created successfully', 201);
    }

    public function show(int $id): JsonResponse
    {
        $record = PaymentMethod::findOrFail($id);
        return $this->successResponse($record, 'Payment method details retrieved');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $record = PaymentMethod::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|unique:payment_methods,code,' . $id,
            'type' => 'sometimes|required|string|in:cash,bank_transfer,credit_card,debit_card,ewallet,qris,other',
            'logo' => 'nullable|string',
            'config' => 'nullable|array',
            'fee_percent' => 'sometimes|numeric|min:0',
            'fee_fixed' => 'sometimes|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'available_pos' => 'sometimes|boolean',
            'available_online' => 'sometimes|boolean',
        ]);

        $record->update($validated);
        return $this->successResponse($record, 'Payment method updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $record = PaymentMethod::findOrFail($id);
        $record->delete();
        return $this->successResponse(null, 'Payment method deleted successfully');
    }
}
