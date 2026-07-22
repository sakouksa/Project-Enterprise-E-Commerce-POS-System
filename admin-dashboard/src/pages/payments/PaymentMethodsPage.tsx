import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, RefreshCw, X, CreditCard, Loader2, DollarSign } from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import FormDrawer from '@/components/common/FormDrawer'
import { useTranslation } from 'react-i18next'

interface PaymentMethod {
  id: number
  name: string
  code: string
  type: string
  fee_percent: number
  fee_fixed: number
  is_active: boolean
  available_pos: boolean
  available_online: boolean
}

const PaymentMethodsPage: React.FC<{ isTab?: boolean; triggerAdd?: number }> = ({ isTab, triggerAdd }) => {
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
    adjustAfterDelete,
  } = useServerPagination({ storageKey: 'paymentmethods' })

  const [modalOpen, setModalOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null)

  // Form states matching 100% database fields
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [type, setType] = useState('cash')
  const [feePercent, setFeePercent] = useState('0.00')
  const [feeFixed, setFeeFixed] = useState('0.00')
  const [isActive, setIsActive] = useState(true)
  const [availablePos, setAvailablePos] = useState(true)
  const [availableOnline, setAvailableOnline] = useState(true)

  React.useEffect(() => {
    if (triggerAdd && triggerAdd > 0) {
      openCreateModal()
    }
  }, [triggerAdd])

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
    setType('cash')
    setFeePercent('0.00')
    setFeeFixed('0.00')
    setIsActive(true)
    setAvailablePos(true)
    setAvailableOnline(true)
    setModalOpen(true)
  }

  const openEditModal = (method: PaymentMethod) => {
    setEditingMethod(method)
    setName(method.name)
    setCode(method.code)
    setType(method.type || 'cash')
    setFeePercent(String(method.fee_percent ?? '0.00'))
    setFeeFixed(String(method.fee_fixed ?? '0.00'))
    setIsActive(!!method.is_active)
    setAvailablePos(!!method.available_pos)
    setAvailableOnline(!!method.available_online)
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
      type,
      fee_percent: Number(feePercent),
      fee_fixed: Number(feeFixed),
      is_active: isActive,
      available_pos: availablePos,
      available_online: availableOnline,
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
          <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 shadow-sm cursor-pointer font-semibold">
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
          {/* Add button is now handled by the parent page header */}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <TableWrapper isFetching={isFetching}>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="w-[25%] text-left py-4 px-5">{t('common.name')}</th>
                <th className="w-[15%] text-left py-4 px-5">Code</th>
                <th className="w-[15%] text-left py-4 px-5">Type</th>
                <th className="w-[15%] text-left py-4 px-5">Fees</th>
                <th className="w-[15%] text-left py-4 px-5">Channels</th>
                <th className="w-[10%] text-left py-4 px-5">{t('common.status')}</th>
                <th className="w-[100px] text-right py-4 px-5">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton h-4 w-28 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded" /></td>
                    <td><div className="skeleton h-4 w-16 rounded" /></td>
                    <td><div className="skeleton h-4 w-20 rounded" /></td>
                    <td><div className="skeleton h-4 w-24 rounded" /></td>
                    <td><div className="skeleton h-4 w-16 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : (
                methods.map((method) => (
                  <tr key={method.id} className="hover:bg-muted/40 transition-colors">
                    <td className="font-semibold text-foreground py-4 px-5">{method.name}</td>
                    <td className="font-mono text-xs text-primary py-4 px-5">{method.code}</td>
                    <td className="font-semibold text-xs capitalize text-muted-foreground py-4 px-5">{method.type?.replace('_', ' ') || 'cash'}</td>
                    <td className="text-xs font-semibold py-4 px-5">
                      {Number(method.fee_percent) > 0 ? `${Number(method.fee_percent)}%` : ''}
                      {Number(method.fee_percent) > 0 && Number(method.fee_fixed) > 0 ? ' + ' : ''}
                      {Number(method.fee_fixed) > 0 ? `$${Number(method.fee_fixed).toFixed(2)}` : (Number(method.fee_percent) === 0 ? 'Free' : '')}
                    </td>
                    <td className="text-xs text-muted-foreground font-medium py-4 px-5">
                      {method.available_pos && <span className="bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-md text-[10px] mr-1">POS</span>}
                      {method.available_online && <span className="bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-md text-[10px]">Online</span>}
                    </td>
                    <td className="py-4 px-5">
                      <button
                        onClick={() => toggleStatusMutation.mutate({ id: method.id, active: !method.is_active })}
                        className={`text-xs font-semibold rounded-full px-2.5 py-0.5 border ${
                          method.is_active ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                        }`}
                      >
                        {method.is_active ? t('common.active') : t('common.inactive')}
                      </button>
                    </td>
                    <td className="text-right py-4 px-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEditModal(method)} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors border border-border">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => setDeleteTarget(method)} className="p-1.5 hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 rounded-lg transition-colors border border-border">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && methods.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
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

      <FormDrawer
        open={modalOpen}
        title={editingMethod ? `Edit Payment Method #${editingMethod.id}` : 'Add Payment Method'}
        subtitle="Configure system payment method parameters and transaction fees."
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        submitLabel={editingMethod ? 'Update Method' : 'Create Method'}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{t('common.name')} *</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="e.g. Bank Transfer, ABA Mobile, Cash on Delivery"
                className="form-input w-full text-xs rounded-xl border border-border bg-card text-foreground hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Method Code *</label>
                <input
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  required
                  placeholder="e.g. bank_transfer, aba_mobile"
                  className="form-input w-full text-xs rounded-xl border border-border bg-card text-foreground hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2.5 font-mono text-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Gateway Type *</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="form-input w-full text-xs rounded-xl border border-border bg-card text-foreground hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2.5 cursor-pointer capitalize"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="ewallet">E-Wallet</option>
                  <option value="qris">QR / QRIS</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Fee Percent (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={feePercent}
                  onChange={e => setFeePercent(e.target.value)}
                  placeholder="e.g. 1.50"
                  className="form-input w-full text-xs rounded-xl border border-border bg-card text-foreground hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2.5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Fee Fixed ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={feeFixed}
                  onChange={e => setFeeFixed(e.target.value)}
                  placeholder="e.g. 0.25"
                  className="form-input w-full text-xs rounded-xl border border-border bg-card text-foreground hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2.5"
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-border/60">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-600/30 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-foreground cursor-pointer hover:text-primary transition-colors">{t('common.active')}</label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="availablePos"
                    checked={availablePos}
                    onChange={e => setAvailablePos(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-600/30 cursor-pointer"
                  />
                  <label htmlFor="availablePos" className="text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground">POS Channel</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="availableOnline"
                    checked={availableOnline}
                    onChange={e => setAvailableOnline(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-600/30 cursor-pointer"
                  />
                  <label htmlFor="availableOnline" className="text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground">Online Store</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormDrawer>

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
