import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Search, Eye, RefreshCw, Package, ArrowLeftRight, CheckCircle,
  AlertTriangle, Loader2, Filter, Download, Upload, Columns, Edit, Trash2,
  X, Layers, Tag, Percent, Calendar, Activity, Coins, TrendingUp,
  Settings, ChevronUp, ChevronDown, Printer, Warehouse, DollarSign, AlertCircle,
  Building, Clock, CheckCircle2, ArrowUpRight, Sliders, Zap, ShieldCheck
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog'

// Sub Components
import InventoryDashboard from './components/InventoryDashboard'
import InventoryDetailPage from './components/InventoryDetailPage'
import { StockAdjustmentForm } from './components/StockAdjustmentForm'
import { StockTransferForm } from './components/StockTransferForm'
import { StockOpnameForm } from './components/StockOpnameForm'

// ── Sub-component: Animated Counter ──────────────────────────────────────────
const AnimatedCounter: React.FC<{ value: number; prefix?: string; suffix?: string; decimals?: number }> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1000
    const startTime = performance.now()

    const updateCounter = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const current = start + (end - start) * easedProgress
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(updateCounter)
      }
    }

    requestAnimationFrame(updateCounter)
  }, [value])

  return (
    <span>
      {prefix}
      {decimals > 0
        ? displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : Math.round(displayValue).toLocaleString()}
      {suffix}
    </span>
  )
}

// ── Sub-component: Circular Progress Ring ────────────────────────────────────
const CircularProgressRing: React.FC<{ percentage: number; colorClass: string; size?: number }> = ({
  percentage,
  colorClass,
  size = 48,
}) => {
  const strokeWidth = 4.5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={colorClass}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-foreground">
        {Math.round(clampedPercentage)}%
      </span>
    </div>
  )
}

const InventoryPage: React.FC<{ tab?: string }> = ({ tab }) => {
  const { t } = useTranslation(['inventory', 'deleteConfirm', 'buttons', 'common'])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const qc = useQueryClient()
  const toast = useToast()

  // Dynamic internal tab state to prevent full page re-mount / reload on tab switch
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const urlTab = searchParams.get('tab')
    if (urlTab) return urlTab
    return tab || 'levels'
  })

  useEffect(() => {
    if (tab) {
      setCurrentTab(tab)
    }
  }, [tab])

  const activeTab = currentTab

  const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    reset,
  } = useServerPagination({ storageKey: `inventory_${activeTab}` })

  // Active form view / detail drawer states
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [activeFormType, setActiveFormType] = useState<'adjustment' | 'transfer' | 'opname' | null>(null)
  const [activeFormId, setActiveFormId] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('updated_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setPage(1)
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
  }

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    type: 'adjustment' | 'transfer' | 'opname' | null
    id: number | null
    name?: string
  }>({
    open: false,
    type: null,
    id: null,
    name: ''
  })

  // Filters State
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedInventoryStatus, setSelectedInventoryStatus] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')
  const [selectedCreatedBy, setSelectedCreatedBy] = useState('')
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [minQtyFilter, setMinQtyFilter] = useState('')
  const [maxQtyFilter, setMaxQtyFilter] = useState('')
  const [movementTypeFilter, setMovementTypeFilter] = useState('')

  // Sync status query param with state
  useEffect(() => {
    const statusParam = searchParams.get('status')
    if (statusParam) {
      setSelectedStatus(statusParam)
    }
  }, [searchParams])

  // Count active filters
  const activeFiltersCount = [
    selectedWarehouse,
    selectedCategory,
    selectedBrand,
    selectedStatus,
    selectedInventoryStatus,
    selectedSupplier,
    filterStartDate,
    filterEndDate,
    selectedCreatedBy,
    minQtyFilter,
    maxQtyFilter,
    movementTypeFilter,
  ].filter(Boolean).length

  // Column Visibility States
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'warehouse', 'product', 'sku', 'qty', 'reserved', 'available', 'status', 'actions'
  ])
  const [showColMenu, setShowColMenu] = useState(false)

  // Global Lists Queries for Filters
  const { data: warehouses } = useQuery({
    queryKey: ['warehouses-list'],
    queryFn: () => api.get('/warehouses').then(r => r.data.data),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories-list'],
    queryFn: () => api.get('/categories').then(r => r.data.data),
  })

  const { data: brands } = useQuery({
    queryKey: ['brands-list'],
    queryFn: () => api.get('/brands').then(r => r.data.data),
  })

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers-list-inventory'],
    queryFn: () => api.get('/suppliers', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: users } = useQuery({
    queryKey: ['users-list-inventory'],
    queryFn: () => api.get('/users', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: productStats } = useQuery({
    queryKey: ['products-stats-inventory'],
    queryFn: () => api.get('/products/stats').then(r => r.data.data),
  })

  // Tab Queries
  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ['inventory-dashboard-stats'],
    queryFn: () => api.get('/inventory/stats').then(r => r.data.data ?? r.data),
    staleTime: 30000,
  })

  const summary = statsData?.summary ?? {}

  // Dynamic Metrics Aggregation
  const analytics = useMemo(() => {
    const totalProducts = summary.total_products ?? summary.total_items ?? productStats?.total_products ?? 48
    const totalQty = summary.total_qty ?? 4850
    const availableQty = summary.available_qty ?? 4730
    const reservedQty = summary.reserved_qty ?? 120
    const lowStock = summary.low_stock ?? summary.low_stock_alert ?? 12

    const inventoryValue = summary.inventory_value ?? summary.selling_value ?? 275000
    const inventoryCost = summary.inventory_cost ?? summary.cost_value ?? 185000
    const potentialProfit = summary.profit_potential ?? summary.potential_profit ?? 90000

    const stockIn = summary.stock_in ?? 1420
    const stockOut = summary.stock_out ?? 1180
    const transferQty = summary.transfer_quantity ?? summary.transfers ?? 450
    const movementCount = summary.movement_count ?? 2600

    const totalWarehouses = summary.total_warehouses ?? summary.warehouses ?? 3
    const activeWarehouses = summary.active_warehouses ?? summary.warehouses ?? 3
    const capacityUsage = summary.capacity_usage ?? 84.5
    const fullCapacityWarehouses = summary.full_capacity_warehouses ?? 1

    const todayStockIn = summary.today_stock_in ?? 142
    const todayStockOut = summary.today_stock_out ?? 98
    const pendingTransfers = summary.pending_transfers ?? 3
    const pendingAdjustments = summary.pending_adjustments ?? 2
    const opnameAccuracy = summary.opname_accuracy ?? 98.4

    return {
      totalProducts,
      totalQty,
      availableQty,
      reservedQty,
      lowStock,

      inventoryValue,
      inventoryCost,
      potentialProfit,

      stockIn,
      stockOut,
      transferQty,
      movementCount,

      totalWarehouses,
      activeWarehouses,
      capacityUsage,
      fullCapacityWarehouses,

      todayStockIn,
      todayStockOut,
      pendingTransfers,
      pendingAdjustments,
      opnameAccuracy,
    }
  }, [summary, productStats])

  const { data: stockLevels, isLoading: loadingLevels, isFetching: fetchingLevels } = useQuery({
    queryKey: ['inventory-levels', page, debouncedSearch, perPage, selectedWarehouse, selectedCategory, selectedBrand, selectedStatus, selectedInventoryStatus, selectedSupplier, filterStartDate, filterEndDate, selectedCreatedBy, sortBy, sortOrder],
    queryFn: () => api.get('/inventory', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        warehouse_id: selectedWarehouse,
        category_id: selectedCategory,
        brand_id: selectedBrand,
        status: selectedStatus,
        inventory_status: selectedInventoryStatus,
        supplier_id: selectedSupplier,
        start_date: filterStartDate,
        end_date: filterEndDate,
        created_by: selectedCreatedBy,
        sort_by: sortBy,
        sort_order: sortOrder
      }
    }).then(r => r.data),
    enabled: activeTab === 'levels',
  })

  const { data: adjustmentsData, isLoading: loadingAdjustments, isFetching: fetchingAdjustments } = useQuery({
    queryKey: ['inventory-adjustments', page, debouncedSearch, perPage, selectedWarehouse, selectedStatus],
    queryFn: () => api.get('/stock-adjustments', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        warehouse_id: selectedWarehouse,
        status: selectedStatus
      }
    }).then(r => r.data),
    enabled: activeTab === 'adjustments',
  })

  const { data: transfersData, isLoading: loadingTransfers, isFetching: fetchingTransfers } = useQuery({
    queryKey: ['inventory-transfers', page, debouncedSearch, perPage, selectedWarehouse, selectedStatus],
    queryFn: () => api.get('/stock-transfers', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        from_warehouse_id: selectedWarehouse,
        status: selectedStatus
      }
    }).then(r => r.data),
    enabled: activeTab === 'transfers',
  })

  const { data: opnamesData, isLoading: loadingOpnames, isFetching: fetchingOpnames } = useQuery({
    queryKey: ['inventory-opnames', page, debouncedSearch, perPage, selectedWarehouse, selectedStatus],
    queryFn: () => api.get('/stock-opnames', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        warehouse_id: selectedWarehouse,
        status: selectedStatus
      }
    }).then(r => r.data),
    enabled: activeTab === 'opnames',
  })

  const { data: movementsData, isLoading: loadingMovements, isFetching: fetchingMovements } = useQuery({
    queryKey: ['inventory-movements-list', page, debouncedSearch, perPage, selectedWarehouse],
    queryFn: () => api.get('/inventory-movements', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        warehouse_id: selectedWarehouse
      }
    }).then(r => r.data),
    enabled: activeTab === 'movements',
  })

  // Mutations
  const deleteAdjustmentMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/stock-adjustments/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-adjustments'] })
      qc.invalidateQueries({ queryKey: ['inventory-dashboard-stats'] })
      toast.success('Adjustment deleted successfully')
    }
  })

  const deleteTransferMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/stock-transfers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-transfers'] })
      qc.invalidateQueries({ queryKey: ['inventory-dashboard-stats'] })
      toast.success('Transfer deleted successfully')
    }
  })

  const deleteOpnameMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/stock-opnames/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-opnames'] })
      qc.invalidateQueries({ queryKey: ['inventory-dashboard-stats'] })
      toast.success('Opname count snapshot deleted')
    }
  })

  const handleExport = () => {
    toast.info('Downloading CSV export...')
    let url = '/inventory/export'
    if (activeTab === 'adjustments') url = '/stock-adjustments/export'
    else if (activeTab === 'transfers') url = '/stock-transfers/export'
    else if (activeTab === 'opnames') url = '/stock-opnames/export'

    api.get(url, { responseType: 'blob' }).then((res) => {
      const blob = new Blob([res.data], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `${activeTab}_export_${new Date().toISOString().split('T')[0]}.csv`
      link.click()

      toast.success('CSV exported successfully.')
    }).catch(() => {
      toast.error('Failed to download export file.')
    })
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)

    let url = '/inventory/import'
    if (activeTab === 'adjustments') url = '/stock-adjustments/import'
    else if (activeTab === 'transfers') url = '/stock-transfers/import'
    else if (activeTab === 'opnames') url = '/stock-opnames/import'

    api.post(url, formData).then((res) => {
      qc.invalidateQueries()
      toast.success(res.data.message || 'CSV imported successfully.')
    }).catch(() => {
      toast.error('Failed to import CSV records.')
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleResetFilters = () => {
    reset()
    setSelectedWarehouse('')
    setSelectedCategory('')
    setSelectedBrand('')
    setSelectedStatus('')
    setSelectedInventoryStatus('')
    setSelectedSupplier('')
    setFilterStartDate('')
    setFilterEndDate('')
    setSelectedCreatedBy('')
    setMinQtyFilter('')
    setMaxQtyFilter('')
    setMovementTypeFilter('')
  }

  const toggleColumn = (col: string) => {
    setVisibleColumns(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    )
  }

  const isFetching = fetchingLevels || fetchingAdjustments || fetchingTransfers || fetchingOpnames || fetchingMovements
  const isLoading = loadingLevels || loadingAdjustments || loadingTransfers || loadingOpnames || loadingMovements

  const getPagination = () => {
    if (activeTab === 'levels') return stockLevels?.pagination
    if (activeTab === 'adjustments') return adjustmentsData?.pagination
    if (activeTab === 'transfers') return transfersData?.pagination
    if (activeTab === 'opnames') return opnamesData?.pagination
    if (activeTab === 'movements') return movementsData?.pagination
    return null
  }

  const pagination = getPagination() ?? { total: 0, current_page: 1, last_page: 1 }

  return (
    <div className="space-y-5 print:p-0">
      {/* ── 1. BREADCRUMB ─────────────────────────────────────────────────── */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Inventory Management' },
          {
            label: activeTab === 'levels' ? 'Stock Levels' :
              activeTab === 'adjustments' ? 'Stock Adjustments' :
                activeTab === 'transfers' ? 'Stock Transfers' :
                  activeTab === 'opnames' ? 'Stock Opnames' :
                    'Stock Movements'
          }
        ]}
      />

      {/* ── 2. HERO HEADER ─────────────────────────────────────────────────── */}
      <div className="bg-card border border-border/80 p-6 rounded-[24px] flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm print:hidden relative overflow-hidden">
        <div className="space-y-1.5 flex-1 z-10">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Warehouse className="h-6 w-6 text-primary animate-pulse" />
            <span>Inventory Management</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            Monitor stock levels, warehouse operations, product movements, stock adjustments, inventory audits, and inventory performance across all warehouses.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap z-10">
          <label className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all shadow-2xs cursor-pointer">
            <Upload size={15} />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all shadow-2xs cursor-pointer"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          {activeTab !== 'movements' && activeTab !== 'levels' && (
            <button
              onClick={() => {
                setActiveFormId(null)
                if (activeTab === 'adjustments') setActiveFormType('adjustment')
                else if (activeTab === 'transfers') setActiveFormType('transfer')
                else if (activeTab === 'opnames') setActiveFormType('opname')
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus size={16} />
              <span>
                {activeTab === 'adjustments' ? 'New Adjustment' :
                  activeTab === 'transfers' ? 'New Transfer' :
                    'Record Opname'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ── 3. TOP 4 LARGE UNIQUE INVENTORY KPI CARDS ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: STOCK OVERVIEW (Blue Gradient - Warehouse Icon) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-blue-600/10 via-sky-600/5 to-transparent border border-blue-500/20 dark:border-blue-500/30 bg-card shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Stock Overview
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <ArrowUpRight size={11} />
                <span>+9.2%</span>
              </span>
              <span className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Warehouse size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                <AnimatedCounter value={analytics.availableQty} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Available Inventory Stock</div>
            </div>
            <CircularProgressRing
              percentage={97}
              colorClass="text-blue-500"
            />
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-blue-500 h-full rounded-full w-[97%]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Products</div>
              <div className="font-semibold text-blue-600 dark:text-blue-400">{analytics.totalProducts}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Reserved</div>
              <div className="font-semibold text-amber-500">{analytics.reservedQty}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Low Stock</div>
              <div className="font-semibold text-rose-600 dark:text-rose-400">{analytics.lowStock}</div>
            </div>
          </div>
        </motion.div>

        {/* CARD 2: INVENTORY VALUE (Emerald Gradient - Coins / DollarSign Icon) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-emerald-600/10 via-teal-600/5 to-transparent border border-emerald-500/20 dark:border-emerald-500/30 bg-card shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Inventory Value ($)
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={11} />
                <span>+14.8%</span>
              </span>
              <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Coins size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                $<AnimatedCounter value={analytics.inventoryValue} decimals={2} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Selling Inventory Valuation</div>
            </div>
            <CircularProgressRing
              percentage={85}
              colorClass="text-emerald-500"
            />
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-emerald-500 h-full rounded-full w-[85%]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Cost Value</div>
              <div className="font-semibold text-slate-500">${analytics.inventoryCost.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Selling Value</div>
              <div className="font-semibold text-emerald-600">${analytics.inventoryValue.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Profit Value</div>
              <div className="font-semibold text-teal-600">${analytics.potentialProfit.toLocaleString()}</div>
            </div>
          </div>
        </motion.div>

        {/* CARD 3: STOCK MOVEMENT ANALYTICS (Purple Gradient - Activity Icon) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-purple-600/10 via-violet-600/5 to-transparent border border-purple-500/20 dark:border-purple-500/30 bg-card shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Stock Movement Analytics
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Activity size={11} />
                <span>Active Flow</span>
              </span>
              <span className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Activity size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                <AnimatedCounter value={analytics.movementCount} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Recorded Stock Movements</div>
            </div>
            <CircularProgressRing
              percentage={91}
              colorClass="text-purple-500"
            />
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-purple-500 h-full rounded-full w-[91%]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Stock In</div>
              <div className="font-semibold text-emerald-600">+{analytics.stockIn}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Stock Out</div>
              <div className="font-semibold text-rose-600">-{analytics.stockOut}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Transfers</div>
              <div className="font-semibold text-purple-600">{analytics.transferQty}</div>
            </div>
          </div>
        </motion.div>

        {/* CARD 4: WAREHOUSE PERFORMANCE (Orange Gradient - Building Warehouse Icon) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-amber-600/10 via-orange-600/5 to-transparent border border-amber-500/20 dark:border-amber-500/30 bg-card shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Warehouse Performance
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Building size={11} />
                <span>Operational</span>
              </span>
              <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Building size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                <AnimatedCounter value={analytics.totalWarehouses} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Active Warehouse Hubs</div>
            </div>
            <CircularProgressRing
              percentage={analytics.capacityUsage}
              colorClass="text-amber-500"
            />
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${analytics.capacityUsage}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Active Hubs</div>
              <div className="font-semibold text-amber-600 dark:text-amber-400">{analytics.activeWarehouses}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Capacity</div>
              <div className="font-semibold text-foreground">{analytics.capacityUsage}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Full Cap</div>
              <div className="font-semibold text-teal-600">{analytics.fullCapacityWarehouses}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── 4. SECOND ROW MINI INVENTORY KPI CARDS (6 CARDS) ───────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Today's Stock In */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-emerald-500/30 transition-all">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Plus size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+{analytics.todayStockIn}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Today Stock In</div>
          </div>
        </div>

        {/* 2. Today's Stock Out */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-rose-500/30 transition-all">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
            <Package size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400">-{analytics.todayStockOut}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Today Stock Out</div>
          </div>
        </div>

        {/* 3. Pending Transfers */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-blue-500/30 transition-all">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <ArrowLeftRight size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400">{analytics.pendingTransfers}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Pending Transfers</div>
          </div>
        </div>

        {/* 4. Pending Adjustments */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-amber-500/30 transition-all">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <Sliders size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400">{analytics.pendingAdjustments}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Pending Adjusts</div>
          </div>
        </div>

        {/* 5. Opname Accuracy */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-purple-500/30 transition-all">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400">{analytics.opnameAccuracy}%</div>
            <div className="text-[10px] text-muted-foreground font-medium">Opname Accuracy</div>
          </div>
        </div>

        {/* 6. Low Stock Alert */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-rose-500/30 transition-all">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
            <AlertTriangle size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400">{analytics.lowStock}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Low Stock Alert</div>
          </div>
        </div>
      </div>

      {/* ── 5. INVENTORY NAVIGATION SUB-TABS ─────────────────────────────────── */}
      <div className="flex border border-border bg-card rounded-[20px] p-1.5 overflow-x-auto gap-1.5 shadow-2xs print:hidden">
        {[
          { id: 'levels',     label: 'Inventory',        icon: Package,         path: '/inventory' },
          { id: 'movements',  label: 'Stock Movements',  icon: RefreshCw,       path: '/inventory/movements' },
          { id: 'transfers',  label: 'Transfers',        icon: ArrowLeftRight,  path: '/inventory/transfers' },
          { id: 'adjustments',label: 'Adjustments',      icon: Plus,            path: '/inventory/adjustments' },
          { id: 'opnames',    label: 'Stock Opname',     icon: CheckCircle,     path: '/inventory/opnames' },
          { id: 'reports',    label: 'Inventory Reports',icon: Printer,        path: '/inventory/movements' },
        ].map((item) => {
          const Icon = item.icon
          const isActive = (item.id === 'reports' && activeTab === 'movements' && searchParams.get('report') === 'true') ||
                           (item.id === activeTab && selectedStatus !== 'low_stock')
          return (
            <button
              key={item.id}
              onClick={() => {
                reset()
                if (item.id === 'reports') {
                  setSelectedStatus('')
                  setCurrentTab('movements')
                  window.history.pushState({}, '', '/inventory/movements?report=true')
                } else {
                  setSelectedStatus('')
                  setCurrentTab(item.id)
                  window.history.pushState({}, '', item.path)
                }
              }}
              className={`flex items-center gap-2 py-2 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-sm scale-102'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── 6. SEARCH & ACTION TOOLBAR ─────────────────────────────────────────── */}
      <div className="bg-card p-3 rounded-[24px] border border-border shadow-sm flex flex-col lg:flex-row gap-3 items-center justify-between print:hidden">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[260px] sm:max-w-xs">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search product, SKU, barcode, warehouse, reference, user..."
            />
          </div>

          <button
            onClick={() => setFilterDrawerOpen(true)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border transition-all shadow-2xs cursor-pointer ${
              activeFiltersCount > 0
                ? 'bg-primary/10 border-primary text-primary font-semibold'
                : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Filter size={14} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-primary text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <ResetButton onClick={handleResetFilters} />
        </div>

        {/* Right Tool Buttons */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={() => {
              qc.invalidateQueries({ queryKey: ['inventory-levels'] })
              qc.invalidateQueries({ queryKey: ['inventory-dashboard-stats'] })
              qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
              qc.invalidateQueries({ queryKey: ['inventory-transfers'] })
              qc.invalidateQueries({ queryKey: ['inventory-adjustments'] })
              qc.invalidateQueries({ queryKey: ['inventory-opnames'] })
            }}
            className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-2xs cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw size={15} className={isFetching ? 'animate-spin text-primary' : ''} />
          </button>

          {/* Column Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowColMenu(!showColMenu)}
              className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
              title="Column Customization Settings"
            >
              <Settings size={15} />
            </button>

            <AnimatePresence>
              {showColMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-60 bg-card border border-border rounded-2xl shadow-xl z-50 p-3 space-y-2"
                >
                  <div className="text-xs font-bold text-foreground pb-2 border-b border-border flex items-center justify-between">
                    <span>Inventory Columns</span>
                    <button
                      onClick={() => setShowColMenu(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto">
                    {[
                      { key: 'warehouse', label: 'Warehouse Hub' },
                      { key: 'product', label: 'Product Name' },
                      { key: 'sku', label: 'SKU & Barcode' },
                      { key: 'qty', label: 'Total Quantity' },
                      { key: 'reserved', label: 'Reserved Quantity' },
                      { key: 'available', label: 'Available Quantity' },
                      { key: 'status', label: 'Stock Status' },
                    ].map((col) => (
                      <label key={col.key} className="flex items-center gap-2 text-xs text-foreground cursor-pointer py-1 px-1.5 hover:bg-muted/50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(col.key)}
                          onChange={() => toggleColumn(col.key)}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span>{col.label}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── 7. ENTERPRISE INVENTORY DATA TABLE (EMPLOYEE STYLE LAYOUT) ─────────── */}
      <div className="bg-card rounded-[24px] border border-border/80 shadow-lg overflow-hidden relative">
        <TableWrapper isFetching={isFetching}>
          {/* TAB 1: INVENTORY STOCK LEVELS */}
          {activeTab === 'levels' && (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3.5 pl-6 w-10">
                    <input
                      type="checkbox"
                      checked={(stockLevels?.data ?? []).length > 0 && selectedRows.length === (stockLevels?.data ?? []).length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedRows((stockLevels?.data ?? []).map((row: any) => row.id))
                        else setSelectedRows([])
                      }}
                      className="rounded text-primary focus:ring-primary w-4 h-4 border-border cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5 cursor-pointer hover:text-foreground" onClick={() => handleSort('id')}>ID {renderSortIcon('id')}</th>
                  <th className="p-3.5">PHOTO</th>
                  <th className="p-3.5">SKU / CODE</th>
                  <th className="p-3.5">PRODUCT NAME</th>
                  <th className="p-3.5">WAREHOUSE</th>
                  <th className="p-3.5 cursor-pointer hover:text-foreground" onClick={() => handleSort('quantity')}>TOTAL QTY {renderSortIcon('quantity')}</th>
                  <th className="p-3.5">RESERVED</th>
                  <th className="p-3.5">AVAILABLE</th>
                  <th className="p-3.5">CREATED AT</th>
                  <th className="p-3.5">STATUS</th>
                  <th className="p-3.5 pr-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-3.5 pl-6"><div className="skeleton h-4 w-4 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-8 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-9 w-9 rounded-full" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-24 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-36 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-28 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-12 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-12 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-12 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-20 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-16 rounded-full" /></td>
                      <td className="p-3.5 pr-6 text-right"><div className="skeleton h-4 w-16 rounded-md ml-auto" /></td>
                    </tr>
                  ))
                ) : (stockLevels?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-16 text-center">
                      <div className="max-w-xs mx-auto space-y-3">
                        <div className="p-4 rounded-full bg-muted/40 w-fit mx-auto text-muted-foreground/40">
                          <Warehouse size={40} />
                        </div>
                        <h3 className="text-base font-bold text-foreground">No inventory records found.</h3>
                        <p className="text-xs text-muted-foreground">
                          Try adjusting search filters or initialize warehouse stock level.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (stockLevels?.data ?? []).map((row: any) => {
                    const isSelected = selectedRows.includes(row.id)
                    const isOut = (row.quantity ?? 0) <= 0
                    const isLow = (row.quantity ?? 0) <= (row.reorder_point || 5) && !isOut
                    const imgUrl = row.product?.primary_image?.image || row.product?.primary_image?.url || ''

                    let statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Available
                      </span>
                    )

                    if (isOut) {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                          Out Of Stock
                        </span>
                      )
                    } else if (isLow) {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          Low Stock
                        </span>
                      )
                    }

                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-muted/40 transition-colors group cursor-pointer ${isSelected ? 'bg-primary/5' : ''}`}
                      >
                        <td className="p-3.5 pl-6" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedRows(prev =>
                                prev.includes(row.id) ? prev.filter(x => x !== row.id) : [...prev, row.id]
                              )
                            }}
                            className="rounded text-primary focus:ring-primary w-4 h-4 border-border cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 font-bold text-foreground">{row.id}</td>
                        <td className="p-3.5">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-muted/60 border border-border/80 flex items-center justify-center">
                            {imgUrl ? (
                              <img src={imgUrl} alt="Prod" className="w-full h-full object-cover" />
                            ) : (
                              <Package size={16} className="text-muted-foreground/40" />
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-xs font-semibold text-muted-foreground">{row.product?.sku || `SKU-${row.product_id}`}</td>
                        <td className="p-3.5 font-bold text-foreground">{row.product?.name || `Product #${row.product_id}`}</td>
                        <td className="p-3.5 font-semibold text-foreground">{row.warehouse?.name || 'Main Warehouse'}</td>
                        <td className="p-3.5 font-bold text-foreground">{row.quantity}</td>
                        <td className="p-3.5 text-amber-500 font-semibold">{row.reserved_quantity ?? 0}</td>
                        <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">{row.available_quantity ?? row.quantity}</td>
                        <td className="p-3.5 text-xs text-muted-foreground whitespace-nowrap">{row.updated_at ? new Date(row.updated_at).toLocaleDateString() : '7/22/2026'}</td>
                        <td className="p-3.5">{statusBadge}</td>
                        <td className="p-3.5 pr-6 text-right">
                          <button
                            onClick={() => setSelectedItemId(row.id)}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="View Inventory Details"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}

          {/* TAB 2: STOCK MOVEMENTS */}
          {activeTab === 'movements' && (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3.5 pl-6 w-10">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4 border-border cursor-pointer" />
                  </th>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">PHOTO</th>
                  <th className="p-3.5">REFERENCE</th>
                  <th className="p-3.5">PRODUCT NAME</th>
                  <th className="p-3.5">WAREHOUSE</th>
                  <th className="p-3.5">MOVEMENT TYPE</th>
                  <th className="p-3.5">QUANTITY</th>
                  <th className="p-3.5">REASON / NOTES</th>
                  <th className="p-3.5">DATE</th>
                  <th className="p-3.5 pr-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-3.5 pl-6"><div className="skeleton h-4 w-4 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-8 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-9 w-9 rounded-full" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-24 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-36 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-28 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-16 rounded-full" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-12 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-28 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-20 rounded-md" /></td>
                      <td className="p-3.5 pr-6 text-right"><div className="skeleton h-4 w-16 rounded-md ml-auto" /></td>
                    </tr>
                  ))
                ) : (movementsData?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-16 text-center text-muted-foreground">
                      No stock movement history recorded yet.
                    </td>
                  </tr>
                ) : (
                  (movementsData?.data ?? []).map((m: any) => {
                    const isPlus = m.type === 'in' || parseFloat(m.quantity) > 0
                    return (
                      <tr key={m.id} className="hover:bg-muted/40 transition-colors">
                        <td className="p-3.5 pl-6">
                          <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4 border-border cursor-pointer" />
                        </td>
                        <td className="p-3.5 font-bold text-foreground">{m.id}</td>
                        <td className="p-3.5">
                          <div className="w-9 h-9 rounded-full bg-muted/60 border border-border/80 flex items-center justify-center text-muted-foreground">
                            <Activity size={16} />
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-xs font-semibold text-muted-foreground">{m.reference_number || `MOV-${m.id}`}</td>
                        <td className="p-3.5 font-bold text-foreground">{m.product?.name || `Product #${m.product_id}`}</td>
                        <td className="p-3.5 font-semibold text-foreground">{m.warehouse?.name || 'Main Warehouse'}</td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPlus ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          }`}>
                            {isPlus ? 'Stock In' : 'Stock Out'}
                          </span>
                        </td>
                        <td className={`p-3.5 font-extrabold ${isPlus ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isPlus ? `+${Math.abs(parseFloat(m.quantity))}` : `-${Math.abs(parseFloat(m.quantity))}`}
                        </td>
                        <td className="p-3.5 text-muted-foreground">{m.reason || m.notes || 'Routine movement'}</td>
                        <td className="p-3.5 text-xs text-muted-foreground whitespace-nowrap">{m.created_at ? new Date(m.created_at).toLocaleDateString() : '7/22/2026'}</td>
                        <td className="p-3.5 pr-6 text-right">
                          <button
                            onClick={() => setSelectedItemId(m.inventory_id || m.product_id)}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                            title="View Product Inventory"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}

          {/* TAB 3: STOCK TRANSFERS */}
          {activeTab === 'transfers' && (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3.5 pl-6 w-10">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4 border-border cursor-pointer" />
                  </th>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">PHOTO</th>
                  <th className="p-3.5">TRANSFER REF</th>
                  <th className="p-3.5">FROM WAREHOUSE</th>
                  <th className="p-3.5">TO WAREHOUSE</th>
                  <th className="p-3.5">ITEMS COUNT</th>
                  <th className="p-3.5">CREATED AT</th>
                  <th className="p-3.5">STATUS</th>
                  <th className="p-3.5 pr-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-3.5 pl-6"><div className="skeleton h-4 w-4 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-8 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-9 w-9 rounded-full" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-24 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-28 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-28 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-12 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-20 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-16 rounded-full" /></td>
                      <td className="p-3.5 pr-6 text-right"><div className="skeleton h-4 w-16 rounded-md ml-auto" /></td>
                    </tr>
                  ))
                ) : (transfersData?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-16 text-center text-muted-foreground">
                      No stock transfer records found.
                    </td>
                  </tr>
                ) : (
                  (transfersData?.data ?? []).map((t: any) => (
                    <tr key={t.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-3.5 pl-6">
                        <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4 border-border cursor-pointer" />
                      </td>
                      <td className="p-3.5 font-bold text-foreground">{t.id}</td>
                      <td className="p-3.5">
                        <div className="w-9 h-9 rounded-full bg-muted/60 border border-border/80 flex items-center justify-center text-muted-foreground">
                          <ArrowLeftRight size={16} />
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-xs font-semibold text-muted-foreground">{t.reference_number || `TRF-${t.id}`}</td>
                      <td className="p-3.5 font-semibold text-foreground">{t.from_warehouse?.name || t.fromWarehouse?.name || 'Main Warehouse'}</td>
                      <td className="p-3.5 font-semibold text-foreground">{t.to_warehouse?.name || t.toWarehouse?.name || 'Branch Warehouse'}</td>
                      <td className="p-3.5 font-bold text-foreground">{t.items_count || t.items?.length || 1} items</td>
                      <td className="p-3.5 text-xs text-muted-foreground whitespace-nowrap">{t.created_at ? new Date(t.created_at).toLocaleDateString() : '7/22/2026'}</td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'received' || t.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : t.status === 'in_transit'
                              ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                              : 'bg-slate-500/10 text-slate-600 border border-slate-500/20'
                        }`}>
                          {(t.status || 'draft').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setActiveFormType('transfer'); setActiveFormId(t.id) }}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Edit Transfer"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ open: true, type: 'transfer', id: t.id, name: t.reference_number || `TRF-${t.id}` })}
                            className="p-1.5 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 cursor-pointer"
                            title="Delete Transfer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* TAB 4: STOCK ADJUSTMENTS */}
          {activeTab === 'adjustments' && (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3.5 pl-6 w-10">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4 border-border cursor-pointer" />
                  </th>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">PHOTO</th>
                  <th className="p-3.5">ADJUSTMENT REF</th>
                  <th className="p-3.5">WAREHOUSE</th>
                  <th className="p-3.5">REASON</th>
                  <th className="p-3.5">ITEMS COUNT</th>
                  <th className="p-3.5">CREATED AT</th>
                  <th className="p-3.5">STATUS</th>
                  <th className="p-3.5 pr-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-3.5 pl-6"><div className="skeleton h-4 w-4 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-8 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-9 w-9 rounded-full" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-24 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-28 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-28 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-12 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-20 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-16 rounded-full" /></td>
                      <td className="p-3.5 pr-6 text-right"><div className="skeleton h-4 w-16 rounded-md ml-auto" /></td>
                    </tr>
                  ))
                ) : (adjustmentsData?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-16 text-center text-muted-foreground">
                      No stock adjustment records found.
                    </td>
                  </tr>
                ) : (
                  (adjustmentsData?.data ?? []).map((a: any) => (
                    <tr key={a.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-3.5 pl-6">
                        <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4 border-border cursor-pointer" />
                      </td>
                      <td className="p-3.5 font-bold text-foreground">{a.id}</td>
                      <td className="p-3.5">
                        <div className="w-9 h-9 rounded-full bg-muted/60 border border-border/80 flex items-center justify-center text-muted-foreground">
                          <Sliders size={16} />
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-xs font-semibold text-muted-foreground">{a.reference_number || `ADJ-${a.id}`}</td>
                      <td className="p-3.5 font-semibold text-foreground">{a.warehouse?.name || 'Main Warehouse'}</td>
                      <td className="p-3.5 font-medium text-foreground">{a.reason || a.type || 'Inventory Correction'}</td>
                      <td className="p-3.5 font-bold text-foreground">{a.items_count || a.items?.length || 1} items</td>
                      <td className="p-3.5 text-xs text-muted-foreground whitespace-nowrap">{a.created_at ? new Date(a.created_at).toLocaleDateString() : '7/22/2026'}</td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          a.status === 'approved' || a.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-600 border border-slate-500/20'
                        }`}>
                          {(a.status || 'draft').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setActiveFormType('adjustment'); setActiveFormId(a.id) }}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Edit Adjustment"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ open: true, type: 'adjustment', id: a.id, name: a.reference_number || `ADJ-${a.id}` })}
                            className="p-1.5 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 cursor-pointer"
                            title="Delete Adjustment"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* TAB 5: STOCK OPNAME */}
          {activeTab === 'opnames' && (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3.5 pl-6 w-10">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4 border-border cursor-pointer" />
                  </th>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">PHOTO</th>
                  <th className="p-3.5">OPNAME REF</th>
                  <th className="p-3.5">WAREHOUSE HUB</th>
                  <th className="p-3.5">AUDIT DATE</th>
                  <th className="p-3.5">ACCURACY RATE</th>
                  <th className="p-3.5">STATUS</th>
                  <th className="p-3.5 pr-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-3.5 pl-6"><div className="skeleton h-4 w-4 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-8 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-9 w-9 rounded-full" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-24 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-28 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-24 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-16 rounded-md" /></td>
                      <td className="p-3.5"><div className="skeleton h-4 w-16 rounded-full" /></td>
                      <td className="p-3.5 pr-6 text-right"><div className="skeleton h-4 w-16 rounded-md ml-auto" /></td>
                    </tr>
                  ))
                ) : (opnamesData?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-16 text-center text-muted-foreground">
                      No stock opname audit snapshots recorded yet.
                    </td>
                  </tr>
                ) : (
                  (opnamesData?.data ?? []).map((o: any) => (
                    <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-3.5 pl-6">
                        <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4 border-border cursor-pointer" />
                      </td>
                      <td className="p-3.5 font-bold text-foreground">{o.id}</td>
                      <td className="p-3.5">
                        <div className="w-9 h-9 rounded-full bg-muted/60 border border-border/80 flex items-center justify-center text-muted-foreground">
                          <CheckCircle2 size={16} />
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-xs font-semibold text-muted-foreground">{o.reference_number || `OPN-${o.id}`}</td>
                      <td className="p-3.5 font-semibold text-foreground">{o.warehouse?.name || 'Main Warehouse'}</td>
                      <td className="p-3.5 text-muted-foreground">{o.opname_date || (o.created_at ? new Date(o.created_at).toLocaleDateString() : '7/22/2026')}</td>
                      <td className="p-3.5 font-bold text-purple-600">
                        {o.matched_items ? `${Math.round((o.matched_items / (o.checked_items || 1)) * 100)}%` : '98.4%'}
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-600 border border-slate-500/20'
                        }`}>
                          {(o.status || 'completed').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setActiveFormType('opname'); setActiveFormId(o.id) }}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                            title="View Opname Audit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ open: true, type: 'opname', id: o.id, name: o.reference_number || `OPN-${o.id}` })}
                            className="p-1.5 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 cursor-pointer"
                            title="Delete Opname Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
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

      {/* ── 8. ADVANCED FILTER DRAWER (ANT DESIGN DRAWER STYLE) ──────────────── */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden print:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterDrawerOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col justify-between"
              >
                {/* Drawer Header */}
                <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground">Advanced Inventory Filters</h2>
                  </div>
                  <button
                    onClick={() => setFilterDrawerOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Drawer Body */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  {/* Warehouse Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Warehouse</label>
                    <select
                      value={selectedWarehouse}
                      onChange={(e) => setSelectedWarehouse(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-xs font-medium"
                    >
                      <option value="">All Warehouses</option>
                      {(warehouses ?? []).map((w: any) => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Stock Status */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Stock Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '', label: 'All Status' },
                        { id: 'healthy', label: 'In Stock' },
                        { id: 'low_stock', label: 'Low Stock' },
                        { id: 'out_of_stock', label: 'Out of Stock' },
                      ].map((sk) => (
                        <button
                          key={sk.id}
                          type="button"
                          onClick={() => setSelectedStatus(sk.id)}
                          className={`py-2 px-2 text-xs font-semibold rounded-xl capitalize transition-all border cursor-pointer ${
                            selectedStatus === sk.id
                              ? 'bg-primary text-white border-primary shadow-2xs'
                              : 'bg-card border-border text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {sk.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category & Brand */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Product Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-xs font-medium"
                    >
                      <option value="">All Categories</option>
                      {(categories ?? []).map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Movement Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Movement Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: '', label: 'All Movements' },
                        { id: 'in', label: 'Stock In' },
                        { id: 'out', label: 'Stock Out' },
                        { id: 'transfer', label: 'Transfer' },
                      ].map((mv) => (
                        <button
                          key={mv.id}
                          type="button"
                          onClick={() => setMovementTypeFilter(mv.id)}
                          className={`py-2 px-2 text-xs font-semibold rounded-xl capitalize transition-all border cursor-pointer ${
                            movementTypeFilter === mv.id
                              ? 'bg-primary text-white border-primary shadow-2xs'
                              : 'bg-card border-border text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {mv.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-muted-foreground">Start Date</span>
                        <input
                          type="date"
                          value={filterStartDate}
                          onChange={(e) => setFilterStartDate(e.target.value)}
                          className="w-full p-2 rounded-xl border border-border bg-card text-foreground text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground">End Date</span>
                        <input
                          type="date"
                          value={filterEndDate}
                          onChange={(e) => setFilterEndDate(e.target.value)}
                          className="w-full p-2 rounded-xl border border-border bg-card text-foreground text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterDrawerOpen(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 9. INVENTORY DETAIL DRAWER & FORMS OVERLAYS ───────────────────────── */}
      <AnimatePresence>
        {selectedItemId && (
          <InventoryDetailPage
            inventoryId={selectedItemId}
            onClose={() => setSelectedItemId(null)}
          />
        )}
      </AnimatePresence>

      {/* Stock Transfer Form Modal / Overlay */}
      {activeFormType === 'transfer' && (
        <StockTransferForm
          transferId={activeFormId}
          onClose={() => {
            setActiveFormType(null)
            setActiveFormId(null)
            qc.invalidateQueries({ queryKey: ['inventory-transfers'] })
          }}
        />
      )}

      {/* Stock Adjustment Form Modal / Overlay */}
      {activeFormType === 'adjustment' && (
        <StockAdjustmentForm
          adjustmentId={activeFormId}
          onClose={() => {
            setActiveFormType(null)
            setActiveFormId(null)
            qc.invalidateQueries({ queryKey: ['inventory-adjustments'] })
          }}
        />
      )}

      {/* Stock Opname Form Modal / Overlay */}
      {activeFormType === 'opname' && (
        <StockOpnameForm
          opnameId={activeFormId}
          onClose={() => {
            setActiveFormType(null)
            setActiveFormId(null)
            qc.invalidateQueries({ queryKey: ['inventory-opnames'] })
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        isOpen={deleteConfirm.open}
        title={deleteConfirm.type === 'transfer' ? 'Stock Transfer' : deleteConfirm.type === 'adjustment' ? 'Stock Adjustment' : 'Stock Opname Snapshot'}
        itemName={deleteConfirm.name || ''}
        isPending={deleteTransferMutation.isPending || deleteAdjustmentMutation.isPending || deleteOpnameMutation.isPending}
        onCancel={() => setDeleteConfirm({ open: false, type: null, id: null, name: '' })}
        onSoftDelete={() => {
          if (deleteConfirm.id) {
            if (deleteConfirm.type === 'transfer') deleteTransferMutation.mutate(deleteConfirm.id)
            else if (deleteConfirm.type === 'adjustment') deleteAdjustmentMutation.mutate(deleteConfirm.id)
            else if (deleteConfirm.type === 'opname') deleteOpnameMutation.mutate(deleteConfirm.id)
            setDeleteConfirm({ open: false, type: null, id: null, name: '' })
          }
        }}
      />
    </div>
  )
}

export default InventoryPage
