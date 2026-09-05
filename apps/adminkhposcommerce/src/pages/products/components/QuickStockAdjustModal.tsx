import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Warehouse, Plus, Minus, Check, ArrowRight, Loader2, Building2, Tag, Equal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { companyService } from '@/services/companyService'
import { inventoryService } from '@/services/inventoryService'
import { useToast } from '@/hooks/useToast'
import { ModalHeader } from '@/components/common/ModalHeader'
import type { Product } from '../types/productsPage.types'

interface QuickStockAdjustModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  formatCurrency?: (val: number) => string
}

type AdjustType = 'addition' | 'subtraction' | 'set'

export const QuickStockAdjustModal: React.FC<QuickStockAdjustModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { t } = useTranslation(['products', 'inventory', 'common'])
  const qc = useQueryClient()
  const toast = useToast()

  const [adjustType, setAdjustType] = useState<AdjustType>('addition')
  const [quantity, setQuantity] = useState<number>(1)
  const [warehouseId, setWarehouseId] = useState<string>('1')
  const [reason, setReason] = useState<string>('')

  // Set default localized reason when opened
  useEffect(() => {
    if (isOpen) {
      setReason(t('reasonRestock', 'Restock Inventory'))
      setQuantity(1)
      setAdjustType('addition')
    }
  }, [isOpen, t])

  // Fetch warehouses
  const { data: warehousesData } = useQuery({
    queryKey: ['warehouses-select'],
    queryFn: () => companyService.getWarehouses({ per_page: 100 }).then(r => r.data ?? []),
    enabled: isOpen,
  })
  const warehouses = Array.isArray(warehousesData) ? warehousesData : (warehousesData?.data ?? [])

  const currentStock = Number(product?.stock ?? (product as any)?.total_stock ?? 0)
  const unitName = product?.unit?.name || 'Piece'

  // Calculate new projected stock
  const projectedStock = adjustType === 'addition'
    ? currentStock + quantity
    : adjustType === 'subtraction'
    ? Math.max(0, currentStock - quantity)
    : Math.max(0, quantity)

  // Calculate delta display
  const deltaText = adjustType === 'addition'
    ? `+${quantity}`
    : adjustType === 'subtraction'
    ? `-${quantity}`
    : `=${quantity}`

  // Quick reason presets
  const reasonPresets = [
    { key: 'reasonRestock', fallback: 'Restock Inventory' },
    { key: 'reasonCorrection', fallback: 'Audit Correction' },
    { key: 'reasonDamaged', fallback: 'Damaged Goods' },
    { key: 'reasonLoss', fallback: 'Inventory Loss / Shrinkage' },
    { key: 'reasonReturn', fallback: 'Customer Return' },
  ]

  // Submit Mutation
  const mutation = useMutation({
    mutationFn: async () => {
      if (!product) return
      return inventoryService.createAdjustment({
        warehouse_id: warehouseId || '1',
        type: adjustType === 'addition' ? 'addition' : adjustType === 'subtraction' ? 'subtraction' : 'set',
        reason: reason.trim() || t('stockAdjustmentDefaultReason', 'Quick Stock Adjustment'),
        product_id: product.id,
        quantity: quantity,
        auto_approve: true,
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-dashboard-statistics'] })
      qc.invalidateQueries({ queryKey: ['inventory'] })
      toast.success(t('stockAdjustSuccess', 'Stock level adjusted successfully!'))
      onClose()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('stockAdjustFailed', 'Failed to adjust stock level'))
    }
  })

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !product) return null

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="bg-card max-w-lg w-full rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Global Modal Header */}
          <ModalHeader
            title={t('quickStockAdjust', 'Quick Stock Adjustment')}
            subtitle={`${product.name} • SKU: ${product.sku}`}
            icon={<Warehouse size={20} />}
            iconVariant="emerald"
            onClose={onClose}
          />

          {/* Form Body */}
          <div className="p-6 space-y-5 overflow-y-auto text-xs">
            {/* Clean Elevated Stock Comparison Card */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  {t('currentStock', 'Current Stock')}
                </span>
                <p className="text-xl font-black text-foreground tracking-tight">
                  {currentStock} <span className="text-xs font-semibold text-muted-foreground">{unitName}</span>
                </p>
              </div>

              {/* Delta Badge Indicator */}
              <div className="flex flex-col items-center justify-center gap-1">
                <div className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 border shadow-2xs ${
                  adjustType === 'addition'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                    : adjustType === 'subtraction'
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                    : 'bg-primary/10 text-primary border-primary/30'
                }`}>
                  <span>{deltaText}</span>
                  <ArrowRight size={13} />
                </div>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                  {t('projectedStock', 'New Stock Level')}
                </span>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {projectedStock} <span className="text-xs font-semibold text-muted-foreground">{unitName}</span>
                </p>
              </div>
            </div>

            {/* Warehouse Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Building2 size={14} className="text-primary" />
                <span>{t('selectWarehouse', 'Select Warehouse')}</span>
              </label>
              <select
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-card border border-border text-foreground focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all"
              >
                {warehouses.length > 0 ? (
                  warehouses.map((w: any) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.code || `WH-${w.id}`})
                    </option>
                  ))
                ) : (
                  <option value="1">{t('mainWarehouseDefault', 'Main Warehouse')}</option>
                )}
              </select>
            </div>

            {/* Segmented Adjust Action Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">
                {t('adjustAction', 'Adjustment Action')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('addition')}
                  className={`py-2.5 px-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    adjustType === 'addition'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xs'
                      : 'bg-card border-border text-foreground hover:bg-muted'
                  }`}
                >
                  <Plus size={14} />
                  <span>{t('addStock', '+ Add Stock')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustType('subtraction')}
                  className={`py-2.5 px-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    adjustType === 'subtraction'
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500 ring-2 ring-rose-500/20 shadow-2xs'
                      : 'bg-card border-border text-foreground hover:bg-muted'
                  }`}
                >
                  <Minus size={14} />
                  <span>{t('deductStock', '- Deduct Stock')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustType('set')}
                  className={`py-2.5 px-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    adjustType === 'set'
                      ? 'bg-primary/10 text-primary border-primary ring-2 ring-primary/20 shadow-2xs'
                      : 'bg-card border-border text-foreground hover:bg-muted'
                  }`}
                >
                  <Equal size={14} />
                  <span>{t('setStock', '= Set Count')}</span>
                </button>
              </div>
            </div>

            {/* Stepper Input & Quick Quantity Pills */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">
                {t('quantity', 'Quantity')} ({unitName})
              </label>
              <div className="flex items-center gap-2.5">
                {/* Stepper */}
                <div className="flex items-center rounded-xl bg-card border border-border overflow-hidden shrink-0 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 hover:bg-muted text-foreground font-bold text-sm cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    className="w-16 text-center text-xs font-black bg-transparent text-foreground outline-none py-2.5"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2.5 hover:bg-muted text-foreground font-bold text-sm cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Quick Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[1, 5, 10, 50, 100].map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => setQuantity(inc)}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                        quantity === inc
                          ? 'bg-primary text-white border-primary shadow-2xs'
                          : 'bg-card border-border hover:bg-muted text-foreground'
                      }`}
                    >
                      {inc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reason Input with Localized Preset Chips */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Tag size={13} className="text-primary" />
                <span>{t('reason', 'Adjustment Reason')}</span>
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('reasonPlaceholder', 'e.g., Restock, Damaged, Count correction...')}
                className="w-full h-10 px-3.5 rounded-xl bg-card border border-border font-medium text-xs text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {reasonPresets.map((preset) => {
                  const localizedText = t(preset.key, preset.fallback)
                  const isSelected = reason === localizedText
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => setReason(localizedText)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary/10 text-primary border-primary/40 font-bold shadow-2xs'
                          : 'bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60'
                      }`}
                    >
                      {localizedText}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Clean Footer Actions */}
          <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
            >
              {t('common.cancel', 'Cancel')}
            </button>

            <button
              type="button"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="px-5 py-2.5 text-xs font-bold text-white bg-primary rounded-xl hover:opacity-90 shadow-md shadow-primary/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>{t('saving', 'Saving...')}</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>{t('confirmAdjustment', 'Confirm Adjustment')}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}

export default QuickStockAdjustModal
