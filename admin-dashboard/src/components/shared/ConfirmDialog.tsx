import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Loader2 } from 'lucide-react'

interface ConfirmDialogProps {
  open:        boolean
  title?:      string
  message?:    string
  confirmText?: string
  cancelText?:  string
  loading?:    boolean
  variant?:    'danger' | 'warning'
  onConfirm:   () => void
  onCancel:    () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title       = 'Confirm Action',
  message     = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText  = 'Cancel',
  loading     = false,
  variant     = 'danger',
  onConfirm,
  onCancel,
}) => {
  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mr-4
                            ${variant === 'danger'
                              ? 'bg-red-100 dark:bg-red-900/30'
                              : 'bg-amber-100 dark:bg-amber-900/30'
                            }`}
              >
                <AlertTriangle
                  size={22}
                  className={variant === 'danger' ? 'text-red-500' : 'text-amber-500'}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-base">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{message}</p>
              </div>
              <button
                onClick={onCancel}
                className="text-muted-foreground hover:text-foreground ml-3 flex-shrink-0 -mt-0.5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 px-6 py-4 border-t border-border bg-muted/30">
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted
                           rounded-lg transition-colors border border-border"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg
                            transition-opacity flex items-center justify-center gap-2
                            disabled:opacity-60
                            ${variant === 'danger'
                              ? 'bg-red-600 hover:bg-red-500'
                              : 'bg-amber-600 hover:bg-amber-500'
                            }`}
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? 'Deleting...' : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default ConfirmDialog
