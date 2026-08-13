import React from 'react'
import { Printer, CheckCircle2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ReceiptData } from '../types'

interface POSReceiptModalProps {
  receipt: ReceiptData | null
  onClose: () => void
}

export const POSReceiptModal: React.FC<POSReceiptModalProps> = ({
  receipt,
  onClose,
}) => {
  const { t } = useTranslation(['pos', 'common'])
  if (!receipt) return null

  const handlePrint = () => {
    window.print()
  }

  const handleShare = (platform: string) => {
    const text = `Invoice ${receipt.order_number} total $${receipt.grand_total.toFixed(2)} from ${receipt.store_name}`
    if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank')
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
    } else {
      alert(`Invoice details sent via ${platform}!`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 my-auto print:shadow-none print:border-none print:bg-white print:text-black">

        {/* Top Header - Screen Only */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3 print:hidden">
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 size={20} />
            <span className="font-extrabold text-sm text-foreground">{t('saleCompleted', 'Sale Completed Successfully')}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        {/* Receipt Container (Formatted for 80mm Thermal & A4 Print) */}
        <div className="bg-white text-gray-900 rounded-2xl p-5 font-sans font-medium text-xs shadow-inner space-y-4 border border-gray-200">
          
          {/* Company Branding */}
          <div className="text-center space-y-1 border-b border-dashed border-gray-300 pb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-1">
              E
            </div>
            <h2 className="font-black text-base uppercase tracking-tight text-gray-900">{receipt.store_name}</h2>
            <p className="text-[10px] text-gray-600 font-sans">{receipt.branch_name} • {receipt.warehouse_name}</p>
            <p className="text-[10px] text-gray-500 font-sans">VAT Reg: VAT-88902194 • Tel: +855 23 999 888</p>
          </div>

          {/* Transaction Metadata */}
          <div className="grid grid-cols-2 gap-1 text-[11px] border-b border-dashed border-gray-300 pb-3">
            <div>
              <span className="text-gray-500 block text-[9px] uppercase">{t('invoiceNo', 'Invoice No:')}</span>
              <span className="font-bold text-gray-900">{receipt.order_number}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-500 block text-[9px] uppercase">{t('dateTime', 'Date & Time:')}</span>
              <span className="font-medium text-gray-900">{receipt.date}</span>
            </div>
            <div className="mt-1">
              <span className="text-gray-500 block text-[9px] uppercase">{t('cashier', 'Cashier:')}</span>
              <span className="font-semibold text-gray-900">{receipt.cashier_name}</span>
            </div>
            <div className="text-right mt-1">
              <span className="text-gray-500 block text-[9px] uppercase">{t('customer', 'Customer:')}</span>
              <span className="font-semibold text-gray-900">{receipt.customer.name}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-2 border-b border-dashed border-gray-300 pb-3">
            <div className="grid grid-cols-12 text-[10px] font-bold uppercase text-gray-500 border-b border-gray-200 pb-1">
              <span className="col-span-6">{t('item', 'Item')}</span>
              <span className="col-span-2 text-center">{t('qty', 'Qty')}</span>
              <span className="col-span-4 text-right">{t('total', 'Total')}</span>
            </div>
            {receipt.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 text-[11px] leading-tight">
                <div className="col-span-6 font-medium text-gray-900">
                  {item.product.name}
                  {item.selectedVariant && <span className="block text-[9px] text-gray-500 font-normal">Var: {item.selectedVariant.sku}</span>}
                  {item.imei && <span className="block text-[9px] text-indigo-600 font-normal">S/N: {item.imei}</span>}
                </div>
                <div className="col-span-2 text-center text-gray-700">{item.quantity}</div>
                <div className="col-span-4 text-right font-bold text-gray-900">${(item.unit_price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-1 text-[11px] pt-1">
            <div className="flex justify-between text-gray-600">
              <span>{t('subtotal', 'Subtotal')}</span>
              <span>${receipt.subtotal.toFixed(2)}</span>
            </div>
            {receipt.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>{t('discount', 'Discount')}</span>
                <span>-${receipt.discount_amount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>{t('vatTax10', 'VAT (10%)')}</span>
              <span>${receipt.tax_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-gray-900 pt-2 border-t border-gray-300">
              <span>{t('grandTotal', 'GRAND TOTAL')}</span>
              <span className="text-indigo-600">${receipt.grand_total.toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-gray-200 grid grid-cols-2 gap-1 text-[10px]">
              <div>
                <span className="text-gray-500 block">{t('paymentMethod', 'Payment Method:')}</span>
                <span className="font-bold text-gray-800 uppercase">{receipt.payment_method}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-500 block">{t('tenderedChange', 'Tendered / Change:')}</span>
                <span className="font-bold text-gray-800">
                  ${receipt.cash_tendered.toFixed(2)} / ${receipt.change_due.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Card / Bank Transfer Payment Details Breakdown for Thermal Print */}
            {receipt.payment_details && (
              <div className="mt-2 pt-2 border-t border-dashed border-gray-300 text-[10px] bg-gray-50 p-2 rounded-lg space-y-0.5">
                {receipt.payment_details.txn_reference ? (
                  <>
                    <div className="flex justify-between font-bold text-gray-800">
                      <span>{t('paymentMethodLabel', 'Payment:')} {t('transfer', 'Transfer')} ({receipt.payment_details.bank_name})</span>
                      {receipt.payment_details.account_number && (
                        <span>{t('accountNoShort', 'Acc:')} {receipt.payment_details.account_number}</span>
                      )}
                    </div>
                    <div className="flex justify-between font-mono text-gray-700">
                      <span>{t('txnReferenceLabel', 'Txn Ref ID:')}</span>
                      <span className="font-bold text-indigo-700">#{receipt.payment_details.txn_reference}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between font-bold text-gray-800">
                      <span>{t('cardBank', 'Bank:')} {receipt.payment_details.bank_name}</span>
                      <span>{t('cardTypeLabel', 'Card:')} {receipt.payment_details.card_type}</span>
                    </div>
                    <div className="flex justify-between font-mono text-gray-700">
                      <span>{t('approvalCode', 'Approval Code:')}</span>
                      <span className="font-bold text-indigo-700">{receipt.payment_details.approval_code}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Barcode Graphic Footer */}
          <div className="text-center pt-2 space-y-1 border-t border-dashed border-gray-300">
            <div className="font-mono text-[9px] tracking-widest text-gray-500 uppercase">||||| | |||||| |||| | |||||</div>
            <p className="text-[9px] text-gray-500 font-sans">{t('thankYou', 'Thank you for shopping with us!')}</p>
            <p className="text-[8px] text-gray-400 font-sans">{t('returnPolicy', 'Returns accepted within 7 days with valid receipt.')}</p>
          </div>
        </div>

        {/* Share & Print Actions - Screen Only */}
        <div className="space-y-2 print:hidden">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="btn-primary py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Printer size={16} /> {t('printReceipt', 'Print Receipt')}
            </button>
            <button
              onClick={onClose}
              className="btn-secondary py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              {t('common.close', 'Close')}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
