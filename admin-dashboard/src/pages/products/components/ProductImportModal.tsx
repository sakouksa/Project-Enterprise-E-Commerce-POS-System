import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Loader2 } from 'lucide-react'

interface ProductImportModalProps {
  isOpen: boolean
  onClose: () => void
  importFile: File | null
  setImportFile: (file: File | null) => void
  importing: boolean
  handleImportSubmit: () => void
}

export const ProductImportModal: React.FC<ProductImportModalProps> = ({
  isOpen,
  onClose,
  importFile,
  setImportFile,
  importing,
  handleImportSubmit,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content max-w-lg w-full p-6 bg-card border border-border rounded-2xl shadow-xl">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Upload size={18} className="text-primary" />
                <span>Import Products CSV Catalog</span>
              </h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-muted/20 hover:border-primary/50 transition-colors">
                <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-semibold text-foreground">Click to upload or drag & drop CSV file</p>
                <p className="text-xs text-muted-foreground mt-1">Headers: Name, SKU, Selling Price, Cost Price, Stock</p>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="mt-4 block mx-auto text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t pt-3">
                <button type="button" onClick={onClose} className="btn btn-secondary text-xs">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImportSubmit}
                  disabled={!importFile || importing}
                  className="btn btn-primary text-xs flex items-center gap-1.5"
                >
                  {importing && <Loader2 size={14} className="animate-spin" />}
                  <span>Execute CSV Import</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ProductImportModal
