import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Truck, Wallet, ShoppingCart, Award } from 'lucide-react'
import type { Supplier } from '../types/supplier.types'

interface SuppliersStatsCardsProps {
  suppliers: Supplier[]
  reportData: any
}

export const SuppliersStatsCards: React.FC<SuppliersStatsCardsProps> = ({
  suppliers,
  reportData,
}) => {
  const { t } = useTranslation()

  const activeSuppliers = suppliers.filter(s => s.is_active)
  const totalValue = (Number(reportData?.total_purchases) || 0) / 4100

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* Card 1: Total Suppliers */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('suppliers.totalSuppliers', 'Total Suppliers')}</p>
          <p className="text-2xl font-extrabold text-foreground tracking-tight">{suppliers.length}</p>
          <p className="text-[11px] text-muted-foreground">
            <span className="text-emerald-500 font-bold">{activeSuppliers.length} Active</span>
            <span className="mx-1">•</span>
            <span>{suppliers.length - activeSuppliers.length} Inactive</span>
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
          <Truck size={22} />
        </div>
      </motion.div>

      {/* Card 2: Total Purchased Value */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('suppliers.procurementVolume', 'Procurement Volume')}</p>
          <p className="text-xl font-extrabold text-foreground tracking-tight truncate max-w-[190px]">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Across enterprise supply chain
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500">
          <Wallet size={22} />
        </div>
      </motion.div>

      {/* Card 3: Purchase Orders */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('suppliers.totalPOs', 'Total POs Issued')}</p>
          <p className="text-2xl font-extrabold text-emerald-500 tracking-tight">{reportData?.purchases_count ?? 0}</p>
          <p className="text-[11px] text-muted-foreground">Orders fulfilled</p>
        </div>
        <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
          <ShoppingCart size={22} />
        </div>
      </motion.div>

      {/* Card 4: Partner Reliability */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('suppliers.partnerStatus', 'Partner Status')}</p>
          <p className="text-2xl font-extrabold text-primary tracking-tight">Verified</p>
          <p className="text-[11px] text-muted-foreground">Enterprise compliance</p>
        </div>
        <div className="p-3.5 rounded-xl bg-primary/10 text-primary">
          <Award size={22} />
        </div>
      </motion.div>
    </div>
  )
}
