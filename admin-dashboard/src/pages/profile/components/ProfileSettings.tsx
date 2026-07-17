import React from 'react'
import { Globe, Clock, Sun, Moon, Bell, CheckSquare, Square, Save } from 'lucide-react'
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

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-foreground pb-4 border-b border-border/40">
        {t('profile.settings_tab.ui_title', 'General UI Preferences')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/40">
        {/* Preferred Language */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Globe size={14} className="text-primary" />
            {t('profile.settings_tab.language', 'Preferred Language')}
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'km')}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="en">English (US)</option>
            <option value="km">ភាសាខ្មែរ (Khmer)</option>
          </select>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Clock size={14} className="text-primary" />
            {t('profile.settings_tab.timezone', 'Timezone Configuration')}
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="Asia/Phnom_Penh">Asia/Phnom Penh (GMT+7)</option>
            <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
            <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
            <option value="America/New_York">America/New York (EST/EDT)</option>
            <option value="Europe/London">Europe/London (GMT/BST)</option>
          </select>
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
