import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Search, Eye, RefreshCw, X, ShoppingBag, CheckCircle, Truck, XCircle,
  Loader2, Filter, Mail, Phone, MapPin, DollarSign, Calendar, Info,
  PackageCheck, Clock, User, ArrowRight, ShieldCheck, Printer, FileText, CornerUpLeft, CheckCircle2
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import { OrdersFilterDrawer } from './components/OrdersFilterDrawer'
import { OrdersDetailDrawer } from './components/OrdersDetailDrawer'

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
  const { t } = useTranslation('orders')
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
            <CheckCircle2 size={10} /> {t(st as any) || st}
          </span>
        )
      case 'processing':
      case 'confirmed':
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
            <Truck size={10} /> {t(st as any) || st}
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase">
            <Clock size={10} /> {t('pending')}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase">
            {t(st as any) || st}
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: t('salesOperations'), path: '/dashboard' }, { label: t('salesOperations') }, { label: t('webOrdersRegistry') }]} />

      <PageHeader
        title={t('title')}
        description={t('description')}
      />

      {/* ── 1. TOP 4 MODERN SLEEK METRIC CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: WEB REVENUE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-500/20 bg-card shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <DollarSign size={14} className="text-indigo-500" />
              {t('webEcommerceRevenue')}
            </span>
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shadow-2xs">
              <DollarSign className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-foreground tracking-tight">
                ${ordersList.reduce((acc, o) => acc + Number(o.grand_total || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                {t('onlineStore')}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 font-medium">
              {t('onlineWebStoreSales')}
            </div>
          </div>
        </motion.div>

        {/* CARD 2: PENDING & PROCESSING */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 bg-card shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Clock size={14} className="text-amber-500" />
              {t('pendingAndProcessing')}
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform shadow-2xs">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-foreground tracking-tight">
                {ordersList.filter((o) => ['pending', 'processing'].includes(o.status)).length} {t('ordersCount')}
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                {t('needsAction')}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 font-medium">
              {t('awaitingDispatchDelivery')}
            </div>
          </div>
        </motion.div>

        {/* CARD 3: COMPLETED & DELIVERED */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 bg-card shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <PackageCheck size={14} className="text-emerald-500" />
              {t('completedAndDelivered')}
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-2xs">
              <PackageCheck className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-foreground tracking-tight">
                {ordersList.filter((o) => ['completed', 'delivered'].includes(o.status)).length} {t('ordersCount')}
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {t('onTime')}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 font-medium">
              {t('successfullyDelivered')}
            </div>
          </div>
        </motion.div>

        {/* CARD 4: TOTAL WEB ORDERS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 bg-card shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-purple-500" />
              {t('totalWebOrders')}
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shadow-2xs">
              <ShoppingBag className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-foreground tracking-tight">
                {pagination.total} {t('ordersCount')}
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
                {t('liveEcommerce')}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 font-medium">
              {t('customerCheckoutRegistry')}
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
              placeholder={t('searchByOrderNumber')}
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
              <span>{t('filters')}</span>
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

      {/* ── 2. WEB ORDER CARDS GRID ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-5 rounded-[24px] bg-card border border-border/70 animate-pulse h-52" />
          ))
        ) : ordersList.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-card border border-border rounded-[24px]">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="font-bold text-foreground text-base">{t('noOrdersFound')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t('tryResettingSearch')}</p>
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
                      {t(order.payment_status as any) || order.payment_status}
                    </span>
                  </div>
                </div>

                {/* Card Body: Customer details & Address */}
                <div className="py-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-muted/20 border border-border/40">
                    <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]"><User size={13} /> {t('customer')}:</span>
                    <span className="font-bold text-foreground">{order.customer?.name || order.shipping_name || t('customer')}</span>
                  </div>
                  {order.customer?.phone && (
                    <div className="flex items-center justify-between px-2 text-[11px]">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><Phone size={13} /> {t('contact')}:</span>
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
                    <span className="text-[10px] text-muted-foreground font-semibold block uppercase">{t('grandTotal')}</span>
                    <span className="text-lg font-black text-primary tracking-tight">${Number(order.grand_total).toFixed(2)}</span>
                  </div>
                  <div className="text-right text-[10px] text-muted-foreground font-medium">
                    <div>{t('shipping')}: ${Number(order.shipping_cost || 0).toFixed(2)}</div>
                    <div>{t('disc')}: -${Number(order.discount_amount || 0).toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">
                    {t('statusLabel')}: <strong className="text-foreground">{t(order.fulfillment_status as any) || order.fulfillment_status || t('unfulfilled')}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedOrderId(order.id)}
                    className="px-4 py-2 bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye size={13} /> {t('orderDetails')}
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

      {/* Order Detail Drawer — slides in from the right */}
      <AnimatePresence>
        {selectedOrderId !== null && (
          <OrdersDetailDrawer
            order={orderDetails}
            isLoading={detailLoading}
            onClose={() => setSelectedOrderId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrdersPage
