import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Eye, RefreshCw, X, ShoppingBag,
  CheckCircle, Truck, XCircle, Loader2, Filter, Mail, Phone, MapPin, DollarSign, Calendar, Info
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'

interface Order {
  id:                 number
  order_number:       string
  customer?:          { name: string; phone?: string; email?: string }
  grand_total:        number
  subtotal:           number
  tax_amount:         number
  discount_amount:    number
  shipping_cost:      number
  status:             'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded'
  payment_status:     'unpaid' | 'partial' | 'paid' | 'refunded'
  fulfillment_status: 'unfulfilled' | 'partial' | 'fulfilled'
  shipping_name?:     string
  shipping_phone?:    string
  shipping_address?:  string
  shipping_city?:     string
  shipping_province?:  string
  shipping_postal_code?: string
  carrier?:           string
  tracking_number?:   string
  notes?:             string
  created_at:         string
}

const STATUS_BADGE: Record<string, string> = {
  pending:    'badge-warning',
  confirmed:  'badge-info',
  processing: 'badge-info',
  shipped:    'badge-primary',
  delivered:  'badge-success',
  completed:  'badge-success',
  cancelled:  'badge-danger',
  refunded:   'badge-muted',
}

const OrdersPage: React.FC = () => {
  const qc    = useQueryClient()
  const toast = useToast()

    const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    reset,
    adjustAfterDelete,
  } = useServerPagination({ storageKey: 'orders' })
    const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['orders', page, debouncedSearch, perPage, statusFilter],
    queryFn: () => api.get('/orders', {
      params: { page, search, status: statusFilter || undefined, per_page: 15 },
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const { data: orderDetails, isLoading: detailLoading } = useQuery<Order & { items?: any[] }>({
    queryKey: ['order-details', selectedOrderId],
    queryFn: () => api.get(`/orders/${selectedOrderId}`).then(r => r.data.data),
    enabled: selectedOrderId !== null,
  })

  const makeMutation = (
    fn: (id: number, extra?: any) => Promise<any>,
    successMsg: string,
    errorMsg = 'Something went wrong.',
  ) => useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success(successMsg)
      setSelectedOrderId(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? errorMsg)
    },
  })

  const confirmMutation  = makeMutation((id) => api.post(`/orders/${id}/confirm`),   'Order confirmed successfully.')
  const completeMutation = makeMutation((id) => api.post(`/orders/${id}/complete`),  'Order marked as completed.')
  const cancelMutation   = makeMutation((id) => api.post(`/orders/${id}/cancel`),    'Order cancelled successfully.')
  const shipMutation     = useMutation({
    mutationFn: (id: number) =>
      api.post(`/orders/${id}/ship`, {
        carrier:        'JNE',
        tracking_number: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Order shipped successfully.')
      setSelectedOrderId(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to ship order.')
    },
  })

  const orders: Order[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const isActionPending = confirmMutation.isPending || shipMutation.isPending
    || completeMutation.isPending || cancelMutation.isPending

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Orders' }, { label: 'E-Commerce Orders' }]} />

      <PageHeader
        title="Orders"
        subtitle="Review e-commerce shop orders, carrier assignments, and fulfillment"
      />

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by order number..."
              className="form-input pl-9"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
              className="form-input"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['orders'] })}
            className="p-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
      <TableWrapper isFetching={isFetching}>
        <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Order #</th>
                <th className="text-left">Customer</th>
                <th className="text-left">Date</th>
                <th className="text-left">Grand Total</th>
                <th className="text-left">Payment</th>
                <th className="text-left">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td><div className="skeleton h-4 w-28 rounded" /></td>
                      <td><div className="skeleton h-4 w-32 rounded" /></td>
                      <td><div className="skeleton h-4 w-24 rounded" /></td>
                      <td><div className="skeleton h-4 w-20 rounded" /></td>
                      <td><div className="skeleton h-4 w-16 rounded" /></td>
                      <td><div className="skeleton h-4 w-16 rounded" /></td>
                      <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                    </tr>
                  ))
                : orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-muted/25 transition-colors">
                      <td className="font-semibold text-primary text-sm font-mono">
                        #{order.order_number}
                      </td>
                      <td className="text-sm text-foreground">
                        {order.customer?.name ?? 'Guest Customer'}
                        {order.customer?.phone && <div className="text-xs text-muted-foreground">{order.customer.phone}</div>}
                      </td>
                      <td className="text-muted-foreground text-sm font-mono text-xs">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td className="font-semibold text-sm">
                        Rp {Number(order.grand_total).toLocaleString('id-ID')}
                      </td>
                      <td>
                        <span className={order.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td>
                        <span className={STATUS_BADGE[order.status] ?? 'badge-muted'}>
                          {order.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground
                                     transition-colors flex items-center gap-1 text-xs font-medium ml-auto"
                        >
                          <Eye size={14} />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
              }
              {!isLoading && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <ShoppingBag size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </TableWrapper>

        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
      </div>

      {/* Details Side-Drawer */}
      <AnimatePresence>
        {selectedOrderId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card w-full max-w-lg border-l border-border h-full flex flex-col shadow-2xl"
            >
              {detailLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : orderDetails && (
                <>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground font-mono">
                        Order #{orderDetails.order_number}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {orderDetails.customer?.name ?? 'Guest Customer'}
                      </p>
                    </div>
                    <button onClick={() => setSelectedOrderId(null)} className="text-muted-foreground hover:text-foreground">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Status row */}
                    <div className="flex items-center gap-3">
                      <span className={STATUS_BADGE[orderDetails.status] ?? 'badge-muted'}>
                        {orderDetails.status}
                      </span>
                      <span className={orderDetails.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}>
                        {orderDetails.payment_status}
                      </span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        Fulfillment: <span className="font-semibold text-foreground">{orderDetails.fulfillment_status}</span>
                      </span>
                    </div>

                    {/* Shipping details */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                        <MapPin size={12} /> Shipping Address
                      </h4>
                      <div className="bg-muted/30 p-3 rounded-lg border border-border space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Recipient Name:</span>
                          <span className="font-medium text-foreground">{orderDetails.shipping_name ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground flex items-center gap-1"><Phone size={12} /> Phone:</span>
                          <span className="font-medium text-foreground">{orderDetails.shipping_phone ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Address:</span>
                          <span className="font-medium text-right max-w-[200px] break-words">{orderDetails.shipping_address ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">City/Province:</span>
                          <span className="font-medium">{orderDetails.shipping_city ? `${orderDetails.shipping_city}, ${orderDetails.shipping_province ?? ''}` : '—'}</span>
                        </div>
                        {orderDetails.carrier && (
                          <div className="flex justify-between border-t border-border/60 pt-1.5 mt-1">
                            <span className="text-muted-foreground flex items-center gap-1"><Truck size={12} /> Carrier:</span>
                            <span className="font-semibold text-foreground">{orderDetails.carrier} ({orderDetails.tracking_number ?? 'No Tracking'})</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-foreground flex items-center gap-1">
                        <ShoppingBag size={12} /> Order Items
                      </h4>
                      <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                        {orderDetails.items?.map((item: any) => (
                          <div key={item.id} className="py-3 px-4 flex items-center justify-between bg-card">
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.product_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.quantity} × Rp {Number(item.unit_price).toLocaleString('id-ID')}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-foreground">
                              Rp {Number(item.total).toLocaleString('id-ID')}
                            </p>
                          </div>
                        ))}
                        {!orderDetails.items?.length && (
                          <div className="py-6 text-center text-sm text-muted-foreground">No items</div>
                        )}
                      </div>
                    </div>

                    {/* Total Breakdown */}
                    <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>Rp {Number(orderDetails.subtotal).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-red-500">Discount:</span>
                        <span className="text-red-500">-Rp {Number(orderDetails.discount_amount).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax:</span>
                        <span>Rp {Number(orderDetails.tax_amount).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping Cost:</span>
                        <span>Rp {Number(orderDetails.shipping_cost).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base border-t border-border pt-2 text-foreground">
                        <span>Grand Total:</span>
                        <span>Rp {Number(orderDetails.grand_total).toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {orderDetails.notes && (
                      <div className="bg-muted/20 p-3 rounded-xl border border-border flex gap-2 text-sm text-muted-foreground">
                        <Info size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-xs text-foreground mb-0.5">Notes</div>
                          <div>{orderDetails.notes}</div>
                        </div>
                      </div>
                    )}

                    {/* Lifecycle actions */}
                    <div className="bg-muted/40 p-4 rounded-xl space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Order Lifecycle Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        {orderDetails.status === 'pending' && (
                          <button
                            onClick={() => confirmMutation.mutate(orderDetails.id)}
                            disabled={isActionPending}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold
                                       hover:bg-blue-500 flex items-center gap-1.5 disabled:opacity-60 transition-colors shadow-sm"
                          >
                            {confirmMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={14} />}
                            Confirm Order
                          </button>
                        )}
                        {orderDetails.status === 'confirmed' && (
                          <button
                            onClick={() => shipMutation.mutate(orderDetails.id)}
                            disabled={isActionPending}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold
                                       hover:bg-indigo-500 flex items-center gap-1.5 disabled:opacity-60 transition-colors shadow-sm"
                          >
                            {shipMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Truck size={14} />}
                            Ship Order
                          </button>
                        )}
                        {orderDetails.status === 'shipped' && (
                          <button
                            onClick={() => completeMutation.mutate(orderDetails.id)}
                            disabled={isActionPending}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold
                                       hover:bg-green-500 flex items-center gap-1.5 disabled:opacity-60 transition-colors shadow-sm"
                          >
                            {completeMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={14} />}
                            Complete Order
                          </button>
                        )}
                        {['pending', 'confirmed'].includes(orderDetails.status) && (
                          <button
                            onClick={() => cancelMutation.mutate(orderDetails.id)}
                            disabled={isActionPending}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold
                                       hover:bg-red-500 flex items-center gap-1.5 disabled:opacity-60 transition-colors shadow-sm"
                          >
                            {cancelMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={14} />}
                            Cancel Order
                          </button>
                        )}
                        {!['pending', 'confirmed', 'shipped'].includes(orderDetails.status) && (
                          <p className="text-xs text-muted-foreground italic">No actions available for this status.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrdersPage
