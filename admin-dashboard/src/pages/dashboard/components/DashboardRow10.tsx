import React from 'react'
import { UserCheck, Landmark, Trophy, Briefcase } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const DashboardRow10: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Attendance & Payroll */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-blue-500" />
          {t('employees.attendance_payroll', 'Attendance & Payroll')}
        </h4>
        <div className="space-y-4">
          <div>
            <span className="text-[11px] text-muted-foreground font-semibold">Today's Attendance Rate</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-sm text-foreground">96.8%</span>
              <span className="text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Excellent</span>
            </div>
          </div>
          <div className="border-t border-border/20 pt-3">
            <span className="text-[11px] text-muted-foreground font-semibold">Total Payroll Assets</span>
            <h5 className="font-bold text-sm text-foreground mt-1">Rp 125,000,000</h5>
          </div>
        </div>
      </div>

      {/* Top Performing Employees */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-emerald-500" />
          {t('employees.top_employees', 'Top Performer')}
        </h4>
        <div className="flex items-center gap-3 py-1">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
            SO
          </div>
          <div>
            <span className="font-bold text-xs text-foreground block">Sak ousa</span>
            <span className="text-[10px] text-muted-foreground">POS Sales Champion (Rp 32,500,000 volume)</span>
          </div>
        </div>
      </div>

      {/* Active Departments */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-purple-500" />
          {t('employees.departments', 'Departments')}
        </h4>
        <div className="space-y-2">
          {[
            { dept: 'Sales & POS cashiering', count: 12 },
            { dept: 'Warehouse & Logistics', count: 8 },
            { dept: 'Marketing & SEO Management', count: 4 },
          ].map((d, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs py-0.5">
              <span className="text-muted-foreground">{d.dept}</span>
              <span className="font-bold text-foreground">{d.count} staff</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardRow10
