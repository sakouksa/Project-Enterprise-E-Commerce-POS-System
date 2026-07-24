import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Eye, RefreshCw, X, ShoppingBag, CheckCircle, Truck, XCircle,
  Loader2, Filter, Mail, Phone, MapPin, DollarSign, Calendar, Info,
  PackageCheck, Clock, User, ArrowRight, ShieldCheck, Printer, FileText, CornerUpLeft, CheckCircle2
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import { sound } from '@/utils/sound'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import { OrdersFilterDrawer } from './components/OrdersFilterDrawer'

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

  // Drawer & Filter States
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | undefined>(undefined)
  const [fulfillmentStatusFilter, setFulfillmentStatusFilter] = useState<string | undefined>(undefined)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo]     = useState('')
  const [minTotal, setMinTotal] = useState('')
  const [maxTotal, setMaxTotal] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  const activeFiltersCount = [
    statusFilter,
    paymentStatusFilter,
    fulfillmentStatusFilter,
    dateFrom || undefined,
    dateTo || undefined,
    minTotal || undefined,
    maxTotal || undefined,
  ].filter(Boolean).length

  const handleResetAllFilters = () => {
    reset()
    setStatusFilter(undefined)
    setPaymentStatusFilter(undefined)
    setFulfillmentStatusFilter(undefined)
    setDateFrom('')
    setDateTo('')
    setMinTotal('')
    setMaxTotal('')
    setPage(1)
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['orders', page, debouncedSearch, perPage, statusFilter, paymentStatusFilter, fulfillmentStatusFilter, dateFrom, dateTo, minTotal, maxTotal],
    queryFn: () => api.get('/orders', {
      params: {
        page,
        search,
        per_page: perPage || 12,
        status: statusFilter || undefined,
        payment_status: paymentStatusFilter || undefined,
        fulfillment_status: fulfillmentStatusFilter || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        min_total: minTotal || undefined,
        max_total: maxTotal || undefined,
      },
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const { data: orderDetails, isLoading: detailLoading } = useQuery<Order>({
    queryKey: ['order-details', selectedOrderId],
    queryFn: () => api.get(`/orders/${selectedOrderId}`).then(r => r.data.data),
    enabled: selectedOrderId !== null,
  })

  const ordersList: Order[] = data?.data || []
  const pagination = {
    total:       data?.total        || ordersList.length,
    currentPage: data?.current_page || page,
    lastPage:    data?.last_page    || 1,
    perPage:     data?.per_page     || perPage,
  }

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'completed':
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
            <CheckCircle2 size={10} /> {st}
          </span>
        )
      case 'processing':
      case 'confirmed':
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
            <Truck size={10} /> {st}
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase">
            <Clock size={10} /> Pending
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase">
            {st}
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Sales & Operations' }, { label: 'Web Orders Registry' }]} />

      <PageHeader
        title="Web E-Commerce Orders"
        description="Manage online web store orders, customer delivery addresses, and carrier fulfillment"
      />

      {/* ── 1. TOP 4 ULTRA-MODERN METRIC CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: WEB REVENUE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-indigo-500/10 via-cyan-500/5 to-transparent border border-indigo-500/30 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <DollarSign size={14} className="text-indigo-500" />
              Web E-Commerce Revenue
            </span>
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shadow-2xs">
              <DollarSign className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-black text-foreground tracking-tight">
                ${ordersList.reduce((acc, o) => acc + Number(o.grand_total || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Online Web Store Checkout Sales</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
              Online Store
            </span>
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-indigo-500 h-full rounded-full w-[92%]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Page Gross</div>
              <div className="font-bold text-indigo-600">${ordersList.reduce((acc, o) => acc + Number(o.grand_total || 0), 0).toFixed(0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Discounts</div>
              <div className="font-bold text-foreground">-${ordersList.reduce((acc, o) => acc + Number(o.discount_amount || 0), 0).toFixed(0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Net Profit</div>
              <div className="font-bold text-emerald-600">+88.4%</div>
            </div>
          </div>
        </motion.div>

        {/* CARD 2: PENDING & PROCESSING */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Clock size={14} className="text-amber-500 animate-pulse" />
              Pending & Processing
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform shadow-2xs">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-black text-foreground tracking-tight">
                {ordersList.filter((o) => ['pending', 'processing'].includes(o.status)).length} Orders
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Awaiting Dispatch & Delivery</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Needs Action
            </span>
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-amber-500 h-full rounded-full w-[70%]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Unpaid</div>
              <div className="font-bold text-amber-600">{ordersList.filter((o) => o.payment_status === 'unpaid').length}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Processing</div>
              <div className="font-bold text-foreground">{ordersList.filter((o) => o.status === 'processing').length}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Awaiting Ship</div>
              <div className="font-bold text-primary">{ordersList.filter((o) => o.status === 'pending').length}</div>
            </div>
          </div>
        </motion.div>

        {/* CARD 3: COMPLETED & DELIVERED */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <PackageCheck size={14} className="text-emerald-500" />
              Completed & Delivered
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-2xs">
              <PackageCheck className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-black text-foreground tracking-tight">
                {ordersList.filter((o) => ['completed', 'delivered'].includes(o.status)).length} Orders
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Successfully Delivered</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              100% On-Time
            </span>
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-emerald-500 h-full rounded-full w-[98%]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Carrier Ship</div>
              <div className="font-bold text-emerald-600">{ordersList.filter((o) => ['completed', 'delivered'].includes(o.status)).length}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Store Pickup</div>
              <div className="font-bold text-foreground">0</div>
            </div>
            <div>
              <div className="text-muted-foreground">Express</div>
              <div className="font-bold text-primary">100%</div>
            </div>
          </div>
        </motion.div>

        {/* CARD 4: TOTAL WEB ORDERS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-purple-500/10 via-rose-500/5 to-transparent border border-purple-500/30 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-purple-500" />
              Total Web Orders
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shadow-2xs">
              <ShoppingBag className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-black text-foreground tracking-tight">{pagination.total} Orders</div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Customer Checkout Registry</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
              Live E-Commerce
            </span>
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-purple-500 h-full rounded-full w-[95%]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Total Vol</div>
              <div className="font-bold text-purple-600">{pagination.total}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Fulfillment</div>
              <div className="font-bold text-emerald-600">96.8%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Rating</div>
              <div className="font-bold text-amber-500">4.9 ★</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Toolbar & Filter Trigger */}
      <div className="bg-card rounded-[24px] border border-border/80 p-4 shadow-sm space-y-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <SearchInput
              value={search}
              onChange={(val) => { setSearch(val); setPage(1); }}
              placeholder="Search by order number or customer name..."
            />

            {/* Slide-out Modern Filter Drawer Trigger Button */}
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border transition-all shadow-2xs cursor-pointer ${
                activeFiltersCount > 0
                  ? 'bg-primary/10 border-primary text-primary font-semibold'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Filter size={14} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-primary text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <ResetButton onClick={handleResetAllFilters} />
          </div>

          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['orders'] })}
            className="p-2 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-2xs"
            title="Refresh"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── 2. ULTRA-MODERN WEB ORDER CARDS GRID ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-5 rounded-[24px] bg-card border border-border/70 animate-pulse h-52" />
          ))
        ) : ordersList.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-card border border-border rounded-[24px]">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="font-bold text-foreground text-base">No web orders found</h3>
            <p className="text-xs text-muted-foreground mt-1">Try resetting search or drawer filters</p>
          </div>
        ) : (
          ordersList.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/80 rounded-[24px] p-5 shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                {/* Card Header: Order #, Date, and Badges */}
                <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 font-bold group-hover:scale-110 transition-transform">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <span className="font-mono font-black text-xs text-foreground block tracking-tight">#{order.order_number}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{new Date(order.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(order.status)}
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground">
                      {order.payment_status}
                    </span>
                  </div>
                </div>

                {/* Card Body: Customer details & Address */}
                <div className="py-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-muted/20 border border-border/40">
                    <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]"><User size={13} /> Customer:</span>
                    <span className="font-bold text-foreground">{order.customer?.name || order.shipping_name || 'Customer'}</span>
                  </div>
                  {order.customer?.phone && (
                    <div className="flex items-center justify-between px-2 text-[11px]">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><Phone size={13} /> Contact:</span>
                      <span className="font-mono font-semibold text-foreground">{order.customer.phone}</span>
                    </div>
                  )}
                  {order.shipping_address && (
                    <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground px-2 pt-1">
                      <MapPin size={13} className="flex-shrink-0 mt-0.5 text-primary" />
                      <span className="line-clamp-1">{order.shipping_address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Grand Total & Order Details Button */}
              <div className="pt-3.5 border-t border-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Grand Total</span>
                    <span className="text-lg font-black text-primary tracking-tight">${Number(order.grand_total).toFixed(2)}</span>
                  </div>
                  <div className="text-right text-[10px] text-muted-foreground font-medium">
                    <div>Shipping: ${Number(order.shipping_cost || 0).toFixed(2)}</div>
                    <div>Disc: -${Number(order.discount_amount || 0).toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">
                    Status: <strong className="text-foreground">{order.fulfillment_status || 'Unfulfilled'}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedOrderId(order.id)}
                    className="px-4 py-2 bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye size={13} /> Order Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination Bar */}
      <div className="bg-card border border-border/80 rounded-[24px] p-4 shadow-2xs">
        <Pagination
          currentPage={pagination.currentPage}
          lastPage={pagination.lastPage}
          total={pagination.total}
          perPage={pagination.perPage}
          onPageChange={setPage}
          onPerPageChange={(ps) => { setPerPage(ps); setPage(1); }}
          isLoading={isLoading}
        />
      </div>

      {/* Slide-out Web Orders Filter Drawer */}
      <OrdersFilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        paymentStatusFilter={paymentStatusFilter}
        setPaymentStatusFilter={setPaymentStatusFilter}
        fulfillmentStatusFilter={fulfillmentStatusFilter}
        setFulfillmentStatusFilter={setFulfillmentStatusFilter}
        startDate={dateFrom}
        setStartDate={setDateFrom}
        endDate={dateTo}
        setEndDate={setDateTo}
        minTotal={minTotal}
        setMinTotal={setMinTotal}
        maxTotal={maxTotal}
        setMaxTotal={setMaxTotal}
        onReset={handleResetAllFilters}
        onApply={() => setPage(1)}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrderId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-[24px] w-full max-w-2xl overflow-hidden shadow-2xl space-y-0"
            >
              <div className="p-4 border-b border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-base text-foreground">Web Order Detail #{orderDetails?.order_number}</h3>
                </div>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {detailLoading ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                  <span>Loading order details...</span>
                </div>
              ) : (
                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-2xl border border-border/60 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Order Number</span>
                      <span className="font-mono font-bold text-primary">#{orderDetails?.order_number}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Created Date</span>
                      <span className="font-semibold text-foreground">{orderDetails?.created_at ? new Date(orderDetails.created_at).toLocaleDateString() : ''}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Payment Status</span>
                      <span className="font-bold uppercase text-emerald-600">{orderDetails?.payment_status}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Order Status</span>
                      <span>{orderDetails?.status ? getStatusBadge(orderDetails.status) : ''}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-card border border-border/60 rounded-2xl space-y-2 text-xs">
                    <h4 className="font-bold text-xs uppercase text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> Shipping Delivery Address
                    </h4>
                    <p className="font-semibold text-foreground">{orderDetails?.shipping_name || orderDetails?.customer?.name}</p>
                    <p className="text-muted-foreground">{orderDetails?.shipping_address}, {orderDetails?.shipping_city}, {orderDetails?.shipping_province}</p>
                    <p className="text-muted-foreground font-mono">Contact Phone: {orderDetails?.shipping_phone || orderDetails?.customer?.phone}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Ordered Items ({orderDetails?.items?.length || 0})</h4>
                    <div className="border border-border/60 rounded-2xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/60">
                          <tr>
                            <th className="p-3">Product Name</th>
                            <th className="p-3 text-center">Qty</th>
                            <th className="p-3 text-right">Unit Price</th>
                            <th className="p-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {orderDetails?.items?.map((item) => (
                            <tr key={item.id}>
                              <td className="p-3 font-semibold text-foreground">{item.product_name || item.product?.name}</td>
                              <td className="p-3 text-center font-bold">{item.quantity}</td>
                              <td className="p-3 text-right">${Number(item.unit_price).toFixed(2)}</td>
                              <td className="p-3 text-right font-bold text-foreground">${Number(item.total || (item.quantity * item.unit_price)).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-border/60 pt-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Fulfillment Status: <strong className="text-foreground uppercase">{orderDetails?.fulfillment_status}</strong></span>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-muted-foreground text-xs">Subtotal: <strong className="text-foreground">${Number(orderDetails?.subtotal || 0).toFixed(2)}</strong></div>
                      <div className="text-muted-foreground text-xs">Shipping: <strong className="text-foreground">${Number(orderDetails?.shipping_cost || 0).toFixed(2)}</strong></div>
                      <div className="text-base font-black text-primary pt-1">Grand Total: ${Number(orderDetails?.grand_total || 0).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 border-t border-border/60 flex justify-end gap-2 bg-muted/10">
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground border border-border rounded-xl hover:bg-muted"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrdersPage
