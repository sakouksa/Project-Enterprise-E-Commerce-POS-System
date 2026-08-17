import React from 'react'
import ModernSelect from '@/components/shared/ModernSelect'
import FilterDrawerShell from '@/components/shared/FilterDrawerShell'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'

interface CustomerFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  statusFilter: string
  setStatusFilter: (val: string) => void
  groupIdFilter: string
  setGroupIdFilter: (val: string) => void
  genderFilter: string
  setGenderFilter: (val: string) => void
  groups: any[]
  onReset: () => void
}

const FL = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
    {children}
  </div>
)

export const CustomerFilterDrawer: React.FC<CustomerFilterDrawerProps> = ({
  isOpen, onClose,
  statusFilter, setStatusFilter,
  groupIdFilter, setGroupIdFilter,
  genderFilter, setGenderFilter,
  groups = [],
  onReset,
}) => {
  const { language } = useThemeStore()
  const { t } = useTranslation(['customers', 'common'])

  const activeCount = [statusFilter !== 'all' ? statusFilter : '', groupIdFilter, genderFilter].filter(Boolean).length

  return (
    <FilterDrawerShell
      isOpen={isOpen}
      onClose={onClose}
      onReset={onReset}
      title={t('filterCustomers', t('customers.filterCustomers', 'Filter Customers'))}
      activeCount={activeCount}
      applyLabel={t('applyFilters', t('customers.applyFilters', 'Apply Filters'))}
      resetLabel={t('resetFilters', t('customers.resetFilters', 'Reset Filters'))}
    >
      <FL label={t('accountStatus', t('customers.accountStatus', 'Account Status'))}>
        <ModernSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: t('allStatuses', t('customers.allStatuses', 'All Statuses')) },
            { value: 'active', label: t('activeAccounts', t('customers.activeAccounts', 'Active Accounts')) },
            { value: 'inactive', label: t('inactiveAccounts', t('customers.inactiveAccounts', 'Inactive Accounts')) },
          ]}
          placeholder={t('allStatuses', t('customers.allStatuses', 'All Statuses'))}
        />
      </FL>

      <FL label={t('customerGroup', t('customers.customerGroup', 'Customer Group'))}>
        <ModernSelect
          value={groupIdFilter}
          onChange={setGroupIdFilter}
          options={[
            { value: '', label: t('allGroups', t('customers.allGroups', 'All Groups')) },
            ...groups.map((g: any) => ({ value: String(g.id), label: g.name }))
          ]}
          placeholder={t('allGroups', t('customers.allGroups', 'All Groups'))}
        />
      </FL>

      <FL label={t('gender', t('customers.gender', 'Gender'))}>
        <ModernSelect
          value={genderFilter}
          onChange={setGenderFilter}
          options={[
            { value: '', label: t('allGenders', t('customers.allGenders', 'All Genders')) },
            { value: 'male', label: t('genderMale', t('customers.genderMale', 'Male')) },
            { value: 'female', label: t('genderFemale', t('customers.genderFemale', 'Female')) },
            { value: 'other', label: t('genderOther', t('customers.genderOther', 'Other')) },
          ]}
          placeholder={t('allGenders', t('customers.allGenders', 'All Genders'))}
        />
      </FL>
    </FilterDrawerShell>
  )
}

export default CustomerFilterDrawer
