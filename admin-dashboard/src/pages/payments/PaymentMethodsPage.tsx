import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, RefreshCw, X, CreditCard, Loader2 } from 'lucide-react'
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

interface PaymentMethod {
  id: number
  name: string
  code: string
  is_active: boolean
  description?: string
}

const PaymentMethodsPage: React.FC<{ isTab?: boolean }> = ({ isTab }) => {
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
  } = useServerPagination({ storageKey: 'paymentmethods' })
    const [modalOpen, setModalOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [description, setDescription] = useState('')

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['payment-methods', page, debouncedSearch, perPage],
    queryFn: () => api.get('/payment-methods', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const createMutation = useMutation({
    mutationFn: (newMethod: any) => api.post('/payment-methods', newMethod),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payment-methods'] })
      toast.success(t('toast.created', { item: t('nav.paymentMethods') }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/payment-methods/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payment-methods'] })
      toast.success(t('toast.updated', { item: t('nav.paymentMethods') }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/payment-methods/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payment-methods'] })
      toast.success(t('toast.deleted', { item: t('nav.paymentMethods') }))
      setDeleteTarget(null)
      adjustAfterDelete(methods.length)
    },
    onError: () => {
      toast.error(t('toast.error'))
      setDeleteTarget(null)
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => api.put(`/payment-methods/${id}`, { is_active: active }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payment-methods'] })
      toast.success(t('toast.saved'))
    },
    onError: () => {
      toast.error(t('toast.error'))
    },
  })

  const methods: PaymentMethod[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setEditingMethod(null)
    setName('')
    setCode('')
    setIsActive(true)
    setDescription('')
    setModalOpen(true)
  }

  const openEditModal = (method: PaymentMethod) => {
    setEditingMethod(method)
    setName(method.name)
    setCode(method.code)
    setIsActive(method.is_active)
    setDescription(method.description ?? '')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingMethod(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !code.trim()) return

    const payload = {
      name,
      code,
      is_active: isActive,
      description,
    }

    if (editingMethod) {
      updateMutation.mutate({ id: editingMethod.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div className="space-y-5">
      {!isTab && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('nav.paymentMethods')}</h1>
            <p className="text-muted-foreground text-sm">
              {t('common.showing', { from: pagination.from || 0, to: pagination.to || 0, total: pagination.total })}
            </p>
          </div>
          <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
            <Plus size={16} />
            {t('common.add')}
          </button>
        </div>
      )}

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
            onClick={() => qc.invalidateQueries({ queryKey: ['payment-methods'] })}
            className="p-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          {isTab && (
            <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 ml-auto">
              <Plus size={16} />
              {t('common.add')}
            </button>
          )}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
      <TableWrapper isFetching={isFetching}>
        <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">{t('common.name')}</th>
                <th className="text-left">Code</th>
                <th className="text-left">{t('common.status')}</th>
                <th className="text-left">{t('common.description')}</th>
                <th className="text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton h-4 w-28 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded" /></td>
                    <td><div className="skeleton h-4 w-16 rounded" /></td>
                    <td><div className="skeleton h-4 w-40 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : (
                methods.map((method) => (
                  <tr key={method.id}>
                    <td className="font-medium text-foreground">{method.name}</td>
                    <td className="font-mono text-sm">{method.code}</td>
                    <td>
                      <button
                        onClick={() => toggleStatusMutation.mutate({ id: method.id, active: !method.is_active })}
                        className={`text-sm font-semibold rounded-full px-2.5 py-0.5 ${
                          method.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {method.is_active ? t('common.active') : t('common.inactive')}
                      </button>
                    </td>
                    <td className="text-muted-foreground text-sm">{method.description || '-'}</td>
                    <td className="text-right flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(method)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(method)} className="p-1 hover:bg-red-50 rounded text-muted-foreground hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && methods.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <CreditCard size={40} className="mx-auto mb-3 text-muted-foreground/30" />
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
                  {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('common.name')}</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="e.g. Bank Transfer"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Code</label>
                  <input
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    required
                    placeholder="e.g. bank_transfer"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('common.description')}</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide details..."
                    className="form-input h-20 resize-none"
                  />
                </div>
                <div className="flex items-center gap-2">
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
        title={t('confirm.deleteTitle', { item: 'Payment Method' })}
        message={t('confirm.deleteMessage', { item: 'Payment Method', name: deleteTarget?.name })}
        confirmText={t('confirm.confirmDelete')}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default PaymentMethodsPage
