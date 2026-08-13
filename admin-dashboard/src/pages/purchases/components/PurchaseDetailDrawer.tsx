import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, DollarSign, Landmark, Warehouse as WarehouseIcon } from 'lucide-react'
import { STATUS_BADGE, PAYMENT_BADGE, type Purchase } from '../types/purchase.types'
import { formatCurrency, getDetailDualValues } from '../utils/purchaseCurrency'

interface PurchaseDetailDrawerProps {
  selectedPurchase: Purchase | null
  onClose: () => void
  onOpenReceive: (po: Purchase) => void
  onOpenPayment: () => void
  onOpenCancel: (po: Purchase) => void
}

export const PurchaseDetailDrawer: React.FC<PurchaseDetailDrawerProps> = ({
  selectedPurchase,
  onClose,
  onOpenReceive,
  onOpenPayment,
  onOpenCancel,
}) => {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {selectedPurchase && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end print:bg-white print:backdrop-blur-none print:static print:w-full">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-card w-full max-w-2xl border-l border-border h-full flex flex-col shadow-2xl print:border-none print:shadow-none print:w-full print:h-auto print:static"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border print:hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-lg text-foreground font-mono">
                  PO #{selectedPurchase.reference_number}
                </h3>
                <span className={STATUS_BADGE[selectedPurchase.status]}>
                  {t(`purchases.${selectedPurchase.status}`, selectedPurchase.status)}
                </span>
                <span className={PAYMENT_BADGE[selectedPurchase.payment_status] ?? 'px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800'}>
                  {t(`purchases.${selectedPurchase.payment_status}`, selectedPurchase.payment_status)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-lg hover:bg-muted">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 print:p-0 print:overflow-visible">
              {/* Operations bar */}
              {selectedPurchase.status !== 'cancelled' && (
                <div className="bg-muted/40 p-4 rounded-xl space-y-3.5 border border-border print:hidden">
                  <h4 className="text-sm font-bold text-foreground">{t('purchases.purchaseActions', 'Purchase Actions')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPurchase.status !== 'received' && (
                      <button
                        onClick={() => onOpenReceive(selectedPurchase)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-500 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        <CheckCircle size={13} />
                        {t('purchases.receiveShipment', 'Receive Shipment (GRN)')}
                      </button>
                    )}
                    {selectedPurchase.payment_status !== 'paid' && (
                      <button
                        onClick={onOpenPayment}
                        className="px-3.5 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:opacity-90 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        <DollarSign size={13} />
                        {t('purchases.recordPayment', 'Record Payment')}
                      </button>
                    )}
                    {selectedPurchase.status !== 'received' && selectedPurchase.status !== 'partial' && (
                      <button
                        onClick={() => onOpenCancel(selectedPurchase)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-500 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        {t('purchases.cancelPO', 'Cancel PO')}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Supplier & Warehouse Detail Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2">
                  <div className="flex items-center gap-1 text-muted-foreground text-xs font-bold uppercase">
                    <Landmark size={13} />
                    {t('purchases.supplierInfo', 'Supplier Info')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{selectedPurchase.supplier?.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{selectedPurchase.supplier?.address || 'No Address'}</p>
                    <p className="text-xs text-muted-foreground font-mono">{selectedPurchase.supplier?.email} | {selectedPurchase.supplier?.phone}</p>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2">
                  <div className="flex items-center gap-1 text-muted-foreground text-xs font-bold uppercase">
                    <WarehouseIcon size={13} />
                    {t('purchases.deliveryDestination', 'Delivery Destination')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{selectedPurchase.warehouse?.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{t('purchases.branch', 'Branch')}: {selectedPurchase.branch?.name}</p>
                    <p className="text-xs text-muted-foreground">{t('purchases.date', 'PO Date')}: {new Date(selectedPurchase.date).toLocaleDateString()}</p>
                    {selectedPurchase.due_date && (
                      <p className="text-xs text-muted-foreground">{t('purchases.dueDate', 'Due Date')}: {new Date(selectedPurchase.due_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Detail Table */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider text-xs">{t('purchases.orderedItems', 'Ordered Items')}</h4>
                <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border">
                        <th className="py-3 px-3 font-semibold text-muted-foreground">{t('purchases.product', 'Product')}</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-center">{t('purchases.ordered', 'Ordered')}</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-center">{t('purchases.received', 'Received')}</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-right">{t('purchases.unitCost', 'Unit Cost')}</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-right">{t('purchases.discount', 'Discount')}</th>
                        <th className="py-3 px-3 font-semibold text-muted-foreground text-right">{t('purchases.total', 'Total')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(selectedPurchase.items ?? []).map((item) => (
                        <tr key={item.id} className="hover:bg-muted/5">
                          <td className="py-3.5 px-3">
                            <span className="font-semibold text-foreground text-sm">
                              {item.product_name ?? item.product?.name ?? `Product #${item.product_id}`}
                            </span>
                            {(item.sku ?? item.product?.sku) && (
                              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                {item.sku ?? item.product?.sku}
                              </p>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-center font-medium text-foreground">{item.quantity}</td>
                          <td className="py-3.5 px-3 text-center font-semibold text-green-600 dark:text-green-400">{item.quantity_received}</td>
                          <td className="py-3.5 px-3 text-right text-muted-foreground">{formatCurrency(item.unit_cost, selectedPurchase.currency_code)}</td>
                          <td className="py-3.5 px-3 text-right text-red-500">{formatCurrency(item.discount_amount, selectedPurchase.currency_code)} ({item.discount_percent}%)</td>
                          <td className="py-3.5 px-3 text-right font-bold text-foreground">{formatCurrency(item.total, selectedPurchase.currency_code)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="flex justify-end">
                <div className="w-full md:w-80 bg-card p-5 rounded-xl border border-border space-y-4 text-sm shadow-sm">
                  <h5 className="font-bold border-b border-border pb-2 uppercase tracking-wider text-[11px] text-muted-foreground">{t('purchases.financialSummary', 'Financial Overview')}</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start py-1 border-b border-border/30">
                      <span className="text-muted-foreground text-xs font-medium">{t('purchases.subtotal', 'Subtotal')}</span>
                      <div className="text-right">
                        <span className="font-semibold text-foreground block text-xs">{formatCurrency(getDetailDualValues(selectedPurchase.subtotal, selectedPurchase).usd, 'USD')}</span>
                        <span className="text-[10px] text-muted-foreground block font-mono">{formatCurrency(getDetailDualValues(selectedPurchase.subtotal, selectedPurchase).khr, 'KHR')}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-start py-1 border-b border-border/30">
                      <span className="text-muted-foreground text-xs font-medium">{t('purchases.discount', 'Discount')}</span>
                      <div className="text-right">
                        <span className="font-semibold text-red-500 block text-xs">- {formatCurrency(getDetailDualValues(selectedPurchase.discount_amount, selectedPurchase).usd, 'USD')}</span>
                        <span className="text-[10px] text-red-400 block font-mono">- {formatCurrency(getDetailDualValues(selectedPurchase.discount_amount, selectedPurchase).khr, 'KHR')}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-start py-1 border-b border-border/30">
                      <span className="text-muted-foreground text-xs font-medium">{t('purchases.tax', 'Tax')}</span>
                      <div className="text-right">
                        <span className="font-semibold text-foreground block text-xs">{formatCurrency(getDetailDualValues(selectedPurchase.tax_amount, selectedPurchase).usd, 'USD')}</span>
                        <span className="text-[10px] text-muted-foreground block font-mono">{formatCurrency(getDetailDualValues(selectedPurchase.tax_amount, selectedPurchase).khr, 'KHR')}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-start py-1 border-b border-border/30">
                      <span className="text-muted-foreground text-xs font-medium">{t('purchases.shippingCost', 'Shipping Cost')}</span>
                      <div className="text-right">
                        <span className="font-semibold text-foreground block text-xs">{formatCurrency(getDetailDualValues(selectedPurchase.shipping_cost, selectedPurchase).usd, 'USD')}</span>
                        <span className="text-[10px] text-muted-foreground block font-mono">{formatCurrency(getDetailDualValues(selectedPurchase.shipping_cost, selectedPurchase).khr, 'KHR')}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-foreground font-bold text-xs">{t('purchases.grandTotal', 'Grand Total')}</span>
                      <div className="text-right">
                        <span className="font-extrabold text-blue-600 dark:text-blue-400 block text-sm">{formatCurrency(getDetailDualValues(selectedPurchase.grand_total, selectedPurchase).usd, 'USD')}</span>
                        <span className="text-[10px] text-muted-foreground block font-mono font-medium">{formatCurrency(getDetailDualValues(selectedPurchase.grand_total, selectedPurchase).khr, 'KHR')}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-start py-1.5 border-t border-dashed border-border/60 text-green-600 dark:text-green-400">
                      <span className="text-xs font-medium">{t('purchases.alreadyPaid', 'Paid Amount')}</span>
                      <div className="text-right">
                        <span className="font-semibold block text-xs">{formatCurrency(getDetailDualValues(selectedPurchase.paid_amount, selectedPurchase).usd, 'USD')}</span>
                        <span className="text-[10px] opacity-80 block font-mono">{formatCurrency(getDetailDualValues(selectedPurchase.paid_amount, selectedPurchase).khr, 'KHR')}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-start py-1.5 border-t border-border/40 text-red-600 dark:text-red-400">
                      <span className="text-xs font-bold">{t('purchases.outstandingDue', 'Due Amount')}</span>
                      <div className="text-right">
                        <span className="font-bold block text-xs">{formatCurrency(getDetailDualValues(selectedPurchase.due_amount, selectedPurchase).usd, 'USD')}</span>
                        <span className="text-[10px] opacity-80 block font-mono">{formatCurrency(getDetailDualValues(selectedPurchase.due_amount, selectedPurchase).khr, 'KHR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedPurchase.notes && (
                <div className="p-4 bg-muted/25 rounded-xl border border-border">
                  <h5 className="font-bold text-foreground text-xs uppercase mb-1">{t('purchases.notesTerms', 'Notes / Terms')}</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedPurchase.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
