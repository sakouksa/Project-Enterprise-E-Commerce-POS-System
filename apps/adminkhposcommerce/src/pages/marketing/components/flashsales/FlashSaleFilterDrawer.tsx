import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sliders, X } from 'lucide-react'
import type { ChannelScope } from '../../types/flashSale'

interface FlashSaleFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filterStatus: string
  setFilterStatus: (val: string) => void
  filterChannel: string
  setFilterChannel: (val: string) => void
  filterCategory: string
  setFilterCategory: (val: string) => void
  filterBrand: string
  setFilterBrand: (val: string) => void
  filterStartDate: string
  setFilterStartDate: (val: string) => void
  filterEndDate: string
  setFilterEndDate: (val: string) => void
  filterMinRevenue: string
  setFilterMinRevenue: (val: string) => void
  filterMaxRevenue: string
  setFilterMaxRevenue: (val: string) => void
  onReset: () => void
}

export const FlashSaleFilterDrawer: React.FC<FlashSaleFilterDrawerProps> = ({
  isOpen,
  onClose,
  filterStatus,
  setFilterStatus,
  filterChannel,
  setFilterChannel,
  filterCategory,
  setFilterCategory,
  filterBrand,
  setFilterBrand,
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  filterMinRevenue,
  setFilterMinRevenue,
  filterMaxRevenue,
  setFilterMaxRevenue,
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
              <h2 className="text-base font-bold text-foreground">Advanced Flash Sale Filters</h2>
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
            {/* Campaign Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Campaign Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'All Status' },
                  { id: 'active', label: 'Active (Live)' },
                  { id: 'scheduled', label: 'Scheduled' },
                  { id: 'expired', label: 'Expired' },
                  { id: 'paused', label: 'Paused' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setFilterStatus(st.id)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl capitalize transition-all border cursor-pointer ${
                      filterStatus === st.id
                        ? 'bg-primary text-white border-primary shadow-2xs'
                        : 'bg-card border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Channel Scope Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Channel Scope
              </label>
              <select
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value)}
                className="form-input w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-xs"
              >
                <option value="all">All Channels (Omni)</option>
                <option value="pos_only">POS Retail Outlets Only</option>
                <option value="storefront_only">E-Commerce Storefront Only</option>
                <option value="app_only">Mobile App Only</option>
              </select>
            </div>

            {/* Product Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="form-input w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-xs"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics & Tech</option>
                <option value="fashion">Apparel & Fashion</option>
                <option value="beauty">Beauty & Cosmetics</option>
                <option value="home">Home & Living</option>
              </select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Brand
              </label>
              <input
                type="text"
                placeholder="e.g. Apple, Sony, Samsung, Nike..."
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="form-input w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-xs"
              />
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-muted-foreground">Start Date</span>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="form-input w-full p-2 rounded-xl border border-border bg-card text-foreground text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground">End Date</span>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="form-input w-full p-2 rounded-xl border border-border bg-card text-foreground text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Revenue Range ($) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Revenue Range ($)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min ($)"
                  value={filterMinRevenue}
                  onChange={(e) => setFilterMinRevenue(e.target.value)}
                  className="form-input w-full p-2 rounded-xl border border-border bg-card text-foreground text-xs"
                />
                <input
                  type="number"
                  placeholder="Max ($)"
                  value={filterMaxRevenue}
                  onChange={(e) => setFilterMaxRevenue(e.target.value)}
                  className="form-input w-full p-2 rounded-xl border border-border bg-card text-foreground text-xs"
                />
              </div>
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
