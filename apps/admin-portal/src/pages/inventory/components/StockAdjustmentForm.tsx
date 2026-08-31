import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
  Package,
  Info,
  Minus,
  RotateCcw,
  Sparkles,
  Save,
  Boxes,
  Search,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Building2,
  Tag,
  FileText,
  DollarSign,
  Barcode,
  X,
  Layers,
  HelpCircle,
  Check
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryService } from '@/services/inventoryService'
import { companyService } from '@/services/companyService'
import { productService } from '@/services/productService'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/useToast'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'
import { FormHeader, FormFooter } from '@/components/common'
import { motion, AnimatePresence } from 'framer-motion'

interface StockAdjustmentFormProps {
  adjustmentId?: number | null
  onClose?: () => void
}

export const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({ adjustmentId, onClose }) => {
  const { t } = useTranslation(['inventory', 'buttons', 'common', 'products'])
  const toast = useToast()
  const qc = useQueryClient()
  const navigate = useNavigate()
  const params = useParams<{ id?: string }>()

  const effectiveId = adjustmentId ?? (params.id ? Number(params.id) : null)
  const isEdit = !!effectiveId

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      navigate('/inventory?tab=adjustments')
    }
  }

  // Form States
  const [warehouseId, setWarehouseId] = useState('')
  const [type, setType] = useState<'addition' | 'subtraction' | 'recount'>('addition')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<Array<{ product_id: string; variant_id: string; quantity: number; product?: any }>>([])
  
  // Search & Filter state for adding items
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Queries
  const { data: detail, isLoading: loadingDetail } = useQuery({
    queryKey: ['stock-adjustment-detail', effectiveId],
    queryFn: () => inventoryService.getAdjustment(effectiveId!),
    enabled: isEdit,
  })

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses-list'],
    queryFn: () => companyService.getWarehouses().then(r => r.data),
  })

  const { data: rawProducts } = useQuery({
    queryKey: ['products-list'],
    queryFn: () => productService.list({ per_page: 1000 }).then(r => r.data),
  })

  const products = useMemo(() => {
    return Array.isArray(rawProducts) ? rawProducts : (rawProducts?.data ?? [])
  }, [rawProducts])

  // Set default warehouse if none selected
  useEffect(() => {
    if (!warehouseId && warehouses && warehouses.length > 0 && !isEdit) {
      setWarehouseId(String(warehouses[0].id))
    }
  }, [warehouses, warehouseId, isEdit])

  // Auto fill form if editing
  useEffect(() => {
    if (detail) {
      setWarehouseId(detail.warehouse?.id?.toString() || detail.warehouse_id?.toString() || '')
      setType((detail.type as any) || 'addition')
      setReason(detail.reason || '')
      setNotes(detail.notes || '')
      if (detail.items && detail.items.length > 0) {
        setItems(detail.items.map((it: any) => ({
          product_id: it.product_id?.toString() || '',
          variant_id: it.product_variant_id?.toString() || '',
          quantity: Math.abs(parseFloat(it.quantity_adjusted)) || 1,
          product: it.product,
        })))
      }
    }
  }, [detail])

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Computed Values
  const selectedWarehouseObj = useMemo(
    () => warehouses?.find((w: any) => w.id?.toString() === warehouseId?.toString()),
    [warehouses, warehouseId]
  )

  const totalAdjustedUnits = useMemo(
    () => items.reduce((acc, it) => acc + (parseFloat(String(it.quantity)) || 0), 0),
    [items]
  )

  const totalEstimatedValue = useMemo(() => {
    return items.reduce((acc, it) => {
      const prod = products.find((p: any) => String(p.id) === String(it.product_id)) || it.product
      const price = parseFloat(prod?.cost_price || prod?.price || 0)
      const qty = parseFloat(String(it.quantity)) || 0
      return acc + (price * qty)
    }, 0)
  }, [items, products])

  // Search filtered products for quick adder
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase().trim()
    return products
      .filter((p: any) => 
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        (p.barcode && p.barcode.toLowerCase().includes(query))
      )
      .slice(0, 8)
  }, [searchQuery, products])

  // Reason suggestions with 5-language i18n
  const reasonSuggestions = useMemo(() => [
    { key: 'damaged', label: t('reasonDamaged', 'Damaged Goods') },
    { key: 'expired', label: t('reasonExpired', 'Expired Stock') },
    { key: 'discrepancy', label: t('reasonDiscrepancy', 'Audit Discrepancy') },
    { key: 'lost', label: t('reasonLost', 'Lost / Stolen') },
    { key: 'correction', label: t('reasonCorrection', 'Inbound Correction') },
  ], [t])

  // Mutations
  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (isEdit) {
        return inventoryService.updateAdjustment(effectiveId, payload)
      }
      return inventoryService.createAdjustment(payload)
    },
    onSuccess: () => {
      toast.success(
        isEdit
          ? t('adjustmentUpdatedSuccess', 'Stock adjustment updated successfully')
          : t('adjustmentCreatedSuccess', 'Stock adjustment created successfully')
      )
      qc.invalidateQueries({ queryKey: ['inventory-adjustments'] })
      qc.invalidateQueries({ queryKey: ['inventory-dashboard-stats'] })
      handleClose()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('common.saveFailed', 'Failed to save adjustment'))
    }
  })

  const approveMutation = useMutation({
    mutationFn: () => inventoryService.approveAdjustment(effectiveId!),
    onSuccess: () => {
      toast.success(t('adjustmentApprovedSuccess', 'Stock adjustment approved successfully!'))
      qc.invalidateQueries({ queryKey: ['stock-adjustment-detail', effectiveId] })
      qc.invalidateQueries({ queryKey: ['inventory-adjustments'] })
      qc.invalidateQueries({ queryKey: ['inventory-dashboard-stats'] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('common.actionFailed', 'Approval failed'))
    }
  })

  // Handlers
  const handleAddProductToItems = (prod: any) => {
    const existingIndex = items.findIndex(it => String(it.product_id) === String(prod.id))
    if (existingIndex >= 0) {
      setItems(prev => {
        const next = [...prev]
        next[existingIndex] = { ...next[existingIndex], quantity: next[existingIndex].quantity + 1 }
        return next
      })
      toast.info(`${prod.name}: +1 ${t('quantity', 'Quantity')}`)
    } else {
      setItems(prev => [...prev, { product_id: String(prod.id), variant_id: '', quantity: 1, product: prod }])
    }
    setSearchQuery('')
    setSearchFocused(false)
  }

  const handleAddItem = () => {
    setItems(prev => [...prev, { product_id: '', variant_id: '', quantity: 1 }])
  }

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, idx) => idx !== index))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems(prev => {
      const next = [...prev]
      const current = { ...next[index], [field]: value }

      if (field === 'product_id') {
        const prod = products.find((p: any) => String(p.id) === String(value))
        current.product = prod
        current.variant_id = ''
      }

      next[index] = current
      return next
    })
  }

  const handleStepQuantity = (index: number, delta: number) => {
    setItems(prev => {
      const next = [...prev]
      const currentQty = Math.max(1, (parseFloat(String(next[index].quantity)) || 0) + delta)
      next[index] = { ...next[index], quantity: currentQty }
      return next
    })
  }

  const handleSetQuickQuantity = (index: number, qty: number) => {
    setItems(prev => {
      const next = [...prev]
      next[index] = { ...next[index], quantity: qty }
      return next
    })
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!warehouseId) {
      toast.error(t('selectWarehouseAlert', 'Please select a warehouse.'))
      return
    }

    const validItems = items.filter(it => !!it.product_id && (parseFloat(String(it.quantity)) || 0) > 0)
    if (validItems.length === 0) {
      toast.error(t('addAtLeastOneItemHint', 'Please add at least 1 product item to proceed'))
      return
    }

    const payload = {
      warehouse_id: parseInt(warehouseId),
      type,
      reason: reason.trim() || t('reasonDiscrepancy', 'Audit Discrepancy'),
      notes,
      items: validItems.map(it => ({
        product_id: parseInt(it.product_id),
        variant_id: it.variant_id ? parseInt(it.variant_id) : null,
        quantity: parseFloat(String(it.quantity)),
      }))
    }

    saveMutation.mutate(payload)
  }

  if (isEdit && loadingDetail) {
    return (
      <div className="p-12 text-center bg-card rounded-2xl border border-border/80 shadow-xs">
        <Loader2 className="animate-spin mx-auto mb-3 text-primary" size={28} />
        <p className="text-xs font-semibold text-muted-foreground">{t('common.loading', 'Loading...')}</p>
      </div>
    )
  }

  const isApproved = detail?.status === 'approved'

  return (
    <div className="w-full space-y-6 pb-12 animate-fade-in">
      {/* ─── Global Form Header with Breadcrumbs & Actions ─── */}
      <FormHeader
        isEdit={isEdit}
        title={
          isEdit
            ? t('view_adj', 'Edit Stock Adjustment')
            : t('create_adj', 'New Stock Adjustment')
        }
        subtitle={t('adj_desc', 'Adjust warehouse stock quantities with approval logs.')}
        breadcrumbs={[
          { label: t('inventory', 'Inventory'), path: '/inventory' },
          { label: t('adjustments', 'Stock Adjustments'), path: '/inventory?tab=adjustments' },
          { label: isEdit ? (detail?.reference_number || `ADJ-${effectiveId}`) : t('create_adj', 'New Stock Adjustment') },
        ]}
        statusBadge={
          isEdit ? (
            <span className={`px-3 py-1 rounded-full text-xs font-black font-mono shadow-2xs ${
              isApproved
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
            }`}>
              {isApproved ? t('statusApproved', 'Approved') : (detail?.reference_number || `ADJ-${effectiveId}`)}
            </span>
          ) : undefined
        }
        onBack={handleClose}
        backLabel={t('common.back', 'Back')}
      />

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ─── Left Column: General Configuration (4 Cols) ─── */}
          <div className="lg:col-span-4 space-y-5">
            {/* Main Config Card */}
            <div className="bg-card border border-border/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 border-b border-border/60 pb-3.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
                  <Building2 size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    {t('generalInfoCard', 'General Information')}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {t('stockAdjustConfigDesc', 'Set target warehouse and adjustment mode')}
                  </p>
                </div>
              </div>

              {isApproved ? (
                <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-muted/30 rounded-2xl border border-border/60">
                    <span className="text-[11px] text-muted-foreground block font-bold mb-0.5">
                      {t('warehouse', 'Warehouse')}
                    </span>
                    <span className="font-bold text-foreground block text-sm">
                      {selectedWarehouseObj?.name || 'Unknown Warehouse'}
                    </span>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-2xl border border-border/60">
                    <span className="text-[11px] text-muted-foreground block font-bold mb-0.5">
                      {t('type', 'Adjustment Type')}
                    </span>
                    <span className="font-bold text-foreground block capitalize">
                      {type === 'addition' && t('typeAddition', 'Addition (+)')}
                      {type === 'subtraction' && t('typeSubtraction', 'Subtraction (-)')}
                      {type === 'recount' && t('typeRecount', 'Recount (Set Qty)')}
                    </span>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-2xl border border-border/60">
                    <span className="text-[11px] text-muted-foreground block font-bold mb-0.5">
                      {t('reason', 'Reason')}
                    </span>
                    <span className="font-semibold text-foreground block">
                      {reason || '—'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Warehouse Select */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-foreground flex items-center justify-between">
                      <span>{t('warehouse', 'Warehouse')} <span className="text-rose-500">*</span></span>
                      {selectedWarehouseObj && (
                        <span className="text-[10px] text-primary font-mono font-semibold">
                          Code: {selectedWarehouseObj.code || `WH-${selectedWarehouseObj.id}`}
                        </span>
                      )}
                    </label>
                    <ModernSelect
                      value={warehouseId}
                      onChange={(val) => setWarehouseId(String(val))}
                      options={[
                        { value: '', label: t('selectWarehouse', 'Select Warehouse...') },
                        ...(warehouses ?? []).map((w: any) => ({
                          value: String(w.id),
                          label: w.name,
                          subtitle: w.code ? `Code: ${w.code}` : undefined,
                        })),
                      ]}
                      placeholder={t('selectWarehouse', 'Select Warehouse...')}
                    />
                  </div>

                  {/* Adjustment Type Segmented Buttons */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-foreground">
                      {t('type', 'Adjustment Type')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Addition */}
                      <button
                        type="button"
                        onClick={() => setType('addition')}
                        className={`py-2.5 px-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-center ${
                          type === 'addition'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-card text-muted-foreground border-border hover:bg-muted/60 hover:text-foreground'
                        }`}
                      >
                        <Plus size={16} className={type === 'addition' ? 'text-emerald-600 dark:text-emerald-400' : ''} />
                        <span className="text-[11px] leading-tight truncate w-full">{t('typeAddition', 'Addition (+)')}</span>
                      </button>

                      {/* Subtraction */}
                      <button
                        type="button"
                        onClick={() => setType('subtraction')}
                        className={`py-2.5 px-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-center ${
                          type === 'subtraction'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/40 ring-2 ring-rose-500/20 shadow-xs'
                            : 'bg-card text-muted-foreground border-border hover:bg-muted/60 hover:text-foreground'
                        }`}
                      >
                        <Minus size={16} className={type === 'subtraction' ? 'text-rose-600 dark:text-rose-400' : ''} />
                        <span className="text-[11px] leading-tight truncate w-full">{t('typeSubtraction', 'Subtraction (-)')}</span>
                      </button>

                      {/* Recount */}
                      <button
                        type="button"
                        onClick={() => setType('recount')}
                        className={`py-2.5 px-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-center ${
                          type === 'recount'
                            ? 'bg-primary/10 text-primary border-primary/40 ring-2 ring-primary/20 shadow-xs'
                            : 'bg-card text-muted-foreground border-border hover:bg-muted/60 hover:text-foreground'
                        }`}
                      >
                        <RotateCcw size={16} className={type === 'recount' ? 'text-primary' : ''} />
                        <span className="text-[11px] leading-tight truncate w-full">{t('typeRecount', 'Recount (Set Qty)')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Reason Input with Quick Suggestions */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-foreground">
                        {t('reason', 'Reason')} <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold">
                        <Sparkles size={11} className="text-primary" />
                        {t('quickSuggestions', 'Quick Suggestions')}
                      </span>
                    </div>

                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                      placeholder={t('reasonPlaceholder', 'e.g. Broken stock, discrepancy...')}
                      className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-muted-foreground/60"
                    />

                    {/* Reason quick click chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {reasonSuggestions.map(s => {
                        const isActive = reason === s.label
                        return (
                          <button
                            key={s.key}
                            type="button"
                            onClick={() => setReason(s.label)}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                              isActive
                                ? 'bg-primary text-white border-primary shadow-2xs font-bold'
                                : 'bg-muted/50 text-muted-foreground border-border/80 hover:border-primary/40 hover:text-foreground hover:bg-muted'
                            }`}
                          >
                            {s.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Notes Textarea */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-bold text-foreground">
                      {t('notes', 'Notes')}
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder={t('notesPlaceholder', 'Detailed explanation...')}
                      className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-medium placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Live Impact Summary Card */}
            <div className="bg-gradient-to-br from-card to-muted/30 border border-border/80 rounded-3xl p-5 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span className="flex items-center gap-1.5">
                  <Layers size={14} className="text-primary" />
                  <span>{t('adjustmentSummary', 'Adjustment Summary')}</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  type === 'addition'
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : type === 'subtraction'
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    : 'bg-primary/10 text-primary border border-primary/20'
                }`}>
                  {type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-card border border-border/60 rounded-2xl">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">
                    {t('totalSKUsLabel', 'Total Items')}
                  </span>
                  <p className="text-lg font-black text-foreground font-mono">
                    {items.filter(i => !!i.product_id).length} <span className="text-xs font-normal text-muted-foreground">SKUs</span>
                  </p>
                </div>

                <div className="p-3 bg-card border border-border/60 rounded-2xl">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-0.5">
                    {t('totalUnitsLabel', 'Total Units')}
                  </span>
                  <p className="text-lg font-black font-mono flex items-center gap-1">
                    <span className={type === 'addition' ? 'text-emerald-600' : type === 'subtraction' ? 'text-rose-500' : 'text-primary'}>
                      {type === 'addition' ? `+${totalAdjustedUnits}` : type === 'subtraction' ? `-${totalAdjustedUnits}` : totalAdjustedUnits}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">Units</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right Column: Smart Item Manager & Matrix Table (8 Cols) ─── */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-card border border-border/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 flex flex-col justify-between min-h-[520px]">
              
              <div className="space-y-4">
                {/* Header with Title and Add Button */}
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
                      <Package size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-foreground">
                          {t('adjustmentItems', 'Adjustment Items')}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-black border border-primary/20">
                          {items.length}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t('adjustItemsInstruction', 'Search products by name or SKU to add to adjustment')}
                      </p>
                    </div>
                  </div>

                  {!isApproved && (
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-3.5 py-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      <Plus size={14} />
                      <span>{t('addItem', 'Add Empty Row')}</span>
                    </button>
                  )}
                </div>

                {/* Fast Product Search & Auto-Add Bar */}
                {!isApproved && (
                  <div ref={searchContainerRef} className="relative z-30">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        placeholder={t('searchProductToAddPlaceholder', 'Search product by name, SKU, or scan barcode to add quickly...')}
                        className="w-full h-11 pl-10 pr-10 rounded-2xl bg-muted/40 border border-border/80 text-xs font-medium text-foreground focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/60 shadow-2xs"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Instant Search Results Dropdown */}
                    <AnimatePresence>
                      {searchFocused && searchResults.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.99 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.99 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden divide-y divide-border/60 max-h-72 overflow-y-auto"
                        >
                          {searchResults.map((prod: any) => {
                            const isAlreadyAdded = items.some(it => String(it.product_id) === String(prod.id))
                            return (
                              <button
                                key={prod.id}
                                type="button"
                                onClick={() => handleAddProductToItems(prod)}
                                className="w-full p-3 flex items-center justify-between text-left hover:bg-muted/50 transition-colors cursor-pointer group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border/80 flex items-center justify-center overflow-hidden shrink-0">
                                    {prod.image ? (
                                      <img src={prod.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <Boxes size={16} className="text-muted-foreground/50" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                      {prod.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                        {prod.sku}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground">
                                        {t('currentStock', 'Current Stock')}: <strong className="text-foreground">{prod.stock ?? prod.stock_quantity ?? 0}</strong> {prod.unit?.symbol || 'pcs'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-2 pl-3">
                                  {isAlreadyAdded ? (
                                    <span className="px-2.5 py-1 text-[10px] font-black text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-1">
                                      <Check size={12} />
                                      {t('alreadyAdded', 'Added (+1)')}
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 text-xs font-bold text-white bg-primary rounded-xl shadow-2xs flex items-center gap-1 group-hover:opacity-90">
                                      <Plus size={13} />
                                      {t('add', 'Add')}
                                    </span>
                                  )}
                                </div>
                              </button>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Items Matrix Table */}
                <div className="overflow-hidden rounded-2xl border border-border/80 shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/80 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted/30">
                          <th className="py-3 px-4">{t('colProductManagement', 'Product Management')}</th>
                          <th className="py-3 px-3 text-center w-28">{t('currentStock', 'Current Stock')}</th>
                          <th className="py-3 px-3 text-center w-44">{t('qty_adjusted', 'Adjust Qty')}</th>
                          <th className="py-3 px-3 text-center w-32">{t('projectedStock', 'New Stock')}</th>
                          {!isApproved && <th className="py-3 px-3 w-12 text-center"></th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-xs font-semibold bg-card">
                        {items.map((item, idx) => {
                          const productObj = products?.find((p: any) => String(p.id) === String(item.product_id)) || item.product
                          const hasProduct = !!productObj
                          const currentStockNum = productObj?.stock ?? productObj?.stock_quantity ?? productObj?.current_stock ?? 0
                          const unitSymbol = productObj?.unit?.symbol || productObj?.unit?.name || 'pcs'
                          
                          // Calculate projected stock
                          const qtyNum = parseFloat(String(item.quantity)) || 0
                          let projectedStockNum = currentStockNum
                          if (type === 'addition') {
                            projectedStockNum = currentStockNum + qtyNum
                          } else if (type === 'subtraction') {
                            projectedStockNum = Math.max(0, currentStockNum - qtyNum)
                          } else {
                            projectedStockNum = qtyNum
                          }

                          return (
                            <tr key={idx} className="hover:bg-muted/20 transition-colors">
                              {/* Product Info / Selector */}
                              <td className="py-3 px-4">
                                {isApproved ? (
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-muted/60 border border-border flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                      {productObj?.image ? (
                                        <img src={productObj.image} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <Boxes size={16} className="text-muted-foreground/60" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <span className="font-bold text-xs text-foreground block truncate">
                                        {productObj?.name || 'Unknown Product'}
                                      </span>
                                      {productObj?.sku && (
                                        <span className="text-[10px] text-muted-foreground font-mono block">
                                          {productObj.sku}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="min-w-[200px]">
                                    <ModernSelect
                                      value={item.product_id}
                                      onChange={(val) => handleItemChange(idx, 'product_id', String(val))}
                                      options={[
                                        { value: '', label: t('selectProduct', 'Select Product...') },
                                        ...(item.product && !(products ?? []).some((p: any) => String(p.id) === String(item.product_id))
                                          ? [{ value: String(item.product.id), label: `${item.product.name} (${item.product.sku})` }]
                                          : []),
                                        ...(products ?? []).map((p: any) => ({
                                          value: String(p.id),
                                          label: p.name,
                                          code: p.sku,
                                          avatar: p.image || undefined,
                                        })),
                                      ]}
                                      placeholder={t('selectProduct', 'Select Product...')}
                                    />
                                  </div>
                                )}
                              </td>

                              {/* Current Stock */}
                              <td className="py-3 px-3 text-center">
                                {hasProduct ? (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-muted/60 border border-border/80 text-xs font-mono font-bold text-foreground shadow-2xs">
                                    {currentStockNum} <span className="text-[10px] text-muted-foreground ml-1 font-sans">{unitSymbol}</span>
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground/60 font-mono">—</span>
                                )}
                              </td>

                              {/* Adjustment Stepper Input */}
                              <td className="py-3 px-3">
                                {isApproved ? (
                                  <div className="text-center font-mono font-black text-xs sm:text-sm text-foreground">
                                    {type === 'addition' ? `+${item.quantity}` : type === 'subtraction' ? `-${item.quantity}` : item.quantity} {unitSymbol}
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center gap-1.5">
                                    <div className="flex items-center rounded-xl bg-card border border-border/90 overflow-hidden shadow-2xs">
                                      <button
                                        type="button"
                                        onClick={() => handleStepQuantity(idx, -1)}
                                        className="px-2.5 py-1.5 hover:bg-muted text-muted-foreground hover:text-foreground font-bold text-sm cursor-pointer transition-colors"
                                      >
                                        -
                                      </button>
                                      <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(idx, 'quantity', Math.max(1, parseFloat(e.target.value) || 1))}
                                        required
                                        className="w-14 text-center text-xs font-black bg-transparent text-foreground outline-none py-1.5 font-mono"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleStepQuantity(idx, 1)}
                                        className="px-2.5 py-1.5 hover:bg-muted text-muted-foreground hover:text-foreground font-bold text-sm cursor-pointer transition-colors"
                                      >
                                        +
                                      </button>
                                    </div>

                                    {/* Quick Pills */}
                                    <div className="flex items-center gap-1">
                                      {[1, 5, 10].map((inc) => (
                                        <button
                                          key={inc}
                                          type="button"
                                          onClick={() => handleSetQuickQuantity(idx, inc)}
                                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md border cursor-pointer transition-all ${
                                            item.quantity === inc
                                              ? 'bg-primary text-white border-primary'
                                              : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted'
                                          }`}
                                        >
                                          {inc}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </td>

                              {/* Projected Resulting Stock */}
                              <td className="py-3 px-3 text-center">
                                {hasProduct ? (
                                  <div className="flex items-center justify-center gap-1.5">
                                    <span className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono border shadow-2xs ${
                                      type === 'addition'
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                        : type === 'subtraction'
                                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                                        : 'bg-primary/10 text-primary border-primary/30'
                                    }`}>
                                      {projectedStockNum} <span className="text-[10px] font-normal">{unitSymbol}</span>
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground/60 font-mono">—</span>
                                )}
                              </td>

                              {/* Delete Item Action */}
                              {!isApproved && (
                                <td className="py-3 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(idx)}
                                    className="p-1.5 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 rounded-xl transition-colors cursor-pointer"
                                    title={t('common.delete', 'Delete')}
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </td>
                              )}
                            </tr>
                          )
                        })}

                        {items.length === 0 && (
                          <tr>
                            <td colSpan={isApproved ? 4 : 5} className="text-center py-12 text-muted-foreground">
                              <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto">
                                <div className="w-14 h-14 rounded-3xl bg-muted/40 border border-border flex items-center justify-center text-muted-foreground/60 shadow-2xs">
                                  <Package size={26} />
                                </div>
                                <div className="space-y-0.5">
                                  <p className="font-bold text-sm text-foreground">
                                    {t('noAdjustmentItemsYet', 'No items added to this adjustment yet')}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {t('useSearchOrAddHint', 'Use the search bar above or click below to add items')}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleAddItem}
                                  className="mt-2 px-4 py-2 text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/20 cursor-pointer shadow-2xs active:scale-95 transition-all"
                                >
                                  + {t('addItem', 'Add Item')}
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Bottom Summary Bar */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-semibold">
                    {t('totalLines', 'Total Line Items')}:
                  </span>
                  <span className="font-mono font-black text-foreground bg-muted px-2 py-0.5 rounded-lg">
                    {items.filter(i => !!i.product_id).length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-semibold">
                    {t('totalUnitsAdjusted', 'Total Units Adjusted')}:
                  </span>
                  <span className={`font-mono text-sm font-black px-3 py-1 rounded-xl border shadow-2xs ${
                    type === 'addition'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : type === 'subtraction'
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      : 'bg-primary/10 text-primary border-primary/20'
                  }`}>
                    {type === 'addition' ? `+${totalAdjustedUnits}` : type === 'subtraction' ? `-${totalAdjustedUnits}` : totalAdjustedUnits} {t('units', 'Units')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Global Form Footer ─── */}
        <FormFooter
          onCancel={handleClose}
          cancelLabel={t('common.cancel', 'Cancel')}
          isEdit={isEdit}
          isSubmitting={saveMutation.isPending}
          showSubmit={!isApproved}
          submitLabel={isEdit ? t('common.saveChanges', 'Save Changes') : t('common.save', 'Save Adjustment')}
          submitIcon={<Save size={14} />}
          onSubmit={handleSubmit}
          showShortcutHint={false}
          extraActions={
            isEdit && !isApproved ? (
              <button
                type="button"
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
                className="h-10 px-5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {approveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                <span>{t('approve', 'Approve')}</span>
              </button>
            ) : undefined
          }
        />
      </form>
    </div>
  )
}

export default StockAdjustmentForm
