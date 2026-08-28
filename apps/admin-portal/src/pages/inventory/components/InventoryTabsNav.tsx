import React from 'react'
import { useTranslation } from 'react-i18next'
import { Layers, Activity, ArrowLeftRight, Sliders, CheckCircle2, TrendingUp } from 'lucide-react'
import WorkspaceTabs from '@/components/shared/WorkspaceTabs'

interface InventoryTabsNavProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export const InventoryTabsNav: React.FC<InventoryTabsNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { t } = useTranslation(['inventory', 'common'])

  const tabs = [
    { id: 'levels', label: t('tabs.levels', 'Stock Levels'), icon: Layers },
    { id: 'movements', label: t('tabs.movements', 'Stock Movements'), icon: Activity },
    { id: 'transfers', label: t('tabs.transfers', 'Stock Transfers'), icon: ArrowLeftRight },
    { id: 'adjustments', label: t('tabs.adjustments', 'Stock Adjustments'), icon: Sliders },
    { id: 'opnames', label: t('tabs.opnames', 'Stock Audits'), icon: CheckCircle2 },
    { id: 'dashboard', label: t('tabs.dashboard', 'Analytics & Reports'), icon: TrendingUp },
  ]

  return (
    <WorkspaceTabs
      tabs={tabs}
      activeTab={activeTab}
      onChange={onTabChange}
    />
  )
}

export default InventoryTabsNav
