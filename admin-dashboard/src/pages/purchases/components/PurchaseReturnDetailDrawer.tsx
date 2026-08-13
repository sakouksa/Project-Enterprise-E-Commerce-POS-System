import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle } from 'lucide-react'
import { RETURN_STATUS_BADGE, type PurchaseReturn } from '../types/purchaseReturn.types'

interface PurchaseReturnDetailDrawerProps {
  selectedReturn: PurchaseReturn | null
  onClose: () => void
  onOpenApprove: (r: PurchaseReturn) => void
  onOpenCancel: (r: PurchaseReturn) => void
}

export const PurchaseReturnDetailDrawer: React.FC<PurchaseReturnDetailDrawerProps> = ({
  selectedReturn,
  onClose,
  onOpenApprove,
  onOpenCancel,
}) => {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {selectedReturn && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end print:bg-white print:backdrop-blur-none print:static print:w-full">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-card w-full max-w-xl border-l border-border h-full flex flex-col shadow-2xl print:border-none print:shadow-none print:w-full print:h-auto print:static"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border print:hidden">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-foreground font-mono">
                  {t('purchases.returns', 'Return')} #{selectedReturn.reference_number}
                </h3>
                <span className={RETURN_STATUS_BADGE[selectedReturn.status] || 'px-2 py-0.5 rounded text-xs'}>
                  {selectedReturn.status === 'completed' || selectedReturn.status === 'approved'
                    ? t('purchases.approved', 'Approved')
                    : selectedReturn.status === 'cancelled'
                    ? t('purchases.cancelled', 'Cancelled')
                    : t('purchases.draft', 'Draft')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-lg hover:bg-muted">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 print:p-0 print:overflow-visible">
              {/* Operations */}
              {selectedReturn.status === 'draft' && (
                <div className="bg-muted/40 p-4 rounded-xl space-y-3.5 border border-border print:hidden">
                  <h4 className="text-sm font-bold text-foreground">{t('purchases.returnActions', 'Return Actions')}</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onOpenApprove(selectedReturn)}
                      className="px-3.5 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-500 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <CheckCircle size={14} />
                      {t('purchases.approveAndShipReturn', 'Approve & Ship Return')}
                    </button>
                    <button
                      onClick={() => onOpenCancel(selectedReturn)}
                      className="px-3.5 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-500 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      {t('purchases.cancelReturn', 'Cancel Return')}
                    </button>
                  </div>
                </div>
              )}

              {/* Summary Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-1">
                  <span className="text-xs text-muted-foreground font-bold uppercase">{t('purchases.supplierDetails', 'Supplier Details')}</span>
                  <h4 className="text-sm font-bold text-foreground">{selectedReturn.supplier?.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono">{selectedReturn.supplier?.phone}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-1">
                  <span className="text-xs text-muted-foreground font-bold uppercase">{t('purchases.returnDetails', 'Return Details')}</span>
                  <p className="text-xs text-muted-foreground">{t('purchases.purchaseReference', 'Original PO')}: #{selectedReturn.purchase?.reference_number}</p>
                  <p className="text-xs text-muted-foreground">{t('purchases.createdBy', 'Created By')}: {selectedReturn.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{t('common.date', 'Date')}: {new Date(selectedReturn.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Return Items */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider text-xs">{t('purchases.returnedItems', 'Returned Items')}</h4>
                <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border">
                        <th className="py-3 px-3 font-semibold text-muted-foreground">{t('purchases.product', 'Product')}</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-center">{t('purchases.returnQty', 'Returned Qty')}</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-right">{t('purchases.unitCost', 'Unit Cost')}</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-right">{t('purchases.total', 'Total')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedReturn.items?.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/5">
                          <td className="py-3.5 px-3">
                            <span className="font-semibold text-foreground text-sm">{item.product_name || item.variant?.name || 'Returned Product'}</span>
                            {item.sku && <p className="text-[10px] text-muted-foreground font-mono">SKU: {item.sku}</p>}
                            {item.notes && <p className="text-xs text-muted-foreground mt-0.5 font-mono">{item.notes}</p>}
                          </td>
                          <td className="py-3.5 px-3 text-center font-bold text-red-500">{item.quantity}</td>
                          <td className="py-3.5 px-3 text-right text-muted-foreground">${(item.unit_cost / 4100).toFixed(2)}</td>
                          <td className="py-3.5 px-3 text-right font-bold text-foreground">${(item.total / 4100).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Return Totals */}
              <div className="flex justify-end">
                <div className="w-full md:w-72 bg-muted/20 p-4 rounded-xl border border-border space-y-2 text-sm">
                  <div className="flex justify-between font-bold text-base text-foreground">
                    <span>{t('purchases.totalReturnedValue', 'Total Returned Value')}</span>
                    <span className="text-red-600 dark:text-red-400">${(selectedReturn.total_amount / 4100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Reason */}
              {selectedReturn.reason && (
                <div className="p-4 bg-muted/25 rounded-xl border border-border">
                  <h5 className="font-bold text-foreground text-xs uppercase mb-1">{t('purchases.reasonForReturn', 'Reason for Return')}</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedReturn.reason}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
