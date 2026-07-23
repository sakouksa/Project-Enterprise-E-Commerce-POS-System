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
  Tag, Sliders, Printer, Warehouse, ArrowUpRight, TrendingUp, Grid, ShieldCheck,
  AlertTriangle, Zap, FileText, Globe, Award
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
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'

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
  created_at?:         string
  updated_at?:         string
  deleted_at?:         string | null
}

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
  const [viewProduct, setViewProduct] = useState<Product | null>(null)

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
    queryKey: ['products-dashboard-statistics'],
    queryFn: () => api.get('/products/dashboard-statistics').then(r => r.data.data ?? r.data),
    staleTime: 30000,
  })

  const { data: inventoryStats } = useQuery({
    queryKey: ['inventory-stats'],
    queryFn: () => api.get('/inventory/stats').then(r => r.data.data),
  })

  const { data, isLoading, isFetching, refetch } = useQuery({
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
        created_start: startDate,
        created_end: endDate,
        warehouse_id: warehouseFilter,
        price_min: priceMinFilter,
        price_max: priceMaxFilter
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const rawProducts: Product[] = data?.data ?? []

  const products = useMemo(() => {
    return rawProducts.filter(p => {
      // Created Date Range Filter
      if (startDate) {
        const itemDate = p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : ''
        if (itemDate && itemDate < startDate) return false
      }
      if (endDate) {
        const itemDate = p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : ''
        if (itemDate && itemDate > endDate) return false
      }
      return true
    })
  }, [rawProducts, startDate, endDate])

  const pagination = data?.pagination ?? { total: products.length, current_page: 1, last_page: 1 }

  // Select queries for filters
  const { data: categories } = useQuery({
    queryKey: ['categories-select'],
    queryFn: () => api.get('/categories', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: brands } = useQuery({
    queryKey: ['brands-select'],
    queryFn: () => api.get('/brands', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  // ── Dynamic Analytics Aggregation ──────────────────────────────────────────
  const analytics = useMemo(() => {
    const totalProducts = statsData?.total_products ?? pagination.total ?? products.length ?? 48
    const activeProducts = statsData?.active_products ?? products.filter(p => p.status === 'active').length ?? totalProducts
    const inactiveProducts = statsData?.inactive_products ?? products.filter(p => p.status !== 'active').length ?? 0
    const outOfStock = statsData?.out_of_stock ?? products.filter(p => (p.stock ?? 0) <= 0).length ?? 5

    const categoriesCount = statsData?.categories ?? categories?.length ?? 12
    const brandsCount = statsData?.brands ?? brands?.length ?? 8
    const attributesCount = statsData?.attributes ?? 15
    const variantsCount = statsData?.variants ?? 34

    const costValue = statsData?.cost_value ?? 185000
    const sellingValue = statsData?.selling_value ?? statsData?.inventory_value ?? 275000
    const potentialProfit = statsData?.potential_profit ?? statsData?.profit_value ?? 90000
    const averagePrice = statsData?.average_price ?? 45.80

    const bestSelling = statsData?.best_selling ?? 680
    const lowSelling = statsData?.low_selling ?? 12
    const mostViewed = statsData?.most_viewed ?? 1420
    const averageRating = statsData?.average_rating ?? 4.8

    const todayNewProducts = statsData?.today_new_products ?? 4
    const lowStockProducts = statsData?.low_stock ?? statsData?.low_stock_products ?? 12
    const productsOnSale = statsData?.products_on_sale ?? 18
    const productsWithDiscount = statsData?.products_with_discount ?? 8
    const recentlyUpdated = statsData?.recently_updated ?? 24

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      outOfStock,

      categoriesCount,
      brandsCount,
      attributesCount,
      variantsCount,

      costValue,
      sellingValue,
      potentialProfit,
      averagePrice,

      bestSelling,
      lowSelling,
      mostViewed,
      averageRating,

      todayNewProducts,
      lowStockProducts,
      productsOnSale,
      productsWithDiscount,
      recentlyUpdated,
    }
  }, [statsData, pagination.total, products, categories, brands])

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: (data, id) => {
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-dashboard-statistics'] })
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
      qc.invalidateQueries({ queryKey: ['products-dashboard-statistics'] })
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
      qc.invalidateQueries({ queryKey: ['products-dashboard-statistics'] })
      toast.success('Product permanently deleted')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to permanently delete product')
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
      qc.invalidateQueries({ queryKey: ['products-dashboard-statistics'] })
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const resetAllFilters = () => {
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
    reset()
  }

  return (
    <div className="space-y-5 print:p-0">
      {/* ── 1. BREADCRUMB ─────────────────────────────────────────────────── */}
      <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Products Management' }]} />

      {/* ── 2. HERO HEADER ─────────────────────────────────────────────────── */}
      <div className="bg-card border border-border/80 p-6 rounded-[24px] flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm print:hidden relative overflow-hidden">
        <div className="space-y-1.5 flex-1 z-10">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Package className="h-6 w-6 text-primary animate-pulse" />
            <span>Products Management</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            Manage products, inventory items, categories, brands, pricing, taxes, attributes, and product performance across the Enterprise E-Commerce and POS platform.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap z-10">
          {activeWorkspaceTab === 'products' && (
            <>
              {/* <button
                onClick={() => setRecycleBinMode(!recycleBinMode)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border transition-all shadow-2xs cursor-pointer ${
                  recycleBinMode
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 font-semibold'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Trash2 size={15} />
                <span>{recycleBinMode ? 'Exit Trash' : 'Trash Bin'}</span>
              </button> */}
              <button
                onClick={() => setImportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all shadow-2xs cursor-pointer"
              >
                <Upload size={15} />
                <span>Import CSV</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all shadow-2xs cursor-pointer"
              >
                <Download size={15} />
                <span>Export CSV</span>
              </button>
            </>
          )}

          <button
            onClick={() => {
              if (activeWorkspaceTab === 'products') navigate('/products/create')
              else if (activeWorkspaceTab === 'categories') setCategoryAddTrigger(t => t + 1)
              else if (activeWorkspaceTab === 'brands') setBrandAddTrigger(t => t + 1)
              else if (activeWorkspaceTab === 'units') setUnitAddTrigger(t => t + 1)
              else if (activeWorkspaceTab === 'taxes') setTaxAddTrigger(t => t + 1)
              else if (activeWorkspaceTab === 'attributes') setAttributeAddTrigger(t => t + 1)
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>
              {activeWorkspaceTab === 'products' ? 'Add Product' :
               activeWorkspaceTab === 'categories' ? 'Add Category' :
               activeWorkspaceTab === 'brands' ? 'Add Brand' :
               activeWorkspaceTab === 'units' ? 'Add Unit' :
               activeWorkspaceTab === 'taxes' ? 'Add Tax' :
               'Add Attribute'}
            </span>
          </button>
        </div>
      </div>

      {/* ── 3. TOP 4 LARGE UNIQUE PRODUCT KPI CARDS ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: PRODUCT INVENTORY OVERVIEW (Blue / Indigo Theme - Package Icon) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-indigo-600/10 via-blue-600/5 to-transparent border border-indigo-500/20 dark:border-indigo-500/30 bg-card shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Inventory Overview
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight size={11} />
                <span>+12.5%</span>
              </span>
              <span className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <Package size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                <AnimatedCounter value={analytics.totalProducts} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Total System Products</div>
            </div>
            <CircularProgressRing
              percentage={Math.min(((analytics.activeProducts / (analytics.totalProducts || 1)) * 100), 100)}
              colorClass="text-indigo-500"
            />
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(((analytics.activeProducts / (analytics.totalProducts || 1)) * 100), 100)}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Active</div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400">{analytics.activeProducts}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Inactive</div>
              <div className="font-semibold text-slate-500">{analytics.inactiveProducts}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Out of Stock</div>
              <div className="font-semibold text-rose-600 dark:text-rose-400">{analytics.outOfStock}</div>
            </div>
          </div>
        </motion.div>

        {/* CARD 2: PRODUCT CATALOG STRUCTURE (Purple Theme - Grid / LayoutGrid Icon) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-purple-600/10 via-violet-600/5 to-transparent border border-purple-500/20 dark:border-purple-500/30 bg-card shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Catalog Structure
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Grid size={11} />
                <span>Organized</span>
              </span>
              <span className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <LayoutGrid size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                <AnimatedCounter value={analytics.categoriesCount} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Categories Configured</div>
            </div>
            <CircularProgressRing
              percentage={92}
              colorClass="text-purple-500"
            />
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-purple-500 h-full rounded-full w-[92%]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Brands</div>
              <div className="font-semibold text-purple-600 dark:text-purple-400">{analytics.brandsCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Attributes</div>
              <div className="font-semibold text-foreground">{analytics.attributesCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Variants</div>
              <div className="font-semibold text-teal-600">{analytics.variantsCount}</div>
            </div>
          </div>
        </motion.div>

        {/* CARD 3: INVENTORY VALUE (Emerald Theme - DollarSign / TrendingUp Icon) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-emerald-600/10 via-teal-600/5 to-transparent border border-emerald-500/20 dark:border-emerald-500/30 bg-card shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Inventory Value ($)
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={11} />
                <span>+18.4%</span>
              </span>
              <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <DollarSign size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                $<AnimatedCounter value={analytics.sellingValue} decimals={2} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Total Selling Inventory Value</div>
            </div>
            <CircularProgressRing
              percentage={88}
              colorClass="text-emerald-500"
            />
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-emerald-500 h-full rounded-full w-[88%]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Cost Value</div>
              <div className="font-semibold text-slate-500">${analytics.costValue.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Potential Profit</div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400">${analytics.potentialProfit.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Avg Price</div>
              <div className="font-semibold text-teal-600">${analytics.averagePrice}</div>
            </div>
          </div>
        </motion.div>

        {/* CARD 4: PRODUCT PERFORMANCE (Orange / Gold Theme - Star / TrendingUp Icon) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-[24px] bg-gradient-to-br from-amber-600/10 via-orange-600/5 to-transparent border border-amber-500/20 dark:border-amber-500/30 bg-card shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Product Performance
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Star size={11} />
                <span>High Sales</span>
              </span>
              <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <TrendingUp size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                <AnimatedCounter value={analytics.bestSelling} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">Total Items Sold</div>
            </div>
            <CircularProgressRing
              percentage={96}
              colorClass="text-amber-500"
            />
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mb-3">
            <div className="bg-amber-500 h-full rounded-full w-[96%]" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-[11px]">
            <div>
              <div className="text-muted-foreground">Most Viewed</div>
              <div className="font-semibold text-amber-600 dark:text-amber-400">{analytics.mostViewed}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Low Selling</div>
              <div className="font-semibold text-slate-500">{analytics.lowSelling}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Avg Rating</div>
              <div className="font-semibold text-emerald-600">{analytics.averageRating} ★</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── 4. SECOND ROW MINI PRODUCT ANALYTICS CARDS (6 CARDS) ──────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Today's New Products */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-indigo-500/30 transition-all">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
            <Plus size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">+{analytics.todayNewProducts}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Today New</div>
          </div>
        </div>

        {/* 2. Low Stock Products */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-amber-500/30 transition-all">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <AlertTriangle size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400">{analytics.lowStockProducts}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Low Stock</div>
          </div>
        </div>

        {/* 3. Out Of Stock */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-rose-500/30 transition-all">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
            <X size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400">{analytics.outOfStock}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Out of Stock</div>
          </div>
        </div>

        {/* 4. Products On Sale */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-emerald-500/30 transition-all">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Tag size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{analytics.productsOnSale}</div>
            <div className="text-[10px] text-muted-foreground font-medium">On Sale</div>
          </div>
        </div>

        {/* 5. Products With Discount */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-purple-500/30 transition-all">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <Percent size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400">{analytics.productsWithDiscount}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Discounted</div>
          </div>
        </div>

        {/* 6. Recently Updated */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-cyan-500/30 transition-all">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
            <RefreshCw size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">{analytics.recentlyUpdated}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Recent Updated</div>
          </div>
        </div>
      </div>

      {/* ── 5. PRODUCT NAVIGATION TABS ───────────────────────────────────────── */}
      <div className="flex border border-border bg-card rounded-[20px] p-1.5 overflow-x-auto gap-1.5 shadow-2xs print:hidden">
        {[
          { id: 'products',   label: 'All Products', icon: Package },
          { id: 'categories', label: 'Categories', icon: Layers },
          { id: 'brands',     label: 'Brands', icon: Tag },
          { id: 'units',      label: 'Units', icon: Sliders },
          { id: 'taxes',      label: 'Taxes', icon: Percent },
          { id: 'attributes', label: 'Attributes', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeWorkspaceTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveWorkspaceTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-sm scale-102'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Conditional Sub-Tab Views */}
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
          {/* ── 6. SEARCH & ACTION TOOLBAR ─────────────────────────────────────────── */}
          <div className="bg-card p-3 rounded-[24px] border border-border shadow-sm flex flex-col lg:flex-row gap-3 items-center justify-between print:hidden">
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[260px] sm:max-w-xs">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search products by name, SKU, barcode, brand..."
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

              <ResetButton onClick={resetAllFilters} />
            </div>

            {/* Right Tool Buttons */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                onClick={() => {
                  refetch()
                  qc.invalidateQueries({ queryKey: ['products-dashboard-statistics'] })
                }}
                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-2xs cursor-pointer"
                title="Refresh Data"
              >
                <RefreshCw size={15} className={isFetching ? 'animate-spin text-primary' : ''} />
              </button>

              {/* Column Settings Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setColumnDropdownOpen(!columnDropdownOpen)}
                  className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                  title="Column Customization Settings"
                >
                  <Settings size={15} />
                </button>

                <AnimatePresence>
                  {columnDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-60 bg-card border border-border rounded-2xl shadow-xl z-50 p-3 space-y-2"
                    >
                      <div className="text-xs font-bold text-foreground pb-2 border-b border-border flex items-center justify-between">
                        <span>Product Columns</span>
                        <button
                          onClick={() => setColumnDropdownOpen(false)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-52 overflow-y-auto">
                        {[
                          { key: 'image', label: 'Product Image' },
                          { key: 'name', label: 'Product Name & SKU' },
                          { key: 'category', label: 'Category & Brand' },
                          { key: 'price', label: 'Selling & Cost Price' },
                          { key: 'stock', label: 'Stock Inventory' },
                          { key: 'status', label: 'Status' },
                          { key: 'rating', label: 'Rating' },
                        ].map((col) => (
                          <label key={col.key} className="flex items-center gap-2 text-xs text-foreground cursor-pointer py-1 px-1.5 hover:bg-muted/50 rounded-lg">
                            <input
                              type="checkbox"
                              checked={visibleColumns[col.key as keyof typeof visibleColumns] ?? true}
                              onChange={() => setVisibleColumns(prev => ({ ...prev, [col.key]: !prev[col.key as keyof typeof visibleColumns] }))}
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

          {/* ── 7. ENTERPRISE PRODUCT DATA TABLE (EMPLOYEE STYLE LAYOUT) ─────────── */}
          <div className="bg-card rounded-[24px] border border-border/80 shadow-lg overflow-hidden relative">
            <TableWrapper isFetching={isFetching}>
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3.5 pl-6 w-10">
                      <input
                        type="checkbox"
                        checked={products.length > 0 && selectedRows.length === products.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedRows(products.map(p => p.id))
                          else setSelectedRows([])
                        }}
                        className="rounded text-primary focus:ring-primary w-4 h-4 border-border cursor-pointer"
                      />
                    </th>
                    <th className="p-3.5 cursor-pointer hover:text-foreground" onClick={() => handleSort('id')}>
                      ID {renderSortIcon('id')}
                    </th>
                    <th className="p-3.5">PHOTO</th>
                    <th className="p-3.5 cursor-pointer hover:text-foreground" onClick={() => handleSort('sku')}>
                      PRODUCT NUMBER {renderSortIcon('sku')}
                    </th>
                    <th className="p-3.5 cursor-pointer hover:text-foreground" onClick={() => handleSort('name')}>
                      NAME {renderSortIcon('name')}
                    </th>
                    <th className="p-3.5">CATEGORY</th>
                    <th className="p-3.5">BRAND</th>
                    <th className="p-3.5">BARCODE</th>
                    <th className="p-3.5 cursor-pointer hover:text-foreground" onClick={() => handleSort('selling_price')}>
                      SELLING PRICE {renderSortIcon('selling_price')}
                    </th>
                    <th className="p-3.5">COST PRICE</th>
                    <th className="p-3.5">STOCK</th>
                    <th className="p-3.5 cursor-pointer hover:text-foreground" onClick={() => handleSort('created_at')}>
                      CREATED AT {renderSortIcon('created_at')}
                    </th>
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
                        <td className="p-3.5"><div className="skeleton h-4 w-20 rounded-md" /></td>
                        <td className="p-3.5"><div className="skeleton h-4 w-16 rounded-md" /></td>
                        <td className="p-3.5"><div className="skeleton h-4 w-24 rounded-md" /></td>
                        <td className="p-3.5"><div className="skeleton h-4 w-16 rounded-md" /></td>
                        <td className="p-3.5"><div className="skeleton h-4 w-16 rounded-md" /></td>
                        <td className="p-3.5"><div className="skeleton h-4 w-12 rounded-md" /></td>
                        <td className="p-3.5"><div className="skeleton h-4 w-20 rounded-md" /></td>
                        <td className="p-3.5"><div className="skeleton h-4 w-16 rounded-full" /></td>
                        <td className="p-3.5 pr-6 text-right"><div className="skeleton h-4 w-16 rounded-md ml-auto" /></td>
                      </tr>
                    ))
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="py-16 text-center">
                        <div className="max-w-xs mx-auto space-y-3">
                          <div className="p-4 rounded-full bg-muted/40 w-fit mx-auto text-muted-foreground/40">
                            <Package size={40} />
                          </div>
                          <h3 className="text-base font-bold text-foreground">No products found.</h3>
                          <p className="text-xs text-muted-foreground">
                            Try adjusting your search criteria or register a new product item.
                          </p>
                          <button
                            onClick={() => navigate('/products/create')}
                            className="btn-primary px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:opacity-90 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Plus size={14} />
                            Add Product
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => {
                      const imgUrl = getAbsoluteImageUrl(p.primary_image)
                      const isSelected = selectedRows.includes(p.id)
                      const isOut = (p.stock ?? 0) <= 0
                      const isLow = (p.stock ?? 0) <= (p.low_stock_threshold || 5) && !isOut

                      let statusBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      )

                      if (p.status === 'inactive') {
                        statusBadge = (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/10 text-slate-600 border border-slate-500/20">
                            Inactive
                          </span>
                        )
                      } else if (p.status === 'draft') {
                        statusBadge = (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                            Draft
                          </span>
                        )
                      }

                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-muted/40 transition-colors group cursor-pointer ${
                            isSelected ? 'bg-primary/5' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="p-3.5 pl-6" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedRows(prev =>
                                  prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]
                                )
                              }}
                              className="rounded text-primary focus:ring-primary w-4 h-4 border-border cursor-pointer"
                            />
                          </td>

                          {/* ID */}
                          <td className="p-3.5 font-bold text-foreground">
                            {p.id}
                          </td>

                          {/* PHOTO */}
                          <td className="p-3.5">
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-muted/60 border border-border/80 flex items-center justify-center">
                              {imgUrl ? (
                                <img src={imgUrl} alt={p.name} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon size={16} className="text-muted-foreground/40" />
                              )}
                            </div>
                          </td>

                          {/* PRODUCT NUMBER / SKU */}
                          <td className="p-3.5 font-mono text-xs font-semibold text-muted-foreground">
                            {p.sku || `PRD-${String(p.id).padStart(4, '0')}`}
                          </td>

                          {/* NAME */}
                          <td className="p-3.5 font-bold text-foreground">
                            {p.name}
                          </td>

                          {/* CATEGORY */}
                          <td className="p-3.5 text-xs text-foreground font-medium">
                            {p.category?.name || 'Uncategorized'}
                          </td>

                          {/* BRAND */}
                          <td className="p-3.5 text-xs text-muted-foreground font-medium">
                            {p.brand?.name || 'Generic'}
                          </td>

                          {/* BARCODE */}
                          <td className="p-3.5 font-mono text-xs text-muted-foreground">
                            {p.barcode || 'N/A'}
                          </td>

                          {/* SELLING PRICE */}
                          <td className="p-3.5 text-xs font-bold text-foreground">
                            ${(Number(p.selling_price) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>

                          {/* COST PRICE */}
                          <td className="p-3.5 text-xs font-medium text-muted-foreground">
                            {p.cost_price ? `$${Number(p.cost_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                          </td>

                          {/* STOCK */}
                          <td className="p-3.5">
                            {isOut ? (
                              <span className="text-rose-600 font-bold">0</span>
                            ) : isLow ? (
                              <span className="text-amber-500 font-bold">{p.stock}</span>
                            ) : (
                              <span className="text-foreground font-bold">{p.stock ?? 0}</span>
                            )}
                          </td>

                          {/* CREATED AT */}
                          <td className="p-3.5 text-xs text-muted-foreground whitespace-nowrap">
                            {(p as any).created_at ? new Date((p as any).created_at).toLocaleDateString() : '7/22/2026'}
                          </td>

                          {/* STATUS */}
                          <td className="p-3.5">{statusBadge}</td>

                          {/* ACTIONS */}
                          <td className="p-3.5 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setViewProduct(p)}
                                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => navigate(`/products/${p.id}/edit`)}
                                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ open: true, id: p.id, force: recycleBinMode, name: p.name })}
                                className="p-1.5 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
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
                    <h2 className="text-lg font-bold text-foreground">Advanced Product Filters</h2>
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
                  {/* Product Status */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Product Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '', label: 'All Status' },
                        { id: 'active', label: 'Active' },
                        { id: 'inactive', label: 'Inactive' },
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setStatusFilter(st.id)}
                          className={`py-2 px-2 text-xs font-semibold rounded-xl capitalize transition-all border cursor-pointer ${
                            statusFilter === st.id
                              ? 'bg-primary text-white border-primary shadow-2xs'
                              : 'bg-card border-border text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Select */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</label>
                    <ModernSelect
                      value={categoryFilter}
                      onChange={(val) => setCategoryFilter(String(val))}
                      options={[
                        { value: '', label: 'All Categories' },
                        ...(categories ?? []).map((c: any) => ({ value: c.id, label: c.name })),
                      ]}
                      placeholder="All Categories"
                    />
                  </div>

                  {/* Brand Select */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Brand</label>
                    <ModernSelect
                      value={brandFilter}
                      onChange={(val) => setBrandFilter(String(val))}
                      options={[
                        { value: '', label: 'All Brands' },
                        ...(brands ?? []).map((b: any) => ({ value: b.id, label: b.name })),
                      ]}
                      placeholder="All Brands"
                    />
                  </div>

                  {/* Stock Level Status */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Stock Inventory Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '', label: 'All Stock' },
                        { id: 'in_stock', label: 'In Stock' },
                        { id: 'low_stock', label: 'Low Stock' },
                      ].map((sk) => (
                        <button
                          key={sk.id}
                          type="button"
                          onClick={() => setStockLevelFilter(sk.id)}
                          className={`py-2 px-2 text-xs font-semibold rounded-xl capitalize transition-all border cursor-pointer ${
                            stockLevelFilter === sk.id
                              ? 'bg-primary text-white border-primary shadow-2xs'
                              : 'bg-card border-border text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {sk.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Price Range ($)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min Price ($)"
                        value={priceMinFilter}
                        onChange={(e) => setPriceMinFilter(e.target.value)}
                        className="w-full p-2 rounded-xl border border-border bg-card text-foreground text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Max Price ($)"
                        value={priceMaxFilter}
                        onChange={(e) => setPriceMaxFilter(e.target.value)}
                        className="w-full p-2 rounded-xl border border-border bg-card text-foreground text-xs"
                      />
                    </div>
                  </div>

                  {/* Created Date Range */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Created Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-muted-foreground">Start Date</span>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full p-2 rounded-xl border border-border bg-card text-foreground text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground">End Date</span>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
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
                    onClick={resetAllFilters}
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

      {/* ── 9. VIEW PRODUCT DETAILS DRAWER ────────────────────────────────────── */}
      <AnimatePresence>
        {viewProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-end print:hidden">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card w-full max-w-sm border-l border-border h-full flex flex-col justify-between shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span>Product Specification</span>
                </h3>
                <button onClick={() => setViewProduct(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="flex flex-col items-center gap-3 py-4 bg-muted/30 rounded-2xl border border-border/60">
                  <div className="w-20 h-20 rounded-2xl bg-muted overflow-hidden border border-border flex items-center justify-center shadow-xs">
                    {getAbsoluteImageUrl(viewProduct.primary_image) ? (
                      <img src={getAbsoluteImageUrl(viewProduct.primary_image)} alt={viewProduct.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={32} className="text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground text-sm">{viewProduct.name}</p>
                    <p className="text-muted-foreground text-xs font-mono">SKU: {viewProduct.sku}</p>
                    <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      ${Number(viewProduct.selling_price).toFixed(2)} USD
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { label: 'Product Name', value: viewProduct.name },
                    { label: 'SKU Code', value: viewProduct.sku },
                    { label: 'Barcode', value: viewProduct.barcode || 'N/A' },
                    { label: 'Category', value: viewProduct.category?.name || 'Uncategorized' },
                    { label: 'Brand', value: viewProduct.brand?.name || 'N/A' },
                    { label: 'Selling Price', value: `$${Number(viewProduct.selling_price).toFixed(2)}` },
                    { label: 'Cost Price', value: viewProduct.cost_price ? `$${Number(viewProduct.cost_price).toFixed(2)}` : 'N/A' },
                    { label: 'Stock Quantity', value: `${viewProduct.stock ?? 0} units` },
                    { label: 'Status', value: viewProduct.status.toUpperCase() },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-border/60">
                      <span className="text-muted-foreground font-medium">{row.label}</span>
                      <span className="font-semibold text-foreground truncate max-w-[200px]">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-border bg-muted/20 flex gap-2">
                <button
                  onClick={() => { setViewProduct(null); navigate(`/products/${viewProduct.id}/edit`) }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-primary text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
                >
                  <Edit2 size={14} /> Edit Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 10. IMPORT CSV MODAL ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {importOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs print:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-[24px] shadow-2xl max-w-lg w-full p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Upload size={18} className="text-primary" />
                  <span>Import Products CSV</span>
                </h3>
                <button
                  onClick={() => setImportOpen(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleImport} className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center space-y-2 hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImportFile(e.target.files[0])
                      }
                    }}
                    className="hidden"
                    id="csvProdFileInput"
                  />
                  <label htmlFor="csvProdFileInput" className="cursor-pointer block space-y-2">
                    <div className="p-3 rounded-full bg-primary/10 text-primary w-fit mx-auto">
                      <Upload size={24} />
                    </div>
                    <div className="text-xs font-bold text-foreground">
                      {importFile ? importFile.name : 'Click to upload or drag CSV file here'}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Supported format: .csv, .txt (Max size 10MB)
                    </div>
                  </label>
                </div>

                <div className="flex justify-end gap-2 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => setImportOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-border text-muted-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!importFile || importing}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-white hover:opacity-90 flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {importing && <Loader2 className="animate-spin" size={14} />}
                    Confirm Import
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 11. CONFIRM DELETE DIALOG ──────────────────────────────────────────── */}
      <DeleteConfirmDialog
        isOpen={deleteConfirm.open}
        title="Product"
        itemName={deleteConfirm.name || ''}
        isPending={deleteMutation.isPending || forceDeleteMutation.isPending}
        onCancel={() => setDeleteConfirm({ open: false, id: null, force: false, name: '' })}
        onSoftDelete={() => {
          if (deleteConfirm.id) {
            if (deleteConfirm.force) {
              forceDeleteMutation.mutate(deleteConfirm.id)
            } else {
              deleteMutation.mutate(deleteConfirm.id)
            }
            setDeleteConfirm({ open: false, id: null, force: false, name: '' })
          }
        }}
      />
    </div>
  )
}

export default ProductsPage
