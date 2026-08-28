import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { History, X, FileText, User } from 'lucide-react'

interface ProductAuditLogModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  auditLogs: any[]
  isLoading?: boolean
}

export const ProductAuditLogModal: React.FC<ProductAuditLogModalProps> = ({
  isOpen,
  onClose,
  productName,
  auditLogs,
  isLoading,
}) => {
  const { t } = useTranslation(['products', 'common'])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{t('products.auditLogTitle', 'Product Audit & Activity Log')}</h3>
                  <p className="text-xs text-muted-foreground truncate max-w-[260px]">{productName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
              {isLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading audit logs...</div>
              ) : auditLogs.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <History size={28} className="mx-auto mb-2 opacity-40" />
                  <p>{t('products.noAuditLogs', 'No activity logs found for this item.')}</p>
                </div>
              ) : (
                auditLogs.map((log: any, idx: number) => (
                  <div
                    key={log.id || idx}
                    className="p-3.5 rounded-xl border border-border/80 bg-muted/15 space-y-1.5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground capitalize">
                        {log.action || log.event || 'Product Updated'}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      {log.description || log.notes || 'Catalog attributes modified'}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1">
                      <User size={11} />
                      <span>{log.user?.name || log.causer?.name || 'System Operator'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-semibold text-foreground cursor-pointer transition-colors"
              >
                {t('common.close', 'Close')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
