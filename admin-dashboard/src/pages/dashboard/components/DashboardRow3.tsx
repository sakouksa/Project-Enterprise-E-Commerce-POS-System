import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Package, Clock, Users, ArrowUpRight } from 'lucide-react'
import StatusBadge from '@/components/common/StatusBadge'

interface DashboardRow3Props {
  topProducts: any[]
  recentOrders: any[]
  latestCustomers?: any[]
}

export const DashboardRow3: React.FC<DashboardRow3Props> = ({ topProducts, recentOrders, latestCustomers }) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(i18n.language === 'km' ? 'km-KH' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val || 0)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Selling Products */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Package className="w-4.5 h-4.5 text-blue-500" />
            {t('dashboard.bestSellingProduct')}
          </h3>
          <button 
            onClick={() => navigate('/products')}
            className="text-[11px] text-primary hover:underline font-bold flex items-center gap-0.5"
          >
            {t('dashboard.viewAll')} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-3.5">
          {topProducts?.slice(0, 5).map((p: any, i: number) => (
            <div key={p.id || i} className="flex items-center justify-between gap-4 py-1.5 border-b border-border/20 last:border-0">
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{p.name || p.product_name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                  {p.sku || `ID: #${p.id}`}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs font-black text-foreground">
                  {formatCurrency(p.total_revenue || p.price || 0)}
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {p.value || p.total_qty || 0} {t('common.sold', 'sold')}
                </p>
              </div>
            </div>
          ))}
          {(!topProducts || topProducts.length === 0) && (
            <div className="py-8 text-center text-xs text-muted-foreground">{t('dashboard.noDataAvailable')}</div>
          )}
        </div>
      </div>

      {/* Latest Orders */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-emerald-500" />
            {t('dashboard.pendingOrders')}
          </h3>
          <button 
            onClick={() => navigate('/orders')}
            className="text-[11px] text-primary hover:underline font-bold flex items-center gap-0.5"
          >
            {t('dashboard.viewAll')} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-muted-foreground font-bold border-b border-border/40">
                <th className="pb-2">ID</th>
                <th className="pb-2">{t('common.customer', 'Customer')}</th>
                <th className="pb-2 text-right">{t('common.total', 'Total')}</th>
                <th className="pb-2 text-right">{t('common.status', 'Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {recentOrders?.slice(0, 5).map((order: any) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 font-bold text-primary">#{order.order_number || order.id}</td>
                  <td className="py-2.5 text-muted-foreground font-semibold truncate max-w-[80px]">
                    {order.customer_name || 'Walk-in'}
                  </td>
                  <td className="py-2.5 text-right font-bold text-foreground">
                    {formatCurrency(order.grand_total)}
                  </td>
                  <td className="py-2.5 text-right">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
              {(!recentOrders || recentOrders.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-muted-foreground">
                    {t('dashboard.noDataAvailable')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latest Registered Customers */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-purple-500" />
            {t('dashboard.latestCustomers')}
          </h3>
          <button 
            onClick={() => navigate('/customers')}
            className="text-[11px] text-primary hover:underline font-bold flex items-center gap-0.5"
          >
            {t('dashboard.viewAll')} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-3.5">
          {(latestCustomers && latestCustomers.length > 0 ? latestCustomers : []).slice(0, 5).map((cust: any) => (
            <div key={cust.id} className="flex items-center justify-between gap-4 py-1.5 border-b border-border/20 last:border-0">
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{cust.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{cust.phone || cust.email || `ID: #${cust.id}`}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                  {t('dashboard.newCustomers')}
                </span>
              </div>
            </div>
          ))}
          {(!latestCustomers || latestCustomers.length === 0) && (
            <div className="py-8 text-center text-xs text-muted-foreground">{t('dashboard.noDataAvailable')}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardRow3
