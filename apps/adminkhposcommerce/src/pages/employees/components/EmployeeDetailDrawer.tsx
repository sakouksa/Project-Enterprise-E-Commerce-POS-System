import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Edit,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmployeeAvatar } from './EmployeeAvatar'
import {
  StatusBadge,
  DetailDrawer,
  DetailDrawerHeader,
  DetailDrawerBody,
  DetailDrawerFooter,
  ActionButton,
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
        <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-2xl border border-border">
          <EmployeeAvatar
            photo={selectedItem.photo}
            name={selectedItem.name}
            id={selectedItem.id}
            size="xl"
            getPhotoUrl={getPhotoUrl}
          />
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">{selectedItem.name}</h2>
            <p className="font-mono text-xs text-muted-foreground">{selectedItem.employee_number}</p>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <StatusBadge status={selectedItem.status} />
              {selectedItem.is_driver && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  🚚 Rider / Driver
                </span>
              )}
              {selectedItem.is_pos_supervisor && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  ⭐ POS Supervisor
                </span>
              )}
              {selectedItem.contract_type && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 uppercase">
                  {selectedItem.contract_type}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {/* SECTION 1: GENERAL INFO */}
          <div>
            <h4 className="text-xs font-bold border-b border-border/60 pb-1.5 text-muted-foreground uppercase tracking-wider mb-3">
              {t('employees.generalInfo', 'General Information')}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              <div>
                <p className="text-muted-foreground">{t('employees.nik', 'National ID (NIK)')}</p>
                <p className="font-semibold text-foreground font-mono">{selectedItem.nik ?? '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('employees.gender', 'Gender / Birth Date')}</p>
                <p className="font-semibold capitalize text-foreground">
                  {selectedItem.gender ?? '-'} {selectedItem.birth_date ? `| ${new Date(selectedItem.birth_date).toLocaleDateString()}` : ''}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('employees.email', 'Email')}</p>
                <p className="font-semibold text-primary">{selectedItem.email ?? '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('employees.phone', 'Phone')}</p>
                <p className="font-semibold text-foreground font-mono">{selectedItem.phone ?? '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">{t('employees.address', 'Home Address')}</p>
                <p className="font-semibold text-foreground">{selectedItem.address ?? '-'}</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: EMPLOYMENT & HIERARCHY */}
          <div>
            <h4 className="text-xs font-bold border-b border-border/60 pb-1.5 text-muted-foreground uppercase tracking-wider mb-3">
              {t('employees.employmentDetails', 'Employment & Structure')}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              <div>
                <p className="text-muted-foreground">{t('employees.branch', 'Branch')}</p>
                <p className="font-semibold text-foreground">{selectedItem.branch?.name ?? '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('employees.company', 'Company')}</p>
                <p className="font-semibold text-foreground">{selectedItem.company?.name ?? '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('employees.department', 'Department')}</p>
                <p className="font-semibold text-foreground">{selectedItem.department?.name ?? '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('employees.position', 'Position')}</p>
                <p className="font-semibold text-foreground">{selectedItem.position?.name ?? '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('employees.reporting_to', 'Reporting To (Manager)')}</p>
                <p className="font-semibold text-foreground">{selectedItem.manager?.name ?? 'Top Management'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('employees.contract_type', 'Contract & Expiry')}</p>
                <p className="font-semibold uppercase text-foreground">
                  {selectedItem.contract_type ?? 'UDC'} {selectedItem.contract_end_date ? `(Exp: ${selectedItem.contract_end_date})` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: POS & SECURITY */}
          <div>
            <h4 className="text-xs font-bold border-b border-border/60 pb-1.5 text-muted-foreground uppercase tracking-wider mb-3">
              {t('employees.pos_security', 'Point of Sale (POS) & Cashier Security')}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              <div>
                <p className="text-muted-foreground">{t('employees.pos_pin', 'Quick POS PIN')}</p>
                <p className="font-semibold font-mono text-foreground">
                  {selectedItem.has_pos_pin || selectedItem.pos_pin ? '•••• (Configured)' : 'Not Set'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('employees.card_uid', 'RFID / Badge Card')}</p>
                <p className="font-semibold font-mono text-foreground">{selectedItem.card_uid ?? 'None'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('employees.sales_commission_rate', 'Sales Commission Rate')}</p>
                <p className="font-bold text-amber-600 dark:text-amber-400">{selectedItem.sales_commission_rate ?? 0}% per sale</p>
              </div>
              <div>
                <p className="text-muted-foreground">Manager Override Rights</p>
                <p className="font-semibold text-foreground">
                  {selectedItem.is_pos_supervisor ? 'Discount & Void Allowed' : 'Standard Cashier'}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: DRIVER & LOGISTICS */}
          {selectedItem.is_driver && (
            <div>
              <h4 className="text-xs font-bold border-b border-border/60 pb-1.5 text-muted-foreground uppercase tracking-wider mb-3">
                {t('employees.logistics', 'Delivery Logistics & Fleet')}
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <div>
                  <p className="text-muted-foreground">{t('employees.driver_license_no', 'Driver License')}</p>
                  <p className="font-bold font-mono text-foreground">{selectedItem.driver_license_no || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('employees.vehicle_plate_no', 'Vehicle Plate No')}</p>
                  <p className="font-bold font-mono text-foreground">{selectedItem.vehicle_plate_no || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">{t('employees.driver_status', 'Current Driver Duty Status')}</p>
                  <p className="font-bold capitalize text-emerald-600 dark:text-emerald-400">{selectedItem.driver_status || 'Available'}</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: CAMBODIA COMPLIANCE & BANK */}
          <div>
            <h4 className="text-xs font-bold border-b border-border/60 pb-1.5 text-muted-foreground uppercase tracking-wider mb-3">
              {t('employees.cambodiaCompliance', 'Cambodia Compensation, NSSF & Banking')}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              <div>
                <p className="text-muted-foreground">{t('employees.basic_salary', 'Basic Salary ($ USD)')}</p>
                <p className="font-bold font-mono text-primary text-sm">${Number(selectedItem.basic_salary).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('employees.nssf_number', 'NSSF Number (ប.ស.ស)')}</p>
                <p className="font-semibold font-mono text-foreground">{selectedItem.nssf_number || 'Enrolled'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('employees.bank_name', 'Bank Name')}</p>
                <p className="font-semibold text-foreground">{selectedItem.bank_name || 'ABA Bank'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('employees.bank_account_number', 'Bank Account No')}</p>
                <p className="font-bold font-mono text-foreground">{selectedItem.bank_account_number || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">{t('employees.bank_account_holder', 'Account Holder Name')}</p>
                <p className="font-bold uppercase text-foreground">{selectedItem.bank_account_holder || selectedItem.name}</p>
              </div>
            </div>
          </div>
        </div>
      </DetailDrawerBody>

      <DetailDrawerFooter
        onClose={onClose}
        closeLabel={t('common.close', 'Close')}
        rightActions={
          <ActionButton
            variant="primary"
            icon={<Edit size={14} />}
            label={t('employees.editEmployee', 'Edit Employee')}
            onClick={() => {
              onClose()
              navigate(`/employees/${selectedItem.id}/edit`)
            }}
          >
            {t('employees.editEmployee', 'Edit Employee')}
          </ActionButton>
        }
      />
    </DetailDrawer>
  )
}

export default EmployeeDetailDrawer
