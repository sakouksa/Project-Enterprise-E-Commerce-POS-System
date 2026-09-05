import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Sparkles,
  Calculator,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Percent,
  ShieldCheck,
  DollarSign,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { employeeService } from '@/services/employeeService'
import { useToast } from '@/hooks/useToast'
import { EnterpriseModal, ModalFooter } from '@/components/common'

interface AutoGeneratePayrollModalProps {
  isOpen: boolean
  onClose: () => void
  branchesList?: any[]
}

export const AutoGeneratePayrollModal: React.FC<AutoGeneratePayrollModalProps> = ({
  isOpen,
  onClose,
  branchesList = [],
}) => {
  const { t } = useTranslation(['employees', 'common'])
  const qc = useQueryClient()
  const toast = useToast()

  const [periodMonth, setPeriodMonth] = useState(
    new Date().toISOString().substring(0, 7) // e.g. 2026-08
  )
  const [branchId, setBranchId] = useState('')
  const [resultSummary, setResultSummary] = useState<any | null>(null)

  const generateMutation = useMutation({
    mutationFn: (payload: { period_month: string; branch_id?: number }) =>
      employeeService.autoGeneratePayroll(payload),
    onSuccess: (data: any) => {
      setResultSummary(data)
      toast.success(t('employees.payroll_generated_success', 'Monthly payroll generated and calculated successfully!'))
      qc.invalidateQueries({ queryKey: ['payrolls'] })
      qc.invalidateQueries({ queryKey: ['employee-stats'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to auto-generate payroll')
    },
  })

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    setResultSummary(null)
    generateMutation.mutate({
      period_month: periodMonth,
      branch_id: branchId ? parseInt(branchId) : undefined,
    })
  }

  const handleClose = () => {
    setResultSummary(null)
    onClose()
  }

  return (
    <EnterpriseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('employees.auto_generate_payroll', 'Auto-Generate Monthly Payroll')}
      subtitle={t('employees.payroll_generator_subtitle', 'Automated Cambodian Labor Law, NSSF, Tax & POS Commission Engine')}
      icon={<Calculator size={20} />}
      iconVariant="blue"
      size="lg"
      footer={
        <ModalFooter
          onCancel={handleClose}
          cancelLabel={t('common.cancel', 'Cancel')}
          onSubmit={handleGenerate}
          isSubmitting={generateMutation.isPending}
          submitLabel={t('employees.auto_generate_payroll', 'Generate & Calculate')}
          submitVariant="primary"
        />
      }
    >
      <form onSubmit={handleGenerate} className="p-5 sm:p-6 space-y-4">
        {/* Policy & Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-muted/40 border border-border text-xs">
          <div className="flex items-start gap-2">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground">NSSF Cambodia</p>
              <p className="text-muted-foreground text-[11px]">2% Pension Scheme capped at $300 base salary ($6/mo max).</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Percent size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground">Tax on Salary</p>
              <p className="text-muted-foreground text-[11px]">Progressive brackets (0% - 20%) with dependent deductions.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <DollarSign size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground">POS Sales Commission</p>
              <p className="text-muted-foreground text-[11px]">Auto-aggregated from POS transactions in the selected month.</p>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              {t('employees.period_month', 'Payroll Period Month')} *
            </label>
            <input
              type="month"
              value={periodMonth}
              onChange={(e) => setPeriodMonth(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              {t('employees.branch', 'Branch')} (Optional)
            </label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background cursor-pointer"
            >
              <option value="">{t('employees.all_branches', 'All Branches')}</option>
              {branchesList.map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Summary (if generated) */}
        {resultSummary && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <CheckCircle2 size={18} />
              <span>Payroll Successfully Calculated for {resultSummary.period_month}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-card border border-border">
                <p className="text-muted-foreground text-[11px]">Employees Processed</p>
                <p className="text-base font-bold text-foreground">{resultSummary.generated_count}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border">
                <p className="text-muted-foreground text-[11px]">Total Gross Salary</p>
                <p className="text-base font-bold text-foreground">${resultSummary.total_gross?.toLocaleString()}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border">
                <p className="text-muted-foreground text-[11px]">Sales Commission</p>
                <p className="text-base font-bold text-amber-600 dark:text-amber-400">${resultSummary.total_commission?.toLocaleString()}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border">
                <p className="text-muted-foreground text-[11px]">NSSF Contributions</p>
                <p className="text-base font-bold text-blue-600 dark:text-blue-400">${resultSummary.total_nssf?.toLocaleString()}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border">
                <p className="text-muted-foreground text-[11px]">Salary Tax Deductions</p>
                <p className="text-base font-bold text-rose-600 dark:text-rose-400">${resultSummary.total_tax?.toLocaleString()}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-primary text-[11px] font-semibold">Total Net Payout</p>
                <p className="text-base font-bold text-primary">${resultSummary.total_net?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </EnterpriseModal>
  )
}

export default AutoGeneratePayrollModal
