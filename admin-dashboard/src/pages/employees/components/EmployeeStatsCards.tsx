import React from 'react'
import { motion } from 'framer-motion'
import { Users, Building, Activity, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { EmployeeStatsData } from '../types'

interface EmployeeStatsCardsProps {
  statsData?: EmployeeStatsData
  empListLength?: number
  activeCount?: number
  resignedCount?: number
  deptCount?: number
  posCount?: number
  branchCount?: number
}

export const EmployeeStatsCards: React.FC<EmployeeStatsCardsProps> = ({
  statsData,
  empListLength = 0,
  activeCount = 0,
  resignedCount = 0,
  deptCount = 0,
  posCount = 0,
  branchCount = 0,
}) => {
  const { t } = useTranslation(['employees', 'common'])

  const presentCount = statsData?.attendance_today?.present ?? 0
  const lateCount = statsData?.attendance_today?.late ?? 0
  const absentCount = statsData?.attendance_today?.absent ?? 0
  const leaveCount = statsData?.attendance_today?.leave ?? 0
  const holidayCount = statsData?.attendance_today?.holiday ?? 0
  const totalToday = presentCount + lateCount + absentCount + leaveCount + holidayCount
  const attendanceRate = totalToday > 0 ? Math.round(((presentCount + lateCount) / totalToday) * 100) : 100

  const monthlyPayroll = statsData?.monthly_salary_expense ?? 0
  const averageSalary = statsData?.average_salary ?? 0

  return (
    <div className="space-y-4 print:hidden">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Employees */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t('employees.total_employees', 'Total Employees')}
            </p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              {statsData?.total_employees ?? empListLength}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-green-500 font-bold">
                {statsData?.active_employees ?? activeCount} {t('employees.active', 'Active')}
              </span>
              <span>•</span>
              <span>
                {statsData?.resigned_employees ?? resignedCount} {t('employees.resigned', 'Resigned')}
              </span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500">
            <Users size={22} />
          </div>
        </motion.div>

        {/* Card 2: Departments & Positions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t('employees.departments_positions', 'Departments & Positions')}
            </p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              {statsData?.total_departments ?? deptCount}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-blue-500 font-bold">
                {statsData?.total_positions ?? posCount} {t('employees.positions', 'Positions')}
              </span>
              <span>•</span>
              <span>{branchCount} {t('employees.branch', 'Branches')}</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
            <Building size={22} />
          </div>
        </motion.div>

        {/* Card 3: Employee Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t('employees.attendance_rate', 'Attendance Rate')}
            </p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">{attendanceRate}%</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-500 font-bold">{presentCount} {t('employees.present', 'Present')}</span>
              <span>•</span>
              <span className="text-rose-500 font-bold">{absentCount} {t('employees.absent', 'Absent')}</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Activity size={22} />
          </div>
        </motion.div>

        {/* Card 4: Payroll Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t('employees.monthly_payroll', 'Monthly Payroll')}
            </p>
            <p className="text-xl font-extrabold text-foreground tracking-tight truncate max-w-[190px]">
              ${monthlyPayroll.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Avg: ${averageSalary.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} |{' '}
              <span className="text-amber-500 font-semibold">{statsData?.payroll_draft ?? 0} {t('employees.pending', 'Pending')}</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Wallet size={22} />
          </div>
        </motion.div>
      </div>

      {/* Second Row Mini Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase">{t('employees.employee_today', 'Employee Today')}</span>
          <span className="text-lg font-extrabold text-foreground mt-1">
            {statsData?.total_employees ?? empListLength}
          </span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-blue-500 font-semibold uppercase">{t('employees.new_today', 'New Today')}</span>
          <span className="text-lg font-extrabold text-blue-500 mt-1">
            {statsData?.new_today_employees ?? 0}
          </span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-emerald-600 font-semibold uppercase">{t('employees.present_today', 'Present Today')}</span>
          <span className="text-lg font-extrabold text-emerald-500 mt-1">{presentCount}</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-rose-500 font-semibold uppercase">{t('employees.absent_today', 'Absent Today')}</span>
          <span className="text-lg font-extrabold text-rose-500 mt-1">{absentCount}</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-amber-500 font-semibold uppercase">{t('employees.late_today', 'Late Today')}</span>
          <span className="text-lg font-extrabold text-amber-500 mt-1">{lateCount}</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-indigo-500 font-semibold uppercase">{t('employees.on_leave', 'On Leave')}</span>
          <span className="text-lg font-extrabold text-indigo-500 mt-1">{leaveCount}</span>
        </div>
      </div>
    </div>
  )
}

export default EmployeeStatsCards
