import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { RotateCcw, Wallet, CheckCircle, Truck } from 'lucide-react'
import { formatCurrency } from '../utils/purchaseCurrency'
import type { PurchaseReturn } from '../types/purchaseReturn.types'

interface PurchaseReturnsStatsCardsProps {
  returns: PurchaseReturn[]
  totalAmount: number
}

export const PurchaseReturnsStatsCards: React.FC<PurchaseReturnsStatsCardsProps> = ({
  returns,
  totalAmount,
}) => {
  const { t } = useTranslation(['purchases', 'common'])

  const approvedReturns = returns.filter(r => r.status === 'approved' || r.status === 'completed')
  const pendingReturns = returns.filter(r => r.status === 'draft' || r.status === 'pending')

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* Card 1: Total Returns */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
      >
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {t('purchases.totalReturns', 'Total Returns')}
          </p>
          <p className="text-2xl font-extrabold text-foreground tracking-tight font-mono">{returns.length}</p>
          <p className="text-[11px] text-muted-foreground">
            <span className="text-emerald-500 font-bold">{approvedReturns.length} {t('purchases.approved', 'Approved')}</span>
            <span className="mx-1.5">•</span>
            <span>{pendingReturns.length} {t('purchases.draft', 'Draft')}</span>
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
          <RotateCcw size={22} />
        </div>
      </motion.div>

      {/* Card 2: Return Amount */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
      >
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {t('purchases.returnedValue', 'Total Refund Value')}
          </p>
          <p className="text-xl font-extrabold text-foreground tracking-tight font-mono truncate max-w-[190px]">
            {formatCurrency(totalAmount, 'USD')}
          </p>
          <p className="text-[11px] text-muted-foreground font-mono">
            {formatCurrency(totalAmount * 4100, 'KHR')}
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <Wallet size={22} />
        </div>
      </motion.div>

      {/* Card 3: Approved */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
      >
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {t('purchases.approvedReturns', 'Approved & Shipped')}
          </p>
          <p className="text-2xl font-extrabold text-emerald-500 tracking-tight font-mono">{approvedReturns.length}</p>
          <p className="text-[11px] text-muted-foreground">
            {t('purchases.inventoryDebited', 'Inventory restocked / debited')}
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <CheckCircle size={22} />
        </div>
      </motion.div>

      {/* Card 4: Action Required */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
      >
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {t('purchases.pendingApproval', 'Pending Action')}
          </p>
          <p className="text-2xl font-extrabold text-blue-500 tracking-tight font-mono">{pendingReturns.length}</p>
          <p className="text-[11px] text-muted-foreground">
            {t('purchases.awaitingReview', 'Awaiting review / shipment')}
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
          <Truck size={22} />
        </div>
      </motion.div>
    </div>
  )
}
