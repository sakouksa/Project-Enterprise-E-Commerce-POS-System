import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Search, Eye, RefreshCw, X, Receipt, CornerUpLeft, Loader2, Calendar,
  User, ShoppingBag, Info, Clipboard, LayoutGrid, Table as TableIcon,
  DollarSign, TrendingUp, ShoppingCart, ShieldCheck, Tag, Sparkles, Filter, CheckCircle2
} from 'lucide-react'
import { salesService } from '@/services/salesService'
import { useToast } from '@/hooks/useToast'
import { sound } from '@/utils/sound'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import StatusBadge from '@/components/common/StatusBadge'
import { SalesFilterDrawer } from './components/SalesFilterDrawer'
import { SalesDetailDrawer } from './components/SalesDetailDrawer'
import { ProcessRefundModal } from './components/ProcessRefundModal'

interface SaleItem {
  id:                 number
  product_id:         number
  product_name:       string
  sku:                string
  quantity:           number
  unit_price:         number
  discount_amount:    number
  tax_amount:         number
  subtotal:           number
  total:              number
  product?:           { name: string }
}

interface Sale {
  id:              number
  invoice_number:  string
  customer?:      { name: string; phone?: string }
  cashier?:       { name: string }
  date:            string
  created_at:      string
  status:          'pending' | 'completed' | 'cancelled' | 'refunded'
  payment_status?: string
  payment_method?: string
  subtotal:        number
  tax_amount:      number
  discount_amount: number
  grand_total:     number
  paid_amount:     number
  change_amount:   number
  currency_code:   string
  notes?:          string
  items?:          SaleItem[]
}

const SalesPage: React.FC = () => {
  const { t } = useTranslation('sales')
  const navigate = useNavigate()
  const qc    = useQueryClient()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'all'

  const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    reset,
  } = useServerPagination({ storageKey: 'sales' })

  // Drawer & Filter States
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | undefined>(undefined)
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string | undefined>(undefined)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo]     = useState('')
  const [minTotal, setMinTotal] = useState('')
  const [maxTotal, setMaxTotal] = useState('')
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null)

  const activeFiltersCount = [
    statusFilter,
    paymentStatusFilter,
    paymentMethodFilter,
    dateFrom || undefined,
    dateTo || undefined,
    minTotal || undefined,
    maxTotal || undefined,
  ].filter(Boolean).length

  const handleResetAllFilters = () => {
    reset()
    setStatusFilter(undefined)
    setPaymentStatusFilter(undefined)
    setPaymentMethodFilter(undefined)
    setDateFrom('')
    setDateTo('')
    setMinTotal('')
    setMaxTotal('')
    setPage(1)
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['sales', page, debouncedSearch, perPage, dateFrom, dateTo, tab, statusFilter, paymentStatusFilter, paymentMethodFilter, minTotal, maxTotal],
    queryFn: () => salesService.list({
      page,
      search,
      per_page: perPage || 12,
      start_date: dateFrom || undefined,
      end_date: dateTo || undefined,
      status: tab === 'returns' ? 'refunded' : statusFilter || undefined,
      payment_status: paymentStatusFilter || undefined,
      sort: paymentMethodFilter || undefined,
    }),
    placeholderData: (prev) => prev,
  })

  const { data: saleDetail, isLoading: detailLoading } = useQuery<Sale | null>({
    queryKey: ['sales', selectedSaleId],
    queryFn: () => (selectedSaleId ? salesService.show(selectedSaleId) : Promise.resolve(null)),
    enabled: selectedSaleId !== null,
  })

  const [refundModalSale, setRefundModalSale] = useState<Sale | null>(null)

  const refundMutation = useMutation({
    mutationFn: (payload: { sale: Sale; reason: string; refund_method: string }) => {
      const saleObj = payload.sale
      const rawItems = saleObj?.items || (saleObj as any)?.sale_items || (saleObj as any)?.details || []
      const itemsPayload = rawItems.map((i: any) => ({
        sale_item_id: i.id,
        product_id: i.product_id,
        product_variant_id: i.product_variant_id ?? null,
        quantity: Number(i.quantity || 1),
      }))

      return salesService.returnSale(saleObj.id, {
        reason: payload.reason,
        refund_method: payload.refund_method,
        items: itemsPayload.length > 0 ? itemsPayload : undefined,
      })
    },
    onSuccess: () => {
      sound.playSuccess()
      qc.invalidateQueries({ queryKey: ['sales'] })
      toast.success('Sale order refunded successfully.')
      setRefundModalSale(null)
      setSelectedSaleId(null)
    },
    onError: (err: any) => {
      sound.playError()
      toast.error(err?.response?.data?.message || 'Failed to refund sale order.')
    },
  })

  const salesList: Sale[] = data?.data || []
  const pagination = {
    total:       data?.total        || salesList.length,
    currentPage: data?.current_page || page,
    lastPage:    data?.last_page    || 1,
    perPage:     data?.per_page     || perPage,
  }

  const pageTotals = salesList.reduce((acc, s) => {
    acc.revenue += Number(s.grand_total || 0)
    acc.items   += (s.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    if (s.status === 'completed') acc.completed += 1
    return acc
  }, { revenue: 0, items: 0, completed: 0 })

  const getStatusBadge = (st: string) => <StatusBadge status={st} />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'POS System' }, { label: t('salesOrders') }]} />

      {/* Hero Header matching Product Catalog design */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-xs print:hidden">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Receipt className="h-6 w-6 text-primary" />
            <span>{t('salesOrdersAndReceipts', 'Sales Orders & Invoices')}</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            {t('salesOrdersAndReceiptsDesc', 'Enterprise POS transaction logs, sales orders history, receipts, and audit trail')}
          </p>
        </div>
      </div>

      {/* ── 1. TOP 4 MODERN SLEEK METRIC CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: REVENUE VOLUME */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-[24px] bg-card border border-border/70 hover:border-emerald-500/40 p-5 shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
        >
          {/* Header: Title + Icon (Left) and Badge (Right) */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                {t('totalRevenueCard')}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <TrendingUp size={10} /> +18.4%
            </span>
          </div>

          {/* Big Number */}
          <div className="my-1">
            <div className="text-2xl xl:text-3xl font-black text-foreground tracking-tight font-mono">
              ${pageTotals.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {t('posCompletedRevenue')}
            </p>
          </div>

          {/* Bottom Accent Line */}
          <div className="mt-3 h-1 w-full bg-muted/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-full rounded-full" />
          </div>
        </motion.div>

        {/* CARD 2: COMPLETED ORDERS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="relative overflow-hidden rounded-[24px] bg-card border border-border/70 hover:border-blue-500/40 p-5 shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
        >
          {/* Header: Title + Icon (Left) and Badge (Right) */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-2xs">
                <ShoppingCart className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                {t('completedReceipts')}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              <CheckCircle2 size={10} /> 98.2%
            </span>
          </div>

          {/* Big Number */}
          <div className="my-1">
            <div className="text-2xl xl:text-3xl font-black text-foreground tracking-tight">
              <span className="font-mono">{pageTotals.completed}</span> <span className="text-sm font-bold text-muted-foreground">{t('orders')}</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {t('successfullyProcessed')}
            </p>
          </div>

          {/* Bottom Accent Line */}
          <div className="mt-3 h-1 w-full bg-muted/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[98.2%] rounded-full" />
          </div>
        </motion.div>

        {/* CARD 3: AVERAGE TICKET / ORDER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative overflow-hidden rounded-[24px] bg-card border border-border/70 hover:border-purple-500/40 p-5 shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
        >
          {/* Header: Title + Icon (Left) and Badge (Right) */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-2xs">
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                {t('avgTicketOrder')}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
              {t('avgTicketBadge', 'Avg Ticket')}
            </span>
          </div>

          {/* Big Number */}
          <div className="my-1">
            <div className="text-2xl xl:text-3xl font-black text-foreground tracking-tight font-mono">
              ${salesList.length > 0 ? (pageTotals.revenue / salesList.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {t('averageReceiptValue')}
            </p>
          </div>

          {/* Bottom Accent Line */}
          <div className="mt-3 h-1 w-full bg-muted/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[78%] rounded-full" />
          </div>
        </motion.div>

        {/* CARD 4: REGISTRY VOLUME */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="relative overflow-hidden rounded-[24px] bg-card border border-border/70 hover:border-amber-500/40 p-5 shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
        >
          {/* Header: Title + Icon (Left) and Badge (Right) */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-2xs">
                <Receipt className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                {t('totalRegistryVolume')}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
              <ShieldCheck size={10} /> {t('auditVerified', 'Audit Verified')}
            </span>
          </div>

          {/* Big Number */}
          <div className="my-1">
            <div className="text-2xl xl:text-3xl font-black text-foreground tracking-tight">
              <span className="font-mono">{pagination.total}</span> <span className="text-sm font-bold text-muted-foreground">{t('records', 'Records')}</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {t('auditTrailInvoiceLogs')}
            </p>
          </div>

          {/* Bottom Accent Line */}
          <div className="mt-3 h-1 w-full bg-muted/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 w-full rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Workspace Tabs */}
      <div className="flex border-b border-border/80 gap-2">
        <button
          onClick={() => {
            sound.playClick()
            const params = new URLSearchParams(searchParams)
            params.set('tab', 'all')
            setSearchParams(params)
            setPage(1)
          }}
          className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all cursor-pointer -mb-px flex items-center gap-1.5 ${
            tab === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Receipt size={14} /> {t('salesOrdersCount', 'Sales Orders')} ({pagination.total})
        </button>
        <button
          onClick={() => {
            sound.playClick()
            const params = new URLSearchParams(searchParams)
            params.set('tab', 'returns')
            setSearchParams(params)
            setPage(1)
          }}
          className={`px-4 py-2.5 text-xs font-extrabold border-b-2 transition-all cursor-pointer -mb-px flex items-center gap-1.5 ${
            tab === 'returns'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <CornerUpLeft size={14} /> {t('saleReturnsRefunds', 'Returns & Refunds')}
        </button>
      </div>

      {/* Toolbar & Filter Trigger */}
      <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-xs space-y-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <SearchInput
              value={search}
              onChange={(val) => { setSearch(val); setPage(1); }}
              placeholder={t('searchByInvoice')}
            />

            {/* Slide-out Modern Filter Drawer Trigger Button */}
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className={`inline-flex items-center gap-2 h-10 px-3.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-200 shadow-2xs hover:shadow active:scale-[0.98] cursor-pointer select-none shrink-0 ${
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
            onClick={() => qc.invalidateQueries({ queryKey: ['sales'] })}
            className="h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-muted/80 transition-all duration-200 shadow-2xs hover:shadow active:scale-[0.98] cursor-pointer shrink-0"
            title={t('refresh', 'Refresh')}
          >
            <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── 2. SALES ORDER CARDS GRID ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-card border border-border/70 animate-pulse h-52" />
          ))
        ) : salesList.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-card border border-border rounded-2xl">
            <Receipt className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="font-bold text-foreground text-base">{t('noSalesOrdersFound', 'No sales orders found')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t('tryClearingFilters', 'Try clearing filters or search for another invoice')}</p>
          </div>
        ) : (
          salesList.map((sale) => {
            const itemCount = Math.round(
              sale.items?.reduce((acc, item) => acc + Number(item.quantity || 1), 0) || 1
            )
            const paymentMethodLabel = sale.payment_method ? sale.payment_method.toUpperCase() : 'CASH'

            return (
              <motion.div
                key={sale.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border/80 rounded-2xl p-4 sm:p-4.5 shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Card Header: Invoice #, Date & Status Badge */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 border border-primary/20">
                        <Receipt size={15} />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono font-bold text-xs sm:text-[13px] text-foreground block tracking-tight truncate">
                          #{sale.invoice_number}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium block truncate">
                          {new Date(sale.created_at || sale.date).toLocaleDateString()} • {new Date(sale.created_at || sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {getStatusBadge(sale.status)}
                    </div>
                  </div>

                  {/* Card Body: Customer, Cashier, Payment Method */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/40 gap-2">
                      <span className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium shrink-0">
                        <User size={12} className="text-primary shrink-0" />
                        <span>{t('customer', 'Customer')}:</span>
                      </span>
                      <span className="font-bold text-foreground truncate text-right text-xs">
                        {sale.customer?.name || t('walkInCustomer', 'Walk-in Customer')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5 shrink-0">
                        <ShieldCheck size={12} className="shrink-0" />
                        <span>{t('cashier', 'Cashier')}:</span>
                      </span>
                      <span className="font-medium text-foreground truncate text-right">
                        {sale.cashier?.name || t('superAdmin', 'Super Admin')}
                      </span>
                    </div>

                    {/* Payment Method Badge */}
                    <div className="flex items-center justify-between px-1 pt-0.5 text-[11px]">
                      <span className="text-muted-foreground">{t('paymentMethod', 'Payment Method')}:</span>
                      <span className="px-2 py-0.5 rounded-md font-mono font-bold text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {paymentMethodLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Grand Total & View Invoice Action Button */}
                <div className="pt-3 mt-3 border-t border-border/60 space-y-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold block uppercase tracking-wider">
                        {t('grandTotal', 'Grand Total')}
                      </span>
                      <span className="text-base sm:text-lg font-mono font-black text-foreground tracking-tight">
                        ${Number(sale.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="text-right text-[10px] text-muted-foreground">
                      {Number(sale.tax_amount || 0) > 0 && (
                        <div>{t('tax', 'Tax')}: ${Number(sale.tax_amount).toFixed(2)}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-muted-foreground font-semibold">
                      {itemCount} {t('items', 'Items')}
                    </span>
                    <button
                      onClick={() => setSelectedSaleId(sale.id)}
                      className="h-8 px-3 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 shrink-0"
                    >
                      <Eye size={12} />
                      <span>{t('viewInvoice', 'View Invoice')}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })
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

      {/* Slide-out Sales Filter Drawer */}
      <SalesFilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        paymentStatusFilter={paymentStatusFilter}
        setPaymentStatusFilter={setPaymentStatusFilter}
        paymentMethodFilter={paymentMethodFilter}
        setPaymentMethodFilter={setPaymentMethodFilter}
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

      {/* Sale Detail Drawer — slides in from the right */}
      <AnimatePresence>
        {selectedSaleId !== null && (
          <SalesDetailDrawer
            sale={(saleDetail || salesList.find(s => s.id === selectedSaleId)) as Sale | undefined}
            isLoading={detailLoading && !salesList.find(s => s.id === selectedSaleId)}
            onClose={() => setSelectedSaleId(null)}
            onRefund={() => {
              const activeSale = (saleDetail || salesList.find(s => s.id === selectedSaleId)) as Sale | undefined
              if (activeSale) setRefundModalSale(activeSale)
            }}
            isRefunding={refundMutation.isPending}
          />
        )}
      </AnimatePresence>

      {/* Process Return Refund Modal */}
      <ProcessRefundModal
        isOpen={refundModalSale !== null}
        onClose={() => setRefundModalSale(null)}
        sale={refundModalSale}
        isPending={refundMutation.isPending}
        onConfirm={(payload) => {
          if (refundModalSale) {
            refundMutation.mutate({
              sale: refundModalSale,
              reason: payload.reason,
              refund_method: payload.refund_method,
            })
          }
        }}
      />
    </div>
  )
}

export default SalesPage
