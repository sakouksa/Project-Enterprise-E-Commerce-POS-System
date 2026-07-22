<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Customer\Customer;
use App\Models\Customer\CustomerGroup;
use App\Models\Order\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CustomerController extends BaseApiController
{
    /**
     * GET /api/v1/customers
     */
    public function index(Request $request): JsonResponse
    {
        $customers = Customer::with(['group', 'user'])
            ->when($request->status === 'deleted', function ($q) {
                $q->onlyTrashed();
            })
            ->when($request->status && $request->status !== 'deleted' && $request->status !== 'all', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active' || $request->status === '1');
            })
            ->when($request->customer_group_id, function ($q, $groupId) {
                $q->where('customer_group_id', $groupId);
            })
            ->when($request->gender, function ($q, $gender) {
                $q->where('gender', $gender);
            })
            ->when($request->search, function ($q, $search) {
                $q->where(function($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('tax_number', 'like', "%{$search}%")
                        ->orWhere('notes', 'like', "%{$search}%");
                });
            })
            ->when($request->start_date, function ($q, $date) {
                $q->whereDate('created_at', '>=', $date);
            })
            ->when($request->end_date, function ($q, $date) {
                $q->whereDate('created_at', '<=', $date);
            })
            ->when($request->has_address, function ($q, $val) {
                if ($val === 'yes' || $val === '1') {
                    $q->has('addresses');
                } elseif ($val === 'no' || $val === '0') {
                    $q->doesntHave('addresses');
                }
            })
            ->when($request->has_user, function ($q, $val) {
                if ($val === 'yes' || $val === '1') {
                    $q->whereNotNull('user_id');
                } elseif ($val === 'no' || $val === '0') {
                    $q->whereNull('user_id');
                }
            })
            ->when($request->birthday_month, function ($q, $month) {
                $q->whereMonth('birth_date', $month);
            });

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        if (!in_array($sortBy, ['id', 'name', 'phone', 'email', 'gender', 'birth_date', 'total_spent', 'loyalty_points', 'order_count', 'is_active', 'created_at'])) {
            $sortBy = 'created_at';
        }

        $customers = $customers->orderBy($sortBy, $sortOrder)
            ->paginate($request->integer('per_page', 10));

        return $this->paginatedResponse($customers);
    }

    /**
     * GET /api/v1/customers/stats
     */
    public function stats(Request $request): JsonResponse
    {
        $query = Customer::query()
            ->when($request->status === 'deleted', function ($q) {
                $q->onlyTrashed();
            })
            ->when($request->status && $request->status !== 'deleted' && $request->status !== 'all', function ($q) use ($request) {
                $q->where('is_active', $request->status === 'active' || $request->status === '1');
            })
            ->when($request->customer_group_id, function ($q, $groupId) {
                $q->where('customer_group_id', $groupId);
            })
            ->when($request->gender, function ($q, $gender) {
                $q->where('gender', $gender);
            })
            ->when($request->search, function ($q, $search) {
                $q->where(function($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('tax_number', 'like', "%{$search}%")
                        ->orWhere('notes', 'like', "%{$search}%");
                });
            })
            ->when($request->start_date, function ($q, $date) {
                $q->whereDate('created_at', '>=', $date);
            })
            ->when($request->end_date, function ($q, $date) {
                $q->whereDate('created_at', '<=', $date);
            })
            ->when($request->has_address, function ($q, $val) {
                if ($val === 'yes' || $val === '1') {
                    $q->has('addresses');
                } elseif ($val === 'no' || $val === '0') {
                    $q->doesntHave('addresses');
                }
            })
            ->when($request->has_user, function ($q, $val) {
                if ($val === 'yes' || $val === '1') {
                    $q->whereNotNull('user_id');
                } elseif ($val === 'no' || $val === '0') {
                    $q->whereNull('user_id');
                }
            })
            ->when($request->birthday_month, function ($q, $month) {
                $q->whereMonth('birth_date', $month);
            });

        $totalCustomers = (clone $query)->count();
        $activeCustomers = (clone $query)->where('is_active', true)->count();
        $inactiveCustomers = (clone $query)->where('is_active', false)->count();

        $vipCustomers = (clone $query)->where(function($q) {
            $q->where('total_spent', '>=', 1000)
              ->orWhereHas('group', function($sub) {
                  $sub->where('name', 'like', '%VIP%');
              });
        })->count();

        $newCustomersThisMonth = (clone $query)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $totalSpent = (clone $query)->sum('total_spent');
        $totalPoints = (clone $query)->sum('loyalty_points');
        $totalOrders = (clone $query)->sum('order_count');

        $avgSpent = $totalCustomers > 0 ? ($totalSpent / $totalCustomers) : 0;

        $totalGroups = CustomerGroup::count();
        $totalAddresses = DB::table('customer_addresses')->count();

        // ── Mini KPI Stats ────────────────────────────────────────────────
        // Customers registered today
        $todayCustomers = (clone $query)
            ->whereDate('created_at', now()->toDateString())
            ->count();

        // Orders placed today that belong to any customer
        $todayOrders = Order::whereDate('created_at', now()->toDateString())
            ->whereNotNull('customer_id')
            ->count();

        // Revenue from today's customer orders
        $todayRevenue = (float) Order::whereDate('created_at', now()->toDateString())
            ->whereNotNull('customer_id')
            ->sum('grand_total');

        // Orders with pending payment status
        $pendingPayments = Order::where('payment_status', 'pending')
            ->whereNotNull('customer_id')
            ->count();

        // Customers who have an outstanding balance (paid less than total)
        $creditCustomers = Order::whereNotNull('customer_id')
            ->whereColumn('paid_amount', '<', 'grand_total')
            ->distinct('customer_id')
            ->count('customer_id');

        return response()->json([
            'success' => true,
            'data' => [
                'total_customers'        => $totalCustomers,
                'active_customers'       => $activeCustomers,
                'inactive_customers'     => $inactiveCustomers,
                'vip_customers'          => $vipCustomers,
                'new_customers_this_month' => $newCustomersThisMonth,
                'total_spent'            => $totalSpent,
                'total_loyalty_points'   => $totalPoints,
                'total_orders'           => $totalOrders,
                'avg_spent_per_customer' => round($avgSpent, 2),
                'total_groups'           => $totalGroups,
                'total_addresses'        => $totalAddresses,
                // Mini KPI
                'today_customers'        => $todayCustomers,
                'today_orders'           => $todayOrders,
                'today_revenue'          => $todayRevenue,
                'pending_payments'       => $pendingPayments,
                'credit_customers'       => $creditCustomers,
            ]
        ]);
    }

    /**
     * GET /api/v1/customers/{id}
     */
    public function show(int $id): JsonResponse
    {
        $customer = Customer::with(['group', 'user', 'addresses'])->findOrFail($id);
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
            $path = $request->file('photo')->store('customers', 'public');
            $data['photo'] = Storage::url($path);
        }

        $customer = Customer::create($data);

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
                'photo' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048'
            ]);

            if ($customer->photo) {
                $oldPath = str_replace(Storage::url(''), '', $customer->photo);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('photo')->store('customers', 'public');
            $data['photo'] = Storage::url($path);
        } elseif ($request->exists('photo') && $request->photo === null) {
            if ($customer->photo) {
                $oldPath = str_replace(Storage::url(''), '', $customer->photo);
                Storage::disk('public')->delete($oldPath);
            }
            $data['photo'] = null;
        } else {
            // Remove photo from data if it's a string (URL) to avoid overwriting with the URL string
            unset($data['photo']);
        }

        $customer->update($data);

        return $this->successResponse($customer, 'Customer updated successfully');
    }

    /**
     * DELETE /api/v1/customers/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $customer = Customer::findOrFail($id);
            $customer->delete();
            return $this->successResponse(null, 'Customer deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
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
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
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
                $oldPath = str_replace(Storage::url(''), '', $customer->photo);
                Storage::disk('public')->delete($oldPath);
            }
            $customer->forceDelete();
            return $this->successResponse(null, 'Customer permanently deleted successfully');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * GET /api/v1/customers/{id}/orders
     */
    public function orders(int $id): JsonResponse
    {
        $customer = Customer::findOrFail($id);
        $orders = \App\Models\Order\Order::where('customer_id', $id)->latest()->paginate(10);
        return $this->paginatedResponse($orders);
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=customers_export_' . now()->format('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function () use ($request) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, [
                'ID', 'Name', 'Email', 'Phone', 'Gender', 'Birth Date', 'Total Spent', 'Order Count', 'Loyalty Points', 'Tax Number', 'Notes', 'Is Active'
            ]);

            $customers = Customer::withTrashed()->get();

            foreach ($customers as $c) {
                fputcsv($file, [
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
                    $c->is_active ? '1' : '0'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');
        if ($handle === false) {
            return response()->json(['success' => false, 'message' => 'Cannot open file'], 400);
        }

        $bom = fread($handle, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            rewind($handle);
        }

        $headers = fgetcsv($handle);
        if (!$headers) {
            fclose($handle);
            return response()->json(['success' => false, 'message' => 'Empty CSV'], 400);
        }
        $headers = array_map(fn($h) => strtolower(trim($h)), $headers);

        $successCount = 0;
        $errors = [];
        $line = 1;

        while (($row = fgetcsv($handle)) !== false) {
            $line++;
            if (count($row) < count($headers)) {
                $row = array_pad($row, count($headers), '');
            } else {
                $row = array_slice($row, 0, count($headers));
            }
            $data = array_combine($headers, $row);

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
                'company_id' => 1,
                'name' => $name,
                'email' => $email ?: null,
                'phone' => trim($data['phone'] ?? '') ?: null,
                'gender' => in_array(strtolower(trim($data['gender'] ?? '')), ['male', 'female', 'other']) ? strtolower(trim($data['gender'] ?? '')) : null,
                'birth_date' => trim($data['birth date'] ?? $data['birth_date'] ?? '') ?: null,
                'total_spent' => floatval($data['total spent'] ?? $data['total_spent'] ?? 0),
                'order_count' => intval($data['order count'] ?? $data['order_count'] ?? 0),
                'loyalty_points' => floatval($data['loyalty points'] ?? $data['loyalty_points'] ?? 0),
                'tax_number' => trim($data['tax number'] ?? $data['tax_number'] ?? '') ?: null,
                'notes' => trim($data['notes'] ?? '') ?: null,
                'is_active' => ($data['is active'] ?? $data['is_active'] ?? '1') === '1',
            ]);

            $successCount++;
        }

        fclose($handle);

        return response()->json([
            'success' => true,
            'message' => "Imported {$successCount} customers successfully. " . count($errors) . " errors.",
            'errors' => $errors
        ]);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        Customer::whereIn('id', $ids)->delete();
        return $this->successResponse(null, 'Selected customers deleted successfully');
    }

    public function bulkRestore(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        Customer::onlyTrashed()->whereIn('id', $ids)->restore();
        return $this->successResponse(null, 'Selected customers restored successfully');
    }

    public function bulkActivate(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        Customer::whereIn('id', $ids)->update(['is_active' => true]);
        return $this->successResponse(null, 'Selected customers activated successfully');
    }

    public function bulkDeactivate(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        Customer::whereIn('id', $ids)->update(['is_active' => false]);
        return $this->successResponse(null, 'Selected customers deactivated successfully');
    }

    public function bulkAssignGroup(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        $groupId = $request->input('customer_group_id');
        Customer::whereIn('id', $ids)->update(['customer_group_id' => $groupId ?: null]);
        return $this->successResponse(null, 'Selected customers group assigned successfully');
    }
}
