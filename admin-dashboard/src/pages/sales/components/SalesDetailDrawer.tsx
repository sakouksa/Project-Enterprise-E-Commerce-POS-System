import React from 'react'
import { X, Receipt, User, ShieldCheck, CornerUpLeft, Loader2, CheckCircle2, Tag, DollarSign, CreditCard, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface SaleItem {
  id:               number
  product_id:       number
  product_name:     string
  sku:              string
  quantity:         number
  unit_price:       number
  discount_amount:  number
  tax_amount:       number
  subtotal:         number
  total:            number
  product?:         { name: string }
}

interface Sale {
  id:              number
  invoice_number:  string
  customer?:       { name: string; phone?: string }
  cashier?:        { name: string }
  date:            string
  created_at:      string
  status:          'pending' | 'completed' | 'cancelled' | 'refunded'
  payment_status?: string
  payment_method?: string
  subtotal:        number
  tax_amount:      number
  discount_amount: number
  grand_total:     number
  paid_amount:     number
  change_amount:   number
  currency_code:   string
  notes?:          string
  items?:          SaleItem[]
}

interface SalesDetailDrawerProps {
  sale: Sale | undefined
  isLoading: boolean
  onClose: () => void
  onRefund: () => void
  isRefunding: boolean
}

export const SalesDetailDrawer: React.FC<SalesDetailDrawerProps> = ({
  sale,
  isLoading,
  onClose,
  onRefund,
  isRefunding,
}) => {
  const { t } = useTranslation('sales')

  // Robust items fallback for different API response keys
  const itemsList: SaleItem[] =
    sale?.items ||
    (sale as any)?.sale_items ||
    (sale as any)?.details ||
    (sale as any)?.saleDetails ||
    []

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
            <CheckCircle2 size={10} /> {t('completed', 'បានបញ្ចប់')}
          </span>
        )
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase">
            <CornerUpLeft size={10} /> {t('refunded', 'បានសងប្រាក់')}
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase">
            {t('cancelled', 'បានបោះបង់')}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
            {t('pending', 'រង់ចាំ')}
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Slide-over Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="relative w-full max-w-lg sm:max-w-xl bg-card border-l border-border shadow-2xl flex flex-col h-full overflow-hidden z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-card/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Receipt size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {t('saleOrderDetail', 'ព័ត៌មានលម្អិតការលក់')}
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono">
                #{sale?.invoice_number || '—'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground font-medium">{t('loadingSaleOrderDetails', 'កំពុងដំណើរការព័ត៌មានលម្អិត...')}</p>
          </div>
        ) : (
          <>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Profile Banner */}
              <div className="bg-muted/20 border border-border/70 rounded-2xl p-4 flex items-start gap-3.5 shadow-2xs">
                <div className="w-11 h-11 rounded-xl bg-card border border-border/80 flex items-center justify-center text-primary shadow-2xs shrink-0">
                  <Receipt size={20} />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-sm font-black text-foreground font-mono tracking-tight">#{sale?.invoice_number}</h3>
                  <p className="text-[11px] text-muted-foreground">
                    {sale?.created_at ? new Date(sale.created_at).toLocaleString() : sale?.date ? new Date(sale.date).toLocaleString() : ''}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {sale?.status && getStatusBadge(sale.status)}
                    {sale?.payment_method && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase font-mono">
                        <CreditCard size={10} /> {sale.payment_method.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                  {t('invoiceNumber', 'លេខវិក្កយបត្រ')} & {t('customer', 'អតិថិជន')}
                </h4>
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs bg-card p-3.5 rounded-2xl border border-border/60">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium mb-0.5">{t('invoiceNumber', 'លេខវិក្កយបត្រ')}</span>
                    <span className="font-mono font-bold text-primary">#{sale?.invoice_number}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium mb-0.5">{t('date', 'កាលបរិច្ឆេទ')}</span>
                    <span className="font-semibold text-foreground">
                      {sale?.created_at ? new Date(sale.created_at).toLocaleDateString() : sale?.date ? new Date(sale.date).toLocaleDateString() : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium mb-0.5">{t('customer', 'អតិថិជន')}</span>
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <User size={12} className="text-muted-foreground" />
                      {sale?.customer?.name || t('walkInCustomer', 'អតិថិជនដើរចូល')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium mb-0.5">{t('cashier', 'អ្នកគិតប្រាក់')}</span>
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <ShieldCheck size={12} className="text-muted-foreground" />
                      {sale?.cashier?.name || t('superAdmin', 'Super Admin')}
                    </span>
                  </div>
                  {sale?.payment_method && (
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium mb-0.5">{t('paymentMethod', 'វិធីទូទាត់')}</span>
                      <span className="font-bold text-foreground uppercase font-mono">{sale.payment_method.replace('_', ' ')}</span>
                    </div>
                  )}
                  {sale?.payment_status && (
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium mb-0.5">{t('paymentStatusLabel', 'ស្ថានភាពការទូទាត់')}</span>
                      <span className="font-bold text-foreground capitalize">{sale.payment_status}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Purchased Items */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                  {t('purchasedItems', 'ទំនិញដែលបានទិញ')} ({itemsList.length})
                </h4>
                <div className="border border-border/70 rounded-2xl overflow-hidden text-xs bg-card">
                  <table className="w-full text-left">
                    <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/60">
                      <tr>
                        <th className="p-3">{t('item', 'ទំនិញ')}</th>
                        <th className="p-3 text-center">{t('qty', 'ចំនួន')}</th>
                        <th className="p-3 text-right">{t('price', 'តម្លៃ')}</th>
                        <th className="p-3 text-right">{t('total', 'សរុប')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {itemsList.map((item, i) => {
                        const name = item.product_name || item.product?.name || (item as any)?.name || 'Product'
                        const qty = item.quantity || (item as any)?.qty || 1
                        const price = item.unit_price || (item as any)?.price || 0
                        const itemTotal = item.total || item.subtotal || (qty * price)

                        return (
                          <tr key={item.id || i} className="hover:bg-muted/20 transition-colors">
                            <td className="p-3">
                              <span className="font-bold text-foreground block">{name}</span>
                              {item.sku && <span className="font-mono text-[10px] text-muted-foreground">{item.sku}</span>}
                            </td>
                            <td className="p-3 text-center font-bold font-mono">{Math.round(Number(qty))}</td>
                            <td className="p-3 text-right font-mono">${Number(price).toFixed(2)}</td>
                            <td className="p-3 text-right font-bold font-mono text-foreground">${Number(itemTotal).toFixed(2)}</td>
                          </tr>
                        )
                      })}
                      {itemsList.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-muted-foreground text-xs font-medium">
                            {t('noSalesOrdersFound', 'រកមិនឃើញទំនិញ')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                  {t('paymentMethods', 'ការទូទាត់')}
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-1">{t('subtotal', 'សរុបរង')}</span>
                    <span className="font-extrabold font-mono text-foreground text-sm">${Number(sale?.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-1">{t('discount', 'បញ្ចុះតម្លៃ')}</span>
                    <span className="font-extrabold font-mono text-rose-500 text-sm">-${Number(sale?.discount_amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-1">{t('tax', 'ពន្ធ')}</span>
                    <span className="font-extrabold font-mono text-foreground text-sm">${Number(sale?.tax_amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <span className="text-[10px] text-primary block font-bold uppercase tracking-wider mb-1">{t('grandTotal', 'សរុបចុងក្រោយ')}</span>
                    <span className="font-black font-mono text-primary text-base">${Number(sale?.grand_total || 0).toFixed(2)}</span>
                  </div>
                  {sale?.paid_amount != null && sale.paid_amount > 0 && (
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold uppercase tracking-wider mb-1">{t('paid', 'បានទូទាត់')}</span>
                      <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400 text-sm">${Number(sale.paid_amount).toFixed(2)}</span>
                    </div>
                  )}
                  {sale?.change_amount != null && sale.change_amount > 0 && (
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                      <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-1">{t('due', 'ប្រាក់អាប់')}</span>
                      <span className="font-extrabold font-mono text-foreground text-sm">${Number(sale.change_amount).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {sale?.notes && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                    {t('note', 'កំណត់ចំណាំ')}
                  </h4>
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/60 flex items-start gap-2">
                    <FileText size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground italic">{sale.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-card/90 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {t('close', 'បិទ')}
              </button>
              {sale?.status !== 'refunded' && sale?.status !== 'cancelled' && (
                <button
                  onClick={onRefund}
                  disabled={isRefunding}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  {isRefunding
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <CornerUpLeft className="w-4 h-4" />
                  }
                  {t('processReturnRefund', 'ដំណើរការការសងប្រាក់')}
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default SalesDetailDrawer
