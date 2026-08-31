import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Megaphone, Copy, CheckCircle2, Clock } from 'lucide-react'
import { formatJsonValue, type Promotion } from '../../types/promotion'
import { CloseButton, CancelButton } from '@/components/common'

interface PromotionDetailDrawerProps {
  promo: Promotion | null
  onClose: () => void
  handleDuplicate: (p: Promotion) => void
  openEditModal: (p: Promotion) => void
}

export const PromotionDetailDrawer: React.FC<PromotionDetailDrawerProps> = ({
  promo,
  onClose,
  handleDuplicate,
  openEditModal,
}) => {
  return (
    <AnimatePresence>
      {promo && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end print:static print:bg-transparent">
          <div className="absolute inset-0 print:hidden" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="bg-card w-full max-w-xl h-full shadow-2xl relative z-10 p-6 flex flex-col justify-between overflow-y-auto print:static print:w-full print:p-0 print:shadow-none"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 print:hidden">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Megaphone size={18} className="text-primary" />
                  <span>Promotion Campaign Details</span>
                </h3>
                <CloseButton onClose={onClose} size="md" color="rose" />
              </div>

              {/* Profile Card Header */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-purple-500/10 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">{promo.type.replace('_', ' ')}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    promo.is_active ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                  }`}>
                    {promo.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-foreground">{promo.name}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{promo.description || 'Enterprise promotional campaign rule.'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b pb-1">Rules & Schedule</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date & Time</p>
                    <p className="font-semibold text-foreground">{promo.starts_at ? new Date(promo.starts_at).toLocaleString() : 'Immediate'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">End Date & Time</p>
                    <p className="font-semibold text-foreground">{promo.ends_at ? new Date(promo.ends_at).toLocaleString() : 'Never'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Priority Weight</p>
                    <p className="font-semibold text-foreground font-mono">{promo.priority}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Orders Generated</p>
                    <p className="font-semibold text-foreground font-mono">{promo.orders_count || 0}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Conditions JSON</label>
                  <pre className="p-3 bg-muted/40 rounded-xl text-[11px] font-mono border border-border overflow-x-auto">
                    {formatJsonValue(promo.conditions)}
                  </pre>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Rewards JSON</label>
                  <pre className="p-3 bg-muted/40 rounded-xl text-[11px] font-mono border border-border overflow-x-auto">
                    {formatJsonValue(promo.rewards)}
                  </pre>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    onClick={() => { onClose(); handleDuplicate(promo); }}
                    className="flex-1 py-2 text-xs font-bold bg-muted hover:bg-muted/80 text-foreground rounded-xl border border-border flex items-center justify-center gap-1.5"
                  >
                    <Copy size={14} />
                    <span>Duplicate Rule</span>
                  </button>
                  <button
                    onClick={() => { onClose(); openEditModal(promo); }}
                    className="flex-1 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:opacity-90 flex items-center justify-center gap-1.5"
                  >
                    <span>Edit Campaign</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-end print:hidden">
              <CancelButton onClick={onClose} label="Close Drawer" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default PromotionDetailDrawer
