import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, RefreshCw, X, Tag, Loader2, Sparkles } from 'lucide-react'
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

interface Coupon {
  id: number
  name: string
  code: string
  type: 'fixed' | 'percentage' | 'free_shipping'
  value: number
  minimum_amount?: number
  usage_limit?: number
  expires_at?: string
  is_active: boolean
}

const CouponsPage: React.FC = () => {
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
  } = useServerPagination({ storageKey: 'coupons' })
    const [modalOpen, setModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [type, setType] = useState<'fixed' | 'percentage' | 'free_shipping'>('percentage')
  const [value, setValue] = useState(0)
  const [minimumAmount, setMinimumAmount] = useState<number | ''>('')
  const [usageLimit, setUsageLimit] = useState<number | ''>('')
  const [expiresAt, setExpiresAt] = useState('')
  const [isActive, setIsActive] = useState(true)

  const [generating, setGenerating] = useState(false)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['coupons', page, debouncedSearch, perPage],
    queryFn: () => api.get('/coupons', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const createMutation = useMutation({
    mutationFn: (newCoupon: any) => api.post('/coupons', newCoupon),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['coupons'] })
      toast.success(t('toast.created', { item: t('nav.coupons') }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/coupons/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['coupons'] })
      toast.success(t('toast.updated', { item: t('nav.coupons') }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/coupons/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['coupons'] })
      toast.success(t('toast.deleted', { item: t('nav.coupons') }))
      setDeleteTarget(null)
      adjustAfterDelete(coupons.length)
    },
    onError: () => {
      toast.error(t('toast.error'))
      setDeleteTarget(null)
    },
  })

  const handleGenerateCode = async () => {
    setGenerating(true)
    try {
      const res = await api.get('/coupons/generate-code')
      setCode(res.data.data.code)
    } catch {
      toast.error('Failed to generate coupon code.')
    } finally {
      setGenerating(false)
    }
  }

  const coupons: Coupon[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setEditingCoupon(null)
    setName('')
    setCode('')
    setType('percentage')
    setValue(0)
    setMinimumAmount('')
    setUsageLimit('')
    setExpiresAt('')
    setIsActive(true)
    setModalOpen(true)
  }

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setName(coupon.name)
    setCode(coupon.code)
    setType(coupon.type)
    setValue(coupon.value)
    setMinimumAmount(coupon.minimum_amount ?? '')
    setUsageLimit(coupon.usage_limit ?? '')
    setExpiresAt(coupon.expires_at ? coupon.expires_at.split('T')[0] : '')
    setIsActive(coupon.is_active)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingCoupon(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !code.trim()) return

    const payload = {
      name,
      code,
      type,
      value: Number(value),
      minimum_amount: minimumAmount !== '' ? Number(minimumAmount) : null,
      usage_limit: usageLimit !== '' ? Number(usageLimit) : null,
      expires_at: expiresAt || null,
      is_active: isActive,
    }

    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.coupons')}</h1>
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
            onClick={() => qc.invalidateQueries({ queryKey: ['coupons'] })}
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
                <th className="text-left">{t('common.name')}</th>
                <th className="text-left">Code</th>
                <th className="text-left">Type</th>
                <th className="text-left">Value</th>
                <th className="text-left">Min Spend</th>
                <th className="text-left">Limit</th>
                <th className="text-left">Expires</th>
                <th className="text-left">{t('common.status')}</th>
                <th className="text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton h-4 w-24 rounded" /></td>
                    <td><div className="skeleton h-4 w-16 rounded" /></td>
                    <td><div className="skeleton h-4 w-16 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded" /></td>
                    <td><div className="skeleton h-4 w-20 rounded" /></td>
                    <td><div className="skeleton h-4 w-16 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td className="font-medium text-foreground">{coupon.name}</td>
                    <td className="font-mono text-sm font-bold text-blue-600">{coupon.code}</td>
                    <td>{t(`coupons.${coupon.type}`)}</td>
                    <td>
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `Rp ${coupon.value.toLocaleString('id-ID')}`}
                    </td>
                    <td>{coupon.minimum_amount ? `Rp ${coupon.minimum_amount.toLocaleString('id-ID')}` : '-'}</td>
                    <td>{coupon.usage_limit || '∞'}</td>
                    <td className="text-sm text-muted-foreground">
                      {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        coupon.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {coupon.is_active ? t('common.active') : t('common.inactive')}
                      </span>
                    </td>
                    <td className="text-right flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(coupon)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(coupon)} className="p-1 hover:bg-red-50 rounded text-muted-foreground hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && coupons.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <Tag size={40} className="mx-auto mb-3 text-muted-foreground/30" />
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
                  {editingCoupon ? 'Edit Coupon' : 'Add Coupon'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('common.name')}</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="e.g. Summer Sale 10%"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Coupon Code</label>
                  <div className="flex gap-2">
                    <input
                      value={code}
                      onChange={e => setCode(e.target.value.toUpperCase())}
                      required
                      placeholder="e.g. SUMMER10"
                      className="form-input font-mono uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateCode}
                      disabled={generating}
                      className="px-3 bg-muted border border-border rounded-lg text-muted-foreground hover:bg-muted/80 flex items-center justify-center"
                    >
                      {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Discount Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                {type !== 'free_shipping' && (
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Discount Value</label>
                    <input
                      type="number"
                      value={value}
                      onChange={e => setValue(Number(e.target.value))}
                      required
                      min={0}
                      className="form-input"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Minimum Spend (Optional)</label>
                  <input
                    type="number"
                    value={minimumAmount}
                    onChange={e => setMinimumAmount(e.target.value !== '' ? Number(e.target.value) : '')}
                    placeholder="e.g. 50000"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Usage Limit (Optional)</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={e => setUsageLimit(e.target.value !== '' ? Number(e.target.value) : '')}
                    placeholder="Unlimited if empty"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Expires At (Optional)</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={e => setExpiresAt(e.target.value)}
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
        title={t('confirm.deleteTitle', { item: 'Coupon' })}
        message={t('confirm.deleteMessage', { item: 'Coupon', name: deleteTarget?.code })}
        confirmText={t('confirm.confirmDelete')}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default CouponsPage
