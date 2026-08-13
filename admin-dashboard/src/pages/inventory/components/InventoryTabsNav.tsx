import React from 'react'
import { useTranslation } from 'react-i18next'
import { Layers, Activity, ArrowLeftRight, Sliders, CheckCircle2, TrendingUp } from 'lucide-react'

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
    { id: 'opnames', label: t('tabs.opnames', 'Stock Audits (Opname)'), icon: CheckCircle2 },
    { id: 'dashboard', label: t('tabs.dashboard', 'Analytics & Reports'), icon: TrendingUp },
  ]

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border/80 print:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Icon size={14} />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
