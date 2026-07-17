import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormDrawerProps {
  open: boolean
  title: string
  subtitle?: string
  width?: string          // Tailwind max-w class, e.g. 'max-w-lg'
  onClose: () => void
  onSubmit?: () => void
  submitLabel?: string
  loading?: boolean
  children: React.ReactNode
  footer?: React.ReactNode   // override default footer
}

// ─── Component ───────────────────────────────────────────────────────────────

const FormDrawer: React.FC<FormDrawerProps> = ({
  open,
  title,
  subtitle,
  width = 'max-w-xl',
  onClose,
  onSubmit,
  submitLabel = 'Save Changes',
  loading = false,
  children,
  footer,
}) => {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className={`fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-card border-l border-border shadow-2xl w-full ${width}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-border flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-foreground leading-tight">{title}</h2>
                {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-4 flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {children}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-border px-6 py-4">
              {footer ?? (
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  {onSubmit && (
                    <button
                      type="button"
                      onClick={onSubmit}
                      disabled={loading}
                      className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold
                                 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading && (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                      {submitLabel}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FormDrawer
