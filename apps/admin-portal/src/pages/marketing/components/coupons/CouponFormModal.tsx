import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Loader2 } from 'lucide-react'
import type { Coupon } from '../../types/coupon'

interface CouponFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingCoupon: Coupon | null
  onSubmit: (e: React.FormEvent) => void
  isPending: boolean
  name: string
  setName: (val: string) => void
  code: string
  setCode: (val: string) => void
  type: 'fixed' | 'percentage' | 'free_shipping'
  setType: (val: 'fixed' | 'percentage' | 'free_shipping') => void
  value: number
  setValue: (val: number) => void
  minimumAmount: number | ''
  setMinimumAmount: (val: number | '') => void
  usageLimit: number | ''
  setUsageLimit: (val: number | '') => void
  expiresAt: string
  setExpiresAt: (val: string) => void
  isActive: boolean
  setIsActive: (val: boolean) => void
  generating: boolean
  handleGenerateCode: () => void
}

export const CouponFormModal: React.FC<CouponFormModalProps> = ({
  isOpen,
  onClose,
  editingCoupon,
  onSubmit,
  isPending,
  name,
  setName,
  code,
  setCode,
  type,
  setType,
  value,
  setValue,
  minimumAmount,
  setMinimumAmount,
  usageLimit,
  setUsageLimit,
  expiresAt,
  setExpiresAt,
  isActive,
  setIsActive,
  generating,
  handleGenerateCode,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="modal-content max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {editingCoupon ? 'Edit Discount Voucher' : 'Create New Discount Coupon'}
              </h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="label">Campaign / Voucher Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Summer Sale 20% Off"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="label">Coupon Code *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="SUMMER20"
                    className="input w-full font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    disabled={generating}
                    className="btn btn-secondary text-xs flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {generating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                    <span>Generate</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Discount Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value as any)} className="input w-full">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="label">{type === 'percentage' ? 'Percentage Value (%)' : 'Amount ($)'}</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    placeholder="20"
                    className="input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Min Spend Requirement ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={minimumAmount}
                    onChange={(e) => setMinimumAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0.00"
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="label">Usage Limit (Max Uses)</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="100"
                    className="input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="label">Expiration Date</label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="input w-full"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="checkbox h-4 w-4"
                />
                <label htmlFor="couponActive" className="text-sm font-medium text-foreground cursor-pointer">
                  Activate discount voucher for checkout redemption
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3 mt-4">
                <button type="button" onClick={onClose} className="btn btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn btn-primary text-xs flex items-center gap-1.5">
                  {isPending && <Loader2 size={14} className="animate-spin" />}
                  <span>Save Voucher</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CouponFormModal
