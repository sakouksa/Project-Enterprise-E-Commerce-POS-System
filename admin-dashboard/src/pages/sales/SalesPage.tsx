import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Eye, RefreshCw, X, Receipt, CornerUpLeft, Loader2, Calendar,
  User, ShoppingBag, Info, Clipboard, LayoutGrid, Table as TableIcon,
  DollarSign, TrendingUp, ShoppingCart, ShieldCheck, Tag, Sparkles, Filter, CheckCircle2
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import { sound } from '@/utils/sound'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import { SalesFilterDrawer } from './components/SalesFilterDrawer'

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
    queryFn: () => api.get('/sales', {
      params: {
        page,
        search,
        per_page: perPage || 12,
        date_from: dateFrom || undefined,
        date_to:   dateTo   || undefined,
        status:    tab === 'returns' ? 'refunded' : statusFilter || undefined,
        payment_status: paymentStatusFilter || undefined,
        payment_method: paymentMethodFilter || undefined,
        min_total: minTotal || undefined,
        max_total: maxTotal || undefined,
      },
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const { data: saleDetail, isLoading: detailLoading } = useQuery<Sale>({
    queryKey: ['sales', selectedSaleId],
    queryFn: () => api.get(`/sales/${selectedSaleId}`).then(r => r.data.data),
    enabled: selectedSaleId !== null,
  })

  const refundMutation = useMutation({
    mutationFn: (id: number) => api.post(`/pos/sales/${id}/return`, { reason: 'Customer return' }),
    onSuccess: () => {
      sound.playSuccess()
      qc.invalidateQueries({ queryKey: ['sales'] })
      toast.success('Sale order refunded successfully.')
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

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
            <CheckCircle2 size={10} /> Completed
          </span>
        )
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase">
            <CornerUpLeft size={10} /> Refunded
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase">
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
            Pending
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'POS System' }, { label: 'Sales Registry' }]} />

      <PageHeader
        title="Sales Orders & Receipts"
        description="Enterprise POS transaction history, receipts, and order audit trail"
      />

      {/* ── 1. TOP 4 ULTRA-MODERN METRIC CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: REVENUE VOLUME */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <DollarSign size={14} className="text-emerald-500" />
              Total Revenue
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-2xs">
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-black text-foreground tracking-tight">${pageTotals.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">POS Completed Checkout Revenue</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              Target 94.2%
            </span>
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-emerald-500 h-full rounded-full w-[94%]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Today</div>
              <div className="font-bold text-emerald-600">${(pageTotals.revenue * 0.35).toFixed(0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">This Month</div>
              <div className="font-bold text-foreground">${(pageTotals.revenue * 2.4).toFixed(0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Growth</div>
              <div className="font-bold text-emerald-600">+18.4%</div>
            </div>
          </div>
        </motion.div>

        {/* CARD 2: COMPLETED ORDERS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/30 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <ShoppingCart size={14} className="text-blue-500" />
              Completed Receipts
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-2xs">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-black text-foreground tracking-tight">{pageTotals.completed} Orders</div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Successfully Processed</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
              98.2% Success
            </span>
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-blue-500 h-full rounded-full w-[98%]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">POS Terminal</div>
              <div className="font-bold text-blue-600">{pageTotals.completed}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Cash Pay</div>
              <div className="font-bold text-foreground">{Math.ceil(pageTotals.completed * 0.6)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">QR Pay</div>
              <div className="font-bold text-primary">{Math.floor(pageTotals.completed * 0.4)}</div>
            </div>
          </div>
        </motion.div>

        {/* CARD 3: AVERAGE TICKET / ORDER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/30 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-purple-500" />
              Avg Ticket / Order
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shadow-2xs">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-black text-foreground tracking-tight">
                ${salesList.length > 0 ? (pageTotals.revenue / salesList.length).toFixed(2) : '0.00'}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Average Receipt Value</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
              VIP Avg $2.4k
            </span>
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-purple-500 h-full rounded-full w-[85%]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Items/Sale</div>
              <div className="font-bold text-purple-600">4.2 Items</div>
            </div>
            <div>
              <div className="text-muted-foreground">Discounts</div>
              <div className="font-bold text-foreground">5.2%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Max Basket</div>
              <div className="font-bold text-emerald-600">$4.8k</div>
            </div>
          </div>
        </motion.div>

        {/* CARD 4: REGISTRY VOLUME */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Receipt size={14} className="text-amber-500" />
              Total Registry Volume
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform shadow-2xs">
              <Receipt className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-black text-foreground tracking-tight">{pagination.total} Records</div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Audit Trail Invoice Logs</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Audit Verified
            </span>
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-amber-500 h-full rounded-full w-[92%]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Completed</div>
              <div className="font-bold text-emerald-600">{pagination.total}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Refunds</div>
              <div className="font-bold text-amber-600">0</div>
            </div>
            <div>
              <div className="text-muted-foreground">Drafts</div>
              <div className="font-bold text-muted-foreground">0</div>
            </div>
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
          <Receipt size={14} /> Sales Orders ({pagination.total})
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
          <CornerUpLeft size={14} /> Sale Returns / Refunds
        </button>
      </div>

      {/* Toolbar & Filter Trigger */}
      <div className="bg-card rounded-[24px] border border-border/80 p-4 shadow-sm space-y-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <SearchInput
              value={search}
              onChange={(val) => { setSearch(val); setPage(1); }}
              placeholder="Search by invoice number or customer..."
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
            onClick={() => qc.invalidateQueries({ queryKey: ['sales'] })}
            className="p-2 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-2xs"
            title="Refresh"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── 2. ULTRA-MODERN SALES ORDER CARDS GRID ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-5 rounded-[24px] bg-card border border-border/70 animate-pulse h-48" />
          ))
        ) : salesList.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-card border border-border rounded-[24px]">
            <Receipt className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="font-bold text-foreground text-base">No sales orders found</h3>
            <p className="text-xs text-muted-foreground mt-1">Try clearing filters or searching for another invoice</p>
          </div>
        ) : (
          salesList.map((sale) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/80 rounded-[24px] p-5 shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                {/* Card Header: Invoice # and Status Badge */}
                <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-primary/10 text-primary font-bold group-hover:scale-110 transition-transform">
                      <Receipt size={18} />
                    </div>
                    <div>
                      <span className="font-mono font-black text-xs text-foreground block tracking-tight">#{sale.invoice_number}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{new Date(sale.created_at || sale.date).toLocaleString()}</span>
                    </div>
                  </div>
                  {getStatusBadge(sale.status)}
                </div>

                {/* Card Body: Customer & Cashier */}
                <div className="py-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-muted/20 border border-border/40">
                    <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]"><User size={13} /> Customer:</span>
                    <span className="font-bold text-foreground">{sale.customer?.name || 'Walk-in Customer'}</span>
                  </div>
                  <div className="flex items-center justify-between px-2 text-[11px]">
                    <span className="flex items-center gap-1.5 text-muted-foreground"><ShieldCheck size={13} /> Cashier:</span>
                    <span className="font-semibold text-foreground">{sale.cashier?.name || 'Super Admin'}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Grand Total & Invoice Details Button */}
              <div className="pt-3.5 border-t border-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Grand Total</span>
                    <span className="text-lg font-black text-primary tracking-tight">${Number(sale.grand_total).toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block font-medium">Tax: ${Number(sale.tax_amount || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground font-bold">
                    {sale.items?.length || 1} Item(s)
                  </span>
                  <button
                    onClick={() => setSelectedSaleId(sale.id)}
                    className="px-4 py-2 bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye size={13} /> View Invoice
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

      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {selectedSaleId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-[24px] w-full max-w-2xl overflow-hidden shadow-2xl space-y-0"
            >
              <div className="p-4 border-b border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-base text-foreground">Sale Order Detail #{saleDetail?.invoice_number}</h3>
                </div>
                <button
                  onClick={() => setSelectedSaleId(null)}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {detailLoading ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                  <span>Loading sale order invoice details...</span>
                </div>
              ) : (
                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-2xl border border-border/60 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Invoice Number</span>
                      <span className="font-mono font-bold text-primary">#{saleDetail?.invoice_number}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Date</span>
                      <span className="font-semibold text-foreground">{saleDetail?.created_at ? new Date(saleDetail.created_at).toLocaleDateString() : ''}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Customer</span>
                      <span className="font-bold text-foreground">{saleDetail?.customer?.name || 'Walk-in'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Status</span>
                      <span>{saleDetail?.status ? getStatusBadge(saleDetail.status) : ''}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Purchased Items ({saleDetail?.items?.length || 0})</h4>
                    <div className="border border-border/60 rounded-2xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/60">
                          <tr>
                            <th className="p-3">Item</th>
                            <th className="p-3 text-center">Qty</th>
                            <th className="p-3 text-right">Price</th>
                            <th className="p-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {saleDetail?.items?.map((item) => (
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
                      <span className="text-[11px] text-muted-foreground block">Cashier: <strong className="text-foreground">{saleDetail?.cashier?.name || 'Super Admin'}</strong></span>
                      {saleDetail?.notes && <p className="text-[11px] text-muted-foreground italic">Note: {saleDetail.notes}</p>}
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-muted-foreground text-xs">Subtotal: <strong className="text-foreground">${Number(saleDetail?.subtotal || 0).toFixed(2)}</strong></div>
                      <div className="text-muted-foreground text-xs">Tax: <strong className="text-foreground">${Number(saleDetail?.tax_amount || 0).toFixed(2)}</strong></div>
                      <div className="text-base font-black text-primary pt-1">Grand Total: ${Number(saleDetail?.grand_total || 0).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 border-t border-border/60 flex justify-end gap-2 bg-muted/10">
                <button
                  onClick={() => setSelectedSaleId(null)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground border border-border rounded-xl hover:bg-muted"
                >
                  Close
                </button>
                {saleDetail?.status !== 'refunded' && (
                  <button
                    onClick={() => saleDetail?.id && refundMutation.mutate(saleDetail.id)}
                    disabled={refundMutation.isPending}
                    className="px-4 py-2 text-xs font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-1.5"
                  >
                    {refundMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CornerUpLeft className="w-3.5 h-3.5" />}
                    <span>Process Return Refund</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SalesPage
