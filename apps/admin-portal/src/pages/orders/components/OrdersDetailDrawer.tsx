import React from 'react'
import { X, ShoppingBag, User, Phone, MapPin, Loader2, CheckCircle2, Truck, Clock, PackageCheck, DollarSign, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import StatusBadge from '@/components/common/StatusBadge'

interface OrderItem {
  id:              number
  product_id:      number
  product_name:    string
  sku?:            string
  quantity:        number
  unit_price:      number
  discount_amount: number
  total:           number
  product?:        { name: string }
}

interface Order {
  id:                 number
  order_number:       string
  customer?:          { name: string; phone?: string; email?: string }
  grand_total:        number
  subtotal:           number
  tax_amount:         number
  discount_amount:    number
  shipping_cost:      number
  status:             'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded'
  payment_status:     'unpaid' | 'partial' | 'paid' | 'refunded'
  fulfillment_status: 'unfulfilled' | 'partial' | 'fulfilled'
  shipping_name?:     string
  shipping_phone?:    string
  shipping_address?:  string
  shipping_city?:     string
  shipping_province?: string
  shipping_postal_code?: string
  carrier?:           string
  tracking_number?:   string
  notes?:             string
  created_at:         string
  items?:             OrderItem[]
}

interface OrdersDetailDrawerProps {
  order: Order | undefined
  isLoading: boolean
  onClose: () => void
}

export const OrdersDetailDrawer: React.FC<OrdersDetailDrawerProps> = ({
  order,
  isLoading,
  onClose,
}) => {
  const { t } = useTranslation('orders')

  const getStatusBadge = (st: string) => <StatusBadge status={st} />

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
        className="relative w-full max-w-xl bg-card border-l border-border shadow-2xl flex flex-col h-full overflow-hidden z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-card">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {t('webOrderDetail')}
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono">
                #{order?.order_number || '—'}
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
            <p className="text-xs text-muted-foreground font-medium">{t('orderDetails')}</p>
          </div>
        ) : (
          <>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Profile Banner */}
              <div className="bg-muted/30 border border-border/70 rounded-2xl p-5 flex items-start gap-4 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-card border border-border/80 flex items-center justify-center text-primary shadow-2xs shrink-0">
                  <ShoppingBag size={22} />
                </div>
                <div className="space-y-1.5 min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-foreground font-mono">#{order?.order_number}</h3>
                  <p className="text-xs text-muted-foreground">
                    {order?.created_at ? new Date(order.created_at).toLocaleString() : ''}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {order?.status && getStatusBadge(order.status)}
                    {order?.payment_status && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase">
                        {t(order.payment_status as any) || order.payment_status}
                      </span>
                    )}
                    {order?.fulfillment_status && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 uppercase">
                        {t(order.fulfillment_status as any) || order.fulfillment_status}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                  {t('orderNumber')} & {t('customer')}
                </h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('orderNumber')}</span>
                    <span className="font-mono font-bold text-primary">#{order?.order_number}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('createdDate')}</span>
                    <span className="font-semibold text-foreground">
                      {order?.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('customer')}</span>
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <User size={12} className="text-muted-foreground" />
                      {order?.customer?.name || order?.shipping_name || t('customer')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('contactPhone')}</span>
                    <span className="font-mono font-semibold text-foreground flex items-center gap-1">
                      <Phone size={12} className="text-muted-foreground" />
                      {order?.customer?.phone || order?.shipping_phone || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              {(order?.shipping_address || order?.shipping_city) && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-primary" /> {t('shippingDeliveryAddress')}
                  </h4>
                  <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 text-xs space-y-1">
                    <p className="font-bold text-foreground">{order.shipping_name || order.customer?.name}</p>
                    <p className="text-muted-foreground">
                      {[order.shipping_address, order.shipping_city, order.shipping_province, order.shipping_postal_code].filter(Boolean).join(', ')}
                    </p>
                    {order.carrier && (
                      <p className="text-[11px] text-primary font-medium pt-1">
                        {t('carrierShip')}: {order.carrier} {order.tracking_number ? `(${order.tracking_number})` : ''}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Ordered Items */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                  {t('orderedItems')} ({order?.items?.length || 0})
                </h4>
                <div className="border border-border/60 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/60">
                      <tr>
                        <th className="p-3">{t('productName')}</th>
                        <th className="p-3 text-center">{t('qty')}</th>
                        <th className="p-3 text-right">{t('unitPrice')}</th>
                        <th className="p-3 text-right">{t('total')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {order?.items?.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-3">
                            <span className="font-semibold text-foreground block">{item.product_name || item.product?.name}</span>
                            {item.sku && <span className="font-mono text-[10px] text-muted-foreground">{item.sku}</span>}
                          </td>
                          <td className="p-3 text-center font-bold">{item.quantity}</td>
                          <td className="p-3 text-right">${Number(item.unit_price).toFixed(2)}</td>
                          <td className="p-3 text-right font-bold text-foreground">${Number(item.total || (item.quantity * item.unit_price)).toFixed(2)}</td>
                        </tr>
                      ))}
                      {(!order?.items || order.items.length === 0) && (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-muted-foreground text-xs">
                            {t('noItemsFound', 'គ្មានមុខទំនិញក្នុងកញ្ចប់បញ្ជាទិញទេ')}
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
                  {t('grandTotal')}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-1">{t('subtotal')}</span>
                    <span className="font-extrabold text-foreground">${Number(order?.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-1">{t('shipping')}</span>
                    <span className="font-extrabold text-foreground">${Number(order?.shipping_cost || 0).toFixed(2)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider mb-1">{t('discounts')}</span>
                    <span className="font-extrabold text-rose-500">-${Number(order?.discount_amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <span className="text-[10px] text-primary block font-bold uppercase tracking-wider mb-1">{t('grandTotal')}</span>
                    <span className="font-extrabold text-primary text-base">${Number(order?.grand_total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order?.notes && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                    {t('orderDetails')}
                  </h4>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/60 flex items-start gap-2">
                    <FileText size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground italic">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-end">
              <button
                onClick={onClose}
                className="py-2 px-5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {t('close')}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default OrdersDetailDrawer
