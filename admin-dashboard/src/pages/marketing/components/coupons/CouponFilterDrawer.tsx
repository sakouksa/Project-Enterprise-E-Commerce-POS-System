import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, RotateCcw } from 'lucide-react'

interface CouponFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filterStatus: string
  setFilterStatus: (val: string) => void
  filterType: string
  setFilterType: (val: string) => void
  filterMinDiscount: string
  setFilterMinDiscount: (val: string) => void
  filterMaxDiscount: string
  setFilterMaxDiscount: (val: string) => void
  filterUsageLimit: string
  setFilterUsageLimit: (val: string) => void
  filterStartDate: string
  setFilterStartDate: (val: string) => void
  filterEndDate: string
  setFilterEndDate: (val: string) => void
  onReset: () => void
}

export const CouponFilterDrawer: React.FC<CouponFilterDrawerProps> = ({
  isOpen,
  onClose,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  filterMinDiscount,
  setFilterMinDiscount,
  filterMaxDiscount,
  setFilterMaxDiscount,
  filterUsageLimit,
  setFilterUsageLimit,
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  onReset,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border shadow-2xl z-50 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between p-5 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-primary" />
                <h3 className="font-bold text-base text-foreground">Filter Coupons & Vouchers</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-card">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Coupon Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active & Usable</option>
                  <option value="inactive">Inactive / Paused</option>
                  <option value="expired">Expired Vouchers</option>
                  <option value="scheduled">Scheduled Future</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Discount Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Min Discount</label>
                  <input
                    type="number"
                    value={filterMinDiscount}
                    onChange={(e) => setFilterMinDiscount(e.target.value)}
                    placeholder="0"
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Max Discount</label>
                  <input
                    type="number"
                    value={filterMaxDiscount}
                    onChange={(e) => setFilterMaxDiscount(e.target.value)}
                    placeholder="100"
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Usage Limit Policy</label>
                <select
                  value={filterUsageLimit}
                  onChange={(e) => setFilterUsageLimit(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="all">All Limits</option>
                  <option value="unlimited">Unlimited Uses</option>
                  <option value="limited">Limited Quantity Uses</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Expires From Date</label>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Expires To Date</label>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl border border-border transition-colors"
              >
                <RotateCcw size={13} />
                <span>Reset Filters</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CouponFilterDrawer
