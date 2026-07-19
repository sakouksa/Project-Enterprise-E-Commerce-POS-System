import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { TrendingUp, BarChart3, LineChart, Users } from 'lucide-react'

interface DashboardChartsProps {
  salesData: any[]
}

const RANGE_TABS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
] as const

const CHART_TABS = [
  { id: 'sales', label: 'Sales & Revenue', icon: <LineChart className="w-4 h-4" /> },
  { id: 'purchases', label: 'Purchases', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'visitors', label: 'Visitors', icon: <Users className="w-4 h-4" /> },
] as const

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ salesData }) => {
  const { t } = useTranslation()
  const [activeRange, setActiveRange] = useState<'today' | 'week' | 'month' | 'year'>('month')
  const [activeChart, setActiveChart] = useState<'sales' | 'purchases' | 'visitors'>('sales')

  // Generate some realistic fallback data if salesData is empty
  const defaultSalesData = salesData?.length ? salesData : [
    { date: 'Jul 12', total: 4500000, purchases: 1200000, visitors: 230 },
    { date: 'Jul 13', total: 5200000, purchases: 1800000, visitors: 310 },
    { date: 'Jul 14', total: 3100000, purchases: 900000, visitors: 190 },
    { date: 'Jul 15', total: 4800000, purchases: 1500000, visitors: 280 },
    { date: 'Jul 16', total: 7200000, purchases: 2200000, visitors: 420 },
    { date: 'Jul 17', total: 6100000, purchases: 1900000, visitors: 350 },
    { date: 'Jul 18', total: 8400000, purchases: 2600000, visitors: 490 },
  ]

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Primary Analytics Chart Card */}
      <div className="xl:col-span-2 bg-card border border-border/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4 mb-4">
          {/* Chart selector */}
          <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl">
            {CHART_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveChart(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150
                  ${
                    activeChart === tab.id
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Range Selector */}
          <div className="flex items-center gap-1">
            {RANGE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRange(tab.id)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all duration-150
                  ${
                    activeRange === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart render */}
        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'sales' ? (
              <AreaChart data={defaultSalesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fill="url(#colorSales)" />
              </AreaChart>
            ) : activeChart === 'purchases' ? (
              <BarChart data={defaultSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="purchases" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            ) : (
              <AreaChart data={defaultSalesData}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorVisitors)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side visualizer - Revenue analytics summary */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {t('dashboard.revenue_analytics', 'Revenue Target')}
          </span>
          <h4 className="text-xl font-bold mt-1">Rp 120.000.000</h4>
          <p className="text-xs text-muted-foreground mt-0.5">Target reached this month (68%)</p>
        </div>

        <div className="relative my-6 flex items-center justify-center">
          {/* Simulated progress ring */}
          <div className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent border-r-transparent rotate-45" />
            <div className="text-center">
              <span className="text-2xl font-black text-foreground">68%</span>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">COMPLETED</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-border/40 pt-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Sales Revenue</span>
            <span className="text-foreground">Rp 81.600.000</span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground">POS Purchases</span>
            <span className="text-foreground">Rp 38.400.000</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardCharts
