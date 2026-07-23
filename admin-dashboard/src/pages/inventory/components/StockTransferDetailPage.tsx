import React from 'react'
import { X, ArrowLeftRight, Info, Package, Warehouse, User, Clock, AlertCircle, RefreshCw, Truck, CheckCircle, Edit } from 'lucide-react'
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

interface StockTransferDetailPageProps {
  transferId: number
  onClose: () => void
  onEdit?: () => void
}

export const StockTransferDetailPage: React.FC<StockTransferDetailPageProps> = ({
  transferId,
  onClose,
  onEdit
}) => {
  const { t } = useTranslation()

  const { data: detail, isLoading, isError, refetch } = useQuery({
    queryKey: ['stock-transfer-detail', transferId],
    queryFn: () => api.get(`/stock-transfers/${transferId}`).then(r => r.data.data),
    enabled: !!transferId
  })

  const status = detail?.status || 'draft'
  const isDraft = status === 'draft'
  const isInTransit = status === 'in_transit'
  const isReceived = status === 'received' || status === 'completed'

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
        className="relative w-full max-w-xl bg-card border-l border-border shadow-2xl flex flex-col h-full overflow-hidden z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-card">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <ArrowLeftRight size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {t('inventory.transfer_card', 'Stock Transfer Card')}
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono">
                REF: #{detail?.reference_number || `TRF-${transferId}`}
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
            <p className="text-xs text-muted-foreground font-medium">Loading transfer record...</p>
          </div>
        ) : isError || !detail ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">Failed to load transfer</h3>
              <p className="text-xs text-muted-foreground">The requested stock transfer record could not be retrieved.</p>
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
                  <ArrowLeftRight size={22} />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-foreground truncate">{detail.reference_number || `TRF-${transferId}`}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {detail.from_warehouse?.name || 'Source'} → {detail.to_warehouse?.name || 'Destination'}
                  </p>
                  <div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isReceived ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                      isInTransit ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                      'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
              </div>

              {/* GENERAL INFORMATION */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                  GENERAL INFORMATION
                </h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Source Warehouse</span>
                    <span className="font-bold text-foreground">{detail.from_warehouse?.name || 'Main Warehouse'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Destination Warehouse</span>
                    <span className="font-bold text-foreground">{detail.to_warehouse?.name || 'Branch Warehouse'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Total Line Items</span>
                    <span className="font-bold text-foreground">{detail.items?.length || 0} items</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Created By</span>
                    <span className="font-bold text-foreground">{detail.user?.name || 'Super Admin'}</span>
                  </div>
                </div>
              </div>

              {/* TRANSFER ITEMS BREAKDOWN */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                  TRANSFER ITEMS LEDGER
                </h4>
                <div className="border border-border/70 rounded-xl overflow-hidden bg-card">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="p-3">Product Item</th>
                        <th className="p-3 text-right">Req Qty</th>
                        <th className="p-3 text-right">Rec Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-medium">
                      {(detail.items ?? []).map((item: any) => (
                        <tr key={item.id} className="hover:bg-muted/30">
                          <td className="p-3">
                            <div className="font-bold text-foreground">{item.product?.name || `Product #${item.product_id}`}</div>
                            <div className="font-mono text-[10px] text-muted-foreground">{item.product?.sku || 'SKU-0000'}</div>
                          </td>
                          <td className="p-3 text-right font-bold text-foreground">
                            {Number(item.quantity_requested ?? item.quantity ?? 0)}
                          </td>
                          <td className="p-3 text-right font-bold text-emerald-600">
                            {Number(item.quantity_received ?? 0)}
                          </td>
                        </tr>
                      ))}
                      {(detail.items ?? []).length === 0 && (
                        <tr>
                          <td colSpan={3} className="p-6 text-center text-muted-foreground">
                            No items listed in this transfer.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* REASON / NOTES */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                  REASON & REMARKS
                </h4>
                <p className="text-xs text-foreground bg-muted/30 border border-border/60 rounded-xl p-3.5 italic">
                  "{detail.notes || 'No notes attached to this transfer.'}"
                </p>
              </div>

              {/* TIMESTAMPS */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                  SYSTEM METADATA
                </h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Transfer Created</span>
                    <span className="font-semibold text-foreground">{formatShortDate(detail.created_at)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Last Updated</span>
                    <span className="font-semibold text-foreground">{formatShortDate(detail.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
              {isDraft && onEdit ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onEdit()
                  }}
                  className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <Edit size={14} />
                  Edit Transfer
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
export default StockTransferDetailPage
