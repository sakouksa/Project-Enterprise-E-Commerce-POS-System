import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, RotateCcw } from 'lucide-react'

interface ProductFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  statusFilter: string
  setStatusFilter: (val: string) => void
  categoryFilter: string
  setCategoryFilter: (val: string) => void
  brandFilter: string
  setBrandFilter: (val: string) => void
  stockLevelFilter: string
  setStockLevelFilter: (val: string) => void
  priceMinFilter: string
  setPriceMinFilter: (val: string) => void
  priceMaxFilter: string
  setPriceMaxFilter: (val: string) => void
  categories: any[]
  brands: any[]
  onReset: () => void
}

export const ProductFilterDrawer: React.FC<ProductFilterDrawerProps> = ({
  isOpen,
  onClose,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  brandFilter,
  setBrandFilter,
  stockLevelFilter,
  setStockLevelFilter,
  priceMinFilter,
  setPriceMinFilter,
  priceMaxFilter,
  setPriceMaxFilter,
  categories = [],
  brands = [],
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
                <h3 className="font-bold text-base text-foreground">Filter Products Catalog</h3>
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
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Product Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active & Visible</option>
                  <option value="draft">Draft / Hidden</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Brand</label>
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="">All Brands</option>
                  {brands.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Stock Level</label>
                <select
                  value={stockLevelFilter}
                  onChange={(e) => setStockLevelFilter(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="">All Stock Levels</option>
                  <option value="in_stock">In Stock (&gt; 0)</option>
                  <option value="low_stock">Low Stock Warning</option>
                  <option value="out_of_stock">Out of Stock (= 0)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Min Price ($)</label>
                  <input
                    type="number"
                    value={priceMinFilter}
                    onChange={(e) => setPriceMinFilter(e.target.value)}
                    placeholder="0"
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Max Price ($)</label>
                  <input
                    type="number"
                    value={priceMaxFilter}
                    onChange={(e) => setPriceMaxFilter(e.target.value)}
                    placeholder="1000"
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                  />
                </div>
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

export default ProductFilterDrawer
