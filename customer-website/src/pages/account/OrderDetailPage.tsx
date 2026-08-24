import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSettingsStore } from '@/stores'
import orderService from '@/services/orderService'
import type { Order } from '@/types/store'
import Spinner from '@/components/ui/Spinner'
import OrderStatusBadge from '@/components/ecommerce/OrderStatusBadge'
import { formatDateTime } from '@/lib/utils'

export const OrderDetailPage: React.FC = () => {
  const { number } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const { formatPrice } = useSettingsStore()

  useEffect(() => {
    if (!number) return
    orderService
      .getOrderDetail(number)
      .then((data) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [number])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12 text-slate-500 font-medium">
        Order not found
      </div>
    )
  }

  return (
    <div className="card p-6 space-y-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <Link
            to="/account/orders"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
          </Link>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
            Order #{order.order_number}
          </h2>
        </div>
        <OrderStatusBadge status={order.status} size="md" />
      </div>

      {/* Timeline */}
      {order.timeline && order.timeline.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Order Progress Timeline
          </h4>
          <div className="space-y-2">
            {order.timeline.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white capitalize">
                    {step.status}
                  </div>
                  {step.comment && <div className="text-slate-400">{step.comment}</div>}
                  <div className="text-[10px] text-slate-400">
                    {formatDateTime(step.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Items Ordered
        </h4>
        <div className="space-y-2">
          {order.items?.map((item, idx) => (
            <div
              key={item.id || item.name || idx}
              className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
            >
              <div className="font-medium text-slate-900 dark:text-white">
                {item.name}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-slate-500">Qty: {item.quantity}</div>
                {item.total ? (
                  <div className="font-bold text-slate-900 dark:text-white">
                    {formatPrice(item.total)}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Totals */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-right">
        <div className="text-slate-500">
          Subtotal: <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(order.subtotal || 0)}</span>
        </div>
        {order.discount ? (
          <div className="text-emerald-600 font-semibold">
            Discount: -{formatPrice(order.discount)}
          </div>
        ) : null}
        {order.shipping_fee ? (
          <div className="text-slate-500">
            Shipping: <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(order.shipping_fee)}</span>
          </div>
        ) : null}
        <div className="text-sm font-black text-slate-900 dark:text-white font-display pt-1">
          Grand Total: <span className="text-blue-600 dark:text-blue-400">{formatPrice(order.grand_total ?? order.total ?? 0)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage
