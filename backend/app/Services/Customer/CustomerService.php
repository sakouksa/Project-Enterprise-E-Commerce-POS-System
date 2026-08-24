<?php

namespace App\Services\Customer;

use App\Models\Customer\Customer;
use App\Models\Customer\CustomerGroup;
use App\Models\Order\Order;
use App\Models\Sales\Sale;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    /**
     * Build customer filtered query.
     */
    public function getFilteredQuery(array $filters = [])
    {
        $status = $filters['status'] ?? null;
        $groupId = $filters['customer_group_id'] ?? null;
        $gender = $filters['gender'] ?? null;
        $search = $filters['search'] ?? null;
        $startDate = $filters['start_date'] ?? null;
        $endDate = $filters['end_date'] ?? null;
        $hasAddress = $filters['has_address'] ?? null;
        $hasUser = $filters['has_user'] ?? null;
        $birthdayMonth = $filters['birthday_month'] ?? null;

        return Customer::with(['group', 'user'])
            ->when($status === 'deleted' || $status === 'trashed', function ($q) {
                $q->onlyTrashed();
            })
            ->when($status && !in_array($status, ['deleted', 'trashed', 'all'], true), function ($q) use ($status) {
                $q->where('is_active', $status === 'active' || $status === '1' || $status === true);
            })
            ->when($groupId, fn($q, $id) => $q->where('customer_group_id', $id))
            ->when($gender, fn($q, $g) => $q->where('gender', $g))
            ->when($search, function ($q, $term) {
                $q->where(function ($sub) use ($term) {
                    $sub->where('name', 'like', "%{$term}%")
                        ->orWhere('email', 'like', "%{$term}%")
                        ->orWhere('phone', 'like', "%{$term}%")
                        ->orWhere('tax_number', 'like', "%{$term}%")
                        ->orWhere('notes', 'like', "%{$term}%");
                });
            })
            ->when($startDate, fn($q, $d) => $q->whereDate('created_at', '>=', $d))
            ->when($endDate, fn($q, $d) => $q->whereDate('created_at', '<=', $d))
            ->when($hasAddress, function ($q, $val) {
                if ($val === 'yes' || $val === '1' || $val === true) {
                    $q->has('addresses');
                } elseif ($val === 'no' || $val === '0' || $val === false) {
                    $q->doesntHave('addresses');
                }
            })
            ->when($hasUser, function ($q, $val) {
                if ($val === 'yes' || $val === '1' || $val === true) {
                    $q->whereNotNull('user_id');
                } elseif ($val === 'no' || $val === '0' || $val === false) {
                    $q->whereNull('user_id');
                }
            })
            ->when($birthdayMonth, fn($q, $m) => $q->whereMonth('birth_date', $m));
    }

    /**
     * Get paginated customers.
     */
    public function getPaginated(array $filters = [], int $perPage = 10, string $sortBy = 'created_at', string $sortOrder = 'desc'): LengthAwarePaginator
    {
        $allowedSorts = ['id', 'name', 'phone', 'email', 'gender', 'birth_date', 'total_spent', 'loyalty_points', 'order_count', 'is_active', 'created_at'];
        $sort = in_array($sortBy, $allowedSorts, true) ? $sortBy : 'created_at';
        $order = in_array(strtolower($sortOrder), ['asc', 'desc'], true) ? strtolower($sortOrder) : 'desc';

        return $this->getFilteredQuery($filters)
            ->orderBy($sort, $order)
            ->paginate($perPage);
    }

    /**
     * Compute customer statistics.
     */
    public function getStats(array $filters = []): array
    {
        $query = $this->getFilteredQuery($filters);

        $totalCustomers = (clone $query)->count();
        $activeCustomers = (clone $query)->where('is_active', true)->count();
        $inactiveCustomers = (clone $query)->where('is_active', false)->count();

        $vipCustomers = (clone $query)->where(function ($q) {
            $q->where('total_spent', '>=', 1000)
              ->orWhereHas('group', fn($sub) => $sub->where('name', 'like', '%VIP%'));
        })->count();

        $newCustomersThisMonth = (clone $query)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $totalSpent = (float) (clone $query)->sum('total_spent');
        $totalPoints = (float) (clone $query)->sum('loyalty_points');
        $totalOrders = (int) (clone $query)->sum('order_count');
        $avgSpent = $totalCustomers > 0 ? ($totalSpent / $totalCustomers) : 0;

        $totalGroups = CustomerGroup::count();
        $totalAddresses = DB::table('customer_addresses')->count();

        // Mini KPI Stats
        $todayCustomers = (clone $query)->whereDate('created_at', now()->toDateString())->count();
        $todayOrders = Sale::whereDate('date', now()->toDateString())->whereNotNull('customer_id')->count()
            + Order::whereDate('created_at', now()->toDateString())->whereNotNull('customer_id')->count();

        $todayRevenue = (float) Sale::whereDate('date', now()->toDateString())
            ->whereNotNull('customer_id')
            ->where('status', 'completed')
            ->sum('grand_total')
            + (float) Order::whereDate('created_at', now()->toDateString())
            ->whereNotNull('customer_id')
            ->where('status', 'completed')
            ->sum('grand_total');

        $pendingPayments = Sale::where('status', 'pending')->whereNotNull('customer_id')->count()
            + Order::where('payment_status', 'pending')->whereNotNull('customer_id')->count();

        $creditCustomerIds = array_unique(array_merge(
            Sale::whereNotNull('customer_id')->whereColumn('paid_amount', '<', 'grand_total')->pluck('customer_id')->toArray(),
            Order::whereNotNull('customer_id')->whereColumn('paid_amount', '<', 'grand_total')->pluck('customer_id')->toArray()
        ));

        return [
            'total_customers'          => $totalCustomers,
            'active_customers'         => $activeCustomers,
            'inactive_customers'       => $inactiveCustomers,
            'vip_customers'            => $vipCustomers,
            'new_customers_this_month' => $newCustomersThisMonth,
            'total_spent'              => $totalSpent,
            'total_points'             => $totalPoints,
            'total_orders'             => $totalOrders,
            'avg_spent'                => round($avgSpent, 2),
            'total_groups'             => $totalGroups,
            'total_addresses'          => $totalAddresses,

            'today_customers'          => $todayCustomers,
            'today_orders'             => $todayOrders,
            'today_revenue'            => $todayRevenue,
            'pending_payments'         => $pendingPayments,
            'credit_customers'         => count($creditCustomerIds),
        ];
    }

    /**
     * Get customer by ID with relations.
     */
    public function getById(int|string $id): Customer
    {
        return Customer::with(['group', 'user', 'addresses'])->findOrFail($id);
    }

    /**
     * Create a customer.
     */
    public function create(array $data): Customer
    {
        return Customer::create($data);
    }

    /**
     * Update a customer.
     */
    public function update(int|string $id, array $data): Customer
    {
        $customer = Customer::findOrFail($id);
        $customer->update($data);
        return $customer->fresh(['group', 'user']);
    }

    /**
     * Delete a customer.
     */
    public function delete(int|string $id): bool
    {
        return Customer::findOrFail($id)->delete();
    }

    /**
     * Bulk delete customers.
     */
    public function bulkDelete(array $ids): int
    {
        return Customer::whereIn('id', $ids)->delete();
    }

    /**
     * Bulk restore customers.
     */
    public function bulkRestore(array $ids): int
    {
        return Customer::onlyTrashed()->whereIn('id', $ids)->restore();
    }

    /**
     * Bulk force delete customers.
     */
    public function bulkForceDelete(array $ids): int
    {
        return Customer::onlyTrashed()->whereIn('id', $ids)->forceDelete();
    }
}
