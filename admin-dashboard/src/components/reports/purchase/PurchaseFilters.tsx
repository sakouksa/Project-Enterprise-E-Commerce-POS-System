import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Calendar,
  Building2,
  Warehouse,
  Truck,
  RotateCcw,
  RefreshCw,
  Download,
  CheckCircle2,
  ChevronDown,
  Filter,
  DollarSign,
  Tag
} from 'lucide-react'
import api from '@/api/client'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'

export interface PurchaseFilterState {
  date_from?: string
  date_to?: string
  supplier_id?: string
  branch_id?: string
  warehouse_id?: string
  status?: string
  payment_status?: string
  currency_code?: string
  quick_range?: string
}

interface PurchaseFiltersProps {
  filters: PurchaseFilterState
  onChange: (newFilters: PurchaseFilterState) => void
  onExport: (presetRange?: string) => void
  onRefresh: () => void
  isExporting?: boolean
}

export const PurchaseFilters: React.FC<PurchaseFiltersProps> = ({
  filters,
  onChange,
  onExport,
  onRefresh,
  isExporting = false
}) => {
  const { t } = useTranslation('reports')

  const [suppliers, setSuppliers] = useState<any[]>([])
  const [branches, setBranches] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [showExcelMenu, setShowExcelMenu] = useState(false)

  useEffect(() => {
    // Fetch dropdown options
    const fetchOptions = async () => {
      try {
        const [supRes, brRes, whRes] = await Promise.allSettled([
          api.get('/suppliers'),
          api.get('/branches'),
          api.get('/warehouses')
        ])

        if (supRes.status === 'fulfilled' && supRes.value.data?.data) {
          setSuppliers(supRes.value.data.data)
        }
        if (brRes.status === 'fulfilled' && brRes.value.data?.data) {
          setBranches(brRes.value.data.data)
        }
        if (whRes.status === 'fulfilled' && whRes.value.data?.data) {
          setWarehouses(whRes.value.data.data)
        }
      } catch (err) {
        console.error('Failed to load purchase filter options', err)
      }
    }
    fetchOptions()
  }, [])

  const handleQuickRange = (rangeKey: string) => {
    const today = new Date()
    let from = ''
    let to = today.toISOString().split('T')[0]

    if (rangeKey === 'today') {
      from = to
    } else if (rangeKey === 'yesterday') {
      const y = new Date(today)
      y.setDate(y.getDate() - 1)
      from = y.toISOString().split('T')[0]
      to = from
    } else if (rangeKey === 'this_week') {
      const first = today.getDate() - today.getDay()
      const firstDay = new Date(today.setDate(first))
      from = firstDay.toISOString().split('T')[0]
      to = new Date().toISOString().split('T')[0]
    } else if (rangeKey === 'this_month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      from = firstDay.toISOString().split('T')[0]
    } else if (rangeKey === 'last_month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const lastDay = new Date(today.getFullYear(), today.getMonth(), 0)
      from = firstDay.toISOString().split('T')[0]
      to = lastDay.toISOString().split('T')[0]
    } else if (rangeKey === 'this_year') {
      const firstDay = new Date(today.getFullYear(), 0, 1)
      from = firstDay.toISOString().split('T')[0]
    }

    onChange({
      ...filters,
      date_from: from,
      date_to: to,
      quick_range: rangeKey
    })
  }

  const handleReset = () => {
    onChange({
      date_from: '',
      date_to: '',
      supplier_id: '',
      branch_id: '',
      warehouse_id: '',
      status: '',
      payment_status: '',
      currency_code: 'USD',
      quick_range: ''
    })
  }

  // Format options for ModernSelect
  const supplierOptions = [
    { value: '', label: t('purchase.allSuppliers', 'All Suppliers') },
    ...suppliers.map((s) => ({ value: String(s.id), label: s.name }))
  ]

  const branchOptions = [
    { value: '', label: t('purchase.allBranches', 'All Branches') },
    ...branches.map((b) => ({ value: String(b.id), label: b.name }))
  ]

  const warehouseOptions = [
    { value: '', label: t('purchase.allWarehouses', 'All Warehouses') },
    ...warehouses.map((w) => ({ value: String(w.id), label: w.name }))
  ]

  const statusOptions = [
    { value: '', label: t('purchase.allStatus', 'All Statuses') },
    { value: 'received', label: t('purchase.statusReceived', 'Received') },
    { value: 'ordered', label: t('purchase.statusOrdered', 'Ordered') },
    { value: 'partial', label: t('purchase.statusPartial', 'Partial') },
    { value: 'pending', label: t('purchase.statusPending', 'Pending') },
    { value: 'cancelled', label: t('purchase.statusCancelled', 'Cancelled') }
  ]

  return (
    <div className="bg-card border border-border/80 rounded-[24px] p-5 shadow-sm space-y-4">
      {/* Quick Range Pills & Export Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted/40 rounded-xl text-xs font-bold text-muted-foreground mr-1">
            <Filter size={14} className="text-primary" />
            <span>{t('purchase.quickFilters', 'Quick Filters')}</span>
          </div>

          {[
            { key: 'today', label: t('purchase.today', 'Today') },
            { key: 'yesterday', label: t('purchase.yesterday', 'Yesterday') },
            { key: 'this_week', label: t('purchase.thisWeek', 'This Week') },
            { key: 'this_month', label: t('purchase.thisMonth', 'This Month') },
            { key: 'last_month', label: t('purchase.lastMonth', 'Last Month') },
            { key: 'this_year', label: t('purchase.thisYear', 'This Year') }
          ].map((item) => {
            const isActive = filters.quick_range === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleQuickRange(item.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs scale-105'
                    : 'bg-muted/30 hover:bg-muted/70 text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all shadow-2xs active:scale-98 cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>{t('purchase.resetFilters', 'Reset')}</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all shadow-2xs active:scale-98 cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>{t('purchase.refresh', 'Refresh')}</span>
          </button>
        </div>
      </div>

      {/* Main Filter Dropdowns using ModernSelect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Date From */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
            <Calendar size={12} />
            <span>{t('purchase.dateFrom', 'From Date')}</span>
          </label>
          <input
            type="date"
            value={filters.date_from || ''}
            onChange={(e) => onChange({ ...filters, date_from: e.target.value, quick_range: '' })}
            className="w-full h-[34px] px-3 bg-card border border-border/80 rounded-xl text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
          />
        </div>

        {/* Date To */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
            <Calendar size={12} />
            <span>{t('purchase.dateTo', 'To Date')}</span>
          </label>
          <input
            type="date"
            value={filters.date_to || ''}
            onChange={(e) => onChange({ ...filters, date_to: e.target.value, quick_range: '' })}
            className="w-full h-[34px] px-3 bg-card border border-border/80 rounded-xl text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
          />
        </div>

        {/* Supplier */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
            <Truck size={12} />
            <span>{t('purchase.supplier', 'Supplier')}</span>
          </label>
          <ModernSelect
            value={filters.supplier_id || ''}
            onChange={(val) => onChange({ ...filters, supplier_id: val })}
            options={supplierOptions}
            icon={<Truck size={13} />}
            placeholder={t('purchase.allSuppliers', 'All Suppliers')}
            className="w-full"
          />
        </div>

        {/* Branch */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
            <Building2 size={12} />
            <span>{t('purchase.branch', 'Branch')}</span>
          </label>
          <ModernSelect
            value={filters.branch_id || ''}
            onChange={(val) => onChange({ ...filters, branch_id: val })}
            options={branchOptions}
            icon={<Building2 size={13} />}
            placeholder={t('purchase.allBranches', 'All Branches')}
            className="w-full"
          />
        </div>

        {/* Warehouse */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
            <Warehouse size={12} />
            <span>{t('purchase.warehouse', 'Warehouse')}</span>
          </label>
          <ModernSelect
            value={filters.warehouse_id || ''}
            onChange={(val) => onChange({ ...filters, warehouse_id: val })}
            options={warehouseOptions}
            icon={<Warehouse size={13} />}
            placeholder={t('purchase.allWarehouses', 'All Warehouses')}
            className="w-full"
          />
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
            <Tag size={12} />
            <span>{t('purchase.status', 'Purchase Status')}</span>
          </label>
          <ModernSelect
            value={filters.status || ''}
            onChange={(val) => onChange({ ...filters, status: val })}
            options={statusOptions}
            icon={<Tag size={13} />}
            placeholder={t('purchase.allStatus', 'All Statuses')}
            className="w-full"
            align="right"
          />
        </div>
      </div>
    </div>
  )
}

export default PurchaseFilters
