import React from 'react'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import QuickActionDropdown from './QuickActionDropdown'
import LanguageDropdown from './LanguageDropdown'
import ThemeSwitcher from './ThemeSwitcher'
import NotificationDropdown from './NotificationDropdown'
import ProfileDropdown from './ProfileDropdown'

const HeaderActions: React.FC = () => {
  const { t } = useTranslation()
  const { hasPermission } = useAuthStore()

  return (
    <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
      {/* POS Quick Link */}
      {hasPermission('sale.create') && (
        <Link
          to="/pos"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-200"
          title={t('nav.posTerminal', 'POS Terminal')}
        >
          <Zap className="w-4.5 h-4.5" />
        </Link>
      )}

      {/* Quick Action Button Dropdown */}
      <QuickActionDropdown />

      <div className="h-4 w-px bg-border/60 mx-0.5 hidden sm:block" />

      {/* Language dropdown */}
      <LanguageDropdown />

      {/* Dark/Light mode theme switcher */}
      <ThemeSwitcher />

      {/* Notifications trigger dropdown */}
      <NotificationDropdown />

      {/* Profile menu dropdown (includes Switch Account modal) */}
      <ProfileDropdown />
    </div>
  )
}

export default HeaderActions
