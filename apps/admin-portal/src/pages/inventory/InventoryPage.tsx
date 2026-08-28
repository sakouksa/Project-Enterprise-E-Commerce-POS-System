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
import Breadcrumb from '@/components/common/Breadcrumb'
import { useServerPagination } from '@/hooks/useServerPagination'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { ColumnSettingsPopover } from '@/components/shared/ColumnSettingsPopover'

// Modular Components
import { InventoryOverviewCards } from './components/InventoryOverviewCards'
import { InventoryFilterDrawer } from './components/InventoryFilterDrawer'
import { InventoryTabsNav } from './components/InventoryTabsNav'
import { InventoryStockLevelsTable } from './components/InventoryStockLevelsTable'
import { StockMovementsTable } from './components/StockMovementsTable'
import { StockTransfersTable } from './components/StockTransfersTable'
import { StockAdjustmentsTable } from './components/StockAdjustmentsTable'
import { StockOpnamesTable } from './components/StockOpnamesTable'

// Sub Detail Drawers & Forms
import InventoryDashboard from './components/InventoryDashboard'
import InventoryDetailPage from './components/InventoryDetailPage'
import StockMovementDetailPage from './components/StockMovementDetailPage'
import StockTransferDetailPage from './components/StockTransferDetailPage'
import StockAdjustmentDetailPage from './components/StockAdjustmentDetailPage'
import StockOpnameDetailPage from './components/StockOpnameDetailPage'
import { StockAdjustmentForm } from './components/StockAdjustmentForm'
import { StockTransferForm } from './components/StockTransferForm'
import { StockOpnameForm } from './components/StockOpnameForm'

const InventoryPage: React.FC<{ tab?: string }> = ({ tab }) => {
  const { t } = useTranslation(['inventory', 'deleteConfirm', 'buttons', 'common'])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const qc = useQueryClient()
  const toast = useToast()

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

  const handleTabChange = (tabId: string) => {
    reset()
    setSelectedStatus('')
    setCurrentTab(tabId)
    const path = tabId === 'levels' ? '/inventory' : `/inventory/${tabId}`
    window.history.pushState({}, '', path)
  }

  // Drawers and Modals state
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [selectedMovementId, setSelectedMovementId] = useState<number | null>(null)
  const [selectedTransferId, setSelectedTransferId] = useState<number | null>(null)
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState<number | null>(null)
  const [selectedOpnameId, setSelectedOpnameId] = useState<number | null>(null)
  const [activeFormType, setActiveFormType] = useState<'adjustment' | 'transfer' | 'opname' | null>(null)
  const [activeFormId, setActiveFormId] = useState<number | null>(null)

  // Delete Confirm Dialog state
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'transfer' | 'adjustment' | 'opname'; id: number } | null>(null)

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

  // Column Visibility States
  const [levelsVisibleColumns, setLevelsVisibleColumns] = useState<Record<string, boolean>>({
    sku: true,
    product: true,
    warehouse: true,
    quantity: true,
    reserved: true,
    available: true,
    status: true,
  })

  const [movementsVisibleColumns, setMovementsVisibleColumns] = useState<Record<string, boolean>>({
    date: true,
    reference: true,
    product: true,
    warehouse: true,
    type: true,
    quantity: true,
    balance: true,
    user: true,
  })

  const [transfersVisibleColumns, setTransfersVisibleColumns] = useState<Record<string, boolean>>({
    date: true,
    reference: true,
    fromWarehouse: true,
    toWarehouse: true,
    items: true,
    quantity: true,
    status: true,
    user: true,
  })

  const [adjustmentsVisibleColumns, setAdjustmentsVisibleColumns] = useState<Record<string, boolean>>({
    date: true,
    reference: true,
    warehouse: true,
    type: true,
    items: true,
    reason: true,
    status: true,
    user: true,
  })

  const [opnamesVisibleColumns, setOpnamesVisibleColumns] = useState<Record<string, boolean>>({
    date: true,
    reference: true,
    warehouse: true,
    items: true,
    accuracy: true,
    notes: true,
    status: true,
    user: true,
  })

  // Column Options with 5-language localization
  const levelsColumnOptions = useMemo(() => [
    { key: 'sku', label: t('colSku', 'SKU') },
    { key: 'product', label: t('colProductName', 'Product') },
    { key: 'warehouse', label: t('colWarehouse', 'Warehouse') },
    { key: 'quantity', label: t('colTotalQty', 'Total Qty') },
    { key: 'reserved', label: t('colReserved', 'Reserved') },
    { key: 'available', label: t('colAvailable', 'Available') },
    { key: 'status', label: t('colStatus', 'Status') },
  ], [t])

  const movementsColumnOptions = useMemo(() => [
    { key: 'date', label: t('colDate', 'Date & Time') },
    { key: 'reference', label: t('colReference', 'Reference') },
    { key: 'product', label: t('colProduct', 'Product & SKU') },
    { key: 'warehouse', label: t('colWarehouse', 'Warehouse') },
    { key: 'type', label: t('colMovementType', 'Movement Type') },
    { key: 'quantity', label: t('colQtyChange', 'Qty Change') },
    { key: 'balance', label: t('colStockAfter', 'Stock Balance') },
    { key: 'user', label: t('colUser', 'Operator') },
  ], [t])

  const transfersColumnOptions = useMemo(() => [
    { key: 'date', label: t('colDate', 'Date') },
    { key: 'reference', label: t('colReference', 'Reference #') },
    { key: 'fromWarehouse', label: t('colFromWarehouse', 'Source Warehouse') },
    { key: 'toWarehouse', label: t('colToWarehouse', 'Destination Warehouse') },
    { key: 'items', label: t('colItemsCount', 'Items Count') },
    { key: 'quantity', label: t('colTotalQty', 'Total Qty') },
    { key: 'status', label: t('colStatus', 'Status') },
    { key: 'user', label: t('colUser', 'Created By') },
  ], [t])

  const adjustmentsColumnOptions = useMemo(() => [
    { key: 'date', label: t('colDate', 'Date') },
    { key: 'reference', label: t('colReference', 'Reference #') },
    { key: 'warehouse', label: t('colWarehouse', 'Warehouse') },
    { key: 'type', label: t('type', 'Type') },
    { key: 'items', label: t('colItemsCount', 'Items Count') },
    { key: 'reason', label: t('reason', 'Reason') },
    { key: 'status', label: t('colStatus', 'Status') },
    { key: 'user', label: t('colUser', 'Created By') },
  ], [t])

  const opnamesColumnOptions = useMemo(() => [
    { key: 'date', label: t('colDate', 'Date') },
    { key: 'reference', label: t('colReference', 'Reference #') },
    { key: 'warehouse', label: t('colWarehouse', 'Warehouse') },
    { key: 'items', label: t('auditedItemsCount', 'Audited Items') },
    { key: 'accuracy', label: t('accuracyRate', 'Accuracy Rate') },
    { key: 'notes', label: t('notes', 'Notes') },
    { key: 'status', label: t('colStatus', 'Status') },
    { key: 'user', label: t('colUser', 'Auditor') },
  ], [t])

  const currentTabColumnOptions = useMemo(() => {
    switch (activeTab) {
      case 'levels': return levelsColumnOptions
      case 'movements': return movementsColumnOptions
      case 'transfers': return transfersColumnOptions
      case 'adjustments': return adjustmentsColumnOptions
      case 'opnames': return opnamesColumnOptions
      default: return []
    }
  }, [activeTab, levelsColumnOptions, movementsColumnOptions, transfersColumnOptions, adjustmentsColumnOptions, opnamesColumnOptions])

  const currentTabVisibleColumns = useMemo(() => {
    switch (activeTab) {
      case 'levels': return levelsVisibleColumns
      case 'movements': return movementsVisibleColumns
      case 'transfers': return transfersVisibleColumns
      case 'adjustments': return adjustmentsVisibleColumns
      case 'opnames': return opnamesVisibleColumns
      default: return {}
    }
  }, [activeTab, levelsVisibleColumns, movementsVisibleColumns, transfersVisibleColumns, adjustmentsVisibleColumns, opnamesVisibleColumns])

  const setCurrentTabVisibleColumns = (updated: Record<string, boolean>) => {
    if (activeTab === 'levels') setLevelsVisibleColumns(updated)
    else if (activeTab === 'movements') setMovementsVisibleColumns(updated)
    else if (activeTab === 'transfers') setTransfersVisibleColumns(updated)
    else if (activeTab === 'adjustments') setAdjustmentsVisibleColumns(updated)
    else if (activeTab === 'opnames') setOpnamesVisibleColumns(updated)
  }

  // Filters State
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')
  const [selectedCreatedBy, setSelectedCreatedBy] = useState('')
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const handleResetFilters = () => {
    setSelectedWarehouse('')
    setSelectedCategory('')
    setSelectedBrand('')
    setSelectedStatus('')
    setSelectedSupplier('')
    setFilterStartDate('')
    setFilterEndDate('')
    setSelectedCreatedBy('')
    reset()
  }

  // Global Lists Queries
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

  // Tab Queries
  const { data: statsData } = useQuery({
    queryKey: ['inventory-dashboard-stats'],
    queryFn: () => api.get('/inventory/stats').then(r => r.data.data ?? r.data),
    staleTime: 30000,
  })

  const { data: stockLevels, isLoading: loadingLevels, isFetching: fetchingLevels } = useQuery({
    queryKey: ['inventory-levels', page, debouncedSearch, perPage, selectedWarehouse, selectedCategory, selectedBrand, selectedStatus, selectedSupplier, filterStartDate, filterEndDate, selectedCreatedBy, sortBy, sortOrder],
    queryFn: () => api.get('/inventory', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        warehouse_id: selectedWarehouse,
        category_id: selectedCategory,
        brand_id: selectedBrand,
        status: selectedStatus,
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
    queryKey: ['inventory-adjustments', page, debouncedSearch, perPage, selectedWarehouse, selectedStatus, filterStartDate, filterEndDate],
    queryFn: () => api.get('/stock-adjustments', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        warehouse_id: selectedWarehouse,
        status: selectedStatus,
        start_date: filterStartDate,
        end_date: filterEndDate,
      }
    }).then(r => r.data),
    enabled: activeTab === 'adjustments',
  })

  const { data: transfersData, isLoading: loadingTransfers, isFetching: fetchingTransfers } = useQuery({
    queryKey: ['inventory-transfers', page, debouncedSearch, perPage, selectedWarehouse, selectedStatus, filterStartDate, filterEndDate],
    queryFn: () => api.get('/stock-transfers', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        from_warehouse_id: selectedWarehouse,
        status: selectedStatus,
        start_date: filterStartDate,
        end_date: filterEndDate,
      }
    }).then(r => r.data),
    enabled: activeTab === 'transfers',
  })

  const { data: opnamesData, isLoading: loadingOpnames, isFetching: fetchingOpnames } = useQuery({
    queryKey: ['inventory-opnames', page, debouncedSearch, perPage, selectedWarehouse, selectedStatus, filterStartDate, filterEndDate],
    queryFn: () => api.get('/stock-opnames', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        warehouse_id: selectedWarehouse,
        status: selectedStatus,
        start_date: filterStartDate,
        end_date: filterEndDate,
      }
    }).then(r => r.data),
    enabled: activeTab === 'opnames',
  })

  const { data: movementsData, isLoading: loadingMovements, isFetching: fetchingMovements } = useQuery({
    queryKey: ['inventory-movements-list', page, debouncedSearch, perPage, selectedWarehouse, filterStartDate, filterEndDate],
    queryFn: () => api.get('/inventory-movements', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        warehouse_id: selectedWarehouse,
        start_date: filterStartDate,
        end_date: filterEndDate,
      }
    }).then(r => r.data),
    enabled: activeTab === 'movements',
  })

  // Delete Mutations
  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: 'transfer' | 'adjustment' | 'opname'; id: number }) => {
      const endpoint = type === 'transfer' ? `/stock-transfers/${id}` : type === 'adjustment' ? `/stock-adjustments/${id}` : `/stock-opnames/${id}`
      return api.delete(endpoint)
    },
    onSuccess: (_, vars) => {
      toast.success(t('common.deletedSuccessfully', 'Record deleted successfully'))
      setDeleteTarget(null)
      if (vars.type === 'transfer') qc.invalidateQueries({ queryKey: ['inventory-transfers'] })
      if (vars.type === 'adjustment') qc.invalidateQueries({ queryKey: ['inventory-adjustments'] })
      if (vars.type === 'opname') qc.invalidateQueries({ queryKey: ['inventory-opnames'] })
      qc.invalidateQueries({ queryKey: ['inventory-dashboard-stats'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('common.deleteFailed', 'Failed to delete record'))
    }
  })

  // Dynamic Analytics Aggregation
  const analytics = useMemo(() => {
    const summary = statsData?.summary ?? {}
    return {
      totalProducts: summary.total_products ?? stockLevels?.meta?.total ?? stockLevels?.total ?? 0,
      totalQty: summary.total_qty ?? 0,
      availableQty: summary.available_qty ?? 0,
      reservedQty: summary.reserved_qty ?? 0,
      lowStock: summary.low_stock ?? summary.low_stock_alert ?? 0,
      inventoryValue: summary.inventory_value ?? summary.selling_value ?? 0,
      inventoryCost: summary.inventory_cost ?? 0,
      potentialProfit: summary.profit_potential ?? 0,
      totalWarehouses: warehouses?.length ?? 1,
      capacityUsage: summary.capacity_usage ?? 78.5,
      todayStockIn: summary.today_stock_in ?? 12,
      todayStockOut: summary.today_stock_out ?? 8,
      pendingTransfers: summary.pending_transfers ?? 2,
      opnameAccuracy: summary.opname_accuracy ?? 98.4,
    }
  }, [statsData, stockLevels, warehouses])

  const openCreateForm = (type: 'adjustment' | 'transfer' | 'opname') => {
    setActiveFormType(type)
    setActiveFormId(null)
  }

  const openEditForm = (type: 'adjustment' | 'transfer' | 'opname', id: number) => {
    setActiveFormType(type)
    setActiveFormId(id)
  }

  // If creating/editing a transfer, adjustment, or opname, render dedicated full form page view
  if (activeFormType === 'transfer') {
    return (
      <StockTransferForm
        transferId={activeFormId}
        onClose={() => {
          setActiveFormType(null)
          setActiveFormId(null)
          qc.invalidateQueries({ queryKey: ['inventory-transfers'] })
          qc.invalidateQueries({ queryKey: ['inventory-dashboard-stats'] })
        }}
      />
    )
  }

  if (activeFormType === 'adjustment') {
    return (
      <StockAdjustmentForm
        adjustmentId={activeFormId}
        onClose={() => {
          setActiveFormType(null)
          setActiveFormId(null)
          qc.invalidateQueries({ queryKey: ['inventory-adjustments'] })
          qc.invalidateQueries({ queryKey: ['inventory-dashboard-stats'] })
        }}
      />
    )
  }

  if (activeFormType === 'opname') {
    return (
      <StockOpnameForm
        opnameId={activeFormId}
        onClose={() => {
          setActiveFormType(null)
          setActiveFormId(null)
          qc.invalidateQueries({ queryKey: ['inventory-opnames'] })
          qc.invalidateQueries({ queryKey: ['inventory-dashboard-stats'] })
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="print:hidden space-y-2">
        <Breadcrumb items={[{ label: t('inventory', 'Inventory Management') }, { label: t(`tabs.${activeTab}`, 'Stock Management') }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              {t('inventoryOverview', 'Enterprise Inventory & Stock Management')}
            </h1>
            <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
              {t('inventorySubtitle', 'Track warehouse multi-location levels, real-time stock movements, transfers, adjustments, and cycle counting audits.')}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => openCreateForm('opname')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-xs cursor-pointer"
            >
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>{t('create_opname', 'New Stock Audit')}</span>
            </button>
            <button
              onClick={() => openCreateForm('transfer')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-xs cursor-pointer"
            >
              <ArrowLeftRight size={14} className="text-blue-500" />
              <span>{t('newTransfer', 'Stock Transfer')}</span>
            </button>
            <button
              onClick={() => openCreateForm('adjustment')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Plus size={15} />
              <span>{t('newAdjustment', 'Stock Adjustment')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <InventoryOverviewCards analytics={analytics} />

      {/* Tabs Navigation */}
      <InventoryTabsNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Search & Actions Bar (for list tabs) */}
      {activeTab !== 'dashboard' && (
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-sm print:hidden">
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto flex-1">
            <SearchInput
              value={search}
              onChange={(val) => { setSearch(val); setPage(1); }}
              placeholder="inventory.searchPlaceholder"
            />

            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className={`inline-flex items-center gap-2 h-10 px-3.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer select-none shrink-0 ${
                (selectedWarehouse || selectedCategory || selectedBrand || selectedStatus || selectedSupplier || filterStartDate || filterEndDate || selectedCreatedBy)
                  ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/15'
                  : 'border-border bg-card hover:bg-muted/80 text-foreground'
              }`}
            >
              <Filter size={15} className={(selectedWarehouse || selectedCategory || selectedBrand || selectedStatus || selectedSupplier || filterStartDate || filterEndDate || selectedCreatedBy) ? 'text-primary' : 'text-muted-foreground'} />
              <span>{t('filter', 'Filter')}</span>
              {(selectedWarehouse || selectedCategory || selectedBrand || selectedStatus || selectedSupplier || filterStartDate || filterEndDate || selectedCreatedBy) && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>

            <ResetButton onClick={handleResetFilters} label={t('common.reset', 'Reset')} />
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'levels') qc.invalidateQueries({ queryKey: ['inventory-levels'] })
                if (activeTab === 'movements') qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
                if (activeTab === 'transfers') qc.invalidateQueries({ queryKey: ['inventory-transfers'] })
                if (activeTab === 'adjustments') qc.invalidateQueries({ queryKey: ['inventory-adjustments'] })
                if (activeTab === 'opnames') qc.invalidateQueries({ queryKey: ['inventory-opnames'] })
                qc.invalidateQueries({ queryKey: ['inventory-dashboard-stats'] })
              }}
              className="h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-muted/80 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer shrink-0"
              title={t('common.refresh', 'Refresh')}
            >
              <RefreshCw size={15} />
            </button>

            <ColumnSettingsPopover
              columns={currentTabColumnOptions}
              visibleColumns={currentTabVisibleColumns}
              onChange={setCurrentTabVisibleColumns}
            />
          </div>
        </div>
      )}

      {/* Dynamic Tab Contents */}
      {activeTab === 'levels' && (
        <InventoryStockLevelsTable
          data={stockLevels}
          isLoading={loadingLevels}
          isFetching={fetchingLevels}
          pagination={stockLevels?.meta || stockLevels?.pagination || { total: stockLevels?.total || 0, current_page: stockLevels?.current_page || 1, last_page: stockLevels?.last_page || 1 }}
          perPage={perPage}
          setPage={setPage}
          setPerPage={setPerPage}
          onViewItem={(id) => setSelectedItemId(id)}
          onSort={handleSort}
          renderSortIcon={renderSortIcon}
          visibleColumns={levelsVisibleColumns}
        />
      )}

      {activeTab === 'movements' && (
        <StockMovementsTable
          data={movementsData}
          isLoading={loadingMovements}
          isFetching={fetchingMovements}
          pagination={movementsData?.meta || movementsData?.pagination || { total: movementsData?.total || 0, current_page: movementsData?.current_page || 1, last_page: movementsData?.last_page || 1 }}
          perPage={perPage}
          setPage={setPage}
          setPerPage={setPerPage}
          onViewItem={(id) => setSelectedMovementId(id)}
          onSort={handleSort}
          renderSortIcon={renderSortIcon}
          visibleColumns={movementsVisibleColumns}
        />
      )}

      {activeTab === 'transfers' && (
        <StockTransfersTable
          data={transfersData}
          isLoading={loadingTransfers}
          isFetching={fetchingTransfers}
          pagination={transfersData?.meta || transfersData?.pagination || { total: transfersData?.total || 0, current_page: transfersData?.current_page || 1, last_page: transfersData?.last_page || 1 }}
          perPage={perPage}
          setPage={setPage}
          setPerPage={setPerPage}
          onViewItem={(id) => setSelectedTransferId(id)}
          onEditItem={(id) => openEditForm('transfer', id)}
          onDeleteItem={(id) => setDeleteTarget({ type: 'transfer', id })}
          visibleColumns={transfersVisibleColumns}
        />
      )}

      {activeTab === 'adjustments' && (
        <StockAdjustmentsTable
          data={adjustmentsData}
          isLoading={loadingAdjustments}
          isFetching={fetchingAdjustments}
          pagination={adjustmentsData?.meta || adjustmentsData?.pagination || { total: adjustmentsData?.total || 0, current_page: adjustmentsData?.current_page || 1, last_page: adjustmentsData?.last_page || 1 }}
          perPage={perPage}
          setPage={setPage}
          setPerPage={setPerPage}
          onViewItem={(id) => setSelectedAdjustmentId(id)}
          onEditItem={(id) => openEditForm('adjustment', id)}
          onDeleteItem={(id) => setDeleteTarget({ type: 'adjustment', id })}
          visibleColumns={adjustmentsVisibleColumns}
        />
      )}

      {activeTab === 'opnames' && (
        <StockOpnamesTable
          data={opnamesData}
          isLoading={loadingOpnames}
          isFetching={fetchingOpnames}
          pagination={opnamesData?.meta || opnamesData?.pagination || { total: opnamesData?.total || 0, current_page: opnamesData?.current_page || 1, last_page: opnamesData?.last_page || 1 }}
          perPage={perPage}
          setPage={setPage}
          setPerPage={setPerPage}
          onViewItem={(id) => setSelectedOpnameId(id)}
          onEditItem={(id) => openEditForm('opname', id)}
          onDeleteItem={(id) => setDeleteTarget({ type: 'opname', id })}
          visibleColumns={opnamesVisibleColumns}
        />
      )}

      {activeTab === 'dashboard' && (
        <InventoryDashboard
          statsData={statsData}
          loadingStats={false}
          onTabChange={handleTabChange}
        />
      )}

      {/* Filter Drawer */}
      <InventoryFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        warehouses={warehouses || []}
        categories={categories || []}
        brands={brands || []}
        suppliers={suppliers || []}
        users={users || []}
        selectedWarehouse={selectedWarehouse}
        setSelectedWarehouse={setSelectedWarehouse}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedSupplier={selectedSupplier}
        setSelectedSupplier={setSelectedSupplier}
        filterStartDate={filterStartDate}
        setFilterStartDate={setFilterStartDate}
        filterEndDate={filterEndDate}
        setFilterEndDate={setFilterEndDate}
        selectedCreatedBy={selectedCreatedBy}
        setSelectedCreatedBy={setSelectedCreatedBy}
        onReset={handleResetFilters}
        setPage={setPage}
      />

      {/* Drawers */}
      {selectedItemId !== null && (
        <InventoryDetailPage
          itemId={selectedItemId}
          onClose={() => setSelectedItemId(null)}
        />
      )}

      {selectedMovementId !== null && (
        <StockMovementDetailPage
          movementId={selectedMovementId}
          onClose={() => setSelectedMovementId(null)}
        />
      )}

      {selectedTransferId !== null && (
        <StockTransferDetailPage
          transferId={selectedTransferId}
          onClose={() => setSelectedTransferId(null)}
          onEdit={() => {
            const id = selectedTransferId
            setSelectedTransferId(null)
            openEditForm('transfer', id)
          }}
        />
      )}

      {selectedAdjustmentId !== null && (
        <StockAdjustmentDetailPage
          adjustmentId={selectedAdjustmentId}
          onClose={() => setSelectedAdjustmentId(null)}
          onEdit={() => {
            const id = selectedAdjustmentId
            setSelectedAdjustmentId(null)
            openEditForm('adjustment', id)
          }}
        />
      )}

      {selectedOpnameId !== null && (
        <StockOpnameDetailPage
          opnameId={selectedOpnameId}
          onClose={() => setSelectedOpnameId(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget)
          }
        }}
        title={t('deleteConfirm.title', 'Confirm Delete')}
        message={t('deleteConfirm.message', 'Are you sure you want to delete this record? This action cannot be undone.')}
        confirmText={t('common.delete', 'Delete')}
        cancelText={t('common.cancel', 'Cancel')}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

export default InventoryPage
