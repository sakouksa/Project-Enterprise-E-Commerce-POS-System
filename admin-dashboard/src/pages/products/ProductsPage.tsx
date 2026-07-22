import React, { useState, useEffect, useMemo } from 'react'
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
import Breadcrumb from '@/components/common/Breadcrumb'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'

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

const ProductsPage: React.FC = () => {
  const { t, i18n } = useTranslation(['products', 'deleteConfirm', 'buttons', 'common'])
  const qc    = useQueryClient()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const txt = (key: string) => t(`products.${key}`, t(`common.${key}`, key))

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

  // Sub-tab add modal triggers
  const [categoryAddTrigger, setCategoryAddTrigger] = useState(0)
  const [brandAddTrigger, setBrandAddTrigger] = useState(0)
  const [unitAddTrigger, setUnitAddTrigger] = useState(0)
  const [taxAddTrigger, setTaxAddTrigger] = useState(0)
  const [attributeAddTrigger, setAttributeAddTrigger] = useState(0)

  useEffect(() => { if (categoryAddTrigger > 0) { const t = setTimeout(() => setCategoryAddTrigger(0), 200); return () => clearTimeout(t) } }, [categoryAddTrigger])
  useEffect(() => { if (brandAddTrigger > 0) { const t = setTimeout(() => setBrandAddTrigger(0), 200); return () => clearTimeout(t) } }, [brandAddTrigger])
  useEffect(() => { if (unitAddTrigger > 0) { const t = setTimeout(() => setUnitAddTrigger(0), 200); return () => clearTimeout(t) } }, [unitAddTrigger])
  useEffect(() => { if (taxAddTrigger > 0) { const t = setTimeout(() => setTaxAddTrigger(0), 200); return () => clearTimeout(t) } }, [taxAddTrigger])
  useEffect(() => { if (attributeAddTrigger > 0) { const t = setTimeout(() => setAttributeAddTrigger(0), 200); return () => clearTimeout(t) } }, [attributeAddTrigger])

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
      <Breadcrumb items={[{ label: txt('productInventory') }, { label: txt('allProducts') }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            {txt('title')}
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            {txt('subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {activeWorkspaceTab === 'products' && (
            <button
              onClick={() => setRecycleBinMode(!recycleBinMode)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border transition-all duration-200 shadow-sm cursor-pointer
                         ${recycleBinMode 
                           ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20' 
                           : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              <Trash2 size={15} /> {recycleBinMode ? txt('exitTrash') : txt('trashBin')}
            </button>
          )}

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm cursor-pointer"
          >
            <Download size={15} />
            {txt('export')}
          </button>

          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm cursor-pointer"
          >
            <Upload size={15} />
            {txt('import')}
          </button>

          {/* Dynamic Add Button */}
          {activeWorkspaceTab === 'products' && (
            <button
              onClick={() => navigate('/products/create')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              {txt('addProduct')}
            </button>
          )}
          {activeWorkspaceTab === 'categories' && (
            <button
              onClick={() => setCategoryAddTrigger(c => c + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              {txt('addCategory')}
            </button>
          )}
          {activeWorkspaceTab === 'brands' && (
            <button
              onClick={() => setBrandAddTrigger(c => c + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              {txt('addBrand')}
            </button>
          )}
          {activeWorkspaceTab === 'units' && (
            <button
              onClick={() => setUnitAddTrigger(c => c + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              {txt('addUnit')}
            </button>
          )}
          {activeWorkspaceTab === 'taxes' && (
            <button
              onClick={() => setTaxAddTrigger(c => c + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              {txt('addTaxRule')}
            </button>
          )}
          {activeWorkspaceTab === 'attributes' && (
            <button
              onClick={() => setAttributeAddTrigger(c => c + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              {txt('addAttribute')}
            </button>
          )}
        </div>
      </div>

      {/* Premium Statistic Summary Cards (Pure USD $ Calculations) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Products */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{txt('card1Title')}</p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">{statsData?.total_products ?? products.length}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="text-emerald-500 font-bold">{statsData?.active_products ?? products.filter(p => p.status === 'active').length} {txt('active')}</span>
              <span>•</span>
              <span>{statsData?.inactive_products ?? products.filter(p => p.status !== 'active').length} {txt('inactive')}</span>
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
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{txt('card2Title')}</p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">{categories?.length ?? 0}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="font-semibold">{brands?.length ?? 0}</span>
              <span>{txt('brandsDefined')}</span>
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
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{txt('card3Title')}</p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              {(inventoryStats?.summary?.total_qty ?? products.reduce((acc, p) => acc + (p.stock ?? 0), 0)).toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-rose-500 font-bold">{inventoryStats?.summary?.low_stock ?? products.filter(p => (p.stock ?? 0) <= (p.low_stock_threshold || 5) && (p.stock ?? 0) > 0).length} {txt('lowStock')}</span>
              <span>•</span>
              <span className="text-red-600 font-bold">{inventoryStats?.summary?.out_of_stock ?? products.filter(p => (p.stock ?? 0) <= 0).length} {txt('outOfStock')}</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-orange-500/10 text-orange-500">
            <Warehouse size={22} />
          </div>
        </motion.div>

        {/* Card 4: Inventory Value ($ USD) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{txt('card4Title')}</p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              ${(inventoryStats?.summary?.inventory_value ?? products.reduce((acc, p) => acc + ((p.cost_price || p.selling_price || 0) * (p.stock ?? 1)), 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {txt('avgCost')}: ${(products.length > 0 ? (products.reduce((acc, p) => acc + (p.cost_price || p.selling_price || 0), 0) / products.length) : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <DollarSign size={22} />
          </div>
        </motion.div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex border border-border bg-card rounded-2xl p-1.5 overflow-x-auto gap-1.5 shadow-2xs">
        {[
          { id: 'products',   label: txt('tabProducts'), icon: Package },
          { id: 'categories', label: txt('tabCategories'), icon: Layers },
          { id: 'brands',     label: txt('tabBrands'), icon: Tag },
          { id: 'units',      label: txt('tabUnits'), icon: Sliders },
          { id: 'taxes',      label: txt('tabTaxes'), icon: Percent },
          { id: 'attributes', label: txt('tabAttributes'), icon: Settings },
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeWorkspaceTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveWorkspaceTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer
                          ${isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {activeWorkspaceTab === 'categories' ? (
        <CategoriesPage isTab triggerAdd={categoryAddTrigger} />
      ) : activeWorkspaceTab === 'brands' ? (
        <BrandsPage isTab triggerAdd={brandAddTrigger} />
      ) : activeWorkspaceTab === 'units' ? (
        <UnitsPage isTab triggerAdd={unitAddTrigger} />
      ) : activeWorkspaceTab === 'taxes' ? (
        <TaxesPage isTab triggerAdd={taxAddTrigger} />
      ) : activeWorkspaceTab === 'attributes' ? (
        <AttributesPage isTab triggerAdd={attributeAddTrigger} />
      ) : (
        <>
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
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 cursor-pointer"
                    >
                      <RefreshCw size={13} />
                      {t('products.restoreSelected')}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(t('confirm.deleteMessage', { defaultValue: 'Permanently delete selected products?' }))) {
                          selectedRows.forEach(id => forceDeleteMutation.mutate(id))
                          setSelectedRows([])
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 cursor-pointer"
                    >
                      <Trash size={13} />
                      {t('products.permanentDelete')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => bulkDeleteMutation.mutate(selectedRows)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 cursor-pointer"
                  >
                    <Trash size={13} />
                    {t('products.deleteSelected')}
                  </button>
                )}
                <button
                  onClick={() => setSelectedRows([])}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 cursor-pointer"
                >
                  {t('buttons.cancel')}
                </button>
              </div>
            </div>
          )}

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-sm">
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[260px] sm:max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  placeholder={txt('searchPlaceholder')}
                  className="form-input pl-9 w-full text-xs rounded-xl border border-border bg-card text-foreground"
                />
              </div>
              <button
                onClick={() => setFilterDrawerOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border transition-all duration-200 shadow-sm cursor-pointer
                           ${activeFiltersCount > 0 
                             ? 'bg-primary/10 border-primary/30 text-primary font-semibold' 
                             : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <Filter size={14} className={activeFiltersCount > 0 ? 'text-primary' : 'text-muted-foreground'} />
                <span>{txt('filter')}</span>
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

            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                onClick={() => {
                  qc.invalidateQueries({ queryKey: ['products'] })
                  qc.invalidateQueries({ queryKey: ['products-stats'] })
                  qc.invalidateQueries({ queryKey: ['inventory-stats'] })
                }}
                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm cursor-pointer"
                title={txt('refresh')}
              >
                <RefreshCw size={14} className={isFetching ? 'animate-spin text-primary' : ''} />
              </button>

              {/* Column Settings Toggle */}
              <div className="relative">
                <button
                  onClick={() => setColumnDropdownOpen(!columnDropdownOpen)}
                  className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm cursor-pointer select-none"
                  title={txt('toggleCols')}
                >
                  <Settings size={14} />
                </button>
                {columnDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setColumnDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl p-2 z-20 space-y-1">
                      <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase">{txt('toggleCols')}</p>
                      {Object.keys(visibleColumns).map((col) => (
                        <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-xl text-xs cursor-pointer capitalize text-foreground">
                          <input
                            type="checkbox"
                            checked={visibleColumns[col as keyof typeof visibleColumns]}
                            onChange={() => toggleColumn(col as keyof typeof visibleColumns)}
                            className="form-checkbox h-3.5 w-3.5 text-primary rounded border-border"
                          />
                          {col === 'image' && txt('colImage')}
                          {col === 'name' && txt('colName')}
                          {col === 'sku' && txt('colSku')}
                          {col === 'category' && txt('colCategory')}
                          {col === 'price' && txt('colPrice')}
                          {col === 'stock' && txt('colStock')}
                          {col === 'status' && txt('colStatus')}
                          {col === 'rating' && txt('colRating')}
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Table List */}
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
                        className="form-checkbox h-4 w-4 text-primary rounded border-border focus:ring-primary cursor-pointer"
                      />
                    </th>
                    {visibleColumns.image && <th className="text-left w-16 py-3">{txt('colImage')}</th>}
                    {visibleColumns.name && (
                      <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                        {txt('colName')} {renderSortIcon('name')}
                      </th>
                    )}
                    {visibleColumns.sku && (
                      <th onClick={() => handleSort('sku')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                        {txt('colSku')} {renderSortIcon('sku')}
                      </th>
                    )}
                    {visibleColumns.category && (
                      <th onClick={() => handleSort('category_id')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                        {txt('colCategory')} {renderSortIcon('category_id')}
                      </th>
                    )}
                    {visibleColumns.price && (
                      <th onClick={() => handleSort('selling_price')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                        {txt('colPrice')} {renderSortIcon('selling_price')}
                      </th>
                    )}
                    {visibleColumns.stock && (
                      <th onClick={() => handleSort('stock')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                        {txt('colStock')} {renderSortIcon('stock')}
                      </th>
                    )}
                    {visibleColumns.status && (
                      <th onClick={() => handleSort('status')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                        {txt('colStatus')} {renderSortIcon('status')}
                      </th>
                    )}
                    {visibleColumns.rating && (
                      <th onClick={() => handleSort('rating_avg')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                        {txt('colRating')} {renderSortIcon('rating_avg')}
                      </th>
                    )}
                    <th className="text-right pr-4 py-3 select-none w-28">{txt('colActions')}</th>
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
                            className="form-checkbox h-4 w-4 text-primary rounded border-border focus:ring-primary cursor-pointer"
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
                                    <Star size={10} fill="currentColor" /> {txt('featured')}
                                  </span>
                                )}
                                {product.is_digital && (
                                  <span className="text-[10px] text-indigo-500 font-semibold">
                                    {txt('digital')}
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
                        {/* Price formatted in USD $ */}
                        {visibleColumns.price && (
                          <td className="font-mono text-sm font-semibold text-foreground py-3">
                            ${Number(product.selling_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        )}
                        {visibleColumns.stock && (
                          <td className="py-3">
                            {product.track_inventory ? (
                              <div className="flex flex-col">
                                <span className={`text-sm font-semibold ${(product.stock ?? 0) <= product.low_stock_threshold ? 'text-rose-500' : 'text-foreground'}`}>
                                  {product.stock ?? 0} {product.unit?.name ?? txt('unitPcs')}
                                </span>
                                {(product.stock ?? 0) <= product.low_stock_threshold && (
                                  <span className="text-[10px] text-rose-500/80 font-medium">
                                    {(product.stock ?? 0) === 0 ? txt('outOfStock') : txt('lowStock')}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">{txt('unlimited')}</span>
                            )}
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td className="py-3">
                            {product.deleted_at ? (
                              <span className="badge badge-danger">{txt('inactive')}</span>
                            ) : (product.stock ?? 0) <= 0 ? (
                              <span className="badge badge-danger">{txt('outOfStock')}</span>
                            ) : (product.stock ?? 0) <= product.low_stock_threshold ? (
                              <span className="badge badge-warning">{txt('lowStock')}</span>
                            ) : product.status === 'active' ? (
                              <span className="badge badge-success">{txt('active')}</span>
                            ) : (
                              <span className="badge badge-muted">{txt('inactive')}</span>
                            )}
                          </td>
                        )}
                        {visibleColumns.rating && (
                          <td className="py-3">
                            <div className="flex items-center gap-1 font-semibold text-xs text-amber-500">
                              <Star size={12} fill="currentColor" />
                              <span>{product.rating_avg ? Number(product.rating_avg).toFixed(1) : '5.0'}</span>
                            </div>
                          </td>
                        )}
                        <td className="text-right pr-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {recycleBinMode ? (
                              <>
                                <button
                                  onClick={() => restoreMutation.mutate(product.id)}
                                  className="p-1 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-indigo-600 rounded transition-colors"
                                  title="Restore Product"
                                >
                                  <RefreshCw size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('Permanently delete this product?')) {
                                      forceDeleteMutation.mutate(product.id)
                                    }
                                  }}
                                  className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 rounded transition-colors"
                                  title="Permanent Delete"
                                >
                                  <Trash size={14} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => navigate(`/products/${product.id}/edit`)}
                                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm({ open: true, id: product.id, force: false, name: product.name })}
                                  className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-muted-foreground hover:text-rose-500 rounded transition-colors"
                                  title="Delete"
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
                    <EmptyState cols={Object.values(visibleColumns).filter(Boolean).length + 2} message={txt('noDataTitle')} />
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
      )}

      {/* Filter Drawer */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterDrawerOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col justify-between"
              >
                <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground">{txt('drawerTitle')}</h2>
                  </div>
                  <button
                    onClick={() => setFilterDrawerOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto flex-1 text-left">
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{txt('filterStatus')}</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="form-input"
                    >
                      <option value="">{txt('allStatus')}</option>
                      <option value="active">{txt('active')}</option>
                      <option value="inactive">{txt('inactive')}</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{txt('filterCategory')}</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="form-input"
                    >
                      <option value="">{txt('allCategories')}</option>
                      {(categories ?? []).map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Brand Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{txt('filterBrand')}</label>
                    <select
                      value={brandFilter}
                      onChange={(e) => setBrandFilter(e.target.value)}
                      className="form-input"
                    >
                      <option value="">{txt('allBrands')}</option>
                      {(brands ?? []).map((b: any) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter ($ USD) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{txt('filterPriceRange')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder={txt('minPrice')}
                        value={priceMinFilter}
                        onChange={(e) => setPriceMinFilter(e.target.value)}
                        className="form-input text-xs"
                      />
                      <input
                        type="number"
                        placeholder={txt('maxPrice')}
                        value={priceMaxFilter}
                        onChange={(e) => setPriceMaxFilter(e.target.value)}
                        className="form-input text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-border bg-muted/30 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('')
                      setCategoryFilter('')
                      setBrandFilter('')
                      setPriceMinFilter('')
                      setPriceMaxFilter('')
                    }}
                    className="px-4 py-2.5 text-xs font-bold border border-border rounded-xl hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                  >
                    {txt('reset')}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFilterDrawerOpen(false)}
                      className="px-4 py-2.5 text-xs font-bold border border-border rounded-xl hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                    >
                      {txt('closeBtn')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterDrawerOpen(false)}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-primary rounded-xl hover:opacity-90 transition-all shadow-md cursor-pointer"
                    >
                      {txt('applyFilters')}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.open && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-sm border border-border rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-500">
                <Trash2 size={24} />
                <h3 className="font-bold text-lg text-foreground">
                  {deleteConfirm.force ? 'Permanent Delete' : 'Delete Product'}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to {deleteConfirm.force ? 'permanently delete' : 'move to trash'} <strong>"{deleteConfirm.name}"</strong>?
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirm({ open: false, id: null, force: false, name: '' })}
                  className="px-4 py-2 text-xs font-bold border border-border rounded-xl hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
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
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-500 shadow-sm cursor-pointer"
                >
                  Delete
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
