import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Heart, Award } from 'lucide-react'
import { useAuthStore, useSettingsStore } from '@/stores'
import orderService from '@/services/orderService'
import type { Order } from '@/types/store'
import Spinner from '@/components/ui/Spinner'
import OrderStatusBadge from '@/components/ecommerce/OrderStatusBadge'
import { formatDate } from '@/lib/utils'

export const DashboardPage: React.FC = () => {
  const customer = useAuthStore((s) => s.customer)
  const { formatPrice } = useSettingsStore()

  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService
      .getOrders({ per_page: 5 })
      .then((data) => setRecentOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Orders</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-display">
              {customer?.order_count || recentOrders.length || 0}
            </div>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Reward Points</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-display">
              {customer?.loyalty_points?.toFixed(0) || 0} pts
            </div>
          </div>
        </div>

        <Link
          to="/wishlist"
          className="card p-5 flex items-center gap-4 bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/50 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Saved Items</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-display group-hover:text-purple-600 transition-colors">
              My Wishlist
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="card p-6 space-y-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
            Recent Orders
          </h3>
          <Link
            to="/account/orders"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <Spinner size="md" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No orders placed yet.{' '}
            <Link to="/products" className="text-blue-600 underline">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white font-mono">
                    #{order.order_number}
                  </div>
                  <div className="text-slate-400 mt-0.5">
                    {formatDate(order.created_at)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(order.grand_total ?? order.total ?? 0)}
                  </span>
                  <Link
                    to={`/account/orders/${order.order_number}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
