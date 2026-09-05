import React from 'react'
import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EnterpriseStatsCard, EnterpriseStatsGrid } from '@/components/common'

interface SalesStatsCardsProps {
  revenue: number
  completedOrders: number
  totalOrders: number
  itemsSold: number
  avgTicket: number
}

export const SalesStatsCards: React.FC<SalesStatsCardsProps> = ({
  revenue,
  completedOrders,
  totalOrders,
  itemsSold,
  avgTicket,
}) => {
  const { t } = useTranslation()

  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 100

  return (
    <EnterpriseStatsGrid columns={4}>
      {/* 1. Revenue Volume */}
      <EnterpriseStatsCard
        title={t('totalRevenueCard', 'Total Revenue')}
        value={revenue}
        prefix="$"
        decimals={2}
        subtitle={t('posCompletedRevenue', 'POS Completed Checkout Revenue')}
        trend={{ value: '+18.4%', isPositive: true }}
        icon={DollarSign}
        variant="emerald"
        delay={0.05}
      />

      {/* 2. Completed Orders / Receipts */}
      <EnterpriseStatsCard
        title={t('completedReceipts', 'Completed Receipts')}
        value={`${completedOrders.toLocaleString()} / ${totalOrders.toLocaleString()}`}
        subtitle={t('successfullyProcessed', 'Successfully Processed')}
        trend={{ value: `${completionRate}%`, isPositive: true }}
        icon={ShoppingCart}
        variant="blue"
        delay={0.1}
      />

      {/* 3. Items Sold */}
      <EnterpriseStatsCard
        title={t('itemsSold', 'Items Sold')}
        value={itemsSold}
        subtitle={t('unitsSoldInSession', 'Units sold across orders')}
        trend={{ value: 'POS' }}
        icon={Package}
        variant="purple"
        delay={0.15}
      />

      {/* 4. Average Order Value (AOV) / Ticket */}
      <EnterpriseStatsCard
        title={t('avgTicketOrder', 'Avg Ticket / AOV')}
        value={avgTicket}
        prefix="$"
        decimals={2}
        subtitle={t('averageReceiptValue', 'Average Receipt Value')}
        trend={{ value: 'AOV' }}
        icon={TrendingUp}
        variant="amber"
        delay={0.2}
      />
    </EnterpriseStatsGrid>
  )
}

export default SalesStatsCards
