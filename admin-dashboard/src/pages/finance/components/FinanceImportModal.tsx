import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import { useQueryClient } from '@tanstack/react-query'
import type { TabType } from '../types'

interface FinanceImportModalProps {
  isOpen: boolean
  onClose: () => void
  activeTab: TabType
  importFile: File | null
  setImportFile: (file: File | null) => void
  importing: boolean
  setImporting: (val: boolean) => void
}

export const FinanceImportModal: React.FC<FinanceImportModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  importFile,
  setImportFile,
  importing,
  setImporting,
}) => {
  const { t } = useTranslation(['finance', 'common'])
  const toast = useToast()
  const qc = useQueryClient()

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!importFile) return
    setImporting(true)

    const formData = new FormData()
    formData.append('file', importFile)

    api.post(`/${activeTab}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => {
        setImporting(false)
        toast.success(`Successfully imported ${activeTab} dataset.`)
        qc.invalidateQueries({ queryKey: [activeTab] })
        onClose()
        setImportFile(null)
      })
      .catch((err) => {
        setImporting(false)
        toast.error(err?.response?.data?.message ?? 'Failed to import CSV.')
      })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content max-w-lg w-full p-6 bg-card border border-border rounded-2xl shadow-xl">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Upload size={18} className="text-primary" />
                <span>Import {activeTab.toUpperCase()} CSV</span>
              </h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-muted/20 hover:border-primary/50 transition-colors">
                <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-semibold text-foreground">Upload CSV dataset file</p>
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
                  type="submit"
                  disabled={!importFile || importing}
                  className="btn btn-primary text-xs flex items-center gap-1.5"
                >
                  {importing && <Loader2 size={14} className="animate-spin" />}
                  <span>Execute CSV Import</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default FinanceImportModal
