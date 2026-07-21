import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Filter, Edit2, Trash2, Eye,
  Package, Download, RefreshCw, Star, X, Loader2,
  Image as ImageIcon, DollarSign, Layers, Settings,
  AlertCircle, ChevronUp, ChevronDown, Check, Upload, Trash,
  Percent, List, EyeOff, LayoutGrid, Calendar, HelpCircle, Archive, CheckCircle2,
  Tag, Sliders, Printer, Warehouse
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import EmptyState from '@/components/shared/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useTranslation } from 'react-i18next'

import CategoriesPage from '@/modules/categories/pages/CategoriesPage'
import BrandsPage from '@/pages/brands/BrandsPage'
import UnitsPage from '@/pages/settings/UnitsPage'
import AttributesPage from '@/pages/attributes/AttributesPage'
import TaxesPage from '@/pages/products/TaxesPage'

interface Product {
  id:                  number
  name:                string
  sku:                 string
  barcode?:            string
  selling_price:       number
  cost_price?:         number
  compare_price?:      number
  weight?:             number
  length?:             number
  width?:              number
  height?:             number
  track_inventory:     boolean
  low_stock_threshold: number
  status:              string
  is_featured:         boolean
  is_digital:          boolean
  sold_count:          number
  rating_avg:          number
  description?:        string
  primary_image?:      { image: string } | null
  category?:           { id: number; name: string } | null
  brand?:              { id: number; name: string } | null
  unit?:               { id: number; name: string } | null
  tax?:                { id: number; name: string } | null
  stock?:              number
  deleted_at?:         string | null
}

const STATUS_BADGE: Record<string, string> = {
  active:   'badge-success',
  inactive: 'badge-muted',
  draft:    'badge-warning',
  archived: 'badge-danger',
}

const ProductsPage: React.FC = () => {
  const { t } = useTranslation(['products', 'deleteConfirm', 'buttons', 'common'])
  const qc    = useQueryClient()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    id: number | null
    force: boolean
    name?: string
  }>({
    open: false,
    id: null,
    force: false,
    name: ''
  })

  // Workspace tab routing
  const activeWorkspaceTab = (searchParams.get('workspaceTab') as 'products' | 'categories' | 'brands' | 'units' | 'taxes' | 'attributes') || 'products'
  const setActiveWorkspaceTab = (tab: string) => {
    if (tab === 'products') {
      setSearchParams({})
    } else {
      setSearchParams({ workspaceTab: tab })
    }
  }

  // List states
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
  } = useServerPagination({ storageKey: 'products' })

  // Filters state
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [unitFilter, setUnitFilter] = useState('')
  const [taxFilter, setTaxFilter] = useState('')
  const [stockLevelFilter, setStockLevelFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [warehouseFilter, setWarehouseFilter] = useState('')
  const [priceMinFilter, setPriceMinFilter] = useState('')
  const [priceMaxFilter, setPriceMaxFilter] = useState('')
  const [recycleBinMode, setRecycleBinMode] = useState(false)

  // Sorting
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // UI state
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    image: true,
    name: true,
    sku: true,
    category: true,
    price: true,
    stock: true,
    status: true,
    rating: true,
  })

  // Count active filters
  const activeFiltersCount = [
    statusFilter,
    categoryFilter,
    brandFilter,
    unitFilter,
    taxFilter,
    stockLevelFilter,
    startDate,
    endDate,
    warehouseFilter,
    priceMinFilter,
    priceMaxFilter
  ].filter(Boolean).length

  // Import file state
  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
  }

  // Get absolute URL helper
  const getAbsoluteImageUrl = (urlOrPath?: any) => {
    if (!urlOrPath) return ''
    if (typeof urlOrPath !== 'string') {
      if (urlOrPath.image) urlOrPath = urlOrPath.image
      else if (urlOrPath.image_path) urlOrPath = urlOrPath.image_path
      else if (urlOrPath.url) urlOrPath = urlOrPath.url
      else return ''
    }
    if (typeof urlOrPath !== 'string') return ''
    if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
      return urlOrPath
    }
    const cleaned = urlOrPath.startsWith('/') ? urlOrPath.substring(1) : urlOrPath
    const path = cleaned.startsWith('storage/') ? cleaned : `storage/${cleaned}`
    const baseUrl = api.defaults.baseURL ? api.defaults.baseURL.split('/api')[0] : 'http://127.0.0.1:8001'
    return `${baseUrl}/${path}`
  }

  // Queries
  const { data: statsData } = useQuery({
    queryKey: ['products-stats', debouncedSearch, statusFilter, categoryFilter, brandFilter, recycleBinMode],
    queryFn: () => api.get('/products/stats').then(r => r.data.data),
  })

  const { data: inventoryStats } = useQuery({
    queryKey: ['inventory-stats'],
    queryFn: () => api.get('/inventory/stats').then(r => r.data.data),
  })

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses-select'],
    queryFn: () => api.get('/warehouses', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      'products', page, debouncedSearch, perPage, sortBy, sortOrder,
      statusFilter, categoryFilter, brandFilter, unitFilter, taxFilter,
      stockLevelFilter, startDate, endDate, recycleBinMode, warehouseFilter,
      priceMinFilter, priceMaxFilter
    ],
    queryFn: () => api.get('/products', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        status: recycleBinMode ? 'deleted' : statusFilter,
        category_id: categoryFilter,
        brand_id: brandFilter,
        unit_id: unitFilter,
        tax_id: taxFilter,
        stock_level: stockLevelFilter,
        start_date: startDate,
        end_date: endDate,
        warehouse_id: warehouseFilter,
        price_min: priceMinFilter,
        price_max: priceMaxFilter
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const products: Product[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Select queries for filters
  const { data: categories } = useQuery({
    queryKey: ['categories-select'],
    queryFn: () => api.get('/categories', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: brands } = useQuery({
    queryKey: ['brands-select'],
    queryFn: () => api.get('/brands', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: units } = useQuery({
    queryKey: ['units-select'],
    queryFn: () => api.get('/units', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: taxes } = useQuery({
    queryKey: ['taxes-select'],
    queryFn: () => api.get('/taxes', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: (data, id) => {
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-stats'] })
      toast.success('Product deleted successfully')
      adjustAfterDelete(products.length)
      setSelectedRows(r => r.filter(x => x !== id))
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete product')
    }
  })

  const restoreMutation = useMutation({
    mutationFn: (id: number) => api.post(`/products/${id}/restore`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-stats'] })
      toast.success('Product restored successfully')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to restore product')
    }
  })

  const forceDeleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}/force`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-stats'] })
      toast.success('Product permanently deleted')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to permanently delete product')
    }
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => api.post('/products/bulk-delete', { ids }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-stats'] })
      toast.success(res.data.message || 'Selected products deleted successfully')
      setSelectedRows([])
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete selected products')
    }
  })

  const bulkRestoreMutation = useMutation({
    mutationFn: (ids: number[]) => api.post('/products/bulk-restore', { ids }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-stats'] })
      toast.success(res.data.message || 'Selected products restored successfully')
      setSelectedRows([])
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to restore selected products')
    }
  })

  const handleExport = () => {
    toast.info('Generating product CSV export... download will begin shortly.')
    api.get('/products/export', { 
      params: {
        search: debouncedSearch,
        status: recycleBinMode ? 'deleted' : statusFilter,
        category_id: categoryFilter,
        brand_id: brandFilter,
        unit_id: unitFilter,
        tax_id: taxFilter,
        stock_level: stockLevelFilter
      },
      responseType: 'blob' 
    })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
      .catch(() => toast.error('Failed to export products'))
  }

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!importFile) return
    setImporting(true)
    const fd = new FormData()
    fd.append('file', importFile)
    try {
      const res = await api.post('/products/import', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(res.data.message || 'Import completed')
      setImportOpen(false)
      setImportFile(null)
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-stats'] })
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  const toggleColumn = (col: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }))
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: t('nav.group.productInventory') }, { label: t('nav.allProducts') }]} />

      {/* Product Workspace Tabs */}
      <div className="flex border border-border bg-card rounded-2xl p-1 overflow-x-auto gap-1 shadow-sm">
        {[
          { id: 'products',   label: t('nav.allProducts'), icon: <Package size={15} /> },
          { id: 'categories', label: t('nav.categories'), icon: <Layers size={15} /> },
          { id: 'brands',     label: t('nav.brands'), icon: <Tag size={15} /> },
          { id: 'units',      label: t('nav.units'), icon: <Settings size={15} /> },
          { id: 'taxes',      label: t('products.taxes'), icon: <Percent size={15} /> },
          { id: 'attributes', label: t('nav.attributes'), icon: <List size={15} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveWorkspaceTab(tab.id)}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap
                        ${activeWorkspaceTab === tab.id
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeWorkspaceTab === 'products' ? (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                {t('products.title', 'Product Management')}
              </h1>
              <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                {t('products.subtitle', 'Manage products, categories, brands, inventory, pricing, stock levels, and product lifecycle across the Enterprise E-Commerce + POS platform.')}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setRecycleBinMode(!recycleBinMode)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border transition-all duration-200 shadow-sm
                           ${recycleBinMode 
                             ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20' 
                             : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
              >
                <Trash2 size={15} /> {recycleBinMode ? 'Exit Trash' : 'Trash Bin'}
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm"
              >
                <Download size={15} />
                {t('buttons.export')}
              </button>

              <button
                onClick={() => setImportOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm"
              >
                <Upload size={15} />
                {t('buttons.import')}
              </button>

              <button
                onClick={() => navigate('/products/create')}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm"
              >
                <Plus size={16} />
                {t('products.addProduct', 'Add Product')}
              </button>
            </div>
          </div>

          {/* Premium Statistic Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Products */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('products.totalProducts', 'Total Products')}</p>
                <p className="text-3xl font-extrabold text-foreground tracking-tight">{statsData?.total_products ?? 0}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <span className="text-emerald-500 font-bold">{statsData?.active_products ?? 0} {t('common.active')}</span>
                  <span>•</span>
                  <span>{statsData?.inactive_products ?? 0} {t('common.inactive')}</span>
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500">
                <Package size={22} />
              </div>
            </motion.div>

            {/* Card 2: Categories & Brands */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('products.categoriesBrands', 'Categories & Brands')}</p>
                <p className="text-3xl font-extrabold text-foreground tracking-tight">{categories?.length ?? 0}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <span className="font-semibold">{brands?.length ?? 0} {t('nav.brands')}</span>
                  <span>{t('products.defined', 'defined')}</span>
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
                <LayoutGrid size={22} />
              </div>
            </motion.div>

            {/* Card 3: Inventory Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('products.inventoryStatus', 'Inventory Status')}</p>
                <p className="text-3xl font-extrabold text-foreground tracking-tight">{(inventoryStats?.summary?.total_qty ?? 0).toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
                  <span className="text-rose-500 font-bold">{inventoryStats?.summary?.low_stock ?? 0} {t('products.lowStockAlert', 'Low')}</span>
                  <span>•</span>
                  <span className="text-red-600 font-bold">{inventoryStats?.summary?.out_of_stock ?? 0} {t('products.outOfStock', 'Out')}</span>
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-orange-500/10 text-orange-500">
                <Warehouse size={22} />
              </div>
            </motion.div>

            {/* Card 4: Product Value */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('products.inventoryValue', 'Inventory Value')}</p>
                <p className="text-3xl font-extrabold text-foreground tracking-tight">
                  ${(inventoryStats?.summary?.inventory_value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {t('products.avgCost', 'Avg Cost')}: ${(products.length > 0 ? (products.reduce((acc, p) => acc + (p.cost_price ?? 0), 0) / products.length) : 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <DollarSign size={22} />
              </div>
            </motion.div>
          </div>

          {/* Bulk Actions Panel */}
          {selectedRows.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                <AlertCircle size={16} />
                <span>{selectedRows.length} {t('products.selectedCount')}</span>
              </div>
              <div className="flex items-center gap-2">
                {recycleBinMode ? (
                  <>
                    <button
                      onClick={() => bulkRestoreMutation.mutate(selectedRows)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
                    >
                      <RefreshCw size={13} />
                      {t('products.restoreSelected')}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(t('confirm.deleteMessage', { defaultValue: 'Permanently delete selected products? This cannot be undone.' }))) {
                          selectedRows.forEach(id => forceDeleteMutation.mutate(id))
                          setSelectedRows([])
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500"
                    >
                      <Trash size={13} />
                      {t('products.permanentDelete')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => bulkDeleteMutation.mutate(selectedRows)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500"
                  >
                    <Trash size={13} />
                    {t('products.deleteSelected')}
                  </button>
                )}
                <button
                  onClick={() => setSelectedRows([])}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1.5"
                >
                  {t('buttons.cancel')}
                </button>
              </div>
            </div>
          )}

          {/* Premium Search & Filter Toolbar */}
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-sm">
            {/* Left side: Search & Advanced Filter Toggle & Reset */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[260px] sm:max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  placeholder={t('products.searchPlaceholder', 'Search Product, SKU, Barcode, Brand...')}
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

              <ResetButton onClick={() => {
                setSearch('')
                setStatusFilter('')
                setCategoryFilter('')
                setBrandFilter('')
                setUnitFilter('')
                setTaxFilter('')
                setStockLevelFilter('')
                setStartDate('')
                setEndDate('')
                setWarehouseFilter('')
                setRecycleBinMode(false)
                setSelectedRows([])
                setPage(1)
              }} />
            </div>

            {/* Right side: Actions (Refresh, Print, Column settings) */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                onClick={() => {
                  qc.invalidateQueries({ queryKey: ['products'] })
                  qc.invalidateQueries({ queryKey: ['products-stats'] })
                  qc.invalidateQueries({ queryKey: ['inventory-stats'] })
                }}
                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm"
                title={t('common.refresh', 'Refresh')}
              >
                <RefreshCw size={14} />
              </button>


              {/* Column Visibility Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setColumnDropdownOpen(!columnDropdownOpen)}
                  className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm select-none"
                  title={t('products.toggleColumns', 'Columns')}
                >
                  <Settings size={14} />
                </button>
                {columnDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setColumnDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl p-2 z-20 space-y-1">
                      <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase">{t('products.toggleColumns', 'Toggle Columns')}</p>
                      {Object.keys(visibleColumns).map((col) => (
                        <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-xl text-xs cursor-pointer capitalize text-foreground">
                          <input
                            type="checkbox"
                            checked={visibleColumns[col as keyof typeof visibleColumns]}
                            onChange={() => toggleColumn(col as keyof typeof visibleColumns)}
                            className="form-checkbox h-3.5 w-3.5 text-primary rounded border-border"
                          />
                          {col === 'name' ? t('products.productName') : t('products.' + col)}
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Table list */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <TableWrapper isFetching={isFetching}>
              <table className="w-full data-table">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="w-12 text-center">
                      <input
                        type="checkbox"
                        checked={products.length > 0 && selectedRows.length === products.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(products.map(p => p.id))
                          } else {
                            setSelectedRows([])
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-primary rounded border-border focus:ring-primary"
                      />
                    </th>
                    {visibleColumns.image && <th className="text-left w-16 py-3">{t('products.image')}</th>}
                    {visibleColumns.name && (
                      <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                        {t('products.productName')} {renderSortIcon('name')}
                      </th>
                    )}
                    {visibleColumns.sku && (
                      <th onClick={() => handleSort('sku')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                        {t('products.sku')} {renderSortIcon('sku')}
                      </th>
                    )}
                    {visibleColumns.category && (
                      <th onClick={() => handleSort('category_id')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                        {t('products.category')} {renderSortIcon('category_id')}
                      </th>
                    )}
                    {visibleColumns.price && (
                      <th onClick={() => handleSort('selling_price')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                        {t('products.price')} {renderSortIcon('selling_price')}
                      </th>
                    )}
                    {visibleColumns.stock && (
                      <th onClick={() => handleSort('stock')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                        {t('products.stock')} {renderSortIcon('stock')}
                      </th>
                    )}
                    {visibleColumns.status && (
                      <th onClick={() => handleSort('status')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                        {t('products.status')} {renderSortIcon('status')}
                      </th>
                    )}
                    {visibleColumns.rating && (
                      <th onClick={() => handleSort('rating_avg')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                        {t('products.rating')} {renderSortIcon('rating_avg')}
                      </th>
                    )}
                    <th className="text-right pr-4 py-3 select-none w-28">{t('products.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="w-12"><div className="skeleton h-4 w-4 rounded mx-auto" /></td>
                        {Object.values(visibleColumns).filter(Boolean).map((_, j) => (
                          <td key={j}><div className="skeleton h-4 w-24 rounded" /></td>
                        ))}
                        <td><div className="skeleton h-4 w-12 rounded ml-auto pr-4" /></td>
                      </tr>
                    ))
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="group border-b border-border/40 hover:bg-muted/30">
                        <td className="w-12 text-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(product.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRows(prev => [...prev, product.id])
                              } else {
                                setSelectedRows(prev => prev.filter(id => id !== product.id))
                              }
                            }}
                            className="form-checkbox h-4 w-4 text-primary rounded border-border focus:ring-primary"
                          />
                        </td>
                        {visibleColumns.image && (
                          <td className="py-3">
                            {product.primary_image ? (
                              <img 
                                src={getAbsoluteImageUrl(product.primary_image.image || product.primary_image)} 
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover border border-border flex-shrink-0" 
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                <Package size={16} className="text-muted-foreground/50" />
                              </div>
                            )}
                          </td>
                        )}
                        {visibleColumns.name && (
                          <td className="py-3">
                            <div>
                              <p className="font-medium text-foreground text-sm">{product.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {product.is_featured && (
                                  <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
                                    <Star size={10} fill="currentColor" /> {t('products.featured')}
                                  </span>
                                )}
                                {product.is_digital && (
                                  <span className="text-[10px] text-indigo-500 font-semibold">
                                    {t('products.digital')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                        )}
                        {visibleColumns.sku && <td className="text-muted-foreground font-mono text-xs py-3">{product.sku}</td>}
                        {visibleColumns.category && (
                          <td className="text-muted-foreground text-sm py-3">
                            {product.category?.name ?? '—'}
                          </td>
                        )}
                        {visibleColumns.price && (
                          <td className="font-mono text-sm font-semibold text-foreground py-3">
                            ${product.selling_price}
                          </td>
                        )}
                        {visibleColumns.stock && (
                          <td className="py-3">
                            {product.track_inventory ? (
                              <div className="flex flex-col">
                                <span className={`text-sm font-semibold ${(product.stock ?? 0) <= product.low_stock_threshold ? 'text-rose-500' : 'text-foreground'}`}>
                                  {product.stock ?? 0} {product.unit?.name ?? t('products.unit')}
                                </span>
                                {(product.stock ?? 0) <= product.low_stock_threshold && (
                                  <span className="text-[10px] text-rose-500/80 font-medium">
                                    {(product.stock ?? 0) === 0 ? t('products.outOfStock') : t('products.lowStockAlert')}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">{t('products.unlimited')}</span>
                            )}
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td className="py-3">
                            <span className={STATUS_BADGE[product.status] || 'badge-muted'}>
                              {t('common.' + product.status)}
                            </span>
                          </td>
                        )}
                        {visibleColumns.rating && (
                          <td className="py-3">
                            <div className="flex items-center gap-0.5 text-amber-500 font-semibold text-sm">
                              <Star size={13} fill="currentColor" />
                              <span>{product.rating_avg ? product.rating_avg.toFixed(1) : '—'}</span>
                            </div>
                          </td>
                        )}
                        <td className="text-right pr-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            {recycleBinMode ? (
                              <>
                                <button
                                  onClick={() => restoreMutation.mutate(product.id)}
                                  className="p-1.5 hover:bg-muted rounded-lg text-indigo-500 hover:text-indigo-600 transition-colors"
                                  title={t('buttons.restore')}
                                >
                                  <RefreshCw size={14} />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm({ open: true, id: product.id, force: true, name: product.name })}
                                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                                  title={t('products.permanentDelete')}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => navigate(`/products/${product.id}/edit`)}
                                  className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm({ open: true, id: product.id, force: false, name: product.name })}
                                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  {!isLoading && products.length === 0 && (
                    <EmptyState cols={10} />
                  )}
                </tbody>
              </table>
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
        </>
      ) : (
        <>
          {activeWorkspaceTab === 'categories' && <CategoriesPage isTab />}
          {activeWorkspaceTab === 'brands' && <BrandsPage isTab />}
          {activeWorkspaceTab === 'units' && <UnitsPage isTab />}
          {activeWorkspaceTab === 'taxes' && <TaxesPage isTab />}
          {activeWorkspaceTab === 'attributes' && <AttributesPage isTab />}
        </>
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
                      {t('products.filterProducts', 'Filter Products')}
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
                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('products.status', 'Status')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: '', label: t('products.allStatuses', 'All Statuses'), activeClass: 'bg-muted border-primary text-foreground', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                      { value: 'active', label: t('common.active', 'Active'), activeClass: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                      { value: 'inactive', label: t('common.inactive', 'Inactive'), activeClass: 'bg-slate-500/10 border-slate-500/40 text-slate-600 dark:text-slate-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                      { value: 'draft', label: t('common.draft', 'Draft'), activeClass: 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                      { value: 'archived', label: t('common.archived', 'Archived'), activeClass: 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setStatusFilter(opt.value); setPage(1) }}
                        disabled={recycleBinMode}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all text-center select-none active:scale-95 duration-100
                                   ${statusFilter === opt.value ? opt.activeClass : opt.inactiveClass}
                                   ${recycleBinMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Level Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('products.stockLevel', 'Stock Level')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: '', label: t('products.allStockLevels', 'All Levels'), activeClass: 'bg-muted border-primary text-foreground', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                      { value: 'low', label: t('products.lowStockAlerts', 'Low Stock'), activeClass: 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                      { value: 'out', label: t('products.outOfStock', 'Out of Stock'), activeClass: 'bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                      { value: 'in', label: t('products.healthyStock', 'In Stock'), activeClass: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setStockLevelFilter(opt.value); setPage(1) }}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all text-center select-none active:scale-95 duration-100
                                   ${stockLevelFilter === opt.value ? opt.activeClass : opt.inactiveClass}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('products.category', 'Category')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                      <Layers size={14} />
                    </div>
                    <select
                      value={categoryFilter}
                      onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
                      className="form-input pl-9 w-full text-sm rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                    >
                      <option value="">{t('products.allCategories', 'All Categories')}</option>
                      {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('products.brand', 'Brand')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                      <Tag size={14} />
                    </div>
                    <select
                      value={brandFilter}
                      onChange={(e) => { setBrandFilter(e.target.value); setPage(1) }}
                      className="form-input pl-9 w-full text-sm rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                    >
                      <option value="">{t('products.allBrands', 'All Brands')}</option>
                      {brands?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Warehouse */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('products.warehouse', 'Warehouse')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                      <Warehouse size={14} />
                    </div>
                    <select
                      value={warehouseFilter}
                      onChange={(e) => { setWarehouseFilter(e.target.value); setPage(1) }}
                      className="form-input pl-9 w-full text-sm rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                    >
                      <option value="">{t('products.allWarehouses', 'All Warehouses')}</option>
                      {warehouses?.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2 pt-4 border-t border-border/80">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('products.priceRange', 'Price Range')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Min Price ($)</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0.00"
                        value={priceMinFilter}
                        onChange={(e) => { setPriceMinFilter(e.target.value); setPage(1) }}
                        className="form-input w-full text-xs rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Max Price ($)</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Any"
                        value={priceMaxFilter}
                        onChange={(e) => { setPriceMaxFilter(e.target.value); setPage(1) }}
                        className="form-input w-full text-xs rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Unit */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('products.unit', 'Unit')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                      <Package size={14} />
                    </div>
                    <select
                      value={unitFilter}
                      onChange={(e) => { setUnitFilter(e.target.value); setPage(1) }}
                      className="form-input pl-9 w-full text-sm rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                    >
                      <option value="">{t('products.allUnits', 'All Units')}</option>
                      {units?.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Tax Rules */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('products.taxRules', 'Tax Rules')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                      <Percent size={14} />
                    </div>
                    <select
                      value={taxFilter}
                      onChange={(e) => { setTaxFilter(e.target.value); setPage(1) }}
                      className="form-input pl-9 w-full text-sm rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                    >
                      <option value="">{t('products.allTaxRules', 'All Tax Rules')}</option>
                      {taxes?.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-3 pt-4 border-t border-border/80">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('products.dateRange', 'Created Date')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">
                        {t('products.startDate', 'Start Date')}
                      </span>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                          <Calendar size={13} />
                        </div>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => { setStartDate(e.target.value); setPage(1) }}
                          className="form-input pl-9 w-full text-xs rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">
                        {t('products.endDate', 'End Date')}
                      </span>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                          <Calendar size={13} />
                        </div>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => { setEndDate(e.target.value); setPage(1) }}
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
                    setSearch('')
                    setStatusFilter('')
                    setCategoryFilter('')
                    setBrandFilter('')
                    setUnitFilter('')
                    setTaxFilter('')
                    setStockLevelFilter('')
                    setStartDate('')
                    setEndDate('')
                    setWarehouseFilter('')
                    setPriceMinFilter('')
                    setPriceMaxFilter('')
                    setRecycleBinMode(false)
                    setSelectedRows([])
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

      {/* CSV Import Modal */}
      <AnimatePresence>
        {importOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">{t('products.importProducts')}</h3>
                <button onClick={() => setImportOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleImport} className="p-6 space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/10 transition-colors">
                  <Upload className="mx-auto text-muted-foreground mb-2" size={32} />
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="csv-products-upload"
                    required
                  />
                  <label htmlFor="csv-products-upload" className="cursor-pointer font-medium text-primary hover:underline">
                    {importFile ? importFile.name : t('products.clickSelectCSV')}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">{t('products.columnsNeededHint')}</p>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setImportOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg"
                  >
                    {t('buttons.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={importing || !importFile}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg flex items-center gap-1.5"
                  >
                    {importing && <Loader2 size={14} className="animate-spin" />}
                    {t('buttons.import')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
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
                <h3 className="text-lg font-bold text-foreground text-left">
                  {t('deleteConfirm.title')}
                </h3>
              </div>

              {/* Message text left aligned */}
              <div className="text-left space-y-1.5">
                <p className="text-sm text-foreground font-medium">
                  {deleteConfirm.force
                    ? t('confirm.permanent_delete_prompt', { defaultValue: `Are you sure you want to permanently delete product "${deleteConfirm.name}"?` })
                    : t('confirm.delete_prompt', { defaultValue: `Are you sure you want to delete product "${deleteConfirm.name}"?` })}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                  {deleteConfirm.force
                    ? t('confirm.permanent_delete_warning', { defaultValue: 'This action is permanent and cannot be recovered.' })
                    : t('deleteConfirm.warning')}
                </p>
              </div>

              {/* Actions right aligned */}
              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm({ open: false, id: null, force: false, name: '' })}
                  className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all active:scale-95 duration-100"
                >
                  {t('deleteConfirm.cancel')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (deleteConfirm.id) {
                      if (deleteConfirm.force) {
                        forceDeleteMutation.mutate(deleteConfirm.id)
                      } else {
                        deleteMutation.mutate(deleteConfirm.id)
                      }
                    }
                    setDeleteConfirm({ open: false, id: null, force: false, name: '' })
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

export default ProductsPage
