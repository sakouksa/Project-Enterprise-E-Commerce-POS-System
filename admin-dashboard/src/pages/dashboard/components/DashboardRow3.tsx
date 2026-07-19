import React from 'react'
import { useTranslation } from 'react-i18next'
import { Package, Clock, Users, ArrowUpRight } from 'lucide-react'
import StatusBadge from '@/components/common/StatusBadge'

interface DashboardRow3Props {
  topProducts: any[]
  recentOrders: any[]
}

const MOCK_CUSTOMERS = [
  { id: 1, name: 'Sok Mean', email: 'mean@gmail.com', phone: '088 123 4567', totalSpent: 'Rp 1,500,000' },
  { id: 2, name: 'Chan Thavy', email: 'thavy.chan@gmail.com', phone: '092 888 999', totalSpent: 'Rp 4,200,000' },
  { id: 3, name: 'Keo Rotha', email: 'rotha.keo@hotmail.com', phone: '010 333 444', totalSpent: 'Rp 780,000' },
]

export const DashboardRow3: React.FC<DashboardRow3Props> = ({ topProducts, recentOrders }) => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Products */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Package className="w-4.5 h-4.5 text-blue-500" />
            {t('dashboard.topProducts', 'Top Selling Products')}
          </h3>
          <button className="text-[10px] text-primary hover:underline font-bold flex items-center gap-0.5">
            {t('dashboard.viewAll', 'View All')} <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3.5">
          {topProducts?.slice(0, 4).map((p: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-4 py-1.5 border-b border-border/20 last:border-0">
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{p.name || p.product_name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                  {p.sku || `SKU-PROD-000${i}`}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs font-black text-foreground">
                  Rp {(p.selling_price ?? 120000).toLocaleString('id-ID')}
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {p.sales_count ?? p.value ?? 12} sold
                </p>
              </div>
            </div>
          ))}
          {!topProducts?.length && (
            <div className="py-8 text-center text-xs text-muted-foreground">{t('dashboard.noProducts', 'No products data available')}</div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-emerald-500" />
            {t('dashboard.recentOrders', 'Latest Orders')}
          </h3>
          <button className="text-[10px] text-primary hover:underline font-bold flex items-center gap-0.5">
            {t('dashboard.viewAll', 'View All')} <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-muted-foreground font-bold border-b border-border/40">
                <th className="pb-2">Order</th>
                <th className="pb-2">Customer</th>
                <th className="pb-2 text-right">Total</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {recentOrders?.slice(0, 4).map((order: any) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 font-bold text-primary">#{order.order_number}</td>
                  <td className="py-2.5 text-muted-foreground font-semibold truncate max-w-[80px]">
                    {order.customer_name ?? 'Walk-In Customer'}
                  </td>
                  <td className="py-2.5 text-right font-bold text-foreground">
                    Rp {order.grand_total?.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 text-right">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
              {!recentOrders?.length && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-muted-foreground">
                    {t('dashboard.noOrders', 'No orders placed today')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Customers */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-purple-500" />
            {t('dashboard.recentCustomers', 'Recent Customers')}
          </h3>
          <button className="text-[10px] text-primary hover:underline font-bold flex items-center gap-0.5">
            {t('dashboard.viewAll', 'View All')} <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3.5">
          {MOCK_CUSTOMERS.map((cust) => (
            <div key={cust.id} className="flex items-center justify-between gap-4 py-1.5 border-b border-border/20 last:border-0">
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{cust.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{cust.phone}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs font-black text-foreground">{cust.totalSpent}</span>
                <p className="text-[9px] text-muted-foreground mt-0.5">Total spent</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardRow3
