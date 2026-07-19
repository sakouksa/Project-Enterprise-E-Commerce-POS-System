import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Search, Eye, RefreshCw, Package, ArrowLeftRight, CheckCircle,
  AlertTriangle, Loader2, Filter, Download, Upload, Columns, Edit, Trash2
} from 'lucide-react'
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
  const { t } = useTranslation()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()

  const activeTab = tab || 'levels'

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

  // Filters State
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

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

  // Tab Queries
  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ['inventory-stats'],
    queryFn: () => api.get('/inventory/stats').then(r => r.data.data),
    enabled: activeTab === 'levels',
  })

  const { data: stockLevels, isLoading: loadingLevels, isFetching: fetchingLevels } = useQuery({
    queryKey: ['inventory-levels', page, debouncedSearch, perPage, selectedWarehouse, selectedCategory, selectedBrand, selectedStatus],
    queryFn: () => api.get('/inventory', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        warehouse_id: selectedWarehouse,
        category_id: selectedCategory,
        brand_id: selectedBrand,
        status: selectedStatus
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

  // Render Sub form workspaces
  if (activeFormType === 'adjustment') {
    return (
      <div className="p-6 bg-background min-h-screen">
        <StockAdjustmentForm adjustmentId={activeFormId} onClose={() => { setActiveFormType(null); setActiveFormId(null); }} />
      </div>
    )
  }

  if (activeFormType === 'transfer') {
    return (
      <div className="p-6 bg-background min-h-screen">
        <StockTransferForm transferId={activeFormId} onClose={() => { setActiveFormType(null); setActiveFormId(null); }} />
      </div>
    )
  }

  if (activeFormType === 'opname') {
    return (
      <div className="p-6 bg-background min-h-screen">
        <StockOpnameForm opnameId={activeFormId} onClose={() => { setActiveFormType(null); setActiveFormId(null); }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: t('Inventory') },
          {
            label: activeTab === 'levels' ? t('Stock Levels') :
              activeTab === 'adjustments' ? t('Stock Adjustments') :
                activeTab === 'transfers' ? t('Stock Transfers') :
                  activeTab === 'opnames' ? t('Stock Opnames') :
                    t('Stock Ledger (Movements)')
          }
        ]}
      />

      {/* Tabs */}
      <div className="flex border-b border-border bg-card rounded-t-xl px-4 overflow-x-auto gap-2 shadow-sm">
        {[
          { id: 'levels', label: t('Stock Levels'), icon: <Package size={14} />, path: '/inventory' },
          { id: 'adjustments', label: t('Stock Adjustments'), icon: <Plus size={14} />, path: '/inventory/adjustments' },
          { id: 'transfers', label: t('Stock Transfers'), icon: <ArrowLeftRight size={14} />, path: '/inventory/transfers' },
          { id: 'opnames', label: t('Stock Opnames'), icon: <CheckCircle size={14} />, path: '/inventory/opnames' },
          { id: 'movements', label: t('Stock Ledger (Movements)'), icon: <RefreshCw size={14} />, path: '/inventory/movements' },
        ].map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { reset(); navigate(item.path); }}
              className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 -mb-[2px] transition-colors whitespace-nowrap
                          ${isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Dashboard Stats */}
      {activeTab === 'levels' && statsData && (
        <InventoryDashboard stats={statsData} />
      )}

      {/* Header */}
      <PageHeader
        title={
          activeTab === 'levels' ? t('Stock Levels') :
            activeTab === 'adjustments' ? t('Stock Adjustments') :
              activeTab === 'transfers' ? t('Stock Transfers') :
                activeTab === 'opnames' ? t('Stock Opnames') :
                  t('Stock Ledger (Movements)')
        }
        subtitle={t('Manage storage distribution, view discrepancies, and track history ledger.')}
        action={
          activeTab !== 'movements' && activeTab !== 'levels' && (
            <button
              onClick={() => {
                if (activeTab === 'adjustments') setActiveFormType('adjustment')
                else if (activeTab === 'transfers') setActiveFormType('transfer')
                else if (activeTab === 'opnames') setActiveFormType('opname')
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white
                         bg-gradient-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus size={16} />
              {activeTab === 'adjustments' ? t('New Adjustment') :
                activeTab === 'transfers' ? t('New Transfer') :
                  t('Record Opname')}
            </button>
          )
        }
      />

      {/* Advanced Filters */}
      <div className="bg-card rounded-2xl border border-border/60 p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Global Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('common.search')}
              className="pl-9 form-input"
            />
          </div>

          {/* Warehouse Location Filter */}
          <div>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="form-input text-xs"
            >
              <option value="">{t('inventory.all_warehouses', 'All Warehouses')}</option>
              {(warehouses ?? []).map((w: any) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter (Levels tab only) */}
          {activeTab === 'levels' && (
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input text-xs"
              >
                <option value="">{t('inventory.all_categories', 'All Categories')}</option>
                {(categories ?? []).map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Brand Filter (Levels tab only) */}
          {activeTab === 'levels' && (
            <div>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="form-input text-xs"
              >
                <option value="">{t('inventory.all_brands', 'All Brands')}</option>
                {(brands ?? []).map((b: any) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter */}
          {activeTab !== 'movements' && (
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-input text-xs"
              >
                <option value="">{t('inventory.all_statuses', 'All Statuses')}</option>
                {activeTab === 'levels' ? (
                  <>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="overstock">Overstock</option>
                    <option value="healthy">Healthy Stock</option>
                  </>
                ) : activeTab === 'transfers' ? (
                  <>
                    <option value="draft">Draft</option>
                    <option value="in_transit">In Transit</option>
                    <option value="received">Received</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                ) : (
                  <>
                    <option value="draft">Draft</option>
                    <option value="approved">Approved / Done</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Tool actions and Reset */}
          <div className="flex items-center gap-2">
            <ResetButton onClick={handleResetFilters} label={t("common.reset")} />
            
            {/* Column Selector */}
            {activeTab === 'levels' && (
              <div className="relative">
                <button
                  onClick={() => setShowColMenu(!showColMenu)}
                  className="p-2 border border-border bg-card rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <Columns size={16} />
                </button>
                {showColMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-50 p-2 space-y-1">
                    {[
                      { key: 'warehouse', label: 'Warehouse' },
                      { key: 'product', label: 'Product Name' },
                      { key: 'sku', label: 'SKU' },
                      { key: 'qty', label: 'Qty' },
                      { key: 'reserved', label: 'Reserved Qty' },
                      { key: 'available', label: 'Available Qty' },
                      { key: 'status', label: 'Status' },
                    ].map(col => (
                      <label key={col.key} className="flex items-center gap-2 p-1.5 hover:bg-muted rounded-lg text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(col.key)}
                          onChange={() => toggleColumn(col.key)}
                        />
                        {col.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CSV Actions */}
            <button
              onClick={handleExport}
              className="p-2 border border-border bg-card rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Export CSV"
            >
              <Download size={16} />
            </button>

            <label className="p-2 border border-border bg-card rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer" title="Import CSV">
              <Upload size={16} />
              <input type="file" onChange={handleImport} accept=".csv" className="hidden" />
            </label>
          </div>
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
                {visibleColumns.includes('qty') && <th className="text-left py-3 px-4">{t('inventory.qty', 'Quantity')}</th>}
                {visibleColumns.includes('reserved') && <th className="text-left py-3 px-4">{t('inventory.reserved', 'Reserved')}</th>}
                {visibleColumns.includes('available') && <th className="text-left py-3 px-4">{t('inventory.available', 'Available')}</th>}
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
                  {visibleColumns.includes('qty') && <td className="py-3.5 px-4 text-sm font-bold text-foreground">{parseFloat(item.quantity)}</td>}
                  {visibleColumns.includes('reserved') && <td className="py-3.5 px-4 text-sm font-medium text-amber-500">{parseFloat(item.reserved_quantity)}</td>}
                  {visibleColumns.includes('available') && <td className="py-3.5 px-4 text-sm font-bold text-emerald-500">{parseFloat(item.available_quantity)}</td>}
                  {visibleColumns.includes('status') && (
                    <td className="py-3.5 px-4 text-xs">
                      {parseFloat(item.quantity) <= parseFloat(item.reorder_point) ? (
                        <span className="badge-danger inline-flex items-center gap-1">
                          <AlertTriangle size={12} /> Low Stock
                        </span>
                      ) : (
                        <span className="badge-success">In Stock</span>
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
                    <span className={`badge ${adj.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                      {adj.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => { setActiveFormType('adjustment'); setActiveFormId(adj.id); }}
                      className="p-1.5 hover:bg-muted rounded-xl transition-colors"
                    >
                      <Edit size={14} className="text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => deleteAdjustmentMutation.mutate(adj.id)}
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
                    <span className={`badge ${tr.status === 'received' ? 'badge-success' : tr.status === 'in_transit' ? 'badge-info' : 'badge-warning'}`}>
                      {tr.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => { setActiveFormType('transfer'); setActiveFormId(tr.id); }}
                      className="p-1.5 hover:bg-muted rounded-xl transition-colors"
                    >
                      <Edit size={14} className="text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => deleteTransferMutation.mutate(tr.id)}
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
                    <span className={`badge ${op.status === 'done' ? 'badge-success' : 'badge-warning'}`}>
                      {op.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => { setActiveFormType('opname'); setActiveFormId(op.id); }}
                      className="p-1.5 hover:bg-muted rounded-xl transition-colors"
                    >
                      <Edit size={14} className="text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => deleteOpnameMutation.mutate(op.id)}
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
                    <span className={`badge ${m.quantity > 0 ? 'badge-success' : 'badge-danger'}`}>
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
    </div>
  )
}

export default InventoryPage
