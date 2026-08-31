import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Truck, Wallet, ShoppingCart, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react'
import type { Supplier } from '../types/supplier.types'

interface SuppliersStatsCardsProps {
  suppliers: Supplier[]
  reportData?: any
  totalSuppliersCount?: number
}

export const SuppliersStatsCards: React.FC<SuppliersStatsCardsProps> = ({
  suppliers,
  reportData,
  totalSuppliersCount,
}) => {
  const { t } = useTranslation(['suppliers', 'common'])

  const count = totalSuppliersCount ?? suppliers.length
  
  // Prefer reportData summary if provided, otherwise compute accurately
  const reportActiveCount = reportData?.summary?.active_count ?? reportData?.active_count
  const reportInactiveCount = reportData?.summary?.inactive_count ?? reportData?.inactive_count

  let activeCount: number
  let inactiveCount: number

  if (reportActiveCount !== undefined && reportActiveCount !== null) {
    activeCount = Number(reportActiveCount)
    inactiveCount = reportInactiveCount !== undefined ? Number(reportInactiveCount) : Math.max(0, count - activeCount)
  } else if (suppliers.length > 0) {
    const pageActive = suppliers.filter(s => s.is_active).length
    if (count === suppliers.length) {
      activeCount = pageActive
      inactiveCount = suppliers.length - activeCount
    } else {
      // Proportionally calculate based on page sample
      const ratio = pageActive / suppliers.length
      activeCount = Math.round(count * ratio)
      inactiveCount = Math.max(0, count - activeCount)
    }
  } else {
    activeCount = 0
    inactiveCount = 0
  }

  // Total Procurement Volume
  const reportTotalPurchases = Number(reportData?.summary?.total_purchases ?? reportData?.total_purchases ?? 0)
  const listTotalPurchases = suppliers.reduce((sum, s) => sum + (Number(s.total_purchases_sum ?? s.total_purchased) || 0), 0)
  const totalVolume = reportTotalPurchases > 0 ? reportTotalPurchases : listTotalPurchases

  // Total Outstanding AP Debt
  const reportTotalDue = Number(reportData?.summary?.total_due ?? reportData?.total_due ?? 0)
  const listTotalDue = suppliers.reduce((sum, s) => sum + (Number(s.total_due_sum ?? s.total_due ?? s.outstanding_balance) || 0), 0)
  const totalDueAmount = reportTotalDue > 0 ? reportTotalDue : listTotalDue

  // Total POs
  const reportPoCount = Number(reportData?.summary?.total_purchases_count ?? reportData?.purchases_count ?? 0)
  const listPoCount = suppliers.reduce((sum, s) => sum + (Number(s.purchases_count) || 0), 0)
  const totalPos = reportPoCount > 0 ? reportPoCount : listPoCount

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* Card 1: Total Suppliers */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative overflow-hidden bg-card border border-border/80 hover:border-blue-500/40 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-300"
      >
        <div className="space-y-1.5 min-w-0">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
            {t('suppliers.totalSuppliers', 'Total Suppliers')}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground tracking-tight font-mono">
              {count}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground flex-wrap">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {activeCount} {t('suppliers.active', 'Active')}
            </span>
            <span>•</span>
            <span className="text-muted-foreground">
              {inactiveCount} {t('suppliers.inactive', 'Inactive')}
            </span>
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
          <Truck size={22} />
        </div>
      </motion.div>

      {/* Card 2: Procurement Volume */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="group relative overflow-hidden bg-card border border-border/80 hover:border-purple-500/40 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-300"
      >
        <div className="space-y-1.5 min-w-0">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
            {t('suppliers.procurementVolume', 'Total Procurement Volume')}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground tracking-tight font-mono truncate max-w-[190px]">
              ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {t('suppliers.acrossSupplyChain', 'Across enterprise supply chain')}
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform shrink-0">
          <Wallet size={22} />
        </div>
      </motion.div>

      {/* Card 3: Outstanding AP Debt (បំណុលជំពាក់សរុប) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`group relative overflow-hidden bg-card border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-300 ${
          totalDueAmount > 0
            ? 'border-rose-500/30 hover:border-rose-500/60 bg-rose-500/5 dark:bg-rose-950/10'
            : 'border-border/80 hover:border-emerald-500/40'
        }`}
      >
        <div className="space-y-1.5 min-w-0">
          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider truncate">
            {t('suppliers.outstandingPayment', 'Outstanding AP Debt')}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight font-mono truncate max-w-[190px]">
              ${totalDueAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
            {totalDueAmount > 0 ? (
              <>
                <AlertTriangle size={12} className="text-rose-500 shrink-0" />
                <span className="text-rose-500 font-semibold">{t('suppliers.unpaidInvoices', 'Pending AP Invoices')}</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                <span>{t('suppliers.allPaid', 'All accounts balanced')}</span>
              </>
            )}
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-red-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform shrink-0">
          <DollarSign size={22} />
        </div>
      </motion.div>

      {/* Card 4: Total POs & Fulfillment */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="group relative overflow-hidden bg-card border border-border/80 hover:border-emerald-500/40 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-300"
      >
        <div className="space-y-1.5 min-w-0">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
            {t('suppliers.totalPOs', 'Total POs Issued')}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
              {totalPos}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-500" />
            {t('suppliers.ordersFulfilled', 'Orders fulfilled')}
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
          <ShoppingCart size={22} />
        </div>
      </motion.div>
    </div>
  )
}
