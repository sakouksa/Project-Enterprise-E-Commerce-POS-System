import React from 'react'
import { useTranslation } from 'react-i18next'
import ModernSelect from '@/components/shared/ModernSelect'
import FilterDrawerShell from '@/components/shared/FilterDrawerShell'
import type { TabType } from '../types'

interface FinanceFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeTab: TabType
  categories: any[]
  filterType: string
  setFilterType: (val: string) => void
  filterStatus: string
  setFilterStatus: (val: string) => void
  filterAccount: string
  setFilterAccount: (val: string) => void
  filterCategory: string
  setFilterCategory: (val: string) => void
  filterPaymentMethod: string
  setFilterPaymentMethod: (val: string) => void
  filterDateStart: string
  setFilterDateStart: (val: string) => void
  filterDateEnd: string
  setFilterDateEnd: (val: string) => void
  filterAmountMin: string
  setFilterAmountMin: (val: string) => void
  filterAmountMax: string
  setFilterAmountMax: (val: string) => void
  filterCreatedBy: string
  setFilterCreatedBy: (val: string) => void
  onReset: () => void
}

const FL = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
    {children}
  </div>
)

const inputCls = "w-full text-xs font-semibold rounded-xl bg-card border border-border/80 hover:border-primary/40 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all py-2.5 px-3.5 text-foreground shadow-2xs"

export const FinanceFilterDrawer: React.FC<FinanceFilterDrawerProps> = ({
  isOpen, onClose,
  activeTab, categories = [],
  filterType, setFilterType,
  filterStatus, setFilterStatus,
  filterAccount, setFilterAccount,
  filterCategory, setFilterCategory,
  filterPaymentMethod, setFilterPaymentMethod,
  filterDateStart, setFilterDateStart,
  filterDateEnd, setFilterDateEnd,
  filterAmountMin, setFilterAmountMin,
  filterAmountMax, setFilterAmountMax,
  filterCreatedBy, setFilterCreatedBy,
  onReset,
}) => {
  const { t } = useTranslation(['finance', 'common'])
  const activeCount = [filterStatus, filterCategory, filterDateStart, filterDateEnd, filterAmountMin, filterAmountMax].filter(Boolean).length

  const categoryOptions = [
    { value: '', label: t('finance.all_categories', 'All Categories') },
    ...categories.map((c) => ({ value: String(c.id), label: c.name }))
  ]

  return (
    <FilterDrawerShell
      isOpen={isOpen}
      onClose={onClose}
      onReset={onReset}
      title={t('finance.filter_title', 'Filter Ledger Records')}
      activeCount={activeCount}
      resetLabel={t('common.reset', 'Reset Filters')}
    >
      <FL label={t('finance.status_col', 'Status')}>
        <ModernSelect
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: '', label: t('finance.all_statuses', 'All Statuses') },
            { value: 'approved', label: t('finance.status_approved', 'Approved') },
            { value: 'pending', label: t('finance.status_pending', 'Pending') },
            { value: 'rejected', label: t('finance.status_rejected', 'Rejected') },
            { value: 'active', label: t('finance.status_active', 'Active') },
            { value: 'inactive', label: t('finance.status_inactive', 'Inactive') },
            { value: 'open', label: t('finance.status_open', 'Open Till') },
            { value: 'closed', label: t('finance.status_closed', 'Closed Till') },
          ]}
          placeholder={t('finance.all_statuses', 'All Statuses')}
        />
      </FL>

      {activeTab === 'expenses' && (
        <FL label={t('finance.category_col', 'Category')}>
          <ModernSelect
            value={filterCategory}
            onChange={setFilterCategory}
            options={categoryOptions}
            placeholder={t('finance.all_categories', 'All Categories')}
          />
        </FL>
      )}

      <FL label={t('finance.from_date', 'From Date')}>
        <input type="date" value={filterDateStart} onChange={e => setFilterDateStart(e.target.value)} className={inputCls} />
      </FL>

      <FL label={t('finance.to_date', 'To Date')}>
        <input type="date" value={filterDateEnd} onChange={e => setFilterDateEnd(e.target.value)} className={inputCls} />
      </FL>

      <div className="grid grid-cols-2 gap-2.5">
        <FL label={t('finance.min_amount', 'Min Amount')}>
          <input type="number" value={filterAmountMin} onChange={e => setFilterAmountMin(e.target.value)} placeholder="0" className={inputCls} />
        </FL>
        <FL label={t('finance.max_amount', 'Max Amount')}>
          <input type="number" value={filterAmountMax} onChange={e => setFilterAmountMax(e.target.value)} placeholder="99999" className={inputCls} />
        </FL>
      </div>
    </FilterDrawerShell>
  )
}

export default FinanceFilterDrawer
