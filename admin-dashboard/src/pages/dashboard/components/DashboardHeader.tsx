import React from 'react'
import { Calendar, Building2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from 'react-i18next'

interface DashboardHeaderProps {
  onBranchChange?: (branchId: number) => void
}

const MOCK_BRANCHES = [
  { id: 1, name: 'Head Office' },
  { id: 2, name: 'Phnom Penh Branch' },
  { id: 3, name: 'Siem Reap Branch' },
  { id: 4, name: 'Head Office 4' },
]

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onBranchChange }) => {
  const { user, updateUser } = useAuthStore()
  const { t } = useTranslation()

  const currentBranchId = user?.branch?.id ?? 1
  const todayStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleBranchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bId = Number(e.target.value)
    const matchedBranch = MOCK_BRANCHES.find((b) => b.id === bId)
    if (matchedBranch) {
      updateUser({
        branch: { id: matchedBranch.id, name: matchedBranch.name },
      })
      if (onBranchChange) {
        onBranchChange(matchedBranch.id)
      }
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-card border border-border/60 rounded-2xl shadow-sm backdrop-blur-md">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          {t('dashboard.welcome_back', 'Welcome back')}, {user?.name ?? 'User'} 👋
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          {t('dashboard.header_subtitle', 'Here is a quick overview of your e-commerce and POS performance today.')}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Date Selector */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-muted/40 border border-border/50 rounded-xl text-xs text-muted-foreground font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>{todayStr}</span>
        </div>

        {/* Branch Filter Selector */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-muted/40 border border-border/50 rounded-xl text-xs font-semibold text-muted-foreground relative">
          <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={currentBranchId}
            onChange={handleBranchSelect}
            className="bg-transparent text-foreground border-none outline-none cursor-pointer pr-4 font-bold text-xs"
          >
            {MOCK_BRANCHES.map((b) => (
              <option key={b.id} value={b.id} className="bg-card text-foreground">
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader
