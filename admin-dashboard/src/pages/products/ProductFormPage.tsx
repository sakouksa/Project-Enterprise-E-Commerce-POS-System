import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Edit2, X, Check, Loader2, Image as ImageIcon, Upload, Eye
} from 'lucide-react'
import api from '@/api/client'
import { productService } from '@/services/productService'
import { useToast } from '@/hooks/useToast'
import { LoadingSpinner, DeleteConfirmDialog } from '@/components/common'
import { getAbsoluteImageUrl } from '@/utils/image'

// Modular Components
import { ProductFormHeader } from './components/ProductFormHeader'
import { ProductBasicInfoSection } from './components/ProductBasicInfoSection'
import { ProductMediaSection } from './components/ProductMediaSection'
import { ProductVariantsSection } from './components/ProductVariantsSection'
import { ProductPriceHistoryModal } from './components/ProductPriceHistoryModal'
import { ProductAuditLogModal } from './components/ProductAuditLogModal'
import { ProductLivePreviewDrawer } from './components/ProductLivePreviewDrawer'

// Shared Form Sub-sections
import { FlexiblePricingSection } from '@/components/products/FlexiblePricingSection'
import { FlexibleInventorySection } from '@/components/products/FlexibleInventorySection'
import { FlexibleDimensionsSection } from '@/components/products/FlexibleDimensionsSection'
import { FlexibleSEOSection } from '@/components/products/FlexibleSEOSection'

// Types & Helpers
import { BLANK_FORM, type ProductForm, type CreateImagePreview, type CustomColorItem } from './types/productForm.types'
import {
  COLOR_MAP, normalizeColorKey, normalizeColorName,
  getDynamicColorMatchedImage, COLOR_MATCHED_IMAGES, getVariantColorHex
} from './utils/colorResolver'
import { SIZE_PRESET_MAP } from './utils/productPresets'

// Re-export helpers for backwards compatibility
export { normalizeColorKey, getDynamicColorMatchedImage, COLOR_MATCHED_IMAGES }

const ProductFormPage: React.FC = () => {
  const { t } = useTranslation(['products', 'common'])
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const productId = id ? parseInt(id) : null
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()

  // Main Form State
  const [form, setForm] = useState<ProductForm>(BLANK_FORM)
  const [isSkuManuallyEdited, setIsSkuManuallyEdited] = useState(false)

  // Media upload state
  const [createImagePreviews, setCreateImagePreviews] = useState<CreateImagePreview[]>([])
  const [createDragActive, setCreateDragActive] = useState(false)

  // Variant generator & management state
  const [selectedPresetMode, setSelectedPresetMode] = useState<string>('auto')
  const [customSizeCategory, setCustomSizeCategory] = useState<string>('auto')
  const [customSelectedSizes, setCustomSelectedSizes] = useState<string[]>(['128GB', '256GB', '512GB'])
  const [customSelectedColors, setCustomSelectedColors] = useState<string[]>(['Black', 'White', 'Silver'])
  const [customInputSize, setCustomInputSize] = useState<string>('')
  const [userAddedSizes, setUserAddedSizes] = useState<string[]>([])
  const [customInputColor, setCustomInputColor] = useState<string>('')
  const [customColorHex, setCustomColorHex] = useState<string>('#6366f1')
  const [userAddedColors, setUserAddedColors] = useState<CustomColorItem[]>([])
  const [isGeneratingVariants, setIsGeneratingVariants] = useState(false)
  const [matrixProgress, setMatrixProgress] = useState<{ current: number; total: number } | null>(null)
  const [colorImageMap, setColorImageMap] = useState<Record<string, string>>({})

  // Variant dialogs
  const [editingVariant, setEditingVariant] = useState<any | null>(null)
  const [viewingVariant, setViewingVariant] = useState<any | null>(null)
  const [variantToDelete, setVariantToDelete] = useState<{ id: number; name: string } | null>(null)
  const [isClearAllVariantsOpen, setIsClearAllVariantsOpen] = useState(false)
  const [isClearingAllVariants, setIsClearingAllVariants] = useState(false)
  const [bulkDeleteVariantConfirmOpen, setBulkDeleteVariantConfirmOpen] = useState(false)
  const [selectedVariantIds, setSelectedVariantIds] = useState<number[]>([])
  const [variantPage, setVariantPage] = useState(1)
  const [variantPageSize, setVariantPageSize] = useState(10)

  // Modals & Drawer state
  const [isPriceHistoryOpen, setIsPriceHistoryOpen] = useState(false)
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false)
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState(false)

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

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const setField = (field: keyof ProductForm | string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

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

  const getDetectedCategoryKey = () => {
    const catName = (categories?.find((c: any) => String(c.id) === String(form.category_id))?.name || productDetail?.category?.name || '').toLowerCase()
    if (catName.includes('phone') || catName.includes('mobile') || catName.includes('smartphone')) return 'smartphones'
    if (catName.includes('laptop') || catName.includes('computer') || catName.includes('macbook')) return 'laptops'
    if (catName.includes('monitor') || catName.includes('display') || catName.includes('screen')) return 'monitors'
    if (catName.includes('watch') || catName.includes('smartwatch')) return 'smartwatches'
    if (catName.includes('keyboard')) return 'keyboards'
    if (catName.includes('headphone') || catName.includes('earphone') || catName.includes('speaker') || catName.includes('audio') || catName.includes('mice') || catName.includes('mouse')) return 'audio'
    if (catName.includes('camera') || catName.includes('lens')) return 'cameras'
    if (catName.includes('charger') || catName.includes('adapter') || catName.includes('power')) return 'chargers'
    if (catName.includes('shoe') || catName.includes('footwear') || catName.includes('sneaker')) return 'shoes'
    if (catName.includes('shirt') || catName.includes('clothing') || catName.includes('apparel') || catName.includes('fashion')) return 'apparel'
    return 'smartphones'
  }

  const activeCategoryKey = customSizeCategory === 'auto' ? getDetectedCategoryKey() : customSizeCategory

  const handleSwitchSizeCategory = (catKey: string) => {
    setCustomSizeCategory(catKey)
    const targetObj = SIZE_PRESET_MAP[catKey]
    if (targetObj) {
      const defaultCodes = targetObj.options.slice(0, 3).map(o => o.code)
      setCustomSelectedSizes(defaultCodes)
    }
  }

  // ─── Population on Edit ───────────────────────────────────────────────────
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
        has_variants:        !!productDetail.has_variants,
        low_stock_threshold: String(productDetail.low_stock_threshold ?? '5'),
        status:              productDetail.status || 'active',
        is_featured:         !!productDetail.is_featured,
        is_digital:          !!productDetail.is_digital,
        meta_title:          productDetail.meta_title || '',
        meta_description:    productDetail.meta_description || '',
        meta_keywords:       productDetail.meta_keywords || '',
      })

      if (productDetail.variants && productDetail.variants.length > 0) {
        const extractedSizes = new Set<string>()
        const extractedColors = new Set<string>()
        const initialColorImageMap: Record<string, string> = {}

        productDetail.variants.forEach((v: any) => {
          const vName = v.name || ''
          const vImg = getAbsoluteImageUrl(v.image)
          const parts = vName.includes('/') ? vName.split('/') : vName.includes('-') ? vName.split('-') : [vName]
          parts.forEach((part: string) => {
            const clean = part.trim()
            if (/\b\d+\s*(gb|tb|mb)\b/i.test(clean) || /\b(s|m|l|xl|xxl)\b/i.test(clean)) {
              extractedSizes.add(clean)
            } else {
              const norm = normalizeColorName(clean)
              if (norm) {
                extractedColors.add(norm)
                if (vImg && !initialColorImageMap[norm]) initialColorImageMap[norm] = vImg
              }
            }
          })
        })

        if (extractedSizes.size > 0) setCustomSelectedSizes(Array.from(extractedSizes))
        if (extractedColors.size > 0) setCustomSelectedColors(Array.from(extractedColors))
        if (Object.keys(initialColorImageMap).length > 0) setColorImageMap(initialColorImageMap)
      }
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
    onSuccess: async (data: any) => {
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['pos-products'] })
      qc.invalidateQueries({ queryKey: ['products-stats'] })
      if (productId) qc.invalidateQueries({ queryKey: ['product-detail-page', productId] })

      if (!isEdit && data?.id && createImagePreviews.length > 0) {
        try {
          const files = createImagePreviews.map(p => p.file)
          await productService.uploadImages(data.id, files)
          toast.success(t('products.createSuccessWithImages', 'Product & media created successfully.'))
        } catch {
          toast.success(t('products.createSuccess', 'Product created successfully.'))
        }
      } else {
        toast.success(isEdit ? t('products.updateSuccess', 'Product updated successfully.') : t('products.createSuccess', 'Product created successfully.'))
      }

      if (!isEdit && data?.id) {
        navigate(`/products/${data.id}/edit`)
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to save product.')
    },
  })

  const deleteImageMutation = useMutation({
    mutationFn: ({ productId, imgId }: { productId: number; imgId: number }) =>
      productService.deleteImage(productId, imgId),
    onSuccess: () => {
      refetchDetail()
      toast.success('Image deleted successfully.')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to delete image.')
  })

  const updateImageMutation = useMutation({
    mutationFn: ({ imgId, data }: { imgId: number; data: { is_primary?: boolean } }) =>
      productService.updateImage(imgId, data),
    onSuccess: () => {
      refetchDetail()
      toast.success('Image details updated.')
    },
    onError: () => toast.error('Failed to update image details.')
  })

  const updateVariantMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => productService.updateVariant(id, data),
    onSuccess: () => {
      refetchDetail()
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success(t('products.variantUpdated', 'Variant updated successfully.'))
      setEditingVariant(null)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to update variant.')
  })

  const deleteVariantMutation = useMutation({
    mutationFn: (variantId: number) => productService.deleteVariant(variantId),
    onSuccess: () => {
      refetchDetail()
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success(t('products.variantDeleted', 'Variant deleted successfully.'))
      setVariantToDelete(null)
    },
    onError: () => toast.error(t('products.variantDeleteFailed', 'Failed to delete variant.'))
  })

  const bulkDeleteVariantMutation = useMutation({
    mutationFn: (ids: number[]) => productService.bulkDeleteVariants(ids),
    onSuccess: () => {
      refetchDetail()
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success(t('products.bulkDeleteVariantsSuccess', 'Bulk deleted variants successfully.'))
      setSelectedVariantIds([])
      setBulkDeleteVariantConfirmOpen(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to delete variants.')
  })

  // ─── Image Drag & Drop Handlers ──────────────────────────────────────────
  const handleCreateDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCreateDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleCreateDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCreateDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleCreateImageFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleCreateImageFiles = (files: File[]) => {
    if (isEdit && productId) {
      productService.uploadImages(productId, files).then(() => {
        refetchDetail()
        toast.success('Images uploaded successfully.')
      })
      return
    }
    const newPreviews = files.map((file, idx) => ({
      id: `create-img-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
      isPrimary: createImagePreviews.length === 0 && idx === 0,
    }))
    setCreateImagePreviews(prev => [...prev, ...newPreviews])
  }

  const handleRemoveCreateImage = (idToRemove: string) => {
    setCreateImagePreviews(prev => {
      const filtered = prev.filter(img => img.id !== idToRemove)
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) filtered[0].isPrimary = true
      return filtered
    })
  }

  const handleSetPrimaryCreateImage = (idToPrimary: string) => {
    setCreateImagePreviews(prev =>
      prev.map(img => ({ ...img, isPrimary: img.id === idToPrimary }))
    )
  }

  // ─── Variant Matrix Generation ───────────────────────────────────────────
  const handleGenerateMatrix = async () => {
    if (!productId) {
      toast.error('Please save the product basic info first before generating variants.')
      return
    }
    const baseSelling = parseFloat(form.selling_price) || 0
    const baseCost = parseFloat(form.cost_price) || 0
    const combinations: any[] = []

    customSelectedSizes.forEach(size => {
      customSelectedColors.forEach(color => {
        const variantName = `${size} / ${color}`
        const skuSuffix = `${size.replace(/[^a-zA-Z0-9]/g, '')}-${color.toUpperCase().slice(0, 3)}`
        const matchedImage = getDynamicColorMatchedImage(color, activeCategoryKey, productDetail?.images, colorImageMap, form.name)
        combinations.push({
          product_id: productId,
          name: variantName,
          sku: `${form.sku}-${skuSuffix}`,
          selling_price: baseSelling,
          cost_price: baseCost,
          stock: 10,
          is_active: true,
          image: matchedImage,
        })
      })
    })

    if (combinations.length === 0) return

    setIsGeneratingVariants(true)
    setMatrixProgress({ current: 0, total: combinations.length })

    try {
      for (let i = 0; i < combinations.length; i++) {
        await productService.createVariant(combinations[i])
        setMatrixProgress({ current: i + 1, total: combinations.length })
      }
      refetchDetail()
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success(t('products.matrixGeneratedSuccess', 'Generated variant matrix successfully!'))
    } catch {
      toast.error('Failed to generate all variants in matrix.')
    } finally {
      setIsGeneratingVariants(false)
      setMatrixProgress(null)
    }
  }

  // ─── Custom Attribute Handlers ────────────────────────────────────────────
  const handleAddUserCustomSize = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = customInputSize.trim()
    if (!trimmed) return
    if (!userAddedSizes.includes(trimmed)) setUserAddedSizes(prev => [...prev, trimmed])
    if (!customSelectedSizes.includes(trimmed)) setCustomSelectedSizes(prev => [...prev, trimmed])
    setCustomInputSize('')
  }

  const handleAddUserCustomColor = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = customInputColor.trim()
    if (!trimmed) return
    const norm = normalizeColorName(trimmed)
    if (!customSelectedColors.includes(norm)) setCustomSelectedColors(prev => [...prev, norm])
    if (!userAddedColors.some(c => c.key.toLowerCase() === norm.toLowerCase())) {
      setUserAddedColors(prev => [...prev, { key: norm, name: norm, hex: customColorHex || '#6366f1' }])
    }
    setCustomInputColor('')
  }

  const handleClearAllVariants = async () => {
    if (!productId) return
    setIsClearingAllVariants(true)
    try {
      await productService.update(productId, { has_variants: false, variants: [] })
      setField('has_variants', false)
      refetchDetail()
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success(t('products.clearAllVariantsSuccess', 'Cleared all variants successfully.'))
    } finally {
      setIsClearingAllVariants(false)
      setIsClearAllVariantsOpen(false)
    }
  }

  // ─── Submit Form ──────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error(t('products.nameRequired', 'Product name is required.'))
      return
    }

    const payload = {
      name:                form.name.trim(),
      sku:                 form.sku.trim() || generateSKU(form.name),
      barcode:             form.barcode.trim() || null,
      description:         form.description.trim() || null,
      short_description:   form.short_description.trim() || null,
      category_id:         form.category_id ? Number(form.category_id) : null,
      brand_id:            form.brand_id ? Number(form.brand_id) : null,
      unit_id:             form.unit_id ? Number(form.unit_id) : null,
      tax_id:              form.tax_id ? Number(form.tax_id) : null,
      cost_price:          parseFloat(form.cost_price) || 0,
      selling_price:       parseFloat(form.selling_price) || 0,
      compare_price:       form.compare_price ? parseFloat(form.compare_price) : null,
      weight:              form.weight ? parseFloat(form.weight) : null,
      length:              form.length ? parseFloat(form.length) : null,
      width:               form.width ? parseFloat(form.width) : null,
      height:              form.height ? parseFloat(form.height) : null,
      track_inventory:     !!form.track_inventory,
      has_variants:        !!form.has_variants,
      low_stock_threshold: parseInt(form.low_stock_threshold) || 5,
      status:              form.status || 'active',
      is_featured:         !!form.is_featured,
      is_digital:          !!form.is_digital,
      meta_title:          form.meta_title.trim() || null,
      meta_description:    form.meta_description.trim() || null,
      meta_keywords:       form.meta_keywords.trim() || null,
    }

    saveMutation.mutate(payload)
  }

  if (isLoadingDetail) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Top Header */}
      <ProductFormHeader
        isEdit={isEdit}
        productId={productId}
        productDetail={productDetail}
        isPending={saveMutation.isPending}
        onSubmit={handleSubmit}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Product Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: General Info */}
          <ProductBasicInfoSection
            form={form}
            setField={setField}
            categories={categories || []}
            brands={brands || []}
            units={units || []}
            taxes={taxes || []}
            isSkuManuallyEdited={isSkuManuallyEdited}
            setIsSkuManuallyEdited={setIsSkuManuallyEdited}
            generateSKU={generateSKU}
          />

          {/* Card 2: Media & Photos */}
          <ProductMediaSection
            isEdit={isEdit}
            productId={productId}
            productDetail={productDetail}
            createImagePreviews={createImagePreviews}
            createDragActive={createDragActive}
            handleCreateDrag={handleCreateDrag}
            handleCreateDrop={handleCreateDrop}
            handleCreateImageFiles={handleCreateImageFiles}
            handleRemoveCreateImage={handleRemoveCreateImage}
            handleSetPrimaryCreateImage={handleSetPrimaryCreateImage}
            onUpdateImagePrimary={(imgId) => updateImageMutation.mutate({ imgId, data: { is_primary: true } })}
            onDeleteImage={(imgId) => deleteImageMutation.mutate({ productId: productId!, imgId })}
          />

          {/* Card 3: Pricing Strategy */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <FlexiblePricingSection
              costPrice={form.cost_price}
              sellingPrice={form.selling_price}
              comparePrice={form.compare_price}
              taxId={form.tax_id}
              taxes={taxes || []}
              onCostPriceChange={(val) => setField('cost_price', val)}
              onSellingPriceChange={(val) => setField('selling_price', val)}
              onComparePriceChange={(val) => setField('compare_price', val)}
              onTaxIdChange={(val) => setField('tax_id', val)}
              showTaxSelector={true}
            />
          </div>

          {/* Card 4: Inventory Management */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <FlexibleInventorySection
              trackInventory={form.track_inventory}
              hasVariants={form.has_variants}
              lowStockThreshold={form.low_stock_threshold}
              onTrackInventoryChange={(val) => setField('track_inventory', val)}
              onHasVariantsChange={(val) => setField('has_variants', val)}
              onLowStockThresholdChange={(val) => setField('low_stock_threshold', val)}
            />
          </div>

          {/* Card 5: Physical Dimensions */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <FlexibleDimensionsSection
              weight={form.weight}
              length={form.length}
              width={form.width}
              height={form.height}
              onWeightChange={(val) => setField('weight', val)}
              onLengthChange={(val) => setField('length', val)}
              onWidthChange={(val) => setField('width', val)}
              onHeightChange={(val) => setField('height', val)}
            />
          </div>

          {/* Card 6: SEO Discovery */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <FlexibleSEOSection
              metaTitle={form.meta_title}
              metaKeywords={form.meta_keywords}
              metaDescription={form.meta_description}
              productName={form.name}
              onMetaTitleChange={(val) => setField('meta_title', val)}
              onMetaKeywordsChange={(val) => setField('meta_keywords', val)}
              onMetaDescriptionChange={(val) => setField('meta_description', val)}
            />
          </div>
        </div>

        {/* Card 7: Multi-Dimensional Variants Matrix */}
        <ProductVariantsSection
          productId={productId}
          form={form}
          setField={setField}
          productDetail={productDetail}
          selectedPresetMode={selectedPresetMode}
          setSelectedPresetMode={setSelectedPresetMode}
          customSizeCategory={customSizeCategory}
          activeCategoryKey={activeCategoryKey}
          handleSwitchSizeCategory={handleSwitchSizeCategory}
          customSelectedSizes={customSelectedSizes}
          setCustomSelectedSizes={setCustomSelectedSizes}
          customInputSize={customInputSize}
          setCustomInputSize={setCustomInputSize}
          userAddedSizes={userAddedSizes}
          handleAddUserCustomSize={handleAddUserCustomSize}
          customSelectedColors={customSelectedColors}
          setCustomSelectedColors={setCustomSelectedColors}
          customInputColor={customInputColor}
          setCustomInputColor={setCustomInputColor}
          customColorHex={customColorHex}
          setCustomColorHex={setCustomColorHex}
          userAddedColors={userAddedColors}
          handleAddUserCustomColor={handleAddUserCustomColor}
          isGeneratingVariants={isGeneratingVariants}
          matrixProgress={matrixProgress}
          handleGenerateMatrix={handleGenerateMatrix}
          variantPage={variantPage}
          setVariantPage={setVariantPage}
          variantPageSize={variantPageSize}
          setVariantPageSize={setVariantPageSize}
          selectedVariantIds={selectedVariantIds}
          setSelectedVariantIds={setSelectedVariantIds}
          onOpenEditVariant={(v) => setEditingVariant({ ...v })}
          onOpenViewVariant={(v) => setViewingVariant({ ...v })}
          onOpenDeleteVariant={(v) => setVariantToDelete(v)}
          onOpenClearAllVariants={() => setIsClearAllVariantsOpen(true)}
          onOpenBulkDeleteVariants={() => setBulkDeleteVariantConfirmOpen(true)}
          onQuickToggleVariantStatus={(v) => updateVariantMutation.mutate({ id: v.id, data: { is_active: !v.is_active } })}
        />
      </form>

      {/* ─── MODALS & DRAWERS ─── */}
      {/* Edit Variant Modal */}
      <AnimatePresence>
        {editingVariant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <h3 className="text-base font-bold text-foreground">Edit Variant Details</h3>
                <button type="button" onClick={() => setEditingVariant(null)} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  updateVariantMutation.mutate({
                    id: editingVariant.id,
                    data: {
                      name: editingVariant.name,
                      sku: editingVariant.sku,
                      cost_price: parseFloat(editingVariant.cost_price) || 0,
                      selling_price: parseFloat(editingVariant.selling_price) || 0,
                      stock: parseFloat(editingVariant.stock) || 0,
                      is_active: !!editingVariant.is_active,
                      image: editingVariant.image || null,
                    }
                  })
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">Variant Name *</label>
                  <input
                    type="text"
                    required
                    value={editingVariant.name || ''}
                    onChange={e => setEditingVariant({ ...editingVariant, name: e.target.value })}
                    className="form-input text-xs w-full font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">SKU</label>
                  <input
                    type="text"
                    value={editingVariant.sku || ''}
                    onChange={e => setEditingVariant({ ...editingVariant, sku: e.target.value })}
                    className="form-input text-xs font-mono w-full"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">Selling ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingVariant.selling_price || ''}
                      onChange={e => setEditingVariant({ ...editingVariant, selling_price: e.target.value })}
                      className="form-input text-xs font-mono font-bold text-primary w-full"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">Cost ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingVariant.cost_price || ''}
                      onChange={e => setEditingVariant({ ...editingVariant, cost_price: e.target.value })}
                      className="form-input text-xs font-mono w-full"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">Stock</label>
                    <input
                      type="number"
                      value={editingVariant.stock ?? ''}
                      onChange={e => setEditingVariant({ ...editingVariant, stock: e.target.value })}
                      className="form-input text-xs font-mono font-bold text-emerald-600 w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                  <span className="font-bold text-foreground">Active in Catalog</span>
                  <button
                    type="button"
                    onClick={() => setEditingVariant({ ...editingVariant, is_active: !editingVariant.is_active })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      editingVariant.is_active ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30' : 'bg-muted text-muted-foreground border border-border'
                    }`}
                  >
                    {editingVariant.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setEditingVariant(null)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateVariantMutation.isPending}
                    className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {updateVariantMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Single Variant Confirmation */}
      <DeleteConfirmDialog
        isOpen={!!variantToDelete}
        title={t('products.variant', 'Variant')}
        itemName={variantToDelete?.name || ''}
        warningText={t('products.confirmDeleteVariant', 'Are you sure you want to delete this variant?')}
        isPending={deleteVariantMutation.isPending}
        onCancel={() => setVariantToDelete(null)}
        onSoftDelete={() => variantToDelete && deleteVariantMutation.mutate(variantToDelete.id)}
      />

      {/* Clear All Variants Confirmation */}
      <DeleteConfirmDialog
        isOpen={isClearAllVariantsOpen}
        title={t('products.allVariants', 'All Variants')}
        itemName={t('products.allVariants', 'All Product Variants')}
        warningText={t('products.confirmClearVariants', 'Are you sure you want to clear all variants for this product?')}
        isPending={isClearingAllVariants}
        onCancel={() => setIsClearAllVariantsOpen(false)}
        onSoftDelete={handleClearAllVariants}
      />

      {/* Bulk Delete Selected Variants Confirmation */}
      <DeleteConfirmDialog
        isOpen={bulkDeleteVariantConfirmOpen}
        title={t('variants.bulkDeleteTitle', 'Delete Selected Variants')}
        itemName={`${selectedVariantIds.length} items`}
        warningText={`Are you sure you want to delete ${selectedVariantIds.length} selected variants?`}
        isPending={bulkDeleteVariantMutation.isPending}
        onCancel={() => setBulkDeleteVariantConfirmOpen(false)}
        onSoftDelete={() => bulkDeleteVariantMutation.mutate(selectedVariantIds)}
      />

      {/* Price History Modal */}
      <ProductPriceHistoryModal
        isOpen={isPriceHistoryOpen}
        onClose={() => setIsPriceHistoryOpen(false)}
        productName={form.name}
        priceHistory={productDetail?.price_history || []}
      />

      {/* Audit Log Modal */}
      <ProductAuditLogModal
        isOpen={isAuditLogOpen}
        onClose={() => setIsAuditLogOpen(false)}
        productName={form.name}
        auditLogs={productDetail?.audit_logs || []}
      />

      {/* Live Preview Drawer */}
      <ProductLivePreviewDrawer
        isOpen={isLivePreviewOpen}
        onClose={() => setIsLivePreviewOpen(false)}
        form={form}
        productDetail={productDetail}
        categories={categories || []}
        brands={brands || []}
        createImagePreviews={createImagePreviews}
      />
    </div>
  )
}

export default ProductFormPage
