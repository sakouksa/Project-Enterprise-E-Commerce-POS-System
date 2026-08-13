import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import type { Tab, ImportResult } from '../types'

interface EmployeeImportModalProps {
  isOpen: boolean
  onClose: () => void
  activeTab: Tab
  importFile: File | null
  setImportFile: (file: File | null) => void
  importing: boolean
  importResult: ImportResult | null
  onSubmit: (e: React.FormEvent) => void
}

export const EmployeeImportModal: React.FC<EmployeeImportModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  importFile,
  setImportFile,
  importing,
  importResult,
  onSubmit,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content max-w-lg w-full">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h3 className="text-lg font-bold text-foreground">Import {activeTab} CSV</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-border p-6 rounded-lg text-center bg-muted/20">
                <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-semibold text-foreground">Click to upload or drag & drop CSV file</p>
                <p className="text-xs text-muted-foreground mt-1">Requires headers matching database table schema fields</p>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  required
                  onChange={e => setImportFile(e.target.files?.[0] ?? null)}
                  className="mt-4 mx-auto block text-xs"
                />
              </div>

              {importResult && (
                <div className={`p-3 rounded-lg border text-sm max-h-48 overflow-y-auto ${importResult.errors.length > 0 ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900' : 'bg-green-50 border-green-200 text-green-800'}`}>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {importResult.errors.length > 0 ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                    Import Completed ({importResult.success_count} Imported)
                  </div>
                  {importResult.errors.length > 0 && (
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                      {importResult.errors.map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 border-t pt-3">
                <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                <button type="submit" disabled={importing} className="btn btn-primary flex items-center gap-2">
                  {importing && <Loader2 size={16} className="animate-spin" />}
                  Upload & Process
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default EmployeeImportModal
