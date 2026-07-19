import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Settings, LogOut, ChevronRight, Globe, Sun, Moon, Monitor, 
  HelpCircle, Keyboard, ScrollText, ArrowLeft, Check, Users2, ShieldAlert
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { useTranslation } from 'react-i18next'
import api from '@/api/client'
import SwitchAccountModal from './SwitchAccountModal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

const ProfileDropdown: React.FC = () => {
  const { user, logout, toggleDark } = useAuthStore()
  const { language, setLanguage, themeMode, updateThemeMode } = useThemeStore()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [currentView, setCurrentView] = useState<'main' | 'language' | 'appearance'>('main')
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false)
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setCurrentView('main')
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (e) {}
    logout()
    navigate('/login')
  }

  const activeRoleName = user?.roles?.[0]?.replace('_', ' ') ?? 'User'

  // Submenu transition configurations
  const menuVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: 'easeOut' as any },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.15, ease: 'easeIn' as any },
    }),
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full"
      >
        <div className="relative w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center cursor-pointer overflow-hidden border border-border/40 hover:scale-105 transition-transform duration-200">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-xs font-bold">{user?.name?.[0] ?? 'U'}</span>
          )}
          {/* Online Indicator */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
        </div>
      </button>

      {/* Dropdown Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-[320px] bg-card/95 border border-border rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-lg flex flex-col"
          >
            {/* Header info */}
            <div className="p-4 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-base overflow-hidden flex-shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0] ?? 'U'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground truncate">{user?.name}</h4>
                  <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] bg-primary/10 text-primary font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {activeRoleName}
                    </span>
                    <span className="text-[9px] bg-green-500/10 text-green-500 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      {t('common.online', 'Online')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Company & Branch detail */}
              <div className="mt-3.5 pt-3 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                <span>{user?.company?.name ?? 'Enterprise POS'}</span>
                <span>•</span>
                <span>{user?.branch?.name ?? 'Head Office'}</span>
              </div>
            </div>

            {/* Menu screens transition */}
            <div className="p-1.5 min-h-[300px] flex flex-col relative overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {currentView === 'main' && (
                  <motion.div
                    key="main"
                    custom={-1}
                    variants={menuVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full space-y-0.5"
                  >
                    <button
                      onClick={() => {
                        navigate('/profile')
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{t('profile.title', 'Manage Profile')}</span>
                      </div>
                    </button>

                    <div className="h-px bg-border/50 my-1" />

                    {/* Submenu triggers */}
                    <button
                      onClick={() => setCurrentView('language')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span>{t('common.language', 'Language')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-muted-foreground/60 font-bold uppercase">{language}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                      </div>
                    </button>

                    <button
                      onClick={() => setCurrentView('appearance')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        {themeMode === 'light' && <Sun className="w-4 h-4 text-muted-foreground" />}
                        {themeMode === 'dark' && <Moon className="w-4 h-4 text-muted-foreground" />}
                        {themeMode === 'system' && <Monitor className="w-4 h-4 text-muted-foreground" />}
                        <span>{t('common.appearance', 'Appearance')}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                    </button>

                    <div className="h-px bg-border/50 my-1" />

                    <button
                      onClick={() => {
                        navigate('/settings')
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        <span>{t('common.settings', 'Settings')}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <ScrollText className="w-4 h-4 text-muted-foreground" />
                        <span>{t('nav.activityLogs', 'Activity Logs')}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setIsLogoutConfirmOpen(true)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>{t('auth.logout', 'Log Out')}</span>
                      </div>
                    </button>
                  </motion.div>
                )}

                {/* Submenu Language */}
                {currentView === 'language' && (
                  <motion.div
                    key="language"
                    custom={1}
                    variants={menuVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full space-y-0.5"
                  >
                    <button
                      onClick={() => setCurrentView('main')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground border-b border-border/40 mb-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{t('common.back', 'Back')}</span>
                    </button>

                    {[
                      { code: 'en', name: 'English', flag: '🇺🇸' },
                      { code: 'km', name: 'Khmer (ភាសាខ្មែរ)', flag: '🇰🇭' },
                      { code: 'th', name: 'Thai (ไทย)', flag: '🇹🇭' },
                      { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
                      { code: 'zh', name: 'Chinese (中文)', flag: '🇨🇳' },
                    ].map((lang) => {
                      const isSel = language === lang.code
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as any)
                            setCurrentView('main')
                            setIsOpen(false)
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150
                            ${isSel ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base leading-none select-none">{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                          {isSel && <Check className="w-3.5 h-3.5 text-primary" />}
                        </button>
                      )
                    })}
                  </motion.div>
                )}

                {/* Submenu Appearance */}
                {currentView === 'appearance' && (
                  <motion.div
                    key="appearance"
                    custom={1}
                    variants={menuVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full space-y-0.5"
                  >
                    <button
                      onClick={() => setCurrentView('main')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground border-b border-border/40 mb-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{t('common.back', 'Back')}</span>
                    </button>

                    {[
                      { id: 'light', label: t('common.light', 'Light Mode'), icon: <Sun className="w-4 h-4" /> },
                      { id: 'dark', label: t('common.dark', 'Dark Mode'), icon: <Moon className="w-4 h-4" /> },
                      { id: 'system', label: t('common.system', 'System Default'), icon: <Monitor className="w-4 h-4" /> },
                    ].map((mode) => {
                      const isSel = themeMode === mode.id
                      return (
                        <button
                          key={mode.id}
                          onClick={() => {
                            updateThemeMode(mode.id as any)
                            setCurrentView('main')
                            setIsOpen(false)
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150
                            ${isSel ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                        >
                          <div className="flex items-center gap-2.5">
                            {mode.icon}
                            <span>{mode.label}</span>
                          </div>
                          {isSel && <Check className="w-3.5 h-3.5 text-primary" />}
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Switch Account Modal Overlay */}
      <SwitchAccountModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
      />

      <ConfirmDialog
        open={isLogoutConfirmOpen}
        onCancel={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title={t('auth.logout_confirm_title', 'Logout Account')}
        message={t('auth.logout_confirm_desc', 'Are you sure you want to end your active session and log out?')}
        confirmText={t('auth.logout', 'Log Out')}
        variant="danger"
      />
    </div>
  )
}

export default ProfileDropdown
