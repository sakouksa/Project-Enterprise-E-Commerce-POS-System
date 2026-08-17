import React from 'react'
import type { LucideIcon } from 'lucide-react'

export interface WorkspaceTabItem {
  id: string
  label: string
  icon?: LucideIcon | React.ComponentType<{ size?: number; className?: string }> | React.ReactNode
  count?: number | string
  badge?: React.ReactNode
  disabled?: boolean
}

export interface WorkspaceTabsProps {
  tabs: WorkspaceTabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'pill' | 'segmented' | 'underline'
  rightContent?: React.ReactNode
}

export const WorkspaceTabs: React.FC<WorkspaceTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  size = 'md',
  variant = 'pill',
  rightContent,
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-xs sm:text-[13px] font-bold gap-2',
    lg: 'px-4 py-2.5 text-sm font-bold gap-2.5',
  }

  const iconSizes = {
    sm: 13,
    md: 14,
    lg: 16,
  }

  // Render Icon helper (supports LucideIcon component or ReactNode)
  const renderIcon = (
    icon: WorkspaceTabItem['icon'],
    isActive: boolean
  ) => {
    if (!icon) return null

    if (React.isValidElement(icon)) {
      return icon
    }

    const IconComponent = icon as React.ComponentType<{ size?: number; className?: string }>
    return (
      <IconComponent
        size={iconSizes[size]}
        className={`shrink-0 transition-colors ${
          isActive ? 'text-primary-foreground' : 'text-muted-foreground/75 group-hover:text-foreground'
        }`}
      />
    )
  }

  if (variant === 'underline') {
    return (
      <div
        role="tablist"
        className={`flex items-center gap-2 overflow-x-auto pb-1 border-b border-border/80 no-scrollbar print:hidden ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.id)}
              className={`group flex items-center ${sizeClasses[size]} rounded-xl transition-all cursor-pointer whitespace-nowrap select-none ${
                tab.disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm font-bold scale-[1.01]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium active:scale-[0.98]'
              }`}
            >
              {renderIcon(tab.icon, isActive)}
              <span className="tracking-tight">{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground group-hover:bg-muted-foreground/20'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Default 'pill' / 'segmented' modern container
  return (
    <div
      role="tablist"
      className={`w-full flex items-center justify-between gap-2 p-1.5 bg-card border border-border rounded-2xl overflow-x-auto no-scrollbar print:hidden shadow-xs ${className}`}
    >
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.id)}
              className={`group flex items-center ${sizeClasses[size]} rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer select-none ${
                tab.disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm font-bold scale-[1.01]'
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground font-semibold active:scale-[0.98]'
              }`}
            >
              {renderIcon(tab.icon, isActive)}
              <span className="tracking-tight">{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full transition-colors ${
                    isActive
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground group-hover:bg-muted-foreground/20'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {tab.badge}
            </button>
          )
        })}
      </div>
      {rightContent && (
        <div className="shrink-0 flex items-center">
          {rightContent}
        </div>
      )}
    </div>
  )
}

export default WorkspaceTabs
