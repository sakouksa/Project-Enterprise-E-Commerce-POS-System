import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import type { Promotion } from '../../types/promotion'

interface PromotionFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingPromo: Promotion | null
  onSubmit: (e: React.FormEvent) => void
  isPending: boolean
  name: string
  setName: (val: string) => void
  description: string
  setDescription: (val: string) => void
  type: string
  setType: (val: string) => void
  conditions: string
  setConditions: (val: string) => void
  rewards: string
  setRewards: (val: string) => void
  startsAt: string
  setStartsAt: (val: string) => void
  endsAt: string
  setEndsAt: (val: string) => void
  priority: string
  setPriority: (val: string) => void
  isActive: boolean
  setIsActive: (val: boolean) => void
}

export const PromotionFormModal: React.FC<PromotionFormModalProps> = ({
  isOpen,
  onClose,
  editingPromo,
  onSubmit,
  isPending,
  name,
  setName,
  description,
  setDescription,
  type,
  setType,
  conditions,
  setConditions,
  rewards,
  setRewards,
  startsAt,
  setStartsAt,
  endsAt,
  setEndsAt,
  priority,
  setPriority,
  isActive,
  setIsActive,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="modal-content max-w-xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {editingPromo ? 'Edit Promotion Campaign' : 'Create New Promotion Campaign'}
              </h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="label">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Black Friday Super Promo"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Campaign description & promotional details..."
                  className="input w-full min-h-[60px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Promotion Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="input w-full">
                    <option value="discount">Direct Discount</option>
                    <option value="buy_x_get_y">Buy X Get Y Free</option>
                    <option value="bundle">Bundle Package</option>
                    <option value="tier_spending">Spend Threshold Bonus</option>
                  </select>
                </div>

                <div>
                  <label className="label">Priority Weight</label>
                  <input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    placeholder="0"
                    className="input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="label">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="input w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="label">Conditions (JSON format)</label>
                <textarea
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder='[{"field": "min_spend", "value": 100}]'
                  className="input w-full font-mono text-xs min-h-[70px]"
                />
              </div>

              <div>
                <label className="label">Rewards (JSON format)</label>
                <textarea
                  value={rewards}
                  onChange={(e) => setRewards(e.target.value)}
                  placeholder='[{"type": "discount", "val": 15}]'
                  className="input w-full font-mono text-xs min-h-[70px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="promoActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="checkbox h-4 w-4"
                />
                <label htmlFor="promoActive" className="text-sm font-medium text-foreground cursor-pointer">
                  Activate promotion rule for live store checkout
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3 mt-4">
                <button type="button" onClick={onClose} className="btn btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn btn-primary text-xs flex items-center gap-1.5">
                  {isPending && <Loader2 size={14} className="animate-spin" />}
                  <span>Save Campaign</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default PromotionFormModal
