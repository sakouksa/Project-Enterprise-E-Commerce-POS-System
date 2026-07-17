import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, RefreshCw, X, Zap, Loader2 } from 'lucide-react'
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

interface FlashSale {
  id: number
  name: string
  starts_at: string
  ends_at: string
  is_active: boolean
  products_count?: number
}

const FlashSalesPage: React.FC = () => {
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
  } = useServerPagination({ storageKey: 'flashsales' })
    const [modalOpen, setModalOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<FlashSale | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<FlashSale | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [isActive, setIsActive] = useState(true)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['flash-sales', page, debouncedSearch, perPage],
    queryFn: () => api.get('/flash-sales', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const createMutation = useMutation({
    mutationFn: (newSale: any) => api.post('/flash-sales', newSale),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['flash-sales'] })
      toast.success(t('toast.created', { item: t('nav.flashSales') }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/flash-sales/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['flash-sales'] })
      toast.success(t('toast.updated', { item: t('nav.flashSales') }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/flash-sales/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['flash-sales'] })
      toast.success(t('toast.deleted', { item: t('nav.flashSales') }))
      setDeleteTarget(null)
      adjustAfterDelete(sales.length)
    },
    onError: () => {
      toast.error(t('toast.error'))
      setDeleteTarget(null)
    },
  })

  const sales: FlashSale[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setEditingSale(null)
    setName('')
    setStartsAt('')
    setEndsAt('')
    setIsActive(true)
    setModalOpen(true)
  }

  const openEditModal = (sale: FlashSale) => {
    setEditingSale(sale)
    setName(sale.name)
    setStartsAt(sale.starts_at ? sale.starts_at.replace(' ', 'T').slice(0, 16) : '')
    setEndsAt(sale.ends_at ? sale.ends_at.replace(' ', 'T').slice(0, 16) : '')
    setIsActive(sale.is_active)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingSale(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !startsAt || !endsAt) return

    const payload = {
      name,
      starts_at: startsAt,
      ends_at: endsAt,
      is_active: isActive,
    }

    if (editingSale) {
      updateMutation.mutate({ id: editingSale.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.flashSales')}</h1>
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
            onClick={() => qc.invalidateQueries({ queryKey: ['flash-sales'] })}
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
                <th className="text-left">Campaign Name</th>
                <th className="text-left">Starts At</th>
                <th className="text-left">Ends At</th>
                <th className="text-left">Products count</th>
                <th className="text-left">{t('common.status')}</th>
                <th className="text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton h-4 w-28 rounded" /></td>
                    <td><div className="skeleton h-4 w-24 rounded" /></td>
                    <td><div className="skeleton h-4 w-24 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="font-medium text-foreground flex items-center gap-1.5">
                      <Zap size={14} className="text-amber-500 fill-amber-500 animate-pulse" />
                      {sale.name}
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {new Date(sale.starts_at).toLocaleString()}
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {new Date(sale.ends_at).toLocaleString()}
                    </td>
                    <td>{sale.products_count ?? 0}</td>
                    <td>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sale.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {sale.is_active ? t('common.active') : t('common.inactive')}
                      </span>
                    </td>
                    <td className="text-right flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(sale)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(sale)} className="p-1 hover:bg-red-50 rounded text-muted-foreground hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && sales.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Zap size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">{t('common.noData')}</p>
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
                  {editingSale ? 'Edit Flash Sale' : 'Add Flash Sale'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Campaign Name</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="e.g. 11.11 Megasale"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Starts At</label>
                  <input
                    type="datetime-local"
                    value={startsAt}
                    onChange={e => setStartsAt(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Ends At</label>
                  <input
                    type="datetime-local"
                    value={endsAt}
                    onChange={e => setEndsAt(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-foreground">{t('common.active')}</label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted">
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 flex items-center gap-2"
                  >
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
                    {t('common.save')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!deleteTarget}
        title={t('confirm.deleteTitle', { item: 'Flash Sale' })}
        message={t('confirm.deleteMessage', { item: 'Flash Sale', name: deleteTarget?.name })}
        confirmText={t('confirm.confirmDelete')}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default FlashSalesPage
