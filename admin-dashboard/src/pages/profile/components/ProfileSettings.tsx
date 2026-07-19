import React, { useState, useRef, useEffect } from 'react'
import { Globe, Clock, Sun, Moon, Bell, CheckSquare, Square, Save, ChevronDown, Check } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { useTranslation } from 'react-i18next'

interface ProfileSettingsProps {
  timezone: string
  setTimezone: (tz: string) => void
  emailNotify: boolean
  setEmailNotify: (v: boolean) => void
  pushNotify: boolean
  setPushNotify: (v: boolean) => void
  smsNotify: boolean
  setSmsNotify: (v: boolean) => void
  onSave: () => void
  isSaving: boolean
}

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flagUrl: 'https://flagcdn.com/w40/us.png' },
  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', flagUrl: 'https://flagcdn.com/w40/kh.png' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flagUrl: 'https://flagcdn.com/w40/th.png' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flagUrl: 'https://flagcdn.com/w40/vn.png' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flagUrl: 'https://flagcdn.com/w40/cn.png' },
] as const

const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'Asia/Phnom_Penh', label: 'Asia/Phnom Penh (GMT+7)' },
  { value: 'Asia/Bangkok', label: 'Asia/Bangkok (GMT+7)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (GMT+8)' },
  { value: 'America/New_York', label: 'America/New York (EST/EDT)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
]

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  timezone,
  setTimezone,
  emailNotify,
  setEmailNotify,
  pushNotify,
  setPushNotify,
  smsNotify,
  setSmsNotify,
  onSave,
  isSaving,
}) => {
  const { t } = useTranslation()
  const { themeMode, updateThemeMode, language, setLanguage } = useThemeStore()

  const [langOpen, setLangOpen] = useState(false)
  const [tzOpen, setTzOpen] = useState(false)

  const langRef = useRef<HTMLDivElement>(null)
  const tzRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
      if (tzRef.current && !tzRef.current.contains(e.target as Node)) {
        setTzOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const currentLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]
  const currentTz = TIMEZONES.find((t) => t.value === timezone) ?? TIMEZONES[0]

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-foreground pb-4 border-b border-border/40">
        {t('profile.settings_tab.ui_title', 'General UI Preferences')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/40">
        {/* Preferred Language */}
        <div className="space-y-2 relative" ref={langRef}>
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Globe size={14} className="text-primary" />
            {t('profile.settings_tab.language', 'Preferred Language')}
          </label>
          <button
            type="button"
            onClick={() => {
              setLangOpen(!langOpen)
              setTzOpen(false)
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-left"
          >
            <div className="flex items-center gap-2">
              <img
                src={currentLang.flagUrl}
                alt={currentLang.name}
                className="w-5 h-3.5 object-cover rounded-sm shadow-sm border border-foreground/10 flex-shrink-0"
              />
              <span>{currentLang.nativeName} ({currentLang.name})</span>
            </div>
            <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
          </button>

          {langOpen && (
            <div className="absolute left-0 mt-1 w-full bg-card border border-border rounded-xl shadow-lg z-50 p-1.5 backdrop-blur-md max-h-60 overflow-y-auto">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === language
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code)
                      setLangOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 text-left mb-0.5 last:mb-0
                      ${
                        isSelected
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={lang.flagUrl}
                        alt={lang.name}
                        className="w-5 h-3.5 object-cover rounded-sm shadow-sm border border-foreground/10 flex-shrink-0"
                      />
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-muted-foreground/60">({lang.name})</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Timezone */}
        <div className="space-y-2 relative" ref={tzRef}>
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Clock size={14} className="text-primary" />
            {t('profile.settings_tab.timezone', 'Timezone Configuration')}
          </label>
          <button
            type="button"
            onClick={() => {
              setTzOpen(!tzOpen)
              setLangOpen(false)
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-left"
          >
            <span>{currentTz.label}</span>
            <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${tzOpen ? 'rotate-180' : ''}`} />
          </button>

          {tzOpen && (
            <div className="absolute left-0 mt-1 w-full bg-card border border-border rounded-xl shadow-lg z-50 p-1.5 backdrop-blur-md max-h-60 overflow-y-auto">
              {TIMEZONES.map((tzOpt) => {
                const isSelected = tzOpt.value === timezone
                return (
                  <button
                    key={tzOpt.value}
                    type="button"
                    onClick={() => {
                      setTimezone(tzOpt.value)
                      setTzOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 text-left mb-0.5 last:mb-0
                      ${
                        isSelected
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                  >
                    <span>{tzOpt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>


      <div className="space-y-6">
        {/* Visual Mode */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div>
            <h4 className="text-sm font-semibold text-foreground">{t('profile.settings_tab.theme_title', 'Interface Visual Theme')}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('profile.settings_tab.theme_subtitle', 'Toggle between light and dark backgrounds for the dashboard.')}
            </p>
          </div>
          <button
            onClick={() => updateThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            className="p-2 border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-colors"
          >
            {themeMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Notifications Checkboxes */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Bell size={14} className="text-primary" />
            {t('profile.settings_tab.notify_title', 'Notification Subscriptions')}
          </h4>

          {/* Email notifications checkbox */}
          <div 
            onClick={() => setEmailNotify(!emailNotify)}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 cursor-pointer transition-colors"
          >
            <div className="text-primary mt-0.5">
              {emailNotify ? <CheckSquare size={18} /> : <Square size={18} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t('profile.settings_tab.notify_email_label', 'Email Notifications')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('profile.settings_tab.notify_email_desc', 'Receive logs, reports, and critical invoices directly in your inbox.')}
              </p>
            </div>
          </div>

          {/* Push Notifications checkbox */}
          <div 
            onClick={() => setPushNotify(!pushNotify)}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 cursor-pointer transition-colors"
          >
            <div className="text-primary mt-0.5">
              {pushNotify ? <CheckSquare size={18} /> : <Square size={18} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t('profile.settings_tab.notify_push_label', 'Push & Web Alerts')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('profile.settings_tab.notify_push_desc', 'Receive browser push alerts for live low-stock warnings and sales orders.')}
              </p>
            </div>
          </div>

          {/* SMS notifications checkbox */}
          <div 
            onClick={() => setSmsNotify(!smsNotify)}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 cursor-pointer transition-colors"
          >
            <div className="text-primary mt-0.5">
              {smsNotify ? <CheckSquare size={18} /> : <Square size={18} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t('profile.settings_tab.notify_sms_label', 'SMS Transaction Alerts')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('profile.settings_tab.notify_sms_desc', 'Receive critical security codes and high-value cashier register updates on your mobile device.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border/40">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-sm font-semibold transition-colors duration-200 shadow-sm disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {t('profile.settings_tab.save_prefs', 'Save Preferences')}
        </button>
      </div>
    </div>
  )
}
