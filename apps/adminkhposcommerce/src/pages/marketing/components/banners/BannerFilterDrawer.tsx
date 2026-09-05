import React from 'react'
import { motion } from 'framer-motion'
import { Sliders, X, Globe, Store, Smartphone } from 'lucide-react'

interface BannerFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  positionFilter: string
  setPositionFilter: (val: string) => void
  statusFilter: string
  setStatusFilter: (val: string) => void
  channelFilter?: string
  setChannelFilter?: (val: string) => void
  onReset: () => void
}

export const BannerFilterDrawer: React.FC<BannerFilterDrawerProps> = ({
  isOpen,
  onClose,
  positionFilter,
  setPositionFilter,
  statusFilter,
  setStatusFilter,
  channelFilter = 'all',
  setChannelFilter,
  onReset,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden print:hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col justify-between"
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">Filter Banners</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Active Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'All Status' },
                  { id: 'active', label: 'Active' },
                  { id: 'inactive', label: 'Inactive' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatusFilter(st.id)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl capitalize transition-all border cursor-pointer ${
                      statusFilter === st.id
                        ? 'bg-primary text-white border-primary shadow-2xs'
                        : 'bg-card border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Placement / Target Screen Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Display Placement & Screen
              </label>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="form-input w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-xs"
              >
                <option value="all">All Placements</option>
                <option value="hero">Storefront Hero Carousel</option>
                <option value="pos_cfd">POS Customer Display (CFD)</option>
                <option value="app_splash">Mobile App Splash & Home</option>
                <option value="sidebar">Sidebar Spotlight</option>
                <option value="popup">Promo Modal Popup</option>
                <option value="footer">Footer Banner</option>
              </select>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onReset}
              className="flex-1 py-2.5 px-4 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BannerFilterDrawer
