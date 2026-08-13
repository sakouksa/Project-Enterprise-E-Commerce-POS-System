import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Ticket, Copy, CheckCircle2, Clock } from 'lucide-react'
import type { Coupon } from '../../types/coupon'

interface CouponDetailDrawerProps {
  coupon: Coupon | null
  onClose: () => void
  handleDuplicate: (coupon: Coupon) => void
  openEditModal: (coupon: Coupon) => void
}

export const CouponDetailDrawer: React.FC<CouponDetailDrawerProps> = ({
  coupon,
  onClose,
  handleDuplicate,
  openEditModal,
}) => {
  return (
    <AnimatePresence>
      {coupon && (
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
                  <Ticket size={18} className="text-primary" />
                  <span>Discount Voucher Details</span>
                </h3>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              {/* Coupon Ticket Header */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-purple-500/10 border border-primary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-primary tracking-wider">{coupon.type.replace('_', ' ')}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    coupon.is_active ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                  }`}>
                    {coupon.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-foreground">{coupon.name}</h2>
                  <p className="text-xl font-mono font-bold text-primary tracking-wider mt-1">{coupon.code}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b pb-1">Voucher Value & Constraints</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Discount Value</p>
                    <p className="font-bold text-foreground text-base">
                      {coupon.type === 'percentage' ? `${coupon.value}% OFF` : coupon.type === 'fixed' ? `$${coupon.value} OFF` : 'Free Shipping'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Minimum Spend Requirement</p>
                    <p className="font-semibold text-foreground">${coupon.minimum_amount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Redemptions Used</p>
                    <p className="font-semibold text-foreground">{coupon.used_count || 0} / {coupon.usage_limit || 'Unlimited'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expiration Date</p>
                    <p className="font-semibold text-foreground">{coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'No Expiry'}</p>
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    onClick={() => { onClose(); handleDuplicate(coupon); }}
                    className="flex-1 py-2 text-xs font-bold bg-muted hover:bg-muted/80 text-foreground rounded-xl border border-border flex items-center justify-center gap-1.5"
                  >
                    <Copy size={14} />
                    <span>Duplicate Voucher</span>
                  </button>
                  <button
                    onClick={() => { onClose(); openEditModal(coupon); }}
                    className="flex-1 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:opacity-90 flex items-center justify-center gap-1.5"
                  >
                    <span>Edit Voucher</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-end print:hidden">
              <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-muted hover:bg-muted/80 text-foreground rounded-xl border border-border">
                Close Drawer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CouponDetailDrawer
