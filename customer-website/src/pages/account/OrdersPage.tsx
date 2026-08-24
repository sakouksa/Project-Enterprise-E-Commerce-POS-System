import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useSettingsStore } from '@/stores'
import orderService from '@/services/orderService'
import type { Order } from '@/types/store'
import Spinner from '@/components/ui/Spinner'
import OrderStatusBadge from '@/components/ecommerce/OrderStatusBadge'
import EmptyState from '@/components/common/EmptyState'
import { formatDate } from '@/lib/utils'

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { formatPrice } = useSettingsStore()

  useEffect(() => {
    orderService
      .getOrders()
      .then((data) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="card p-6 space-y-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
        My Orders ({orders.length})
      </h2>

      {orders.length === 0 ? (
        <EmptyState variant="no-orders" />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-xs"
            >
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                  #{order.order_number}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Placed on {formatDate(order.created_at)}
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <OrderStatusBadge status={order.status} />
                <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                  {formatPrice(order.grand_total ?? order.total ?? 0)}
                </span>
                <Link
                  to={`/account/orders/${order.order_number}`}
                  className="btn-secondary btn-sm text-xs flex items-center gap-1 rounded-xl"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
