import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ShoppingCart, DollarSign, Wallet, Truck } from 'lucide-react'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import type { Purchase } from '../types/purchase.types'

interface PurchasesStatsCardsProps {
  reportData?: any
  purchases?: Purchase[]
  suppliersCount?: number
  totalOrdersCount?: number
  warehousesCount?: number
}

export const PurchasesStatsCards: React.FC<PurchasesStatsCardsProps> = ({
  reportData,
  purchases = [],
  suppliersCount = 0,
  totalOrdersCount = 0,
  warehousesCount = 0,
}) => {
  const { t } = useTranslation(['purchases', 'common'])

  // ─── Real-Time Business Calculations ────────────────────────────────────────
  const totalOrders = reportData?.purchases_count !== undefined
    ? Number(reportData.purchases_count)
    : (reportData?.total_orders !== undefined
      ? Number(reportData.total_orders)
      : (totalOrdersCount > 0 ? totalOrdersCount : purchases.length))

  const totalValue = reportData?.total_purchases !== undefined
    ? Number(reportData.total_purchases)
    : (reportData?.total_purchase_cost !== undefined
      ? Number(reportData.total_purchase_cost)
      : purchases.reduce((acc, p) => acc + Number(p.grand_total_base ?? p.grand_total ?? 0), 0))

  const totalPaid = reportData?.total_paid !== undefined
    ? Number(reportData.total_paid)
    : purchases.reduce((acc, p) => acc + Number(p.paid_amount_base ?? p.paid_amount ?? 0), 0)

  const totalDue = reportData?.total_due !== undefined
    ? Number(reportData.total_due)
    : (reportData?.outstanding_payments !== undefined
      ? Number(reportData.outstanding_payments)
      : Math.max(0, Math.round((totalValue - totalPaid) * 100) / 100))

  // Status counts
  const receivedCount = reportData?.received_count !== undefined
    ? Number(reportData.received_count)
    : purchases.filter(p => p.status === 'received' || p.status === 'completed').length

  const pendingCount = reportData?.pending_count !== undefined
    ? Number(reportData.pending_count)
    : purchases.filter(p => p.status === 'ordered' || p.status === 'partial' || p.status === 'draft').length

  const receivedRate = totalOrders > 0
    ? Math.round((receivedCount / totalOrders) * 100)
    : (purchases.length > 0 ? Math.round((receivedCount / purchases.length) * 100) : 100)

  const totalSuppliers = reportData?.total_suppliers !== undefined
    ? Number(reportData.total_suppliers)
    : (suppliersCount || (new Set(purchases.map(p => p.supplier?.id).filter(Boolean)).size) || 0)

  const totalItemsProcured = reportData?.items_purchased !== undefined
    ? Number(reportData.items_purchased)
    : (reportData?.total_items_sold !== undefined
      ? Number(reportData.total_items_sold)
      : purchases.reduce((sum, p) => sum + (p.items_count || p.items?.length || 0), 0))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* ─── CARD 1: Total Purchases ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
      >
        <div className="space-y-1.5 min-w-0 pr-2">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
            {t('purchases.totalPurchasesCard', 'ការបញ្ជាទិញសរុប')}
          </p>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-mono">
            <AnimatedCounter value={totalOrders} />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <AnimatedCounter value={receivedCount} /> {t('purchases.received', 'បានទទួល')}
            </span>
            <span>•</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              <AnimatedCounter value={pendingCount} /> {t('purchases.pending', 'រង់ចាំ')}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
          <ShoppingCart size={22} />
        </div>
      </motion.div>

      {/* ─── CARD 2: Purchase Value ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.2 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
      >
        <div className="space-y-1.5 min-w-0 pr-2">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
            {t('purchases.purchaseAmountCard', 'តម្លៃទិញសរុប')}
          </p>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-mono truncate">
            <AnimatedCounter value={totalValue} prefix="$" decimals={2} />
          </div>
          <div className="text-xs text-muted-foreground truncate">
            <AnimatedCounter value={totalItemsProcured} /> {t('purchases.items', 'មុខទំនិញ')} • <AnimatedCounter value={totalOrders} /> {t('purchases.orders', 'ប័ណ្ណ')}
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
          <DollarSign size={22} />
        </div>
      </motion.div>

      {/* ─── CARD 3: Settlements & Outstanding ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
      >
        <div className="space-y-1.5 min-w-0 pr-2">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
            {t('purchases.paymentStatusCard', 'ការទូទាត់ប្រាក់ & ជំពាក់')}
          </p>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-mono truncate">
            <AnimatedCounter value={totalPaid} prefix="$" decimals={2} />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            {totalDue > 0 ? (
              <span className="text-rose-500 dark:text-rose-400 font-bold font-mono">
                {t('purchases.due', 'ជំពាក់')}: <AnimatedCounter value={totalDue} prefix="$" decimals={2} />
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {t('common.paid', 'ទូទាត់រួចរាល់')}
              </span>
            )}
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0">
          <Wallet size={22} />
        </div>
      </motion.div>

      {/* ─── CARD 4: Suppliers Network ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.2 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
      >
        <div className="space-y-1.5 min-w-0 pr-2">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
            {t('purchases.suppliersCard', 'អ្នកផ្គត់ផ្គង់')}
          </p>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-mono truncate">
            <AnimatedCounter value={totalSuppliers} />
          </div>
          <div className="text-xs text-muted-foreground truncate">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{receivedRate}%</span> {t('purchases.fulfillment', 'អត្រាទទួលទំនិញ')}
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
          <Truck size={22} />
        </div>
      </motion.div>
    </div>
  )
}

export default PurchasesStatsCards

