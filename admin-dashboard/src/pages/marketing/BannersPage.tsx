import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, RefreshCw, X, Image as ImageIcon, Loader2 } from 'lucide-react'
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

interface Banner {
  id: number
  title: string
  image_url: string
  link_url?: string
  position: 'home_hero' | 'home_secondary' | 'category' | 'popup'
  sort_order: number
  is_active: boolean
  starts_at?: string
  ends_at?: string
}

const BannersPage: React.FC<{ isTab?: boolean }> = ({ isTab }) => {
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
  } = useServerPagination({ storageKey: 'banners' })
    const [modalOpen, setModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [position, setPosition] = useState<'home_hero' | 'home_secondary' | 'category' | 'popup'>('home_hero')
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['banners', page, debouncedSearch, perPage],
    queryFn: () => api.get('/banners', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const createMutation = useMutation({
    mutationFn: (newBanner: any) => api.post('/banners', newBanner),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banners'] })
      toast.success(t('toast.created', { item: t('nav.banners') }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/banners/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banners'] })
      toast.success(t('toast.updated', { item: t('nav.banners') }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/banners/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banners'] })
      toast.success(t('toast.deleted', { item: t('nav.banners') }))
      setDeleteTarget(null)
      adjustAfterDelete(banners.length)
    },
    onError: () => {
      toast.error(t('toast.error'))
      setDeleteTarget(null)
    },
  })

  const banners: Banner[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setEditingBanner(null)
    setTitle('')
    setImageUrl('')
    setLinkUrl('')
    setPosition('home_hero')
    setSortOrder(0)
    setIsActive(true)
    setStartsAt('')
    setEndsAt('')
    setModalOpen(true)
  }

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner)
    setTitle(banner.title)
    setImageUrl(banner.image_url)
    setLinkUrl(banner.link_url ?? '')
    setPosition(banner.position)
    setSortOrder(banner.sort_order)
    setIsActive(banner.is_active)
    setStartsAt(banner.starts_at ? banner.starts_at.split('T')[0] : '')
    setEndsAt(banner.ends_at ? banner.ends_at.split('T')[0] : '')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingBanner(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !imageUrl.trim()) return

    const payload = {
      title,
      image_url: imageUrl,
      link_url: linkUrl || null,
      position,
      sort_order: Number(sortOrder),
      is_active: isActive,
      starts_at: startsAt || null,
      ends_at: endsAt || null,
    }

    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div className="space-y-5">
      {!isTab && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('nav.banners')}</h1>
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
            onClick={() => qc.invalidateQueries({ queryKey: ['banners'] })}
            className="p-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          {isTab && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                         bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm ml-auto"
            >
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
                <th className="text-left">Preview</th>
                <th className="text-left">Title</th>
                <th className="text-left">Position</th>
                <th className="text-left">Sort Order</th>
                <th className="text-left">{t('common.status')}</th>
                <th className="text-left">Active Period</th>
                <th className="text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton h-10 w-16 rounded" /></td>
                    <td><div className="skeleton h-4 w-28 rounded" /></td>
                    <td><div className="skeleton h-4 w-16 rounded" /></td>
                    <td><div className="skeleton h-4 w-8 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded" /></td>
                    <td><div className="skeleton h-4 w-32 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : (
                banners.map((banner) => (
                  <tr key={banner.id}>
                    <td>
                      {banner.image_url ? (
                        <img src={banner.image_url} alt={banner.title} className="w-16 h-10 object-cover rounded border border-border" />
                      ) : (
                        <div className="w-16 h-10 bg-muted flex items-center justify-center rounded">
                          <ImageIcon size={16} className="text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="font-medium text-foreground">{banner.title}</td>
                    <td className="text-sm font-mono">{banner.position}</td>
                    <td>{banner.sort_order}</td>
                    <td>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        banner.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {banner.is_active ? t('common.active') : t('common.inactive')}
                      </span>
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {banner.starts_at || banner.ends_at ? (
                        <span>
                          {banner.starts_at ? new Date(banner.starts_at).toLocaleDateString() : 'Start'}
                          {' - '}
                          {banner.ends_at ? new Date(banner.ends_at).toLocaleDateString() : 'End'}
                        </span>
                      ) : (
                        'Always Active'
                      )}
                    </td>
                    <td className="text-right flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(banner)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(banner)} className="p-1 hover:bg-red-50 rounded text-muted-foreground hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && banners.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <ImageIcon size={40} className="mx-auto mb-3 text-muted-foreground/30" />
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
                  {editingBanner ? 'Edit Banner' : 'Add Banner'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Banner Title</label>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Premium Home Hero Banner"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Image URL</label>
                  <input
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    required
                    placeholder="https://example.com/banner.jpg"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Link URL (Optional)</label>
                  <input
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    placeholder="https://example.com/promo-target"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Position</label>
                  <select
                    value={position}
                    onChange={e => setPosition(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="home_hero">Home Hero Carousel</option>
                    <option value="home_secondary">Home Secondary Banner</option>
                    <option value="category">Category Banner</option>
                    <option value="popup">Popup Promo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={e => setSortOrder(Number(e.target.value))}
                    min={0}
                    className="form-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Starts At</label>
                    <input
                      type="date"
                      value={startsAt}
                      onChange={e => setStartsAt(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Ends At</label>
                    <input
                      type="date"
                      value={endsAt}
                      onChange={e => setEndsAt(e.target.value)}
                      className="form-input"
                    />
                  </div>
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
        title={t('confirm.deleteTitle', { item: 'Banner' })}
        message={t('confirm.deleteMessage', { item: 'Banner', name: deleteTarget?.title })}
        confirmText={t('confirm.confirmDelete')}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default BannersPage
