import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, RefreshCw, X, Image as ImageIcon, Loader2, Upload, Link as LinkIcon, Settings } from 'lucide-react'
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
  image?: string
  image_url?: string
  link_url?: string
  position: 'home_hero' | 'home_secondary' | 'category' | 'popup'
  sort_order: number
  is_active: boolean
  starts_at?: string
  ends_at?: string
}

const getImageUrl = (url?: string): string => {
  if (!url || url === '[]' || url === '""' || url.includes('/storage/[]')) {
    return 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80'
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }
  return `http://127.0.0.1:8001/storage/${url.replace(/^\//, '')}`
}

const BannersPage: React.FC<{ isTab?: boolean; triggerAdd?: number }> = ({ isTab, triggerAdd }) => {
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

  // Column visibility state
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    preview: true,
    title: true,
    position: true,
    sortOrder: true,
    status: true,
    activePeriod: true,
    actions: true,
  })

  const toggleColumn = (col: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }))
  }

  // Form states
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [base64Image, setBase64Image] = useState<string>('')
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')
  const [buttonColor, setButtonColor] = useState('#3B82F6')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImageUrl(previewUrl)

      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBase64Image(reader.result)
        }
      }
      reader.readAsDataURL(file)

      toast.success(`Image file "${file.name}" selected.`)
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setBase64Image('')
    setImageUrl('')
  }
  const [linkUrl, setLinkUrl] = useState('')
  const [position, setPosition] = useState<'hero' | 'sidebar' | 'popup' | 'footer'>('hero')
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')

  const prevTriggerRef = React.useRef(triggerAdd)

  React.useEffect(() => {
    if (triggerAdd && triggerAdd > 0 && triggerAdd !== prevTriggerRef.current) {
      openCreateModal()
    }
    prevTriggerRef.current = triggerAdd
  }, [triggerAdd])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['banners', page, debouncedSearch, perPage],
    queryFn: () => api.get('/banners', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const createMutation = useMutation({
    mutationFn: (newBanner: any) => api.post('/banners', newBanner, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
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
    mutationFn: ({ id, data }: { id: number; data: any }) => api.post(`/banners/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
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
    setSelectedFile(null)
    setBase64Image('')
    setLinkUrl('')
    setPosition('hero')
    setSortOrder(0)
    setIsActive(true)
    setStartsAt('')
    setEndsAt('')
    setModalOpen(true)
  }

  const openEditModal = (banner: any) => {
    setEditingBanner(banner)
    setTitle(banner.title)
    setSelectedFile(null)
    setBase64Image('')
    const img = banner.image_url || banner.image || ''
    setImageUrl(img)
    const lnk = banner.link_url || banner.link || ''
    setLinkUrl(lnk)
    setPosition((banner.position as any) || 'hero')
    setSortOrder(banner.sort_order || 0)
    setIsActive(banner.is_active ?? true)
    setStartsAt(banner.starts_at ? banner.starts_at.split('T')[0] : '')
    setEndsAt(banner.ends_at ? banner.ends_at.split('T')[0] : '')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingBanner(null)
    setSelectedFile(null)
    setBase64Image('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Please enter a banner title.')
      return
    }
    if (!selectedFile && !imageUrl.trim()) {
      toast.error('Please select an image file or provide an image URL.')
      return
    }

    const formData = new FormData()
    formData.append('company_id', '1')
    formData.append('title', title)
    formData.append('position', position)
    formData.append('sort_order', String(sortOrder))
    formData.append('is_active', isActive ? '1' : '0')
    if (startsAt) formData.append('starts_at', startsAt)
    if (endsAt) formData.append('ends_at', endsAt)
    if (linkUrl) formData.append('link', linkUrl)

    if (selectedFile && selectedFile instanceof File) {
      formData.append('image_file', selectedFile)
      if (base64Image) {
        formData.append('image', base64Image)
      }
    } else if (imageUrl && !imageUrl.startsWith('blob:') && !imageUrl.includes('/storage/[]') && imageUrl !== '[]') {
      formData.append('image', imageUrl)
    }

    if (editingBanner) {
      formData.append('_method', 'PUT')
      updateMutation.mutate({ id: editingBanner.id, data: formData })
    } else {
      createMutation.mutate(formData)
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
          <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90">
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
            className="p-2 text-muted-foreground border border-border rounded-xl hover:bg-muted transition-colors cursor-pointer select-none"
            title={t('common.refresh', 'Refresh')}
          >
            <RefreshCw size={14} />
          </button>

          {/* Toggle Columns Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setColumnDropdownOpen(!columnDropdownOpen)}
              className="p-2 text-muted-foreground border border-border rounded-xl hover:bg-muted transition-colors cursor-pointer select-none"
              title={t('products.toggleColumns', 'Columns')}
            >
              <Settings size={14} />
            </button>
            {columnDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setColumnDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl p-2 z-20 space-y-1 text-left">
                  <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase tracking-wider">{t('products.toggleColumns', 'Toggle Columns')}</p>
                  {Object.keys(visibleColumns).map(col => (
                    <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-xl text-xs cursor-pointer text-foreground capitalize">
                      <input
                        type="checkbox"
                        checked={visibleColumns[col as keyof typeof visibleColumns]}
                        onChange={() => toggleColumn(col as keyof typeof visibleColumns)}
                        className="form-checkbox h-3.5 w-3.5 text-primary rounded border-border"
                      />
                      <span>
                        {col === 'preview' ? 'Preview' :
                         col === 'title' ? 'Title' :
                         col === 'position' ? 'Position' :
                         col === 'sortOrder' ? 'Sort Order' :
                         col === 'status' ? 'Status' :
                         col === 'activePeriod' ? 'Active Period' : 'Actions'}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
      <TableWrapper isFetching={isFetching}>
        <table className="w-full data-table">
            <thead>
              <tr>
                {visibleColumns.preview && <th className="text-left">Preview</th>}
                {visibleColumns.title && <th className="text-left">Title</th>}
                {visibleColumns.position && <th className="text-left">Position</th>}
                {visibleColumns.sortOrder && <th className="text-left">Sort Order</th>}
                {visibleColumns.status && <th className="text-left">{t('common.status')}</th>}
                {visibleColumns.activePeriod && <th className="text-left">Active Period</th>}
                {visibleColumns.actions && <th className="text-right">{t('common.actions')}</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {visibleColumns.preview && <td><div className="skeleton h-10 w-16 rounded" /></td>}
                    {visibleColumns.title && <td><div className="skeleton h-4 w-28 rounded" /></td>}
                    {visibleColumns.position && <td><div className="skeleton h-4 w-16 rounded" /></td>}
                    {visibleColumns.sortOrder && <td><div className="skeleton h-4 w-8 rounded" /></td>}
                    {visibleColumns.status && <td><div className="skeleton h-4 w-12 rounded" /></td>}
                    {visibleColumns.activePeriod && <td><div className="skeleton h-4 w-32 rounded" /></td>}
                    {visibleColumns.actions && <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>}
                  </tr>
                ))
              ) : (
                banners.map((banner) => (
                  <tr key={banner.id}>
                    {visibleColumns.preview && (
                      <td>
                        <img
                          src={getImageUrl(banner.image_url || banner.image)}
                          alt={banner.title}
                          className="w-16 h-10 object-cover rounded-lg border border-border shadow-2xs"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80'
                          }}
                        />
                      </td>
                    )}
                    {visibleColumns.title && <td className="font-medium text-foreground">{banner.title}</td>}
                    {visibleColumns.position && <td className="text-sm font-mono">{banner.position}</td>}
                    {visibleColumns.sortOrder && <td>{banner.sort_order}</td>}
                    {visibleColumns.status && (
                      <td>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          banner.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {banner.is_active ? t('common.active') : t('common.inactive')}
                        </span>
                      </td>
                    )}
                    {visibleColumns.activePeriod && (
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
                    )}
                    {visibleColumns.actions && (
                      <td className="text-right flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(banner)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(banner)} className="p-1 hover:bg-red-50 rounded text-muted-foreground hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
              {!isLoading && banners.length === 0 && (
                <tr>
                  <td colSpan={Object.values(visibleColumns).filter(Boolean).length || 1} className="py-16 text-center">
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
                {/* Banner Image Input Section with Mode Switcher */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-muted-foreground uppercase">
                      Banner Image <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-all ${
                          imageMode === 'upload' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        📁 File Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-all ${
                          imageMode === 'url' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        🔗 Image URL
                      </button>
                    </div>
                  </div>
                  
                  {imageMode === 'upload' ? (
                    imageUrl ? (
                      <div className="relative group border border-border rounded-xl p-3 bg-muted/30 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={getImageUrl(imageUrl)}
                            alt="Banner preview"
                            className="w-14 h-14 object-cover rounded-lg border border-border shadow-xs flex-shrink-0"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80'
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">
                              {selectedFile ? selectedFile.name : title || 'Banner Image'}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate">
                              {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : imageUrl}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors flex-shrink-0"
                          title="Remove Image"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-border/80 hover:border-primary/50 bg-muted/20 hover:bg-primary/5 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="p-2.5 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform mb-2">
                          <Upload size={18} />
                        </div>
                        <span className="text-xs font-semibold text-foreground">Click or drag image file here</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">Supports PNG, JPG, WEBP, SVG (max 5MB)</span>
                      </label>
                    )
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        placeholder="https://example.com/banner-image.jpg"
                        className="form-input text-xs font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Target Link URL (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Link URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    placeholder="https://example.com/promo-target"
                    className="form-input text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Position</label>
                  <select
                    value={position}
                    onChange={e => setPosition(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="hero">Hero Main Banner</option>
                    <option value="sidebar">Sidebar / Secondary Banner</option>
                    <option value="popup">Popup Promo Banner</option>
                    <option value="footer">Footer Banner</option>
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
                  <button type="button" onClick={closeModal} className="px-4 py-2.5 text-xs font-semibold border border-border rounded-xl hover:bg-muted transition-colors">
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-primary rounded-xl hover:opacity-90 shadow-md transition-all flex items-center gap-2"
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
