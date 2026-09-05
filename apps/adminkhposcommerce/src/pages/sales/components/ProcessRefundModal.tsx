import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CornerUpLeft, Loader2, AlertCircle, DollarSign, CreditCard, FileText, Wrench, Package, RotateCcw, Banknote, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ProcessRefundModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (payload: { reason: string; refund_method: string }) => void
  isPending: boolean
  sale: any
}

export const ProcessRefundModal: React.FC<ProcessRefundModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  sale,
}) => {
  const { t } = useTranslation('sales')

  const [reasonPreset, setReasonPreset] = useState<string>('defective')
  const [customReason, setCustomReason] = useState<string>('')
  const [refundMethod, setRefundMethod] = useState<string>('cash')

  if (!isOpen || !sale) return null

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let finalReason = ''
    switch (reasonPreset) {
      case 'defective':
        finalReason = t('reasonDefective', 'Defective Product')
        break
      case 'wrong_item':
        finalReason = t('reasonWrongItem', 'Wrong Item Delivered')
        break
      case 'changed_mind':
        finalReason = t('reasonChangedMind', 'Customer Changed Mind')
        break
      default:
        finalReason = customReason || t('reasonOther', 'General Refund')
    }

    if (reasonPreset === 'other' && customReason) {
      finalReason = customReason
    }

    onConfirm({
      reason: finalReason,
      refund_method: refundMethod,
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/80 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <CornerUpLeft size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-foreground">
                  {t('processReturnRefund', 'Process Return & Refund')}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  #{sale.invoice_number}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
            {/* Refund Alert Banner */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-amber-700 dark:text-amber-300 block">
                  {t('refundWarningTitle', 'Refund & Inventory Restock Warning')}
                </span>
                <p className="text-amber-600/90 dark:text-amber-400/90 leading-relaxed">
                  {t('refundWarningDesc', 'Items in this invoice will be returned to inventory stock automatically and order status will be updated to Refunded.')}
                </p>
              </div>
            </div>

            {/* Invoice Financial Summary */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-0.5">{t('grandTotal', 'Grand Total')}</span>
                <span className="text-sm font-black font-mono text-primary">${Number(sale.grand_total || 0).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-0.5">{t('paid', 'Paid')}</span>
                <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">${Number(sale.paid_amount || sale.grand_total || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Reason Selection */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
                {t('refundReason', 'Refund Reason')} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setReasonPreset('defective')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer font-medium flex items-center gap-2 ${
                    reasonPreset === 'defective'
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                      : 'border-border/70 bg-card hover:bg-muted/40 text-foreground'
                  }`}
                >
                  <Wrench size={16} className="shrink-0 text-rose-500" />
                  <span>{t('reasonDefective', 'Defective Product')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReasonPreset('wrong_item')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer font-medium flex items-center gap-2 ${
                    reasonPreset === 'wrong_item'
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                      : 'border-border/70 bg-card hover:bg-muted/40 text-foreground'
                  }`}
                >
                  <Package size={16} className="shrink-0 text-amber-500" />
                  <span>{t('reasonWrongItem', 'Wrong Item Delivered')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReasonPreset('changed_mind')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer font-medium flex items-center gap-2 ${
                    reasonPreset === 'changed_mind'
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                      : 'border-border/70 bg-card hover:bg-muted/40 text-foreground'
                  }`}
                >
                  <RotateCcw size={16} className="shrink-0 text-blue-500" />
                  <span>{t('reasonChangedMind', 'Customer Changed Mind')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReasonPreset('other')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer font-medium flex items-center gap-2 ${
                    reasonPreset === 'other'
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                      : 'border-border/70 bg-card hover:bg-muted/40 text-foreground'
                  }`}
                >
                  <FileText size={16} className="shrink-0 text-purple-500" />
                  <span>{t('reasonOther', 'Other Reasons')}</span>
                </button>
              </div>

              {reasonPreset === 'other' && (
                <div className="pt-2">
                  <input
                    type="text"
                    required
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder={t('enterCustomReason', 'Enter specific refund reason...')}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              )}
            </div>

            {/* Refund Payment Method */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
                {t('refundMethod', 'Refund Payment Method')}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setRefundMethod('cash')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer font-bold flex items-center justify-center gap-2 ${
                    refundMethod === 'cash'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                      : 'border-border/70 bg-card hover:bg-muted/40 text-foreground'
                  }`}
                >
                  <Banknote size={16} className="shrink-0" />
                  <span>{t('cash', 'Cash')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRefundMethod('original_payment')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer font-bold flex items-center justify-center gap-2 ${
                    refundMethod === 'original_payment'
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'border-border/70 bg-card hover:bg-muted/40 text-foreground'
                  }`}
                >
                  <CreditCard size={16} className="shrink-0" />
                  <span>{t('originalPayment', 'Original Payment')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRefundMethod('store_credit')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer font-bold flex items-center justify-center gap-2 ${
                    refundMethod === 'store_credit'
                      ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-2xs'
                      : 'border-border/70 bg-card hover:bg-muted/40 text-foreground'
                  }`}
                >
                  <Wallet size={16} className="shrink-0" />
                  <span>{t('storeCredit', 'Store Credit')}</span>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {t('cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-500 active:scale-95 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('processingRefund', 'Processing Refund...')}</span>
                  </>
                ) : (
                  <>
                    <CornerUpLeft className="w-4 h-4" />
                    <span>{t('confirmRefund', 'Confirm Refund')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ProcessRefundModal
