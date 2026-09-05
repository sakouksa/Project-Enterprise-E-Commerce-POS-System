import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  CreditCard, 
  Wallet, 
  ShieldAlert, 
  TrendingUp, 
  Crown, 
  Gem, 
  Rocket, 
  AlertTriangle, 
  Moon, 
  UserPlus, 
  Layers
} from 'lucide-react'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { useTranslation } from 'react-i18next'
import { EnterpriseStatsCard, EnterpriseStatsGrid } from '@/components/common'
import type { CustomerAnalytics } from '../types'

interface CustomerStatsCardsProps {
  stats: CustomerAnalytics | any | undefined
  totalFallback: number
  selectedRfm?: string
  onSelectRfm?: (segment: string) => void
}

export const CustomerStatsCards: React.FC<CustomerStatsCardsProps> = ({ 
  stats, 
  totalFallback,
  selectedRfm = '',
  onSelectRfm
}) => {
  const { t } = useTranslation(['customers', 'common'])

  const total = stats?.total_customers ?? totalFallback ?? 0
  const active = stats?.active_customers ?? 0
  const totalSpent = Number(stats?.total_spent ?? 0)
  const vipCount = stats?.vip_customers ?? 0
  const loyaltyPoints = Number(stats?.total_points ?? 0)
  
  // Enterprise Credit & Wallet Metrics
  const totalCreditLimit = Number(stats?.total_credit_limit ?? 0)
  const totalOutstanding = Number(stats?.total_outstanding_balance ?? 0)
  const creditHoldCount = Number(stats?.credit_hold_count ?? 0)
  const totalWalletBalance = Number(stats?.total_wallet_balance ?? 0)
  const avgChurnRisk = Number(stats?.avg_churn_risk ?? 15)

  const rfm = stats?.rfm_breakdown || {
    champions: 0,
    loyal: 0,
    potential: 0,
    at_risk: 0,
    hibernating: 0,
    new: 0,
  }

  const rfmSegments = [
    { key: '', label: t('customers.allCustomers', 'All Customers'), count: total, icon: Users, color: 'text-primary' },
    { key: 'champions', label: t('customers.rfmChampions', 'Champions'), count: rfm.champions, icon: Crown, color: 'text-emerald-500' },
    { key: 'loyal', label: t('customers.rfmLoyal', 'Loyal'), count: rfm.loyal, icon: Gem, color: 'text-blue-500' },
    { key: 'potential', label: t('customers.rfmPotential', 'Potential'), count: rfm.potential, icon: Rocket, color: 'text-cyan-500' },
    { key: 'at_risk', label: t('customers.rfmAtRisk', 'At-Risk'), count: rfm.at_risk, icon: AlertTriangle, color: 'text-amber-500' },
    { key: 'hibernating', label: t('customers.rfmHibernating', 'Hibernating'), count: rfm.hibernating, icon: Moon, color: 'text-rose-500' },
    { key: 'new', label: t('customers.rfmNew', 'New'), count: rfm.new, icon: UserPlus, color: 'text-purple-500' },
  ]

  return (
    <div className="space-y-4 print:hidden">
      {/* ─── 4 Standard Enterprise KPI Summary Cards ─── */}
      <EnterpriseStatsGrid columns={4}>
        {/* Card 1: Total Registered Customers */}
        <EnterpriseStatsCard
          title={t('customers.cardCustomerDirectory', 'Customer Directory')}
          value={total}
          subtitle={
            <span className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {active} {t('common.active', 'Active')}
              </span>
              <span>•</span>
              <span className="text-primary font-semibold">
                {vipCount} {t('customers.vip', 'VIP')}
              </span>
            </span>
          }
          icon={Users}
          variant="primary"
        />

        {/* Card 2: B2B Credit & Receivables */}
        <EnterpriseStatsCard
          title={t('customers.b2bCreditLimit', 'B2B Credit & Receivables')}
          value={totalOutstanding}
          prefix="$"
          decimals={2}
          valueClassName="text-primary"
          subtitle={
            <span className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span>
                ${totalCreditLimit.toLocaleString()} {t('customers.limitCap', 'Cap')}
              </span>
              <span>•</span>
              {creditHoldCount > 0 ? (
                <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                  <ShieldAlert size={13} />
                  {creditHoldCount} {t('customers.onHold', 'Locked')}
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {t('customers.allActive', 'All Clear')}
                </span>
              )}
            </span>
          }
          icon={CreditCard}
          variant="blue"
          delay={0.05}
        />

        {/* Card 3: Store Wallet & Prepaid Reserves */}
        <EnterpriseStatsCard
          title={t('customers.storeWalletReserves', 'Store Wallet & Prepaid')}
          value={totalWalletBalance}
          prefix="$"
          decimals={2}
          valueClassName="text-emerald-600 dark:text-emerald-400"
          subtitle={
            <span className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="font-semibold text-foreground">
                {loyaltyPoints.toLocaleString()} {t('customers.pts', 'Pts')}
              </span>
              <span>•</span>
              <span className="text-muted-foreground">{t('customers.pointsRewards', 'Rewards')}</span>
            </span>
          }
          icon={Wallet}
          variant="emerald"
          delay={0.1}
        />

        {/* Card 4: RFM Health & Retention Score */}
        <EnterpriseStatsCard
          title={t('customers.rfmHealthScore', 'RFM Health & Retention')}
          value={(100 - avgChurnRisk).toFixed(1)}
          suffix="%"
          useCounter={false}
          subtitle={
            <span className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="text-primary font-semibold">
                {rfm.champions + rfm.loyal} {t('customers.champions', 'Champions')}
              </span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                {rfm.at_risk} {t('customers.atRisk', 'At-Risk')}
              </span>
            </span>
          }
          icon={TrendingUp}
          variant="purple"
          delay={0.15}
        />
      </EnterpriseStatsGrid>

      {/* ─── Clean Interactive RFM Segment Quick Filter Bar ─── */}
      <div className="bg-card border border-border p-2.5 px-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Layers size={15} className="text-primary" />
          <span>{t('customers.rfmSegmentsOverview', 'RFM Segments:')}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {rfmSegments.map((seg) => {
            const IconComponent = seg.icon
            const isSelected = selectedRfm === seg.key

            return (
              <button
                key={seg.key}
                type="button"
                onClick={() => onSelectRfm && onSelectRfm(seg.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer select-none ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60'
                }`}
              >
                <IconComponent size={13} className={isSelected ? 'text-primary-foreground' : seg.color} />
                <span>{seg.label}</span>
                <span className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-card text-foreground border border-border/40'
                }`}>
                  {seg.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CustomerStatsCards
