import React from 'react'
import { X, Activity, Info, Package, Warehouse, User, Clock, ArrowUpRight, AlertCircle, RefreshCw, FileText } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '@/api/client'
import { useTranslation } from 'react-i18next'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const formatShortDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '—'
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

interface StockMovementDetailPageProps {
  movementId: number
  onClose: () => void
  onOpenProductDetail?: (inventoryId: number) => void
}

export const StockMovementDetailPage: React.FC<StockMovementDetailPageProps> = ({
  movementId,
  onClose,
  onOpenProductDetail
}) => {
  const { t } = useTranslation()

  const { data: detail, isLoading, isError, refetch } = useQuery({
    queryKey: ['stock-movement-detail', movementId],
    queryFn: () => api.get(`/inventory-movements/${movementId}`).then(r => r.data.data),
    enabled: !!movementId
  })

  const qty = Number(detail?.quantity ?? 0)
  const isPlus = qty > 0 || detail?.type === 'in' || detail?.type === 'transfer_in' || detail?.type === 'adjustment'
  const beforeQty = Number(detail?.quantity_before ?? 0)
  const afterQty = Number(detail?.quantity_after ?? 0)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden print:hidden flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Slide Drawer Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="relative w-full max-w-lg bg-card border-l border-border shadow-2xl flex flex-col h-full overflow-hidden z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-card">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Activity size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {t('inventory.movement_card', 'Stock Movement Card')}
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono">
                REF: #{detail?.reference_number || `MOV-${movementId}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3">
            <LoadingSpinner />
            <p className="text-xs text-muted-foreground font-medium">Loading movement record...</p>
          </div>
        ) : isError || !detail ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">Failed to load movement</h3>
              <p className="text-xs text-muted-foreground">The requested stock movement log could not be retrieved.</p>
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Card Banner */}
              <div className="bg-muted/30 border border-border/70 rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-card border border-border/80 flex items-center justify-center text-primary shadow-2xs shrink-0">
                  <Activity size={22} />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-foreground truncate">{detail.product?.name || 'Product'}</h3>
                  <p className="text-xs font-mono text-muted-foreground truncate">{detail.product?.sku || `SKU-${detail.product_id}`}</p>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isPlus ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                    }`}>
                      {detail.type || 'Movement'}
                    </span>
                  </div>
                </div>
              </div>

              {/* MOVEMENT QUANTITY SUMMARY */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                  MOVEMENT QUANTITY & IMPACT
                </h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-1">Before</span>
                    <span className="font-bold text-foreground text-sm">{beforeQty}</span>
                  </div>
                  <div className={`p-3 rounded-xl border text-center ${
                    isPlus ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}>
                    <span className="text-[10px] block font-bold uppercase tracking-wider mb-1">Quantity Change</span>
                    <span className="font-extrabold text-base">{isPlus ? `+${Math.abs(qty)}` : `-${Math.abs(qty)}`}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-1">After</span>
                    <span className="font-bold text-foreground text-sm">{afterQty}</span>
                  </div>
                </div>
              </div>

              {/* GENERAL MOVEMENT DETAILS */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                  GENERAL INFORMATION
                </h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Warehouse Hub</span>
                    <span className="font-bold text-foreground">{detail.warehouse?.name || 'Main Warehouse'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Movement Type</span>
                    <span className="font-bold text-foreground uppercase">{detail.type || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Reference Document</span>
                    <span className="font-mono font-bold text-foreground">{detail.reference_type ? `${detail.reference_type} #${detail.reference_id || ''}` : '—'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Operator / User</span>
                    <span className="font-bold text-foreground">{detail.user?.name || 'System Auto'}</span>
                  </div>
                  {detail.unit_cost && (
                    <div>
                      <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Unit Cost Price</span>
                      <span className="font-bold text-foreground">${Number(detail.unit_cost).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* REASON / NOTES */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                  REASON & REMARKS
                </h4>
                <p className="text-xs text-foreground bg-muted/30 border border-border/60 rounded-xl p-3.5 italic">
                  "{detail.notes || detail.reason || 'No specific notes recorded for this movement.'}"
                </p>
              </div>

              {/* TIMESTAMPS */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                  SYSTEM METADATA
                </h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Logged Date & Time</span>
                    <span className="font-semibold text-foreground">{formatShortDate(detail.created_at)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Record Updated</span>
                    <span className="font-semibold text-foreground">{formatShortDate(detail.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
              {detail.inventory_id && onOpenProductDetail ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onOpenProductDetail(detail.inventory_id)
                  }}
                  className="flex items-center gap-1.5 py-2 px-3 rounded-xl border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <Package size={14} />
                  View Inventory Card
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
export default StockMovementDetailPage
