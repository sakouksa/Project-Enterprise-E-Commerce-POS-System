import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Filter, Edit2, Trash2, Eye,
  Package, Download, RefreshCw, Star, X, Loader2,
  Image as ImageIcon, DollarSign, Layers, Shield, Settings,
  AlertCircle, History, Sparkles, MessageSquare, Check, ArrowRight,
  Tag, List
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useTranslation } from 'react-i18next'

import CategoriesPage from '@/modules/categories/pages/CategoriesPage'
import BrandsPage from '@/pages/brands/BrandsPage'
import UnitsPage from '@/pages/settings/UnitsPage'
import AttributesPage from '@/pages/attributes/AttributesPage'

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
  short_description?:  string
  meta_title?:         string
  meta_description?:   string
  meta_keywords?:      string
  category?:           { id: number; name: string }
  brand?:              { id: number; name: string }
  unit?:               { id: number; name: string; symbol: string }
  tax?:                { id: number; name: string; rate: number }
  primary_image?:      string
  images?:             ProductImage[]
  variants?:           ProductVariant[]
  prices?:             ProductPrice[]
  reviews?:            ProductReview[]
  stock?:              number
}

interface ProductImage {
  id: number
  image: string
  url?: string
  is_primary: boolean
  sort_order: number
}

interface ProductVariant {
  id: number
  name: string
  sku: string
  barcode?: string
  cost_price: number
  selling_price: number
  weight?: number
  is_active: boolean
}

interface ProductPrice {
  id: number
  price_type: string
  min_qty: number
  price: number
  currency_code: string
  start_date?: string
  end_date?: string
}

interface ProductReview {
  id: number
  customer_name: string
  rating: number
  title?: string
  body?: string
  created_at: string
}

interface ProductForm {
  name:                string
  sku:                 string
  barcode:             string
  category_id:         string
  brand_id:            string
  unit_id:             string
  tax_id:              string
  description:         string
  short_description:   string
  cost_price:          string
  selling_price:       string
  compare_price:       string
  weight:              string
  length:              string
  width:               string
  height:              string
  track_inventory:     boolean
  low_stock_threshold: string
  status:              string
  is_featured:         boolean
  is_digital:          boolean
  meta_title:          string
  meta_description:    string
  meta_keywords:       string
}

const BLANK_FORM: ProductForm = {
  name: '',
  sku: '',
  barcode: '',
  category_id: '',
  brand_id: '',
  unit_id: '',
  tax_id: '',
  description: '',
  short_description: '',
  cost_price: '',
  selling_price: '',
  compare_price: '',
  weight: '',
  length: '',
  width: '',
  height: '',
  track_inventory: true,
  low_stock_threshold: '5',
  status: 'active',
  is_featured: false,
  is_digital: false,
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
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
  const activeWorkspaceTab = (searchParams.get('workspaceTab') as 'products' | 'categories' | 'brands' | 'units' | 'attributes') || 'products'
  const setActiveWorkspaceTab = (tab: string) => {
    if (tab === 'products') {
      setSearchParams({})
    } else {
      setSearchParams({ workspaceTab: tab })
    }
  }

  const getAbsoluteImageUrl = (urlOrPath?: any) => {
    if (!urlOrPath) return '';
    if (typeof urlOrPath !== 'string') {
      if (urlOrPath.image) urlOrPath = urlOrPath.image;
      else if (urlOrPath.image_path) urlOrPath = urlOrPath.image_path;
      else if (urlOrPath.url) urlOrPath = urlOrPath.url;
      else return '';
    }
    if (typeof urlOrPath !== 'string') return '';
    if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
      return urlOrPath;
    }
    const cleaned = urlOrPath.startsWith('/') ? urlOrPath.substring(1) : urlOrPath;
    const path = cleaned.startsWith('storage/') ? cleaned : `storage/${cleaned}`;
    const baseUrl = api.defaults.baseURL ? api.defaults.baseURL.split('/api')[0] : 'http://127.0.0.1:8001';
    return `${baseUrl}/${path}`;
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
    const [status, setStatus] = useState('')

  // Modal / Tab states
  const [modalOpen, setModalOpen]       = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [form, setForm]                 = useState<ProductForm>(BLANK_FORM)
  const [formTab, setFormTab]           = useState<'basic' | 'pricing' | 'inventory' | 'dimensions' | 'images' | 'variants' | 'seo' | 'pricing_rules' | 'reviews'>('basic')

  // Inline additions inside sub-tabs
  const [newTierPrice, setNewTierPrice] = useState({ price_type: 'wholesale', min_qty: '5', price: '', currency_code: 'IDR' })
  const [newVariant, setNewVariant] = useState({ name: '', sku: '', cost_price: '', selling_price: '' })
  const [newAdjustment, setNewAdjustment] = useState({ warehouse_id: '', type: 'addition', quantity: '', reason: '' })

  // View drawer
  const [viewProduct, setViewProduct] = useState<Product | null>(null)
  const [detailDrawerTab, setDetailDrawerTab] = useState<'info' | 'gallery' | 'variants' | 'pricing' | 'inventory'>('info')
  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', page, debouncedSearch, perPage, status],
    queryFn:  () => api.get('/products', { params: { page, search, status, per_page: 15 } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  // Selected Product Detail (Loaded dynamically when editing/viewing)
  const { data: productDetail, refetch: refetchDetail } = useQuery({
    queryKey: ['product-detail', selectedProductId],
    queryFn: () => selectedProductId ? api.get(`/products/${selectedProductId}`).then(r => r.data.data) : null,
    enabled: !!selectedProductId
  })

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

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses-select'],
    queryFn: () => api.get('/warehouses', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  // Stock History Logs / movements query
  const { data: movements } = useQuery({
    queryKey: ['inventory-movements', selectedProductId],
    queryFn: () => selectedProductId ? api.get('/inventory-movements', { params: { product_id: selectedProductId } }).then(r => r.data.data ?? []) : [],
    enabled: !!selectedProductId && (formTab === 'inventory' || detailDrawerTab === 'inventory')
  })

  // ─── Mutations ────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/products', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product created successfully.')
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create product.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/products/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product details updated successfully.')
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update product.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted successfully.')
      setDeleteTarget(null)
      adjustAfterDelete(products.length)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete product.')
      setDeleteTarget(null)
    },
  })

  // Image Upload Mutation
  const uploadImageMutation = useMutation({
    mutationFn: (formData: FormData) => api.post(`/products/${selectedProductId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      refetchDetail()
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Image uploaded successfully.')
    },
    onError: () => toast.error('Failed to upload image.')
  })

  const deleteImageMutation = useMutation({
    mutationFn: (imgId: number) => {
      if (!selectedProductId) throw new Error('No product selected')
      return api.delete(`/products/${selectedProductId}/images/${imgId}`).then(r => r.data)
    },
    onSuccess: () => {
      refetchDetail()
      toast.success('Image deleted successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete image.')
    }
  })

  // Tiered Pricing Mutations
  const addPriceMutation = useMutation({
    mutationFn: (payload: any) => api.post('/product-prices', payload),
    onSuccess: () => {
      refetchDetail()
      toast.success('Tiered price rule added.')
      setNewTierPrice({ price_type: 'wholesale', min_qty: '5', price: '', currency_code: 'IDR' })
    },
    onError: () => toast.error('Failed to add price rule.')
  })

  const deletePriceMutation = useMutation({
    mutationFn: (priceId: number) => api.delete(`/product-prices/${priceId}`),
    onSuccess: () => {
      refetchDetail()
      toast.success('Tier price rule deleted.')
    },
    onError: () => toast.error('Failed to delete price rule.')
  })

  // Stock Adjustment Mutation
  const addAdjustmentMutation = useMutation({
    mutationFn: (payload: any) => api.post('/stock-adjustments', payload),
    onSuccess: () => {
      refetchDetail()
      qc.invalidateQueries({ queryKey: ['inventory-movements', selectedProductId] })
      toast.success('Stock adjustment logged successfully.')
      setNewAdjustment({ warehouse_id: '', type: 'addition', quantity: '', reason: '' })
    },
    onError: () => toast.error('Failed to log stock adjustment.')
  })

  // Variant Mutations
  const addVariantMutation = useMutation({
    mutationFn: (payload: any) => api.post('/product-variants', payload),
    onSuccess: () => {
      refetchDetail()
      toast.success('Variant created successfully.')
      setNewVariant({ name: '', sku: '', cost_price: '', selling_price: '' })
    },
    onError: () => toast.error('Failed to create variant.')
  })

  const deleteVariantMutation = useMutation({
    mutationFn: (variantId: number) => api.delete(`/product-variants/${variantId}`),
    onSuccess: () => {
      refetchDetail()
      toast.success('Variant deleted.')
    },
    onError: () => toast.error('Failed to delete variant.')
  })

  const products: Product[] = data?.data ?? []
  const pagination          = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Populate form fields on detail load
  useEffect(() => {
    if (productDetail && selectedProductId) {
      setForm({
        name:                productDetail.name,
        sku:                 productDetail.sku,
        barcode:             productDetail.barcode ?? '',
        description:         productDetail.description ?? '',
        short_description:   productDetail.short_description ?? '',
        category_id:         String(productDetail.category_id ?? productDetail.category?.id ?? ''),
        brand_id:            String(productDetail.brand_id ?? productDetail.brand?.id ?? ''),
        unit_id:             String(productDetail.unit_id ?? productDetail.unit?.id ?? ''),
        tax_id:              String(productDetail.tax_id ?? productDetail.tax?.id ?? ''),
        cost_price:          String(productDetail.cost_price ?? ''),
        selling_price:       String(productDetail.selling_price),
        compare_price:       String(productDetail.compare_price ?? ''),
        weight:              String(productDetail.weight ?? ''),
        length:              String(productDetail.length ?? ''),
        width:               String(productDetail.width ?? ''),
        height:              String(productDetail.height ?? ''),
        track_inventory:     productDetail.track_inventory,
        low_stock_threshold: String(productDetail.low_stock_threshold ?? '5'),
        status:              productDetail.status,
        is_featured:         productDetail.is_featured,
        is_digital:          productDetail.is_digital,
        meta_title:          productDetail.meta_title ?? '',
        meta_description:    productDetail.meta_description ?? '',
        meta_keywords:       productDetail.meta_keywords ?? '',
      })
    }
  }, [productDetail, selectedProductId])

  // Read tab parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['images', 'pricing', 'variants'].includes(tabParam)) {
      setFormTab(tabParam as any);
      if (products.length > 0) {
        setSelectedProductId(products[0].id);
        setModalOpen(true);
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [products]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setSelectedProductId(null)
    setForm(BLANK_FORM)
    setFormTab('basic')
    setModalOpen(true)
  }

  const openEditModal = (p: Product) => {
    setSelectedProductId(p.id)
    setFormTab('basic')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedProductId(null)
    setForm(BLANK_FORM)
  }

  const setField = (key: keyof ProductForm, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: any = {
      company_id:          1,
      name:                form.name,
      sku:                 form.sku,
      barcode:             form.barcode || null,
      description:         form.description || null,
      short_description:   form.short_description || null,
      selling_price:       parseFloat(form.selling_price) || 0,
      status:              form.status,
      is_featured:         form.is_featured,
      is_digital:          form.is_digital,
      track_inventory:     form.track_inventory,
      low_stock_threshold: parseInt(form.low_stock_threshold) || 5,
      meta_title:          form.meta_title || null,
      meta_description:    form.meta_description || null,
      meta_keywords:       form.meta_keywords || null,

      cost_price:          form.cost_price ? parseFloat(form.cost_price) : null,
      compare_price:       form.compare_price ? parseFloat(form.compare_price) : null,
      weight:              form.weight ? parseFloat(form.weight) : null,
      length:              form.length ? parseFloat(form.length) : null,
      width:               form.width ? parseFloat(form.width) : null,
      height:              form.height ? parseFloat(form.height) : null,
      category_id:         form.category_id ? parseInt(form.category_id) : null,
      brand_id:            form.brand_id ? parseInt(form.brand_id) : null,
      unit_id:             form.unit_id ? parseInt(form.unit_id) : null,
      tax_id:              form.tax_id ? parseInt(form.tax_id) : null,
    }

    if (selectedProductId) {
      updateMutation.mutate({ id: selectedProductId, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && selectedProductId) {
      const formData = new FormData()
      Array.from(e.target.files).forEach(file => {
        formData.append('images[]', file)
      })
      formData.append('primary_index', '0')
      uploadImageMutation.mutate(formData)
    }
  }

  const handleAddTierPrice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTierPrice.price || !selectedProductId) return
    addPriceMutation.mutate({
      product_id: selectedProductId,
      price_type: newTierPrice.price_type,
      min_qty: parseInt(newTierPrice.min_qty),
      price: parseFloat(newTierPrice.price),
      currency_code: newTierPrice.currency_code
    })
  }

  const handleAddVariant = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVariant.name || !newVariant.selling_price || !selectedProductId) return
    addVariantMutation.mutate({
      product_id: selectedProductId,
      name: newVariant.name,
      sku: newVariant.sku || undefined,
      cost_price: parseFloat(newVariant.cost_price) || 0,
      selling_price: parseFloat(newVariant.selling_price),
      is_active: true
    })
  }

  const handleAddAdjustment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdjustment.warehouse_id || !newAdjustment.quantity || !selectedProductId) return
    addAdjustmentMutation.mutate({
      product_id: selectedProductId,
      warehouse_id: parseInt(newAdjustment.warehouse_id),
      type: newAdjustment.type,
      quantity: parseFloat(newAdjustment.quantity),
      reason: newAdjustment.reason || 'Manual adjustment'
    })
  }

  const handleExport = () => {
    toast.info('Generating export... download will begin shortly.')
    api.get('/reports/export-inventory', { responseType: 'blob' })
      .then(r => {
        const url = URL.createObjectURL(r.data)
        const a   = document.createElement('a')
        a.href    = url
        a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Export downloaded successfully.')
      })
      .catch(() => toast.error('Export failed. Please try again.'))
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Inventory' }, { label: 'Products' }]} />

      {/* Workspace Tabs */}
      <div className="flex border-b border-border bg-card rounded-t-xl px-4 overflow-x-auto gap-2">
        {[
          { id: 'products',   label: t('nav.allProducts'), icon: <Package size={14} /> },
          { id: 'categories', label: t('nav.categories'), icon: <Layers size={14} /> },
          { id: 'brands',     label: t('nav.brands'), icon: <Tag size={14} /> },
          { id: 'units',      label: t('nav.units'), icon: <Settings size={14} /> },
          { id: 'attributes', label: t('nav.attributes'), icon: <List size={14} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveWorkspaceTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 -mb-[2px] transition-colors whitespace-nowrap
                        ${activeWorkspaceTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeWorkspaceTab === 'products' ? (
        <>
          {/* Header */}
          <PageHeader
            title="Products"
            subtitle="Manage warehouse items, online listing details, and stock alerts"
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground border border-border
                             rounded-lg hover:bg-muted transition-colors"
                >
                  <Download size={14} />
                  Export
                </button>
                <button
                  onClick={() => navigate('/products/create')}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                             bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  Add Product
                </button>
              </div>
            }
          />

          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-56">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Search products by name or SKU..."
                  className="form-input pl-9 w-full"
                />
              </div>
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1) }}
                className="form-input w-40"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
                <option value="deleted">Deleted</option>
              </select>
              <button
                onClick={() => { setSearch(''); setStatus(''); setPage(1) }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <Filter size={14} />
                Reset
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4">Product</th>
                    <th className="text-left py-3 px-4">SKU</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Stock</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Rating</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="skeleton w-10 h-10 rounded-lg" />
                              <div className="skeleton h-4 w-32 rounded" />
                            </div>
                          </td>
                          {Array.from({ length: 6 }).map((_, j) => (
                            <td key={j} className="py-3 px-4"><div className="skeleton h-4 w-16 rounded" /></td>
                          ))}
                          <td className="py-3 px-4"><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                        </tr>
                      ))
                    : products.map((product) => (
                        <tr key={product.id} className="border-b border-border/50 group hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {product.primary_image ? (
                                <img src={getAbsoluteImageUrl(product.primary_image)} alt={product.name}
                                     className="w-10 h-10 rounded-lg object-cover border border-border flex-shrink-0" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                  <Package size={16} className="text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-foreground text-sm">{product.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {product.is_featured && (
                                    <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
                                      <Star size={10} fill="currentColor" /> Featured
                                    </span>
                                  )}
                                  {product.is_digital && (
                                    <span className="text-[10px] text-indigo-500 font-semibold">
                                      Digital
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{product.sku}</td>
                          <td className="py-3 px-4 text-muted-foreground text-sm">{product.category?.name ?? '—'}</td>
                          <td className="py-3 px-4 font-semibold text-sm">
                            ${Number(product.selling_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold">
                            {product.stock ?? 0}
                          </td>
                          <td className="py-3 px-4">
                            <span className={STATUS_BADGE[product.status] ?? 'badge-muted'}>
                              {product.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-sm">
                              <Star size={12} className="text-amber-400 fill-amber-400" />
                              {product.rating_avg > 0 ? product.rating_avg.toFixed(1) : '—'}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => { setSelectedProductId(product.id); setViewProduct(product); setDetailDrawerTab('info') }}
                                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                title="View Detail"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => navigate(`/products/${product.id}/edit`)}
                                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(product)}
                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  }
                  {!isLoading && products.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-16 text-center">
                        <Package size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No products found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
          </div>
        </>
      ) : (
        <>
          {activeWorkspaceTab === 'categories' && <CategoriesPage isTab />}
          {activeWorkspaceTab === 'brands' && <BrandsPage isTab />}
          {activeWorkspaceTab === 'units' && <UnitsPage isTab />}
          {activeWorkspaceTab === 'attributes' && <AttributesPage isTab />}
        </>
      )}

      {/* ─── Create / Edit Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl my-4"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">
                  {selectedProductId ? 'Edit Product Workspace' : 'Add Product'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              {/* Form Tabs */}
              <div className="flex border-b border-border bg-muted/20 px-6 overflow-x-auto">
                {[
                  { id: 'basic',         label: 'Basic Information', icon: <Layers size={14} /> },
                  { id: 'pricing',       label: 'Pricing',           icon: <DollarSign size={14} />, disabled: !selectedProductId },
                  { id: 'inventory',     label: 'Inventory',         icon: <History size={14} />, disabled: !selectedProductId },
                  { id: 'dimensions',    label: 'Dimensions',        icon: <Layers size={14} />, disabled: !selectedProductId },
                  { id: 'images',        label: 'Images',            icon: <ImageIcon size={14} />, disabled: !selectedProductId },
                  { id: 'variants',      label: 'Variants',          icon: <Sparkles size={14} />, disabled: !selectedProductId },
                  { id: 'seo',           label: 'Advanced SEO',      icon: <Sparkles size={14} />, disabled: !selectedProductId },
                  { id: 'pricing_rules', label: 'Pricing Rules',     icon: <DollarSign size={14} />, disabled: !selectedProductId },
                  { id: 'reviews',       label: 'Reviews',           icon: <MessageSquare size={14} />, disabled: !selectedProductId },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    disabled={tab.disabled}
                    onClick={() => setFormTab(tab.id as any)}
                    className={`flex items-center gap-1.5 py-3 px-4 text-xs font-semibold border-b-2 -mb-[2px] transition-colors whitespace-nowrap
                                ${tab.disabled ? 'opacity-40 cursor-not-allowed' : ''}
                                ${formTab === tab.id
                                  ? 'border-blue-600 text-blue-600'
                                  : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                {/* ─── CREATE MODE: Renders the entire product fields in a single scrollable form ─── */}
                {!selectedProductId && formTab === 'basic' && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.name}
                          onChange={e => setField('name', e.target.value)}
                          required
                          placeholder="e.g. iPhone 15 Pro"
                          className="form-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          SKU <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.sku}
                          onChange={e => setField('sku', e.target.value)}
                          required
                          placeholder="e.g. SKU-IP15P"
                          className="form-input font-mono w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Barcode</label>
                        <input
                          value={form.barcode}
                          onChange={e => setField('barcode', e.target.value)}
                          placeholder="UPC/EAN barcode number"
                          className="form-input font-mono w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                        <select
                          value={form.category_id}
                          onChange={e => setField('category_id', e.target.value)}
                          className="form-input w-full cursor-pointer"
                        >
                          <option value="">No Category</option>
                          {(categories ?? []).map((c: any) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Brand</label>
                        <select
                          value={form.brand_id}
                          onChange={e => setField('brand_id', e.target.value)}
                          className="form-input w-full cursor-pointer"
                        >
                          <option value="">No Brand</option>
                          {(brands ?? []).map((b: any) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Unit</label>
                        <select
                          value={form.unit_id}
                          onChange={e => setField('unit_id', e.target.value)}
                          className="form-input w-full cursor-pointer"
                        >
                          <option value="">No Unit</option>
                          {(units ?? []).map((u: any) => (
                            <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Tax Rules</label>
                        <select
                          value={form.tax_id}
                          onChange={e => setField('tax_id', e.target.value)}
                          className="form-input w-full cursor-pointer"
                        >
                          <option value="">No Tax</option>
                          {(taxes ?? []).map((t: any) => (
                            <option key={t.id} value={t.id}>{t.name} ({Number(t.rate)}%)</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Publish Status</label>
                        <select
                          value={form.status}
                          onChange={e => setField('status', e.target.value)}
                          className="form-input w-full cursor-pointer"
                        >
                          <option value="active">Active (Visible)</option>
                          <option value="inactive">Inactive</option>
                          <option value="draft">Draft Folder</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Cost Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={form.cost_price}
                          onChange={e => setField('cost_price', e.target.value)}
                          placeholder="0.00"
                          className="form-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Selling Price ($) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={form.selling_price}
                          onChange={e => setField('selling_price', e.target.value)}
                          required
                          placeholder="0.00"
                          className="form-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Compare Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={form.compare_price}
                          onChange={e => setField('compare_price', e.target.value)}
                          placeholder="0.00"
                          className="form-input w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.001"
                          value={form.weight}
                          onChange={e => setField('weight', e.target.value)}
                          placeholder="0.000"
                          className="form-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Length (cm)</label>
                        <input
                          type="number"
                          value={form.length}
                          onChange={e => setField('length', e.target.value)}
                          placeholder="0"
                          className="form-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Width (cm)</label>
                        <input
                          type="number"
                          value={form.width}
                          onChange={e => setField('width', e.target.value)}
                          placeholder="0"
                          className="form-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Height (cm)</label>
                        <input
                          type="number"
                          value={form.height}
                          onChange={e => setField('height', e.target.value)}
                          placeholder="0"
                          className="form-input w-full"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 border-t border-border pt-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="track_inventory"
                          checked={form.track_inventory}
                          onChange={e => setField('track_inventory', e.target.checked)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <label htmlFor="track_inventory" className="text-sm font-medium text-muted-foreground cursor-pointer">
                          Track Inventory Levels
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="is_featured"
                          checked={form.is_featured}
                          onChange={e => setField('is_featured', e.target.checked)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <label htmlFor="is_featured" className="text-sm font-medium text-muted-foreground cursor-pointer">
                          Featured Listing
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Meta Title (SEO)</label>
                        <input
                          value={form.meta_title}
                          onChange={e => setField('meta_title', e.target.value)}
                          placeholder="SEO title..."
                          className="form-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Meta Keywords (SEO)</label>
                        <input
                          value={form.meta_keywords}
                          onChange={e => setField('meta_keywords', e.target.value)}
                          placeholder="Keywords separated by comma..."
                          className="form-input w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Meta Description (SEO)</label>
                      <textarea
                        value={form.meta_description}
                        onChange={e => setField('meta_description', e.target.value)}
                        rows={2}
                        placeholder="Meta description tags..."
                        className="form-input w-full resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Short Description</label>
                      <input
                        value={form.short_description}
                        onChange={e => setField('short_description', e.target.value)}
                        placeholder="Brief summary sentence..."
                        className="form-input w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Full Description</label>
                      <textarea
                        value={form.description}
                        onChange={e => setField('description', e.target.value)}
                        rows={3}
                        placeholder="Full product catalog specifications..."
                        className="form-input w-full resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-border">
                      <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
                      <button type="submit" disabled={createMutation.isPending} className="btn btn-primary bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-lg">
                        {createMutation.isPending && <Loader2 className="animate-spin" size={14} />}
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}

                {/* ─── EDIT MODE: Tab 1: Basic Information ─── */}
                {selectedProductId && formTab === 'basic' && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.name}
                          onChange={e => setField('name', e.target.value)}
                          required
                          placeholder="e.g. iPhone 15 Pro"
                          className="form-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          SKU <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={form.sku}
                          onChange={e => setField('sku', e.target.value)}
                          required
                          placeholder="e.g. SKU-IP15P"
                          className="form-input font-mono w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Barcode</label>
                        <input
                          value={form.barcode}
                          onChange={e => setField('barcode', e.target.value)}
                          placeholder="UPC/EAN barcode number"
                          className="form-input font-mono w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                        <select
                          value={form.category_id}
                          onChange={e => setField('category_id', e.target.value)}
                          className="form-input w-full cursor-pointer"
                        >
                          <option value="">No Category</option>
                          {(categories ?? []).map((c: any) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Brand</label>
                        <select
                          value={form.brand_id}
                          onChange={e => setField('brand_id', e.target.value)}
                          className="form-input w-full cursor-pointer"
                        >
                          <option value="">No Brand</option>
                          {(brands ?? []).map((b: any) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Unit</label>
                        <select
                          value={form.unit_id}
                          onChange={e => setField('unit_id', e.target.value)}
                          className="form-input w-full cursor-pointer"
                        >
                          <option value="">No Unit</option>
                          {(units ?? []).map((u: any) => (
                            <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Tax Rules</label>
                        <select
                          value={form.tax_id}
                          onChange={e => setField('tax_id', e.target.value)}
                          className="form-input w-full cursor-pointer"
                        >
                          <option value="">No Tax</option>
                          {(taxes ?? []).map((t: any) => (
                            <option key={t.id} value={t.id}>{t.name} ({Number(t.rate)}%)</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Publish Status</label>
                        <select
                          value={form.status}
                          onChange={e => setField('status', e.target.value)}
                          className="form-input w-full cursor-pointer"
                        >
                          <option value="active">Active (Visible)</option>
                          <option value="inactive">Inactive</option>
                          <option value="draft">Draft Folder</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4 border-t border-border pt-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="is_featured_edit"
                          checked={form.is_featured}
                          onChange={e => setField('is_featured', e.target.checked)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <label htmlFor="is_featured_edit" className="text-sm font-medium text-muted-foreground cursor-pointer">
                          Featured Listing
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="is_digital_edit"
                          checked={form.is_digital}
                          onChange={e => setField('is_digital', e.target.checked)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <label htmlFor="is_digital_edit" className="text-sm font-medium text-muted-foreground cursor-pointer">
                          Digital Product
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Short Description</label>
                      <input
                        value={form.short_description}
                        onChange={e => setField('short_description', e.target.value)}
                        placeholder="Brief summary sentence..."
                        className="form-input w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Full Description</label>
                      <textarea
                        value={form.description}
                        onChange={e => setField('description', e.target.value)}
                        rows={3}
                        placeholder="Full product catalog specifications..."
                        className="form-input w-full resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-border">
                      <button type="submit" disabled={updateMutation.isPending} className="btn btn-primary bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-lg">
                        {updateMutation.isPending && <Loader2 className="animate-spin" size={14} />}
                        Save Basic Info
                      </button>
                    </div>
                  </form>
                )}

                {/* ─── EDIT MODE: Tab 2: Pricing ─── */}
                {selectedProductId && formTab === 'pricing' && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Cost Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={form.cost_price}
                          onChange={e => setField('cost_price', e.target.value)}
                          placeholder="0.00"
                          className="form-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Selling Price ($) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={form.selling_price}
                          onChange={e => setField('selling_price', e.target.value)}
                          required
                          placeholder="0.00"
                          className="form-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Compare Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={form.compare_price}
                          onChange={e => setField('compare_price', e.target.value)}
                          placeholder="0.00"
                          className="form-input w-full"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-border">
                      <button type="submit" disabled={updateMutation.isPending} className="btn btn-primary bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-lg">
                        {updateMutation.isPending && <Loader2 className="animate-spin" size={14} />}
                        Save Pricing
                      </button>
                    </div>
                  </form>
                )}

                {/* ─── EDIT MODE: Tab 4: Dimensions ─── */}
                {selectedProductId && formTab === 'dimensions' && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.001"
                          value={form.weight}
                          onChange={e => setField('weight', e.target.value)}
                          placeholder="0.000"
                          className="form-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Length (cm)</label>
                        <input
                          type="number"
                          value={form.length}
                          onChange={e => setField('length', e.target.value)}
                          placeholder="0"
                          className="form-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Width (cm)</label>
                        <input
                          type="number"
                          value={form.width}
                          onChange={e => setField('width', e.target.value)}
                          placeholder="0"
                          className="form-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Height (cm)</label>
                        <input
                          type="number"
                          value={form.height}
                          onChange={e => setField('height', e.target.value)}
                          placeholder="0"
                          className="form-input w-full"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-border">
                      <button type="submit" disabled={updateMutation.isPending} className="btn btn-primary bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-lg">
                        {updateMutation.isPending && <Loader2 className="animate-spin" size={14} />}
                        Save Dimensions
                      </button>
                    </div>
                  </form>
                )}

                {/* ─── EDIT MODE: Tab 7: Advanced SEO ─── */}
                {selectedProductId && formTab === 'seo' && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Meta Title (SEO)</label>
                        <input
                          value={form.meta_title}
                          onChange={e => setField('meta_title', e.target.value)}
                          placeholder="SEO title..."
                          className="form-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Meta Keywords (SEO)</label>
                        <input
                          value={form.meta_keywords}
                          onChange={e => setField('meta_keywords', e.target.value)}
                          placeholder="Keywords separated by comma..."
                          className="form-input w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Meta Description (SEO)</label>
                      <textarea
                        value={form.meta_description}
                        onChange={e => setField('meta_description', e.target.value)}
                        rows={3}
                        placeholder="Meta description tags..."
                        className="form-input w-full resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-border">
                      <button type="submit" disabled={updateMutation.isPending} className="btn btn-primary bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-lg">
                        {updateMutation.isPending && <Loader2 className="animate-spin" size={14} />}
                        Save SEO Settings
                      </button>
                    </div>
                  </form>
                )}

                {/* ─── EDIT MODE: Tab 5: Gallery Images ─── */}
                {selectedProductId && formTab === 'images' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground">Product Gallery</h4>
                      <label className="btn btn-secondary flex items-center gap-2 cursor-pointer border border-border px-3 py-1.5 rounded-lg text-sm hover:bg-muted">
                        <ImageIcon size={14} /> Upload Images
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageFileChange} />
                      </label>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      {productDetail?.images?.map((img: ProductImage) => (
                        <div key={img.id} className="relative group border border-border rounded-xl overflow-hidden aspect-square bg-muted/20">
                          <img src={getAbsoluteImageUrl(img.url || img.image)} className="w-full h-full object-cover" alt="product" />
                          {img.is_primary && (
                            <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold">
                              Primary
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteImageMutation.mutate(img.id)}
                            className="absolute top-2 right-2 bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      {(!productDetail?.images || productDetail.images.length === 0) && (
                        <div className="col-span-4 py-10 text-center border-2 border-dashed border-border rounded-xl">
                          <ImageIcon className="mx-auto mb-2 text-muted-foreground/30 animate-pulse" size={32} />
                          <p className="text-xs text-muted-foreground">No images uploaded yet. Drop files here.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── Tab 8: Pricing Rules ─── */}
                {formTab === 'pricing_rules' && selectedProductId && (
                  <div className="space-y-6">
                    {/* Tiered pricing list */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-foreground">Multi-tier / Wholesale Prices</h4>
                      </div>

                      <form onSubmit={handleAddTierPrice} className="grid grid-cols-4 gap-2 bg-muted/10 p-3 rounded-lg border border-border/50">
                        <select
                          value={newTierPrice.price_type}
                          onChange={e => setNewTierPrice({ ...newTierPrice, price_type: e.target.value })}
                          className="form-input text-xs"
                        >
                          <option value="wholesale">Wholesale</option>
                          <option value="member">Member</option>
                          <option value="retail">Retail Tier</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Min Quantity (e.g. 5)"
                          value={newTierPrice.min_qty}
                          onChange={e => setNewTierPrice({ ...newTierPrice, min_qty: e.target.value })}
                          className="form-input text-xs"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Unit Price ($)"
                          value={newTierPrice.price}
                          onChange={e => setNewTierPrice({ ...newTierPrice, price: e.target.value })}
                          className="form-input text-xs"
                          required
                        />
                        <button type="submit" className="btn btn-primary text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-1 px-3">
                          Add Rule
                        </button>
                      </form>

                      <table className="w-full data-table text-xs">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2">Price Type</th>
                            <th className="text-left py-2">Min Quantity</th>
                            <th className="text-left py-2">Unit Price</th>
                            <th className="text-right py-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productDetail?.prices?.map((p: ProductPrice) => (
                            <tr key={p.id} className="border-b border-border/40">
                              <td className="py-2 text-foreground font-semibold capitalize">{p.price_type}</td>
                              <td className="py-2">{p.min_qty} units+</td>
                              <td className="py-2">${Number(p.price).toFixed(2)}</td>
                              <td className="py-2 text-right">
                                <button type="button" onClick={() => deletePriceMutation.mutate(p.id)} className="text-red-500 hover:text-red-700">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                          {(!productDetail?.prices || productDetail.prices.length === 0) && (
                            <tr>
                              <td colSpan={4} className="text-center py-4 text-muted-foreground">No wholesale rules set.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ─── Tab 4: Inventory & Movements ─── */}
                {formTab === 'inventory' && selectedProductId && (
                  <div className="space-y-6">
                    {/* Log Adjustment */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Log Inventory Adjustment</h4>
                      <form onSubmit={handleAddAdjustment} className="grid grid-cols-4 gap-2 bg-muted/10 p-3 rounded-lg border border-border/50">
                        <select
                          value={newAdjustment.warehouse_id}
                          onChange={e => setNewAdjustment({ ...newAdjustment, warehouse_id: e.target.value })}
                          className="form-input text-xs"
                          required
                        >
                          <option value="">Select Warehouse</option>
                          {warehouses?.map((w: any) => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                          ))}
                        </select>
                        <select
                          value={newAdjustment.type}
                          onChange={e => setNewAdjustment({ ...newAdjustment, type: e.target.value })}
                          className="form-input text-xs"
                        >
                          <option value="addition">Addition (+)</option>
                          <option value="subtraction">Reduction (-)</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={newAdjustment.quantity}
                          onChange={e => setNewAdjustment({ ...newAdjustment, quantity: e.target.value })}
                          className="form-input text-xs"
                          required
                        />
                        <button type="submit" className="btn btn-primary text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-1 px-3">
                          Log Movement
                        </button>
                      </form>
                    </div>

                    {/* Stock Movements Logs */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Stock Ledger / Logs</h4>
                      <div className="border border-border rounded-xl overflow-hidden">
                        <table className="w-full data-table text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/20">
                              <th className="text-left py-2 px-3">Date</th>
                              <th className="text-left py-2 px-3">Type</th>
                              <th className="text-left py-2 px-3">Qty</th>
                              <th className="text-left py-2 px-3">Reference/Reason</th>
                            </tr>
                          </thead>
                          <tbody>
                            {movements?.map((m: any) => (
                              <tr key={m.id} className="border-b border-border/40">
                                <td className="py-2 px-3 text-muted-foreground">{new Date(m.created_at).toLocaleString()}</td>
                                <td className="py-2 px-3">
                                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    m.type === 'addition' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {m.type.toUpperCase()}
                                  </span>
                                </td>
                                <td className="py-2 px-3 font-semibold">{m.quantity}</td>
                                <td className="py-2 px-3 text-muted-foreground">{m.reason ?? '-'}</td>
                              </tr>
                            ))}
                            {(!movements || movements.length === 0) && (
                              <tr>
                                <td colSpan={4} className="text-center py-4 text-muted-foreground">No movements logged yet.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Tab 5: Variants ─── */}
                {formTab === 'variants' && selectedProductId && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Create Product Variant</h4>
                      <form onSubmit={handleAddVariant} className="grid grid-cols-4 gap-2 bg-muted/10 p-3 rounded-lg border border-border/50">
                        <input
                          type="text"
                          placeholder="Variant Name (e.g. Red, 256GB)"
                          value={newVariant.name}
                          onChange={e => setNewVariant({ ...newVariant, name: e.target.value })}
                          className="form-input text-xs"
                          required
                        />
                        <input
                          type="text"
                          placeholder="SKU suffix (optional)"
                          value={newVariant.sku}
                          onChange={e => setNewVariant({ ...newVariant, sku: e.target.value })}
                          className="form-input text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Selling Price ($)"
                          value={newVariant.selling_price}
                          onChange={e => setNewVariant({ ...newVariant, selling_price: e.target.value })}
                          className="form-input text-xs"
                          required
                        />
                        <button type="submit" className="btn btn-primary text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-1 px-3">
                          Generate Variant
                        </button>
                      </form>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Variant matrix</h4>
                      <table className="w-full data-table text-xs">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2">Variant</th>
                            <th className="text-left py-2">SKU</th>
                            <th className="text-left py-2">Standard Price</th>
                            <th className="text-right py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productDetail?.variants?.map((v: ProductVariant) => (
                            <tr key={v.id} className="border-b border-border/40">
                              <td className="py-2 text-foreground font-semibold">{v.name}</td>
                              <td className="py-2 text-muted-foreground font-mono">{v.sku}</td>
                              <td className="py-2 font-medium">${Number(v.selling_price).toFixed(2)}</td>
                              <td className="py-2 text-right">
                                <button type="button" onClick={() => deleteVariantMutation.mutate(v.id)} className="text-red-500 hover:text-red-700">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                          {(!productDetail?.variants || productDetail.variants.length === 0) && (
                            <tr>
                              <td colSpan={4} className="text-center py-4 text-muted-foreground">No variant configurations set.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ─── Tab 6: Reviews ─── */}
                {formTab === 'reviews' && selectedProductId && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
                      <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100">
                        <span className="text-3xl font-extrabold text-blue-600">{productDetail?.rating_avg ? Number(productDetail.rating_avg).toFixed(1) : '—'}</span>
                        <p className="text-[10px] text-muted-foreground mt-1">Average rating score</p>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="font-semibold text-foreground text-sm">Customer Reviews Log</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Validated purchases and feedbacks</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {productDetail?.reviews?.map((r: ProductReview) => (
                        <div key={r.id} className="border border-border/60 p-3 rounded-xl bg-card">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-xs text-foreground">{r.customer_name}</span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={10} className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-muted/30'} />
                              ))}
                            </div>
                          </div>
                          <span className="font-semibold text-xs text-foreground block">{r.title}</span>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-1">{r.body}</p>
                          <span className="text-[10px] text-muted-foreground mt-2 block">{new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                      {(!productDetail?.reviews || productDetail.reviews.length === 0) && (
                        <div className="text-center py-10 text-muted-foreground text-xs">No customer reviews yet.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Detail Drawer */}
      <AnimatePresence>
        {viewProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => { setViewProduct(null); setSelectedProductId(null); }}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-card border-l border-border shadow-xl z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
                <h3 className="text-lg font-semibold text-foreground">Product Specification Workspace</h3>
                <button onClick={() => { setViewProduct(null); setSelectedProductId(null); }} className="p-1.5 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  {viewProduct.primary_image ? (
                    <img src={getAbsoluteImageUrl(viewProduct.primary_image)} alt={viewProduct.name} className="w-16 h-16 rounded-xl object-cover border border-border" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center border border-border">
                      <Package size={24} className="text-muted-foreground/40" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-foreground text-base leading-snug">{viewProduct.name}</h4>
                    <span className="text-xs text-muted-foreground font-mono block mt-1">SKU: {viewProduct.sku}</span>
                  </div>
                </div>

                {/* Inner Drawer Tabs */}
                <div className="flex border-b border-border overflow-x-auto gap-2">
                  {[
                    { id: 'info',      label: 'Info',      icon: <Layers size={14} /> },
                    { id: 'gallery',   label: 'Gallery',   icon: <ImageIcon size={14} /> },
                    { id: 'variants',  label: 'Variants',  icon: <Sparkles size={14} /> },
                    { id: 'pricing',   label: 'Pricing',   icon: <DollarSign size={14} /> },
                    { id: 'inventory', label: 'Inventory', icon: <History size={14} /> },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setDetailDrawerTab(tab.id as any)}
                      className={`flex items-center gap-1.5 py-2.5 px-4 text-xs font-semibold border-b-2 -mb-[2px] transition-colors whitespace-nowrap
                                  ${detailDrawerTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                      {tab.icon}
                      {tab.label} 
                    </button>
                  ))}
                </div>

                {/* Tab content panels */}
                {detailDrawerTab === 'info' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Selling Price</span>
                        <span className="text-lg font-bold text-blue-600">${Number(viewProduct.selling_price).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Cost Price</span>
                        <span className="text-sm font-semibold text-foreground">${Number(viewProduct.cost_price || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">Category</span>
                        <span className="text-foreground font-semibold">{viewProduct.category?.name ?? '—'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">Brand</span>
                        <span className="text-foreground font-semibold">{viewProduct.brand?.name ?? '—'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">Low Stock Alert Limit</span>
                        <span className="text-foreground font-semibold">{viewProduct.low_stock_threshold} units</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">Rating Index</span>
                        <span className="text-foreground font-semibold flex items-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          {viewProduct.rating_avg > 0 ? viewProduct.rating_avg.toFixed(1) : '—'}
                        </span>
                      </div>
                    </div>

                    {viewProduct.description && (
                      <div className="border-t border-border pt-4 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Catalog Description</span>
                        <p className="text-xs text-muted-foreground leading-relaxed">{viewProduct.description}</p>
                      </div>
                    )}
                  </div>
                )}

                {detailDrawerTab === 'gallery' && (
                  <div className="space-y-4">
                    <span className="text-xs font-semibold text-foreground block">Product Gallery</span>
                    <div className="grid grid-cols-3 gap-3">
                      {productDetail?.images?.map((img: any) => (
                        <div key={img.id} className="relative rounded-lg overflow-hidden border border-border aspect-square bg-muted flex items-center justify-center">
                          <img src={getAbsoluteImageUrl(img.url)} alt="Gallery" className="w-full h-full object-cover" />
                          {img.is_primary && (
                            <span className="absolute top-1 left-1 bg-blue-600 text-white text-[8px] font-bold px-1 py-0.5 rounded shadow">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                      {(!productDetail?.images || productDetail.images.length === 0) && (
                        <div className="col-span-3 text-center py-8 text-xs text-muted-foreground">
                          No images uploaded for this product.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {detailDrawerTab === 'variants' && (
                  <div className="space-y-4">
                    <span className="text-xs font-semibold text-foreground block">Configured Variants Matrix</span>
                    <div className="overflow-x-auto border border-border rounded-lg">
                      <table className="w-full text-xs text-left data-table">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border">
                            <th className="py-2 px-3 text-left">Variant</th>
                            <th className="py-2 px-3 text-left">SKU</th>
                            <th className="py-2 px-3 text-right">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productDetail?.variants?.map((v: any) => (
                            <tr key={v.id} className="border-b border-border/40">
                              <td className="py-2 px-3 text-foreground font-semibold">{v.name}</td>
                              <td className="py-2 px-3 text-muted-foreground font-mono">{v.sku}</td>
                              <td className="py-2 px-3 text-right font-medium">${Number(v.selling_price).toFixed(2)}</td>
                            </tr>
                          ))}
                          {(!productDetail?.variants || productDetail.variants.length === 0) && (
                            <tr>
                              <td colSpan={3} className="text-center py-4 text-muted-foreground">No variations set.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {detailDrawerTab === 'pricing' && (
                  <div className="space-y-4">
                    <span className="text-xs font-semibold text-foreground block">Tiered Wholesale Rules</span>
                    <div className="overflow-x-auto border border-border rounded-lg">
                      <table className="w-full text-xs text-left data-table">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border">
                            <th className="py-2 px-3 text-left">Price Type</th>
                            <th className="py-2 px-3 text-left">Min Qty</th>
                            <th className="py-2 px-3 text-right">Unit Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productDetail?.prices?.map((pr: any) => (
                            <tr key={pr.id} className="border-b border-border/40">
                              <td className="py-2 px-3 capitalize font-semibold text-foreground">{pr.price_type}</td>
                              <td className="py-2 px-3 text-muted-foreground">{pr.min_qty} units</td>
                              <td className="py-2 px-3 text-right font-bold text-blue-600">${Number(pr.price).toFixed(2)}</td>
                            </tr>
                          ))}
                          {(!productDetail?.prices || productDetail.prices.length === 0) && (
                            <tr>
                              <td colSpan={3} className="text-center py-4 text-muted-foreground">No tier prices set.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {detailDrawerTab === 'inventory' && (
                  <div className="space-y-4">
                    <span className="text-xs font-semibold text-foreground block">Warehouse Stock Movement Logs</span>
                    <div className="overflow-x-auto border border-border rounded-lg">
                      <table className="w-full text-xs text-left data-table">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border">
                            <th className="py-2 px-3 text-left">Date</th>
                            <th className="py-2 px-3 text-left">Type</th>
                            <th className="py-2 px-3 text-left">Qty</th>
                            <th className="py-2 px-3 text-left">Reference</th>
                          </tr>
                        </thead>
                        <tbody>
                          {movements?.map((m: any) => (
                            <tr key={m.id} className="border-b border-border/40">
                              <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">{new Date(m.created_at).toLocaleString()}</td>
                              <td className="py-2 px-3">
                                <span className={`badge ${m.type === 'addition' || m.type === 'purchase' ? 'badge-success' : 'badge-danger'}`}>
                                  {m.type}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-semibold text-foreground">{m.quantity}</td>
                              <td className="py-2 px-3 text-muted-foreground max-w-[150px] truncate">{m.reference_type || 'Manual'} ({m.reference_id ?? 'Adjustment'})</td>
                            </tr>
                          ))}
                          {(!movements || movements.length === 0) && (
                            <tr>
                              <td colSpan={4} className="text-center py-4 text-muted-foreground">No stock logs found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={deleteTarget !== null}
        title="Product"
        itemName={deleteTarget?.name || ''}
        warningText="If this product has active sales or purchase history, the backend will prevent its deletion."
        isPending={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onSoftDelete={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id)
        }}
        onArchive={() => {
          if (deleteTarget) {
            api.put(`/products/${deleteTarget.id}`, {
              company_id: 1,
              name: deleteTarget.name,
              sku: deleteTarget.sku,
              selling_price: deleteTarget.selling_price,
              status: 'inactive'
            })
              .then(() => {
                setDeleteTarget(null)
                qc.invalidateQueries({ queryKey: ['products'] })
                toast.success('Product status updated to inactive.')
              })
              .catch(err => {
                toast.error(err?.response?.data?.message ?? 'Failed to update product status.')
              })
          }
        }}
      />
    </div>
  )
}

export default ProductsPage
