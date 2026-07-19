import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Eye, RefreshCw, X, ArrowLeftRight, Loader2,
  CheckCircle, Trash2, Printer, Calendar, Tag, Info, Trash,
  ChevronUp, ChevronDown
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useTranslation } from 'react-i18next'

interface PurchaseReturnItem {
  id: number
  purchase_return_id: number
  purchase_item_id: number
  product_id: number
  product_variant_id?: number
  quantity: number
  unit_cost: number
  total: number
  notes?: string
  variant?: { name: string }
  product_name?: string | null
  sku?: string | null
}

interface PurchaseReturn {
  id: number
  reference_number: string
  purchase_id: number
  supplier?: { name: string; email?: string; phone?: string; address?: string }
  user?: { name: string }
  date: string
  total_amount: number
  reason?: string
  status: string
  created_at: string
  items: PurchaseReturnItem[]
  purchase?: { reference_number: string }
}

const STATUS_BADGE: Record<string, string> = {
  draft:     'px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  approved:  'px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

const PurchaseReturnsPage: React.FC = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const qc = useQueryClient()
  
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedReturn, setSelectedReturn] = useState<PurchaseReturn | null>(null)
  const [approveTarget, setApproveTarget] = useState<PurchaseReturn | null>(null)
  const [cancelTarget, setCancelTarget] = useState<PurchaseReturn | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PurchaseReturn | null>(null)

  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
  }

  const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    reset
  } = useServerPagination({ storageKey: 'purchasereturns' })

  // Form states
  const [purchaseId, setPurchaseId] = useState('')
  const [reason, setReason] = useState('')
  const [returnItems, setReturnItems] = useState<any[]>([])
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState('draft')

  // Fetch list of purchases to create a return from (only received/partial ones)
  const { data: purchasesData } = useQuery({
    queryKey: ['purchases-list-for-returns'],
    queryFn: () => api.get('/purchases', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  // Fetch details of selected purchase order to populate items
  const { data: purchaseDetail, isFetching: loadingPurchaseDetails } = useQuery({
    queryKey: ['purchase-detail-for-return', purchaseId],
    queryFn: () => purchaseId ? api.get(`/purchases/${purchaseId}`).then(r => r.data.data) : null,
    enabled: !!purchaseId,
  })

  useEffect(() => {
    if (purchaseDetail) {
      // Map purchase items into return form items
      const items = purchaseDetail.items.map((item: any) => {
        const alreadyReturned = parseFloat(item.already_returned) || 0
        const qtyReceived = parseFloat(item.quantity_received) || 0
        const available = Math.max(0, qtyReceived - alreadyReturned)

        return {
          purchase_item_id: item.id,
          product_id: item.product_id,
          product_variant_id: item.product_variant_id || null,
          product_name: item.product_name || item.product?.name || `Product #${item.product_id}`,
          variant_name: item.variant?.name || '',
          sku: item.sku || item.product?.sku || '',
          quantity_ordered: parseFloat(item.quantity) || 0,
          quantity_received: qtyReceived,
          already_returned: alreadyReturned,
          available_to_return: available,
          quantity: '0', // user input
          unit_cost: parseFloat(item.unit_cost) || 0,
          discount_percent: parseFloat(item.discount_percent) || 0,
          tax_percent: parseFloat(item.tax_percent) || 0,
          notes: ''
        }
      })
      setReturnItems(items)
    } else {
      setReturnItems([])
    }
  }, [purchaseDetail])

  // Fetch returns list
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['purchase-returns', page, debouncedSearch, perPage, sortBy, sortOrder],
    queryFn: () => api.get('/purchase-returns', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const returns: PurchaseReturn[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newReturn: any) => api.post('/purchase-returns', newReturn),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-returns'] })
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-for-po-select'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['low-stock'] })
      toast.success(t('purchases.toast.returnCreatedSuccess', { defaultValue: 'Purchase return created successfully.' }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const approveMutation = useMutation({
    mutationFn: (id: number) => api.post(`/purchase-returns/${id}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-returns'] })
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-for-po-select'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['low-stock'] })
      toast.success(t('purchases.toast.returnApprovedSuccess', { defaultValue: 'Purchase return approved. Inventory updated.' }))
      setApproveTarget(null)
      setSelectedReturn(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (id: number) => api.post(`/purchase-returns/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-returns'] })
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-for-po-select'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['low-stock'] })
      toast.success(t('purchases.toast.returnCancelledSuccess', { defaultValue: 'Purchase return cancelled.' }))
      setCancelTarget(null)
      setSelectedReturn(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/purchase-returns/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-returns'] })
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-for-po-select'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['low-stock'] })
      toast.success(t('purchases.toast.returnDeletedSuccess', { defaultValue: 'Purchase return deleted successfully.' }))
      setDeleteTarget(null)
      setSelectedReturn(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const openCreateModal = () => {
    setPurchaseId('')
    setReason('')
    setReturnItems([])
    setReturnDate(new Date().toISOString().split('T')[0])
    setStatus('draft')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleItemQtyChange = (idx: number, val: string) => {
    const updated = [...returnItems]
    updated[idx].quantity = val
    setReturnItems(updated)
  }

  const handleItemNotesChange = (idx: number, val: string) => {
    const updated = [...returnItems]
    updated[idx].notes = val
    setReturnItems(updated)
  }

  const getReturnTotal = () => {
    return returnItems.reduce((acc, item) => {
      const qty = parseFloat(item.quantity) || 0
      const cost = parseFloat(item.unit_cost) || 0
      return acc + (qty * cost)
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!purchaseId) return

    // Validate all items
    for (const item of returnItems) {
      const qty = parseFloat(item.quantity) || 0
      if (qty < 0) {
        toast.error('Return quantity cannot be negative.')
        return
      }
      if (qty > item.available_to_return) {
        toast.error(`Return quantity for "${item.product_name}" cannot exceed available quantity (${item.available_to_return}).`)
        return
      }
    }

    const itemsPayload = returnItems
      .map(item => ({
        purchase_item_id: item.purchase_item_id,
        product_id: item.product_id,
        product_variant_id: item.product_variant_id || null,
        quantity: parseFloat(item.quantity) || 0,
        unit_cost: parseFloat(item.unit_cost) || 0,
        notes: item.notes || null
      }))
      .filter(i => i.quantity > 0)

    if (itemsPayload.length === 0) {
      toast.error('Please input return quantity for at least one item.')
      return
    }

    const selectedPO = (purchasesData ?? []).find((p: any) => p.id === Number(purchaseId))

    createMutation.mutate({
      company_id: 1,
      purchase_id: Number(purchaseId),
      supplier_id: selectedPO?.supplier_id || 0,
      date: returnDate,
      reason: reason || 'Goods Return',
      status: status,
      items: itemsPayload,
    })
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Purchase Returns</h1>
          <p className="text-muted-foreground text-sm">
            {t('common.showing', { from: pagination.from || 0, to: pagination.to || 0, total: pagination.total })}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-semibold shadow transition-all"
        >
          <Plus size={16} />
          {t('purchases.createReturn')}
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-56">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by Return Number or Reason..."
              className="form-input pl-9"
            />
          </div>
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['purchase-returns'] })}
            className="p-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <TableWrapper isFetching={isFetching}>
          <table className="w-full data-table">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th onClick={() => handleSort('reference_number')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                  Reference {renderSortIcon('reference_number')}
                </th>
                <th onClick={() => handleSort('purchase_id')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                  Purchase {renderSortIcon('purchase_id')}
                </th>
                <th className="text-left py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                  Supplier
                </th>
                <th onClick={() => handleSort('date')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                  Date {renderSortIcon('date')}
                </th>
                <th onClick={() => handleSort('total_amount')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                  Total {renderSortIcon('total_amount')}
                </th>
                <th onClick={() => handleSort('status')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                  Status {renderSortIcon('status')}
                </th>
                <th className="text-left py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                  Created By
                </th>
                <th className="text-right py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>
                    <td className="p-4"><div className="skeleton h-4 w-24 rounded" /></td>
                    <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>
                    <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>
                    <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>
                    <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>
                    <td className="p-4"><div className="skeleton h-4 w-24 rounded" /></td>
                    <td className="p-4"><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : returns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <ArrowLeftRight size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No purchase returns found</p>
                  </td>
                </tr>
              ) : (
                returns.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                    <td className="py-4 px-4 font-semibold text-primary font-mono text-sm">
                      {item.reference_number}
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground">
                      {item.purchase?.reference_number ?? '—'}
                    </td>
                    <td className="py-4 px-4 text-sm text-foreground">
                      {item.supplier?.name ?? '—'}
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground font-mono">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-foreground">
                      Rp {item.total_amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={STATUS_BADGE[item.status]}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {item.user?.name ?? '—'}
                    </td>
                    <td className="py-4 px-4 text-right flex items-center justify-end gap-1.5 pt-3">
                      <button
                        onClick={() => setSelectedReturn(item)}
                        className="p-1 px-2.5 hover:bg-muted border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-xs font-semibold bg-card"
                      >
                        <Eye size={13} />
                        {t('common.view')}
                      </button>
                      {item.status === 'draft' && (
                        <>
                          <button
                            onClick={() => setApproveTarget(item)}
                            className="p-1 px-2.5 hover:bg-green-500/10 hover:text-green-600 border border-transparent rounded-lg text-green-500 transition-colors flex items-center gap-1 text-xs font-bold bg-green-500/5"
                          >
                            <CheckCircle size={13} />
                            Approve
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-1 px-2 hover:bg-red-500/10 hover:text-red-600 border border-transparent rounded-lg text-red-500 transition-colors flex items-center gap-1 text-xs font-semibold bg-red-500/5"
                          >
                            <Trash size={13} />
                          </button>
                        </>
                      )}
                      {item.status === 'approved' && (
                        <button
                          onClick={() => setCancelTarget(item)}
                          className="p-1 px-2.5 hover:bg-red-500/10 hover:text-red-600 border border-transparent rounded-lg text-red-500 transition-colors flex items-center gap-1 text-xs font-bold bg-red-500/5"
                        >
                          <X size={13} />
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableWrapper>
        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          total={pagination.total}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
        />
      </div>

      {/* ─── CREATE RETURN MODAL ─── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-bold text-lg text-foreground">
                  {t('purchases.createReturn')}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Select Purchase Order (PO) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={purchaseId}
                    onChange={(e) => setPurchaseId(e.target.value)}
                    required
                    className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
                  >
                    <option value="">Select PO</option>
                    {(purchasesData ?? [])
                      .filter((p: any) => p.status === 'received' || p.status === 'partial')
                      .map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.reference_number} — {p.supplier?.name} (Total: Rp {p.grand_total.toLocaleString('id-ID')})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-1.5">Company</label>
                    <input
                      type="text"
                      value="Enterprise Headquarters"
                      disabled
                      className="form-input w-full border border-border rounded-lg p-2.5 bg-muted/30 text-sm font-medium cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-1.5">Supplier</label>
                    <input
                      type="text"
                      value={
                        (purchasesData ?? []).find((p: any) => p.id === Number(purchaseId))?.supplier?.name ?? '—'
                      }
                      disabled
                      className="form-input w-full border border-border rounded-lg p-2.5 bg-muted/30 text-sm font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Return Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      required
                      className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Status <span className="text-red-500">*</span></label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                      className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>
                </div>

                {loadingPurchaseDetails && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-blue-500 mr-2" />
                    <span className="text-sm text-muted-foreground">Loading items from Purchase Order...</span>
                  </div>
                )}

                {returnItems.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h4 className="text-sm font-bold text-foreground">Return Items Quantities</h4>
                    <div className="border border-border rounded-lg overflow-hidden overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                        <thead>
                          <tr className="bg-muted/40 border-b border-border">
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground">Product & SKU</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center">Ordered</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center">Delivered</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center">Returned</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center bg-blue-500/5 text-blue-600 dark:text-blue-400">Available</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center w-24">Return Qty</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-right">Cost Price</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {returnItems.map((item, idx) => {
                            const returnQty = parseFloat(item.quantity) || 0
                            const lineTotal = returnQty * item.unit_cost

                            return (
                              <tr key={idx} className="hover:bg-muted/5">
                                <td className="py-2.5 px-3">
                                  <span className="font-semibold text-foreground block">{item.product_name}</span>
                                  {item.variant_name && (
                                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-medium mt-0.5 inline-block mr-1">
                                      {item.variant_name}
                                    </span>
                                  )}
                                  {item.sku && (
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                      SKU: {item.sku}
                                    </span>
                                  )}
                                  <input
                                    placeholder="Add notes for return item..."
                                    value={item.notes}
                                    onChange={(e) => handleItemNotesChange(idx, e.target.value)}
                                    className="block mt-1 w-full text-[10px] bg-transparent border-0 border-b border-transparent focus:border-border p-0 text-muted-foreground"
                                  />
                                </td>
                                <td className="py-2.5 px-3 text-center text-muted-foreground">{item.quantity_ordered}</td>
                                <td className="py-2.5 px-3 text-center text-muted-foreground">{item.quantity_received}</td>
                                <td className="py-2.5 px-3 text-center text-red-500 font-medium">{item.already_returned}</td>
                                <td className="py-2.5 px-3 text-center bg-blue-500/5 font-bold text-blue-600 dark:text-blue-400">{item.available_to_return}</td>
                                <td className="py-2.5 px-3 text-center">
                                  <input
                                    type="number"
                                    min="0"
                                    max={item.available_to_return}
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const inputVal = parseFloat(e.target.value) || 0
                                      if (inputVal > item.available_to_return) {
                                        handleItemQtyChange(idx, String(item.available_to_return))
                                      } else {
                                        handleItemQtyChange(idx, e.target.value)
                                      }
                                    }}
                                    className="form-input w-full p-1 text-center text-xs border border-border rounded font-bold"
                                  />
                                </td>
                                <td className="py-2.5 px-3 text-right text-muted-foreground">
                                  Rp {item.unit_cost.toLocaleString('id-ID')}
                                </td>
                                <td className="py-2.5 px-3 text-right font-bold text-foreground">
                                  Rp {lineTotal.toLocaleString('id-ID')}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border">
                      <span className="text-sm font-semibold text-foreground">Estimated Return Value:</span>
                      <span className="text-base font-bold text-red-600">Rp {getReturnTotal().toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Reason for Return</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter return reason (e.g., damaged goods, incorrect shipment)..."
                    rows={3}
                    className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-border hover:bg-muted text-foreground rounded-lg transition-colors text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={() => setStatus('draft')}
                    disabled={createMutation.isPending || (!!purchaseId && returnItems.length === 0)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-foreground rounded-lg transition-colors text-sm font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    {createMutation.isPending && status === 'draft' && <Loader2 size={14} className="animate-spin" />}
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    onClick={() => setStatus('approved')}
                    disabled={createMutation.isPending || (!!purchaseId && returnItems.length === 0)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-bold flex items-center gap-1.5 shadow"
                  >
                    {createMutation.isPending && status === 'approved' && <Loader2 size={14} className="animate-spin" />}
                    Approve
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── RETURN DETAILS DRAWER ─── */}
      <AnimatePresence>
        {selectedReturn && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end print:bg-white print:backdrop-blur-none print:static print:w-full">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card w-full max-w-xl border-l border-border h-full flex flex-col shadow-2xl print:border-none print:shadow-none print:w-full print:h-auto print:static"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border print:hidden">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-foreground font-mono">
                    Return #{selectedReturn.reference_number}
                  </h3>
                  <span className={STATUS_BADGE[selectedReturn.status]}>
                    {selectedReturn.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 hover:bg-muted border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all"
                  >
                    <Printer size={15} />
                  </button>
                  <button onClick={() => setSelectedReturn(null)} className="text-muted-foreground hover:text-foreground">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 print:p-0 print:overflow-visible">
                {/* Print Title Header */}
                <div className="hidden print:block border-b border-border pb-6 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold font-mono">DEBIT NOTE / GOODS RETURN</h1>
                      <p className="text-sm font-semibold text-muted-foreground mt-1">Return Ref: #{selectedReturn.reference_number}</p>
                      <p className="text-xs text-muted-foreground">Original PO Ref: #{selectedReturn.purchase?.reference_number}</p>
                      <p className="text-xs text-muted-foreground">Date: {new Date(selectedReturn.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Operations */}
                {selectedReturn.status === 'draft' && (
                  <div className="bg-muted/40 p-4 rounded-xl space-y-3.5 border border-border print:hidden">
                    <h4 className="text-sm font-bold text-foreground">Return Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setApproveTarget(selectedReturn)}
                        className="px-3.5 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-500 flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <CheckCircle size={14} />
                        Approve & Ship Return
                      </button>
                      <button
                        onClick={() => setCancelTarget(selectedReturn)}
                        className="px-3.5 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-500 flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        Cancel Return
                      </button>
                    </div>
                  </div>
                )}

                {/* Summary Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-1">
                    <span className="text-xs text-muted-foreground font-bold uppercase">Supplier Details</span>
                    <h4 className="text-sm font-bold text-foreground">{selectedReturn.supplier?.name}</h4>
                    <p className="text-xs text-muted-foreground font-mono">{selectedReturn.supplier?.phone}</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-1">
                    <span className="text-xs text-muted-foreground font-bold uppercase">Return Details</span>
                    <p className="text-xs text-muted-foreground">Original PO: #{selectedReturn.purchase?.reference_number}</p>
                    <p className="text-xs text-muted-foreground">Created By: {selectedReturn.user?.name}</p>
                    <p className="text-xs text-muted-foreground">Date: {new Date(selectedReturn.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Return Items */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider text-xs">Returned Items</h4>
                  <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border">
                          <th className="py-3 px-3 font-semibold text-muted-foreground">Product</th>
                          <th className="py-3 px-3 font-semibold text-muted-foreground text-center">Returned Qty</th>
                          <th className="py-3 px-3 font-semibold text-muted-foreground text-right">Unit Cost</th>
                          <th className="py-3 px-3 font-semibold text-muted-foreground text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedReturn.items?.map((item) => (
                          <tr key={item.id} className="hover:bg-muted/5">
                            <td className="py-3.5 px-3">
                              <span className="font-semibold text-foreground text-sm">{item.product_name || item.variant?.name || 'Returned Product'}</span>
                              {item.sku && <p className="text-[10px] text-muted-foreground font-mono">SKU: {item.sku}</p>}
                              {item.notes && <p className="text-xs text-muted-foreground mt-0.5 font-mono">{item.notes}</p>}
                            </td>
                            <td className="py-3.5 px-3 text-center font-bold text-red-500">{item.quantity}</td>
                            <td className="py-3.5 px-3 text-right text-muted-foreground">Rp {item.unit_cost.toLocaleString('id-ID')}</td>
                            <td className="py-3.5 px-3 text-right font-bold text-foreground">Rp {item.total.toLocaleString('id-ID')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Return Totals */}
                <div className="flex justify-end">
                  <div className="w-full md:w-72 bg-muted/20 p-4 rounded-xl border border-border space-y-2 text-sm">
                    <div className="flex justify-between font-bold text-base text-foreground">
                      <span>Total Returned Value</span>
                      <span className="text-red-600 dark:text-red-400">Rp {selectedReturn.total_amount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                {selectedReturn.reason && (
                  <div className="p-4 bg-muted/25 rounded-xl border border-border">
                    <h5 className="font-bold text-foreground text-xs uppercase mb-1">Reason for Return</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedReturn.reason}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── APPROVE CONFIRMATION ─── */}
      <ConfirmDialog
        open={!!approveTarget}
        title="Approve & Ship Return"
        message={`Are you sure you want to approve Return #${approveTarget?.reference_number}? This will subtract return quantities from warehouse inventory stocks.`}
        confirmText="Approve Return"
        loading={approveMutation.isPending}
        onConfirm={() => approveTarget && approveMutation.mutate(approveTarget.id)}
        onCancel={() => setApproveTarget(null)}
        variant="warning"
      />

      {/* ─── CANCEL CONFIRMATION ─── */}
      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel Return"
        message={`Are you sure you want to cancel Return #${cancelTarget?.reference_number}?`}
        confirmText="Cancel Return"
        loading={cancelMutation.isPending}
        onConfirm={() => cancelTarget && cancelMutation.mutate(cancelTarget.id)}
        onCancel={() => setCancelTarget(null)}
        variant="danger"
      />

      {/* ─── DELETE CONFIRMATION ─── */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Purchase Return"
        message={`Are you sure you want to delete Return #${deleteTarget?.reference_number}? This action cannot be undone.`}
        confirmText="Delete Return"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />
    </div>
  )
}

export default PurchaseReturnsPage
