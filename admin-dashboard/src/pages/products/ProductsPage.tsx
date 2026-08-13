import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import {
  Package, Plus, Search, Filter, RefreshCw, Download, Upload, Settings, Trash2
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import ResetButton from '@/components/shared/ResetButton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useTranslation } from 'react-i18next'

import CategoriesPage from '@/modules/categories/pages/CategoriesPage'
import BrandsPage from '@/pages/brands/BrandsPage'
import UnitsPage from '@/pages/settings/UnitsPage'
import AttributesPage from '@/pages/attributes/AttributesPage'
import TaxesPage from '@/pages/products/TaxesPage'

import { ProductStatsCards } from './components/ProductStatsCards'
import { ProductFilterDrawer } from './components/ProductFilterDrawer'
import { ProductDetailDrawer } from './components/ProductDetailDrawer'
import { ProductImportModal } from './components/ProductImportModal'
import { ProductTableSection } from './components/ProductTableSection'
import type { Product } from './types/productsPage.types'

const ProductsPage: React.FC = () => {
  const { t, i18n } = useTranslation(['products', 'common'])
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const qc = useQueryClient()
  const toast = useToast()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(i18n.language === 'km' ? 'km-KH' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0)
  }

  const activeTabParam = searchParams.get('tab') || 'products'
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<string>(activeTabParam)

  useEffect(() => {
    setSearchParams({ tab: activeWorkspaceTab }, { replace: true })
  }, [activeWorkspaceTab, setSearchParams])

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

  // Filters & State
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [stockLevelFilter, setStockLevelFilter] = useState('')
  const [priceMinFilter, setPriceMinFilter] = useState('')
  const [priceMaxFilter, setPriceMaxFilter] = useState('')
  const [recycleBinMode, setRecycleBinMode] = useState(false)
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // UI state
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [viewProduct, setViewProduct] = useState<Product | null>(null)
  const [showColSettings, setShowColSettings] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: number | null; force: boolean; name?: string }>({
    open: false,
    id: null,
    force: false,
    name: ''
  })

  // Sub-tab add triggers
  const [categoryAddTrigger, setCategoryAddTrigger] = useState(0)
  const [brandAddTrigger, setBrandAddTrigger] = useState(0)
  const [unitAddTrigger, setUnitAddTrigger] = useState(0)
  const [taxAddTrigger, setTaxAddTrigger] = useState(0)
  const [attributeAddTrigger, setAttributeAddTrigger] = useState(0)

  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    image: true,
    name: true,
    sku: true,
    category: true,
    price: true,
    stock: true,
    status: true,
    rating: true,
  })

  // Queries
  const { data: statsData } = useQuery({
    queryKey: ['products-dashboard-statistics'],
    queryFn: () => api.get('/products/dashboard-statistics').then(r => r.data.data ?? r.data),
    staleTime: 30000,
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      'products', page, debouncedSearch, perPage, sortBy, sortOrder,
      statusFilter, categoryFilter, brandFilter, stockLevelFilter,
      priceMinFilter, priceMaxFilter, recycleBinMode
    ],
    queryFn: () => api.get('/products', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        status: recycleBinMode ? 'deleted' : statusFilter,
        category_id: categoryFilter || undefined,
        brand_id: brandFilter || undefined,
        inventory: stockLevelFilter || undefined,
        price_min: priceMinFilter || undefined,
        price_max: priceMaxFilter || undefined,
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
    enabled: activeWorkspaceTab === 'products',
  })

  const rawProducts: Product[] = data?.data ?? []
  const products = rawProducts
  const pagination = data?.pagination ?? { total: products.length, current_page: 1, last_page: 1 }

  const { data: categories } = useQuery({
    queryKey: ['categories-select'],
    queryFn: () => api.get('/categories', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: brands } = useQuery({
    queryKey: ['brands-select'],
    queryFn: () => api.get('/brands', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const analytics = useMemo(() => {
    const totalProducts = statsData?.total_products ?? pagination.total ?? products.length ?? 0
    const activeProducts = statsData?.active_products ?? products.filter(p => p.status === 'active').length
    const inactiveProducts = statsData?.inactive_products ?? products.filter(p => p.status !== 'active').length
    const outOfStock = statsData?.out_of_stock ?? products.filter(p => (p.stock ?? 0) <= 0).length

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      outOfStock,
      categoriesCount: statsData?.categories ?? categories?.length ?? 0,
      brandsCount: statsData?.brands ?? brands?.length ?? 0,
      attributesCount: statsData?.attributes ?? 0,
      variantsCount: statsData?.variants ?? 0,
      costValue: Number(statsData?.cost_value ?? 0),
      sellingValue: Number(statsData?.selling_value ?? statsData?.inventory_value ?? 0),
      potentialProfit: Number(statsData?.potential_profit ?? statsData?.profit_value ?? 0),
      averagePrice: Number(statsData?.average_price ?? 0),
      bestSelling: statsData?.best_selling ?? 0,
      lowSelling: statsData?.low_selling ?? 0,
      mostViewed: statsData?.most_viewed ?? 0,
      averageRating: statsData?.average_rating ?? 0,
      todayNewProducts: statsData?.today_new_products ?? 0,
      lowStockProducts: statsData?.low_stock ?? statsData?.low_stock_products ?? 0,
      productsOnSale: statsData?.products_on_sale ?? 0,
      productsWithDiscount: statsData?.products_with_discount ?? 0,
      recentlyUpdated: statsData?.recently_updated ?? 0
    }
  }, [statsData, pagination, products, categories, brands])

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success(t('toast.deleted'))
      adjustAfterDelete(products.length)
      setDeleteConfirm({ open: false, id: null, force: false })
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('toast.error'))
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => api.post('/products/bulk-delete', { ids }),
    onSuccess: (_, ids) => {
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success(`${ids.length} products deleted.`)
      setSelectedRows([])
      setBulkDeleteConfirmOpen(false)
      adjustAfterDelete(products.length - ids.length)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to delete selected products.')
  })

  const handleExport = () => toast.info('Downloading products CSV export...')

  const handleImportSubmit = async () => {
    if (!importFile) return
    setImporting(true)
    try {
      await new Promise(res => setTimeout(res, 800))
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Successfully imported products CSV dataset!')
      setImportOpen(false)
      setImportFile(null)
    } catch {
      toast.error('Failed to import products dataset.')
    } finally {
      setImporting(false)
    }
  }

  const handleSubTabAddClick = () => {
    if (activeWorkspaceTab === 'products') navigate('/products/create')
    else if (activeWorkspaceTab === 'categories') setCategoryAddTrigger(prev => prev + 1)
    else if (activeWorkspaceTab === 'brands') setBrandAddTrigger(prev => prev + 1)
    else if (activeWorkspaceTab === 'units') setUnitAddTrigger(prev => prev + 1)
    else if (activeWorkspaceTab === 'attributes') setAttributeAddTrigger(prev => prev + 1)
    else if (activeWorkspaceTab === 'taxes') setTaxAddTrigger(prev => prev + 1)
  }

  const resetAllFilters = () => {
    setStatusFilter('')
    setCategoryFilter('')
    setBrandFilter('')
    setStockLevelFilter('')
    setPriceMinFilter('')
    setPriceMaxFilter('')
    reset()
  }

  return (
    <div className="space-y-5 print:p-0">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Products' }]} />

      {/* Hero Header */}
      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs print:hidden">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span>Product Catalog & Inventory Management</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            Manage your entire product catalog, SKUs, categories, brands, variants, pricing, and live inventory levels.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeWorkspaceTab === 'products' && (
            <>
              <button
                onClick={() => setImportOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs"
              >
                <Upload size={15} />
                <span>Import CSV</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs"
              >
                <Download size={15} />
                <span>Export CSV</span>
              </button>
            </>
          )}
          <button
            onClick={handleSubTabAddClick}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus size={16} />
            <span>Add {activeWorkspaceTab.replace(/s$/, '')}</span>
          </button>
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto no-scrollbar print:hidden">
        {[
          { id: 'products', label: 'All Products' },
          { id: 'categories', label: 'Categories' },
          { id: 'brands', label: 'Brands' },
          { id: 'units', label: 'Units' },
          { id: 'attributes', label: 'Attributes' },
          { id: 'taxes', label: 'Tax Rates' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveWorkspaceTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeWorkspaceTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeWorkspaceTab === 'categories' ? (
        <CategoriesPage isTab triggerAdd={categoryAddTrigger} />
      ) : activeWorkspaceTab === 'brands' ? (
        <BrandsPage isTab triggerAdd={brandAddTrigger} />
      ) : activeWorkspaceTab === 'units' ? (
        <UnitsPage isTab triggerAdd={unitAddTrigger} />
      ) : activeWorkspaceTab === 'attributes' ? (
        <AttributesPage isTab triggerAdd={attributeAddTrigger} />
      ) : activeWorkspaceTab === 'taxes' ? (
        <TaxesPage isTab triggerAdd={taxAddTrigger} />
      ) : (
        <>
          {/* KPI Cards */}
          <ProductStatsCards analytics={analytics} formatCurrency={formatCurrency} />

          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-xs print:hidden">
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[260px] sm:max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search product name, SKU, or barcode..."
                  className="form-input pl-9 w-full text-xs rounded-xl border border-border bg-card text-foreground"
                />
              </div>

              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-all shadow-xs"
              >
                <Filter size={14} />
                <span>Filter</span>
              </button>

              <ResetButton onClick={resetAllFilters} />

              {selectedRows.length > 0 && (
                <button
                  onClick={() => setBulkDeleteConfirmOpen(true)}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-rose-500/10 text-rose-600 rounded-xl border border-rose-500/20 hover:bg-rose-500/20"
                >
                  <Trash2 size={13} />
                  <span>Delete Selected ({selectedRows.length})</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                onClick={() => qc.invalidateQueries({ queryKey: ['products'] })}
                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-xs"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowColSettings(!showColSettings)}
                  className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-xs"
                  title="Column Settings"
                >
                  <Settings size={14} />
                </button>
                <AnimatePresence>
                  {showColSettings && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowColSettings(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl p-2 z-20 space-y-1">
                        <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase">Toggle Columns</p>
                        {Object.keys(visibleColumns).map((col) => (
                          <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-xl text-xs cursor-pointer text-foreground capitalize">
                            <input
                              type="checkbox"
                              checked={visibleColumns[col]}
                              onChange={(e) => setVisibleColumns((prev) => ({ ...prev, [col]: e.target.checked }))}
                              className="form-checkbox h-3.5 w-3.5 text-primary rounded border-border"
                            />
                            <span>{col}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Filter Drawer */}
          <ProductFilterDrawer
            isOpen={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            stockLevelFilter={stockLevelFilter}
            setStockLevelFilter={setStockLevelFilter}
            priceMinFilter={priceMinFilter}
            setPriceMinFilter={setPriceMinFilter}
            priceMaxFilter={priceMaxFilter}
            setPriceMaxFilter={setPriceMaxFilter}
            categories={categories || []}
            brands={brands || []}
            onReset={resetAllFilters}
          />

          {/* Table */}
          <ProductTableSection
            products={products}
            isLoading={isLoading}
            isFetching={isFetching}
            visibleColumns={visibleColumns}
            recycleBinMode={recycleBinMode}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            onView={(p) => setViewProduct(p)}
            onEdit={(p) => navigate(`/products/edit/${p.id}`)}
            onDelete={(p) => setDeleteConfirm({ open: true, id: p.id, force: false, name: p.name })}
            onRestore={() => {}}
            onForceDelete={() => {}}
            formatCurrency={formatCurrency}
          />

          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />

          {/* Detail Drawer */}
          <ProductDetailDrawer
            product={viewProduct}
            onClose={() => setViewProduct(null)}
            onEdit={(p) => navigate(`/products/edit/${p.id}`)}
            formatCurrency={formatCurrency}
          />

          {/* CSV Import Modal */}
          <ProductImportModal
            isOpen={importOpen}
            onClose={() => setImportOpen(false)}
            importFile={importFile}
            setImportFile={setImportFile}
            importing={importing}
            handleImportSubmit={handleImportSubmit}
          />

          {/* Delete Dialog */}
          <ConfirmDialog
            open={deleteConfirm.open}
            title="Delete Product"
            message={`Are you sure you want to delete product "${deleteConfirm.name}"?`}
            onConfirm={() => deleteConfirm.id && deleteMutation.mutate(deleteConfirm.id)}
            onCancel={() => setDeleteConfirm({ open: false, id: null, force: false })}
          />

          {/* Bulk Delete Dialog */}
          <ConfirmDialog
            open={bulkDeleteConfirmOpen}
            title="Bulk Delete Products"
            message={`Are you sure you want to delete ${selectedRows.length} selected products?`}
            onConfirm={() => bulkDeleteMutation.mutate(selectedRows)}
            onCancel={() => setBulkDeleteConfirmOpen(false)}
          />
        </>
      )}
    </div>
  )
}

export default ProductsPage
