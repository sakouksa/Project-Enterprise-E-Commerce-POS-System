import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import { useSettingsStore } from '@/stores'
import api from '@/lib/api'
import Spinner from '@/components/ui/Spinner'

const OrdersPage: React.FC = () => {
  const [orders, setOrders]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { formatPrice }       = useSettingsStore()

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  return (
    <div className="card p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
        My Orders ({orders.length})
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-xs text-gray-500">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn-primary btn-sm">Explore Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-sm text-gray-900 dark:text-white">{order.order_number}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="badge-primary text-xs">{order.status}</span>
                <span className="font-bold text-sm text-blue-600">{formatPrice(order.grand_total)}</span>
                <Link
                  to={`/account/orders/${order.order_number}`}
                  className="btn-secondary btn-sm text-xs flex items-center gap-1"
                >
                  View Details <ChevronRight className="w-3.5 h-3.5" />
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
