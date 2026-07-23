import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Eye, RefreshCw, X, ShoppingBag, CheckCircle, Truck, XCircle,
  Loader2, Filter, Mail, Phone, MapPin, DollarSign, Calendar, Info,
  PackageCheck, Clock, User, ArrowRight, ShieldCheck, Printer, FileText, CornerUpLeft
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import { sound } from '@/utils/sound'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import { ModernSelect } from '../pos/components/ModernSelect'

interface OrderItem {
  id:              number
  product_id:      number
  product_name:    string
  sku?:            string
  quantity:        number
  unit_price:      number
  discount_amount: number
  total:           number
  product?:        { name: string; primary_image?: any }
}

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
  shipping_province?: string
  shipping_postal_code?: string
  carrier?:           string
  tracking_number?:   string
  notes?:             string
  created_at:         string
  items?:             OrderItem[]
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
  } = useServerPagination({ storageKey: 'orders' })

  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['orders', page, debouncedSearch, perPage, statusFilter],
    queryFn: () => api.get('/orders', {
      params: { page, search, status: statusFilter || undefined, per_page: perPage || 12 },
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const { data: orderDetails, isLoading: detailLoading } = useQuery<Order>({
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
      sound.playSuccess()
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success(successMsg)
      setSelectedOrderId(null)
    },
    onError: (err: any) => {
      sound.playError()
      toast.error(err?.response?.data?.message ?? errorMsg)
    },
  })

  const confirmMutation  = makeMutation((id) => api.post(`/orders/${id}/confirm`),   'Order confirmed successfully.')
  const completeMutation = makeMutation((id) => api.post(`/orders/${id}/complete`),  'Order marked as completed.')
  const cancelMutation   = makeMutation((id) => api.post(`/orders/${id}/cancel`),    'Order cancelled successfully.')
  const shipMutation     = useMutation({
    mutationFn: (id: number) =>
      api.post(`/orders/${id}/ship`, {
        carrier:        'Enterprise Express',
        tracking_number: `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      }),
    onSuccess: () => {
      sound.playSuccess()
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Order shipped successfully.')
      setSelectedOrderId(null)
    },
    onError: (err: any) => {
      sound.playError()
      toast.error(err?.response?.data?.message ?? 'Failed to ship order.')
    },
  })

  const orders: Order[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const isActionPending = confirmMutation.isPending || shipMutation.isPending
    || completeMutation.isPending || cancelMutation.isPending

  // Summary Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.grand_total || 0), 0)
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length
  const completedOrdersCount = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length

  const resetFilters = () => {
    sound.playClick()
    setSearch('')
    setStatusFilter('')
    setPage(1)
  }

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      case 'shipped':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
      case 'processing':
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
      case 'cancelled':
      case 'refunded':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/10 text-emerald-600 font-extrabold border-emerald-500/20'
      case 'unpaid':
        return 'bg-amber-500/10 text-amber-600 font-extrabold border-amber-500/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Sales & Operations' }, { label: 'Web Orders Registry' }]} />

      <PageHeader
        title="Web E-Commerce Orders"
        subtitle="Manage online web store orders, customer delivery addresses, and carrier fulfillment"
      />

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <DollarSign size={20} />
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground font-semibold">Web Revenue (Current Page)</div>
            <div className="text-lg font-black text-foreground">${totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground font-semibold">Pending / Processing</div>
            <div className="text-lg font-black text-foreground">{pendingOrdersCount} Orders</div>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <PackageCheck size={20} />
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground font-semibold">Completed & Delivered</div>
            <div className="text-lg font-black text-foreground">{completedOrdersCount} Orders</div>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <ShoppingBag size={20} />
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground font-semibold">Total Web Orders</div>
            <div className="text-lg font-black text-foreground">{pagination.total} Orders</div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-card rounded-2xl border border-border/80 p-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by order number or customer name..."
              className="form-input pl-10 text-xs py-2 bg-muted/20 border-border/70 rounded-xl focus:bg-card"
            />
          </div>

          <ModernSelect
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'processing', label: 'Processing' },
              { value: 'shipped', label: 'Shipped' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            buttonClassName="bg-muted/30 border-border/70 text-xs py-1.5 font-semibold"
          />

          <button
            onClick={resetFilters}
            className="px-3 py-2 text-xs font-bold text-muted-foreground border border-border/70 rounded-xl hover:bg-muted transition-colors cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={() => {
              sound.playClick()
              qc.invalidateQueries({ queryKey: ['orders'] })
            }}
            className="p-2 text-muted-foreground border border-border/70 rounded-xl hover:bg-muted transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ── MODERN WEB ORDERS CARDS GRID ─────────────────────────────────── */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 w-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card border border-border/70 rounded-2xl p-4 space-y-3">
                <div className="skeleton h-5 w-3/4 rounded-lg" />
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="skeleton h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/80 p-16 text-center text-muted-foreground">
            <ShoppingBag size={48} className="mx-auto mb-3 text-muted-foreground/30" />
            <p className="font-bold text-foreground text-sm">No Web Orders Found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or status filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 w-full">
            {orders.map((order) => {
              const formattedDate = new Date(order.created_at).toLocaleString()

              return (
                <div
                  key={order.id}
                  className="bg-card hover:bg-accent/30 border border-border/80 hover:border-primary/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all duration-200 shadow-2xs hover:shadow-md group relative"
                >
                  {/* Top Row: Order # & Status Badges */}
                  <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                        <ShoppingBag size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono font-black text-xs text-foreground truncate">
                          #{order.order_number}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {formattedDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getOrderStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase border ${getPaymentBadge(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </div>
                  </div>

                  {/* Customer Metadata & Address */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                        <User size={13} className="text-primary" /> Customer:
                      </span>
                      <span className="font-bold text-foreground truncate max-w-[150px]">
                        {order.customer?.name || order.shipping_name || 'Guest Customer'}
                      </span>
                    </div>

                    {order.customer?.phone && (
                      <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                        <span className="flex items-center gap-1 font-semibold">
                          <Phone size={12} className="text-muted-foreground" /> Phone:
                        </span>
                        <span className="font-mono text-foreground font-bold">{order.customer.phone}</span>
                      </div>
                    )}

                    {(order.shipping_address || order.shipping_city) && (
                      <div className="flex items-start gap-1 text-[10px] text-muted-foreground bg-muted/20 p-1.5 rounded-lg border border-border/50">
                        <MapPin size={12} className="text-amber-500 shrink-0 mt-0.5" />
                        <span className="truncate">
                          {[order.shipping_address, order.shipping_city, order.shipping_province].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Financial Summary Pill Container */}
                  <div className="bg-muted/30 border border-border/60 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="text-[10px] text-muted-foreground font-medium">Grand Total</div>
                      <div className="text-base font-black text-primary">
                        ${Number(order.grand_total).toFixed(2)}
                      </div>
                    </div>

                    <div className="text-right space-y-0.5 text-[10px]">
                      <div className="text-muted-foreground font-semibold">
                        Shipping: ${Number(order.shipping_cost || 0).toFixed(2)}
                      </div>
                      {Number(order.discount_amount) > 0 && (
                        <div className="text-rose-500 font-extrabold">
                          Disc: -${Number(order.discount_amount).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground font-bold">
                      Fulfillment: <span className="text-foreground capitalize">{order.fulfillment_status}</span>
                    </span>

                    <button
                      onClick={() => {
                        sound.playClick()
                        setSelectedOrderId(order.id)
                      }}
                      className="btn-secondary py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5 font-bold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                    >
                      <Eye size={14} /> Order Details
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          total={pagination.total}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
        />
      </div>

      {/* Modern Order Details Side-Drawer */}
      <AnimatePresence>
        {selectedOrderId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-end">
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-card w-full max-w-lg border-l border-border h-full flex flex-col shadow-2xl overflow-hidden"
            >
              {detailLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="animate-spin text-primary" size={36} />
                </div>
              ) : orderDetails && (
                <>
                  {/* Gradient Header Banner */}
                  <div className="p-5 border-b border-border bg-gradient-to-r from-primary/10 via-accent/30 to-background flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-3 rounded-2xl bg-primary/20 text-primary shrink-0 border border-primary/30 shadow-xs">
                        <ShoppingBag size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-mono font-black text-sm text-foreground truncate">
                            #{orderDetails.order_number}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getOrderStatusBadge(orderDetails.status)}`}>
                            {orderDetails.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {new Date(orderDetails.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick()
                        setSelectedOrderId(null)
                      }}
                      className="p-2 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      title="Close Drawer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Drawer Body Scroll */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Customer Contact & Delivery Info */}
                    <div className="bg-card border border-border/80 p-4 rounded-2xl shadow-2xs space-y-3 text-xs">
                      <div className="text-xs font-extrabold text-foreground uppercase tracking-wider border-b border-border/60 pb-2 flex items-center gap-1.5">
                        <User size={14} className="text-primary" /> Customer & Shipping Info
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[10px] text-muted-foreground font-semibold">Customer Name</div>
                          <div className="font-extrabold text-foreground">{orderDetails.customer?.name || orderDetails.shipping_name || 'Guest'}</div>
                        </div>

                        {orderDetails.customer?.phone && (
                          <div>
                            <div className="text-[10px] text-muted-foreground font-semibold">Phone</div>
                            <div className="font-mono text-foreground font-bold">{orderDetails.customer.phone}</div>
                          </div>
                        )}
                      </div>

                      {orderDetails.customer?.email && (
                        <div>
                          <div className="text-[10px] text-muted-foreground font-semibold">Email</div>
                          <div className="font-mono text-foreground">{orderDetails.customer.email}</div>
                        </div>
                      )}

                      {(orderDetails.shipping_address || orderDetails.shipping_city) && (
                        <div className="bg-muted/20 p-2.5 rounded-xl border border-border/60 space-y-1">
                          <div className="text-[10px] text-amber-600 font-extrabold uppercase flex items-center gap-1">
                            <MapPin size={12} /> Delivery Shipping Address
                          </div>
                          <div className="text-foreground font-medium">
                            {[orderDetails.shipping_address, orderDetails.shipping_city, orderDetails.shipping_province, orderDetails.shipping_postal_code].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Items Purchased List */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <ShoppingBag size={14} className="text-primary" /> Order Items Purchased
                        </h4>
                        <span className="text-[11px] font-mono text-muted-foreground font-bold">
                          {(orderDetails.items ?? []).length} Items
                        </span>
                      </div>

                      <div className="space-y-2">
                        {(orderDetails.items ?? []).map((item: any, idx: number) => (
                          <div
                            key={item.id || idx}
                            className="bg-card border border-border/70 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs hover:border-primary/40 transition-all shadow-2xs"
                          >
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="font-extrabold text-foreground truncate">
                                {item.product_name || item.product?.name || 'Product Item'}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                                {item.sku && (
                                  <span className="bg-muted px-1.5 py-0.5 rounded font-bold">
                                    SKU: {item.sku}
                                  </span>
                                )}
                                <span>${Number(item.unit_price || 0).toFixed(2)} × {item.quantity || 1}</span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="font-black text-primary text-xs">
                                ${Number(item.total || (item.unit_price * item.quantity)).toFixed(2)}
                              </div>
                              {Number(item.discount_amount) > 0 && (
                                <div className="text-[10px] text-rose-500 font-extrabold">
                                  -${Number(item.discount_amount).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Receipt Summary */}
                    <div className="bg-card border border-border/80 p-4 rounded-2xl shadow-xs space-y-2.5 text-xs">
                      <div className="text-xs font-extrabold text-foreground uppercase tracking-wider border-b border-border/60 pb-2">
                        Payment & Order Financial Summary
                      </div>

                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal Amount:</span>
                        <span className="font-mono font-bold text-foreground">${Number(orderDetails.subtotal || 0).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping Delivery Fee:</span>
                        <span className="font-mono font-bold text-foreground">${Number(orderDetails.shipping_cost || 0).toFixed(2)}</span>
                      </div>

                      {Number(orderDetails.discount_amount) > 0 && (
                        <div className="flex justify-between text-rose-500 font-bold">
                          <span>Total Discount:</span>
                          <span className="font-mono">-${Number(orderDetails.discount_amount).toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-muted-foreground">
                        <span>VAT Tax (10%):</span>
                        <span className="font-mono font-bold text-foreground">${Number(orderDetails.tax_amount || 0).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-baseline font-black text-lg border-t border-dashed border-border pt-2 text-foreground">
                        <span>Grand Total:</span>
                        <span className="text-primary font-mono">${Number(orderDetails.grand_total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Drawer Footer Status Transition Buttons */}
                  <div className="p-4 border-t border-border bg-card space-y-2">
                    <div className="flex items-center gap-2">
                      {orderDetails.status === 'pending' && (
                        <button
                          onClick={() => confirmMutation.mutate(orderDetails.id)}
                          disabled={isActionPending}
                          className="btn-primary flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle size={15} /> Confirm Order
                        </button>
                      )}

                      {(orderDetails.status === 'confirmed' || orderDetails.status === 'processing') && (
                        <button
                          onClick={() => shipMutation.mutate(orderDetails.id)}
                          disabled={isActionPending}
                          className="btn-primary flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer bg-indigo-600 hover:bg-indigo-500"
                        >
                          <Truck size={15} /> Dispatch / Ship Order
                        </button>
                      )}

                      {(orderDetails.status === 'shipped' || orderDetails.status === 'delivered') && (
                        <button
                          onClick={() => completeMutation.mutate(orderDetails.id)}
                          disabled={isActionPending}
                          className="btn-success flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle size={15} /> Mark Completed
                        </button>
                      )}

                      {orderDetails.status !== 'completed' && orderDetails.status !== 'cancelled' && (
                        <button
                          onClick={() => {
                            if (!window.confirm('Cancel this order?')) return
                            cancelMutation.mutate(orderDetails.id)
                          }}
                          disabled={isActionPending}
                          className="px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          <XCircle size={15} />
                        </button>
                      )}
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
