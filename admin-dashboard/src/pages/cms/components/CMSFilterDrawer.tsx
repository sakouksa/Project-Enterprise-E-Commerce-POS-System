import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, RotateCcw } from 'lucide-react'

interface CMSFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filterStatus: string
  setFilterStatus: (val: string) => void
  filterAuthor: string
  setFilterAuthor: (val: string) => void
  filterCategory: string
  setFilterCategory: (val: string) => void
  onReset: () => void
}

export const CMSFilterDrawer: React.FC<CMSFilterDrawerProps> = ({
  isOpen,
  onClose,
  filterStatus,
  setFilterStatus,
  filterAuthor,
  setFilterAuthor,
  filterCategory,
  setFilterCategory,
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
                <h3 className="font-bold text-base text-foreground">Filter CMS Content</h3>
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
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Publication Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published Live</option>
                  <option value="draft">Draft / Work in Progress</option>
                  <option value="archived">Archived / Hidden</option>
                  <option value="pending">Pending Editorial Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Author Filter</label>
                <select
                  value={filterAuthor}
                  onChange={(e) => setFilterAuthor(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="all">All Authors</option>
                  <option value="admin">System Admin</option>
                  <option value="editor">Editor Team</option>
                  <option value="guest">Guest Contributor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Content Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="news">Product News</option>
                  <option value="tutorials">Guides & Tutorials</option>
                  <option value="updates">Release Updates</option>
                  <option value="case-studies">Case Studies</option>
                </select>
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

export default CMSFilterDrawer
