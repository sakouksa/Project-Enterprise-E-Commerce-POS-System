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
  Tag, Sliders
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
  const { t } = useTranslation()
  const qc    = useQueryClient()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

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
  const [recycleBinMode, setRecycleBinMode] = useState(false)

  // Sorting
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // UI state
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false)
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

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      'products', page, debouncedSearch, perPage, sortBy, sortOrder,
      statusFilter, categoryFilter, brandFilter, unitFilter, taxFilter,
      stockLevelFilter, startDate, endDate, recycleBinMode
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
        end_date: endDate
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
    <div className="space-y-5">
      <Breadcrumb items={[{ label: t('nav.group.productInventory') }, { label: t('nav.allProducts') }]} />

      {/* Workspace Tabs */}
      <div className="flex border-b border-border bg-card rounded-t-2xl px-4 overflow-x-auto gap-2 shadow-sm">
        {[
          { id: 'products',   label: t('nav.allProducts'), icon: <Package size={14} /> },
          { id: 'categories', label: t('nav.categories'), icon: <Layers size={14} /> },
          { id: 'brands',     label: t('nav.brands'), icon: <Tag size={14} /> },
          { id: 'units',      label: t('nav.units'), icon: <Settings size={14} /> },
          { id: 'taxes',      label: t('products.taxes'), icon: <Percent size={14} /> },
          { id: 'attributes', label: t('nav.attributes'), icon: <List size={14} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveWorkspaceTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 -mb-[2px] transition-colors whitespace-nowrap
                        ${activeWorkspaceTab === tab.id
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeWorkspaceTab === 'products' ? (
        <>
          <PageHeader
            title={t('products.title')}
            subtitle={t('products.subtitle')}
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRecycleBinMode(!recycleBinMode)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors
                             ${recycleBinMode 
                               ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20' 
                               : 'bg-card border-border text-muted-foreground hover:text-foreground'}`}
                >
                  <Trash2 size={15} /> {recycleBinMode ? 'Exit Trash' : 'Trash Bin'}
                </button>

                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download size={14} />
                  {t('buttons.export')}
                </button>

                <button
                  onClick={() => setImportOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Upload size={14} />
                  {t('buttons.import')}
                </button>

                <button
                  onClick={() => navigate('/products/create')}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                             bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                >
                  <Plus size={16} />
                  {t('products.addProduct')}
                </button>
              </div>
            }
          />

          {/* 12 Stats Grid Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: t('products.totalProducts'), val: statsData?.total_products ?? 0, icon: <Package size={16} />, color: 'text-blue-500 bg-blue-500/10' },
              { label: t('common.active'), val: statsData?.active_products ?? 0, icon: <CheckCircle2 size={16} />, color: 'text-green-500 bg-green-500/10' },
              { label: t('common.draft'), val: statsData?.draft_products ?? 0, icon: <Edit2 size={16} />, color: 'text-amber-500 bg-amber-500/10' },
              { label: t('common.archived'), val: statsData?.archived_products ?? 0, icon: <Archive size={16} />, color: 'text-red-500 bg-red-500/10' },
              { label: t('products.lowStockAlert'), val: statsData?.low_stock_products ?? 0, icon: <AlertCircle size={16} />, color: 'text-rose-600 bg-rose-500/10' },
              { label: t('products.featured'), val: statsData?.featured_products ?? 0, icon: <Star size={16} />, color: 'text-yellow-500 bg-yellow-500/10' },
              { label: t('products.digitalItems'), val: statsData?.digital_products ?? 0, icon: <Sliders size={16} />, color: 'text-indigo-500 bg-indigo-500/10' },
              { label: t('products.hasVariants'), val: statsData?.products_with_variants ?? 0, icon: <LayoutGrid size={16} />, color: 'text-purple-500 bg-purple-500/10' },
              { label: t('products.totalSold'), val: statsData?.total_sold ?? 0, icon: <Percent size={16} />, color: 'text-emerald-500 bg-emerald-500/10' },
              { label: t('products.totalViews'), val: statsData?.total_views ?? 0, icon: <Eye size={16} />, color: 'text-sky-500 bg-sky-500/10' },
              { label: t('products.avgRating'), val: statsData?.average_rating ? `${statsData.average_rating}★` : '—', icon: <Star size={16} />, color: 'text-amber-600 bg-amber-500/10' },
              { label: t('products.inactiveProducts'), val: statsData?.inactive_products ?? 0, icon: <EyeOff size={16} />, color: 'text-gray-500 bg-gray-500/10' },
            ].map((card, i) => (
              <div key={i} className="bg-card border border-border p-3.5 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{card.label}</p>
                  <p className="text-lg font-bold text-foreground mt-0.5">{card.val}</p>
                </div>
              </div>
            ))}
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

          {/* Filters & Options Grid */}
          <div className="bg-card rounded-2xl border border-border p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-56">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  placeholder={t('products.searchPlaceholder')}
                  className="form-input pl-9 w-full"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                className="form-input w-40"
                disabled={recycleBinMode}
              >
                <option value="">{t('products.allStatuses')}</option>
                <option value="active">{t('common.active')}</option>
                <option value="inactive">{t('common.inactive')}</option>
                <option value="draft">{t('common.draft')}</option>
                <option value="archived">{t('common.archived')}</option>
              </select>

              <select
                value={stockLevelFilter}
                onChange={(e) => { setStockLevelFilter(e.target.value); setPage(1) }}
                className="form-input w-40"
              >
                <option value="">{t('products.allStockLevels')}</option>
                <option value="low">{t('products.lowStockAlerts')}</option>
                <option value="out">{t('products.outOfStock')}</option>
                <option value="in">{t('products.healthyStock')}</option>
              </select>

              {/* Column Visibility Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setColumnDropdownOpen(!columnDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground border border-border bg-card rounded-lg hover:bg-muted transition-colors select-none"
                >
                  <Settings size={14} />
                </button>
                {columnDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setColumnDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl p-2 z-20 space-y-1">
                      <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase">{t('products.toggleColumns')}</p>
                      {Object.keys(visibleColumns).map((col) => (
                        <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-lg text-xs cursor-pointer capitalize text-foreground">
                          <input
                            type="checkbox"
                            checked={visibleColumns[col as keyof typeof visibleColumns]}
                            onChange={() => toggleColumn(col as keyof typeof visibleColumns)}
                            className="form-checkbox h-3.5 w-3.5 text-primary rounded"
                          />
                          {col === 'name' ? t('products.productName') : t('products.' + col)}
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>

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
                setRecycleBinMode(false)
                setSelectedRows([])
                setPage(1)
              }} />
            </div>

            {/* Advanced Filters Drawer/Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 border-t border-border/40">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('products.category')}</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
                  className="form-input text-xs py-1.5"
                >
                  <option value="">{t('products.allCategories')}</option>
                  {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('products.brand')}</label>
                <select
                  value={brandFilter}
                  onChange={(e) => { setBrandFilter(e.target.value); setPage(1) }}
                  className="form-input text-xs py-1.5"
                >
                  <option value="">{t('products.allBrands')}</option>
                  {brands?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('products.unit')}</label>
                <select
                  value={unitFilter}
                  onChange={(e) => { setUnitFilter(e.target.value); setPage(1) }}
                  className="form-input text-xs py-1.5"
                >
                  <option value="">{t('products.allUnits')}</option>
                  {units?.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('products.taxRules')}</label>
                <select
                  value={taxFilter}
                  onChange={(e) => { setTaxFilter(e.target.value); setPage(1) }}
                  className="form-input text-xs py-1.5"
                >
                  <option value="">{t('products.allTaxRules')}</option>
                  {taxes?.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('products.startDate')}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(1) }}
                  className="form-input text-xs py-1"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">{t('products.endDate')}</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(1) }}
                  className="form-input text-xs py-1"
                />
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
                                  onClick={() => forceDeleteMutation.mutate(product.id)}
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
                                  onClick={() => deleteMutation.mutate(product.id)}
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
    </div>
  )
}

export default ProductsPage
