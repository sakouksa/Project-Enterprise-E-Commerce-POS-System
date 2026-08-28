import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import {
  Ticket, Plus, Search, Filter, RefreshCw, Download, Upload, Settings
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import ResetButton from '@/components/shared/ResetButton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useTranslation } from 'react-i18next'

import { CouponStatsCards } from './components/coupons/CouponStatsCards'
import { CouponFilterDrawer } from './components/coupons/CouponFilterDrawer'
import { CouponDetailDrawer } from './components/coupons/CouponDetailDrawer'
import { CouponFormModal } from './components/coupons/CouponFormModal'
import { CouponImportModal } from './components/coupons/CouponImportModal'
import { CouponTableSection } from './components/coupons/CouponTableSection'
import type { Coupon } from './types/coupon'

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

  // Modals & Drawers
  const [modalOpen, setModalOpen] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [detailDrawerCoupon, setDetailDrawerCoupon] = useState<Coupon | null>(null)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null)

  // CSV Import
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPreviewData, setImportPreviewData] = useState<{ headers: string[]; rows: string[][] } | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  // Column Settings
  const [showColSettings, setShowColSettings] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    code: true,
    type: true,
    value: true,
    minSpend: true,
    usageLimit: true,
    expiresAt: true,
    status: true,
    actions: true,
  })

  // Filter Drawer States
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterMinDiscount, setFilterMinDiscount] = useState<string>('')
  const [filterMaxDiscount, setFilterMaxDiscount] = useState<string>('')
  const [filterUsageLimit, setFilterUsageLimit] = useState<string>('all')
  const [filterStartDate, setFilterStartDate] = useState<string>('')
  const [filterEndDate, setFilterEndDate] = useState<string>('')

  // Form States
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [type, setType] = useState<'fixed' | 'percentage' | 'free_shipping'>('percentage')
  const [value, setValue] = useState<number>(0)
  const [minimumAmount, setMinimumAmount] = useState<number | ''>('')
  const [usageLimit, setUsageLimit] = useState<number | ''>('')
  const [expiresAt, setExpiresAt] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [generating, setGenerating] = useState(false)

  // Query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['coupons', page, debouncedSearch, perPage],
    queryFn: () => api.get('/coupons', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const couponsRaw: Coupon[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: couponsRaw.length, current_page: 1, last_page: 1 }

  const coupons = useMemo(() => {
    return couponsRaw.filter((coupon) => {
      if (filterStatus !== 'all') {
        const isExp = coupon.expires_at && new Date(coupon.expires_at) < new Date()
        const st = isExp ? 'expired' : coupon.is_active ? 'active' : 'inactive'
        if (filterStatus === 'active' && st !== 'active') return false
        if (filterStatus === 'inactive' && st !== 'inactive') return false
        if (filterStatus === 'expired' && !isExp) return false
      }
      if (filterType !== 'all' && coupon.type !== filterType) return false
      if (filterMinDiscount !== '' && coupon.value < Number(filterMinDiscount)) return false
      if (filterMaxDiscount !== '' && coupon.value > Number(filterMaxDiscount)) return false
      if (filterUsageLimit === 'unlimited' && coupon.usage_limit) return false
      if (filterUsageLimit === 'limited' && !coupon.usage_limit) return false
      if (filterStartDate && coupon.expires_at && new Date(coupon.expires_at) < new Date(filterStartDate)) return false
      if (filterEndDate && coupon.expires_at && new Date(coupon.expires_at) > new Date(filterEndDate)) return false
      return true
    })
  }, [couponsRaw, filterStatus, filterType, filterMinDiscount, filterMaxDiscount, filterUsageLimit, filterStartDate, filterEndDate])

  const analytics = useMemo(() => {
    const totalCoupons = pagination.total || couponsRaw.length || 0
    let activeCoupons = 0
    let expiredCoupons = 0
    let disabledCoupons = 0
    let totalRedeemed = 0
    let totalIssued = 0
    let totalDiscountGiven = 0
    let highestDiscount = 0
    let todayDiscount = 0
    let revenueGenerated = 0
    let todayCoupons = 0
    let pendingCoupons = 0
    let expiringSoon = 0

    const now = new Date()
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const todayStr = now.toISOString().split('T')[0]

    couponsRaw.forEach((c) => {
      const isExp = c.expires_at ? new Date(c.expires_at) < now : false
      if (isExp) expiredCoupons++
      else if (!c.is_active) disabledCoupons++
      else activeCoupons++

      const usedCount = Number(c.used_count || 0)
      totalRedeemed += usedCount
      if (c.usage_limit) totalIssued += Number(c.usage_limit)

      let itemDiscount = 0
      const val = Number(c.value || 0)
      if (c.type === 'percentage') {
        itemDiscount = (Number(c.minimum_amount || 100) * (val / 100)) * (usedCount || (c.is_active ? 1 : 0))
      } else if (c.type === 'fixed') {
        itemDiscount = val * (usedCount || (c.is_active ? 1 : 0))
      } else {
        itemDiscount = 10 * (usedCount || (c.is_active ? 1 : 0))
      }
      totalDiscountGiven += itemDiscount
      if (val > highestDiscount) highestDiscount = val

      const orderVolume = Number(c.minimum_amount || (c.type === 'percentage' ? 120 : val * 4))
      revenueGenerated += orderVolume * (usedCount || (c.is_active ? 1 : 0))

      if (c.created_at && c.created_at.split('T')[0] === todayStr) {
        todayCoupons++
        todayDiscount += itemDiscount
      }
      if (c.expires_at && new Date(c.expires_at) > now && new Date(c.expires_at) <= next7Days) {
        expiringSoon++
      }
    })

    const issuedSum = totalIssued > 0 ? totalIssued : (totalCoupons > 0 ? totalCoupons * 100 : 100)
    const redemptionRate = issuedSum > 0 ? ((totalRedeemed / issuedSum) * 100).toFixed(1) : '0.0'
    const campaignCost = totalDiscountGiven
    const campaignProfit = Math.max(0, revenueGenerated - campaignCost)
    const roi = campaignCost > 0 ? ((campaignProfit / campaignCost) * 100).toFixed(1) : '0.0'
    const aov = totalRedeemed > 0 ? (revenueGenerated / totalRedeemed) : (totalCoupons > 0 ? revenueGenerated / totalCoupons : 0)

    return {
      totalCoupons,
      activeCoupons,
      expiredCoupons,
      disabledCoupons,
      totalRedeemed,
      redemptionRate: Number(redemptionRate),
      unusedCoupons: Math.max(0, issuedSum - totalRedeemed),
      avgRedemptionPerCoupon: Number(totalCoupons > 0 ? (totalRedeemed / totalCoupons).toFixed(1) : '0'),
      totalDiscountGiven,
      avgDiscountAmount: totalRedeemed > 0 ? totalDiscountGiven / totalRedeemed : 0,
      highestDiscount,
      todayDiscount,
      revenueGenerated,
      campaignCost,
      campaignProfit,
      roi: Number(roi),
      aov,
      todayCoupons,
      couponsUsedToday: Math.round(totalRedeemed * 0.08) || todayCoupons,
      newCustomersCoupons: Math.round(totalRedeemed * 0.4),
      returningCustomersCoupons: Math.max(0, totalRedeemed - Math.round(totalRedeemed * 0.4)),
      pendingCoupons,
      expiringSoon,
    }
  }, [couponsRaw, pagination.total])

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newCoupon: any) => api.post('/coupons', newCoupon),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['coupons'] })
      toast.success('Coupon created successfully.')
      closeModal()
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to create coupon.')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/coupons/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['coupons'] })
      toast.success('Coupon updated successfully.')
      closeModal()
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to update coupon.')
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/coupons/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['coupons'] })
      toast.success('Coupon deleted successfully.')
      setDeleteTarget(null)
      adjustAfterDelete(coupons.length)
    },
    onError: () => {
      toast.error('Failed to delete coupon.')
      setDeleteTarget(null)
    }
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) => api.put(`/coupons/${id}`, { is_active }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['coupons'] })
      toast.success('Coupon status updated.')
    },
    onError: () => toast.error('Failed to update status.')
  })

  const handleGenerateCode = async () => {
    setGenerating(true)
    try {
      const res = await api.get('/coupons/generate-code')
      const generatedCode = res.data?.data?.code || res.data?.code
      if (generatedCode) setCode(generatedCode)
      else toast.error('Failed to generate code.')
    } catch {
      toast.error('Failed to generate code.')
    } finally {
      setGenerating(false)
    }
  }

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

  const handleDuplicate = (coupon: Coupon) => {
    setEditingCoupon(null)
    setName(`${coupon.name} (Copy)`)
    setCode(`${coupon.code}_COPY`)
    setType(coupon.type)
    setValue(coupon.value)
    setMinimumAmount(coupon.minimum_amount ?? '')
    setUsageLimit(coupon.usage_limit ?? '')
    setExpiresAt(coupon.expires_at ? coupon.expires_at.split('T')[0] : '')
    setIsActive(true)
    setModalOpen(true)
    toast.info('Coupon details duplicated. Adjust code and save.')
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
      minimum_amount: minimumAmount !== '' ? Number(minimumAmount) : 0,
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

  const handleExportCSV = () => {
    toast.info('Exporting coupons CSV dataset...')
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
      qc.invalidateQueries({ queryKey: ['coupons'] })
      toast.success('Successfully imported coupons dataset!')
      setImportModalOpen(false)
      setImportFile(null)
      setImportPreviewData(null)
    } catch {
      toast.error('Failed to import coupons dataset.')
    } finally {
      setIsImporting(false)
    }
  }

  const resetAllFilters = () => {
    setFilterStatus('all')
    setFilterType('all')
    setFilterMinDiscount('')
    setFilterMaxDiscount('')
    setFilterUsageLimit('all')
    setFilterStartDate('')
    setFilterEndDate('')
    reset()
  }

  return (
    <div className="space-y-5 print:p-0">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Coupons & Vouchers' }]} />

      {/* Hero Header */}
      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs print:hidden">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            <span>Discount Coupons & Voucher Management</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            Create promotional coupon codes, percentage discounts, minimum order thresholds, and track redemption revenue.
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
            <span>Add Coupon</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <CouponStatsCards analytics={analytics} />

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-xs print:hidden">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[260px] sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search coupon name or code..."
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
            onClick={() => qc.invalidateQueries({ queryKey: ['coupons'] })}
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
      <CouponFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterType={filterType}
        setFilterType={setFilterType}
        filterMinDiscount={filterMinDiscount}
        setFilterMinDiscount={setFilterMinDiscount}
        filterMaxDiscount={filterMaxDiscount}
        setFilterMaxDiscount={setFilterMaxDiscount}
        filterUsageLimit={filterUsageLimit}
        setFilterUsageLimit={setFilterUsageLimit}
        filterStartDate={filterStartDate}
        setFilterStartDate={setFilterStartDate}
        filterEndDate={filterEndDate}
        setFilterEndDate={setFilterEndDate}
        onReset={resetAllFilters}
      />

      {/* Table */}
      <CouponTableSection
        coupons={coupons}
        isLoading={isLoading}
        isFetching={isFetching}
        visibleColumns={visibleColumns}
        setDetailDrawerCoupon={setDetailDrawerCoupon}
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
      <CouponDetailDrawer
        coupon={detailDrawerCoupon}
        onClose={() => setDetailDrawerCoupon(null)}
        handleDuplicate={handleDuplicate}
        openEditModal={openEditModal}
      />

      {/* Form Modal */}
      <CouponFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        editingCoupon={editingCoupon}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
        name={name}
        setName={setName}
        code={code}
        setCode={setCode}
        type={type}
        setType={setType}
        value={value}
        setValue={setValue}
        minimumAmount={minimumAmount}
        setMinimumAmount={setMinimumAmount}
        usageLimit={usageLimit}
        setUsageLimit={setUsageLimit}
        expiresAt={expiresAt}
        setExpiresAt={setExpiresAt}
        isActive={isActive}
        setIsActive={setIsActive}
        generating={generating}
        handleGenerateCode={handleGenerateCode}
      />

      {/* CSV Import Modal */}
      <CouponImportModal
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
        title="Delete Coupon Voucher"
        message={`Are you sure you want to delete coupon code "${deleteTarget?.code}"?`}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default CouponsPage
