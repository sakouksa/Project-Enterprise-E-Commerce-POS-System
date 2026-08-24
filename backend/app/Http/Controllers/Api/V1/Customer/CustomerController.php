<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Customer\Customer;
use App\Services\Customer\CustomerService;
use App\Services\Support\CsvService;
use App\Services\Support\FileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CustomerController extends BaseApiController
{
    public function __construct(
        protected CustomerService $customerService,
        protected FileService $fileService,
        protected CsvService $csvService
    ) {}

    /**
     * GET /api/v1/customers
     */
    public function index(Request $request): JsonResponse
    {
        $customers = $this->customerService->getPaginated(
            filters: $request->all(),
            perPage: $request->integer('per_page', 10),
            sortBy: $request->get('sort_by', 'created_at'),
            sortOrder: $request->get('sort_order', 'desc')
        );

        return $this->paginatedResponse($customers);
    }

    /**
     * GET /api/v1/customers/stats
     */
    public function stats(Request $request): JsonResponse
    {
        $stats = $this->customerService->getStats($request->all());

        return $this->successResponse($stats);
    }

    /**
     * GET /api/v1/customers/{id}
     */
    public function show(int $id): JsonResponse
    {
        $customer = Customer::with([
            'group',
            'user',
            'addresses',
            'sales' => fn($q) => $q->latest()->limit(15)->with(['items']),
        ])->findOrFail($id);

        return $this->successResponse($customer);
    }

    /**
     * POST /api/v1/customers
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_id'        => 'required|exists:companies,id',
            'customer_group_id' => 'nullable|exists:customer_groups,id',
            'user_id'           => 'nullable|exists:users,id',
            'name'              => 'required|string|max:100',
            'email'             => 'nullable|email|max:100',
            'phone'             => 'nullable|string|max:50',
            'gender'            => 'nullable|string|in:male,female,other',
            'birth_date'        => 'nullable|date',
            'photo'             => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'tax_number'        => 'nullable|string|max:100',
            'notes'             => 'nullable|string',
            'is_active'         => 'sometimes|boolean',
        ]);

        if ($request->hasFile('photo')) {
            $path = $this->fileService->upload($request->file('photo'), 'customers');
            $data['photo'] = $this->fileService->getUrl($path);
        }

        $customer = $this->customerService->create($data);

        return $this->successResponse($customer, 'Customer created successfully', 201);
    }

    /**
     * PUT /api/v1/customers/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $customer = Customer::findOrFail($id);

        $data = $request->validate([
            'customer_group_id' => 'nullable|exists:customer_groups,id',
            'user_id'           => 'nullable|exists:users,id',
            'name'              => 'sometimes|required|string|max:100',
            'email'             => 'nullable|email|max:100',
            'phone'             => 'nullable|string|max:50',
            'gender'            => 'nullable|string|in:male,female,other',
            'birth_date'        => 'nullable|date',
            'photo'             => 'nullable',
            'tax_number'        => 'nullable|string|max:100',
            'notes'             => 'nullable|string',
            'is_active'         => 'sometimes|boolean',
        ]);

        if ($request->hasFile('photo')) {
            $request->validate([
                'photo' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);

            $path = $this->fileService->replace($request->file('photo'), $customer->photo, 'customers');
            $data['photo'] = $this->fileService->getUrl($path);
        } elseif ($request->exists('photo') && $request->photo === null) {
            $this->fileService->delete($customer->photo);
            $data['photo'] = null;
        } else {
            unset($data['photo']);
        }

        $updated = $this->customerService->update($id, $data);

        return $this->successResponse($updated, 'Customer updated successfully');
    }

    /**
     * DELETE /api/v1/customers/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->customerService->delete($id);
            return $this->successResponse(null, 'Customer deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    /**
     * POST /api/v1/customers/{id}/restore
     */
    public function restore(int $id): JsonResponse
    {
        try {
            $customer = Customer::onlyTrashed()->findOrFail($id);
            $customer->restore();
            return $this->successResponse(null, 'Customer restored successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    /**
     * DELETE /api/v1/customers/{id}/force
     */
    public function forceDelete(int $id): JsonResponse
    {
        try {
            $customer = Customer::withTrashed()->findOrFail($id);
            if ($customer->photo) {
                $this->fileService->delete($customer->photo);
            }
            $customer->forceDelete();
            return $this->successResponse(null, 'Customer permanently deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), null, 400);
        }
    }

    /**
     * GET /api/v1/customers/{id}/orders
     */
    public function orders(int $id): JsonResponse
    {
        $orders = \App\Models\Order\Order::where('customer_id', $id)->latest()->paginate(10);
        return $this->paginatedResponse($orders);
    }

    /**
     * GET /api/v1/customers/export
     */
    public function export(Request $request): StreamedResponse
    {
        $headers = [
            'ID', 'Name', 'Email', 'Phone', 'Gender', 'Birth Date',
            'Total Spent', 'Order Count', 'Loyalty Points', 'Tax Number', 'Notes', 'Is Active',
        ];

        $customers = Customer::withTrashed()->get();

        return $this->csvService->streamExport(
            filename: 'customers_export_' . now()->format('Y-m-d') . '.csv',
            headers: $headers,
            rows: $customers,
            rowMapper: fn(Customer $c) => [
                $c->id,
                $c->name,
                $c->email ?? '',
                $c->phone ?? '',
                $c->gender ?? '',
                $c->birth_date ?? '',
                $c->total_spent,
                $c->order_count,
                $c->loyalty_points,
                $c->tax_number ?? '',
                $c->notes ?? '',
                $c->is_active ? '1' : '0',
            ]
        );
    }

    /**
     * POST /api/v1/customers/import
     */
    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        $result = $this->csvService->parseCsv($request->file('file'), ['name']);
        if (!$result['success']) {
            return $this->errorResponse($result['message'], $result['errors'], 400);
        }

        $successCount = 0;
        $errors = [];

        foreach ($result['rows'] as $rowItem) {
            $line = $rowItem['_line'];
            $data = $rowItem['data'];

            $name = trim($data['name'] ?? '');
            if (!$name) {
                $errors[] = "Line {$line}: Name is required.";
                continue;
            }

            $email = trim($data['email'] ?? '');
            if ($email && Customer::where('email', $email)->exists()) {
                $errors[] = "Line {$line}: Email '{$email}' already exists.";
                continue;
            }

            Customer::create([
                'company_id'     => 1,
                'name'           => $name,
                'email'          => $email ?: null,
                'phone'          => trim($data['phone'] ?? '') ?: null,
                'gender'         => in_array(strtolower(trim($data['gender'] ?? '')), ['male', 'female', 'other']) ? strtolower(trim($data['gender'] ?? '')) : null,
                'birth_date'     => trim($data['birth_date'] ?? $data['birth date'] ?? '') ?: null,
                'total_spent'    => (float) ($data['total_spent'] ?? $data['total spent'] ?? 0),
                'order_count'    => (int) ($data['order_count'] ?? $data['order count'] ?? 0),
                'loyalty_points' => (float) ($data['loyalty_points'] ?? $data['loyalty points'] ?? 0),
                'tax_number'     => trim($data['tax_number'] ?? $data['tax number'] ?? '') ?: null,
                'notes'          => trim($data['notes'] ?? '') ?: null,
                'is_active'      => ($data['is_active'] ?? $data['is active'] ?? '1') === '1',
            ]);

            $successCount++;
        }

        return $this->successResponse([
            'imported_count' => $successCount,
            'errors'         => $errors,
        ], "Imported {$successCount} customers successfully. " . count($errors) . " errors.");
    }

    /**
     * POST /api/v1/customers/bulk-delete
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        $this->customerService->bulkDelete($ids);
        return $this->successResponse(null, 'Selected customers deleted successfully');
    }

    /**
     * POST /api/v1/customers/bulk-restore
     */
    public function bulkRestore(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        $this->customerService->bulkRestore($ids);
        return $this->successResponse(null, 'Selected customers restored successfully');
    }

    /**
     * POST /api/v1/customers/bulk-activate
     */
    public function bulkActivate(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        Customer::whereIn('id', $ids)->update(['is_active' => true]);
        return $this->successResponse(null, 'Selected customers activated successfully');
    }

    /**
     * POST /api/v1/customers/bulk-deactivate
     */
    public function bulkDeactivate(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        Customer::whereIn('id', $ids)->update(['is_active' => false]);
        return $this->successResponse(null, 'Selected customers deactivated successfully');
    }

    /**
     * POST /api/v1/customers/bulk-assign-group
     */
    public function bulkAssignGroup(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        $groupId = $request->input('customer_group_id');
        Customer::whereIn('id', $ids)->update(['customer_group_id' => $groupId ?: null]);
        return $this->successResponse(null, 'Selected customers group assigned successfully');
    }
}
