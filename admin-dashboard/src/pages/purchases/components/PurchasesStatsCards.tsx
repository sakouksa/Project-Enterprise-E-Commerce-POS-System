import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ShoppingCart, Wallet, Truck, FileCheck } from 'lucide-react'
import { formatCurrency } from '../utils/purchaseCurrency'
import type { Purchase } from '../types/purchase.types'

interface PurchasesStatsCardsProps {
  reportData: any
  purchases: Purchase[]
  suppliersCount: number
}

export const PurchasesStatsCards: React.FC<PurchasesStatsCardsProps> = ({
  reportData,
  purchases,
  suppliersCount,
}) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4 print:hidden">
      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Purchases */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('purchases.totalPurchasesCard', 'Total Purchases')}</p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight">{reportData?.purchases_count ?? purchases.length}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="text-emerald-500 font-bold">
                {purchases.filter(p => p.status === 'completed' || p.status === 'received').length} {t('purchases.received', 'Received')}
              </span>
              <span>•</span>
              <span>
                {purchases.filter(p => p.status === 'pending' || p.status === 'ordered').length} {t('purchases.pending', 'Pending')}
              </span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500">
            <ShoppingCart size={22} />
          </div>
        </motion.div>

        {/* Card 2: Purchase Amount */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('purchases.purchaseAmountCard', 'Purchase Value')}</p>
            <p className="text-xl font-extrabold text-foreground tracking-tight truncate max-w-[190px]">
              {formatCurrency((Number(reportData?.total_purchases) || 0) / 4100, 'USD')}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-500 font-bold">{t('purchases.paid', 'Paid')}: {formatCurrency((Number(reportData?.total_paid) || 0) / 4100, 'USD')}</span>
              <span>•</span>
              <span className="text-rose-500">{t('purchases.due', 'Due')}: {formatCurrency((Number(reportData?.total_due) || 0) / 4100, 'USD')}</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Wallet size={22} />
          </div>
        </motion.div>

        {/* Card 3: Supplier Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('purchases.suppliersCard', 'Suppliers')}</p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight">{suppliersCount}</p>
            <p className="text-[11px] text-muted-foreground">
              <span className="font-semibold text-primary">{suppliersCount} {t('purchases.activeSuppliers', 'active suppliers')}</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
            <Truck size={22} />
          </div>
        </motion.div>

        {/* Card 4: Purchase Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('purchases.statusesCard', 'Purchase Status')}</p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight">{t('purchases.received', 'Received')}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-500 font-bold">{purchases.filter(p => p.status === 'completed').length} {t('purchases.comp', 'Comp')}</span>
              <span>•</span>
              <span className="text-blue-500">{purchases.filter(p => p.status === 'received').length} {t('purchases.recv', 'Recv')}</span>
              <span>•</span>
              <span className="text-rose-500">{purchases.filter(p => p.status === 'cancelled').length} {t('purchases.can', 'Can')}</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-500">
            <FileCheck size={22} />
          </div>
        </motion.div>
      </div>

      {/* Mini KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase">{t('purchases.todayPurchases', 'Today\'s Purchases')}</span>
          <span className="text-lg font-extrabold text-foreground mt-1">2</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-emerald-600 font-semibold uppercase">{t('purchases.thisMonthPurchases', 'This Month\'s Purchases')}</span>
          <span className="text-lg font-extrabold text-emerald-500 mt-1">{reportData?.purchases_count ?? purchases.length}</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-blue-500 font-semibold uppercase">{t('purchases.pendingReceiving', 'Pending Receiving')}</span>
          <span className="text-lg font-extrabold text-blue-500 mt-1">{purchases.filter(p => p.status === 'ordered' || p.status === 'partial').length}</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-rose-600 font-semibold uppercase">{t('purchases.outstandingPayment', 'Outstanding Payment')}</span>
          <span className="text-base font-extrabold text-rose-500 mt-1 truncate">
            {formatCurrency((Number(reportData?.total_due) || 0) / 4100, 'USD')}
          </span>
        </div>
      </div>
    </div>
  )
}
