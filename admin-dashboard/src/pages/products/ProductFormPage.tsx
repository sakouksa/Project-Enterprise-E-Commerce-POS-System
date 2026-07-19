import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft, Layers, Image as ImageIcon, DollarSign, History,
  Sparkles, Loader2, Plus, Trash2, Star, Check, Scale, Shield, Text,
  HelpCircle, AlertCircle, RefreshCw, Upload, Percent
} from 'lucide-react'
import api from '@/api/client'
import { productService } from '@/services/productService'
import { useToast } from '@/hooks/useToast'
import { Breadcrumb, PageHeader, LoadingSpinner } from '@/components/common'

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

const ProductFormPage: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const productId = id ? parseInt(id) : null
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'inventory' | 'dimensions' | 'seo' | 'images' | 'variants' | 'tier_pricing'>('general')
  const [form, setForm] = useState<ProductForm>(BLANK_FORM)

  // Sub-tab inline item states
  const [newTierPrice, setNewTierPrice] = useState({ price_type: 'wholesale', min_qty: '5', price: '', currency_code: 'USD' })
  const [newVariant, setNewVariant] = useState({ name: '', sku: '', cost_price: '', selling_price: '' })
  const [newAdjustment, setNewAdjustment] = useState({ warehouse_id: '', type: 'addition', quantity: '', reason: '' })

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { data: productDetail, isLoading: isLoadingDetail, refetch: refetchDetail } = useQuery({
    queryKey: ['product-detail-page', productId],
    queryFn: () => productId ? productService.show(productId) : null,
    enabled: isEdit,
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

  const { data: movements } = useQuery({
    queryKey: ['inventory-movements', productId],
    queryFn: () => productId ? api.get('/inventory-movements', { params: { product_id: productId } }).then(r => r.data.data ?? []) : [],
    enabled: isEdit && activeTab === 'inventory',
  })

  // ─── Population ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (productDetail) {
      setForm({
        name:                productDetail.name || '',
        sku:                 productDetail.sku || '',
        barcode:             productDetail.barcode || '',
        description:         productDetail.description || '',
        short_description:   productDetail.short_description || '',
        category_id:         String(productDetail.category_id ?? productDetail.category?.id ?? ''),
        brand_id:            String(productDetail.brand_id ?? productDetail.brand?.id ?? ''),
        unit_id:             String(productDetail.unit_id ?? productDetail.unit?.id ?? ''),
        tax_id:              String(productDetail.tax_id ?? productDetail.tax?.id ?? ''),
        cost_price:          String(productDetail.cost_price ?? ''),
        selling_price:       String(productDetail.selling_price ?? ''),
        compare_price:       String(productDetail.compare_price ?? ''),
        weight:              String(productDetail.weight ?? ''),
        length:              String(productDetail.length ?? ''),
        width:               String(productDetail.width ?? ''),
        height:              String(productDetail.height ?? ''),
        track_inventory:     !!productDetail.track_inventory,
        low_stock_threshold: String(productDetail.low_stock_threshold ?? '5'),
        status:              productDetail.status || 'active',
        is_featured:         !!productDetail.is_featured,
        is_digital:          !!productDetail.is_digital,
        meta_title:          productDetail.meta_title || '',
        meta_description:    productDetail.meta_description || '',
        meta_keywords:       productDetail.meta_keywords || '',
      })
    }
  }, [productDetail])

  // ─── Mutations ────────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (isEdit && productId) {
        return productService.update(productId, payload)
      } else {
        return productService.create(payload)
      }
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-stats'] })
      if (productId) {
        qc.invalidateQueries({ queryKey: ['product-detail-page', productId] })
      }
      toast.success(isEdit ? 'Product updated successfully.' : 'Product created successfully.')
      if (!isEdit && data?.id) {
        navigate(`/products/${data.id}/edit`)
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to save product.')
    },
  })

  const uploadImageMutation = useMutation({
    mutationFn: (files: File[]) => {
      if (!productId) throw new Error('No product ID')
      return productService.uploadImages(productId, files)
    },
    onSuccess: () => {
      refetchDetail()
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Images uploaded successfully.')
    },
    onError: () => toast.error('Failed to upload image.')
  })

  const deleteImageMutation = useMutation({
    mutationFn: ({ productId, imgId }: { productId: number; imgId: number }) =>
      productService.deleteImage(productId, imgId),
    onSuccess: () => {
      refetchDetail()
      toast.success('Image deleted successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete image.')
    }
  })

  const updateImageMutation = useMutation({
    mutationFn: ({ imgId, data }: { imgId: number; data: { is_primary?: boolean; sort_order?: number } }) =>
      productService.updateImage(imgId, data),
    onSuccess: () => {
      refetchDetail()
      toast.success('Image details updated.')
    },
    onError: () => toast.error('Failed to update image details.')
  })

  const addPriceMutation = useMutation({
    mutationFn: (payload: any) => productService.createPrice(payload),
    onSuccess: () => {
      refetchDetail()
      toast.success('Tiered price rule added.')
      setNewTierPrice({ price_type: 'wholesale', min_qty: '5', price: '', currency_code: 'USD' })
    },
    onError: () => toast.error('Failed to add price rule.')
  })

  const deletePriceMutation = useMutation({
    mutationFn: (priceId: number) => productService.deletePrice(priceId),
    onSuccess: () => {
      refetchDetail()
      toast.success('Tier price rule deleted.')
    },
    onError: () => toast.error('Failed to delete price rule.')
  })

  const addAdjustmentMutation = useMutation({
    mutationFn: (payload: any) => api.post('/stock-adjustments', payload),
    onSuccess: () => {
      refetchDetail()
      qc.invalidateQueries({ queryKey: ['inventory-movements', productId] })
      toast.success('Stock adjustment logged successfully.')
      setNewAdjustment({ warehouse_id: '', type: 'addition', quantity: '', reason: '' })
    },
    onError: () => toast.error('Failed to log stock adjustment.')
  })

  const addVariantMutation = useMutation({
    mutationFn: (payload: any) => productService.createVariant(payload),
    onSuccess: () => {
      refetchDetail()
      toast.success('Variant created successfully.')
      setNewVariant({ name: '', sku: '', cost_price: '', selling_price: '' })
    },
    onError: () => toast.error('Failed to create variant.')
  })

  const deleteVariantMutation = useMutation({
    mutationFn: (variantId: number) => productService.deleteVariant(variantId),
    onSuccess: () => {
      refetchDetail()
      toast.success('Variant deleted.')
    },
    onError: () => toast.error('Failed to delete variant.')
  })

  // ─── Handlers ─────────────────────────────────────────────────────────────
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

    saveMutation.mutate(payload)
  }

  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && productId) {
      uploadImageMutation.mutate(Array.from(e.dataTransfer.files))
    }
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && productId) {
      uploadImageMutation.mutate(Array.from(e.target.files))
    }
  }

  const handleAddTierPrice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTierPrice.price || !productId) return
    addPriceMutation.mutate({
      product_id: productId,
      price_type: newTierPrice.price_type,
      min_qty: parseInt(newTierPrice.min_qty),
      price: parseFloat(newTierPrice.price),
      currency_code: newTierPrice.currency_code
    })
  }

  const handleAddVariant = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVariant.name || !newVariant.selling_price || !productId) return
    addVariantMutation.mutate({
      product_id: productId,
      name: newVariant.name,
      sku: newVariant.sku || undefined,
      cost_price: parseFloat(newVariant.cost_price) || 0,
      selling_price: parseFloat(newVariant.selling_price),
      is_active: true
    })
  }

  const handleAddAdjustment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdjustment.warehouse_id || !newAdjustment.quantity || !productId) return
    addAdjustmentMutation.mutate({
      product_id: productId,
      warehouse_id: parseInt(newAdjustment.warehouse_id),
      type: newAdjustment.type,
      quantity: parseFloat(newAdjustment.quantity),
      reason: newAdjustment.reason || 'Manual adjustment'
    })
  }

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

  if (isEdit && isLoadingDetail) {
    return <LoadingSpinner fullPage label="Loading product specifications..." />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: t('products.title'), path: '/products' },
          { label: isEdit ? t('products.editProduct') : t('products.addProduct') },
        ]}
      />

      <PageHeader
        title={isEdit ? `${t('products.editProduct')}: ${productDetail?.name}` : t('products.createProductWorkspace')}
        subtitle={t('products.formSubtitle')}
        action={
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm text-muted-foreground border border-border
                       rounded-lg hover:bg-muted transition-colors font-medium bg-card"
          >
            <ArrowLeft size={15} />
            {t('products.backToProducts')}
          </button>
        }
      />

      {/* Primary Tab Bar */}
      {isEdit && (
        <div className="flex border-b border-border bg-card rounded-t-2xl px-4 overflow-x-auto gap-2 shadow-sm">
          {[
            { id: 'general',      label: t('products.general'),      icon: <Layers size={14} /> },
            { id: 'pricing',      label: t('products.pricing'),      icon: <DollarSign size={14} /> },
            { id: 'inventory',    label: t('products.inventory'),    icon: <History size={14} /> },
            { id: 'dimensions',   label: t('products.dimensions'),   icon: <Scale size={14} /> },
            { id: 'seo',          label: t('products.seo'),          icon: <Shield size={14} /> },
            { id: 'images',       label: t('products.images'),       icon: <ImageIcon size={14} /> },
            { id: 'variants',     label: t('products.variants'),     icon: <Sparkles size={14} /> },
            { id: 'tier_pricing', label: t('products.tierPricing'), icon: <Percent size={14} /> },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 -mb-[2px] transition-colors whitespace-nowrap
                          ${activeTab === tab.id
                            ? 'border-indigo-600 text-indigo-600 font-bold'
                            : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className={`bg-card border border-border p-6 shadow-sm ${isEdit ? 'rounded-b-2xl border-t-0' : 'rounded-2xl'}`}>
        {!isEdit && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Barcode</label>
                <input
                  value={form.barcode}
                  onChange={e => setField('barcode', e.target.value)}
                  placeholder="UPC/EAN numbers"
                  className="form-input font-mono w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Category</label>
                <select
                  value={form.category_id}
                  onChange={e => setField('category_id', e.target.value)}
                  className="form-input w-full cursor-pointer"
                >
                  <option value="">No Category</option>
                  {categories?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Brand</label>
                <select
                  value={form.brand_id}
                  onChange={e => setField('brand_id', e.target.value)}
                  className="form-input w-full cursor-pointer"
                >
                  <option value="">No Brand</option>
                  {brands?.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Unit</label>
                <select
                  value={form.unit_id}
                  onChange={e => setField('unit_id', e.target.value)}
                  className="form-input w-full cursor-pointer"
                >
                  <option value="">No Unit</option>
                  {units?.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Tax Category</label>
                <select
                  value={form.tax_id}
                  onChange={e => setField('tax_id', e.target.value)}
                  className="form-input w-full cursor-pointer"
                >
                  <option value="">No Tax</option>
                  {taxes?.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name} ({Number(t.rate)}%)</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Cost Price ($)</label>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Selling Price ($) <span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Compare Price ($)</label>
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Weight (kg)</label>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Length (cm)</label>
                <input
                  type="number"
                  value={form.length}
                  onChange={e => setField('length', e.target.value)}
                  placeholder="0"
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Width (cm)</label>
                <input
                  type="number"
                  value={form.width}
                  onChange={e => setField('width', e.target.value)}
                  placeholder="0"
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  value={form.height}
                  onChange={e => setField('height', e.target.value)}
                  placeholder="0"
                  className="form-input w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Low Stock Threshold</label>
                <input
                  type="number"
                  value={form.low_stock_threshold}
                  onChange={e => setField('low_stock_threshold', e.target.value)}
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Publish Status</label>
                <select
                  value={form.status}
                  onChange={e => setField('status', e.target.value)}
                  className="form-input w-full cursor-pointer"
                >
                  <option value="active">Active (Online)</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft Folder</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.track_inventory}
                  onChange={e => setField('track_inventory', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-border text-indigo-600 focus:ring-indigo-600/30"
                />
                <span className="text-sm font-semibold text-foreground">Track Stock Level</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={e => setField('is_featured', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-border text-indigo-600 focus:ring-indigo-600/30"
                />
                <span className="text-sm font-semibold text-foreground">Featured Spotlight Listing</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_digital}
                  onChange={e => setField('is_digital', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-border text-indigo-600 focus:ring-indigo-600/30"
                />
                <span className="text-sm font-semibold text-foreground">Digital Product (No physical shipping)</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Short Description</label>
              <input
                value={form.short_description}
                onChange={e => setField('short_description', e.target.value)}
                placeholder="Brief summary sentence..."
                className="form-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Product Narrative Description</label>
              <textarea
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                rows={4}
                placeholder="Product catalog specifications details..."
                className="form-input w-full resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-border">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="px-5 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted border border-border rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-lg text-sm font-semibold shadow transition-colors disabled:opacity-50"
              >
                {saveMutation.isPending && <Loader2 className="animate-spin" size={15} />}
                Create & Continue
              </button>
            </div>
          </form>
        )}

        {/* ─── EDIT MODE: Tab 1: General ─── */}
        {isEdit && activeTab === 'general' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Barcode</label>
                <input
                  value={form.barcode}
                  onChange={e => setField('barcode', e.target.value)}
                  placeholder="UPC/EAN numbers"
                  className="form-input font-mono w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Category</label>
                <select
                  value={form.category_id}
                  onChange={e => setField('category_id', e.target.value)}
                  className="form-input w-full cursor-pointer"
                >
                  <option value="">No Category</option>
                  {categories?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Brand</label>
                <select
                  value={form.brand_id}
                  onChange={e => setField('brand_id', e.target.value)}
                  className="form-input w-full cursor-pointer"
                >
                  <option value="">No Brand</option>
                  {brands?.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Unit</label>
                <select
                  value={form.unit_id}
                  onChange={e => setField('unit_id', e.target.value)}
                  className="form-input w-full cursor-pointer"
                >
                  <option value="">No Unit</option>
                  {units?.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Tax Category</label>
                <select
                  value={form.tax_id}
                  onChange={e => setField('tax_id', e.target.value)}
                  className="form-input w-full cursor-pointer"
                >
                  <option value="">No Tax</option>
                  {taxes?.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name} ({Number(t.rate)}%)</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Publish Status</label>
              <select
                value={form.status}
                onChange={e => setField('status', e.target.value)}
                className="form-input w-full cursor-pointer"
              >
                <option value="active">Active (Online)</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft Folder</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={e => setField('is_featured', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-border text-indigo-600 focus:ring-indigo-600/30"
                />
                <span className="text-sm font-semibold text-foreground">Featured Spotlight Listing</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_digital}
                  onChange={e => setField('is_digital', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-border text-indigo-600 focus:ring-indigo-600/30"
                />
                <span className="text-sm font-semibold text-foreground">Digital Product (No physical shipping)</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Short Description</label>
              <input
                value={form.short_description}
                onChange={e => setField('short_description', e.target.value)}
                placeholder="Brief summary sentence..."
                className="form-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Product Narrative Description</label>
              <textarea
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                rows={4}
                placeholder="Product catalog specifications details..."
                className="form-input w-full resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-border">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-lg text-sm font-semibold shadow transition-colors disabled:opacity-50"
              >
                {saveMutation.isPending && <Loader2 className="animate-spin" size={15} />}
                Save General Info
              </button>
            </div>
          </form>
        )}

        {/* ─── EDIT MODE: Tab 2: Pricing ─── */}
        {isEdit && activeTab === 'pricing' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Cost Price ($)</label>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Selling Price ($) *</label>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Compare Price ($)</label>
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

            <div className="flex justify-end gap-3 pt-5 border-t border-border">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-lg text-sm font-semibold shadow transition-colors disabled:opacity-50"
              >
                {saveMutation.isPending && <Loader2 className="animate-spin" size={15} />}
                Save Pricing
              </button>
            </div>
          </form>
        )}

        {/* ─── EDIT MODE: Tab 3: Inventory ─── */}
        {isEdit && activeTab === 'inventory' && productId && (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 bg-muted/10 p-5 rounded-2xl border border-border/60">
              <h4 className="text-sm font-bold text-foreground">Stock Tracking Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <label className="flex items-center gap-3 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={form.track_inventory}
                    onChange={e => setField('track_inventory', e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-border text-indigo-600 focus:ring-indigo-600/30"
                  />
                  <span className="text-sm font-semibold text-foreground">Track Stock Level</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Low Stock Threshold</label>
                  <input
                    type="number"
                    value={form.low_stock_threshold}
                    onChange={e => setField('low_stock_threshold', e.target.value)}
                    className="form-input w-full"
                    disabled={!form.track_inventory}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-lg text-sm font-semibold shadow transition-colors"
                >
                  {saveMutation.isPending && <Loader2 className="animate-spin" size={15} />}
                  Save Settings
                </button>
              </div>
            </form>

            <div className="space-y-3">
              <div>
                <h4 className="text-base font-semibold text-foreground">Warehouse Stock Ledger</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Log custom warehouse addition or subtraction inventory adjustments.</p>
              </div>

              <form onSubmit={handleAddAdjustment} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-muted/20 p-4 rounded-xl border border-border/60">
                <select
                  value={newAdjustment.warehouse_id}
                  onChange={e => setNewAdjustment({ ...newAdjustment, warehouse_id: e.target.value })}
                  className="form-input text-xs cursor-pointer"
                  required
                >
                  <option value="">Choose Warehouse Location</option>
                  {warehouses?.map((w: any) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
                <select
                  value={newAdjustment.type}
                  onChange={e => setNewAdjustment({ ...newAdjustment, type: e.target.value })}
                  className="form-input text-xs cursor-pointer"
                >
                  <option value="addition">Addition / Stock In (+)</option>
                  <option value="subtraction">Reduction / Stock Out (-)</option>
                </select>
                <input
                  type="number"
                  placeholder="Quantity Count"
                  value={newAdjustment.quantity}
                  onChange={e => setNewAdjustment({ ...newAdjustment, quantity: e.target.value })}
                  className="form-input text-xs"
                  required
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-1.5 px-4 font-semibold text-xs transition-colors shadow-sm">
                  Log Adjustment
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Stock Movement History</h4>
              <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full data-table text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="text-left py-2.5 px-3">Logged Date</th>
                      <th className="text-left py-2.5 px-3">Transaction</th>
                      <th className="text-left py-2.5 px-3">Count Difference</th>
                      <th className="text-left py-2.5 px-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements?.map((m: any) => (
                      <tr key={m.id} className="border-b border-border/40">
                        <td className="py-2.5 px-3 text-muted-foreground">{new Date(m.created_at).toLocaleString()}</td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.type === 'addition' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                          }`}>
                            {m.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold font-mono">{m.quantity} items</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{m.reason ?? 'Manual adjustment'}</td>
                      </tr>
                    ))}
                    {(!movements || movements.length === 0) && (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-muted-foreground">No historical inventory transactions recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── EDIT MODE: Tab 4: Dimensions ─── */}
        {isEdit && activeTab === 'dimensions' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Weight (kg)</label>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Length (cm)</label>
                <input
                  type="number"
                  value={form.length}
                  onChange={e => setField('length', e.target.value)}
                  placeholder="0"
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Width (cm)</label>
                <input
                  type="number"
                  value={form.width}
                  onChange={e => setField('width', e.target.value)}
                  placeholder="0"
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  value={form.height}
                  onChange={e => setField('height', e.target.value)}
                  placeholder="0"
                  className="form-input w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-border">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-lg text-sm font-semibold shadow transition-colors disabled:opacity-50"
              >
                {saveMutation.isPending && <Loader2 className="animate-spin" size={15} />}
                Save Dimensions
              </button>
            </div>
          </form>
        )}

        {/* ─── EDIT MODE: Tab 5: SEO ─── */}
        {isEdit && activeTab === 'seo' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Meta Title (SEO)</label>
                <input
                  value={form.meta_title}
                  onChange={e => setField('meta_title', e.target.value)}
                  placeholder="SEO Search result title..."
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Meta Keywords (SEO)</label>
                <input
                  value={form.meta_keywords}
                  onChange={e => setField('meta_keywords', e.target.value)}
                  placeholder="Keywords separated by comma..."
                  className="form-input w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Meta Description (SEO)</label>
              <textarea
                value={form.meta_description}
                onChange={e => setField('meta_description', e.target.value)}
                rows={4}
                placeholder="Meta description tags..."
                className="form-input w-full resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-border">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-lg text-sm font-semibold shadow transition-colors disabled:opacity-50"
              >
                {saveMutation.isPending && <Loader2 className="animate-spin" size={15} />}
                Save SEO Settings
              </button>
            </div>
          </form>
        )}

        {/* ─── EDIT MODE: Tab 6: Images ─── */}
        {isEdit && activeTab === 'images' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-semibold text-foreground">Photo Gallery</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Upload product images, set the catalog thumbnail, or sort ordering.</p>
              </div>
              <label className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-semibold rounded-lg hover:bg-muted transition-colors cursor-pointer bg-card">
                <ImageIcon size={15} />
                Upload Images
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageFileChange} />
              </label>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors flex flex-col items-center justify-center gap-2
                          ${dragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-border bg-muted/5'}`}
            >
              <Upload className="text-muted-foreground/45 animate-pulse" size={32} />
              <p className="text-sm font-medium text-foreground">
                Drag and drop your product images here, or <label className="text-indigo-600 hover:underline cursor-pointer">browse<input type="file" multiple accept="image/*" className="hidden" onChange={handleImageFileChange} /></label>
              </p>
              <p className="text-xs text-muted-foreground">Supports JPG, PNG, WEBP up to 5MB</p>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {productDetail?.images?.map((img: any) => (
                <div key={img.id} className="relative group border border-border rounded-xl overflow-hidden aspect-square bg-muted/10 shadow-sm flex flex-col justify-between">
                  <div className="relative w-full h-full">
                    <img src={getAbsoluteImageUrl(img.url || img.image)} className="w-full h-full object-cover" alt="catalog" />
                    
                    {img.is_primary && (
                      <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                        Primary
                      </span>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!img.is_primary && (
                        <button
                          type="button"
                          onClick={() => updateImageMutation.mutate({ imgId: img.id, data: { is_primary: true } })}
                          className="bg-indigo-600/90 text-white p-2 rounded-lg hover:bg-indigo-600 shadow transition-colors"
                          title="Make Primary"
                        >
                          <Star size={14} fill="currentColor" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteImageMutation.mutate({ productId: productId!, imgId: img.id })}
                        className="bg-red-600/90 text-white p-2 rounded-lg hover:bg-red-600 shadow transition-colors"
                        title="Delete Image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Sort Order Controls */}
                  <div className="p-2 border-t border-border flex items-center justify-between bg-card text-xs">
                    <span className="text-muted-foreground font-medium">Order: {img.sort_order}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateImageMutation.mutate({ imgId: img.id, data: { sort_order: Math.max(0, img.sort_order - 1) } })}
                        className="p-1 border border-border rounded hover:bg-muted font-bold text-[10px]"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => updateImageMutation.mutate({ imgId: img.id, data: { sort_order: img.sort_order + 1 } })}
                        className="p-1 border border-border rounded hover:bg-muted font-bold text-[10px]"
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {(!productDetail?.images || productDetail.images.length === 0) && (
                <div className="col-span-full py-16 text-center border-2 border-dashed border-border rounded-2xl bg-muted/5">
                  <ImageIcon className="mx-auto mb-3 text-muted-foreground/30" size={36} />
                  <p className="text-sm font-semibold text-muted-foreground">Gallery is empty</p>
                  <p className="text-xs text-muted-foreground/75 mt-0.5">Drag & drop your product photos to begin.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── EDIT MODE: Tab 7: Variants ─── */}
        {isEdit && activeTab === 'variants' && productId && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div>
                <h4 className="text-base font-semibold text-foreground font-sans">Generate SKU Variants</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Create custom product variations (e.g. Red, XL, 128GB).</p>
              </div>

              <form onSubmit={handleAddVariant} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-muted/20 p-4 rounded-xl border border-border/60">
                <input
                  type="text"
                  placeholder="Variant Spec (e.g., Red, 128GB)"
                  value={newVariant.name}
                  onChange={e => setNewVariant({ ...newVariant, name: e.target.value })}
                  className="form-input text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder="Variant SKU Suffix"
                  value={newVariant.sku}
                  onChange={e => setNewVariant({ ...newVariant, sku: e.target.value })}
                  className="form-input text-xs font-mono"
                />
                <input
                  type="number"
                  placeholder="Selling Price ($)"
                  value={newVariant.selling_price}
                  onChange={e => setNewVariant({ ...newVariant, selling_price: e.target.value })}
                  className="form-input text-xs"
                  required
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-1.5 px-4 font-semibold text-xs transition-colors shadow-sm">
                  Generate Variant SKU
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Active Configuration Spec Matrix</h4>
              <table className="w-full data-table text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/10">
                    <th className="text-left py-2.5 px-3">Variant Specification</th>
                    <th className="text-left py-2.5 px-3">Derived SKU</th>
                    <th className="text-left py-2.5 px-3">Price Rate</th>
                    <th className="text-right py-2.5 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productDetail?.variants?.map((v: any) => (
                    <tr key={v.id} className="border-b border-border/40">
                      <td className="py-2.5 px-3 text-foreground font-semibold">{v.name}</td>
                      <td className="py-2.5 px-3 text-muted-foreground font-mono">{v.sku}</td>
                      <td className="py-2.5 px-3 font-semibold font-mono">${Number(v.selling_price).toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button type="button" onClick={() => deleteVariantMutation.mutate(v.id)} className="text-red-500 hover:text-red-700 font-semibold text-xs">
                          Delete SKU
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!productDetail?.variants || productDetail.variants.length === 0) && (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-muted-foreground text-xs">No active variants configured. Standard SKU will be used.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── EDIT MODE: Tab 8: Tier Pricing ─── */}
        {isEdit && activeTab === 'tier_pricing' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-semibold text-foreground font-sans">Multi-Tier Pricing Matrix</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Define discounts or bulk order parameters for wholesale and retail accounts.</p>
              </div>

              <form onSubmit={handleAddTierPrice} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-muted/20 p-4 rounded-xl border border-border/60">
                <select
                  value={newTierPrice.price_type}
                  onChange={e => setNewTierPrice({ ...newTierPrice, price_type: e.target.value })}
                  className="form-input text-xs cursor-pointer"
                >
                  <option value="wholesale">Wholesale Discount</option>
                  <option value="member">Exclusive Member Rate</option>
                  <option value="retail">Special Retail Campaign</option>
                </select>
                <input
                  type="number"
                  placeholder="Min Quantity (e.g. 10)"
                  value={newTierPrice.min_qty}
                  onChange={e => setNewTierPrice({ ...newTierPrice, min_qty: e.target.value })}
                  className="form-input text-xs"
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Tier Unit Price ($)"
                  value={newTierPrice.price}
                  onChange={e => setNewTierPrice({ ...newTierPrice, price: e.target.value })}
                  className="form-input text-xs"
                  required
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-1.5 px-4 font-semibold text-xs transition-colors shadow-sm">
                  Add Pricing Rule
                </button>
              </form>

              <table className="w-full data-table text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/10">
                    <th className="text-left py-2.5 px-3">Price Classification</th>
                    <th className="text-left py-2.5 px-3">Volume Condition</th>
                    <th className="text-left py-2.5 px-3">Adjusted Rate</th>
                    <th className="text-right py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productDetail?.prices?.map((p: any) => (
                    <tr key={p.id} className="border-b border-border/40">
                      <td className="py-2.5 px-3 text-foreground font-semibold capitalize">{p.price_type}</td>
                      <td className="py-2.5 px-3">{p.min_qty} items or more</td>
                      <td className="py-2.5 px-3 font-mono font-bold">${Number(p.price).toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button type="button" onClick={() => deletePriceMutation.mutate(p.id)} className="text-red-500 hover:text-red-700 font-semibold text-xs">
                          Delete Rule
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!productDetail?.prices || productDetail.prices.length === 0) && (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-muted-foreground text-xs">No wholesale or volume rules have been defined yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductFormPage
