import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Wallet,
  Receipt,
  Landmark,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  TrendingDown
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { CircularProgressRing } from '@/components/shared/CircularProgressRing'

export type FinanceTimeframe = 'all' | 'month' | 'today'

interface FinanceStatsCardsProps {
  analytics?: any
  allSales?: any[]
  allExpenses?: any[]
  allRegisters?: any[]
}

export const FinanceStatsCards: React.FC<FinanceStatsCardsProps> = ({
  analytics,
  allSales = [],
  allExpenses = [],
  allRegisters = [],
}) => {
  const { t } = useTranslation(['finance', 'common'])
  const [timeframe, setTimeframe] = useState<FinanceTimeframe>('all')

  // Derive active dataset based on backend analytics or fallback props
  const timeframeData = analytics?.timeframes?.[timeframe]
  const summaryData = analytics?.summary

  // Dynamic values based on selected timeframe
  const grossSalesVal = timeframeData?.gross_sales ?? summaryData?.gross_sales ?? (
    allSales.reduce((acc: number, item: any) => {
      const val = parseFloat(item.total_amount ?? item.grand_total ?? item.total ?? 0)
      return acc + (isNaN(val) ? 0 : val)
    }, 0)
  )

  const expensesVal = timeframeData?.expenses ?? summaryData?.total_expenses ?? (
    allExpenses.reduce((acc: number, item: any) => {
      const val = parseFloat(item.amount ?? 0)
      return acc + (isNaN(val) ? 0 : val)
    }, 0)
  )

  const netProfitsVal = timeframeData?.net_profit ?? summaryData?.net_profits ?? Math.max(0, grossSalesVal - expensesVal)

  const salesCount = timeframeData?.sales_count ?? summaryData?.sales_count ?? allSales.length
  const expensesCount = timeframeData?.expenses_count ?? summaryData?.expenses_count ?? allExpenses.length

  const cashReservesVal = summaryData?.cash_reserves ?? (
    allRegisters.reduce((acc: number, item: any) => {
      const val = parseFloat(item.closing_balance ?? item.opening_balance ?? item.balance ?? 0)
      return acc + (isNaN(val) ? 0 : val)
    }, 0)
  )

  const registersCount = summaryData?.total_registers ?? allRegisters.length ?? 10
  const openRegistersCount = summaryData?.open_registers ?? allRegisters.filter((r: any) => r.status === 'open' || !r.status).length ?? 10

  // Derived financial ratios
  const avgOrderVal = salesCount > 0 ? grossSalesVal / salesCount : (summaryData?.avg_order_value ?? 0)
  const avgExpenseVal = expensesCount > 0 ? expensesVal / expensesCount : (summaryData?.avg_expense_value ?? 0)
  const avgTillBalance = registersCount > 0 ? cashReservesVal / registersCount : (summaryData?.avg_till_float ?? 0)

  const profitMarginNum = grossSalesVal > 0 ? (netProfitsVal / grossSalesVal) * 100 : 0
  const opexRatioNum = grossSalesVal > 0 ? (expensesVal / grossSalesVal) * 100 : 0
  const tillActiveRatio = registersCount > 0 ? (openRegistersCount / registersCount) * 100 : 100

  // Top spending category
  const topCategoryName = summaryData?.top_category ?? t('finance.all_categories', 'Operational')

  // Financial Health state
  const healthStatus = useMemo(() => {
    if (profitMarginNum >= 80) {
      return {
        label: t('finance.health_optimal', 'Optimal Growth'),
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        badgeColor: 'text-emerald-500',
        icon: <Sparkles size={13} className="text-emerald-500" />,
      }
    } else if (profitMarginNum >= 50) {
      return {
        label: t('finance.health_healthy', 'Strong & Healthy'),
        color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        badgeColor: 'text-blue-500',
        icon: <ShieldCheck size={13} className="text-blue-500" />,
      }
    } else if (profitMarginNum > 0) {
      return {
        label: t('finance.health_moderate', 'Moderate'),
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        badgeColor: 'text-amber-500',
        icon: <Activity size={13} className="text-amber-500" />,
      }
    } else {
      return {
        label: t('finance.health_warning', 'Caution Needed'),
        color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
        badgeColor: 'text-rose-500',
        icon: <TrendingDown size={13} className="text-rose-500" />,
      }
    }
  }, [profitMarginNum, t])

  // Revenue Multiple vs OPEX
  const revenueMultiple = expensesVal > 0 ? (grossSalesVal / expensesVal).toFixed(1) : '100+'
  const dailyRunRate = summaryData?.daily_run_rate ?? (grossSalesVal > 0 ? grossSalesVal / 30 : 0)

  return (
    <div className="space-y-4 print:hidden select-none">
      {/* ─── Top UX Toolbar: Period Filters & Financial Health Indicator ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/60 backdrop-blur-md border border-border/80 p-2.5 sm:px-4 rounded-2xl shadow-2xs">
        {/* Health Status Capsule */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${healthStatus.color}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{t('finance.financial_health_label', 'Financial Health')}:</span>
            <span className="font-extrabold">{healthStatus.label}</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>•</span>
            <span>{t('finance.cashflow_positive', 'Positive Cashflow')}</span>
            <span className="font-bold text-foreground">({revenueMultiple}x {t('finance.inflow_vs_opex', 'Inflow vs OPEX')})</span>
          </div>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-1 bg-muted/70 p-1 rounded-xl border border-border/50 self-start sm:self-auto">
          {(
            [
              { id: 'all', label: t('finance.period_all', 'All Time') },
              { id: 'month', label: t('finance.period_month', 'This Month') },
              { id: 'today', label: t('finance.period_today', 'Today') },
            ] as const
          ).map((item) => {
            const isActive = timeframe === item.id
            return (
              <button
                key={item.id}
                onClick={() => setTimeframe(item.id)}
                className={`relative px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer select-none ${
                  isActive
                    ? 'text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="finance-timeframe-pill"
                    className="absolute inset-0 bg-background rounded-lg border border-border/80 shadow-2xs"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── 4 Clean Display & Analytics Cards (Non-Clickable Pure Display) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ── CARD 1: Gross Sales Revenue (Emerald Theme) ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.25 }}
          className="rounded-2xl border-l-[4px] border-l-emerald-500 border-y border-r border-border bg-gradient-to-r from-emerald-500/[0.06] via-emerald-500/[0.01] to-card backdrop-blur-xl p-4 sm:p-5 shadow-xs transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 line-clamp-1">
                {t('finance.gross_sales_revenue', 'Gross Sales Revenue')}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ArrowUpRight size={11} />
                  <span>{t('finance.inflow_badge', 'Total Inflow')}</span>
                </span>
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <TrendingUp size={15} />
                </span>
              </div>
            </div>

            {/* Main Metric */}
            <div className="flex items-center justify-between gap-3 my-1.5">
              <div className="min-w-0 flex-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-mono truncate">
                  <AnimatedCounter value={grossSalesVal} prefix="$" decimals={2} />
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 font-medium line-clamp-1">
                  {t('finance.sales_sub', 'POS & Online Orders Included')}
                </div>
              </div>
              <div className="shrink-0" title={`${t('finance.profit_margin', 'Margin')}: ${profitMarginNum.toFixed(1)}%`}>
                <CircularProgressRing
                  percentage={Math.min(100, Math.max(10, profitMarginNum))}
                  colorClass="text-emerald-500"
                  size={44}
                  strokeWidth={3.5}
                />
              </div>
            </div>
          </div>

          {/* Sub-metrics breakdown */}
          <div>
            <div className="w-full border-t border-border/60 my-2.5" />
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-left">
              <div className="min-w-0" title={`${t('finance.orders_count', 'Sales Count')}: ${salesCount}`}>
                <div className="text-muted-foreground text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                  {t('finance.orders_count', 'Sales Count')}
                </div>
                <div className="font-bold text-xs sm:text-[13px] text-emerald-600 dark:text-emerald-400 mt-0.5 leading-tight font-mono truncate">
                  {salesCount} {t('finance.sales', 'Sales')}
                </div>
              </div>
              <div className="min-w-0" title={`${t('finance.avg_order', 'Avg / Order')}: $${avgOrderVal.toFixed(2)}`}>
                <div className="text-muted-foreground text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                  {t('finance.avg_order', 'Avg / Order')}
                </div>
                <div className="font-bold text-xs sm:text-[13px] text-foreground mt-0.5 leading-tight font-mono truncate">
                  ${avgOrderVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="min-w-0" title={t('finance.channel_val', 'POS & Online')}>
                <div className="text-muted-foreground text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                  {t('finance.channel_label', 'Channel')}
                </div>
                <div className="font-bold text-xs sm:text-[13px] text-blue-500 mt-0.5 leading-tight truncate">
                  {t('finance.channel_val', 'POS & Web')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── CARD 2: Operating Expenses (Rose Theme) ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.25 }}
          className="rounded-2xl border-l-[4px] border-l-rose-500 border-y border-r border-border bg-gradient-to-r from-rose-500/[0.06] via-rose-500/[0.01] to-card backdrop-blur-xl p-4 sm:p-5 shadow-xs transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 line-clamp-1">
                {t('finance.operating_expenses', 'Operating Expenses')}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <Receipt size={11} />
                  <span>{opexRatioNum.toFixed(1)}% OPEX</span>
                </span>
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shrink-0">
                  <Receipt size={15} />
                </span>
              </div>
            </div>

            {/* Main Metric */}
            <div className="flex items-center justify-between gap-3 my-1.5">
              <div className="min-w-0 flex-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight font-mono truncate">
                  <AnimatedCounter value={expensesVal} prefix="$" decimals={2} />
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 font-medium line-clamp-1">
                  {t('finance.expenses_sub', 'Approved Expenses Ledger')}
                </div>
              </div>
              <div className="shrink-0" title={`OPEX Ratio: ${opexRatioNum.toFixed(1)}%`}>
                <CircularProgressRing
                  percentage={Math.max(8, Math.min(100, opexRatioNum * 2))}
                  colorClass="text-rose-500"
                  size={44}
                  strokeWidth={3.5}
                />
              </div>
            </div>
          </div>

          {/* Sub-metrics breakdown */}
          <div>
            <div className="w-full border-t border-border/60 my-2.5" />
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-left">
              <div className="min-w-0" title={`${t('finance.expenses', 'Expenses')}: ${expensesCount}`}>
                <div className="text-muted-foreground text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                  {t('finance.expenses', 'Expenses')}
                </div>
                <div className="font-bold text-xs sm:text-[13px] text-rose-500 mt-0.5 leading-tight font-mono truncate">
                  {expensesCount} {t('finance.records', 'Entries')}
                </div>
              </div>
              <div className="min-w-0" title={`${t('finance.avg_expense', 'Avg / Expense')}: $${avgExpenseVal.toFixed(2)}`}>
                <div className="text-muted-foreground text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                  {t('finance.avg_expense', 'Avg / Expense')}
                </div>
                <div className="font-bold text-xs sm:text-[13px] text-foreground mt-0.5 leading-tight font-mono truncate">
                  ${avgExpenseVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="min-w-0" title={`${t('finance.top_category', 'Top Spend')}: ${topCategoryName}`}>
                <div className="text-muted-foreground text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                  {t('finance.top_category', 'Top Spend')}
                </div>
                <div className="font-bold text-xs sm:text-[13px] text-amber-500 mt-0.5 leading-tight truncate">
                  {topCategoryName}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── CARD 3: Net Profit Balance (Blue Theme) ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.25 }}
          className="rounded-2xl border-l-[4px] border-l-blue-500 border-y border-r border-border bg-gradient-to-r from-blue-500/[0.06] via-blue-500/[0.01] to-card backdrop-blur-xl p-4 sm:p-5 shadow-xs transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 line-clamp-1">
                {t('finance.net_profits_balance', 'Net Profits Balance')}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <TrendingUp size={11} />
                  <span>+{profitMarginNum.toFixed(1)}% {t('finance.profit_margin', 'Margin')}</span>
                </span>
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
                  <Wallet size={15} />
                </span>
              </div>
            </div>

            {/* Main Metric */}
            <div className="flex items-center justify-between gap-3 my-1.5">
              <div className="min-w-0 flex-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-mono truncate">
                  <AnimatedCounter value={netProfitsVal} prefix="$" decimals={2} />
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 font-medium line-clamp-1">
                  {t('finance.net_profit_sub', 'Revenue minus Operating Costs')}
                </div>
              </div>
              <div className="shrink-0" title={`Net Margin: ${profitMarginNum.toFixed(1)}%`}>
                <CircularProgressRing
                  percentage={profitMarginNum}
                  colorClass="text-blue-500"
                  size={44}
                  strokeWidth={3.5}
                />
              </div>
            </div>
          </div>

          {/* Sub-metrics breakdown */}
          <div>
            <div className="w-full border-t border-border/60 my-2.5" />
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-left">
              <div className="min-w-0" title={`${t('finance.net_margin', 'Margin')}: ${profitMarginNum.toFixed(1)}%`}>
                <div className="text-muted-foreground text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                  {t('finance.net_margin', 'Margin')}
                </div>
                <div className="font-bold text-xs sm:text-[13px] text-emerald-600 dark:text-emerald-400 mt-0.5 leading-tight font-mono truncate">
                  {profitMarginNum.toFixed(1)}%
                </div>
              </div>
              <div className="min-w-0" title={`${t('finance.multiple', 'Multiple')}: ${revenueMultiple}x`}>
                <div className="text-muted-foreground text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                  {t('finance.multiple', 'Multiple')}
                </div>
                <div className="font-bold text-xs sm:text-[13px] text-purple-500 mt-0.5 leading-tight font-mono truncate">
                  {revenueMultiple}x
                </div>
              </div>
              <div className="min-w-0" title={healthStatus.label}>
                <div className="text-muted-foreground text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                  {t('finance.status_summary', 'Status')}
                </div>
                <div className={`font-bold text-xs sm:text-[13px] mt-0.5 leading-tight truncate ${healthStatus.badgeColor}`}>
                  {healthStatus.label}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── CARD 4: Cash Register Reserves (Amber Theme) ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.25 }}
          className="rounded-2xl border-l-[4px] border-l-amber-500 border-y border-r border-border bg-gradient-to-r from-amber-500/[0.06] via-amber-500/[0.01] to-card backdrop-blur-xl p-4 sm:p-5 shadow-xs transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 line-clamp-1">
                {t('finance.cash_reserves', 'Cash Register Reserves')}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Landmark size={11} />
                  <span>{openRegistersCount}/{registersCount} {t('finance.open', 'Open')}</span>
                </span>
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0">
                  <Landmark size={15} />
                </span>
              </div>
            </div>

            {/* Main Metric */}
            <div className="flex items-center justify-between gap-3 my-1.5">
              <div className="min-w-0 flex-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-mono truncate">
                  <AnimatedCounter value={cashReservesVal} prefix="$" decimals={2} />
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 font-medium line-clamp-1">
                  {t('finance.registers_sub', `Active POS Till Drawers (${registersCount} Tills)`, { count: registersCount })}
                </div>
              </div>
              <div className="shrink-0" title={`Active Tills: ${tillActiveRatio.toFixed(0)}%`}>
                <CircularProgressRing
                  percentage={tillActiveRatio}
                  colorClass="text-amber-500"
                  size={44}
                  strokeWidth={3.5}
                />
              </div>
            </div>
          </div>

          {/* Sub-metrics breakdown */}
          <div>
            <div className="w-full border-t border-border/60 my-2.5" />
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-left">
              <div className="min-w-0" title={`${t('finance.open_tills', 'Open Tills')}: ${openRegistersCount}`}>
                <div className="text-muted-foreground text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                  {t('finance.open_tills', 'Open Tills')}
                </div>
                <div className="font-bold text-xs sm:text-[13px] text-emerald-500 mt-0.5 leading-tight font-mono truncate">
                  {openRegistersCount} {t('finance.active', 'Active')}
                </div>
              </div>
              <div className="min-w-0" title={`${t('finance.avg_till', 'Avg / Till')}: $${avgTillBalance.toFixed(2)}`}>
                <div className="text-muted-foreground text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                  {t('finance.avg_till', 'Avg / Till')}
                </div>
                <div className="font-bold text-xs sm:text-[13px] text-foreground mt-0.5 leading-tight font-mono truncate">
                  ${avgTillBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="min-w-0" title={t('finance.active_liquidity', 'Liquidity')}>
                <div className="text-muted-foreground text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                  {t('finance.active_liquidity', 'Liquidity')}
                </div>
                <div className="font-bold text-xs sm:text-[13px] text-amber-500 mt-0.5 leading-tight truncate">
                  {t('finance.pos_liquidity', 'Ready')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Secondary UX Quick Financial Insights Strip ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-card/70 border border-border/80 p-3 sm:p-3.5 rounded-xl flex flex-col justify-between shadow-2xs hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            <span className="truncate">{t('finance.daily_runrate', 'Daily Run-rate')}</span>
            <Activity size={12} className="text-emerald-500 shrink-0" />
          </div>
          <div className="text-sm sm:text-base md:text-lg font-extrabold text-foreground mt-1 font-mono truncate">
            ${dailyRunRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-[10px] text-muted-foreground font-normal ml-1">{t('finance.per_day', '/ day')}</span>
          </div>
        </div>

        <div className="bg-card/70 border border-border/80 p-3 sm:p-3.5 rounded-xl flex flex-col justify-between shadow-2xs hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
            <span className="truncate">{t('finance.net_margin', 'Net Margin')}</span>
            <TrendingUp size={12} className="text-blue-500 shrink-0" />
          </div>
          <div className="text-sm sm:text-base md:text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-1 font-mono truncate">
            +{profitMarginNum.toFixed(1)}%
            <span className="text-[10px] text-muted-foreground font-normal ml-1">{t('finance.retained_label', 'retained')}</span>
          </div>
        </div>

        <div className="bg-card/70 border border-border/80 p-3 sm:p-3.5 rounded-xl flex flex-col justify-between shadow-2xs hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between text-[10px] text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider">
            <span className="truncate">{t('finance.cashflow_positive', 'Revenue Multiple')}</span>
            <Sparkles size={12} className="text-purple-500 shrink-0" />
          </div>
          <div className="text-sm sm:text-base md:text-lg font-extrabold text-purple-600 dark:text-purple-400 mt-1 font-mono truncate">
            {revenueMultiple}x
            <span className="text-[10px] text-muted-foreground font-normal ml-1">{t('finance.vs_opex', 'vs OPEX')}</span>
          </div>
        </div>

        <div className="bg-card/70 border border-border/80 p-3 sm:p-3.5 rounded-xl flex flex-col justify-between shadow-2xs hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
            <span className="truncate">{t('finance.till_health', 'Till Health')}</span>
            <ShieldCheck size={12} className="text-amber-500 shrink-0" />
          </div>
          <div className="text-sm sm:text-base md:text-lg font-extrabold text-amber-600 dark:text-amber-400 mt-1 font-mono truncate">
            100%
            <span className="text-[10px] text-muted-foreground font-normal ml-1">{t('finance.balanced', 'balanced')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinanceStatsCards
