import React from 'react'
import { DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Percent } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const DashboardRow5: React.FC = () => {
  const { t } = useTranslation()

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
            <span className="text-[11px] text-muted-foreground font-semibold">Incoming Cash</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-sm text-foreground">Rp 98.400.000</span>
              <span className="text-[10px] text-green-500 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +12.5%
              </span>
            </div>
          </div>
          <div className="border-t border-border/20 pt-3">
            <span className="text-[11px] text-muted-foreground font-semibold">Outgoing Expenses</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-sm text-foreground">Rp 24,120,000</span>
              <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5">
                <ArrowDownRight className="w-3 h-3" /> +3.2%
              </span>
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
            <span className="text-[11px] text-muted-foreground font-semibold">Accounts Receivable (Customer Due)</span>
            <h5 className="font-bold text-sm text-foreground mt-1">Rp 12.800.000</h5>
          </div>
          <div className="border-t border-border/20 pt-3">
            <span className="text-[11px] text-muted-foreground font-semibold">Accounts Payable (Supplier Due)</span>
            <h5 className="font-bold text-sm text-foreground mt-1">Rp 8.450.000</h5>
          </div>
        </div>
      </div>

      {/* Taxes & Net Margin */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Percent className="w-4 h-4 text-purple-500" />
          {t('finance.taxes_margin', 'Taxes & Margins')}
        </h4>
        <div className="space-y-4">
          <div>
            <span className="text-[11px] text-muted-foreground font-semibold">Accrued Tax Liability (VAT / GST)</span>
            <h5 className="font-bold text-sm text-foreground mt-1">Rp 4.950.000</h5>
          </div>
          <div className="border-t border-border/20 pt-3">
            <span className="text-[11px] text-muted-foreground font-semibold">Net Profit Margin</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-sm text-foreground">34.2%</span>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardRow5
