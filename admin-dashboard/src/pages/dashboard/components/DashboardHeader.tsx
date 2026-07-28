import React from 'react'
import { Calendar } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from 'react-i18next'

interface DashboardHeaderProps {
  onBranchChange?: (branchId: number) => void
  onRefresh?: () => void
  isRefreshing?: boolean
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onBranchChange, 
  onRefresh, 
  isRefreshing 
}) => {
  const { user } = useAuthStore()
  const { t, i18n } = useTranslation()

  const todayStr = new Date().toLocaleDateString(i18n.language === 'km' ? 'km-KH' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 md:p-6 bg-card border border-border/60 rounded-2xl shadow-sm">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
          <span>{t('dashboard.title')}</span>
          <span>/</span>
          <span className="text-primary font-bold">{user?.branch?.name || t('dashboard.allBranches')}</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
          {t('dashboard.welcome_back')}, {user?.name || 'Super Admin'} 👋
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          {t('dashboard.header_subtitle')}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Business Date */}
        <div className="flex items-center gap-2 px-3 py-2 bg-muted/40 border border-border/50 rounded-xl text-xs text-muted-foreground font-semibold">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>{todayStr}</span>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader
