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
import { ModernSelect } from '@/pages/pos/components/ModernSelect'

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

  // Compact ModernSelect button class matching standard input height exactly (38px)
  const compactSelectBtnClass = "font-normal text-sm border-border bg-card cursor-pointer"

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

  const [isSkuManuallyEdited, setIsSkuManuallyEdited] = useState(false)

  const generateSKU = (name: string): string => {
    if (!name.trim()) return ''
    const cleanName = name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 20)
    return cleanName ? `SKU-${cleanName}` : ''
  }

  const handleProductNameChange = (val: string) => {
    setForm(prev => {
      const autoSku = (!isSkuManuallyEdited || !prev.sku.trim()) ? generateSKU(val) : prev.sku
      return {
        ...prev,
        name: val,
        sku: autoSku,
      }
    })
  }

  const handleSkuInputChange = (val: string) => {
    setIsSkuManuallyEdited(true)
    setForm(prev => ({ ...prev, sku: val }))
  }

  const handleAutoGenerateSkuClick = () => {
    const generated = generateSKU(form.name)
    if (generated) {
      setIsSkuManuallyEdited(false)
      setForm(prev => ({ ...prev, sku: generated }))
      toast.info(`Generated SKU: ${generated}`)
    } else {
      toast.warning('Please enter Product Name first.')
    }
  }

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
        title={isEdit ? `${t('products.editProduct')}: ${productDetail?.name}` : t('products.createProduct')}
        subtitle={t('products.formSubtitle')}
        action={
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm text-muted-foreground border border-border
                       rounded-lg hover:bg-muted transition-colors font-medium bg-card cursor-pointer"
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
            { id: 'tier_pricing', label: t('products.tierPricing'),  icon: <Percent size={14} /> },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 -mb-[2px] transition-colors whitespace-nowrap cursor-pointer
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
                  {t('products.colName')} <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={e => handleProductNameChange(e.target.value)}
                  required
                  placeholder="e.g. iPhone 15 Pro"
                  className="form-input w-full"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-muted-foreground">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateSkuClick}
                    className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    {t('products.autoGenerate')}
                  </button>
                </div>
                <input
                  value={form.sku}
                  onChange={e => handleSkuInputChange(e.target.value)}
                  required
                  placeholder="e.g. SKU-IPHONE-15"
                  className="form-input font-mono w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.colBarcode')}</label>
                <input
                  value={form.barcode}
                  onChange={e => setField('barcode', e.target.value)}
                  placeholder="UPC/EAN numbers"
                  className="form-input font-mono w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.colCategory')}</label>
                <ModernSelect
                  value={form.category_id}
                  onChange={(val) => setField('category_id', String(val))}
                  options={[
                    { value: '', label: t('products.allCategories') },
                    ...(categories ?? []).map((c: any) => ({ value: c.id, label: c.name })),
                  ]}
                  placeholder={t('products.colCategory')}
                  buttonClassName={compactSelectBtnClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.colBrand')}</label>
                <ModernSelect
                  value={form.brand_id}
                  onChange={(val) => setField('brand_id', String(val))}
                  options={[
                    { value: '', label: t('products.allBrands') },
                    ...(brands ?? []).map((b: any) => ({ value: b.id, label: b.name })),
                  ]}
                  placeholder={t('products.colBrand')}
                  buttonClassName={compactSelectBtnClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.colUnitName')}</label>
                <ModernSelect
                  value={form.unit_id}
                  onChange={(val) => setField('unit_id', String(val))}
                  options={[
                    { value: '', label: t('products.allUnits') },
                    ...(units ?? []).map((u: any) => ({ value: u.id, label: `${u.name}${u.symbol ? ` (${u.symbol})` : ''}` })),
                  ]}
                  placeholder={t('products.colUnitName')}
                  buttonClassName={compactSelectBtnClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.filterTax')}</label>
                <ModernSelect
                  value={form.tax_id}
                  onChange={(val) => setField('tax_id', String(val))}
                  options={[
                    { value: '', label: t('products.allTaxes') },
                    ...(taxes ?? []).map((tItem: any) => ({ value: tItem.id, label: `${tItem.name} (${Number(tItem.rate)}%)` })),
                  ]}
                  placeholder={t('products.filterTax')}
                  buttonClassName={compactSelectBtnClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.colCostPrice')} ($)</label>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.colSellingPrice')} ($) <span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.comparePrice')} ($)</label>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.weight')} (kg)</label>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.length')} (cm)</label>
                <input
                  type="number"
                  value={form.length}
                  onChange={e => setField('length', e.target.value)}
                  placeholder="0"
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.width')} (cm)</label>
                <input
                  type="number"
                  value={form.width}
                  onChange={e => setField('width', e.target.value)}
                  placeholder="0"
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.height')} (cm)</label>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.lowStockThreshold')}</label>
                <input
                  type="number"
                  value={form.low_stock_threshold}
                  onChange={e => setField('low_stock_threshold', e.target.value)}
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.publishStatus')}</label>
                <ModernSelect
                  value={form.status}
                  onChange={(val) => setField('status', String(val))}
                  options={[
                    { value: 'active', label: t('products.active') },
                    { value: 'inactive', label: t('products.inactive') },
                    { value: 'draft', label: t('products.draft') },
                    { value: 'archived', label: t('products.archived') },
                  ]}
                  placeholder={t('products.publishStatus')}
                  buttonClassName={compactSelectBtnClass}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.track_inventory}
                  onChange={e => setField('track_inventory', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-border text-indigo-600 focus:ring-indigo-600/30 cursor-pointer"
                />
                <span className="text-sm font-semibold text-foreground">{t('products.trackStockLevel')}</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={e => setField('is_featured', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-border text-indigo-600 focus:ring-indigo-600/30 cursor-pointer"
                />
                <span className="text-sm font-semibold text-foreground">{t('products.featuredSpotlight')}</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_digital}
                  onChange={e => setField('is_digital', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-border text-indigo-600 focus:ring-indigo-600/30 cursor-pointer"
                />
                <span className="text-sm font-semibold text-foreground">{t('products.digitalProduct')}</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.shortDescription')}</label>
              <input
                value={form.short_description}
                onChange={e => setField('short_description', e.target.value)}
                placeholder="Brief summary sentence..."
                className="form-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.narrativeDescription')}</label>
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
                className="px-5 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted border border-border rounded-lg transition-colors cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-lg text-sm font-semibold shadow transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saveMutation.isPending && <Loader2 className="animate-spin" size={15} />}
                {t('products.createProduct')}
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
                  {t('products.colName')} <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={e => handleProductNameChange(e.target.value)}
                  required
                  placeholder="e.g. iPhone 15 Pro"
                  className="form-input w-full"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-muted-foreground">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateSkuClick}
                    className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    {t('products.autoGenerate')}
                  </button>
                </div>
                <input
                  value={form.sku}
                  onChange={e => handleSkuInputChange(e.target.value)}
                  required
                  placeholder="e.g. SKU-IPHONE-15"
                  className="form-input font-mono w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.colBarcode')}</label>
                <input
                  value={form.barcode}
                  onChange={e => setField('barcode', e.target.value)}
                  placeholder="UPC/EAN numbers"
                  className="form-input font-mono w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.colCategory')}</label>
                <ModernSelect
                  value={form.category_id}
                  onChange={(val) => setField('category_id', String(val))}
                  options={[
                    { value: '', label: t('products.noCategory') },
                    ...(categories ?? []).map((c: any) => ({ value: c.id, label: c.name })),
                  ]}
                  placeholder={t('products.colCategory')}
                  buttonClassName={compactSelectBtnClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.colBrand')}</label>
                <ModernSelect
                  value={form.brand_id}
                  onChange={(val) => setField('brand_id', String(val))}
                  options={[
                    { value: '', label: t('products.noBrand') },
                    ...(brands ?? []).map((b: any) => ({ value: b.id, label: b.name })),
                  ]}
                  placeholder={t('products.colBrand')}
                  buttonClassName={compactSelectBtnClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.colUnitName')}</label>
                <ModernSelect
                  value={form.unit_id}
                  onChange={(val) => setField('unit_id', String(val))}
                  options={[
                    { value: '', label: t('products.noUnit') },
                    ...(units ?? []).map((u: any) => ({ value: u.id, label: `${u.name}${u.symbol ? ` (${u.symbol})` : ''}` })),
                  ]}
                  placeholder={t('products.colUnitName')}
                  buttonClassName={compactSelectBtnClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.filterTax')}</label>
                <ModernSelect
                  value={form.tax_id}
                  onChange={(val) => setField('tax_id', String(val))}
                  options={[
                    { value: '', label: t('products.noTax') },
                    ...(taxes ?? []).map((taxItem: any) => ({ value: taxItem.id, label: `${taxItem.name} (${Number(taxItem.rate)}%)` })),
                  ]}
                  placeholder={t('products.filterTax')}
                  buttonClassName={compactSelectBtnClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.publishStatus')}</label>
              <ModernSelect
                value={form.status}
                onChange={(val) => setField('status', String(val))}
                options={[
                  { value: 'active', label: t('products.active') },
                  { value: 'inactive', label: t('products.inactive') },
                  { value: 'draft', label: t('products.draft') },
                  { value: 'archived', label: t('products.archived') },
                ]}
                placeholder={t('products.publishStatus')}
                buttonClassName={compactSelectBtnClass}
              />
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={e => setField('is_featured', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-border text-indigo-600 focus:ring-indigo-600/30 cursor-pointer"
                />
                <span className="text-sm font-semibold text-foreground">{t('products.featuredSpotlight')}</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_digital}
                  onChange={e => setField('is_digital', e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-border text-indigo-600 focus:ring-indigo-600/30 cursor-pointer"
                />
                <span className="text-sm font-semibold text-foreground">{t('products.digitalProduct')}</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.shortDescription')}</label>
              <input
                value={form.short_description}
                onChange={e => setField('short_description', e.target.value)}
                placeholder="Brief summary sentence..."
                className="form-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.narrativeDescription')}</label>
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
                className="flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-lg text-sm font-semibold shadow transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saveMutation.isPending && <Loader2 className="animate-spin" size={15} />}
                {t('products.saveGeneralInfo')}
              </button>
            </div>
          </form>
        )}

        {/* ─── EDIT MODE: Tab 2: Pricing ─── */}
        {isEdit && activeTab === 'pricing' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.colCostPrice')} ($)</label>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.colSellingPrice')} ($) <span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.comparePrice')} ($)</label>
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
                className="flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-lg text-sm font-semibold shadow transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saveMutation.isPending && <Loader2 className="animate-spin" size={15} />}
                {t('products.savePricing')}
              </button>
            </div>
          </form>
        )}

        {/* ─── EDIT MODE: Tab 3: Inventory ─── */}
        {isEdit && activeTab === 'inventory' && productId && (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 bg-muted/10 p-5 rounded-2xl border border-border/60">
              <h4 className="text-sm font-bold text-foreground">{t('products.stockTrackingSettings')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <label className="flex items-center gap-3 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={form.track_inventory}
                    onChange={e => setField('track_inventory', e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-border text-indigo-600 focus:ring-indigo-600/30 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-foreground">{t('products.trackStockLevel')}</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.lowStockThreshold')}</label>
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
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-lg text-sm font-semibold shadow transition-colors cursor-pointer"
                >
                  {saveMutation.isPending && <Loader2 className="animate-spin" size={15} />}
                  {t('products.saveSettings')}
                </button>
              </div>
            </form>

            <div className="space-y-3">
              <div>
                <h4 className="text-base font-semibold text-foreground">{t('products.warehouseStockLedger')}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{t('products.stockLedgerSub')}</p>
              </div>

              <form onSubmit={handleAddAdjustment} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-muted/20 p-4 rounded-xl border border-border/60">
                <ModernSelect
                  value={newAdjustment.warehouse_id}
                  onChange={(val) => setNewAdjustment({ ...newAdjustment, warehouse_id: String(val) })}
                  options={[
                    { value: '', label: t('products.chooseWarehouse') },
                    ...(warehouses ?? []).map((w: any) => ({ value: w.id, label: w.name })),
                  ]}
                  placeholder={t('products.chooseWarehouse')}
                  buttonClassName={compactSelectBtnClass}
                />
                <ModernSelect
                  value={newAdjustment.type}
                  onChange={(val) => setNewAdjustment({ ...newAdjustment, type: String(val) })}
                  options={[
                    { value: 'addition', label: t('products.addition') },
                    { value: 'subtraction', label: t('products.subtraction') },
                  ]}
                  placeholder={t('products.adjustmentType')}
                  buttonClassName={compactSelectBtnClass}
                />
                <input
                  type="number"
                  placeholder={t('products.quantityCount')}
                  value={newAdjustment.quantity}
                  onChange={e => setNewAdjustment({ ...newAdjustment, quantity: e.target.value })}
                  className="form-input text-xs"
                  required
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-1.5 px-4 font-semibold text-xs transition-colors shadow-sm cursor-pointer">
                  {t('products.logAdjustment')}
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">{t('products.stockMovementHistory')}</h4>
              <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full data-table text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="text-left py-2.5 px-3">{t('products.colLoggedDate')}</th>
                      <th className="text-left py-2.5 px-3">{t('products.colTransaction')}</th>
                      <th className="text-left py-2.5 px-3">{t('products.colCountDifference')}</th>
                      <th className="text-left py-2.5 px-3">{t('products.colReason')}</th>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.weight')} (kg)</label>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.length')} (cm)</label>
                <input
                  type="number"
                  value={form.length}
                  onChange={e => setField('length', e.target.value)}
                  placeholder="0"
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.width')} (cm)</label>
                <input
                  type="number"
                  value={form.width}
                  onChange={e => setField('width', e.target.value)}
                  placeholder="0"
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.height')} (cm)</label>
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
                className="flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-lg text-sm font-semibold shadow transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saveMutation.isPending && <Loader2 className="animate-spin" size={15} />}
                {t('products.saveDimensions')}
              </button>
            </div>
          </form>
        )}

        {/* ─── EDIT MODE: Tab 5: SEO ─── */}
        {isEdit && activeTab === 'seo' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.metaTitle')}</label>
                <input
                  value={form.meta_title}
                  onChange={e => setField('meta_title', e.target.value)}
                  placeholder="SEO Search result title..."
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.metaKeywords')}</label>
                <input
                  value={form.meta_keywords}
                  onChange={e => setField('meta_keywords', e.target.value)}
                  placeholder="Keywords separated by comma..."
                  className="form-input w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">{t('products.metaDescription')}</label>
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
                className="flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-lg text-sm font-semibold shadow transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saveMutation.isPending && <Loader2 className="animate-spin" size={15} />}
                {t('products.saveSeoSettings')}
              </button>
            </div>
          </form>
        )}

        {/* ─── EDIT MODE: Tab 6: Images ─── */}
        {isEdit && activeTab === 'images' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-semibold text-foreground">{t('products.mediaGallery')}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{t('products.mediaGallerySub')}</p>
              </div>
              <label className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-semibold rounded-lg hover:bg-muted transition-colors cursor-pointer bg-card">
                <ImageIcon size={15} />
                {t('products.uploadImages')}
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
                {t('products.dragDropText')}
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
                        {t('products.primaryImage')}
                      </span>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!img.is_primary && (
                        <button
                          type="button"
                          onClick={() => updateImageMutation.mutate({ imgId: img.id, data: { is_primary: true } })}
                          className="bg-indigo-600/90 text-white p-2 rounded-lg hover:bg-indigo-600 shadow transition-colors cursor-pointer"
                          title={t('products.setPrimary')}
                        >
                          <Star size={14} fill="currentColor" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteImageMutation.mutate({ productId: productId!, imgId: img.id })}
                        className="bg-red-600/90 text-white p-2 rounded-lg hover:bg-red-600 shadow transition-colors cursor-pointer"
                        title={t('products.delete')}
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
                        className="p-1 border border-border rounded hover:bg-muted font-bold text-[10px] cursor-pointer"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => updateImageMutation.mutate({ imgId: img.id, data: { sort_order: img.sort_order + 1 } })}
                        className="p-1 border border-border rounded hover:bg-muted font-bold text-[10px] cursor-pointer"
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
                <h4 className="text-base font-semibold text-foreground font-sans">{t('products.generateVariants')}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{t('products.variantsSub')}</p>
              </div>

              <form onSubmit={handleAddVariant} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-muted/20 p-4 rounded-xl border border-border/60">
                <input
                  type="text"
                  placeholder={t('products.variantName')}
                  value={newVariant.name}
                  onChange={e => setNewVariant({ ...newVariant, name: e.target.value })}
                  className="form-input text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder={t('products.variantSkuSuffix')}
                  value={newVariant.sku}
                  onChange={e => setNewVariant({ ...newVariant, sku: e.target.value })}
                  className="form-input text-xs font-mono"
                />
                <input
                  type="number"
                  placeholder={`${t('products.colSellingPrice')} ($)`}
                  value={newVariant.selling_price}
                  onChange={e => setNewVariant({ ...newVariant, selling_price: e.target.value })}
                  className="form-input text-xs"
                  required
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-1.5 px-4 font-semibold text-xs transition-colors shadow-sm cursor-pointer">
                  {t('products.addVariant')}
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Active Configuration Spec Matrix</h4>
              <table className="w-full data-table text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/10">
                    <th className="text-left py-2.5 px-3">{t('products.colVariantSpec')}</th>
                    <th className="text-left py-2.5 px-3">{t('products.colDerivedSku')}</th>
                    <th className="text-left py-2.5 px-3">{t('products.colPriceRate')}</th>
                    <th className="text-right py-2.5 px-3">{t('products.colActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {productDetail?.variants?.map((v: any) => (
                    <tr key={v.id} className="border-b border-border/40">
                      <td className="py-2.5 px-3 text-foreground font-semibold">{v.name}</td>
                      <td className="py-2.5 px-3 text-muted-foreground font-mono">{v.sku}</td>
                      <td className="py-2.5 px-3 font-semibold font-mono">${Number(v.selling_price).toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button type="button" onClick={() => deleteVariantMutation.mutate(v.id)} className="text-red-500 hover:text-red-700 font-semibold text-xs cursor-pointer">
                          {t('products.delete')}
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
                <h4 className="text-base font-semibold text-foreground font-sans">{t('products.tierPricing')}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{t('products.tierPricingSub')}</p>
              </div>

              <form onSubmit={handleAddTierPrice} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-muted/20 p-4 rounded-xl border border-border/60">
                <ModernSelect
                  value={newTierPrice.price_type}
                  onChange={(val) => setNewTierPrice({ ...newTierPrice, price_type: String(val) })}
                  options={[
                    { value: 'wholesale', label: t('products.wholesale') },
                    { value: 'special', label: t('products.special') },
                  ]}
                  placeholder={t('products.priceType')}
                  buttonClassName={compactSelectBtnClass}
                />
                <input
                  type="number"
                  placeholder={t('products.minQty')}
                  value={newTierPrice.min_qty}
                  onChange={e => setNewTierPrice({ ...newTierPrice, min_qty: e.target.value })}
                  className="form-input text-xs"
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder={`${t('products.colPrice')} ($)`}
                  value={newTierPrice.price}
                  onChange={e => setNewTierPrice({ ...newTierPrice, price: e.target.value })}
                  className="form-input text-xs"
                  required
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-1.5 px-4 font-semibold text-xs transition-colors shadow-sm cursor-pointer">
                  {t('products.addTierPrice')}
                </button>
              </form>

              <table className="w-full data-table text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/10">
                    <th className="text-left py-2.5 px-3">{t('products.colPriceClass')}</th>
                    <th className="text-left py-2.5 px-3">{t('products.colVolumeCond')}</th>
                    <th className="text-left py-2.5 px-3">{t('products.colAdjustedRate')}</th>
                    <th className="text-right py-2.5 px-3">{t('products.colActions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {productDetail?.prices?.map((p: any) => (
                    <tr key={p.id} className="border-b border-border/40">
                      <td className="py-2.5 px-3 text-foreground font-semibold capitalize">{p.price_type}</td>
                      <td className="py-2.5 px-3 text-muted-foreground font-mono">≥ {p.min_qty} units</td>
                      <td className="py-2.5 px-3 font-semibold font-mono">${Number(p.price).toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button type="button" onClick={() => deletePriceMutation.mutate(p.id)} className="text-red-500 hover:text-red-700 font-semibold text-xs cursor-pointer">
                          {t('products.delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!productDetail?.prices || productDetail.prices.length === 0) && (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-muted-foreground text-xs">No tier pricing rules configured.</td>
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
