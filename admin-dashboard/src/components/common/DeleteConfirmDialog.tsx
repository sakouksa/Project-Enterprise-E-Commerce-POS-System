import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Archive, Trash2, X, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  title: string
  itemName: string
  warningText?: string
  isPending?: boolean
  onCancel: () => void
  onSoftDelete: () => void
  onArchive?: () => void
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  title,
  itemName,
  warningText,
  isPending = false,
  onCancel,
  onSoftDelete,
  onArchive,
}) => {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card border border-border rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2 text-red-500">
                <ShieldAlert size={20} />
                <h3 className="font-bold text-lg text-foreground">
                  {t('deleteConfirm.title')}
                </h3>
              </div>
              <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-foreground">
                  {t('deleteConfirm.prompt', { title })}
                </p>
                <p className="text-base font-bold text-primary px-3 py-2 bg-muted/30 rounded-lg border border-border">
                  {itemName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('deleteConfirm.warning')}
                </p>
                {warningText && (
                  <p className="text-xs text-amber-500 font-medium bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                    ⚠️ {warningText}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted border border-border rounded-lg transition-colors text-center"
                >
                  {t('deleteConfirm.cancel')}
                </button>

                <button
                  type="button"
                  onClick={onSoftDelete}
                  disabled={isPending}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
                >
                  {isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  {t('deleteConfirm.delete')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default DeleteConfirmDialog
