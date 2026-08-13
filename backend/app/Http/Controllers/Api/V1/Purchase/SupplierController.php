<?php

namespace App\Http\Controllers\Api\V1\Purchase;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Supplier\Supplier;
use App\Http\Resources\Supplier\SupplierResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends BaseApiController
{
    /**
     * GET /api/v1/suppliers
     */
    public function index(Request $request): JsonResponse
    {
        $query = Supplier::with('contacts');

        if ($request->status === 'deleted') {
            $query->onlyTrashed();
        } elseif ($request->status && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        if ($request->filled('country')) {
            $query->where('country', 'like', "%{$request->country}%");
        }

        if ($request->filled('province')) {
            $query->where('province', 'like', "%{$request->province}%");
        }

        if ($request->filled('city')) {
            $query->where('city', 'like', "%{$request->city}%");
        }

        if ($request->filled('created_date_start')) {
            $query->whereDate('created_at', '>=', $request->created_date_start);
        }
        if ($request->filled('created_date_end')) {
            $query->whereDate('created_at', '<=', $request->created_date_end);
        }

        if ($request->filled('updated_date_start')) {
            $query->whereDate('updated_at', '>=', $request->updated_date_start);
        }
        if ($request->filled('updated_date_end')) {
            $query->whereDate('updated_at', '<=', $request->updated_date_end);
        }

        if ($request->filled('min_orders')) {
            $query->has('purchases', '>=', (int)$request->min_orders);
        }
        if ($request->filled('max_orders')) {
            $query->has('purchases', '<=', (int)$request->max_orders);
        }

        if ($request->filled('payment_status')) {
            $status = $request->payment_status;
            $query->whereHas('purchases', function($q) use ($status) {
                if ($status === 'paid') {
                    $q->where('payment_status', 'paid');
                } elseif ($status === 'partial') {
                    $q->where('payment_status', 'partial');
                } else {
                    $q->whereIn('payment_status', ['unpaid', 'due', 'pending']);
                }
            });
        }

        if ($request->search) {
            $search = $request->search;
            $query->where(function($sub) use ($search) {
                $sub->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedFields = ['id', 'name', 'code', 'email', 'city', 'tax_number', 'is_active', 'created_at'];
        if (in_array($sortBy, $allowedFields)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $suppliers = $query->paginate($request->integer('per_page', 10));

        // Wrap paginator collection in SupplierResource
        $suppliers->setCollection(SupplierResource::collection($suppliers->getCollection())->collection);

        return $this->paginatedResponse($suppliers);
    }

    /**
     * GET /api/v1/suppliers/{id}
     */
    public function show(int $id): JsonResponse
    {
        $supplier = Supplier::with('contacts')->findOrFail($id);
        return $this->successResponse(new SupplierResource($supplier));
    }

    /**
     * POST /api/v1/suppliers
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id'          => 'required|exists:companies,id',
            'name'                => 'required|string|max:100',
            'code'                => 'required|string|unique:suppliers,code',
            'email'               => 'nullable|email|max:100',
            'phone'               => 'nullable|string|max:50',
            'fax'                 => 'nullable|string|max:50',
            'address'             => 'nullable|string',
            'city'                => 'nullable|string|max:100',
            'province'            => 'nullable|string|max:100',
            'country'             => 'nullable|string|max:100',
            'postal_code'         => 'nullable|string|max:20',
            'tax_number'          => 'nullable|string|max:100',
            'bank_name'           => 'nullable|string|max:100',
            'bank_account_number' => 'nullable|string|max:100',
            'bank_account_name'   => 'nullable|string|max:150',
            'notes'               => 'nullable|string',
            'is_active'           => 'sometimes|boolean',
            'contacts'            => 'sometimes|array',
            'contacts.*.name'       => 'required|string|max:100',
            'contacts.*.title'      => 'nullable|string|max:100',
            'contacts.*.email'      => 'nullable|email|max:100',
            'contacts.*.phone'      => 'nullable|string|max:50',
            'contacts.*.is_primary' => 'sometimes|boolean',
        ]);

        $supplier = \Illuminate\Support\Facades\DB::transaction(function () use ($data, $request) {
            $contacts = $data['contacts'] ?? [];
            unset($data['contacts']);

            $supplier = Supplier::create($data);

            foreach ($contacts as $contactData) {
                $supplier->contacts()->create([
                    'name'       => $contactData['name'],
                    'title'      => $contactData['title'] ?? null,
                    'email'      => $contactData['email'] ?? null,
                    'phone'      => $contactData['phone'] ?? null,
                    'is_primary' => (bool)($contactData['is_primary'] ?? false),
                ]);
            }

            return $supplier;
        });

        $supplier->load('contacts');

        return $this->successResponse(new SupplierResource($supplier), 'Supplier created successfully', 201);
    }

    /**
     * PUT /api/v1/suppliers/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $supplier = Supplier::findOrFail($id);

        $data = $request->validate([
            'name'                => 'sometimes|required|string|max:100',
            'code'                => "sometimes|required|string|unique:suppliers,code,{$id}",
            'email'               => 'nullable|email|max:100',
            'phone'               => 'nullable|string|max:50',
            'fax'                 => 'nullable|string|max:50',
            'address'             => 'nullable|string',
            'city'                => 'nullable|string|max:100',
            'province'            => 'nullable|string|max:100',
            'country'             => 'nullable|string|max:100',
            'postal_code'         => 'nullable|string|max:20',
            'tax_number'          => 'nullable|string|max:100',
            'bank_name'           => 'nullable|string|max:100',
            'bank_account_number' => 'nullable|string|max:100',
            'bank_account_name'   => 'nullable|string|max:150',
            'notes'               => 'nullable|string',
            'is_active'           => 'sometimes|boolean',
            'contacts'            => 'sometimes|array',
            'contacts.*.name'       => 'required|string|max:100',
            'contacts.*.title'      => 'nullable|string|max:100',
            'contacts.*.email'      => 'nullable|email|max:100',
            'contacts.*.phone'      => 'nullable|string|max:50',
            'contacts.*.is_primary' => 'sometimes|boolean',
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($supplier, $data, $request) {
            $contacts = $data['contacts'] ?? null;
            unset($data['contacts']);

            $supplier->update($data);

            if ($contacts !== null) {
                $supplier->contacts()->delete();
                foreach ($contacts as $contactData) {
                    $supplier->contacts()->create([
                        'name'       => $contactData['name'],
                        'title'      => $contactData['title'] ?? null,
                        'email'      => $contactData['email'] ?? null,
                        'phone'      => $contactData['phone'] ?? null,
                        'is_primary' => (bool)($contactData['is_primary'] ?? false),
                    ]);
                }
            }
        });

        $supplier->load('contacts');

        return $this->successResponse(new SupplierResource($supplier), 'Supplier updated successfully');
    }

    /**
     * DELETE /api/v1/suppliers/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $supplier = Supplier::findOrFail($id);
            $supplier->delete();
            return $this->successResponse(null, 'Supplier deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * POST /api/v1/suppliers/{id}/restore
     */
    public function restore(int $id): JsonResponse
    {
        try {
            $supplier = Supplier::onlyTrashed()->findOrFail($id);
            $supplier->restore();
            return $this->successResponse(null, 'Supplier restored successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * DELETE /api/v1/suppliers/{id}/force
     */
    public function forceDelete(int $id): JsonResponse
    {
        try {
            $supplier = Supplier::withTrashed()->findOrFail($id);
            $supplier->forceDelete();
            return $this->successResponse(null, 'Supplier permanently deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * POST /api/v1/suppliers/bulk-delete
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $request->validate(['ids' => 'required|array']);
        try {
            $count = Supplier::whereIn('id', $request->ids)->delete();
            return $this->successResponse(['count' => $count], "{$count} suppliers deleted successfully");
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }
}
