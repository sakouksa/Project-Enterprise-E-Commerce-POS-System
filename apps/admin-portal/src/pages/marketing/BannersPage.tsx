import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search, X, Edit2, Trash2, Image as ImageIcon
} from 'lucide-react'
import { marketingService } from '@/services/marketingService'
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
import { AddButton, FilterButton, RefreshButton } from '@/components/common'
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
  const navigate = useNavigate()
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

  const prevTriggerRef = React.useRef(triggerAdd)

  React.useEffect(() => {
    if (triggerAdd && triggerAdd > 0 && triggerAdd !== prevTriggerRef.current) {
      navigate(isTab ? '/cms/banners/create' : '/marketing/banners/create')
    }
    prevTriggerRef.current = triggerAdd
  }, [triggerAdd, isTab, navigate])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['banners', page, debouncedSearch, perPage, positionFilter, statusFilter],
    queryFn: () => marketingService.getBanners({
      page,
      search: debouncedSearch,
      per_page: perPage,
      position: positionFilter,
      status: statusFilter,
    }),
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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => marketingService.deleteBanner(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banners'] })
      toast.success(t('toast.deleted', { item: t('marketing.banners', 'Banners') }))
      setDeleteTarget(null)
      setSelectedRows((prev) => prev.filter((i) => i !== deleteTarget?.id))
      adjustAfterDelete(1)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error', 'Failed to delete.'))
      setDeleteTarget(null)
    },
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => marketingService.bulkDeleteBanners(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banners'] })
      toast.success(t('marketing.bulkDeleteSuccess', 'Selected banners have been successfully deleted.'))
      const deletedCount = selectedRows.length
      setSelectedRows([])
      setBulkDeleteConfirmOpen(false)
      adjustAfterDelete(deletedCount)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error', 'Failed to delete.'))
      setBulkDeleteConfirmOpen(false)
    }
  })

  const getPositionBadge = (pos: string) => {
    switch (pos) {
      case 'hero':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t('marketing.posHero', 'Hero Banner')}
          </span>
        )
      case 'sidebar':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {t('marketing.posSidebar', 'Sidebar Banner')}
          </span>
        )
      case 'popup':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {t('marketing.posPopup', 'Popup Banner')}
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t('marketing.posFooter', 'Footer Banner')}
          </span>
        )
    }
  }

  return (
    <div className="space-y-5">
      {!isTab && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('marketing.banners', 'Banners')}</h1>
            <p className="text-muted-foreground text-sm">
              {t('common.showing', { from: pagination.from || 0, to: pagination.to || 0, total: pagination.total })}
            </p>
          </div>
          <AddButton
            onClick={() => navigate('/marketing/banners/create')}
            label={t('marketing.addBanner', 'Add New Banner')}
          />
        </div>
      )}

      {/* Bulk Selection Panel (Customer CRM Standard) */}
      <BulkSelectionBanner
        selectedCount={selectedRows.length}
        onDelete={() => setBulkDeleteConfirmOpen(true)}
        onClear={() => setSelectedRows([])}
        deleteLabel={t('common.deleteSelected', 'Delete Selected')}
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
              placeholder={t('marketing.searchPlaceholder', 'Search title, link URL...')}
              className="w-full h-10 pl-10 pr-9 text-xs sm:text-sm rounded-xl border border-border bg-card hover:border-muted-foreground/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all placeholder:text-muted-foreground shadow-xs font-medium"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
                type="button"
                title={t('common.clear', 'Clear')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Global Filter Button */}
          <FilterButton
            onClick={() => setFilterDrawerOpen(true)}
            isActive={positionFilter !== 'all' || statusFilter !== 'all'}
            label={t('common.filter', 'Filter')}
          />

          {/* Reset Filters */}
          <ResetButton onClick={resetAllFilters} />
        </div>

        {/* Action Controls: Refresh & Column Settings */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <RefreshButton
            onClick={() => qc.invalidateQueries({ queryKey: ['banners'] })}
            loading={isFetching}
            title={t('common.refresh', 'Refresh')}
          />

          <ColumnSettingsPopover
            columns={[
              { key: 'preview', label: t('marketing.preview', 'Preview') },
              { key: 'title', label: t('marketing.bannerTitle', 'Banner Title') },
              { key: 'position', label: t('marketing.position', 'Position') },
              { key: 'sortOrder', label: t('marketing.sortOrder', 'Sort Order') },
              { key: 'status', label: t('marketing.activeStatus', 'Status') },
              { key: 'activePeriod', label: t('marketing.activePeriod', 'Active Period') },
              { key: 'actions', label: t('marketing.actions', 'Actions') },
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
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                  <th className="w-10 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={banners.length > 0 && selectedRows.length === banners.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    />
                  </th>
                  {visibleColumns.preview && <th className="px-4 py-3">{t('marketing.preview', 'Preview')}</th>}
                  {visibleColumns.title && <th className="px-4 py-3">{t('marketing.bannerTitle', 'Banner Title')}</th>}
                  {visibleColumns.position && <th className="px-4 py-3">{t('marketing.position', 'Position')}</th>}
                  {visibleColumns.sortOrder && <th className="px-4 py-3 text-center">{t('marketing.sortOrder', 'Sort Order')}</th>}
                  {visibleColumns.status && <th className="px-4 py-3 text-center">{t('marketing.activeStatus', 'Status')}</th>}
                  {visibleColumns.activePeriod && <th className="px-4 py-3">{t('marketing.activePeriod', 'Active Period')}</th>}
                  {visibleColumns.actions && <th className="px-4 py-3 text-right pr-5">{t('marketing.actions', 'Actions')}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {isLoading ? (
                  <LoadingSkeleton rows={5} cols={(Object.values(visibleColumns).filter(Boolean).length || 7) + 1} />
                ) : (
                  banners.map((banner) => (
                    <tr
                      key={banner.id}
                      className={`hover:bg-muted/30 transition-colors group ${
                        selectedRows.includes(banner.id) ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(banner.id)}
                          onChange={(e) => handleSelectRow(banner.id, e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        />
                      </td>

                      {visibleColumns.preview && (
                        <td className="px-4 py-3 align-middle">
                          <div className="w-16 h-10 rounded-xl overflow-hidden border border-border bg-slate-950 flex items-center justify-center shrink-0 shadow-2xs">
                            <img
                              src={getImageUrl(banner.image_url || banner.image)}
                              alt={banner.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = '/logo.png'
                              }}
                            />
                          </div>
                        </td>
                      )}

                      {visibleColumns.title && (
                        <td className="px-4 py-3 align-middle">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                                {banner.title}
                              </span>
                              {banner.badge && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20">
                                  {banner.badge}
                                </span>
                              )}
                              {banner.discount_tag && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                  {banner.discount_tag}
                                </span>
                              )}
                            </div>
                            {banner.subtitle && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {banner.subtitle}
                              </p>
                            )}
                          </div>
                        </td>
                      )}

                      {visibleColumns.position && (
                        <td className="px-4 py-3 align-middle">
                          {getPositionBadge(banner.position)}
                        </td>
                      )}

                      {visibleColumns.sortOrder && (
                        <td className="px-4 py-3 align-middle text-center">
                          <span className="font-mono text-xs font-bold text-muted-foreground bg-muted/60 px-2 py-1 rounded-lg border border-border/60">
                            {banner.sort_order}
                          </span>
                        </td>
                      )}

                      {visibleColumns.status && (
                        <td className="px-4 py-3 align-middle text-center">
                          <StatusBadge
                            status={banner.is_active ? 'active' : 'inactive'}
                          />
                        </td>
                      )}

                      {visibleColumns.activePeriod && (
                        <td className="px-4 py-3 align-middle text-xs text-muted-foreground font-mono">
                          {banner.starts_at || banner.ends_at ? (
                            <span>
                              {banner.starts_at ? new Date(banner.starts_at).toLocaleDateString() : 'Start'}
                              {' → '}
                              {banner.ends_at ? new Date(banner.ends_at).toLocaleDateString() : 'End'}
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium font-sans inline-flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {t('marketing.alwaysActive', 'Always Active')}
                            </span>
                          )}
                        </td>
                      )}

                      {visibleColumns.actions && (
                        <td className="px-4 py-3 align-middle text-right whitespace-nowrap pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => navigate(isTab ? `/cms/banners/${banner.id}/edit` : `/marketing/banners/${banner.id}/edit`)}
                              className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
                              title={t('common.edit', 'Edit')}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(banner)}
                              className="p-2 hover:bg-rose-500/10 rounded-xl text-muted-foreground hover:text-rose-500 transition-all cursor-pointer shadow-2xs"
                              title={t('common.delete', 'Delete')}
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
                      <EmptyState message={t('common.noData', 'No data available')} />
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

      {/* Single Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title={t('marketing.deleteBannerTitle', 'Delete Banner')}
        itemName={deleteTarget?.title}
        confirmText={t('common.delete', 'Delete')}
        cancelText={t('common.cancel', 'Cancel')}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Bulk Delete Dialog */}
      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        title={t('marketing.bulkDeleteBannersTitle', 'Delete Selected Banners')}
        message={t('marketing.confirmBulkDeleteBanners', {
          count: selectedRows.length,
          defaultValue: `Are you sure you want to delete ${selectedRows.length} selected banners? This action cannot be undone.`
        })}
        confirmText={t('common.delete', 'Delete')}
        cancelText={t('common.cancel', 'Cancel')}
        loading={bulkDeleteMutation.isPending}
        onConfirm={() => bulkDeleteMutation.mutate(selectedRows)}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
      />
    </div>
  )
}

export default BannersPage
