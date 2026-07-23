import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Package, Truck, Clock, ArrowLeft } from 'lucide-react'
import { useSettingsStore } from '@/stores'
import api from '@/lib/api'
import Spinner from '@/components/ui/Spinner'

const OrderDetailPage: React.FC = () => {
  const { number } = useParams()
  const [order, setOrder]     = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { formatPrice }       = useSettingsStore()

  useEffect(() => {
    if (!number) return
    api.get(`/orders/${number}`)
      .then(({ data }) => setOrder(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [number])

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  if (!order) return <div className="text-center py-12">Order not found</div>

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <Link to="/account/orders" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
          </Link>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
            Order #{order.order_number}
          </h2>
        </div>
        <span className="badge-primary">{order.status}</span>
      </div>

      {/* Timeline */}
      {order.timeline?.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Order Progress Timeline
          </h4>
          <div className="space-y-2">
            {order.timeline.map((step: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white capitalize">{step.status}</div>
                  <div className="text-gray-400">{step.comment}</div>
                  <div className="text-[10px] text-gray-400">{new Date(step.created_at).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Items Ordered
        </h4>
        <div className="space-y-2">
          {order.items?.map((item: any) => (
            <div key={item.name} className="flex items-center justify-between text-xs p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
              <div className="text-gray-500">Qty: {item.quantity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage
