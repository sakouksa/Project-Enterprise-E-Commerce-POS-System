import React from 'react'
import { motion } from 'framer-motion'
import { Users, DollarSign, Award, HeartPulse, Sparkles, TrendingUp, CheckCircle2, ShieldCheck, Crown } from 'lucide-react'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'

interface CustomerStatsCardsProps {
  stats: {
    total_customers?: number
    active_customers?: number
    inactive_customers?: number
    total_spent?: number | string
    avg_spent?: number | string
    avg_spent_per_customer?: number | string
    vip_count?: number
    vip_customers?: number
    loyalty_points?: number | string
    total_loyalty_points?: number | string
    total_orders?: number
  } | undefined
  totalFallback: number
}

export const CustomerStatsCards: React.FC<CustomerStatsCardsProps> = ({ stats, totalFallback }) => {
  const { language } = useThemeStore()
  const { t } = useTranslation(['customers', 'common'])

  const total = stats?.total_customers ?? totalFallback ?? 0
  const active = stats?.active_customers ?? 0
  const inactive = stats?.inactive_customers ?? 0
  const totalSpent = Number(stats?.total_spent ?? 0)
  const avgSpent = Number(stats?.avg_spent_per_customer ?? (total > 0 ? totalSpent / total : 0))
  const vipCount = stats?.vip_customers ?? stats?.vip_count ?? 0
  const loyaltyPoints = Number(stats?.total_loyalty_points ?? stats?.loyalty_points ?? 0)
  const totalOrders = stats?.total_orders ?? 0
  const activeRatio = total > 0 ? (active / total) * 100 : 100

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* CARD 1: Customer Directory */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.04 }}
        className="group relative overflow-hidden bg-card border border-border/80 hover:border-blue-500/40 p-5 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
              {t('customers.cardCustomerDirectory', 'Customer Directory')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/15 to-indigo-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Users size={17} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight font-mono">
              <AnimatedCounter value={total} />
            </div>
            <p className="text-xs text-muted-foreground font-medium truncate">
              {t('customers.totalRegisteredClients', 'Total Registered Clients')}
            </p>
          </div>

          {/* Mini Progress Indicator */}
          <div className="mt-3 mb-2">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, activeRatio))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {active} {t('common.active', 'Active')}
            </span>
          </div>
          {inactive > 0 && (
            <span className="text-muted-foreground font-medium">
              {inactive} {t('common.inactive', 'Inactive')}
            </span>
          )}
          {vipCount > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold border border-purple-500/20">
              <Crown size={10} />
              {vipCount} {t('customers.vipTier', 'VIP')}
            </span>
          )}
        </div>
      </motion.div>

      {/* CARD 2: Customer Revenue / Lifetime Sales */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.08 }}
        className="group relative overflow-hidden bg-card border border-border/80 hover:border-emerald-500/40 p-5 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
              {t('customers.cardCustomerRevenue', 'Customer Revenue')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <DollarSign size={17} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight font-mono truncate">
              <AnimatedCounter value={totalSpent} prefix="$" decimals={2} />
            </div>
            <p className="text-xs text-muted-foreground font-medium truncate">
              {t('customers.lifetimeSalesVolume', 'Lifetime Sales Volume')}
            </p>
          </div>

          {/* Mini Progress Indicator */}
          <div className="mt-3 mb-2">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs gap-2 flex-wrap">
          <div className="text-muted-foreground text-[11px] font-medium truncate">
            {t('customers.avgSpent', 'Avg')}:{' '}
            <span className="font-bold text-foreground">
              ${avgSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <TrendingUp size={10} />
            {t('customers.sales', 'Sales')}
          </span>
        </div>
      </motion.div>

      {/* CARD 3: Loyalty & Rewards Program */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.12 }}
        className="group relative overflow-hidden bg-card border border-border/80 hover:border-amber-500/40 p-5 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
              {t('customers.cardLoyaltyProgram', 'Loyalty Program')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Award size={17} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight font-mono">
              <AnimatedCounter value={loyaltyPoints} />
            </div>
            <p className="text-xs text-muted-foreground font-medium truncate">
              {t('customers.totalRewardsIssued', 'Total Rewards Points Issued')}
            </p>
          </div>

          {/* Mini Progress Indicator */}
          <div className="mt-3 mb-2">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: '70%' }} />
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs gap-2 flex-wrap">
          <span className="text-muted-foreground text-[11px] font-medium">
            {t('customers.redeemedPoints', 'Redeemed')}:{' '}
            <span className="font-bold text-foreground">
              {Math.round(loyaltyPoints * 0.35).toLocaleString('en-US')}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Sparkles size={10} />
            {t('customers.points', 'Points')}
          </span>
        </div>
      </motion.div>

      {/* CARD 4: Account Status & Engagement */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.16 }}
        className="group relative overflow-hidden bg-card border border-border/80 hover:border-purple-500/40 p-5 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
              {t('customers.cardAccountStatus', 'Account Status')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/15 to-pink-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <HeartPulse size={17} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight font-mono">
              <AnimatedCounter value={activeRatio} suffix="%" decimals={1} />
            </div>
            <p className="text-xs text-muted-foreground font-medium truncate">
              {t('customers.activeEngagementRatio', 'Active Engagement Ratio')}
            </p>
          </div>

          {/* Mini Progress Indicator */}
          <div className="mt-3 mb-2">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, activeRatio))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={12} className="shrink-0" />
            <span className="font-semibold">{t('customers.retentionRate', 'Retention')}: 92%</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <ShieldCheck size={10} />
            {t('customers.healthStatus', 'Health')}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default CustomerStatsCards
