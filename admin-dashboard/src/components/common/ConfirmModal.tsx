import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Info, CheckCircle2, Trash2, X, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export type ConfirmVariant = 'danger' | 'warning' | 'info' | 'success'

export interface ConfirmModalProps {
  isOpen: boolean
  variant?: ConfirmVariant
  title?: string
  subtitle?: string
  message?: React.ReactNode
  itemName?: string
  warningText?: string
  confirmText?: string
  cancelText?: string
  isPending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconContainer: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    button: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20',
  },
  warning: {
    icon: AlertTriangle,
    iconContainer: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    button: 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20',
  },
  info: {
    icon: Info,
    iconContainer: 'bg-primary/10 text-primary border-primary/20',
    button: 'bg-primary hover:opacity-90 text-primary-foreground shadow-md shadow-primary/20',
  },
  success: {
    icon: CheckCircle2,
    iconContainer: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    button: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20',
  },
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  variant = 'danger',
  title,
  subtitle,
  message,
  itemName,
  warningText,
  confirmText,
  cancelText,
  isPending = false,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation(['common'])

  const config = variantConfig[variant] || variantConfig.danger
  const VariantIcon = config.icon

  const displayTitle = title || (variant === 'danger' ? t('deleteConfirm.title', 'លុបទិន្នន័យ') : t('common.confirm', 'បញ្ជាក់'))
  const displayCancel = cancelText || t('common.cancel', 'បោះបង់')
  const displayConfirm = confirmText || (variant === 'danger' ? t('deleteConfirm.delete', 'លុបទិន្នន័យ') : t('common.confirm', 'បញ្ជាក់'))

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="bg-card border border-border/80 rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl border shrink-0 ${config.iconContainer}`}>
                  <VariantIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {displayTitle}
                  </h3>
                  {subtitle && (
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                disabled={isPending}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1.5 rounded-xl hover:bg-muted/70 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-3 py-1">
              {message && (
                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 text-xs text-muted-foreground leading-relaxed">
                  {message}
                </div>
              )}

              {itemName && (
                <p className="text-xs font-bold text-foreground bg-muted/20 p-2.5 rounded-xl border border-border/40">
                  "{itemName}"?
                </p>
              )}

              {warningText && (
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                  <AlertTriangle size={15} className="shrink-0" />
                  <span>{warningText}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={onCancel}
                disabled={isPending}
                className="px-4 py-2.5 rounded-xl border border-border/80 text-xs font-bold hover:bg-muted text-muted-foreground cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                {displayCancel}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isPending}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50 ${config.button}`}
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <VariantIcon size={14} />
                )}
                <span>{displayConfirm}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmModal
