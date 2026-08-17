import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Truck, Wallet, ShoppingCart, Award, CheckCircle2, AlertCircle } from 'lucide-react'
import type { Supplier } from '../types/supplier.types'

interface SuppliersStatsCardsProps {
  suppliers: Supplier[]
  reportData: any
}

export const SuppliersStatsCards: React.FC<SuppliersStatsCardsProps> = ({
  suppliers,
  reportData,
}) => {
  const { t } = useTranslation(['suppliers', 'common'])

  const activeCount = suppliers.filter(s => s.is_active).length
  const inactiveCount = suppliers.length - activeCount
  const totalValue = (Number(reportData?.total_purchases) || 0) / 4100
  const poCount = Number(reportData?.purchases_count || 0)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* Card 1: Total Suppliers */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative overflow-hidden bg-card border border-border/80 hover:border-primary/40 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-300"
      >
        <div className="space-y-1.5 min-w-0">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
            {t('suppliers.totalSuppliers', 'Total Suppliers')}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground tracking-tight font-mono">
              {suppliers.length}
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
            {t('suppliers.procurementVolume', 'Procurement Volume')}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground tracking-tight font-mono truncate max-w-[190px]">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

      {/* Card 3: Total POs Issued */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="group relative overflow-hidden bg-card border border-border/80 hover:border-emerald-500/40 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-300"
      >
        <div className="space-y-1.5 min-w-0">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
            {t('suppliers.totalPOs', 'Total POs Issued')}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
              {poCount}
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

      {/* Card 4: Partner Reliability Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="group relative overflow-hidden bg-card border border-border/80 hover:border-primary/40 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-300"
      >
        <div className="space-y-1.5 min-w-0">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
            {t('suppliers.partnerStatus', 'Partner Status')}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-primary tracking-tight">
              {t('suppliers.verified', 'Verified')}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {t('suppliers.enterpriseCompliance', 'Enterprise compliance')}
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform shrink-0">
          <Award size={22} />
        </div>
      </motion.div>
    </div>
  )
}
