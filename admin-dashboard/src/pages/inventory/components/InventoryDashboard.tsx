import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import {
  Package, Warehouse, AlertTriangle, TrendingUp, DollarSign,
  RefreshCw, BarChart2, ShieldAlert, CheckCircle, Percent
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface InventoryDashboardProps {
  stats: {
    summary: {
      total_items: number
      total_qty: number
      available_qty: number
      reserved_qty: number
      low_stock: number
      out_of_stock: number
      overstock: number
      warehouses: number
      inventory_cost: number
      inventory_value: number
      profit_potential: number
      turnover_rate: number
    }
    charts: {
      by_warehouse: Array<{ name: string; value: number }>
      by_category: Array<{ name: string; value: number }>
      by_brand: Array<{ name: string; value: number }>
      monthly_movement: Array<{ month: string; in: number; out: number }>
    }
  }
}

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ stats }) => {
  const { t } = useTranslation()
  const { summary, charts } = stats

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val)
  }

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat().format(val)
  }

  const cardData = [
    {
      title: t('inventory.total_items', 'Total Inventory Lines'),
      value: formatNumber(summary.total_items),
      icon: <Package size={20} />,
      gradient: 'from-blue-500/10 to-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    {
      title: t('inventory.total_qty', 'Total Quantity'),
      value: formatNumber(summary.total_qty),
      icon: <BarChart2 size={20} />,
      gradient: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: t('inventory.available_qty', 'Available Quantity'),
      value: formatNumber(summary.available_qty),
      icon: <CheckCircle size={20} />,
      gradient: 'from-blue-500/10 to-sky-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      title: t('inventory.reserved_qty', 'Reserved Quantity'),
      value: formatNumber(summary.reserved_qty),
      icon: <AlertTriangle size={20} />,
      gradient: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      title: t('inventory.low_stock', 'Low Stock Alert'),
      value: formatNumber(summary.low_stock),
      icon: <ShieldAlert size={20} />,
      gradient: 'from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400',
      alert: summary.low_stock > 0,
    },
    {
      title: t('inventory.out_of_stock', 'Out of Stock'),
      value: formatNumber(summary.out_of_stock),
      icon: <AlertTriangle size={20} />,
      gradient: 'from-red-500/10 to-rose-500/10 text-red-600 dark:text-red-400',
      alert: summary.out_of_stock > 0,
    },
    {
      title: t('inventory.overstock', 'Overstock'),
      value: formatNumber(summary.overstock),
      icon: <TrendingUp size={20} />,
      gradient: 'from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400',
    },
    {
      title: t('inventory.warehouses', 'Active Warehouses'),
      value: formatNumber(summary.warehouses),
      icon: <Warehouse size={20} />,
      gradient: 'from-cyan-500/10 to-blue-500/10 text-cyan-600 dark:text-cyan-400',
    },
    {
      title: t('inventory.inventory_cost', 'Inventory Cost'),
      value: formatCurrency(summary.inventory_cost),
      icon: <DollarSign size={20} />,
      gradient: 'from-slate-500/10 to-zinc-500/10 text-slate-600 dark:text-slate-400',
    },
    {
      title: t('inventory.inventory_value', 'Inventory Value'),
      value: formatCurrency(summary.inventory_value),
      icon: <DollarSign size={20} />,
      gradient: 'from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400',
    },
    {
      title: t('inventory.profit_potential', 'Profit Potential'),
      value: formatCurrency(summary.profit_potential),
      icon: <Percent size={20} />,
      gradient: 'from-emerald-500/10 to-green-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: t('inventory.turnover_rate', 'Turnover Rate'),
      value: `${summary.turnover_rate}x`,
      icon: <RefreshCw size={20} />,
      gradient: 'from-teal-500/10 to-cyan-500/10 text-teal-600 dark:text-teal-400',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {cardData.map((card, idx) => (
          <div
            key={idx}
            className="p-5 bg-card border border-border/60 rounded-2xl shadow-sm flex items-center justify-between transition-transform hover:-translate-y-0.5 duration-200"
          >
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                {card.title}
              </span>
              <span className="text-2xl font-bold text-foreground font-semibold block">
                {card.value}
              </span>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-foreground font-semibold uppercase tracking-wider">
            {t('inventory.monthly_movement', 'Monthly Stock Movement (In vs Out)')}
          </h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthly_movement} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--border), 0.1)" />
                <XAxis dataKey="month" stroke="currentColor" className="text-xs text-muted-foreground" />
                <YAxis stroke="currentColor" className="text-xs text-muted-foreground" />
                <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="in" fill="#10b981" radius={[4, 4, 0, 0]} name="Stock In" />
                <Bar dataKey="out" fill="#ef4444" radius={[4, 4, 0, 0]} name="Stock Out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-foreground font-semibold uppercase tracking-wider">
            {t('inventory.stock_by_warehouse', 'Stock Quantity by Warehouse')}
          </h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.by_warehouse} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(var(--border), 0.1)" />
                <XAxis type="number" stroke="currentColor" className="text-xs text-muted-foreground" />
                <YAxis dataKey="name" type="category" stroke="currentColor" className="text-xs text-muted-foreground" />
                <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} name="Quantity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-foreground font-semibold uppercase tracking-wider">
            {t('inventory.stock_by_category', 'Stock Distribution by Category')}
          </h4>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.by_category}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {charts.by_category.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-foreground font-semibold uppercase tracking-wider">
            {t('inventory.stock_by_brand', 'Stock Distribution by Brand')}
          </h4>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.by_brand}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={90}
                  paddingAngle={1}
                  dataKey="value"
                >
                  {charts.by_brand.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
export default InventoryDashboard
