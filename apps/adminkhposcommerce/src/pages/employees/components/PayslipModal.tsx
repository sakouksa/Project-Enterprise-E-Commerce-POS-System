import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Printer,
  Download,
  X,
  Building2,
  User,
  Calendar,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { employeeService } from '@/services/employeeService'
import { EnterpriseModal } from '@/components/common'

interface PayslipModalProps {
  isOpen: boolean
  onClose: () => void
  payrollId: number | null
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  isOpen,
  onClose,
  payrollId,
}) => {
  const { t } = useTranslation(['employees', 'common'])

  const { data: payslip, isLoading } = useQuery({
    queryKey: ['payslip-detail', payrollId],
    queryFn: () => (payrollId ? employeeService.getPayslip(payrollId) : null),
    enabled: isOpen && !!payrollId,
  })

  const handlePrint = () => {
    window.print()
  }

  if (!isOpen) return null

  return (
    <EnterpriseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('employees.view_payslip', 'Employee Pay Slip')}
      subtitle={payslip?.payslip_number || 'Official Salary Document'}
      icon={<FileText size={20} />}
      iconVariant="blue"
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-muted-foreground">
            Currency: <span className="font-bold text-foreground">USD ($) & KHR (៛)</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
            >
              {t('common.close', 'Close')}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Printer size={14} />
              <span>{t('employees.print_payslip', 'Print Payslip')}</span>
            </button>
          </div>
        </div>
      }
    >
      {isLoading ? (
        <div className="py-16 text-center text-xs text-muted-foreground">
          Loading official payslip details...
        </div>
      ) : !payslip ? (
        <div className="py-12 text-center text-xs text-muted-foreground">
          Payslip information could not be found.
        </div>
      ) : (
        <div className="payslip-container p-6 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-6 text-foreground font-sans print:border-none print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-border/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                  OP
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">{payslip.company?.name || 'OptaPOS Enterprise'}</h2>
                  <p className="text-xs text-muted-foreground">{payslip.company?.address || 'Phnom Penh, Cambodia'}</p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold font-mono">
                {payslip.payslip_number}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Period: <span className="font-semibold text-foreground">{payslip.period_month}</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Issue Date: {payslip.issue_date}
              </p>
            </div>
          </div>

          {/* Employee & Bank Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
            <div>
              <p className="text-[11px] text-muted-foreground">Employee Name</p>
              <p className="font-bold text-foreground text-sm">{payslip.employee?.name}</p>
              <p className="text-[11px] font-mono text-muted-foreground">{payslip.employee?.employee_number}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Department & Role</p>
              <p className="font-semibold text-foreground">{payslip.employee?.department}</p>
              <p className="text-[11px] text-muted-foreground">{payslip.employee?.position}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Branch & NSSF No</p>
              <p className="font-semibold text-foreground">{payslip.employee?.branch}</p>
              <p className="text-[11px] font-mono text-muted-foreground">{payslip.employee?.nssf_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Bank Account Details</p>
              <p className="font-semibold text-foreground">{payslip.employee?.bank_name || 'ABA Bank'}</p>
              <p className="text-[11px] font-mono text-primary font-bold">{payslip.employee?.bank_account_no || '-'}</p>
            </div>
          </div>

          {/* Earnings & Deductions Breakdown Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* EARNINGS */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="bg-emerald-50 dark:bg-emerald-950/50 px-3.5 py-2 border-b border-border flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Earnings (ប្រាក់ចំណូល)</span>
                <span className="text-xs text-muted-foreground">Amount ($)</span>
              </div>
              <div className="p-3 text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Basic Salary (ប្រាក់ខែគោល)</span>
                  <span className="font-semibold text-foreground">${payslip.earnings?.basic_salary?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Allowances (ប្រាក់ឧបត្ថម្ភ)</span>
                  <span className="font-semibold text-foreground">${payslip.earnings?.allowances?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Overtime Pay (ប្រាក់ម៉ោងបន្ថែម)</span>
                  <span className="font-semibold text-foreground">${payslip.earnings?.overtime_pay?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">POS Sales Commission (កម្រៃជើងសារ)</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">${payslip.earnings?.sales_commission?.toFixed(2)}</span>
                </div>
                {payslip.earnings?.seniority_pay > 0 && (
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Seniority Payment (អតីតភាព)</span>
                    <span className="font-semibold text-foreground">${payslip.earnings?.seniority_pay?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <span>Gross Earnings</span>
                  <span>${payslip.earnings?.total_earnings?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* DEDUCTIONS */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="bg-rose-50 dark:bg-rose-950/50 px-3.5 py-2 border-b border-border flex justify-between items-center">
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300">Deductions (ការកាត់កង)</span>
                <span className="text-xs text-muted-foreground">Amount ($)</span>
              </div>
              <div className="p-3 text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">NSSF Cambodia (ប.ស.ស)</span>
                  <span className="font-semibold text-foreground">${payslip.deductions?.nssf_deduction?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Salary Tax (ពន្ធលើប្រាក់បៀវត្ស)</span>
                  <span className="font-semibold text-foreground">${payslip.deductions?.tax_deduction?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Other Deductions (កាត់ផ្សេងៗ)</span>
                  <span className="font-semibold text-foreground">${payslip.deductions?.other_deductions?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 text-xs font-bold text-rose-700 dark:text-rose-400">
                  <span>Total Deductions</span>
                  <span>${payslip.deductions?.total_deductions?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Net Payout Box */}
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <p className="text-xs font-semibold text-primary">NET SALARY PAYOUT (ប្រាក់ខែសុទ្ធទទួលបាន)</p>
              <p className="text-[11px] text-muted-foreground">Exchange Rate: 1 USD = {payslip.exchange_rate?.toLocaleString()} KHR</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-primary font-mono">${payslip.net_salary?.toFixed(2)}</p>
              <p className="text-xs font-bold text-muted-foreground font-mono">≈ {payslip.net_salary_khr?.toLocaleString()} ៛ (KHR)</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs text-muted-foreground border-t border-border/60">
            <div>
              <div className="h-12 border-b border-dashed border-border/80 mb-2"></div>
              <p className="font-semibold text-foreground">Employer / Authorized Signature</p>
              <p className="text-[11px]">Human Resources & Finance</p>
            </div>
            <div>
              <div className="h-12 border-b border-dashed border-border/80 mb-2"></div>
              <p className="font-semibold text-foreground">Employee Signature</p>
              <p className="text-[11px]">{payslip.employee?.name}</p>
            </div>
          </div>
        </div>
      )}
    </EnterpriseModal>
  )
}

export default PayslipModal
