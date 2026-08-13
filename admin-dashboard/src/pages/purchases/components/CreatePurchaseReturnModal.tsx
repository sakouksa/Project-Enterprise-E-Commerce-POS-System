import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'

interface CreatePurchaseReturnModalProps {
  isOpen: boolean
  onClose: () => void
  purchaseId: string
  setPurchaseId: (val: string) => void
  purchasesData: any[]
  loadingPurchaseDetails: boolean
  returnDate: string
  setReturnDate: (val: string) => void
  status: string
  setStatus: (val: string) => void
  returnItems: any[]
  handleItemQtyChange: (idx: number, val: string) => void
  handleItemNotesChange: (idx: number, val: string) => void
  getReturnTotal: () => number
  reason: string
  setReason: (val: string) => void
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
}

export const CreatePurchaseReturnModal: React.FC<CreatePurchaseReturnModalProps> = ({
  isOpen,
  onClose,
  purchaseId,
  setPurchaseId,
  purchasesData,
  loadingPurchaseDetails,
  returnDate,
  setReturnDate,
  status,
  setStatus,
  returnItems,
  handleItemQtyChange,
  handleItemNotesChange,
  getReturnTotal,
  reason,
  setReason,
  isSubmitting,
  onSubmit,
}) => {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">
                {t('purchases.createPurchaseReturn', 'Create Purchase Return (Goods Out)')}
              </h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1.5">
                  {t('purchases.selectPurchaseOrder', 'Select Purchase Order')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={purchaseId}
                  onChange={(e) => setPurchaseId(e.target.value)}
                  required
                  className="form-select w-full"
                >
                  <option value="">{t('purchases.choosePOToReturn', 'Choose a Purchase Order to return items from...')}</option>
                  {(purchasesData ?? [])
                    .filter((p: any) => p.status === 'received' || p.status === 'completed' || p.status === 'partial' || p.status === 'ordered')
                    .map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.reference_number} — {p.supplier?.name} (Total: ${((p.grand_total || 0) / 4100).toFixed(2)})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-foreground mb-1.5">{t('purchases.returnDate', 'Return Date')} *</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1.5">{t('purchases.status', 'Status')} *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    className="form-select w-full"
                  >
                    <option value="draft">{t('purchases.draft', 'Draft')}</option>
                    <option value="approved">{t('purchases.approved', 'Approved')}</option>
                  </select>
                </div>
              </div>

              {loadingPurchaseDetails && (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="animate-spin text-primary mr-2" size={18} />
                  <span>Loading items from Purchase Order...</span>
                </div>
              )}

              {returnItems.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-foreground">{t('purchases.returnItemsQuantities', 'Return Items Quantities')}</h4>
                  <div className="border border-border rounded-xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border">
                          <th className="py-2.5 px-3 font-semibold text-muted-foreground">{t('purchases.product', 'Product & SKU')}</th>
                          <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center">{t('purchases.ordered', 'Ordered')}</th>
                          <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center">{t('purchases.delivered', 'Delivered')}</th>
                          <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center bg-primary/10 text-primary">{t('purchases.available', 'Available')}</th>
                          <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center w-24">{t('purchases.returnQty', 'Return Qty')}</th>
                          <th className="py-2.5 px-3 font-semibold text-muted-foreground text-right">{t('purchases.unitCost', 'Cost Price')}</th>
                          <th className="py-2.5 px-3 font-semibold text-muted-foreground text-right">{t('purchases.total', 'Total')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {returnItems.map((item, idx) => {
                          const returnQty = parseFloat(item.quantity) || 0
                          const lineTotal = returnQty * item.unit_cost

                          return (
                            <tr key={idx} className="hover:bg-muted/5">
                              <td className="py-2.5 px-3">
                                <span className="font-semibold text-foreground block">{item.product_name}</span>
                                {item.sku && <span className="text-[10px] text-muted-foreground font-mono">SKU: {item.sku}</span>}
                                <input
                                  placeholder="Add notes for item..."
                                  value={item.notes}
                                  onChange={(e) => handleItemNotesChange(idx, e.target.value)}
                                  className="block mt-1 w-full text-[10px] bg-transparent border-0 border-b border-transparent focus:border-border p-0 text-muted-foreground"
                                />
                              </td>
                              <td className="py-2.5 px-3 text-center text-muted-foreground">{item.quantity_ordered}</td>
                              <td className="py-2.5 px-3 text-center text-muted-foreground">{item.quantity_received}</td>
                              <td className="py-2.5 px-3 text-center bg-primary/5 font-bold text-primary">{item.available_to_return}</td>
                              <td className="py-2.5 px-3 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max={item.available_to_return}
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const inputVal = parseFloat(e.target.value) || 0
                                    if (inputVal > item.available_to_return) {
                                      handleItemQtyChange(idx, String(item.available_to_return))
                                    } else {
                                      handleItemQtyChange(idx, e.target.value)
                                    }
                                  }}
                                  className="form-input w-full p-1 text-center text-xs border border-border rounded font-bold"
                                />
                              </td>
                              <td className="py-2.5 px-3 text-right text-muted-foreground">${(item.unit_cost / 4100).toFixed(2)}</td>
                              <td className="py-2.5 px-3 text-right font-bold text-foreground">${(lineTotal / 4100).toFixed(2)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center bg-muted/30 p-3 rounded-xl border border-border">
                    <span className="font-semibold text-foreground">Estimated Return Value:</span>
                    <span className="text-base font-bold text-rose-600">${(getReturnTotal() / 4100).toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-foreground mb-1.5">{t('purchases.reasonForReturn', 'Reason for Return')}</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter return reason (e.g., damaged goods, defective lot, excess delivery)..."
                  rows={3}
                  className="form-input w-full resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-border hover:bg-muted text-foreground rounded-xl font-semibold cursor-pointer"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (!!purchaseId && returnItems.length === 0)}
                  className="px-4 py-2 bg-primary hover:opacity-90 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  <span>{status === 'approved' ? t('purchases.approve', 'Approve & Save') : t('purchases.saveDraft', 'Save Return')}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
