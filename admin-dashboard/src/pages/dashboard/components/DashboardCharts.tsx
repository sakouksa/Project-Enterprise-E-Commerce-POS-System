import React, { useState } from 'react'
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { LineChart, BarChart3, PieChart as PieIcon, CreditCard, Building2 } from 'lucide-react'

interface DashboardChartsProps {
  salesData: any[]
  chartsData?: any
  isLoading?: boolean
}

const CATEGORY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b']

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ salesData, chartsData, isLoading }) => {
  const { t, i18n } = useTranslation()
  const [activeChartTab, setActiveChartTab] = useState<'sales' | 'expenses' | 'category' | 'payments' | 'branches'>('sales')

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(i18n.language === 'km' ? 'km-KH' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0)
  }

  const rawSalesTrend = chartsData?.sales_trend?.length ? chartsData.sales_trend : (salesData || [])
  const salesTrend = rawSalesTrend.map((item: any) => ({
    date: item.date_label || item.date || '',
    total: parseFloat(item.total_sales || item.total || 0),
    orders: parseInt(item.total_orders || item.orders || 0, 10),
  }))

  const expenseTrend = (chartsData?.expense_trend || []).map((item: any) => ({
    date: item.date_label || item.date || '',
    amount: parseFloat(item.total_expense || item.amount || 0),
  }))

  const categoryData = (chartsData?.category_breakdown || []).map((item: any) => ({
    name: item.category_name || 'Category',
    value: parseInt(item.product_count || item.count || 0, 10),
  }))

  const paymentData = (chartsData?.payment_methods || []).map((item: any) => ({
    name: item.method_name || 'Payment Method',
    value: parseFloat(item.total_amount || item.amount || 0),
  }))

  const branchData = (chartsData?.branch_sales || []).map((item: any) => ({
    name: item.branch_name || 'Branch',
    value: parseFloat(item.total_sales || item.sales || 0),
  }))

  const chartTabs = [
    { id: 'sales', label: t('dashboard.salesTrend'), icon: <LineChart className="w-4 h-4" /> },
    { id: 'expenses', label: t('dashboard.expenseTrend'), icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'category', label: t('dashboard.stockCategory'), icon: <PieIcon className="w-4 h-4" /> },
    { id: 'payments', label: t('dashboard.paymentMethod'), icon: <CreditCard className="w-4 h-4" /> },
    { id: 'branches', label: t('dashboard.salesByBranch'), icon: <Building2 className="w-4 h-4" /> },
  ] as const

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4 mb-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/40 rounded-xl">
          {chartTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChartTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150
                ${
                  activeChartTab === tab.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 w-full">
        {isLoading ? (
          <div className="h-full w-full bg-muted/20 animate-pulse rounded-xl flex items-center justify-center text-xs text-muted-foreground font-semibold">
            {t('dashboard.loadingDashboard')}
          </div>
        ) : activeChartTab === 'sales' ? (
          salesTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), t('dashboard.todaySales')]}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2.5} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground font-semibold">
              {t('dashboard.noDataAvailable')}
            </div>
          )
        ) : activeChartTab === 'expenses' ? (
          expenseTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), t('dashboard.todayExpenses')]}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="amount" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground font-semibold">
              {t('dashboard.noDataAvailable')}
            </div>
          )
        ) : activeChartTab === 'category' ? (
          categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
                <Legend formatter={(val) => <span className="text-xs text-foreground font-semibold">{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground font-semibold">
              {t('dashboard.noDataAvailable')}
            </div>
          )
        ) : activeChartTab === 'payments' ? (
          paymentData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), t('dashboard.todaySales')]}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground font-semibold">
              {t('dashboard.noDataAvailable')}
            </div>
          )
        ) : (
          branchData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), t('dashboard.todaySales')]}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground font-semibold">
              {t('dashboard.noDataAvailable')}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default DashboardCharts
