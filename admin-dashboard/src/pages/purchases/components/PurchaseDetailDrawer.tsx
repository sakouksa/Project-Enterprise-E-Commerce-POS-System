import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, CheckCircle, DollarSign, Warehouse as WarehouseIcon,
  ShoppingCart, Copy, Check, FileText, Ban, PackageCheck,
  Building2, Mail, Phone, MapPin, Package, CreditCard, RotateCcw,
  Printer
} from 'lucide-react'
import { STATUS_BADGE, PAYMENT_BADGE, getDeliveryStatusLabel, getPaymentStatusLabel, type Purchase } from '../types/purchase.types'
import { getDetailDualValues } from '../utils/purchaseCurrency'
import { PurchasePrintVoucher } from './PurchasePrintVoucher'

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
  const navigate = useNavigate()
  const { t } = useTranslation(['purchases', 'common'])
  const [copiedRef, setCopiedRef] = useState(false)

  const copyReference = () => {
    if (!selectedPurchase?.reference_number) return
    navigator.clipboard.writeText(selectedPurchase.reference_number)
    setCopiedRef(true)
    setTimeout(() => setCopiedRef(false), 1500)
  }

  const dualSubtotal = selectedPurchase ? getDetailDualValues(selectedPurchase.subtotal, selectedPurchase) : { usd: 0, khr: 0 }
  const dualDiscount = selectedPurchase ? getDetailDualValues(selectedPurchase.discount_amount, selectedPurchase) : { usd: 0, khr: 0 }
  const dualTax = selectedPurchase ? getDetailDualValues(selectedPurchase.tax_amount, selectedPurchase) : { usd: 0, khr: 0 }
  const dualShipping = selectedPurchase ? getDetailDualValues(selectedPurchase.shipping_cost, selectedPurchase) : { usd: 0, khr: 0 }
  const dualGrandTotal = selectedPurchase ? getDetailDualValues(selectedPurchase.grand_total, selectedPurchase) : { usd: 0, khr: 0 }
  const dualPaid = selectedPurchase ? getDetailDualValues(selectedPurchase.paid_amount, selectedPurchase) : { usd: 0, khr: 0 }
  const dualDue = selectedPurchase ? getDetailDualValues(selectedPurchase.due_amount, selectedPurchase) : { usd: 0, khr: 0 }

  return (
    <AnimatePresence>
      {selectedPurchase && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end print:static print:inset-auto print:overflow-visible print:block print:w-full print:bg-white print:p-0 print:m-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity print:hidden"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 print:hidden">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="w-screen max-w-2xl bg-card border-l border-border shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                    <ShoppingCart size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-foreground">
                        {t('purchases.purchaseDetails', 'Purchase Order Details')}
                      </h3>
                      <button
                        type="button"
                        onClick={copyReference}
                        className="flex items-center gap-1 font-mono text-[11px] font-semibold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 px-2 py-0.5 rounded-md border border-border transition-colors cursor-pointer"
                        title="Copy PO Reference"
                      >
                        <span>#{selectedPurchase.reference_number}</span>
                        {copiedRef ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[11px] text-muted-foreground">
                        {t('purchases.date', 'Date')}: {selectedPurchase.date || '—'}
                      </span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className={STATUS_BADGE[selectedPurchase.status] ?? 'px-2 py-0.5 rounded text-[10px] font-bold bg-muted'}>
                        {getDeliveryStatusLabel(selectedPurchase.status, t)}
                      </span>
                      <span className={PAYMENT_BADGE[selectedPurchase.payment_status] ?? 'px-2 py-0.5 rounded text-[10px] font-bold bg-muted'}>
                        {getPaymentStatusLabel(selectedPurchase.payment_status, t)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Operations Bar */}
                {selectedPurchase.status !== 'cancelled' && (
                  <div className="bg-muted/40 p-3.5 rounded-xl border border-border flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <PackageCheck size={15} className="text-primary" />
                      <span className="text-xs font-bold text-foreground">
                        {t('purchases.purchaseActions', 'Purchase Actions')}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedPurchase.status !== 'received' && (
                        <button
                          type="button"
                          onClick={() => onOpenReceive(selectedPurchase)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <CheckCircle size={13} />
                          <span>{t('purchases.receiveShipment', 'Receive Shipment (GRN)')}</span>
                        </button>
                      )}
                      {selectedPurchase.payment_status !== 'paid' && (
                        <button
                          type="button"
                          onClick={onOpenPayment}
                          className="px-3 py-1.5 bg-primary hover:opacity-90 text-primary-foreground rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <DollarSign size={13} />
                          <span>{t('purchases.recordPayment', 'Record Payment')}</span>
                        </button>
                      )}
                      {selectedPurchase.status !== 'received' && selectedPurchase.status !== 'partial' && (
                        <button
                          type="button"
                          onClick={() => onOpenCancel(selectedPurchase)}
                          className="px-3 py-1.5 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Ban size={13} />
                          <span>{t('purchases.cancelPO', 'Cancel PO')}</span>
                        </button>
                      )}
                      {(selectedPurchase.status === 'received' || selectedPurchase.status === 'partial') && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose()
                            navigate(`/purchases/returns?purchase_id=${selectedPurchase.id}`)
                          }}
                          className="px-3 py-1.5 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <RotateCcw size={13} />
                          <span>{t('purchases.returnToSupplier', 'Return to Supplier')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Supplier & Warehouse Detail Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Supplier Card */}
                  <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      <Building2 size={14} className="text-primary" />
                      <span>{t('purchases.supplierInfo', 'Supplier Info')}</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-foreground">{selectedPurchase.supplier?.name || '—'}</h4>
                      {selectedPurchase.supplier?.address && (
                        <div className="flex items-start gap-1 text-[11px] text-muted-foreground">
                          <MapPin size={12} className="shrink-0 mt-0.5 text-muted-foreground/60" />
                          <span>{selectedPurchase.supplier.address}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 pt-0.5 text-[11px] font-mono text-muted-foreground">
                        {selectedPurchase.supplier?.email && (
                          <div className="flex items-center gap-1">
                            <Mail size={11} className="text-muted-foreground/60" />
                            <span>{selectedPurchase.supplier.email}</span>
                          </div>
                        )}
                        {selectedPurchase.supplier?.phone && (
                          <div className="flex items-center gap-1">
                            <Phone size={11} className="text-muted-foreground/60" />
                            <span>{selectedPurchase.supplier.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Destination Card */}
                  <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      <WarehouseIcon size={14} className="text-primary" />
                      <span>{t('purchases.deliveryDestination', 'Delivery Destination')}</span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <h4 className="text-xs font-bold text-foreground">{selectedPurchase.warehouse?.name || '—'}</h4>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>{t('purchases.branch', 'Branch')}:</span>
                        <span className="font-semibold text-foreground">{selectedPurchase.branch?.name || 'Main Branch'}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>{t('purchases.date', 'PO Date')}:</span>
                        <span className="font-mono text-foreground">{selectedPurchase.date || '—'}</span>
                      </div>
                      {selectedPurchase.due_date && (
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>{t('purchases.dueDate', 'Due Date')}:</span>
                          <span className="font-mono text-foreground">{selectedPurchase.due_date}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Detail Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {t('purchases.orderedItems', 'Ordered Items')}
                    </h4>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {(selectedPurchase.items ?? []).length} {t('purchases.items', 'items')}
                    </span>
                  </div>

                  {(!selectedPurchase.items || selectedPurchase.items.length === 0) ? (
                    <div className="py-6 text-center bg-muted/20 rounded-xl border border-border">
                      <Package size={28} className="mx-auto text-muted-foreground/40 mb-1.5" />
                      <p className="text-xs text-muted-foreground">{t('purchases.noItems', 'No items found in this purchase order.')}</p>
                    </div>
                  ) : (
                    <div className="border border-border rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase">
                            <th className="py-2.5 px-3">{t('purchases.product', 'Product')}</th>
                            <th className="py-2.5 px-2 text-center">{t('purchases.ordered', 'Ordered')}</th>
                            <th className="py-2.5 px-2 text-center">{t('purchases.received', 'Received')}</th>
                            <th className="py-2.5 px-3 text-right">{t('purchases.unitCost', 'Unit Cost')}</th>
                            <th className="py-2.5 px-3 text-right">{t('purchases.discount', 'Discount')}</th>
                            <th className="py-2.5 px-3 text-right">{t('purchases.total', 'Total')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {selectedPurchase.items.map((item) => (
                            <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                              <td className="py-2.5 px-3">
                                <span className="font-semibold text-foreground block text-xs">
                                  {item.product_name ?? item.product?.name ?? `Product #${item.product_id}`}
                                </span>
                                {(item.sku ?? item.product?.sku) && (
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    {item.sku ?? item.product?.sku}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-2 text-center font-semibold text-foreground">{item.quantity}</td>
                              <td className="py-2.5 px-2 text-center">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                  {item.quantity_received}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                                ${Number(item.unit_cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono text-rose-500">
                                {Number(item.discount_amount) > 0 ? `-$${Number(item.discount_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">
                                ${Number(item.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Financial Summary Cards Grid */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40 pb-1.5">
                    <CreditCard size={14} className="text-primary" />
                    <span>{t('purchases.financialSummary', 'Financial Overview')}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Subtotal */}
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                      <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-1">
                        {t('purchases.subtotal', 'Subtotal')}
                      </span>
                      <span className="font-extrabold font-mono text-foreground text-sm">
                        ${Number(dualSubtotal.usd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Discount */}
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                      <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-1">
                        {t('purchases.discount', 'Discount')}
                      </span>
                      <span className="font-extrabold font-mono text-rose-500 text-sm">
                        -${Number(dualDiscount.usd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Tax */}
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                      <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-1">
                        {t('purchases.tax', 'Tax')}
                      </span>
                      <span className="font-extrabold font-mono text-foreground text-sm">
                        +${Number(dualTax.usd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Shipping Cost */}
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                      <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-1">
                        {t('purchases.shippingCost', 'Shipping Cost')}
                      </span>
                      <span className="font-extrabold font-mono text-foreground text-sm">
                        +${Number(dualShipping.usd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Grand Total */}
                    <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 col-span-2 sm:col-span-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-primary block font-bold uppercase tracking-wider mb-0.5">
                          {t('purchases.grandTotal', 'Grand Total')}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {t('purchases.totalPayable', 'Total Payable Amount')}
                        </span>
                      </div>
                      <span className="font-black font-mono text-primary text-lg">
                        ${Number(dualGrandTotal.usd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Paid Amount */}
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 col-span-1 sm:col-span-2">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold uppercase tracking-wider mb-1">
                        {t('purchases.alreadyPaid', 'Paid Amount')}
                      </span>
                      <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                        ${Number(dualPaid.usd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Outstanding Due */}
                    <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 col-span-1 sm:col-span-2">
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 block font-bold uppercase tracking-wider mb-1">
                        {t('purchases.outstandingDue', 'Due Amount')}
                      </span>
                      <span className="font-extrabold font-mono text-rose-600 dark:text-rose-400 text-sm">
                        ${Number(dualDue.usd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                {selectedPurchase.notes && (
                  <div className="p-3.5 bg-muted/20 rounded-xl border border-border space-y-1">
                    <div className="flex items-center gap-1.5 text-foreground font-bold text-xs">
                      <FileText size={13} className="text-primary" />
                      <span>{t('purchases.notesTerms', 'Notes / Terms')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-4">{selectedPurchase.notes}</p>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 text-xs font-bold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-xl border border-border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer size={14} />
                  <span>{t('purchases.printPurchaseOrder', 'Print Purchase Order')}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-foreground bg-card hover:bg-muted rounded-xl border border-border transition-all cursor-pointer"
                >
                  {t('common.close', 'Close')}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Official A4 / Thermal Printable Voucher (Print Only) */}
          <PurchasePrintVoucher purchase={selectedPurchase} />
        </div>
      )}
    </AnimatePresence>
  )
}

export default PurchaseDetailDrawer
