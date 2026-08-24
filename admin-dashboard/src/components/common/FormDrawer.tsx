import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormDrawerProps {
  open: boolean
  title: string
  subtitle?: string
  width?: string          // Tailwind max-w class, e.g. 'max-w-lg'
  onClose: () => void
  onSubmit?: (e?: any) => void
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
  isSubmitting?: boolean
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
  submitLabel,
  cancelLabel,
  loading = false,
  isSubmitting,
  children,
  footer,
}) => {
  const { t } = useTranslation(['common'])
  const isBusy = loading || isSubmitting
  const effectiveSubmitLabel = submitLabel || t('save', 'Save Changes')
  const effectiveCancelLabel = cancelLabel || t('cancel', 'Cancel')
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
            className={`fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-card border-l border-border/80 shadow-2xl w-full ${width}`}
          >
            {/* Top Accent Line */}
            <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-purple-500 w-full" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/80 bg-card/80 backdrop-blur-md flex-shrink-0">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                  <span>{title}</span>
                </h2>
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors ml-4 flex-shrink-0 border border-border/60"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {children}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-border/80 bg-muted/20 px-6 py-4 backdrop-blur-md">
              {footer ?? (
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isBusy}
                    className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {effectiveCancelLabel}
                  </button>
                  {onSubmit && (
                    <button
                      type="button"
                      onClick={onSubmit}
                      disabled={isBusy}
                      className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20
                                 hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {isBusy && (
                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                      <span>{effectiveSubmitLabel}</span>
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
