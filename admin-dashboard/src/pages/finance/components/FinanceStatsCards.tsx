import React from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Wallet, Receipt, Landmark } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FinanceStatsCardsProps {
  allSales?: any[]
  allExpenses?: any[]
  allRegisters?: any[]
}

export const FinanceStatsCards: React.FC<FinanceStatsCardsProps> = ({
  allSales = [],
  allExpenses = [],
  allRegisters = [],
}) => {
  const { t } = useTranslation(['finance', 'common'])

  const totalSalesVal = (allSales ?? []).reduce((acc: number, item: any) => {
    const val = parseFloat(item.total_amount ?? item.grand_total ?? item.total ?? 0)
    return acc + (isNaN(val) ? 0 : val)
  }, 0)

  const totalExpensesVal = (allExpenses ?? []).reduce((acc: number, item: any) => {
    const val = parseFloat(item.amount ?? 0)
    return acc + (isNaN(val) ? 0 : val)
  }, 0)

  const totalNetLedgerVal = Math.max(0, totalSalesVal - totalExpensesVal)

  const totalRegisterBalance = (allRegisters ?? []).reduce((acc: number, item: any) => {
    const val = parseFloat(item.closing_balance ?? item.opening_balance ?? item.balance ?? 0)
    return acc + (isNaN(val) ? 0 : val)
  }, 0)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* CARD 1: Total Revenue & Sales */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all"
      >
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {t('finance.total_income', 'Gross Sales Revenue')}
          </p>
          <div className="text-2xl font-extrabold text-foreground tracking-tight">
            ${totalSalesVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            POS & Online Orders Included
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
          <DollarSign size={24} />
        </div>
      </motion.div>

      {/* CARD 2: Total Operating Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all"
      >
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {t('finance.total_expenses', 'Operating Expenses')}
          </p>
          <div className="text-2xl font-extrabold text-foreground tracking-tight">
            ${totalExpensesVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-rose-500 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Approved Expenses Ledger
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-500">
          <Receipt size={24} />
        </div>
      </motion.div>

      {/* CARD 3: Net Cash Balance */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all"
      >
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {t('finance.net_income', 'Net Profits Balance')}
          </p>
          <div className="text-2xl font-extrabold text-primary tracking-tight">
            ${totalNetLedgerVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            Revenue minus Operating Costs
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-primary/10 text-primary">
          <Wallet size={24} />
        </div>
      </motion.div>

      {/* CARD 4: Total Register Holdings */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all"
      >
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {t('finance.cash_reserves', 'Cash Register Reserves')}
          </p>
          <div className="text-2xl font-extrabold text-foreground tracking-tight">
            ${totalRegisterBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            Active POS Till Drawers ({allRegisters.length} tills)
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500">
          <Landmark size={24} />
        </div>
      </motion.div>
    </div>
  )
}

export default FinanceStatsCards
