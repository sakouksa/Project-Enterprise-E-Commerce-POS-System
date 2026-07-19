import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, DollarSign, ShoppingCart, Users, Package, 
  AlertTriangle, ArrowUpRight, ArrowDownRight, ShoppingBag
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'

interface DashboardStatsProps {
  stats: any
  isLoading: boolean
}

// Generate simple mock sparkline points
const SPARKLINE_DATA = [
  { val: 12 }, { val: 19 }, { val: 3 }, { val: 5 }, { val: 2 }, { val: 3 }, { val: 9 }
]

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isLoading }) => {
  const { t } = useTranslation()

  const cardData = [
    {
      id: 'today_sales',
      title: t('dashboard.todaySales', 'Today\'s Sales'),
      value: `Rp ${(stats?.today_sales ?? 1250000).toLocaleString('id-ID')}`,
      change: stats?.sales_growth ?? 12.5,
      icon: <TrendingUp className="w-5 h-5 text-white" />,
      gradient: 'from-blue-500 to-indigo-600',
      strokeColor: '#3b82f6',
    },
    {
      id: 'total_revenue',
      title: t('dashboard.totalRevenue', 'Total Revenue'),
      value: `Rp ${(stats?.total_revenue ?? 24500000).toLocaleString('id-ID')}`,
      change: 8.4,
      icon: <DollarSign className="w-5 h-5 text-white" />,
      gradient: 'from-emerald-500 to-teal-600',
      strokeColor: '#10b981',
    },
    {
      id: 'today_orders',
      title: t('dashboard.todayOrders', 'Today\'s Orders'),
      value: (stats?.today_orders ?? 14).toLocaleString(),
      change: stats?.orders_growth ?? -3.2,
      icon: <ShoppingCart className="w-5 h-5 text-white" />,
      gradient: 'from-violet-500 to-purple-600',
      strokeColor: '#8b5cf6',
    },
    {
      id: 'total_purchases',
      title: t('dashboard.totalPurchases', 'Purchases'),
      value: `Rp ${(stats?.total_purchases ?? 4500000).toLocaleString('id-ID')}`,
      change: 14.2,
      icon: <ShoppingBag className="w-5 h-5 text-white" />,
      gradient: 'from-pink-500 to-rose-600',
      strokeColor: '#ec4899',
    },
    {
      id: 'total_customers',
      title: t('dashboard.totalCustomers', 'Customers'),
      value: (stats?.total_customers ?? 342).toLocaleString(),
      change: stats?.customers_growth ?? 4.8,
      icon: <Users className="w-5 h-5 text-white" />,
      gradient: 'from-cyan-500 to-blue-600',
      strokeColor: '#06b6d4',
    },
    {
      id: 'total_products',
      title: t('dashboard.totalProducts', 'Products'),
      value: (stats?.total_products ?? 84).toLocaleString(),
      change: 2.1,
      icon: <Package className="w-5 h-5 text-white" />,
      gradient: 'from-amber-500 to-orange-600',
      strokeColor: '#f59e0b',
    },
    {
      id: 'low_stock',
      title: t('dashboard.lowStockAlert', 'Low Stock Items'),
      value: (stats?.low_stock_count ?? 5).toLocaleString(),
      change: -20.0, // reduction in low stock is positive
      icon: <AlertTriangle className="w-5 h-5 text-white" />,
      gradient: 'from-orange-500 to-red-600',
      strokeColor: '#ef4444',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-card border border-border/60 rounded-2xl p-5 space-y-4 animate-pulse flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-8 w-8 bg-muted rounded-xl" />
            </div>
            <div className="h-8 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardData.map((card, idx) => {
        const isPositive = card.change >= 0
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.25 }}
            whileHover={{ y: -3, transition: { duration: 0.1 } }}
            className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm hover:shadow transition-all relative overflow-hidden flex flex-col justify-between"
          >
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{card.title}</span>
                <h3 className="text-xl md:text-2xl font-black text-foreground mt-1.5 tracking-tight">{card.value}</h3>
              </div>
              <div className={`p-2.5 bg-gradient-to-br ${card.gradient} rounded-xl shadow-md flex items-center justify-center flex-shrink-0`}>
                {card.icon}
              </div>
            </div>

            {/* Sparkline & change info */}
            <div className="flex items-end justify-between mt-4">
              <div className="flex items-center gap-1 text-xs font-bold">
                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full ${
                  isPositive 
                    ? 'bg-green-500/10 text-green-600 dark:text-green-500' 
                    : 'bg-red-500/10 text-red-600 dark:text-red-500'
                }`}>
                  {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {Math.abs(card.change)}%
                </span>
                <span className="text-[10px] text-muted-foreground ml-1">vs last week</span>
              </div>

              {/* Sparkline visualization */}
              <div className="w-16 h-8 opacity-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SPARKLINE_DATA}>
                    <Area 
                      type="monotone" 
                      dataKey="val" 
                      stroke={card.strokeColor} 
                      strokeWidth={1.5} 
                      fill="none" 
                      dot={false} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default DashboardStats
