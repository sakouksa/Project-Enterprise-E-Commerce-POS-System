import React from 'react'
import ModernSelect from '@/components/shared/ModernSelect'
import FilterDrawerShell from '@/components/shared/FilterDrawerShell'

interface UserFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  roles?: any[]
  filterStatus: string
  setFilterStatus: (val: string) => void
  filterRole: string
  setFilterRole: (val: string) => void
  filterStartDate: string
  setFilterStartDate: (val: string) => void
  filterEndDate: string
  setFilterEndDate: (val: string) => void
  filterVerified: string
  setFilterVerified: (val: string) => void
  filter2FA: string
  setFilter2FA: (val: string) => void
  onReset: () => void
}

const FL = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
    {children}
  </div>
)

const inputCls = "w-full text-xs font-semibold rounded-xl bg-card border border-border/80 hover:border-primary/40 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all py-2.5 px-3.5 text-foreground shadow-2xs"

export const UserFilterDrawer: React.FC<UserFilterDrawerProps> = ({
  isOpen, onClose,
  roles = [],
  filterStatus, setFilterStatus,
  filterRole, setFilterRole,
  filterStartDate, setFilterStartDate,
  filterEndDate, setFilterEndDate,
  filterVerified, setFilterVerified,
  filter2FA, setFilter2FA,
  onReset,
}) => {
  const activeCount = [filterStatus !== 'all' ? filterStatus : '', filterRole !== 'all' ? filterRole : '', filterStartDate, filterEndDate, filterVerified !== 'all' ? filterVerified : '', filter2FA !== 'all' ? filter2FA : ''].filter(Boolean).length

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin / Super Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'cashier', label: 'Cashier' },
    { value: 'staff', label: 'Staff' },
    ...roles.map((r: any) => ({ value: r.name, label: r.name }))
  ]

  return (
    <FilterDrawerShell
      isOpen={isOpen}
      onClose={onClose}
      onReset={onReset}
      title="Filter Users Directory"
      activeCount={activeCount}
    >
      <FL label="Account Status">
        <ModernSelect
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'active', label: 'Active Accounts' },
            { value: 'inactive', label: 'Inactive Accounts' },
            { value: 'blocked', label: 'Blocked / Suspended' },
          ]}
          placeholder="All Statuses"
        />
      </FL>

      <FL label="System Role">
        <ModernSelect
          value={filterRole}
          onChange={setFilterRole}
          options={roleOptions}
          placeholder="All Roles"
        />
      </FL>

      <FL label="Joined From Date">
        <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} className={inputCls} />
      </FL>

      <FL label="Joined To Date">
        <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} className={inputCls} />
      </FL>

      <FL label="Email Verification">
        <ModernSelect
          value={filterVerified}
          onChange={setFilterVerified}
          options={[
            { value: 'all', label: 'All Users' },
            { value: 'verified', label: 'Verified Emails Only' },
            { value: 'unverified', label: 'Unverified Only' },
          ]}
          placeholder="All Users"
        />
      </FL>

      <FL label="2FA Authentication">
        <ModernSelect
          value={filter2FA}
          onChange={setFilter2FA}
          options={[
            { value: 'all', label: 'All Users' },
            { value: 'enabled', label: '2FA Enabled' },
            { value: 'disabled', label: '2FA Disabled' },
          ]}
          placeholder="All Users"
        />
      </FL>
    </FilterDrawerShell>
  )
}

export default UserFilterDrawer
