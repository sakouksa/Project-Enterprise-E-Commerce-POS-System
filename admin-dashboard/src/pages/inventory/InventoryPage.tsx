import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Search, Eye, RefreshCw, Package, ArrowLeftRight, CheckCircle,
  AlertTriangle, Loader2, Filter, Download, Upload, Columns, Edit, Trash2,
  X, Layers, Tag, Percent, Calendar,
  Settings, ChevronUp, ChevronDown, Printer, Warehouse, DollarSign, AlertCircle
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
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'

// Sub Components
import InventoryDashboard from './components/InventoryDashboard'
import InventoryDetailPage from './components/InventoryDetailPage'
import StockAdjustmentForm from './components/StockAdjustmentForm'
import StockTransferForm from './components/StockTransferForm'
import StockOpnameForm from './components/StockOpnameForm'

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
  }>({
    open: false,
    type: null,
    id: null
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
    selectedCreatedBy
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
    queryKey: ['inventory-stats'],
    queryFn: () => api.get('/inventory/stats').then(r => r.data.data),
  })

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

  // Dynamic Real Financial & Inventory Metrics Calculation
  const realMetrics = useMemo(() => {
    const summary = statsData?.summary

    let val = summary?.inventory_value ?? 0
    let cost = summary?.inventory_cost ?? 0
    let totalQty = summary?.total_qty ?? 0
    let availQty = summary?.available_qty ?? 0
    let resvQty = summary?.reserved_qty ?? 0
    let lowStock = summary?.low_stock ?? 0
    let outOfStock = summary?.out_of_stock ?? 0

    // If stockLevels list is loaded and we have filtered list items, dynamically calculate real totals from items:
    if (stockLevels?.data && Array.isArray(stockLevels.data) && stockLevels.data.length > 0) {
      let calcVal = 0
      let calcCost = 0
      let calcQty = 0
      let calcAvail = 0
      let calcResv = 0
      let calcLow = 0
      let calcOut = 0

      stockLevels.data.forEach((item: any) => {
        const qty = Number(item.quantity ?? item.stock ?? 0)
        const avail = Number(item.available_quantity ?? qty)
        const resv = Number(item.reserved_quantity ?? 0)
        const price = Number(item.product?.selling_price ?? item.selling_price ?? item.price ?? 0)
        const itemCost = Number(item.product?.cost_price ?? item.cost_price ?? item.cost ?? 0)
        const reorderPoint = Number(item.reorder_point ?? item.product?.reorder_point ?? 5)

        calcQty += qty
        calcAvail += avail
        calcResv += resv
        calcVal += qty * price
        calcCost += qty * itemCost

        if (qty <= 0) calcOut++
        else if (qty <= reorderPoint) calcLow++
      })

      if (!val || val === 0 || selectedWarehouse || selectedCategory || selectedBrand || selectedStatus) {
        val = calcVal
        cost = calcCost
        totalQty = calcQty
        availQty = calcAvail
        resvQty = calcResv
        lowStock = calcLow
        outOfStock = calcOut
      }
    }

    return {
      inventoryValue: val,
      inventoryCost: cost,
      totalQty,
      availableQty: availQty,
      reservedQty: resvQty,
      lowStock,
      outOfStock
    }
  }, [statsData, stockLevels, selectedWarehouse, selectedCategory, selectedBrand, selectedStatus])

  // Bulk / Operations Mutations
  const deleteAdjustmentMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/stock-adjustments/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-adjustments'] })
      toast.success('Adjustment deleted successfully')
    }
  })

  const deleteTransferMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/stock-transfers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-transfers'] })
      toast.success('Transfer deleted successfully')
    }
  })

  const deleteOpnameMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/stock-opnames/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-opnames'] })
      toast.success('Opname count snapshot deleted')
    }
  })

  const handleExport = () => {
    toast.info('Downloading...')
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
      
      const tabNames: Record<string, string> = {
        levels: 'Inventory stock levels',
        adjustments: 'Stock adjustments',
        transfers: 'Stock transfers',
        opnames: 'Stock opname',
        movements: 'Stock movements'
      }
      const label = tabNames[activeTab] || activeTab
      toast.success(`${label} exported successfully.`)
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

  const getStatusOptions = () => {
    if (activeTab === 'levels') {
      return [
        { value: '', label: t('inventory.all_statuses', 'All Statuses'), activeClass: 'bg-muted border-primary text-foreground', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
        { value: 'low_stock', label: t('inventory.low_stock', 'Low Stock'), activeClass: 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
        { value: 'out_of_stock', label: t('inventory.out_of_stock', 'Out of Stock'), activeClass: 'bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
        { value: 'overstock', label: t('inventory.overstock', 'Overstock'), activeClass: 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
        { value: 'healthy', label: t('inventory.healthy_stock', 'Healthy Stock'), activeClass: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
      ]
    }
    if (activeTab === 'transfers') {
      return [
        { value: '', label: t('inventory.all_statuses', 'All Statuses'), activeClass: 'bg-muted border-primary text-foreground', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
        { value: 'draft', label: t('common.draft'), activeClass: 'bg-slate-500/10 border-slate-500/40 text-slate-600 dark:text-slate-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
        { value: 'in_transit', label: t('inventory.in_transit', 'In Transit'), activeClass: 'bg-blue-500/10 border-blue-500/40 text-blue-600 dark:text-blue-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
        { value: 'received', label: t('inventory.received', 'Received'), activeClass: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
        { value: 'cancelled', label: t('inventory.cancelled', 'Cancelled'), activeClass: 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
      ]
    }
    return [
      { value: '', label: t('inventory.all_statuses', 'All Statuses'), activeClass: 'bg-muted border-primary text-foreground', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
      { value: 'draft', label: t('common.draft'), activeClass: 'bg-slate-500/10 border-slate-500/40 text-slate-600 dark:text-slate-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
      { value: 'approved', label: t('inventory.approved', 'Approved / Done'), activeClass: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
      { value: 'cancelled', label: t('inventory.cancelled', 'Cancelled'), activeClass: 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
    ]
  }

  // Sub form workspaces are rendered as slide-out drawers at the bottom of the layout

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: t('inventory.title', 'Inventory') },
          {
            label: activeTab === 'levels' ? t('inventory.stockLevels', 'Stock Levels') :
              activeTab === 'adjustments' ? t('inventory.adjustments', 'Stock Adjustments') :
                activeTab === 'transfers' ? t('inventory.transfers', 'Stock Transfers') :
                  activeTab === 'opnames' ? t('inventory.stockOpname', 'Stock Opnames') :
                    t('inventory.stockLedger', 'Stock Ledger')
          }
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Warehouse className="h-6 w-6 text-primary" />
            {t('inventory.title', 'Inventory Management')}
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            {t('inventory.description', 'Manage inventory levels, warehouse stock, inventory movements, transfers, stock adjustments, stock opname, and inventory valuation across all warehouses.')}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab !== 'movements' && activeTab !== 'levels' && (
            <button
              onClick={() => {
                if (activeTab === 'adjustments') setActiveFormType('adjustment')
                else if (activeTab === 'transfers') setActiveFormType('transfer')
                else if (activeTab === 'opnames') setActiveFormType('opname')
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus size={16} />
              {activeTab === 'adjustments' ? t('New Adjustment', 'New Adjustment') :
                activeTab === 'transfers' ? t('New Transfer', 'New Transfer') :
                  t('Record Opname', 'Record Opname')}
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Products */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('inventory.totalProducts', 'Total Products')}</p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">{statsData?.summary?.total_items ?? productStats?.total_products ?? 0}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="text-emerald-500 font-bold">{productStats?.active_products ?? 0} {t('common.active', 'Active')}</span>
              <span>•</span>
              <span>{productStats?.inactive_products ?? 0} {t('common.inactive', 'Inactive')}</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500">
            <Package size={22} />
          </div>
        </motion.div>

        {/* Card 2: Warehouse Stock */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('inventory.warehouseStock', 'Warehouse Stock')}</p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">{realMetrics.totalQty.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-500 font-bold">{realMetrics.availableQty.toLocaleString()} {t('inventory.available', 'Avail')}</span>
              <span>•</span>
              <span className="text-amber-500 font-bold">{realMetrics.reservedQty.toLocaleString()} {t('inventory.reserved', 'Resv')}</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
            <Warehouse size={22} />
          </div>
        </motion.div>

        {/* Card 3: Low Stock Alert */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('inventory.lowStockAlert', 'Low Stock Alert')}</p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">{realMetrics.lowStock}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-rose-500 font-bold">{realMetrics.outOfStock} {t('inventory.outOfStock', 'Out')}</span>
              <span>•</span>
              <span className="font-semibold text-amber-500">{realMetrics.lowStock + realMetrics.outOfStock} {t('inventory.reorderRequired', 'Reorder')}</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-500">
            <AlertTriangle size={22} />
          </div>
        </motion.div>

        {/* Card 4: Inventory Value */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('inventory.inventoryValue', 'Inventory Value')}</p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              ${realMetrics.inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {t('inventory.costPrice', 'Cost')}: ${realMetrics.inventoryCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <DollarSign size={22} />
          </div>
        </motion.div>
      </div>

      {/* Mini Cards Second Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase">{t('inventory.movementsToday', 'Movements Today')}</span>
          <span className="text-lg font-extrabold text-foreground mt-1">{(movementsData?.pagination?.total ?? 0)}</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-emerald-600 font-semibold uppercase">{t('inventory.stockInToday', 'Stock In Today')}</span>
          <span className="text-lg font-extrabold text-emerald-500 mt-1">
            {movementsData?.data?.filter((m: any) => parseFloat(m.quantity) > 0).reduce((acc: number, cur: any) => acc + parseFloat(cur.quantity), 0) ?? 0}
          </span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-rose-500 font-semibold uppercase">{t('inventory.stockOutToday', 'Stock Out Today')}</span>
          <span className="text-lg font-extrabold text-rose-500 mt-1">
            {Math.abs(movementsData?.data?.filter((m: any) => parseFloat(m.quantity) < 0).reduce((acc: number, cur: any) => acc + parseFloat(cur.quantity), 0) ?? 0)}
          </span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-blue-500 font-semibold uppercase">{t('inventory.pendingTransfers', 'Pending Transfers')}</span>
          <span className="text-lg font-extrabold text-blue-500 mt-1">
            {transfersData?.data?.filter((t: any) => t.status === 'draft' || t.status === 'in_transit').length ?? 0}
          </span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs col-span-2 md:col-span-1">
          <span className="text-[10px] text-amber-500 font-semibold uppercase">{t('inventory.pendingAdjustments', 'Pending Adjusts')}</span>
          <span className="text-lg font-extrabold text-amber-500 mt-1">
            {adjustmentsData?.data?.filter((a: any) => a.status === 'draft').length ?? 0}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border border-border bg-card rounded-2xl p-1 overflow-x-auto gap-1 shadow-sm">
        {[
          { id: 'levels', label: t('inventory.tab_inventory', 'Inventory'), icon: <Package size={15} />, path: '/inventory' },
          { id: 'movements', label: t('inventory.tab_movements', 'Stock Movements'), icon: <RefreshCw size={15} />, path: '/inventory/movements' },
          { id: 'transfers', label: t('inventory.tab_transfers', 'Transfers'), icon: <ArrowLeftRight size={15} />, path: '/inventory/transfers' },
          { id: 'adjustments', label: t('inventory.tab_adjustments', 'Adjustments'), icon: <Plus size={15} />, path: '/inventory/adjustments' },
          { id: 'opnames', label: t('inventory.tab_opname', 'Stock Opname'), icon: <CheckCircle size={15} />, path: '/inventory/opnames' },
          // { id: 'low_stock', label: t('inventory.tab_low_stock', 'Low Stock'), icon: <AlertTriangle size={15} />, path: '/inventory?status=low_stock' },
          { id: 'reports', label: t('inventory.tab_reports', 'Inventory Reports'), icon: <Printer size={15} />, path: '/inventory/movements' },
        ].map(item => {
          const isActive = (item.id === 'low_stock' && selectedStatus === 'low_stock') ||
                           (item.id === 'reports' && activeTab === 'movements' && searchParams.get('report') === 'true') ||
                           (item.id === activeTab && selectedStatus !== 'low_stock');
          return (
            <button
              key={item.id}
              onClick={() => {
                reset();
                if (item.id === 'low_stock') {
                  setSelectedStatus('low_stock');
                  setCurrentTab('levels');
                  window.history.pushState({}, '', '/inventory?status=low_stock');
                } else if (item.id === 'reports') {
                  setSelectedStatus('');
                  setCurrentTab('movements');
                  window.history.pushState({}, '', '/inventory/movements?report=true');
                } else {
                  setSelectedStatus('');
                  setCurrentTab(item.id);
                  window.history.pushState({}, '', item.path);
                }
              }}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer
                          ${isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Premium Search & Filter Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-sm">
        {/* Left side: Search & Advanced Filter Toggle & Reset */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[260px] sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('inventory.searchPlaceholder', 'Search Product, SKU, Barcode, Warehouse...')}
              className="form-input pl-9 w-full text-xs rounded-xl border border-border bg-card text-foreground"
            />
          </div>
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border transition-all duration-200 shadow-sm
                       ${activeFiltersCount > 0 
                         ? 'bg-primary/10 border-primary/30 text-primary font-semibold' 
                         : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <Filter size={14} className={activeFiltersCount > 0 ? 'text-primary' : 'text-muted-foreground'} />
            <span>{t('common.filter', 'Filter')}</span>
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-primary text-white rounded-full leading-none">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <ResetButton onClick={handleResetFilters} label={t("common.reset", "Reset")} />
        </div>

        {/* Right side: Actions (Refresh, Print, Column settings, Import/Export) */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={() => {
              qc.invalidateQueries({ queryKey: ['inventory-levels'] })
              qc.invalidateQueries({ queryKey: ['inventory-stats'] })
              qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
            }}
            className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm"
            title={t('common.refresh', 'Refresh')}
          >
            <RefreshCw size={14} />
          </button>

          {/* Column Visibility Dropdown */}
          {activeTab === 'levels' && (
            <div className="relative">
              <button
                onClick={() => setShowColMenu(!showColMenu)}
                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm select-none"
                title={t('products.toggleColumns', 'Columns')}
              >
                <Settings size={14} />
              </button>
              {showColMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowColMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl p-2 z-20 space-y-1">
                    <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase">{t('products.toggleColumns', 'Toggle Columns')}</p>
                    {[
                      { key: 'warehouse', label: 'Warehouse' },
                      { key: 'product', label: 'Product Name' },
                      { key: 'sku', label: 'SKU' },
                      { key: 'qty', label: 'Qty' },
                      { key: 'reserved', label: 'Reserved Qty' },
                      { key: 'available', label: 'Available Qty' },
                      { key: 'status', label: 'Status' },
                    ].map(col => (
                      <label key={col.key} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-xl text-xs cursor-pointer text-foreground capitalize">
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(col.key)}
                          onChange={() => toggleColumn(col.key)}
                          className="form-checkbox h-3.5 w-3.5 text-primary rounded border-border"
                        />
                        {col.label}
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm"
          >
            <Download size={14} />
            <span>{t('buttons.export', 'Export')}</span>
          </button>

          <label className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm cursor-pointer">
            <Upload size={14} />
            <span>{t('buttons.import', 'Import')}</span>
            <input type="file" onChange={handleImport} accept=".csv" className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Table Wrapper */}
      <TableWrapper isFetching={isFetching}>
        {activeTab === 'levels' && (
          <table className="w-full data-table">
            <thead>
              <tr className="bg-muted/15 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {visibleColumns.includes('warehouse') && <th className="text-left py-3 px-4">{t('products.warehouse', 'Warehouse')}</th>}
                {visibleColumns.includes('product') && <th className="text-left py-3 px-4">{t('products.title', 'Product')}</th>}
                {visibleColumns.includes('sku') && <th className="text-left py-3 px-4">{t('products.sku', 'SKU')}</th>}
                {visibleColumns.includes('qty') && (
                  <th className="text-left py-3 px-4 cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort('quantity')}>
                    {t('inventory.qty', 'Quantity')} {renderSortIcon('quantity')}
                  </th>
                )}
                {visibleColumns.includes('reserved') && (
                  <th className="text-left py-3 px-4 cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort('reserved_quantity')}>
                    {t('inventory.reserved', 'Reserved')} {renderSortIcon('reserved_quantity')}
                  </th>
                )}
                {visibleColumns.includes('available') && (
                  <th className="text-left py-3 px-4 cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort('available_quantity')}>
                    {t('inventory.available', 'Available')} {renderSortIcon('available_quantity')}
                  </th>
                )}
                {visibleColumns.includes('status') && <th className="text-left py-3 px-4">{t('inventory.status', 'Status')}</th>}
                {visibleColumns.includes('actions') && <th className="text-right py-3 px-4"></th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={visibleColumns.length} />
              ) : (stockLevels?.data ?? []).map((item: any) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className="hover:bg-muted/10 transition-colors border-b border-border/30 last:border-0 cursor-pointer"
                >
                  {visibleColumns.includes('warehouse') && <td className="py-3.5 px-4 text-sm text-foreground">{item.warehouse?.name}</td>}
                  {visibleColumns.includes('product') && (
                    <td className="py-3.5 px-4 text-sm font-semibold text-foreground flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-muted/30 border border-border flex items-center justify-center overflow-hidden">
                        {item.product?.primary_image?.url ? (
                          <img src={item.product.primary_image.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package size={14} className="text-muted-foreground/50" />
                        )}
                      </div>
                      <div>
                        <span>{item.product?.name}</span>
                        {item.variant && <span className="block text-xs text-muted-foreground font-normal">{item.variant.name}</span>}
                      </div>
                    </td>
                  )}
                  {visibleColumns.includes('sku') && <td className="py-3.5 px-4 text-xs font-mono text-muted-foreground">{item.product?.sku}</td>}
                  {visibleColumns.includes('qty') && <td className="py-3.5 px-4 text-sm font-bold text-foreground">{parseFloat(item.quantity) || 0}</td>}
                  {visibleColumns.includes('reserved') && <td className="py-3.5 px-4 text-sm font-medium text-amber-500">{parseFloat(item.reserved_quantity) || 0}</td>}
                  {visibleColumns.includes('available') && <td className="py-3.5 px-4 text-sm font-bold text-emerald-500">{parseFloat(item.available_quantity) || 0}</td>}
                  {visibleColumns.includes('status') && (
                    <td className="py-3.5 px-4 text-xs">
                      {parseFloat(item.quantity) <= 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          Out of Stock
                        </span>
                      ) : parseFloat(item.quantity) <= parseFloat(item.reorder_point) ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <AlertTriangle size={11} className="shrink-0" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          In Stock
                        </span>
                      )}
                    </td>
                  )}
                  {visibleColumns.includes('actions') && (
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id); }} className="p-1.5 hover:bg-muted rounded-xl transition-colors">
                        <Eye size={14} className="text-muted-foreground" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {!isLoading && (stockLevels?.data ?? []).length === 0 && (
                <EmptyState cols={visibleColumns.length} message="No inventory records found" icon={<Package size={40} className="mx-auto mb-3 text-muted-foreground/30" />} />
              )}
            </tbody>
          </table>
        )}

        {/* Adjustments Tab */}
        {activeTab === 'adjustments' && (
          <table className="w-full data-table">
            <thead>
              <tr className="bg-muted/15 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="text-left py-3 px-4">{t('inventory.reference', 'Reference')}</th>
                <th className="text-left py-3 px-4">{t('products.warehouse', 'Warehouse')}</th>
                <th className="text-left py-3 px-4">{t('inventory.type', 'Adjustment Type')}</th>
                <th className="text-left py-3 px-4">{t('inventory.reason', 'Reason')}</th>
                <th className="text-left py-3 px-4">{t('inventory.status', 'Status')}</th>
                <th className="text-right py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={6} />
              ) : (adjustmentsData?.data ?? []).map((adj: any) => (
                <tr key={adj.id} className="hover:bg-muted/10 transition-colors border-b border-border/30 last:border-0">
                  <td className="py-3.5 px-4 text-sm font-semibold text-foreground">{adj.reference_number}</td>
                  <td className="py-3.5 px-4 text-sm text-foreground">{adj.warehouse?.name}</td>
                  <td className="py-3.5 px-4 text-sm font-medium capitalize">{adj.type}</td>
                  <td className="py-3.5 px-4 text-sm text-muted-foreground">{adj.reason}</td>
                  <td className="py-3.5 px-4 text-xs">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold ${
                      adj.status === 'approved' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {adj.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => { setActiveFormType('adjustment'); setActiveFormId(adj.id); }}
                      className="p-1.5 hover:bg-muted rounded-xl transition-colors"
                      title={adj.status === 'draft' ? t('buttons.edit', 'Edit') : t('buttons.view', 'View Details')}
                    >
                      {adj.status === 'draft' ? (
                        <Edit size={14} className="text-muted-foreground hover:text-foreground" />
                      ) : (
                        <Eye size={14} className="text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ open: true, type: 'adjustment', id: adj.id })}
                      className="p-1.5 hover:bg-red-50 rounded-xl transition-colors text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && (adjustmentsData?.data ?? []).length === 0 && (
                <EmptyState cols={6} message="No stock adjustments found" icon={<Package size={40} className="mx-auto mb-3 text-muted-foreground/30" />} />
              )}
            </tbody>
          </table>
        )}

        {/* Transfers Tab */}
        {activeTab === 'transfers' && (
          <table className="w-full data-table">
            <thead>
              <tr className="bg-muted/15 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="text-left py-3 px-4">{t('inventory.reference', 'Reference')}</th>
                <th className="text-left py-3 px-4">{t('inventory.from', 'From Warehouse')}</th>
                <th className="text-left py-3 px-4">{t('inventory.to', 'To Warehouse')}</th>
                <th className="text-left py-3 px-4">{t('inventory.status', 'Status')}</th>
                <th className="text-right py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={5} />
              ) : (transfersData?.data ?? []).map((tr: any) => (
                <tr key={tr.id} className="hover:bg-muted/10 transition-colors border-b border-border/30 last:border-0">
                  <td className="py-3.5 px-4 text-sm font-semibold text-foreground">{tr.reference_number}</td>
                  <td className="py-3.5 px-4 text-sm text-foreground">{tr.from_warehouse?.name}</td>
                  <td className="py-3.5 px-4 text-sm text-foreground">{tr.to_warehouse?.name}</td>
                  <td className="py-3.5 px-4 text-xs">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold ${
                      tr.status === 'received' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : tr.status === 'in_transit' 
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' 
                        : tr.status === 'cancelled'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {tr.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => { setActiveFormType('transfer'); setActiveFormId(tr.id); }}
                      className="p-1.5 hover:bg-muted rounded-xl transition-colors"
                      title={tr.status === 'draft' ? t('buttons.edit', 'Edit') : t('buttons.view', 'View Details')}
                    >
                      {tr.status === 'draft' ? (
                        <Edit size={14} className="text-muted-foreground hover:text-foreground" />
                      ) : (
                        <Eye size={14} className="text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ open: true, type: 'transfer', id: tr.id })}
                      className="p-1.5 hover:bg-red-50 rounded-xl transition-colors text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && (transfersData?.data ?? []).length === 0 && (
                <EmptyState cols={5} message="No stock transfers found" icon={<Package size={40} className="mx-auto mb-3 text-muted-foreground/30" />} />
              )}
            </tbody>
          </table>
        )}

        {/* Opnames Tab */}
        {activeTab === 'opnames' && (
          <table className="w-full data-table">
            <thead>
              <tr className="bg-muted/15 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="text-left py-3 px-4">{t('inventory.reference', 'Reference')}</th>
                <th className="text-left py-3 px-4">{t('products.warehouse', 'Warehouse')}</th>
                <th className="text-left py-3 px-4">{t('inventory.status', 'Status')}</th>
                <th className="text-right py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={4} />
              ) : (opnamesData?.data ?? []).map((op: any) => (
                <tr key={op.id} className="hover:bg-muted/10 transition-colors border-b border-border/30 last:border-0">
                  <td className="py-3.5 px-4 text-sm font-semibold text-foreground">{op.reference_number}</td>
                  <td className="py-3.5 px-4 text-sm text-foreground">{op.warehouse?.name}</td>
                  <td className="py-3.5 px-4 text-xs">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold ${
                      op.status === 'done' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {op.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => { setActiveFormType('opname'); setActiveFormId(op.id); }}
                      className="p-1.5 hover:bg-muted rounded-xl transition-colors"
                      title={op.status === 'draft' ? t('buttons.edit', 'Edit') : t('buttons.view', 'View Details')}
                    >
                      {op.status === 'draft' ? (
                        <Edit size={14} className="text-muted-foreground hover:text-foreground" />
                      ) : (
                        <Eye size={14} className="text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ open: true, type: 'opname', id: op.id })}
                      className="p-1.5 hover:bg-red-50 rounded-xl transition-colors text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && (opnamesData?.data ?? []).length === 0 && (
                <EmptyState cols={4} message="No stock opnames found" icon={<Package size={40} className="mx-auto mb-3 text-muted-foreground/30" />} />
              )}
            </tbody>
          </table>
        )}

        {/* Ledger tab */}
        {activeTab === 'movements' && (
          <table className="w-full data-table">
            <thead>
              <tr className="bg-muted/15 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="text-left py-3 px-4">{t('products.title', 'Product')}</th>
                <th className="text-left py-3 px-4">{t('products.warehouse', 'Warehouse')}</th>
                <th className="text-left py-3 px-4">{t('inventory.type', 'Type')}</th>
                <th className="text-left py-3 px-4">{t('inventory.qty', 'Quantity')}</th>
                <th className="text-left py-3 px-4">{t('inventory.reference', 'Reference')}</th>
                <th className="text-right py-3 px-4">{t('products.created', 'Date')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={6} />
              ) : (movementsData?.data ?? []).map((m: any) => (
                <tr key={m.id} className="hover:bg-muted/10 transition-colors border-b border-border/30 last:border-0">
                  <td className="py-3.5 px-4 text-sm font-semibold text-foreground">
                    {m.product?.name}
                    {m.variant && <span className="block text-xs font-normal text-muted-foreground">{m.variant.name}</span>}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-foreground">{m.warehouse?.name}</td>
                  <td className="py-3.5 px-4 text-xs">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold ${
                      parseFloat(m.quantity) > 0 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm font-bold text-foreground">
                    {m.quantity > 0 ? `+${parseFloat(m.quantity)}` : parseFloat(m.quantity)}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-muted-foreground">
                    {m.notes || 'Discrepancy audit'}
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs text-muted-foreground font-mono">
                    {new Date(m.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!isLoading && (movementsData?.data ?? []).length === 0 && (
                <EmptyState cols={6} message="No stock ledger records found" icon={<Package size={40} className="mx-auto mb-3 text-muted-foreground/30" />} />
              )}
            </tbody>
          </table>
        )}
      </TableWrapper>

      {/* Pagination Footer */}
      <Pagination
        currentPage={pagination.current_page}
        lastPage={pagination.last_page}
        total={pagination.total}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
      />

      {/* Details Side Overlay Panel */}
      {selectedItemId && (
        <InventoryDetailPage itemId={selectedItemId} onClose={() => setSelectedItemId(null)} />
      )}

      {/* Slide-out Filter Drawer */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 cursor-pointer"
            />
            {/* Drawer container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border shadow-2xl z-50 flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Filter size={16} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base text-foreground">
                      {t('products.filterProducts', 'Filter Options')}
                    </h3>
                    {activeFiltersCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary text-white rounded-full leading-none text-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Warehouse location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('inventory.warehouse', 'Warehouse')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                      <Warehouse size={14} />
                    </div>
                    <select
                      value={selectedWarehouse}
                      onChange={(e) => setSelectedWarehouse(e.target.value)}
                      className="form-input pl-9 w-full text-sm rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                    >
                      <option value="">{t('inventory.all_warehouses', 'All Warehouses')}</option>
                      {(warehouses ?? []).map((w: any) => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category (Levels tab only) */}
                {activeTab === 'levels' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      {t('products.category', 'Category')}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                        <Layers size={14} />
                      </div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="form-input pl-9 w-full text-sm rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                      >
                        <option value="">{t('inventory.all_categories', 'All Categories')}</option>
                        {(categories ?? []).map((c: any) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Brand (Levels tab only) */}
                {activeTab === 'levels' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      {t('products.brand', 'Brand')}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                        <Tag size={14} />
                      </div>
                      <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="form-input pl-9 w-full text-sm rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                      >
                        <option value="">{t('inventory.all_brands', 'All Brands')}</option>
                        {(brands ?? []).map((b: any) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Inventory Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('inventory.inventoryStatus', 'Inventory Status')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                      <Settings size={14} />
                    </div>
                    <select
                      value={selectedInventoryStatus}
                      onChange={(e) => setSelectedInventoryStatus(e.target.value)}
                      className="form-input pl-9 w-full text-sm rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                    >
                      <option value="">{t('inventory.allInventoryStatuses', 'All Inventory Statuses')}</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Supplier */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('inventory.supplier', 'Supplier')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                      <Tag size={14} />
                    </div>
                    <select
                      value={selectedSupplier}
                      onChange={(e) => setSelectedSupplier(e.target.value)}
                      className="form-input pl-9 w-full text-sm rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                    >
                      <option value="">{t('inventory.allSuppliers', 'All Suppliers')}</option>
                      {suppliers?.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Created By */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('inventory.createdBy', 'Created By')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                      <Layers size={14} />
                    </div>
                    <select
                      value={selectedCreatedBy}
                      onChange={(e) => setSelectedCreatedBy(e.target.value)}
                      className="form-input pl-9 w-full text-sm rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                    >
                      <option value="">{t('inventory.allUsers', 'All Users')}</option>
                      {users?.map((u: any) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status (all tabs except movements) */}
                {activeTab !== 'movements' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      {t('inventory.status', 'Status')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {getStatusOptions().map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setSelectedStatus(opt.value); setPage(1) }}
                          className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all text-center select-none active:scale-95 duration-100
                                     ${selectedStatus === opt.value ? opt.activeClass : opt.inactiveClass}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date Range */}
                <div className="space-y-3 pt-4 border-t border-border/80">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('inventory.dateRange', 'Created Date')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">
                        {t('inventory.startDate', 'Start Date')}
                      </span>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                          <Calendar size={13} />
                        </div>
                        <input
                          type="date"
                          value={filterStartDate}
                          onChange={(e) => setFilterStartDate(e.target.value)}
                          className="form-input pl-9 w-full text-xs rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">
                        {t('inventory.endDate', 'End Date')}
                      </span>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                          <Calendar size={13} />
                        </div>
                        <input
                          type="date"
                          value={filterEndDate}
                          onChange={(e) => setFilterEndDate(e.target.value)}
                          className="form-input pl-9 w-full text-xs rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    handleResetFilters()
                    setSelectedStatus('')
                    setPage(1)
                  }}
                  className="flex-1 py-2 px-3 border border-border text-sm font-semibold rounded-xl hover:bg-muted transition-colors text-center text-muted-foreground hover:text-foreground active:scale-95 duration-100"
                >
                  {t('buttons.reset', 'Reset')}
                </button>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="flex-1 py-2 px-3 text-white bg-primary text-sm font-semibold rounded-xl hover:opacity-95 transition-opacity text-center shadow-sm active:scale-95 duration-100"
                >
                  {t('buttons.apply', 'Apply')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Slide-out Inventory Item Detail Drawer */}
      <AnimatePresence>
        {selectedItemId !== null && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItemId(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 cursor-pointer"
            />
            <InventoryDetailPage itemId={selectedItemId} onClose={() => setSelectedItemId(null)} />
          </>
        )}
      </AnimatePresence>

      {/* Slide-out Stock Adjustment Drawer */}
      <AnimatePresence>
        {activeFormType === 'adjustment' && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setActiveFormType(null); setActiveFormId(null); }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 cursor-pointer"
            />
            {/* Drawer container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-5xl bg-card border-l border-border shadow-2xl z-50 flex flex-col h-full overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-6">
                <StockAdjustmentForm adjustmentId={activeFormId} onClose={() => { setActiveFormType(null); setActiveFormId(null); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Slide-out Stock Transfer Drawer */}
      <AnimatePresence>
        {activeFormType === 'transfer' && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setActiveFormType(null); setActiveFormId(null); }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 cursor-pointer"
            />
            {/* Drawer container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-5xl bg-card border-l border-border shadow-2xl z-50 flex flex-col h-full overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-6">
                <StockTransferForm transferId={activeFormId} onClose={() => { setActiveFormType(null); setActiveFormId(null); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Centered Modal for NEW Stock Opname Count Creation */}
      <AnimatePresence>
        {activeFormType === 'opname' && activeFormId === null && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-card border border-border/80 shadow-2xl rounded-2xl max-w-md w-full overflow-hidden flex flex-col p-6 relative"
            >
              <StockOpnameForm opnameId={null} onClose={() => { setActiveFormType(null); setActiveFormId(null); }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Slide-out Stock Opname Drawer (For counting verification / edit) */}
      <AnimatePresence>
        {activeFormType === 'opname' && activeFormId !== null && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setActiveFormType(null); setActiveFormId(null); }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 cursor-pointer"
            />
            {/* Drawer container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-5xl bg-card border-l border-border shadow-2xl z-50 flex flex-col h-full overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-6">
                <StockOpnameForm opnameId={activeFormId} onClose={() => { setActiveFormType(null); setActiveFormId(null); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog Modal */}
      <AnimatePresence>
        {deleteConfirm.open && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 26, stiffness: 360 }}
              className="bg-card border border-border/80 shadow-2xl rounded-2xl max-w-md w-full p-6 relative flex flex-col space-y-4"
            >
              {/* Header / Warning Icon & Title */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 font-extrabold text-base select-none">
                  !
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {t('deleteConfirm.title')}
                </h3>
              </div>

              {/* Message text left aligned */}
              <div className="text-left space-y-1.5">
                <p className="text-sm text-foreground font-medium">
                  {t('deleteConfirm.prompt')}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('deleteConfirm.warning')}
                </p>
              </div>

              {/* Actions right aligned */}
              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm({ open: false, type: null, id: null })}
                  className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all active:scale-95 duration-100"
                >
                  {t('deleteConfirm.cancel')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (deleteConfirm.type === 'adjustment' && deleteConfirm.id) {
                      deleteAdjustmentMutation.mutate(deleteConfirm.id)
                    } else if (deleteConfirm.type === 'transfer' && deleteConfirm.id) {
                      deleteTransferMutation.mutate(deleteConfirm.id)
                    } else if (deleteConfirm.type === 'opname' && deleteConfirm.id) {
                      deleteOpnameMutation.mutate(deleteConfirm.id)
                    }
                    setDeleteConfirm({ open: false, type: null, id: null })
                  }}
                  className="px-4 py-2 bg-[#d9214e] hover:bg-[#c11c42] text-white text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 duration-100"
                >
                  {t('deleteConfirm.delete')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InventoryPage
