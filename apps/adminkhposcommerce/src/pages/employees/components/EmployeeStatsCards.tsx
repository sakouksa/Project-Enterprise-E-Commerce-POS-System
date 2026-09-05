import React from 'react'
import {
  Users,
  Building2,
  Activity,
  Wallet,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EnterpriseStatsCard, EnterpriseStatsGrid } from '@/components/common'
import type { EmployeeStatsData } from '../types'

interface EmployeeStatsCardsProps {
  statsData?: EmployeeStatsData
  empListLength?: number
  activeCount?: number
  resignedCount?: number
  deptCount?: number
  posCount?: number
  branchCount?: number
  totalSalarySum?: number
}

export const EmployeeStatsCards: React.FC<EmployeeStatsCardsProps> = ({
  statsData,
  empListLength = 0,
  activeCount = 0,
  resignedCount = 0,
  deptCount = 0,
  posCount = 0,
  branchCount = 0,
  totalSalarySum = 0,
}) => {
  const { t } = useTranslation(['employees', 'common'])

  const totalEmployees = statsData?.total_employees ?? empListLength
  const activeEmp = statsData?.active_employees ?? activeCount
  const resignedEmp = statsData?.resigned_employees ?? resignedCount

  const totalDepts = statsData?.total_departments ?? deptCount
  const totalPositions = statsData?.total_positions ?? posCount

  const presentCount = statsData?.attendance_today?.present ?? 0
  const lateCount = statsData?.attendance_today?.late ?? 0
  const absentCount = statsData?.attendance_today?.absent ?? 0
  const leaveCount = statsData?.attendance_today?.leave ?? 0
  const holidayCount = statsData?.attendance_today?.holiday ?? 0
  const totalToday = presentCount + lateCount + absentCount + leaveCount + holidayCount
  const attendanceRate = totalToday > 0 ? Math.round(((presentCount + lateCount) / totalToday) * 100) : 100

  const monthlyPayroll = Number(statsData?.monthly_salary_expense || totalSalarySum || 0)
  const averageSalary = Number(
    statsData?.average_salary || (activeEmp > 0 ? monthlyPayroll / activeEmp : 0)
  )
  const pendingPayroll = Number(statsData?.payroll_draft ?? 0)

  return (
    <div className="print:hidden">
      {/* ─── 4 Main Enterprise KPI Summary Cards ─────────────────────────── */}
      <EnterpriseStatsGrid columns={4}>
        {/* Card 1: Total Workforce */}
        <EnterpriseStatsCard
          title={t('employees.total_employees', 'Total Workforce')}
          value={totalEmployees}
          subtitle={
            <span className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {activeEmp} {t('employees.active', 'Active')}
              </span>
              <span>•</span>
              <span className="text-slate-400 font-medium">
                {resignedEmp} {t('employees.resigned', 'Resigned')}
              </span>
            </span>
          }
          icon={Users}
          variant="purple"
        />

        {/* Card 2: Org & Positions */}
        <EnterpriseStatsCard
          title={t('employees.departments_positions', 'Organization & Roles')}
          value={totalDepts}
          subtitle={
            <span className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {totalPositions} {t('employees.positions', 'Positions')}
              </span>
              <span>•</span>
              <span className="text-slate-400 font-medium">
                {branchCount} {t('employees.branches', 'Branches')}
              </span>
            </span>
          }
          icon={Building2}
          variant="blue"
          delay={0.05}
        />

        {/* Card 3: Attendance Performance */}
        <EnterpriseStatsCard
          title={t('employees.attendance_rate', 'Daily Attendance Rate')}
          value={attendanceRate}
          suffix="%"
          subtitle={
            <span className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {presentCount} {t('employees.present', 'Present')}
              </span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                {lateCount} {t('employees.late', 'Late')}
              </span>
              <span>•</span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                {absentCount} {t('employees.absent', 'Absent')}
              </span>
            </span>
          }
          icon={Activity}
          variant="emerald"
          delay={0.1}
        />

        {/* Card 4: Monthly Payroll */}
        <EnterpriseStatsCard
          title={t('employees.monthly_payroll', 'Monthly Payroll Expense')}
          value={monthlyPayroll}
          prefix="$"
          decimals={2}
          valueClassName="text-primary"
          subtitle={
            <span className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="font-semibold text-foreground">
                {t('employees.avg', 'Avg')}: ${Number(averageSalary).toFixed(0)}
              </span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                {pendingPayroll} {t('employees.pending', 'Pending')}
              </span>
            </span>
          }
          icon={Wallet}
          variant="amber"
          delay={0.15}
        />
      </EnterpriseStatsGrid>
    </div>
  )
}

export default EmployeeStatsCards

