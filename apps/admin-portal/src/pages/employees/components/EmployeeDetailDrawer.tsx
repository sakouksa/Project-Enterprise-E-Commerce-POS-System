import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Edit, Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmployeeAvatar } from './EmployeeAvatar'
import { 
  StatusBadge, 
  DetailDrawer, 
  DetailDrawerHeader, 
  DetailDrawerBody, 
  DetailDrawerFooter 
} from '@/components/common'

interface EmployeeDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedItem: any | null
  getPhotoUrl: (photoPath?: string) => string | null
}

export const EmployeeDetailDrawer: React.FC<EmployeeDetailDrawerProps> = ({
  isOpen,
  onClose,
  selectedItem,
  getPhotoUrl,
}) => {
  const { t } = useTranslation(['employees', 'common'])
  const navigate = useNavigate()

  if (!selectedItem) return null

  return (
    <DetailDrawer
      isOpen={isOpen && !!selectedItem}
      onClose={onClose}
      size="xl"
    >
      <DetailDrawerHeader
        icon={<User size={20} />}
        iconVariant="primary"
        title={t('employees.employeeProfileCard', 'Employee Profile Card')}
        subtitle={selectedItem.employee_number || selectedItem.email}
        badge={
          <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[11px] font-mono font-semibold border border-border/60">
            EMP-#{String(selectedItem.id).padStart(4, '0')}
          </span>
        }
        onClose={onClose}
      />

      <DetailDrawerBody>
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 bg-muted/40 dark:bg-slate-800/50 p-4 rounded-2xl border border-border dark:border-slate-700">
          <EmployeeAvatar
            photo={selectedItem.photo}
            name={selectedItem.name}
            id={selectedItem.id}
            size="xl"
            getPhotoUrl={getPhotoUrl}
          />
          <div>
            <h2 className="text-xl font-bold text-foreground dark:text-slate-100">{selectedItem.name}</h2>
            <p className="font-mono text-xs text-muted-foreground dark:text-slate-400">{selectedItem.employee_number}</p>
            <div className="mt-2">
              <StatusBadge status={selectedItem.status} />
            </div>
          </div>
        </div>

        {/* Profile Info Details Grid */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold border-b border-border/60 dark:border-slate-800 pb-1 text-muted-foreground dark:text-slate-400 uppercase">
            {t('employees.generalInfo', 'General Information')}
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">{t('employees.nik', 'National ID (NIK)')}</p>
              <p className="font-semibold text-foreground dark:text-slate-200">{selectedItem.nik ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">{t('employees.gender', 'Gender / Birth Date')}</p>
              <p className="font-semibold capitalize text-foreground dark:text-slate-200">
                {selectedItem.gender ?? '-'} {selectedItem.birth_date ? `| ${new Date(selectedItem.birth_date).toLocaleDateString()}` : ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">{t('employees.email', 'Email')}</p>
              <p className="font-semibold text-primary">{selectedItem.email ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">{t('employees.phone', 'Phone')}</p>
              <p className="font-semibold text-foreground dark:text-slate-200">{selectedItem.phone ?? '-'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground dark:text-slate-400">{t('employees.address', 'Home Address')}</p>
              <p className="font-semibold text-foreground dark:text-slate-200">{selectedItem.address ?? '-'}</p>
            </div>
          </div>

          <h4 className="text-sm font-semibold border-b border-border/60 dark:border-slate-800 pb-1 text-muted-foreground dark:text-slate-400 uppercase pt-4">
            {t('employees.employmentDetails', 'Employment Details')}
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">{t('employees.branch', 'Branch')}</p>
              <p className="font-semibold text-foreground dark:text-slate-200">{selectedItem.branch?.name ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">{t('employees.company', 'Company')}</p>
              <p className="font-semibold text-foreground dark:text-slate-200">{selectedItem.company?.name ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">{t('employees.department', 'Department')}</p>
              <p className="font-semibold text-foreground dark:text-slate-200">{selectedItem.department?.name ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">{t('employees.position', 'Position')}</p>
              <p className="font-semibold text-foreground dark:text-slate-200">{selectedItem.position?.name ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">{t('employees.basic_salary', 'Basic Salary')}</p>
              <p className="font-semibold font-mono text-primary text-base">${Number(selectedItem.basic_salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">{t('employees.join_date', 'Join Date / Resign Date')}</p>
              <p className="font-semibold text-foreground dark:text-slate-200">
                {selectedItem.join_date ? new Date(selectedItem.join_date).toLocaleDateString() : '-'}
                {selectedItem.resign_date ? ` / ${new Date(selectedItem.resign_date).toLocaleDateString()}` : ''}
              </p>
            </div>
          </div>

          <h4 className="text-sm font-semibold border-b border-border/60 dark:border-slate-800 pb-1 text-muted-foreground dark:text-slate-400 uppercase pt-4">
            {t('employees.workplaceSummary', 'Workplace Summary')}
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">{t('employees.attendanceSummary', 'Attendance Summary')}</p>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedItem.attendance_count ?? 0} {t('employees.checkins', 'Check-ins')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">{t('employees.payrollSummary', 'Payroll Summary')}</p>
              <p className="font-semibold text-primary">{selectedItem.payroll_count ?? 0} {t('employees.paySlips', 'Pay slips')}</p>
            </div>
          </div>
        </div>
      </DetailDrawerBody>

      <DetailDrawerFooter
        onClose={onClose}
        closeLabel={t('common.close', 'Close')}
        rightActions={
          <button
            type="button"
            onClick={() => {
              onClose()
              navigate(`/employees/${selectedItem.id}/edit`)
            }}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Edit size={14} />
            <span>{t('employees.editEmployee', 'Edit')}</span>
          </button>
        }
      />
    </DetailDrawer>
  )
}

export default EmployeeDetailDrawer
