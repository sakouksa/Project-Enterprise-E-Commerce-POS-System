import React from 'react'
import { DollarSign, Wallet, Percent } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface DashboardRow5Props {
  stats?: any
}

export const DashboardRow5: React.FC<DashboardRow5Props> = ({ stats }) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(i18n.language === 'km' ? 'km-KH' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val || 0)
  }

  const sales = stats?.today_sales || 0
  const expenses = stats?.today_expenses || 0
  const grossProfit = stats?.gross_profit || 0
  const netMargin = sales > 0 ? ((grossProfit - expenses) / sales) * 100 : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cash Flow Summary */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Wallet className="w-4 h-4 text-blue-500" />
          {t('finance.cash_flow', 'Net Cash Flow')}
        </h4>
        <div className="space-y-4">
          <div>
            <span className="text-[11px] text-muted-foreground font-semibold">{t('dashboard.todayIncome')}</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-sm text-foreground">{formatCurrency(stats?.today_income || sales)}</span>
            </div>
          </div>
          <div className="border-t border-border/20 pt-3">
            <span className="text-[11px] text-muted-foreground font-semibold">{t('dashboard.todayExpenses')}</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-sm text-foreground">{formatCurrency(expenses)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Receivables & Payables */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          {t('finance.receivables_payables', 'Receivables & Payables')}
        </h4>
        <div className="space-y-4">
          <div>
            <span className="text-[11px] text-muted-foreground font-semibold">{t('dashboard.pendingPayment')}</span>
            <h5 className="font-bold text-sm text-foreground mt-1">{formatCurrency(stats?.pending_payments || 0)}</h5>
          </div>
          <div className="border-t border-border/20 pt-3">
            <span className="text-[11px] text-muted-foreground font-semibold">{t('dashboard.pendingPurchase')}</span>
            <h5 className="font-bold text-sm text-foreground mt-1">{formatCurrency(stats?.today_purchases || 0)}</h5>
          </div>
        </div>
      </div>

      {/* Net Profit Margin */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Percent className="w-4 h-4 text-purple-500" />
          {t('dashboard.profitTrend', 'Profit Margin Trend')}
        </h4>
        <div className="space-y-4">
          <div>
            <span className="text-[11px] text-muted-foreground font-semibold">{t('dashboard.grossProfit')}</span>
            <h5 className="font-bold text-sm text-foreground mt-1">{formatCurrency(grossProfit)}</h5>
          </div>
          <div className="border-t border-border/20 pt-3">
            <span className="text-[11px] text-muted-foreground font-semibold">{t('dashboard.netProfit')}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-sm text-foreground">{netMargin.toFixed(1)}%</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {netMargin >= 0 ? 'Positive' : 'Deficit'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardRow5
