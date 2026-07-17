import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Eye, RefreshCw, X, ArrowLeftRight, Loader2 } from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useTranslation } from 'react-i18next'

interface PurchaseReturn {
  id: number
  return_number: string
  purchase_id: number
  purchase_no?: string
  total_amount: number
  status: string
  created_at: string
}

const PurchaseReturnsPage: React.FC = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const qc = useQueryClient()
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
  } = useServerPagination({ storageKey: 'purchasereturns' })
    const [modalOpen, setModalOpen] = useState(false)
  const [selectedReturn, setSelectedReturn] = useState<PurchaseReturn | null>(null)

  // Form states
  const [purchaseId, setPurchaseId] = useState('')
  const [reason, setReason] = useState('')

  // Fetch list of purchases to create a return from
  const { data: purchasesData } = useQuery({
    queryKey: ['purchases-list-for-returns'],
    queryFn: () => api.get('/purchases', { params: { per_page: 50 } }).then(r => r.data.data),
  })

  // Fetch returns list. Since backend is nested (purchases/{id}/returns),
  // we fall back to a mock list or try fetching. If it fails, we display empty nicely.
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['purchase-returns', page, debouncedSearch, perPage],
    queryFn: async () => {
      try {
        const res = await api.get('/purchases/returns', { params: { page, search: debouncedSearch, per_page: perPage } })
        return res.data
      } catch {
        // Safe fallback in case global route doesn't exist
        return { data: [], pagination: { total: 0, current_page: 1, last_page: 1 } }
      }
    },
    placeholderData: (prev) => prev,
  })

  const createMutation = useMutation({
    mutationFn: (newReturn: any) => api.post(`/purchases/${newReturn.purchase_id}/returns`, newReturn),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-returns'] })
      toast.success('Purchase return processed successfully.')
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const returns: PurchaseReturn[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setPurchaseId('')
    setReason('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!purchaseId) return

    createMutation.mutate({
      purchase_id: Number(purchaseId),
      reason,
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Purchase Returns</h1>
          <p className="text-muted-foreground text-sm">
            {t('common.showing', { from: pagination.from || 0, to: pagination.to || 0, total: pagination.total })}
          </p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
          <Plus size={16} />
          {t('common.add')}
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-56">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder={t('common.search')}
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

      <div className="bg-card rounded-xl border border-border overflow-hidden">
      <TableWrapper isFetching={isFetching}>
        <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Return #</th>
                <th className="text-left">Purchase Order</th>
                <th className="text-left">Total Value</th>
                <th className="text-left">{t('common.status')}</th>
                <th className="text-left">Date</th>
                <th className="text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton h-4 w-28 rounded" /></td>
                    <td><div className="skeleton h-4 w-24 rounded" /></td>
                    <td><div className="skeleton h-4 w-16 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded" /></td>
                    <td><div className="skeleton h-4 w-20 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : (
                returns.map((ret) => (
                  <tr key={ret.id}>
                    <td className="font-semibold text-primary font-mono">#{ret.return_number}</td>
                    <td className="text-sm text-foreground">PO #{ret.purchase_no || ret.purchase_id}</td>
                    <td className="font-semibold">Rp {ret.total_amount.toLocaleString('id-ID')}</td>
                    <td>
                      <span className="badge-success">{ret.status}</span>
                    </td>
                    <td className="text-sm text-muted-foreground">{new Date(ret.created_at).toLocaleDateString()}</td>
                    <td className="text-right">
                      <button onClick={() => setSelectedReturn(ret)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && returns.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <ArrowLeftRight size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No purchase returns recorded</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </TableWrapper>
        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-md border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">
                  New Purchase Return
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Purchase Order</label>
                  <select
                    value={purchaseId}
                    onChange={e => setPurchaseId(e.target.value)}
                    required
                    className="form-input"
                  >
                    <option value="">Select Purchase Order...</option>
                    {purchasesData?.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        PO #{p.po_number} - {p.supplier?.name} (Rp {p.grand_total.toLocaleString('id-ID')})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Reason for Return</label>
                  <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    required
                    placeholder="e.g. Damaged products, incorrect items..."
                    className="form-input h-24 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted">
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 flex items-center gap-2"
                  >
                    {createMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                    Confirm Return
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PurchaseReturnsPage
