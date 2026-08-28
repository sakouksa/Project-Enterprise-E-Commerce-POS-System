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

  const monthlyPayroll = statsData?.monthly_salary_expense ?? 0
  const averageSalary = statsData?.average_salary ?? 0
  const pendingPayroll = statsData?.payroll_draft ?? 0

  return (
    <div className="space-y-4 print:hidden">
      {/* ─── 4 Main KPI Summary Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Employees */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t('employees.total_employees', t('total_employees', 'Total Employees'))}
            </p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              {totalEmployees}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-500 font-bold">
                {activeEmp} {t('employees.active', t('active', 'Active'))}
              </span>
              <span>•</span>
              <span className="text-slate-400">
                {resignedEmp} {t('employees.resigned', t('resigned', 'Resigned'))}
              </span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
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
              {t('employees.departments_positions', t('departments_positions', 'Departments & Positions'))}
            </p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              {totalDepts}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-blue-500 font-bold">
                {totalPositions} {t('employees.positions', t('positions', 'Positions'))}
              </span>
              <span>•</span>
              <span className="text-slate-400">
                {branchCount} {t('employees.branches', t('employees.branch', t('branch', 'Branches')))}
              </span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
            <Building size={22} />
          </div>
        </motion.div>

        {/* Card 3: Attendance Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t('employees.attendance_rate', t('attendance_rate', 'Attendance Rate'))}
            </p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              {attendanceRate}%
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-500 font-bold">
                {presentCount} {t('employees.present', t('present', 'Present'))}
              </span>
              <span>•</span>
              <span className="text-rose-500 font-bold">
                {absentCount} {t('employees.absent', t('absent', 'Absent'))}
              </span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
            <Activity size={22} />
          </div>
        </motion.div>

        {/* Card 4: Monthly Payroll */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1 min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t('employees.monthly_payroll', t('monthly_payroll', 'Monthly Payroll'))}
            </p>
            <p className="text-xl font-extrabold text-foreground tracking-tight font-mono truncate max-w-[190px]">
              ${monthlyPayroll.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {t('employees.avg', t('common.avg', 'Avg'))}: ${averageSalary.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}{' '}
              <span>•</span>{' '}
              <span className="text-amber-500 font-semibold">
                {pendingPayroll} {t('employees.pending', t('pending', 'Pending'))}
              </span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
            <Wallet size={22} />
          </div>
        </motion.div>
      </div>

      {/* ─── 6 Mini Secondary Stats Cards ────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Today */}
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            {t('employees.employee_today', t('employee_today', 'Employee Today'))}
          </span>
          <span className="text-lg font-extrabold font-mono text-foreground mt-1">
            {totalEmployees}
          </span>
        </div>

        {/* New Today */}
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider">
            {t('employees.new_today', t('new_today', 'New Today'))}
          </span>
          <span className="text-lg font-extrabold font-mono text-blue-500 mt-1">
            {statsData?.new_today_employees ?? 0}
          </span>
        </div>

        {/* Present Today */}
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
            {t('employees.present_today', t('present_today', 'Present Today'))}
          </span>
          <span className="text-lg font-extrabold font-mono text-emerald-500 mt-1">
            {presentCount}
          </span>
        </div>

        {/* Absent Today */}
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] text-rose-500 font-semibold uppercase tracking-wider">
            {t('employees.absent_today', t('absent_today', 'Absent Today'))}
          </span>
          <span className="text-lg font-extrabold font-mono text-rose-500 mt-1">
            {absentCount}
          </span>
        </div>

        {/* Late Today */}
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider">
            {t('employees.late_today', t('late_today', 'Late Today'))}
          </span>
          <span className="text-lg font-extrabold font-mono text-amber-500 mt-1">
            {lateCount}
          </span>
        </div>

        {/* On Leave */}
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] text-indigo-500 font-semibold uppercase tracking-wider">
            {t('employees.on_leave', t('on_leave', 'On Leave'))}
          </span>
          <span className="text-lg font-extrabold font-mono text-indigo-500 mt-1">
            {leaveCount}
          </span>
        </div>
      </div>
    </div>
  )
}

export default EmployeeStatsCards
