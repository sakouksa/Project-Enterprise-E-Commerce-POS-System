import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Truck,
  PackageCheck,
  Plus,
  Minus,
  CheckCircle2,
  RotateCcw,
  Loader2,
  Building2,
  Warehouse as WarehouseIcon,
  Package,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { CloseButton } from '@/components/common'
import type { Purchase } from '../types/purchase.types'

interface ReceiveShipmentModalProps {
  receiveTarget: Purchase | null
  onClose: () => void
  recvQuantities: Record<number, string>
  setRecvQuantities: React.Dispatch<React.SetStateAction<Record<number, string>>>
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
}

export const ReceiveShipmentModal: React.FC<ReceiveShipmentModalProps> = ({
  receiveTarget,
  onClose,
  recvQuantities,
  setRecvQuantities,
  onSubmit,
  isSubmitting
}) => {
  const { t } = useTranslation(['purchases', 'common'])

  const items = useMemo(() => receiveTarget?.items ?? [], [receiveTarget])

  // Calculate totals and progress
  const { totalOrdered, totalReceived, totalRemaining, totalToReceiveNow, activeReceivingItemsCount } = useMemo(() => {
    let ordered = 0
    let received = 0
    let remaining = 0
    let receiveNow = 0
    let activeItems = 0

    items.forEach((item) => {
      const ord = Number(item.quantity) || 0
      const rec = Number(item.quantity_received) || 0
      const rem = Math.max(0, ord - rec)
      const now = parseFloat(recvQuantities[item.id] || '0') || 0
      const validNow = Math.min(now, rem)

      ordered += ord
      received += rec
      remaining += rem
      receiveNow += validNow
      if (validNow > 0) activeItems++
    })

    return {
      totalOrdered: ordered,
      totalReceived: received,
      totalRemaining: remaining,
      totalToReceiveNow: receiveNow,
      activeReceivingItemsCount: activeItems
    }
  }, [items, recvQuantities])

  const currentPercent = totalOrdered > 0 ? Math.min(100, Math.round((totalReceived / totalOrdered) * 100)) : 0
  const afterPercent = totalOrdered > 0 ? Math.min(100, Math.round(((totalReceived + totalToReceiveNow) / totalOrdered) * 100)) : 0
  const willBeFullyReceived = totalOrdered > 0 && (totalReceived + totalToReceiveNow) >= totalOrdered

  const handleFillAllRemaining = () => {
    const nextQuantities: Record<number, string> = {}
    items.forEach((item) => {
      const ord = Number(item.quantity) || 0
      const rec = Number(item.quantity_received) || 0
      const rem = Math.max(0, ord - rec)
      if (rem > 0) {
        nextQuantities[item.id] = rem.toString()
      } else {
        nextQuantities[item.id] = '0'
      }
    })
    setRecvQuantities(nextQuantities)
  }

  const handleResetQuantities = () => {
    const nextQuantities: Record<number, string> = {}
    items.forEach((item) => {
      nextQuantities[item.id] = ''
    })
    setRecvQuantities(nextQuantities)
  }

  const handleStepQuantity = (itemId: number, delta: number, maxAllowed: number) => {
    const current = parseFloat(recvQuantities[itemId] || '0') || 0
    const next = Math.max(0, Math.min(maxAllowed, current + delta))
    setRecvQuantities(prev => ({
      ...prev,
      [itemId]: next === 0 ? '' : next.toString()
    }))
  }

  const handleInputChange = (itemId: number, value: string, maxAllowed: number) => {
    if (value === '') {
      setRecvQuantities(prev => ({ ...prev, [itemId]: '' }))
      return
    }
    const num = parseFloat(value) || 0
    const clamped = Math.max(0, Math.min(maxAllowed, num))
    setRecvQuantities(prev => ({ ...prev, [itemId]: clamped.toString() }))
  }

  if (!receiveTarget) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[80] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card border border-border rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/20">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Truck size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base text-foreground">
                    {t('purchases.receiveShipmentTitle', 'Receive Shipment (GRN)')}
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-muted text-muted-foreground border border-border">
                    PO #{receiveTarget.reference_number}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('purchases.receiveShipmentInstructions', 'Record delivered quantities from supplier. Incremented units will automatically adjust warehouse stock inventory.')}
                </p>
              </div>
            </div>
            <CloseButton onClose={onClose} size="md" color="rose" />
          </div>

          {/* PO Metadata & Progress Banner */}
          <div className="p-5 sm:p-6 bg-muted/10 border-b border-border space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-background border border-border shadow-2xs">
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Building2 size={16} />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('purchases.supplier', 'Supplier')}
                  </span>
                  <span className="font-bold text-foreground truncate block">
                    {receiveTarget.supplier?.name || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-background border border-border shadow-2xs">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <WarehouseIcon size={16} />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('purchases.warehouse', 'Warehouse')}
                  </span>
                  <span className="font-bold text-foreground truncate block">
                    {receiveTarget.warehouse?.name || 'Main Warehouse'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-background border border-border shadow-2xs">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    {t('purchases.date', 'Order Date')}
                  </span>
                  <span className="font-bold font-mono text-foreground truncate block">
                    {receiveTarget.date || '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Receiving Progress */}
            <div className="p-4 rounded-2xl bg-background border border-border shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground font-bold">
                    {t('purchases.receivingProgress', 'Receiving Progress')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    {totalReceived} / {totalOrdered} {t('purchases.quantity', 'units')}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-black font-mono ${
                    currentPercent === 100
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-primary/10 text-primary border border-primary/20'
                  }`}>
                    {currentPercent}%
                  </span>
                </div>
              </div>

              {/* Dual Bar Progress (Current + Staged) */}
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden flex relative">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${currentPercent}%` }}
                />
                {totalToReceiveNow > 0 && (
                  <div
                    className="h-full bg-emerald-400/60 transition-all duration-300 animate-pulse"
                    style={{ width: `${Math.max(0, afterPercent - currentPercent)}%` }}
                  />
                )}
              </div>

              {/* Progress Summary note */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                <span>
                  {t('purchases.remaining', 'Remaining')}: <strong className="text-foreground font-mono">{totalRemaining}</strong>
                </span>
                {totalToReceiveNow > 0 && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles size={12} />
                    <span>+{totalToReceiveNow} {t('purchases.receiveNow', 'staged')}</span>
                    <ArrowRight size={11} />
                    <span>{afterPercent}% {t('purchases.afterStockIn', 'after receive')}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <Package size={14} />
                <span>{items.length} {t('purchases.orderedItems', 'Ordered Items')}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFillAllRemaining}
                  disabled={totalRemaining === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                >
                  <CheckCircle2 size={13} />
                  <span>{t('purchases.receiveAllRemaining', 'Receive All Remaining')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetQuantities}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-xl transition-colors cursor-pointer border border-border shadow-2xs"
                >
                  <RotateCcw size={13} />
                  <span>{t('common.reset', 'Reset')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form and Items Table */}
          <form onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0">
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 max-h-[44vh]">
              <div className="border border-border rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase">
                      <th className="py-3 px-4">{t('purchases.product', 'Product')}</th>
                      <th className="py-3 px-3 text-center w-24">{t('purchases.ordered', 'Ordered')}</th>
                      <th className="py-3 px-3 text-center w-24">{t('purchases.received', 'Received')}</th>
                      <th className="py-3 px-3 text-center w-24">{t('purchases.remaining', 'Remaining')}</th>
                      <th className="py-3 px-4 text-center w-36">{t('purchases.receiveNow', 'Receive Now')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-muted-foreground">
                          {t('purchases.noMatchingProducts', 'No items in this purchase order.')}
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => {
                        const ord = Number(item.quantity) || 0
                        const rec = Number(item.quantity_received) || 0
                        const maxAllowed = Math.max(0, ord - rec)
                        const isFullyReceived = maxAllowed === 0
                        const currentVal = recvQuantities[item.id] || ''

                        return (
                          <tr key={item.id} className="hover:bg-muted/15 transition-colors">
                            {/* Product Info */}
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-foreground block text-xs">
                                {item.product_name ?? item.product?.name ?? `Product #${item.product_id}`}
                              </span>
                              {(item.sku || item.product?.sku || item.variant?.sku) && (
                                <span className="text-[10px] text-muted-foreground font-mono bg-muted/80 px-1.5 py-0.5 rounded mt-0.5 inline-block border border-border/50">
                                  SKU: {item.sku || item.product?.sku || item.variant?.sku}
                                </span>
                              )}
                            </td>

                            {/* Ordered */}
                            <td className="py-3.5 px-3 text-center">
                              <span className="font-mono font-bold text-foreground bg-muted/60 px-2.5 py-1 rounded-lg border border-border/40 inline-block">
                                {ord}
                              </span>
                            </td>

                            {/* Received */}
                            <td className="py-3.5 px-3 text-center">
                              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 inline-block">
                                {rec}
                              </span>
                            </td>

                            {/* Remaining */}
                            <td className="py-3.5 px-3 text-center">
                              <span className={`font-mono font-bold px-2.5 py-1 rounded-lg inline-block ${
                                maxAllowed > 0
                                  ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20'
                                  : 'text-muted-foreground bg-muted/40 border border-border/30'
                              }`}>
                                {maxAllowed}
                              </span>
                            </td>

                            {/* Receive Now Stepper */}
                            <td className="py-3.5 px-4 text-center">
                              {isFullyReceived ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                  <CheckCircle2 size={12} />
                                  {t('purchases.fullyReceived', 'Fully Received')}
                                </span>
                              ) : (
                                <div className="flex items-center justify-center border border-border rounded-xl bg-background overflow-hidden shadow-2xs w-32 mx-auto focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500 transition-all">
                                  <button
                                    type="button"
                                    onClick={() => handleStepQuantity(item.id, -1, maxAllowed)}
                                    className="px-2.5 py-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    title="Decrease quantity"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    max={maxAllowed}
                                    value={currentVal}
                                    placeholder="0"
                                    onChange={(e) => handleInputChange(item.id, e.target.value, maxAllowed)}
                                    className="w-14 text-center text-xs font-bold font-mono bg-transparent border-0 focus:ring-0 p-1 text-foreground"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleStepQuantity(item.id, 1, maxAllowed)}
                                    className="px-2.5 py-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    title="Increase quantity"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Summary & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 border-t border-border bg-muted/20">
              <div className="flex items-center gap-3 text-xs w-full sm:w-auto">
                <div>
                  <span className="text-muted-foreground font-semibold block text-[10px] uppercase tracking-wider">
                    {t('purchases.totalToReceiveNow', 'Total to Receive Now')}:
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                      {totalToReceiveNow} {t('purchases.quantity', 'units')}
                    </span>
                    {totalToReceiveNow > 0 && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        willBeFullyReceived
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      }`}>
                        {willBeFullyReceived
                          ? `✓ ${t('purchases.willBeFullyReceived', 'Will be 100% Received')}`
                          : `⚡ ${t('purchases.willBePartiallyReceived', 'Will be Partially Received')}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || totalToReceiveNow === 0}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <PackageCheck size={15} />
                  )}
                  <span>{t('purchases.recordStockIn', 'Record Stock In')}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ReceiveShipmentModal
