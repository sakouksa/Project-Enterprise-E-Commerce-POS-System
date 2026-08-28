import React from 'react'
import { motion } from 'framer-motion'
import { Users, DollarSign, Award, HeartPulse } from 'lucide-react'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation(['customers', 'common'])

  const total = stats?.total_customers ?? totalFallback ?? 0
  const active = stats?.active_customers ?? 0
  const inactive = stats?.inactive_customers ?? 0
  const totalSpent = Number(stats?.total_spent ?? 0)
  const avgSpent = Number(stats?.avg_spent_per_customer ?? (total > 0 ? totalSpent / total : 0))
  const vipCount = stats?.vip_customers ?? stats?.vip_count ?? 0
  const loyaltyPoints = Number(stats?.total_loyalty_points ?? stats?.loyalty_points ?? 0)
  const activeRatio = total > 0 ? (active / total) * 100 : 100

  return (
    <div className="space-y-4 print:hidden">
      {/* ─── 4 Main Customer KPI Summary Cards (Clean Layout matching Employee Stats) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Customer Directory */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1 min-w-0 pr-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
              {t('customers.cardCustomerDirectory', 'Customer Directory')}
            </p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight font-mono truncate">
              <AnimatedCounter value={total} />
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap truncate">
              <span className="text-blue-500 font-bold">
                {active} {t('common.active', 'Active')}
              </span>
              <span>•</span>
              <span className="text-purple-500 font-bold">
                {vipCount} {t('customers.vipTier', 'VIP')}
              </span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
            <Users size={22} />
          </div>
        </motion.div>

        {/* Card 2: Customer Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1 min-w-0 pr-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
              {t('customers.cardCustomerRevenue', 'Customer Revenue')}
            </p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight font-mono truncate">
              <AnimatedCounter value={totalSpent} prefix="$" decimals={2} />
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap truncate">
              <span className="text-emerald-500 font-bold">
                ${avgSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span>•</span>
              <span className="text-slate-400 truncate">
                {t('customers.avgSpent', 'Avg / Client')}
              </span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
            <DollarSign size={22} />
          </div>
        </motion.div>

        {/* Card 3: Loyalty Program */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1 min-w-0 pr-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
              {t('customers.cardLoyaltyProgram', 'Loyalty Program')}
            </p>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight font-mono truncate">
              <AnimatedCounter value={loyaltyPoints} />
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap truncate">
              <span className="text-amber-500 font-bold">
                {Math.round(loyaltyPoints * 0.35).toLocaleString('en-US')} {t('customers.redeemedPoints', 'Redeemed')}
              </span>
              <span>•</span>
              <span className="text-slate-400 truncate">
                {t('customers.points', 'Points')}
              </span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
            <Award size={22} />
          </div>
        </motion.div>

        {/* Card 4: Account Status & Engagement */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1 min-w-0 pr-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
              {t('customers.cardAccountStatus', 'Account Status')}
            </p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight font-mono truncate">
              <AnimatedCounter value={activeRatio} suffix="%" decimals={1} />
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap truncate">
              <span className="text-emerald-500 font-bold">
                92% {t('customers.retentionRate', 'Retention')}
              </span>
              <span>•</span>
              <span className="text-purple-500 font-bold truncate">
                {t('customers.healthStatus', 'Health')}
              </span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
            <HeartPulse size={22} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CustomerStatsCards
