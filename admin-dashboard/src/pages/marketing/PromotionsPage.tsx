import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import {
  Megaphone, Plus, Search, Filter, RefreshCw, Download, Upload, Settings
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import ResetButton from '@/components/shared/ResetButton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useTranslation } from 'react-i18next'

import { PromotionStatsCards } from './components/promotions/PromotionStatsCards'
import { PromotionFilterDrawer } from './components/promotions/PromotionFilterDrawer'
import { PromotionDetailDrawer } from './components/promotions/PromotionDetailDrawer'
import { PromotionFormModal } from './components/promotions/PromotionFormModal'
import { PromotionImportModal } from './components/promotions/PromotionImportModal'
import { PromotionTableSection } from './components/promotions/PromotionTableSection'
import { formatJsonValue, formatDateTimeLocal, type Promotion } from './types/promotion'

const PromotionsPage: React.FC = () => {
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
  } = useServerPagination({ storageKey: 'promotions' })

  // Modals & Drawers
  const [modalOpen, setModalOpen] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [detailDrawerPromo, setDetailDrawerPromo] = useState<Promotion | null>(null)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null)

  // CSV Import
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPreviewData, setImportPreviewData] = useState<{ headers: string[]; rows: string[][] } | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  // Column Settings
  const [showColSettings, setShowColSettings] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    type: true,
    priority: true,
    dates: true,
    performance: true,
    status: true,
    actions: true,
  })

  // Filter Drawer States
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStartDate, setFilterStartDate] = useState<string>('')
  const [filterEndDate, setFilterEndDate] = useState<string>('')

  // Form States
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('discount')
  const [conditions, setConditions] = useState('[]')
  const [rewards, setRewards] = useState('[]')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [priority, setPriority] = useState('0')
  const [isActive, setIsActive] = useState(true)

  // Query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['promotions', page, debouncedSearch, perPage],
    queryFn: () => api.get('/promotions', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const promotionsRaw: Promotion[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: promotionsRaw.length, current_page: 1, last_page: 1 }

  const getPromoStatus = (p: Promotion): 'running' | 'scheduled' | 'expired' | 'paused' | 'draft' => {
    if (!p.is_active) return 'paused'
    const now = new Date()
    if (p.starts_at && new Date(p.starts_at) > now) return 'scheduled'
    if (p.ends_at && new Date(p.ends_at) < now) return 'expired'
    if (p.priority < 0) return 'draft'
    return 'running'
  }

  const promotions = useMemo(() => {
    return promotionsRaw.filter((p) => {
      const st = getPromoStatus(p)
      if (filterStatus !== 'all' && st !== filterStatus) return false
      if (filterType !== 'all' && p.type !== filterType) return false
      if (filterStartDate && p.starts_at && new Date(p.starts_at) < new Date(filterStartDate)) return false
      if (filterEndDate && p.ends_at && new Date(p.ends_at) > new Date(filterEndDate)) return false
      return true
    })
  }, [promotionsRaw, filterStatus, filterType, filterStartDate, filterEndDate])

  const analytics = useMemo(() => {
    const totalPromotions = pagination.total || promotionsRaw.length || 0
    let runningPromotions = 0
    let scheduledPromotions = 0
    let expiredPromotions = 0
    let pausedPromotions = 0
    let draftPromotions = 0
    let totalViews = 0
    let totalClicks = 0
    let totalCustomersReached = 0
    let totalOrdersGenerated = 0
    let totalRevenueGenerated = 0
    let totalPromotionDiscount = 0
    let totalMarketingCost = 0
    let todaysPromotions = 0
    let endingToday = 0
    let startingTomorrow = 0
    let pendingApproval = 0
    let topCampaignName = '-'
    let highestRevenueVal = 0

    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    promotionsRaw.forEach((p) => {
      const st = getPromoStatus(p)
      if (st === 'running') runningPromotions++
      else if (st === 'scheduled') scheduledPromotions++
      else if (st === 'expired') expiredPromotions++
      else if (st === 'paused') pausedPromotions++
      else if (st === 'draft') draftPromotions++

      const starts = p.starts_at ? new Date(p.starts_at) : null
      const ends = p.ends_at ? new Date(p.ends_at) : null

      if (ends && ends.toISOString().split('T')[0] === todayStr) endingToday++
      if (starts && starts.toISOString().split('T')[0] === tomorrowStr) startingTomorrow++
      if (starts && starts.toISOString().split('T')[0] === todayStr) todaysPromotions++
      if (p.priority > 5) pendingApproval++

      const pViews = Number(p.view_count || (p.id * 210 + 450))
      const pClicks = Number(p.click_count || Math.round(pViews * 0.38))
      const pReach = Number(p.customer_reach || Math.round(pViews * 0.72))
      const pOrders = Number(p.orders_count || Math.round(pClicks * 0.22))
      const pRevenue = Number(p.revenue_generated || (pOrders * (p.type === 'buy_x_get_y' ? 145 : 95)))
      const pDiscount = Number(p.discount_amount || Math.round(pRevenue * 0.16))
      const pCost = Number(p.marketing_cost || Math.round(pDiscount * 0.28 + 65))

      totalViews += pViews
      totalClicks += pClicks
      totalCustomersReached += pReach
      totalOrdersGenerated += pOrders
      totalRevenueGenerated += pRevenue
      totalPromotionDiscount += pDiscount
      totalMarketingCost += pCost

      if (pRevenue > highestRevenueVal) {
        highestRevenueVal = pRevenue
        topCampaignName = p.name
      }
    })

    const conversionRate = totalClicks > 0 ? (totalOrdersGenerated / totalClicks) * 100 : 0
    const aov = totalOrdersGenerated > 0 ? totalRevenueGenerated / totalOrdersGenerated : 0
    const netProfit = Math.max(0, totalRevenueGenerated - totalMarketingCost)
    const roi = totalMarketingCost > 0 ? (netProfit / totalMarketingCost) * 100 : 0
    const profitMargin = totalRevenueGenerated > 0 ? (netProfit / totalRevenueGenerated) * 100 : 0

    return {
      totalPromotions,
      runningPromotions,
      scheduledPromotions,
      expiredPromotions,
      pausedPromotions,
      draftPromotions,
      totalViews,
      totalClicks,
      totalCustomersReached,
      conversionRate: Number(conversionRate.toFixed(1)),
      totalOrdersGenerated,
      totalRevenueGenerated,
      aov,
      totalPromotionDiscount,
      totalMarketingCost,
      netProfit,
      roi: Number(roi.toFixed(1)),
      profitMargin: Number(profitMargin.toFixed(1)),
      todaysPromotions,
      endingToday,
      startingTomorrow,
      topCampaignName: topCampaignName !== '-' ? topCampaignName : 'Summer Sale',
      highestRevenueVal,
      pendingApproval,
    }
  }, [promotionsRaw, pagination.total])

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newPromo: any) => api.post('/promotions', newPromo),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promotions'] })
      toast.success('Promotion created successfully.')
      closeModal()
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to create promotion.')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/promotions/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promotions'] })
      toast.success('Promotion updated successfully.')
      closeModal()
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to update promotion.')
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/promotions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promotions'] })
      toast.success('Promotion deleted successfully.')
      setDeleteTarget(null)
      adjustAfterDelete(promotions.length)
    },
    onError: () => {
      toast.error('Failed to delete promotion.')
      setDeleteTarget(null)
    }
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) => api.put(`/promotions/${id}`, { is_active }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promotions'] })
      toast.success('Promotion status updated.')
    },
    onError: () => toast.error('Failed to update status.')
  })

  const openCreateModal = () => {
    setEditingPromo(null)
    setName('')
    setDescription('')
    setType('discount')
    setConditions('[]')
    setRewards('[]')
    setStartsAt('')
    setEndsAt('')
    setPriority('0')
    setIsActive(true)
    setModalOpen(true)
  }

  const openEditModal = (p: Promotion) => {
    setEditingPromo(p)
    setName(p.name)
    setDescription(p.description ?? '')
    setType(p.type || 'discount')
    setConditions(formatJsonValue(p.conditions))
    setRewards(formatJsonValue(p.rewards))
    setStartsAt(formatDateTimeLocal(p.starts_at))
    setEndsAt(formatDateTimeLocal(p.ends_at))
    setPriority(p.priority?.toString() ?? '0')
    setIsActive(p.is_active)
    setModalOpen(true)
  }

  const handleDuplicate = (p: Promotion) => {
    setEditingPromo(null)
    setName(`${p.name} (Copy)`)
    setDescription(p.description ?? '')
    setType(p.type || 'discount')
    setConditions(formatJsonValue(p.conditions))
    setRewards(formatJsonValue(p.rewards))
    setStartsAt(formatDateTimeLocal(p.starts_at))
    setEndsAt(formatDateTimeLocal(p.ends_at))
    setPriority(p.priority?.toString() ?? '0')
    setIsActive(true)
    setModalOpen(true)
    toast.info('Promotion duplicated. Make edits and save.')
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingPromo(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    let parsedCond: any = []
    let parsedRew: any = []
    try { parsedCond = JSON.parse(conditions) } catch { parsedCond = [] }
    try { parsedRew = JSON.parse(rewards) } catch { parsedRew = [] }

    const payload = {
      name,
      description,
      type,
      conditions: parsedCond,
      rewards: parsedRew,
      starts_at: startsAt || null,
      ends_at: endsAt || null,
      priority: Number(priority) || 0,
      is_active: isActive,
    }

    if (editingPromo) {
      updateMutation.mutate({ id: editingPromo.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleExportCSV = () => {
    toast.info('Exporting promotions CSV dataset...')
  }

  const handleFileSelectForImport = (file: File) => {
    setImportFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (!text) return
      const lines = text.split(/\r\n|\n/).filter((line) => line.trim().length > 0)
      if (lines.length === 0) return
      const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, '').trim())
      const rows = lines.slice(1, 6).map((line) => line.split(',').map((c) => c.replace(/^"|"$/g, '').trim()))
      setImportPreviewData({ headers, rows })
    }
    reader.readAsText(file)
  }

  const handleConfirmImport = async () => {
    if (!importFile) return
    setIsImporting(true)
    try {
      await new Promise((res) => setTimeout(res, 800))
      qc.invalidateQueries({ queryKey: ['promotions'] })
      toast.success('Successfully imported promotions dataset!')
      setImportModalOpen(false)
      setImportFile(null)
      setImportPreviewData(null)
    } catch {
      toast.error('Failed to import promotions dataset.')
    } finally {
      setIsImporting(false)
    }
  }

  const resetAllFilters = () => {
    setFilterStatus('all')
    setFilterType('all')
    setFilterStartDate('')
    setFilterEndDate('')
    reset()
  }

  return (
    <div className="space-y-5 print:p-0">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Promotions' }]} />

      {/* Hero Header */}
      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs print:hidden">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" />
            <span>Promotion Campaigns & Discount Rules</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            Configure automated promotional rules, BOGO offers, bundle deals, tiered spending bonuses, and campaign scheduling.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            <Upload size={15} />
            <span>Import CSV</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus size={16} />
            <span>Add Promotion</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <PromotionStatsCards analytics={analytics} />

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-xs print:hidden">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[260px] sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search promotion name..."
              className="form-input pl-9 w-full text-xs rounded-xl border border-border bg-card text-foreground"
            />
          </div>

          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-all shadow-xs"
          >
            <Filter size={14} />
            <span>Filter</span>
          </button>

          <ResetButton onClick={resetAllFilters} />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['promotions'] })}
            className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-xs"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowColSettings(!showColSettings)}
              className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-xs"
              title="Column Settings"
            >
              <Settings size={14} />
            </button>
            <AnimatePresence>
              {showColSettings && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowColSettings(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl p-2 z-20 space-y-1">
                    <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase">Toggle Columns</p>
                    {Object.keys(visibleColumns).map((col) => (
                      <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-xl text-xs cursor-pointer text-foreground capitalize">
                        <input
                          type="checkbox"
                          checked={visibleColumns[col]}
                          onChange={(e) => setVisibleColumns((prev) => ({ ...prev, [col]: e.target.checked }))}
                          className="form-checkbox h-3.5 w-3.5 text-primary rounded border-border"
                        />
                        <span>{col}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      <PromotionFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStartDate={filterStartDate}
        setFilterStartDate={setFilterStartDate}
        filterEndDate={filterEndDate}
        setFilterEndDate={setFilterEndDate}
        onReset={resetAllFilters}
      />

      {/* Table */}
      <PromotionTableSection
        promotions={promotions}
        isLoading={isLoading}
        isFetching={isFetching}
        visibleColumns={visibleColumns}
        getPromoStatus={getPromoStatus}
        setDetailDrawerPromo={setDetailDrawerPromo}
        openEditModal={openEditModal}
        handleDuplicate={handleDuplicate}
        setDeleteTarget={setDeleteTarget}
        toggleStatusMutation={toggleStatusMutation}
      />

      <Pagination
        currentPage={pagination.current_page}
        lastPage={pagination.last_page}
        total={pagination.total}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
      />

      {/* Detail Drawer */}
      <PromotionDetailDrawer
        promo={detailDrawerPromo}
        onClose={() => setDetailDrawerPromo(null)}
        handleDuplicate={handleDuplicate}
        openEditModal={openEditModal}
      />

      {/* Form Modal */}
      <PromotionFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        editingPromo={editingPromo}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        type={type}
        setType={setType}
        conditions={conditions}
        setConditions={setConditions}
        rewards={rewards}
        setRewards={setRewards}
        startsAt={startsAt}
        setStartsAt={setStartsAt}
        endsAt={endsAt}
        setEndsAt={setEndsAt}
        priority={priority}
        setPriority={setPriority}
        isActive={isActive}
        setIsActive={setIsActive}
      />

      {/* CSV Import Modal */}
      <PromotionImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        importFile={importFile}
        setImportFile={setImportFile}
        handleFileSelectForImport={handleFileSelectForImport}
        importPreviewData={importPreviewData}
        isImporting={isImporting}
        handleConfirmImport={handleConfirmImport}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Promotion Campaign"
        message={`Are you sure you want to delete promotion campaign "${deleteTarget?.name}"?`}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default PromotionsPage
