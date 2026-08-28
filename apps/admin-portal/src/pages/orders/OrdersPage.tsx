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
import StatusBadge from '@/components/common/StatusBadge'
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

  const getStatusBadge = (st: string) => <StatusBadge status={st} />

  const getPaymentStatusBadge = (pst: string) => <StatusBadge status={pst} />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: t('salesOperations'), path: '/dashboard' }, { label: t('salesOperations') }, { label: t('webOrdersRegistry') }]} />

      {/* Hero Header matching Product Catalog design */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-xs print:hidden">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span>{t('title', 'ការបញ្ជាទិញតាមវេបសាយ')}</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            {t('description', 'គ្រប់គ្រងការបញ្ជាទិញតាមហាងអនឡាញ អាសយដ្ឋានដឹកជញ្ជូន និងការអនុវត្តការដឹកជញ្ជូន')}
          </p>
        </div>
      </div>

      {/* ── 1. TOP 4 MODERN SLEEK METRIC CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 print:hidden">
        {/* CARD 1: WEB REVENUE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="relative overflow-hidden rounded-2xl bg-card border border-border/80 hover:border-emerald-500/40 p-4 sm:p-5 shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t('webEcommerceRevenue', 'ចំណូលលក់តាមវេបសាយ')}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              {t('onlineStore', 'ហាងអនឡាញ')}
            </span>
          </div>

          <div className="my-1">
            <div className="text-2xl xl:text-3xl font-black text-foreground tracking-tight font-mono">
              ${ordersList.reduce((acc, o) => acc + Number(o.grand_total || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {t('onlineWebStoreSales', 'ការលក់ចេញពីហាងអនឡាញ')}
            </p>
          </div>

          <div className="mt-3 h-1 w-full bg-muted/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-full rounded-full" />
          </div>
        </motion.div>

        {/* CARD 2: PENDING & PROCESSING */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="relative overflow-hidden rounded-2xl bg-card border border-border/80 hover:border-amber-500/40 p-4 sm:p-5 shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-2xs">
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t('pendingAndProcessing', 'រង់ចាំ និង កំពុងដំណើរការ')}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
              {t('needsAction', 'ត្រូវការសកម្មភាព')}
            </span>
          </div>

          <div className="my-1">
            <div className="text-2xl xl:text-3xl font-black text-foreground tracking-tight">
              <span className="font-mono">{ordersList.filter((o) => ['pending', 'processing'].includes(o.status)).length}</span> <span className="text-sm font-bold text-muted-foreground">{t('ordersCount', 'ការបញ្ជាទិញ')}</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {t('awaitingDispatchDelivery', 'រង់ចាំការរៀបចំ និង ដឹកជញ្ជូន')}
            </p>
          </div>

          <div className="mt-3 h-1 w-full bg-muted/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 w-full rounded-full" />
          </div>
        </motion.div>

        {/* CARD 3: COMPLETED & DELIVERED */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-card border border-border/80 hover:border-blue-500/40 p-4 sm:p-5 shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-2xs">
                <PackageCheck className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t('completedAndDelivered', 'បានបញ្ចប់ និង ដឹកជញ្ជូនរួច')}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              {t('onTime', 'ទាន់ពេល 100%')}
            </span>
          </div>

          <div className="my-1">
            <div className="text-2xl xl:text-3xl font-black text-foreground tracking-tight">
              <span className="font-mono">{ordersList.filter((o) => ['completed', 'delivered'].includes(o.status)).length}</span> <span className="text-sm font-bold text-muted-foreground">{t('ordersCount', 'ការបញ្ជាទិញ')}</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {t('successfullyDelivered', 'ដឹកជញ្ជូនបានជោគជ័យ')}
            </p>
          </div>

          <div className="mt-3 h-1 w-full bg-muted/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-full rounded-full" />
          </div>
        </motion.div>

        {/* CARD 4: TOTAL WEB ORDERS */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="relative overflow-hidden rounded-2xl bg-card border border-border/80 hover:border-purple-500/40 p-4 sm:p-5 shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-2xs">
                <ShoppingBag className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t('totalWebOrders', 'ការបញ្ជាទិញសរុប')}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
              {t('liveEcommerce', 'អនឡាញ')}
            </span>
          </div>

          <div className="my-1">
            <div className="text-2xl xl:text-3xl font-black text-foreground tracking-tight">
              <span className="font-mono">{pagination.total}</span> <span className="text-sm font-bold text-muted-foreground">{t('ordersCount', 'ការបញ្ជាទិញ')}</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {t('customerCheckoutRegistry', 'កំណត់ត្រាការបញ្ជាទិញរបស់អតិថិជន')}
            </p>
          </div>

          <div className="mt-3 h-1 w-full bg-muted/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-full rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Toolbar & Filter Trigger */}
      <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-xs space-y-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <SearchInput
              value={search}
              onChange={(val) => { setSearch(val); setPage(1); }}
              placeholder={t('searchByOrderNumber')}
            />

            {/* Slide-out Modern Filter Drawer Trigger Button */}
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className={`inline-flex items-center gap-2 h-10 px-3.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer select-none shrink-0 ${
                activeFiltersCount > 0
                  ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/15'
                  : 'border-border bg-card text-foreground hover:bg-muted/80'
              }`}
            >
              <Filter size={15} className={activeFiltersCount > 0 ? 'text-primary' : 'text-muted-foreground'} />
              <span>{t('filters', 'Filter')}</span>
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground leading-none">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <ResetButton onClick={handleResetAllFilters} />
          </div>

          <button
            type="button"
            onClick={() => qc.invalidateQueries({ queryKey: ['orders'] })}
            className="h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-muted/80 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer shrink-0"
            title="Refresh"
          >
            <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/80 rounded-2xl p-4 sm:p-4.5 shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header: Reference + Date & Badges */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 border border-primary/20">
                      <ShoppingBag size={15} />
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono font-bold text-xs sm:text-[13px] text-foreground block tracking-tight truncate">
                        #{order.order_number}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium block truncate">
                        {new Date(order.created_at).toLocaleDateString()} • {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                    {getStatusBadge(order.status)}
                    {getPaymentStatusBadge(order.payment_status)}
                  </div>
                </div>

                {/* Body: Customer & Address */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/40 gap-2">
                    <span className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium shrink-0">
                      <User size={12} className="text-primary shrink-0" />
                      <span>{t('customer', 'អតិថិជន')}:</span>
                    </span>
                    <span className="font-bold text-foreground truncate text-right text-xs">
                      {order.customer?.name || order.shipping_name || t('customer', 'អតិថិជន')}
                    </span>
                  </div>

                  {order.customer?.phone && (
                    <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5 shrink-0">
                        <Phone size={11} />
                        <span>{t('contact', 'ទំនាក់ទំនង')}:</span>
                      </span>
                      <span className="font-mono font-medium text-foreground">{order.customer.phone}</span>
                    </div>
                  )}

                  {order.shipping_address && (
                    <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground px-1 pt-0.5">
                      <MapPin size={12} className="shrink-0 mt-0.5 text-primary/70" />
                      <span className="line-clamp-1">{order.shipping_address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer: Grand Total, Breakdown & Button */}
              <div className="pt-3 mt-3 border-t border-border/60 space-y-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-semibold block uppercase tracking-wider">
                      {t('grandTotal', 'សរុបចុងក្រោយ')}
                    </span>
                    <span className="text-base sm:text-lg font-mono font-black text-foreground tracking-tight">
                      ${Number(order.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="text-right text-[10px] text-muted-foreground space-y-0.5">
                    {Number(order.shipping_cost || 0) > 0 && (
                      <div>{t('shipping', 'ដឹកជញ្ជូន')}: ${Number(order.shipping_cost).toFixed(2)}</div>
                    )}
                    {Number(order.discount_amount || 0) > 0 && (
                      <div className="text-emerald-600 dark:text-emerald-400">-{t('disc', 'បញ្ចុះ')}: ${Number(order.discount_amount).toFixed(2)}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {t('fulfillment', 'ការដឹកជញ្ជូន')}: <span className="text-foreground font-bold">{t(order.fulfillment_status as any) || order.fulfillment_status || t('unfulfilled', 'មិនទាន់បំពេញ')}</span>
                  </span>
                  <button
                    onClick={() => setSelectedOrderId(order.id)}
                    className="h-8 px-3 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 shrink-0"
                  >
                    <Eye size={12} />
                    <span>{t('orderDetails', 'ពិនិត្យលម្អិត')}</span>
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
