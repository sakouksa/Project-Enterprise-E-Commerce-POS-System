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
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import ResetButton from '@/components/shared/ResetButton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import TableActionMenu from '@/components/shared/TableActionMenu'

// Modular Components
import { InventoryOverviewCards } from './components/InventoryOverviewCards'
import { InventoryFilterDrawer } from './components/InventoryFilterDrawer'
import { InventoryTabsNav } from './components/InventoryTabsNav'
import { InventoryStockLevelsTable } from './components/InventoryStockLevelsTable'

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

  // Dynamic Analytics Aggregation
  const analytics = useMemo(() => {
    const summary = statsData?.summary ?? {}
    return {
      totalProducts: summary.total_products ?? stockLevels?.meta?.total ?? 0,
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
              Track warehouse multi-location levels, real-time stock movements, transfers, adjustments, and cycle counting audits.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => openCreateForm('transfer')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-xs cursor-pointer"
            >
              <ArrowLeftRight size={14} />
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
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 min-w-[280px] sm:max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={t('searchPlaceholder', 'Search SKU, Product Name, Barcode, Warehouse...')}
                className="form-input pl-9 w-full text-xs rounded-xl border border-border bg-card text-foreground"
              />
            </div>

            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted cursor-pointer shadow-sm"
            >
              <Filter size={14} />
              <span>{t('filter', 'Filter')}</span>
            </button>

            <ResetButton onClick={handleResetFilters} label={t('common.reset', 'Reset')} />
          </div>

          <button
            onClick={() => qc.invalidateQueries({ queryKey: [`inventory-${activeTab}`] })}
            className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm cursor-pointer"
            title={t('common.refresh', 'Refresh')}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      )}

      {/* Dynamic Tab Contents */}
      {activeTab === 'levels' && (
        <InventoryStockLevelsTable
          data={stockLevels}
          isLoading={loadingLevels}
          isFetching={fetchingLevels}
          pagination={stockLevels?.meta ?? { total: 0, current_page: 1, last_page: 1 }}
          perPage={perPage}
          setPage={setPage}
          setPerPage={setPerPage}
          onViewItem={(id) => setSelectedItemId(id)}
          onSort={handleSort}
          renderSortIcon={renderSortIcon}
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
        />
      )}

      {selectedAdjustmentId !== null && (
        <StockAdjustmentDetailPage
          adjustmentId={selectedAdjustmentId}
          onClose={() => setSelectedAdjustmentId(null)}
        />
      )}

      {selectedOpnameId !== null && (
        <StockOpnameDetailPage
          opnameId={selectedOpnameId}
          onClose={() => setSelectedOpnameId(null)}
        />
      )}

      {/* Form Modals */}
      {activeFormType === 'transfer' && (
        <StockTransferForm
          transferId={activeFormId}
          onClose={() => { setActiveFormType(null); setActiveFormId(null); qc.invalidateQueries({ queryKey: ['inventory-transfers'] }); }}
        />
      )}

      {activeFormType === 'adjustment' && (
        <StockAdjustmentForm
          adjustmentId={activeFormId}
          onClose={() => { setActiveFormType(null); setActiveFormId(null); qc.invalidateQueries({ queryKey: ['inventory-adjustments'] }); }}
        />
      )}

      {activeFormType === 'opname' && (
        <StockOpnameForm
          opnameId={activeFormId}
          onClose={() => { setActiveFormType(null); setActiveFormId(null); qc.invalidateQueries({ queryKey: ['inventory-opnames'] }); }}
        />
      )}
    </div>
  )
}

export default InventoryPage
