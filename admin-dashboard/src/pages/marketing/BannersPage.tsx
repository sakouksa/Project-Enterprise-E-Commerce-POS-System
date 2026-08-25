import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search, X, Edit2, Trash2, Upload, Image as ImageIcon
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import StatusBadge from '@/components/common/StatusBadge'
import ColumnSettingsPopover from '@/components/shared/ColumnSettingsPopover'
import BulkSelectionBanner from '@/components/shared/BulkSelectionBanner'
import { EnterpriseModal, ModalFooter, AddButton, FilterButton, RefreshButton } from '@/components/common'
import { getAbsoluteImageUrl } from '@/utils/image'
import { useTranslation } from 'react-i18next'
import BannerFilterDrawer from './components/BannerFilterDrawer'

interface Banner {
  id: number
  title: string
  subtitle?: string | null
  badge?: string | null
  discount_tag?: string | null
  image?: string
  image_url?: string
  link_url?: string
  position: 'hero' | 'sidebar' | 'popup' | 'footer' | string
  sort_order: number
  is_active: boolean
  starts_at?: string
  ends_at?: string
}

const getImageUrl = (url?: string): string => {
  if (!url || url === '[]' || url === '""' || url.includes('/storage/[]')) {
    return '/logo.png'
  }
  const resolved = getAbsoluteImageUrl(url)
  return resolved || '/logo.png'
}

const BannersPage: React.FC<{ isTab?: boolean; triggerAdd?: number }> = ({ isTab, triggerAdd }) => {
  const { t } = useTranslation(['marketing', 'common', 'toast', 'confirm'])
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

  // Selection & Bulk Actions state (Customer CRM Standard)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)

  // Filter drawer & filter parameters
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [positionFilter, setPositionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const resetAllFilters = () => {
    setSearch('')
    setPositionFilter('all')
    setStatusFilter('all')
    setSelectedRows([])
    setPage(1)
  }

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    preview: true,
    title: true,
    position: true,
    sortOrder: true,
    status: true,
    activePeriod: true,
    actions: true,
  })

  // Form states
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [badge, setBadge] = useState('')
  const [discountTag, setDiscountTag] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [base64Image, setBase64Image] = useState<string>('')
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')

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
    queryKey: ['banners', page, debouncedSearch, perPage, positionFilter, statusFilter],
    queryFn: () => api.get('/banners', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        position: positionFilter,
        status: statusFilter,
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const banners: Banner[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Bulk Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(banners.map((b) => b.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id])
    } else {
      setSelectedRows((prev) => prev.filter((i) => i !== id))
    }
  }

  const createMutation = useMutation({
    mutationFn: (newBanner: any) => api.post('/banners', newBanner, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banners'] })
      toast.success(t('toast.created', { item: t('marketing.banners') }))
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
      toast.success(t('toast.updated', { item: t('marketing.banners') }))
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
      toast.success(t('toast.deleted', { item: t('marketing.banners', 'ផ្ទាំងបដា') }))
      setDeleteTarget(null)
      setSelectedRows((prev) => prev.filter((i) => i !== deleteTarget?.id))
      adjustAfterDelete(1)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error', 'ការលុបបរាជ័យ'))
      setDeleteTarget(null)
    },
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => api.post('/banners/bulk-delete', { ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banners'] })
      toast.success(t('bulkDeleteSuccess', t('marketing.bulkDeleteSuccess', 'ផ្ទាំងបដាដែលបានជ្រើសរើសត្រូវបានលុបដោយជោគជ័យ')))
      const deletedCount = selectedRows.length
      setSelectedRows([])
      setBulkDeleteConfirmOpen(false)
      adjustAfterDelete(deletedCount)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error', 'ការលុបបរាជ័យ'))
      setBulkDeleteConfirmOpen(false)
    }
  })

  const openCreateModal = () => {
    setEditingBanner(null)
    setTitle('')
    setSubtitle('')
    setBadge('')
    setDiscountTag('')
    setImageUrl('')
    setSelectedFile(null)
    setBase64Image('')
    setImageMode('upload')
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
    setTitle(banner.title || '')
    setSubtitle(banner.subtitle || '')
    setBadge(banner.badge || '')
    setDiscountTag(banner.discount_tag || '')
    setSelectedFile(null)
    setBase64Image('')
    const img = banner.image_url || banner.image || ''
    setImageUrl(img)
    setImageMode(img.startsWith('http') || img.startsWith('/storage') ? 'url' : 'upload')
    const lnk = banner.link_url || banner.link || ''
    setLinkUrl(lnk)
    setPosition((banner.position as any) || 'hero')
    setSortOrder(banner.sort_order ?? 0)
    setIsActive(banner.is_active ?? true)
    setStartsAt(banner.starts_at ? banner.starts_at.split(/[T ]/)[0] : '')
    setEndsAt(banner.ends_at ? banner.ends_at.split(/[T ]/)[0] : '')
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
      toast.error(t('toast.required', { field: t('marketing.bannerTitle') }))
      return
    }
    if (!selectedFile && !imageUrl.trim()) {
      toast.error(t('toast.required', { field: t('marketing.bannerImage') }))
      return
    }

    const formData = new FormData()
    formData.append('company_id', '1')
    formData.append('title', title)
    formData.append('subtitle', subtitle || '')
    formData.append('badge', badge || '')
    formData.append('discount_tag', discountTag || '')
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
      formData.append('image_url', imageUrl)
    }

    if (editingBanner) {
      formData.append('_method', 'PUT')
      updateMutation.mutate({ id: editingBanner.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const getPositionBadge = (pos: string) => {
    switch (pos) {
      case 'hero':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {t('posHero', t('marketing.posHero', 'ផ្ទាំងបដាធំទំព័រដើម'))}
          </span>
        )
      case 'sidebar':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            {t('posSidebar', t('marketing.posSidebar', 'ផ្ទាំងបដាចំហៀង'))}
          </span>
        )
      case 'popup':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {t('posPopup', t('marketing.posPopup', 'ផ្ទាំងបដាផុសឡើង'))}
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t('posFooter', t('marketing.posFooter', 'ផ្ទាំងបដាខាងក្រោម'))}
          </span>
        )
    }
  }

  return (
    <div className="space-y-5">
      {!isTab && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('banners', t('marketing.banners', 'ផ្ទាំងបដា'))}</h1>
            <p className="text-muted-foreground text-sm">
              {t('common.showing', { from: pagination.from || 0, to: pagination.to || 0, total: pagination.total })}
            </p>
          </div>
          <AddButton
            onClick={openCreateModal}
            label={t('addBanner', t('marketing.addBanner', 'បន្ថែមផ្ទាំងបដាថ្មី'))}
          />
        </div>
      )}

      {/* Bulk Selection Panel (Customer CRM Standard) */}
      <BulkSelectionBanner
        selectedCount={selectedRows.length}
        onDelete={() => setBulkDeleteConfirmOpen(true)}
        onClear={() => setSelectedRows([])}
        deleteLabel={t('common.deleteSelected', 'លុបដែលបានជ្រើស')}
        deleteLoading={bulkDeleteMutation.isPending}
      />

      {/* Unified Enterprise Toolbar (Customer CRM Architecture) */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-xs print:hidden">
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto flex-1">
          {/* Search bar with clear button */}
          <div className="relative min-w-[280px] sm:min-w-[340px] md:w-96 max-w-md flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t('searchPlaceholder', t('marketing.searchPlaceholder', 'ស្វែងរកចំណងជើង, តំណភ្ជាប់...'))}
              className="w-full h-10 pl-10 pr-9 text-xs sm:text-sm rounded-xl border border-border bg-card hover:border-muted-foreground/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all placeholder:text-muted-foreground shadow-xs font-medium"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
                type="button"
                title={t('common.clear', 'សម្អាត')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Global Filter Button */}
          <FilterButton
            onClick={() => setFilterDrawerOpen(true)}
            isActive={positionFilter !== 'all' || statusFilter !== 'all'}
            label={t('common.filter', 'ចម្រោះ')}
          />

          {/* Reset Filters */}
          <ResetButton onClick={resetAllFilters} />
        </div>

        {/* Action Controls: Refresh & Column Settings */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <RefreshButton
            onClick={() => qc.invalidateQueries({ queryKey: ['banners'] })}
            loading={isFetching}
            title={t('common.refresh', 'ផ្ទុកឡើងវិញ')}
          />

          <ColumnSettingsPopover
            columns={[
              { key: 'preview', label: t('preview', t('marketing.preview', 'រូបភាពមើលមុន')) },
              { key: 'title', label: t('bannerTitle', t('marketing.bannerTitle', 'ចំណងជើងផ្ទាំងបដា')) },
              { key: 'position', label: t('position', t('marketing.position', 'ទីតាំងបង្ហាញ')) },
              { key: 'sortOrder', label: t('sortOrder', t('marketing.sortOrder', 'លំដាប់លំដោយ')) },
              { key: 'status', label: t('activeStatus', t('marketing.activeStatus', 'ស្ថានភាព')) },
              { key: 'activePeriod', label: t('activePeriod', t('marketing.activePeriod', 'រយៈពេលសកម្ម')) },
              { key: 'actions', label: t('actions', t('marketing.actions', 'សកម្មភាព')) },
            ]}
            visibleColumns={visibleColumns}
            onChange={(cols) => setVisibleColumns(cols)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <TableWrapper isFetching={isLoading}>
          <div className="overflow-x-auto">
            <table className="w-full data-table border-collapse text-left text-sm">
              <thead className="bg-muted/40 sticky top-0 border-b border-border z-10 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="w-12 px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={banners.length > 0 && selectedRows.length === banners.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                      title={t('common.selectAll', 'ជ្រើសរើសទាំងអស់')}
                    />
                  </th>
                  {visibleColumns.preview && (
                    <th className="w-24 px-4 py-3.5 whitespace-nowrap text-left">
                      {t('preview', t('marketing.preview', 'រូបភាពមើលមុន'))}
                    </th>
                  )}
                  {visibleColumns.title && (
                    <th className="min-w-[220px] px-4 py-3.5 text-left">
                      {t('bannerTitle', t('marketing.bannerTitle', 'ចំណងជើងផ្ទាំងបដា'))}
                    </th>
                  )}
                  {visibleColumns.position && (
                    <th className="min-w-[170px] px-4 py-3.5 text-left whitespace-nowrap">
                      {t('position', t('marketing.position', 'ទីតាំងបង្ហាញ'))}
                    </th>
                  )}
                  {visibleColumns.sortOrder && (
                    <th className="w-28 px-4 py-3.5 text-center whitespace-nowrap">
                      {t('sortOrder', t('marketing.sortOrder', 'លំដាប់លំដោយ'))}
                    </th>
                  )}
                  {visibleColumns.status && (
                    <th className="w-28 px-4 py-3.5 text-center whitespace-nowrap">
                      {t('activeStatus', t('marketing.activeStatus', 'ស្ថានភាព'))}
                    </th>
                  )}
                  {visibleColumns.activePeriod && (
                    <th className="min-w-[180px] px-4 py-3.5 text-left whitespace-nowrap">
                      {t('activePeriod', t('marketing.activePeriod', 'រយៈពេលសកម្ម'))}
                    </th>
                  )}
                  {visibleColumns.actions && (
                    <th className="w-24 px-4 py-3.5 text-right whitespace-nowrap pr-5">
                      {t('actions', t('marketing.actions', 'សកម្មភាព'))}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading && (
                  <tr>
                    <td colSpan={(Object.values(visibleColumns).filter(Boolean).length || 7) + 1} className="p-4">
                      <LoadingSkeleton rows={5} />
                    </td>
                  </tr>
                )}
                {!isLoading && banners.length > 0 && (
                  banners.map((banner) => (
                    <tr
                      key={banner.id}
                      className={`hover:bg-muted/30 transition-colors ${selectedRows.includes(banner.id) ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                    >
                      <td className="w-12 px-4 py-3 align-middle text-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(banner.id)}
                          onChange={(e) => handleSelectRow(banner.id, e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        />
                      </td>
                      {visibleColumns.preview && (
                        <td className="px-4 py-3 align-middle">
                          <img
                            src={getImageUrl(banner.image_url || banner.image)}
                            alt={banner.title}
                            className="w-16 h-10 object-cover rounded-xl border border-border shadow-xs bg-slate-900 shrink-0"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = '/logo.png'
                            }}
                          />
                        </td>
                      )}
                      {visibleColumns.title && (
                        <td className="px-4 py-3 align-middle">
                          <div className="font-bold text-foreground text-sm">{banner.title}</div>
                          {banner.subtitle && (
                            <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-md">{banner.subtitle}</div>
                          )}
                        </td>
                      )}
                      {visibleColumns.position && (
                        <td className="px-4 py-3 align-middle whitespace-nowrap">
                          {getPositionBadge(banner.position)}
                        </td>
                      )}
                      {visibleColumns.sortOrder && (
                        <td className="px-4 py-3 align-middle text-center whitespace-nowrap">
                          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-muted/60 text-foreground border border-border/40 inline-block">
                            {banner.sort_order}
                          </span>
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="px-4 py-3 align-middle text-center whitespace-nowrap">
                          <StatusBadge status={banner.is_active} />
                        </td>
                      )}
                      {visibleColumns.activePeriod && (
                        <td className="px-4 py-3 align-middle text-xs text-muted-foreground font-mono whitespace-nowrap">
                          {banner.starts_at || banner.ends_at ? (
                            <span>
                              {banner.starts_at ? new Date(banner.starts_at).toLocaleDateString() : 'Start'}
                              {' → '}
                              {banner.ends_at ? new Date(banner.ends_at).toLocaleDateString() : 'End'}
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium font-sans inline-flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {t('alwaysActive', t('marketing.alwaysActive', 'សកម្មជានិច្ច'))}
                            </span>
                          )}
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td className="px-4 py-3 align-middle text-right whitespace-nowrap pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(banner)}
                              className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
                              title={t('common.edit', 'កែសម្រួល')}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(banner)}
                              className="p-2 hover:bg-rose-500/10 rounded-xl text-muted-foreground hover:text-rose-500 transition-all cursor-pointer shadow-2xs"
                              title={t('common.delete', 'លុប')}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
                {!isLoading && banners.length === 0 && (
                  <tr>
                    <td colSpan={(Object.values(visibleColumns).filter(Boolean).length || 7) + 1} className="py-16 text-center">
                      <EmptyState message={t('common.noData', 'មិនមានទិន្នន័យទេ')} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

      {/* Banner Filter Drawer (Customer CRM Style) */}
      <BannerFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        positionFilter={positionFilter}
        setPositionFilter={(val) => { setPositionFilter(val); setPage(1); }}
        statusFilter={statusFilter}
        setStatusFilter={(val) => { setStatusFilter(val); setPage(1); }}
        onReset={resetAllFilters}
      />

      {/* ══════════════════════════════════════════════════════════
          GLOBAL ENTERPRISE MODAL: ADD / EDIT BANNER
      ══════════════════════════════════════════════════════════ */}
      <EnterpriseModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={
          editingBanner
            ? t('marketing.editBanner', 'កែសម្រួលផ្ទាំងបដា')
            : t('marketing.addBanner', 'បន្ថែមផ្ទាំងបដាថ្មី')
        }
        subtitle={t('marketing.bannerSubtitle', 'គ្រប់គ្រងផ្ទាំងផ្សព្វផ្សាយពាណិជ្ជកម្ម និងប្រូម៉ូសិនលើគេហទំព័រ')}
        icon={<ImageIcon size={20} />}
        iconVariant="purple"
        size="2xl"
        badge={
          editingBanner ? (
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-muted dark:bg-slate-800 text-muted-foreground border border-border/60">
              #{editingBanner.id}
            </span>
          ) : undefined
        }
        footer={
          <ModalFooter
            onCancel={closeModal}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            isEdit={Boolean(editingBanner)}
            submitLabel={
              editingBanner
                ? t('marketing.saveChanges', t('common.saveChanges', 'រក្សាទុកការផ្លាស់ប្តូរ'))
                : t('marketing.saveBanner', t('common.save', 'រក្សាទុកផ្ទាំងបដា'))
            }
            cancelLabel={t('common.cancel', 'បោះបង់')}
            onSubmit={handleSubmit}
          />
        }
      >
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

            {/* ══════════════════════════════════════════════════
                ព័ត៌មានទូទៅ & ខ្លឹមសារ (Content Information)
            ══════════════════════════════════════════════════ */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-border/70">
                <h4 className="text-xs sm:text-[13px] font-bold text-foreground tracking-wide">
                  {t('bannerContentSection', t('marketing.bannerContentSection', 'ព័ត៌មានទូទៅ & ខ្លឹមសារបដា'))}
                </h4>
              </div>

              <div className="space-y-4">
                {/* Banner Title */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {t('bannerTitle', t('marketing.bannerTitle', 'ចំណងជើងផ្ទាំងបដា'))} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    placeholder={t('bannerTitlePlaceholder', t('marketing.bannerTitlePlaceholder', 'ឧ. NEXT-GEN PRO GAMING ARENA'))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card dark:bg-slate-800/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                  />
                </div>

                {/* Subtitle / Description */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {t('bannerDescription', t('marketing.bannerDescription', 'ចំណងជើងរង / ការពិពណ៌នា'))}
                  </label>
                  <textarea
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                    rows={2}
                    placeholder={t('bannerDescPlaceholder', t('marketing.bannerDescPlaceholder', 'ឧ. ឧបករណ៍ហ្គេមអាជីព RTX 5090, 240Hz OLED Displays...'))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card dark:bg-slate-800/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-2xs"
                  />
                </div>

                {/* Badge Label & Discount Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {t('badgeLabel', t('marketing.badgeLabel', 'ស្លាកសញ្ញា'))}
                    </label>
                    <input
                      value={badge}
                      onChange={e => setBadge(e.target.value)}
                      placeholder={t('badgePlaceholder', t('marketing.badgePlaceholder', 'ឧ. ហាងផ្លូវការ'))}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-card dark:bg-slate-800/80 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {t('discountTag', t('marketing.discountTag', 'ស្លាកបញ្ចុះតម្លៃ'))}
                    </label>
                    <input
                      value={discountTag}
                      onChange={e => setDiscountTag(e.target.value)}
                      placeholder={t('discountPlaceholder', t('marketing.discountPlaceholder', 'ឧ. បញ្ចុះតម្លៃ 35%'))}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-card dark:bg-slate-800/80 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                រូបភាព & តំណភ្ជាប់ (Image & Target Link)
            ══════════════════════════════════════════════════ */}
            <div className="space-y-4 pt-1">
              <div className="pb-2 border-b border-border/70">
                <h4 className="text-xs sm:text-[13px] font-bold text-foreground tracking-wide">
                  {t('bannerMediaSection', t('marketing.bannerMediaSection', 'រូបភាព & តំណភ្ជាប់គោលដៅ'))}
                </h4>
              </div>

              <div className="space-y-4">
                {/* Mode Switcher */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    {t('bannerImage', t('marketing.bannerImage', 'រូបភាពបដា'))} <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        imageMode === 'upload' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t('fileUpload', t('marketing.fileUpload', 'បង្ហោះរូបភាព'))}
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        imageMode === 'url' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t('imageUrl', t('marketing.imageUrl', 'តំណភ្ជាប់រូបភាព'))}
                    </button>
                  </div>
                </div>

                {/* Upload or URL Preview */}
                {imageMode === 'upload' ? (
                  imageUrl ? (
                    <div className="relative group border border-border rounded-2xl p-3.5 bg-card dark:bg-slate-800/80 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={getImageUrl(imageUrl)}
                          alt="Banner preview"
                          className="w-16 h-12 object-cover rounded-xl border border-border shadow-xs flex-shrink-0 bg-slate-950"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/logo.png'
                          }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">
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
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors flex-shrink-0 cursor-pointer"
                        title={t('common.remove', 'លុបរូបភាព')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-border/80 hover:border-primary/50 bg-card/60 dark:bg-slate-800/50 hover:bg-primary/5 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform mb-2">
                        <Upload size={20} />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {t('dragOrUpload', t('marketing.dragOrUpload', 'ចុច ឬអូសទម្លាក់រូបភាពនៅទីនេះ'))}
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-0.5">
                        {t('imageFormatHint', t('marketing.imageFormatHint', 'គាំទ្រ PNG, JPG, WEBP, SVG (ទំហំអតិបរមា 5MB)'))}
                      </span>
                    </label>
                  )
                ) : (
                  <div>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://example.com/banner-image.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card dark:bg-slate-800/80 text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                    />
                  </div>
                )}

                {/* Target Link URL */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {t('targetLink', t('marketing.targetLink', 'តំណភ្ជាប់គោលដៅ'))}
                  </label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    placeholder={t('targetLinkPlaceholder', t('marketing.targetLinkPlaceholder', 'https://example.com/promo-target'))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card dark:bg-slate-800/80 text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                ទីតាំង & កាលវិភាគ (Placement & Schedule)
            ══════════════════════════════════════════════════ */}
            <div className="space-y-4 pt-1">
              <div className="pb-2 border-b border-border/70">
                <h4 className="text-xs sm:text-[13px] font-bold text-foreground tracking-wide">
                  {t('bannerPlacementSection', t('marketing.bannerPlacementSection', 'ទីតាំងបង្ហាញ & ការកំណត់កាលវិភាគ'))}
                </h4>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Position */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {t('position', t('marketing.position', 'ទីតាំងបង្ហាញ'))}
                    </label>
                    <select
                      value={position}
                      onChange={e => setPosition(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card dark:bg-slate-800/80 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer font-medium shadow-2xs"
                    >
                      <option value="hero">{t('posHero', t('marketing.posHero', 'ផ្ទាំងបដាធំទំព័រដើម'))}</option>
                      <option value="sidebar">{t('posSidebar', t('marketing.posSidebar', 'ផ្ទាំងបដាចំហៀង'))}</option>
                      <option value="popup">{t('posPopup', t('marketing.posPopup', 'ផ្ទាំងបដាផុសឡើង'))}</option>
                      <option value="footer">{t('posFooter', t('marketing.posFooter', 'ផ្ទាំងបដាខាងក្រោម'))}</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {t('sortOrder', t('marketing.sortOrder', 'លំដាប់លំដោយ'))}
                    </label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={e => setSortOrder(Number(e.target.value))}
                      min={0}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card dark:bg-slate-800/80 text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Starts At & Ends At */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {t('startsAt', t('marketing.startsAt', 'កាលបរិច្ឆេទចាប់ផ្តើម'))}
                    </label>
                    <input
                      type="date"
                      value={startsAt}
                      onChange={e => setStartsAt(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-card dark:bg-slate-800/80 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {t('endsAt', t('marketing.endsAt', 'កាលបរិច្ឆេទបញ្ចប់'))}
                    </label>
                    <input
                      type="date"
                      value={endsAt}
                      onChange={e => setEndsAt(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-card dark:bg-slate-800/80 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={isActive}
                      onChange={e => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <label htmlFor="isActive" className="text-xs sm:text-sm font-bold text-foreground cursor-pointer select-none">
                    {isActive ? t('active', t('marketing.active', 'សកម្ម')) : t('inactive', t('marketing.inactive', 'អសកម្ម'))}
                  </label>
                </div>
              </div>
            </div>

          </div>
        </form>
      </EnterpriseModal>

      {/* Single Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title={t('deleteBannerTitle', t('marketing.deleteBannerTitle', 'លុបផ្ទាំងបដា'))}
        itemName={deleteTarget?.title}
        confirmText={t('common.delete', t('confirm.confirmDelete', 'លុប'))}
        cancelText={t('common.cancel', t('confirm.cancel', 'បោះបង់'))}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Bulk Delete Dialog */}
      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        title={t('bulkDeleteBannersTitle', t('marketing.bulkDeleteBannersTitle', 'លុបផ្ទាំងបដាដែលបានជ្រើស'))}
        message={t('confirmBulkDeleteBannersMessage', {
          count: selectedRows.length,
          defaultValue: `តើអ្នកពិតជាចង់លុបផ្ទាំងបដាចំនួន ${selectedRows.length} ដែលបានជ្រើសរើសនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`
        }).replace('{{count}}', String(selectedRows.length))}
        confirmText={t('common.delete', t('confirm.confirmDelete', 'លុប'))}
        cancelText={t('common.cancel', t('confirm.cancel', 'បោះបង់'))}
        loading={bulkDeleteMutation.isPending}
        onConfirm={() => bulkDeleteMutation.mutate(selectedRows)}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
      />
    </div>
  )
}

export default BannersPage
