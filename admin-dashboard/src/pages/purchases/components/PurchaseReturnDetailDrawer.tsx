import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, RotateCcw, Copy, Check, Building2, Phone, Calendar, User, Package, FileText, Ban, AlertCircle, Printer } from 'lucide-react'
import { RETURN_STATUS_BADGE, type PurchaseReturn } from '../types/purchaseReturn.types'
import { formatCurrency } from '../utils/purchaseCurrency'
import { PurchaseReturnPrintVoucher } from './PurchaseReturnPrintVoucher'

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
  const { t } = useTranslation(['purchases', 'common'])
  const [copiedRef, setCopiedRef] = useState(false)

  const copyReference = () => {
    if (!selectedReturn?.reference_number) return
    navigator.clipboard.writeText(selectedReturn.reference_number)
    setCopiedRef(true)
    setTimeout(() => setCopiedRef(false), 1500)
  }

  const returnAmountUSD = selectedReturn ? Number(selectedReturn.total_amount || 0) : 0
  const returnAmountKHR = returnAmountUSD * 4100
  const totalUnits = selectedReturn?.items?.reduce((sum, item) => sum + (parseFloat(String(item.quantity)) || 0), 0) || 0

  return (
    <AnimatePresence>
      {selectedReturn && (
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

          {/* Drawer Panel (Screen Only) */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 print:hidden">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="w-screen max-w-xl bg-card border-l border-border shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20 shrink-0">
                    <RotateCcw size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-foreground">
                        {t('purchases.returnDetails', 'Return Details')}
                      </h3>
                      <button
                        type="button"
                        onClick={copyReference}
                        className="flex items-center gap-1 font-mono text-[11px] font-semibold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 px-2 py-0.5 rounded-lg border border-border transition-colors cursor-pointer"
                        title="Copy Reference"
                      >
                        <span>#{selectedReturn.reference_number}</span>
                        {copiedRef ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[11px] text-muted-foreground">
                        {t('common.date', 'Date')}: {selectedReturn.date || (selectedReturn.created_at ? new Date(selectedReturn.created_at).toLocaleDateString() : '—')}
                      </span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className={RETURN_STATUS_BADGE[selectedReturn.status] || 'px-2 py-0.5 rounded text-[10px] font-bold bg-muted'}>
                        {selectedReturn.status === 'completed' || selectedReturn.status === 'approved'
                          ? t('purchases.approved', 'Approved')
                          : selectedReturn.status === 'cancelled'
                          ? t('purchases.cancelled', 'Cancelled')
                          : t('purchases.draft', 'Draft')}
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

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Operations Bar for Draft */}
                {selectedReturn.status === 'draft' && (
                  <div className="bg-muted/40 p-3.5 rounded-2xl border border-border flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <RotateCcw size={14} className="text-orange-500" />
                      <span>{t('purchases.returnActions', 'Return Actions')}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenApprove(selectedReturn)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                      >
                        <CheckCircle size={13} />
                        <span>{t('purchases.approveAndShipReturn', 'Approve & Ship Return')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenCancel(selectedReturn)}
                        className="px-3 py-1.5 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Ban size={13} />
                        <span>{t('purchases.cancelReturn', 'Cancel Return')}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Summary Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Supplier Card */}
                  <div className="bg-muted/30 p-4 rounded-2xl border border-border space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      <Building2 size={14} className="text-primary" />
                      <span>{t('purchases.supplierDetails', 'Supplier Details')}</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-foreground">{selectedReturn.supplier?.name || '—'}</h4>
                      {selectedReturn.supplier?.phone && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                          <Phone size={11} className="text-muted-foreground/60" />
                          <span>{selectedReturn.supplier.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Original PO Card */}
                  <div className="bg-muted/30 p-4 rounded-2xl border border-border space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      <FileText size={14} className="text-primary" />
                      <span>{t('purchases.originalPO', 'Original Purchase Order')}</span>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">{t('purchases.purchaseReference', 'PO Ref')}:</span>{' '}
                        <span className="font-mono text-primary font-semibold">#{selectedReturn.purchase?.reference_number || selectedReturn.purchase_id || '—'}</span>
                      </p>
                      <p>
                        <span className="font-medium text-foreground">{t('purchases.createdBy', 'Created By')}:</span>{' '}
                        <span>{selectedReturn.user?.name || 'Super Admin'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Returned Items */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      <Package size={14} className="text-primary" />
                      <span>{t('purchases.returnedItems', 'Returned Items')}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {selectedReturn.items?.length || 0} {t('purchases.itemsAvailable', 'items')} ({totalUnits} {t('purchases.unitsSelected', 'units')})
                    </span>
                  </div>

                  <div className="border border-border rounded-2xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="py-2.5 px-3.5 font-bold text-muted-foreground text-[11px] uppercase tracking-wider">{t('purchases.product', 'Product')}</th>
                          <th className="py-2.5 px-3 font-bold text-muted-foreground text-[11px] uppercase tracking-wider text-center">{t('purchases.returnQty', 'Returned Qty')}</th>
                          <th className="py-2.5 px-3 font-bold text-muted-foreground text-[11px] uppercase tracking-wider text-right">{t('purchases.unitCost', 'Cost Price')}</th>
                          <th className="py-2.5 px-3.5 font-bold text-muted-foreground text-[11px] uppercase tracking-wider text-right">{t('purchases.total', 'Total')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedReturn.items?.map((item) => {
                          const unitCostUSD = item.unit_cost || 0
                          const unitCostKHR = unitCostUSD * 4100
                          const lineTotalUSD = item.total || 0
                          const lineTotalKHR = lineTotalUSD * 4100

                          return (
                            <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                              <td className="py-3 px-3.5">
                                <div className="flex items-start gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-muted/80 flex items-center justify-center text-muted-foreground shrink-0 border border-border mt-0.5">
                                    <Package size={13} />
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="font-bold text-foreground text-xs block leading-snug">
                                      {item.product_name || item.variant?.name || (item as any).product?.name || 'Returned Product'}
                                    </span>
                                    {item.sku && (
                                      <span className="inline-block px-1.5 py-0.2 rounded bg-muted text-[10px] text-muted-foreground font-mono font-medium border border-border/40">
                                        SKU: {item.sku}
                                      </span>
                                    )}
                                    {item.notes && (
                                      <p className="text-[10px] text-muted-foreground/80 italic mt-0.5 bg-muted/40 px-1.5 py-0.5 rounded border border-border/30 max-w-xs">
                                        {item.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-bold text-xs border border-rose-500/20">
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <span className="font-mono text-xs font-semibold text-foreground block">
                                  {formatCurrency(unitCostUSD, 'USD')}
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground block">
                                  {formatCurrency(unitCostKHR, 'KHR')}
                                </span>
                              </td>
                              <td className="py-3 px-3.5 text-right">
                                <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 block">
                                  {formatCurrency(lineTotalUSD, 'USD')}
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground block">
                                  {formatCurrency(lineTotalKHR, 'KHR')}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Return Totals */}
                <div className="flex justify-end">
                  <div className="w-full sm:w-80 bg-gradient-to-br from-card to-rose-500/5 p-4 rounded-2xl border border-rose-500/20 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-bold text-foreground">
                      <span>{t('purchases.totalReturnedValue', 'Total Returned Value')}</span>
                      <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                        {formatCurrency(returnAmountUSD, 'USD')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-muted-foreground font-mono pt-1 border-t border-border/40">
                      <span>{totalUnits} {t('purchases.unitsSelected', 'units')}</span>
                      <span>{formatCurrency(returnAmountKHR, 'KHR')}</span>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                {selectedReturn.reason && (
                  <div className="p-4 bg-muted/30 rounded-2xl border border-border space-y-1.5">
                    <h5 className="font-bold text-foreground text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle size={13} className="text-primary" />
                      <span>{t('purchases.reasonForReturn', 'Reason for Return')}</span>
                    </h5>
                    <p className="text-xs text-foreground/80 leading-relaxed pl-5">{selectedReturn.reason}</p>
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
                  <span>{t('purchases.printDebitNote', 'Print Debit Note')}</span>
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
          <PurchaseReturnPrintVoucher returnData={selectedReturn} />
        </div>
      )}
    </AnimatePresence>
  )
}
