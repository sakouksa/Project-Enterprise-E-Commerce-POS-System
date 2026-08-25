import React from 'react'
import ModernSelect from '@/components/shared/ModernSelect'
import FilterDrawerShell from '@/components/shared/FilterDrawerShell'
import { useTranslation } from 'react-i18next'

interface BannerFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  positionFilter: string
  setPositionFilter: (val: string) => void
  statusFilter: string
  setStatusFilter: (val: string) => void
  onReset: () => void
}

const FL = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
    {children}
  </div>
)

export const BannerFilterDrawer: React.FC<BannerFilterDrawerProps> = ({
  isOpen,
  onClose,
  positionFilter,
  setPositionFilter,
  statusFilter,
  setStatusFilter,
  onReset,
}) => {
  const { t } = useTranslation(['marketing', 'customers', 'common'])

  const activeCount = [positionFilter !== 'all' ? positionFilter : '', statusFilter !== 'all' ? statusFilter : ''].filter(Boolean).length

  return (
    <FilterDrawerShell
      isOpen={isOpen}
      onClose={onClose}
      onReset={onReset}
      title={t('filterBanners', t('marketing.filterBanners', 'តម្រងផ្ទាំងបដា'))}
      activeCount={activeCount}
      applyLabel={t('applyFilters', t('customers.applyFilters', 'អនុវត្តតម្រង'))}
      resetLabel={t('resetFilters', t('customers.resetFilters', 'កំណត់ឡើងវិញ'))}
    >
      {/* Position Filter */}
      <FL label={t('position', t('marketing.position', 'ទីតាំងបង្ហាញ'))}>
        <ModernSelect
          value={positionFilter}
          onChange={setPositionFilter}
          options={[
            { value: 'all', label: t('allPositions', t('marketing.allPositions', 'គ្រប់ទីតាំងទាំងអស់')) },
            { value: 'hero', label: t('posHero', t('marketing.posHero', 'ផ្ទាំងបដាធំទំព័រដើម')) },
            { value: 'sidebar', label: t('posSidebar', t('marketing.posSidebar', 'ផ្ទាំងបដាចំហៀង')) },
            { value: 'popup', label: t('posPopup', t('marketing.posPopup', 'ផ្ទាំងបដាផុសឡើង')) },
            { value: 'footer', label: t('posFooter', t('marketing.posFooter', 'ផ្ទាំងបដាខាងក្រោម')) },
          ]}
          placeholder={t('allPositions', t('marketing.allPositions', 'គ្រប់ទីតាំងទាំងអស់'))}
        />
      </FL>

      {/* Status Filter */}
      <FL label={t('activeStatus', t('marketing.activeStatus', 'ស្ថានភាព'))}>
        <ModernSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: t('allStatuses', t('marketing.allStatuses', 'គ្រប់ស្ថានភាពទាំងអស់')) },
            { value: 'active', label: t('active', t('marketing.active', 'សកម្ម')) },
            { value: 'inactive', label: t('inactive', t('marketing.inactive', 'អសកម្ម')) },
          ]}
          placeholder={t('allStatuses', t('marketing.allStatuses', 'គ្រប់ស្ថានភាពទាំងអស់'))}
        />
      </FL>
    </FilterDrawerShell>
  )
}

export default BannerFilterDrawer
