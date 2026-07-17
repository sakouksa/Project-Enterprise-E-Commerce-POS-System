import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  TrendingUp, ShoppingCart, Users, Package,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Clock,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import api from '@/api/client'
import { useThemeStore } from '@/stores/themeStore'
import { useTranslation } from 'react-i18next'

interface DashboardStats {
  today_sales:      number
  today_orders:     number
  total_customers:  number
  total_products:   number
  sales_growth:     number
  orders_growth:    number
  customers_growth: number
}

const StatCard: React.FC<{
  title:   string
  value:   string | number
  change:  number
  icon:    React.ReactNode
  color:   string
  index:   number
}> = ({ title, value, change, icon, color, index }) => {
  const isPositive = change >= 0
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium
                          ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {t('dashboard.vsYesterday').replace('%', Math.abs(change).toString())}
          </div>
        </div>
        <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

const DashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const customizer = useThemeStore()
  const widgets = customizer.widgetsList

  const { data: statsRes, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn:  () => api.get('/dashboard/stats').then(r => r.data.data),
  })

  const { data: chartRes } = useQuery({
    queryKey: ['sales-chart'],
    queryFn:  () => api.get('/dashboard/sales-chart').then(r => r.data.data),
  })

  const { data: topProducts } = useQuery({
    queryKey: ['top-products'],
    queryFn:  () => api.get('/dashboard/top-products').then(r => r.data.data),
  })

  const { data: recentOrders } = useQuery({
    queryKey: ['recent-orders'],
    queryFn:  () => api.get('/dashboard/recent-orders').then(r => r.data.data),
  })

  const { data: lowStock } = useQuery({
    queryKey: ['low-stock'],
    queryFn:  () => api.get('/dashboard/low-stock').then(r => r.data.data),
  })

  const stats = statsRes as DashboardStats | undefined

  // Sort widgets by custom order
  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order)

  // Sub-group widgets into cards and panels
  const cardWidgets = sortedWidgets.filter(w => ['today_sales', 'today_orders', 'total_customers', 'total_products'].includes(w.id))
  const panelWidgets = sortedWidgets.filter(w => ['sales_overview', 'category_sales', 'recent_orders', 'low_stock'].includes(w.id))

  const renderCardWidget = (id: string, index: number) => {
    switch (id) {
      case 'today_sales':
        return (
          <StatCard
            key={id}
            title={t('dashboard.todaySales')}
            value={`Rp ${(stats?.today_sales ?? 0).toLocaleString('id-ID')}`}
            change={stats?.sales_growth ?? 0}
            icon={<TrendingUp size={20} className="text-white" />}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            index={index}
          />
        )
      case 'today_orders':
        return (
          <StatCard
            key={id}
            title={t('dashboard.todayOrders')}
            value={stats?.today_orders ?? 0}
            change={stats?.orders_growth ?? 0}
            icon={<ShoppingCart size={20} className="text-white" />}
            color="bg-gradient-to-br from-violet-500 to-violet-600"
            index={index}
          />
        )
      case 'total_customers':
        return (
          <StatCard
            key={id}
            title={t('dashboard.totalCustomers')}
            value={(stats?.total_customers ?? 0).toLocaleString()}
            change={stats?.customers_growth ?? 0}
            icon={<Users size={20} className="text-white" />}
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            index={index}
          />
        )
      case 'total_products':
        return (
          <StatCard
            key={id}
            title={t('dashboard.totalProducts')}
            value={(stats?.total_products ?? 0).toLocaleString()}
            change={0}
            icon={<Package size={20} className="text-white" />}
            color="bg-gradient-to-br from-amber-500 to-amber-600"
            index={index}
          />
        )
      default:
        return null
    }
  }

  const renderPanelWidget = (widget: typeof widgets[0]) => {
    if (!widget.visible) return null

    const sizeClass =
      widget.size === 'large' ? 'col-span-1 md:col-span-3' :
      widget.size === 'medium' ? 'col-span-1 md:col-span-2' :
      'col-span-1'

    switch (widget.id) {
      case 'sales_overview':
        return (
          <div key={widget.id} className={`${sizeClass} bg-card rounded-xl border border-border p-5`}>
            <h3 className="font-semibold text-foreground mb-4">{t('dashboard.salesOverview')}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartRes ?? []}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )
      case 'category_sales':
        return (
          <div key={widget.id} className={`${sizeClass} bg-card rounded-xl border border-border p-5`}>
            <h3 className="font-semibold text-foreground mb-4">{t('dashboard.salesByCategory')}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={topProducts ?? []} cx="50%" cy="45%" outerRadius={80} dataKey="value" nameKey="name">
                  {(topProducts ?? []).map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )
      case 'recent_orders':
        return (
          <div key={widget.id} className={`${sizeClass} bg-card rounded-xl border border-border p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                {t('dashboard.recentOrders')}
              </h3>
              <button className="text-xs text-primary hover:underline">{t('dashboard.viewAll')}</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs text-muted-foreground font-medium pb-3">{t('pageContent.Orders')}</th>
                    <th className="text-left text-xs text-muted-foreground font-medium pb-3">{t('pageContent.Customer')}</th>
                    <th className="text-left text-xs text-muted-foreground font-medium pb-3">{t('pageContent.Price')}</th>
                    <th className="text-left text-xs text-muted-foreground font-medium pb-3">{t('pageContent.Status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                {(recentOrders ?? []).slice(0, 5).map((order: any) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 text-sm font-medium text-primary">#{order.order_number}</td>
                    <td className="py-2.5 text-sm text-muted-foreground">{order.customer_name ?? t('common.walkIn', { defaultValue: 'Walk-in' })}</td>
                    <td className="py-2.5 text-sm font-medium">Rp {order.grand_total?.toLocaleString('id-ID')}</td>
                    <td className="py-2.5">
                      <span className={`badge-${
                        order.status === 'completed' ? 'success' :
                        order.status === 'pending'   ? 'warning' :
                        order.status === 'cancelled' ? 'danger'  : 'info'
                      }`}>{t(`common.${order.status}`, { defaultValue: order.status })}</span>
                    </td>
                  </tr>
                ))}
                  {!recentOrders?.length && (
                    <tr><td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">{t('dashboard.noOrders')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'low_stock':
        return (
          <div key={widget.id} className={`${sizeClass} bg-card rounded-xl border border-border p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                {t('dashboard.lowStockAlert')}
              </h3>
              <button className="text-xs text-primary hover:underline">{t('dashboard.viewInventory')}</button>
            </div>
            <div className="space-y-3">
              {(lowStock ?? []).slice(0, 5).map((item: any) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">{item.warehouse_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="badge-warning">{item.quantity} {t('common.left', { defaultValue: 'left' })}</span>
                  </div>
                </div>
              ))}
              {!lowStock?.length && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  {t('dashboard.allStockHealthy')}
                </div>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="stat-card space-y-3">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-8 w-32 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
          ))
        ) : (
          cardWidgets
            .filter(w => w.visible)
            .map((w, index) => renderCardWidget(w.id, index))
        )}
      </div>

      {/* Main widgets grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {panelWidgets.map(renderPanelWidget)}
      </div>
    </div>
  )
}

export default DashboardPage
