import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, RotateCcw } from 'lucide-react'

interface ShippingFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filterStatus: string
  setFilterStatus: (val: string) => void
  filterCourier: string
  setFilterCourier: (val: string) => void
  filterProvince: string
  setFilterProvince: (val: string) => void
  filterCity: string
  setFilterCity: (val: string) => void
  filterStartDate: string
  setFilterStartDate: (val: string) => void
  filterEndDate: string
  setFilterEndDate: (val: string) => void
  onReset: () => void
}

export const ShippingFilterDrawer: React.FC<ShippingFilterDrawerProps> = ({
  isOpen,
  onClose,
  filterStatus,
  setFilterStatus,
  filterCourier,
  setFilterCourier,
  filterProvince,
  setFilterProvince,
  filterCity,
  setFilterCity,
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
                <h3 className="font-bold text-base text-foreground">Filter Logistics Records</h3>
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
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Shipment Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending Pickup</option>
                  <option value="shipped">In Transit / Shipped</option>
                  <option value="delivered">Delivered Successfully</option>
                  <option value="failed">Failed Delivery</option>
                  <option value="returned">Returned to Sender</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Courier Carrier</label>
                <select
                  value={filterCourier}
                  onChange={(e) => setFilterCourier(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="all">All Carriers</option>
                  <option value="dhl">DHL Express</option>
                  <option value="fedex">FedEx Priority</option>
                  <option value="ups">UPS Logistics</option>
                  <option value="local_express">Local Express</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Destination Province / State</label>
                <input
                  type="text"
                  value={filterProvince}
                  onChange={(e) => setFilterProvince(e.target.value)}
                  placeholder="e.g. Phnom Penh, California"
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Destination City</label>
                <input
                  type="text"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  placeholder="e.g. Siem Reap, Los Angeles"
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Created From Date</label>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Created To Date</label>
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

export default ShippingFilterDrawer
