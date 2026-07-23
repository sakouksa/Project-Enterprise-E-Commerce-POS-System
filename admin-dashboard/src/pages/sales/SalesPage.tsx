import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Eye, RefreshCw, X, Receipt, CornerUpLeft, Loader2, Calendar,
  User, ShoppingBag, Info, Clipboard, LayoutGrid, Table as TableIcon,
  DollarSign, TrendingUp, ShoppingCart, ShieldCheck, Tag, Sparkles
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import { sound } from '@/utils/sound'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'

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

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

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

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo]     = useState('')
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['sales', page, debouncedSearch, perPage, dateFrom, dateTo, tab],
    queryFn: () => api.get('/sales', {
      params: {
        page,
        search,
        per_page: perPage || 12,
        date_from: dateFrom || undefined,
        date_to:   dateTo   || undefined,
        status:    tab === 'returns' ? 'refunded' : undefined,
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
      toast.success('Refund processed successfully.')
      setSelectedSaleId(null)
    },
    onError: (err: any) => {
      sound.playError()
      toast.error(err?.response?.data?.message ?? 'Failed to process refund.')
    },
  })

  const sales: Sale[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const resetFilters = () => {
    sound.playClick()
    setSearch('')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  // Summary Metrics calculations
  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.grand_total || 0), 0)
  const completedSalesCount = sales.filter(s => s.status === 'completed').length
  const avgOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
      case 'refunded':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'POS System' }, { label: 'Sales Registry' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeader
          title="Sales Orders & Receipts"
          subtitle="Enterprise POS transaction history, receipts, and order audit trail"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <DollarSign size={20} />
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground font-semibold">Total Revenue (Current Page)</div>
            <div className="text-lg font-black text-foreground">${totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShoppingCart size={20} />
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground font-semibold">Completed Orders</div>
            <div className="text-lg font-black text-foreground">{completedSalesCount} orders</div>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground font-semibold">Avg Ticket / Order</div>
            <div className="text-lg font-black text-foreground">${avgOrderValue.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600">
            <Receipt size={20} />
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground font-semibold">Total Registry Volume</div>
            <div className="text-lg font-black text-foreground">{pagination.total} Records</div>
          </div>
        </div>
      </div>

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

      <div className="bg-card rounded-2xl border border-border/80 p-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by invoice number or customer..."
              className="form-input pl-10 text-xs py-2 bg-muted/20 border-border/70 rounded-xl focus:bg-card"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-muted-foreground flex-shrink-0" />
            <input
              type="date"
              value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setPage(1) }}
              className="form-input text-xs py-1.5 w-36 bg-muted/20 rounded-xl"
              title="From date"
            />
            <span className="text-muted-foreground text-xs">–</span>
            <input
              type="date"
              value={dateTo}
              onChange={e => { setDateTo(e.target.value); setPage(1) }}
              className="form-input text-xs py-1.5 w-36 bg-muted/20 rounded-xl"
              title="To date"
            />
          </div>
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-xs font-bold text-muted-foreground border border-border/70 rounded-xl hover:bg-muted transition-colors cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={() => {
              sound.playClick()
              qc.invalidateQueries({ queryKey: ['sales'] })
            }}
            className="p-2 text-muted-foreground border border-border/70 rounded-xl hover:bg-muted transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ── MODERN SALES ORDER CARDS GRID ────────────────────────────────── */}
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
        ) : sales.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/80 p-16 text-center text-muted-foreground">
            <Receipt size={48} className="mx-auto mb-3 text-muted-foreground/30" />
            <p className="font-bold text-foreground text-sm">No Sales Orders Found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your date range or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 w-full">
            {sales.map((sale) => {
              const formattedDate = sale.date
                ? new Date(sale.date).toLocaleString()
                : new Date(sale.created_at).toLocaleString()

              return (
                <div
                  key={sale.id}
                  className="bg-card hover:bg-accent/30 border border-border/80 hover:border-primary/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all duration-200 shadow-2xs hover:shadow-md group relative"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                        <Receipt size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono font-black text-xs text-foreground truncate">
                          #{sale.invoice_number}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {formattedDate}
                        </div>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border shrink-0 ${getStatusBadge(sale.status)}`}>
                      {sale.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                        <User size={13} className="text-primary" /> Customer:
                      </span>
                      <span className="font-bold text-foreground truncate max-w-[150px]">
                        {sale.customer?.name || 'Walk-in Customer'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                        <ShieldCheck size={13} className="text-indigo-500" /> Cashier:
                      </span>
                      <span className="font-semibold text-foreground truncate max-w-[150px]">
                        {sale.cashier?.name || 'Admin Cashier'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted/30 border border-border/60 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="text-[10px] text-muted-foreground font-medium">Grand Total</div>
                      <div className="text-base font-black text-primary">
                        ${Number(sale.grand_total).toFixed(2)}
                      </div>
                    </div>

                    <div className="text-right space-y-0.5 text-[10px]">
                      <div className="text-muted-foreground font-semibold">
                        Tax: ${Number(sale.tax_amount || 0).toFixed(2)}
                      </div>
                      {Number(sale.discount_amount) > 0 && (
                        <div className="text-rose-500 font-extrabold">
                          Disc: -${Number(sale.discount_amount).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {sale.items?.length ?? 1} Item(s)
                    </span>

                    <button
                      onClick={() => {
                        sound.playClick()
                        setSelectedSaleId(sale.id)
                      }}
                      className="btn-secondary py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5 font-bold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                    >
                      <Eye size={14} /> View Invoice
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

      {/* Details Side-Drawer */}
      <AnimatePresence>
        {selectedSaleId && (
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
              ) : saleDetail && (
                <>
                  {/* Modern Header Banner */}
                  <div className="p-5 border-b border-border bg-gradient-to-r from-primary/10 via-accent/30 to-background flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-3 rounded-2xl bg-primary/20 text-primary shrink-0 border border-primary/30 shadow-xs">
                        <Receipt size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-mono font-black text-sm text-foreground truncate">
                            #{saleDetail.invoice_number}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getStatusBadge(saleDetail.status)}`}>
                            {saleDetail.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {saleDetail.date ? new Date(saleDetail.date).toLocaleString() : new Date(saleDetail.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          sound.playClick()
                          setSelectedSaleId(null)
                        }}
                        className="p-2 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        title="Close Drawer"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Drawer Scrollable Body */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Customer & Cashier Cards */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-muted/20 border border-border/70 p-3 rounded-2xl space-y-1">
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                          <User size={12} className="text-primary" /> Customer
                        </div>
                        <div className="font-extrabold text-foreground truncate">
                          {saleDetail.customer?.name ?? 'Walk-in Customer'}
                        </div>
                        {saleDetail.customer?.phone && (
                          <div className="text-[10px] font-mono text-muted-foreground">
                            {saleDetail.customer.phone}
                          </div>
                        )}
                      </div>

                      <div className="bg-muted/20 border border-border/70 p-3 rounded-2xl space-y-1">
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck size={12} className="text-indigo-500" /> Cashier
                        </div>
                        <div className="font-extrabold text-foreground truncate">
                          {saleDetail.cashier?.name ?? 'Admin Cashier'}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          Terminal #01
                        </div>
                      </div>
                    </div>

                    {/* Line Items List */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <ShoppingBag size={14} className="text-primary" /> Items Purchased
                        </h4>
                        <span className="text-[11px] font-mono text-muted-foreground font-bold">
                          {(saleDetail.items ?? []).length} Lines
                        </span>
                      </div>

                      <div className="space-y-2">
                        {(saleDetail.items ?? []).map((item) => (
                          <div
                            key={item.id}
                            className="bg-card border border-border/70 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs hover:border-primary/40 transition-all shadow-2xs"
                          >
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="font-extrabold text-foreground truncate">
                                {item.product_name || item.product?.name}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                                {item.sku && (
                                  <span className="bg-muted px-1.5 py-0.5 rounded font-bold">
                                    SKU: {item.sku}
                                  </span>
                                )}
                                <span>${Number(item.unit_price).toFixed(2)} × {item.quantity}</span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="font-black text-primary text-xs">
                                ${Number(item.total).toFixed(2)}
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
                        Payment & Tax Breakdown
                      </div>

                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal Amount:</span>
                        <span className="font-mono font-bold text-foreground">${Number(saleDetail.subtotal).toFixed(2)}</span>
                      </div>

                      {Number(saleDetail.discount_amount) > 0 && (
                        <div className="flex justify-between text-rose-500 font-bold">
                          <span>Total Discount:</span>
                          <span className="font-mono">-${Number(saleDetail.discount_amount).toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-muted-foreground">
                        <span>VAT Tax (10%):</span>
                        <span className="font-mono font-bold text-foreground">${Number(saleDetail.tax_amount).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-baseline font-black text-lg border-t border-dashed border-border pt-2 text-foreground">
                        <span>Grand Total:</span>
                        <span className="text-primary font-mono">${Number(saleDetail.grand_total).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between border-t border-border/60 pt-2 text-muted-foreground">
                        <span>Paid Amount ({saleDetail.currency_code || 'USD'}):</span>
                        <span className="font-mono font-bold text-foreground">${Number(saleDetail.paid_amount).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-semibold">Change Due:</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                          ${Number(saleDetail.change_amount).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Notes */}
                    {saleDetail.notes && (
                      <div className="bg-muted/30 p-3 rounded-2xl border border-border/70 flex gap-2 text-xs text-muted-foreground">
                        <Clipboard size={16} className="mt-0.5 text-primary shrink-0" />
                        <div>
                          <div className="font-bold text-xs text-foreground mb-0.5">Order Notes</div>
                          <div>{saleDetail.notes}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Drawer Footer Actions */}
                  <div className="p-4 border-t border-border bg-card space-y-2">
                    {saleDetail.status === 'completed' ? (
                      <button
                        onClick={() => {
                          sound.playWarning()
                          if (!window.confirm('Process a full refund for this sale?')) return
                          refundMutation.mutate(saleDetail.id)
                        }}
                        disabled={refundMutation.isPending}
                        className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold
                                   flex items-center justify-center gap-2 disabled:opacity-60 transition-all shadow-xs cursor-pointer"
                      >
                        {refundMutation.isPending
                          ? <Loader2 size={15} className="animate-spin" />
                          : <CornerUpLeft size={16} />
                        }
                        {refundMutation.isPending ? 'Processing Refund...' : 'Process Refund / Return Order'}
                      </button>
                    ) : (
                      <div className="p-3 bg-muted/40 rounded-xl text-center text-xs text-muted-foreground italic font-semibold">
                        This order has been {saleDetail.status}. No further actions can be taken.
                      </div>
                    )}
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

export default SalesPage
