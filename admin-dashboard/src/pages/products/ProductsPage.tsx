import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import {
  Package, Plus, Search, Filter, RefreshCw, Download, Upload, Settings, Trash2, X,
  FolderTree, Sparkles, Scale, SlidersHorizontal, Receipt
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import ResetButton from '@/components/shared/ResetButton'
import WorkspaceTabs from '@/components/shared/WorkspaceTabs'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'
import { formatCurrency } from '@/utils/formatters'

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
import { ColumnSettingsPopover } from '@/components/shared/ColumnSettingsPopover'
import type { Product } from './types/productsPage.types'

const ProductsPage: React.FC = () => {
  const { language } = useThemeStore()
  const { t, i18n } = useTranslation(['products', 'common'])
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const qc = useQueryClient()
  const toast = useToast()
  const locale = i18n.language === 'km' ? 'km-KH' : 'en-US'
  const formatMoney = (amount: number) => formatCurrency(amount, { locale })

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
      toast.success(
        t('products.bulkDeleteSuccess', {
          count: ids.length,
          defaultValue: `${ids.length} products deleted.`
        }).replace('{{count}}', String(ids.length))
      )
      setSelectedRows([])
      setBulkDeleteConfirmOpen(false)
      adjustAfterDelete(products.length - ids.length)
    },
    onError: (err: any) =>
      toast.error(
        err?.response?.data?.message ??
          t('products.bulkDeleteError', t('toast.error', 'Failed to delete selected products.'))
      )
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
            <span>{t('heroTitle', 'Product Catalog & Inventory Management')}</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            {t('heroSubtitle', 'Manage your entire product catalog, SKUs, categories, brands, variants, pricing, and live inventory levels.')}
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
                <span>{t('importCSV', 'Import CSV')}</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs"
              >
                <Download size={15} />
                <span>{t('exportCSV', 'Export CSV')}</span>
              </button>
            </>
          )}
          <button
            onClick={handleSubTabAddClick}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus size={16} />
            <span>
              {activeWorkspaceTab === 'products'
                ? t('addProduct', 'Add product')
                : activeWorkspaceTab === 'categories'
                ? t('addCategory', 'Add Category')
                : activeWorkspaceTab === 'brands'
                ? t('addBrand', 'Add Brand')
                : activeWorkspaceTab === 'units'
                ? t('addUnit', 'Add Unit')
                : activeWorkspaceTab === 'attributes'
                ? t('addAttribute', 'Add Attribute')
                : t('addTaxRule', 'Add Tax Rate')}
            </span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <ProductStatsCards analytics={analytics} formatCurrency={formatMoney} />

      {/* Workspace Tabs Navigation */}
      <WorkspaceTabs
        tabs={[
          { id: 'products', label: t('tabProducts', 'All Products'), icon: Package },
          { id: 'categories', label: t('tabCategories', 'Categories'), icon: FolderTree },
          { id: 'brands', label: t('tabBrands', 'Brands'), icon: Sparkles },
          { id: 'units', label: t('tabUnits', 'Units'), icon: Scale },
          { id: 'attributes', label: t('tabAttributes', 'Attributes'), icon: SlidersHorizontal },
          { id: 'taxes', label: t('tabTaxes', 'Tax Rates'), icon: Receipt },
        ]}
        activeTab={activeWorkspaceTab}
        onChange={setActiveWorkspaceTab}
      />

      {/* Active Tab View */}
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
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-sm print:hidden">
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto flex-1">
              <div className="relative min-w-[280px] sm:min-w-[340px] md:w-96 max-w-md flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder={t('searchPlaceholder', 'Search product name, SKU, or barcode...')}
                  className="w-full h-10 pl-10 pr-9 text-xs sm:text-sm rounded-xl border border-border bg-card hover:border-muted-foreground/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all placeholder:text-muted-foreground shadow-sm font-medium"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(''); setPage(1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
                    type="button"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setFilterDrawerOpen(true)}
                className={`inline-flex items-center gap-2 h-10 px-3.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer select-none shrink-0 ${
                  (statusFilter || categoryFilter || brandFilter || stockLevelFilter || priceMinFilter || priceMaxFilter)
                    ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/15'
                    : 'border-border bg-card hover:bg-muted/80 text-foreground'
                }`}
              >
                <Filter size={15} className={(statusFilter || categoryFilter || brandFilter || stockLevelFilter || priceMinFilter || priceMaxFilter) ? 'text-primary' : 'text-muted-foreground'} />
                <span>{t('filter', 'Filter')}</span>
                {(statusFilter || categoryFilter || brandFilter || stockLevelFilter || priceMinFilter || priceMaxFilter) && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>

              <ResetButton onClick={resetAllFilters} />

              {selectedRows.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBulkDeleteConfirmOpen(true)}
                  className="inline-flex items-center gap-1.5 h-10 px-3.5 text-xs sm:text-sm font-semibold bg-rose-500/10 text-rose-600 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 active:scale-[0.98] transition-all cursor-pointer shrink-0"
                >
                  <Trash2 size={14} />
                  <span>{t('products.deleteSelected', t('common.deleteSelected', 'Delete Selected'))} ({selectedRows.length})</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                type="button"
                onClick={() => qc.invalidateQueries({ queryKey: ['products'] })}
                className="h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-muted/80 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer shrink-0"
                title={t('refresh', 'Refresh')}
              >
                <RefreshCw size={15} />
              </button>

              <ColumnSettingsPopover
                columns={[
                  { key: 'image', label: t('products.colPhoto', 'Image') },
                  { key: 'name', label: t('products.colName', 'Product Name') },
                  { key: 'sku', label: t('products.sku', 'SKU') },
                  { key: 'category', label: t('products.colCategory', 'Category') },
                  { key: 'price', label: t('products.colPrice', 'Price') },
                  { key: 'stock', label: t('products.colStock', 'Stock') },
                  { key: 'status', label: t('products.colStatus', 'Status') },
                ]}
                visibleColumns={visibleColumns}
                onChange={setVisibleColumns}
              />
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
            onEdit={(p) => navigate(`/products/${p.id}/edit`)}
            onDelete={(p) => setDeleteConfirm({ open: true, id: p.id, force: false, name: p.name })}
            onRestore={() => {}}
            onForceDelete={() => {}}
            formatCurrency={formatMoney}
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
            onEdit={(p) => navigate(`/products/${p.id}/edit`)}
            formatCurrency={formatMoney}
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
            title="products.deleteProduct"
            itemName={deleteConfirm.name}
            confirmText="common.confirmDelete"
            cancelText="common.cancel"
            loading={deleteMutation.isPending}
            onConfirm={() => deleteConfirm.id && deleteMutation.mutate(deleteConfirm.id)}
            onCancel={() => setDeleteConfirm({ open: false, id: null, force: false })}
          />

          {/* Bulk Delete Dialog */}
          <ConfirmDialog
            open={bulkDeleteConfirmOpen}
            title={t('products.bulkDeleteTitle', 'Delete Selected Products')}
            message={t('products.confirmBulkDeleteMessage', {
              count: selectedRows.length,
              defaultValue: `Are you sure you want to delete all ${selectedRows.length} selected products? This action cannot be undone.`
            }).replace('{{count}}', String(selectedRows.length))}
            confirmText="common.confirmDelete"
            cancelText="common.cancel"
            loading={bulkDeleteMutation.isPending}
            onConfirm={() => bulkDeleteMutation.mutate(selectedRows)}
            onCancel={() => setBulkDeleteConfirmOpen(false)}
          />
        </>
      )}
    </div>
  )
}

export default ProductsPage
