import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Eye, RefreshCw, X, Receipt,
  CornerUpLeft, Loader2, Calendar, User, ShoppingBag, Info, Clipboard
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
  customer?:      { name: string }
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
        per_page:  15,
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
      qc.invalidateQueries({ queryKey: ['sales'] })
      toast.success('Refund processed successfully.')
      setSelectedSaleId(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to process refund.')
    },
  })

  const sales: Sale[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const resetFilters = () => {
    setSearch('')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  const STATUS_BADGE: Record<string, string> = {
    pending:   'badge-warning',
    completed: 'badge-success',
    cancelled: 'badge-danger',
    refunded:  'badge-muted',
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'POS System' }, { label: 'Sales Registry' }]} />

      <PageHeader
        title="Sales Registry"
        subtitle="Review physical terminal sales, customer receipts, and refunds"
      />

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams)
            params.set('tab', 'all')
            setSearchParams(params)
            setPage(1)
          }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
            tab === 'all'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Sales Orders
        </button>
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams)
            params.set('tab', 'returns')
            setSearchParams(params)
            setPage(1)
          }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
            tab === 'returns'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Sale Returns
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by invoice number..."
              className="form-input pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-muted-foreground flex-shrink-0" />
            <input
              type="date"
              value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setPage(1) }}
              className="form-input w-40"
              title="From date"
            />
            <span className="text-muted-foreground text-sm">–</span>
            <input
              type="date"
              value={dateTo}
              onChange={e => { setDateTo(e.target.value); setPage(1) }}
              className="form-input w-40"
              title="To date"
            />
          </div>
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['sales'] })}
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
                <th className="text-left">Invoice #</th>
                <th className="text-left">Customer</th>
                <th className="text-left">Cashier</th>
                <th className="text-left">Date</th>
                <th className="text-left">Grand Total</th>
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
                      <td><div className="skeleton h-4 w-20 rounded" /></td>
                      <td><div className="skeleton h-4 w-16 rounded" /></td>
                      <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                    </tr>
                  ))
                : sales.map((sale) => (
                    <tr key={sale.id} className="group hover:bg-muted/25 transition-colors">
                      <td className="font-semibold text-primary text-sm font-mono">
                        #{sale.invoice_number}
                      </td>
                      <td className="text-sm text-foreground">
                        {sale.customer?.name ?? 'Walk-in Customer'}
                      </td>
                      <td className="text-sm text-muted-foreground">
                        {sale.cashier?.name ?? '—'}
                      </td>
                      <td className="text-muted-foreground text-sm font-mono text-xs">
                        {sale.date ? new Date(sale.date).toLocaleString() : new Date(sale.created_at).toLocaleDateString()}
                      </td>
                      <td className="font-semibold text-sm">
                        Rp {Number(sale.grand_total).toLocaleString('id-ID')}
                      </td>
                      <td>
                        <span className={STATUS_BADGE[sale.status] ?? 'badge-muted'}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setSelectedSaleId(sale.id)}
                          className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground
                                     transition-colors flex items-center gap-1 text-xs font-medium ml-auto"
                        >
                          <Eye size={14} />
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))
              }
              {!isLoading && sales.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Receipt size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No sales recorded</p>
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
        {selectedSaleId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card w-full max-w-md border-l border-border h-full flex flex-col shadow-2xl"
            >
              {detailLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : saleDetail && (
                <>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground font-mono">
                        Invoice #{saleDetail.invoice_number}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {saleDetail.date ? new Date(saleDetail.date).toLocaleString() : new Date(saleDetail.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button onClick={() => setSelectedSaleId(null)} className="text-muted-foreground hover:text-foreground">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Summary */}
                    <div className="bg-muted/40 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Customer:</span>
                        <span className="font-medium text-foreground">{saleDetail.customer?.name ?? 'Walk-in Customer'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1"><User size={12} /> Cashier:</span>
                        <span className="font-medium text-foreground">{saleDetail.cashier?.name ?? '—'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`capitalize font-semibold ${
                          saleDetail.status === 'completed' ? 'text-green-500' : 'text-amber-500'
                        }`}>{saleDetail.status}</span>
                      </div>
                    </div>

                    {/* Items Purchased */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                        <ShoppingBag size={12} /> Items Purchased
                      </h4>
                      <div className="bg-muted/20 rounded-xl border border-border overflow-hidden divide-y divide-border">
                        {(saleDetail.items ?? []).map((item) => (
                          <div key={item.id} className="p-3 text-sm space-y-1">
                            <div className="flex justify-between font-medium text-foreground">
                              <span>{item.product_name}</span>
                              <span>Rp {(Number(item.total)).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{item.quantity} x Rp {Number(item.unit_price).toLocaleString('id-ID')}</span>
                              {Number(item.discount_amount) > 0 && (
                                <span className="text-red-500">Disc: -Rp {Number(item.discount_amount).toLocaleString('id-ID')}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>Rp {Number(saleDetail.subtotal).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-red-500">
                        <span>Discount:</span>
                        <span>-Rp {Number(saleDetail.discount_amount).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax amount:</span>
                        <span>Rp {Number(saleDetail.tax_amount).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base border-t border-border pt-2 text-foreground">
                        <span>Grand Total:</span>
                        <span>Rp {Number(saleDetail.grand_total).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2">
                        <span className="text-muted-foreground">Paid Amount:</span>
                        <span>Rp {Number(saleDetail.paid_amount).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Change Due:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          Rp {Number(saleDetail.change_amount).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Notes */}
                    {saleDetail.notes && (
                      <div className="bg-muted/20 p-3 rounded-xl border border-border flex gap-2 text-sm text-muted-foreground">
                        <Clipboard size={16} className="mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-xs text-foreground mb-0.5">Notes</div>
                          <div>{saleDetail.notes}</div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="bg-muted/40 p-4 rounded-xl space-y-3">
                      <h4 className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Info size={12} /> Transaction Actions
                      </h4>
                      {saleDetail.status === 'completed' ? (
                        <button
                          onClick={() => {
                            if (!window.confirm('Process a full refund for this sale?')) return
                            refundMutation.mutate(saleDetail.id)
                          }}
                          disabled={refundMutation.isPending}
                          className="w-full py-2 bg-red-600 text-white rounded-lg text-xs font-semibold
                                     hover:bg-red-500 flex items-center justify-center gap-1.5 disabled:opacity-60 transition-colors shadow-sm"
                        >
                          {refundMutation.isPending
                            ? <Loader2 size={12} className="animate-spin" />
                            : <CornerUpLeft size={14} />
                          }
                          {refundMutation.isPending ? 'Processing Refund...' : 'Process Refund / Return'}
                        </button>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          This transaction has been refunded or cancelled.
                        </p>
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

export default SalesPage
