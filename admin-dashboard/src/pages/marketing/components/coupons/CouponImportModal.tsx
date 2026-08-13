import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Loader2 } from 'lucide-react'

interface CouponImportModalProps {
  isOpen: boolean
  onClose: () => void
  importFile: File | null
  setImportFile: (file: File | null) => void
  handleFileSelectForImport: (file: File) => void
  importPreviewData: { headers: string[]; rows: string[][] } | null
  isImporting: boolean
  handleConfirmImport: () => void
}

export const CouponImportModal: React.FC<CouponImportModalProps> = ({
  isOpen,
  onClose,
  importFile,
  handleFileSelectForImport,
  importPreviewData,
  isImporting,
  handleConfirmImport,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content max-w-lg w-full p-6 bg-card border border-border rounded-2xl shadow-xl">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Upload size={18} className="text-primary" />
                <span>Import Coupons CSV Dataset</span>
              </h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-muted/20 hover:border-primary/50 transition-colors">
                <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-semibold text-foreground">Click to upload or drag & drop CSV file</p>
                <p className="text-xs text-muted-foreground mt-1">File must include headers: Name, Code, Type, Value</p>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => e.target.files?.[0] && handleFileSelectForImport(e.target.files[0])}
                  className="mt-4 block mx-auto text-xs"
                />
              </div>

              {importPreviewData && (
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Dataset Preview (First 5 Rows)</p>
                  <div className="overflow-x-auto border border-border rounded-xl max-h-40 bg-card">
                    <table className="w-full text-[11px]">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          {importPreviewData.headers.map((h, i) => (
                            <th key={i} className="px-2 py-1 text-left font-bold text-muted-foreground">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importPreviewData.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-border/50">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-2 py-1">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 border-t pt-3">
                <button type="button" onClick={onClose} className="btn btn-secondary text-xs">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  disabled={!importFile || isImporting}
                  className="btn btn-primary text-xs flex items-center gap-1.5"
                >
                  {isImporting && <Loader2 size={14} className="animate-spin" />}
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

export default CouponImportModal
