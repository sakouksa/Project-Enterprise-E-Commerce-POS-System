import React from 'react'
import { useSettingsStore, type CurrencyCode, type LanguageCode, type ThemeMode } from '@/stores'

const SettingsPage: React.FC = () => {
  const { currency, setCurrency, language, setLanguage, theme, setTheme } = useSettingsStore()

  return (
    <div className="card p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display border-b border-gray-100 dark:border-gray-800 pb-3">
        Account Preferences
      </h2>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Display Currency
          </label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)} className="input">
            <option value="USD">USD ($)</option>
            <option value="KHR">KHR (៛)</option>
            <option value="THB">THB (฿)</option>
            <option value="VND">VND (₫)</option>
            <option value="CNY">CNY (¥)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Language
          </label>
          <select value={language} onChange={(e) => setLanguage(e.target.value as LanguageCode)} className="input">
            <option value="en">English</option>
            <option value="km">ខ្មែរ (Khmer)</option>
            <option value="th">ภาษาไทย (Thai)</option>
            <option value="vi">Tiếng Việt (Vietnamese)</option>
            <option value="zh">中文 (Chinese)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
            Appearance Theme
          </label>
          <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeMode)} className="input">
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
            <option value="system">System Default</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
