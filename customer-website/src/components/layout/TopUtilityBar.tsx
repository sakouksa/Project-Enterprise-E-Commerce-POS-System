import React, { useState } from 'react'
import {
  Phone,
  Truck,
  ShieldCheck,
  Package,
  Globe,
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore, useLocationStore } from '@/stores'
import { cn } from '@/lib/utils'
import TrackOrderModal from '@/components/common/TrackOrderModal'
import WarrantyCheckModal from '@/components/common/WarrantyCheckModal'

interface TopUtilityBarProps {
  announcement?: {
    message?: string
    code?: string
  }
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({ announcement }) => {
  const { t } = useTranslation()
  const { currency, setCurrency, language, setLanguage, theme, setTheme } = useSettingsStore()
  const { province, deliveryHeadline } = useLocationStore()

  const [trackOpen, setTrackOpen] = useState(false)
  const [warrantyOpen, setWarrantyOpen] = useState(false)

  const languages = [
    { code: 'km', label: '🇰🇭 ភាសាខ្មែរ', short: 'KM' },
    { code: 'en', label: '🇺🇸 English', short: 'EN' },
    { code: 'th', label: '🇹🇭 ภาษาไทย', short: 'TH' },
    { code: 'vi', label: '🇻🇳 Tiếng Việt', short: 'VI' },
    { code: 'zh', label: '🇨🇳 中文', short: 'ZH' },
  ] as const

  const currentLang = languages.find((l) => l.code === language) || languages[0]

  return (
    <>
      <div className="w-full bg-[#2C376B] text-slate-100 text-xs py-1.5 sm:py-2 border-b border-[#232c57] select-none shadow-xs">
        <div className="container-site flex items-center justify-between gap-2 sm:gap-3">
          {/* Left Side: Store Hotlines & 25 Provinces Delivery Notice */}
          <div className="flex items-center gap-2 sm:gap-4 text-[11px] min-w-0">
            {/* Hotlines */}
            <div className="flex items-center gap-1.5 sm:gap-2 font-medium flex-shrink-0">
              <a
                href="tel:012220152"
                className="flex items-center gap-1 text-slate-200 hover:text-white transition-colors"
                title="Call Hotline"
              >
                <Phone className="w-3 h-3 text-blue-300 flex-shrink-0" />
                <span className="font-bold">012 220 152</span>
              </a>
              <span className="text-white/30 hidden sm:inline">•</span>
              <a
                href="tel:093456747"
                className="text-slate-200 hover:text-white transition-colors hidden md:inline"
              >
                093 456 747
              </a>
              <span className="text-white/30 hidden lg:inline">•</span>
              <a
                href="tel:0715777378"
                className="text-slate-200 hover:text-white transition-colors hidden lg:inline"
              >
                071 5777 378
              </a>
            </div>

            {/* Auto-detected Delivery 25 Provinces Notice (Non-clickable) */}
            <div
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full bg-white/15 text-white border border-white/20 shadow-xs flex-shrink-0 select-none"
              title="Auto-detected Delivery Zone"
            >
              <Truck className="w-3 h-3 text-emerald-300 flex-shrink-0" />
              <span className="font-bold hidden sm:inline">{deliveryHeadline}</span>
              <span className="font-bold sm:hidden text-[10px]">📍 {province}</span>
            </div>
          </div>

          {/* Center Promo (Desktop only) */}
          <div className="hidden 2xl:flex items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs">
              <Sparkles className="w-2.5 h-2.5" /> {t('nav.promo_badge', 'PROMO')}
            </span>
            <span className="text-slate-200 truncate max-w-md">
              {announcement?.message || t('nav.free_shipping')}
            </span>
          </div>

          {/* Right Side: Social Media, Theme Switcher, Currency & 5-Language Localization */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] flex-shrink-0">
            {/* Social Media Channels (PTC Style) */}
            <div className="hidden lg:flex items-center gap-2 text-slate-200">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                title="Facebook"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                title="TikTok"
                aria-label="TikTok"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                title="Instagram"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                title="Telegram"
                aria-label="Telegram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                title="YouTube"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>

            {/* Admin Dashboard Style Theme Switcher (Right Next to YouTube Icon) */}
            <div className="relative group">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'dark' : 'light')}
                className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-extrabold transition-colors text-[10px] sm:text-xs cursor-pointer select-none"
                title={t('nav.theme', 'Theme')}
                aria-label="Theme Switcher"
              >
                {theme === 'dark' ? (
                  <Moon className="w-3.5 h-3.5 text-blue-300" />
                ) : theme === 'system' ? (
                  <Monitor className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-wider">
                  {theme === 'dark'
                    ? t('nav.dark_mode', 'Dark')
                    : theme === 'system'
                    ? t('nav.system_mode', 'System')
                    : t('nav.light_mode', 'Light')}
                </span>
                <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/70 transition-transform group-hover:rotate-180" />
              </button>

              {/* Theme Dropdown (Admin Dashboard Style) */}
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1 min-w-[125px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-slate-900 dark:text-white">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1 border-b border-slate-100 dark:border-slate-800 mb-1">
                  {t('nav.theme', 'Theme')}
                </div>
                {[
                  { id: 'light', label: t('nav.light_mode', 'Light'), icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
                  { id: 'dark', label: t('nav.dark_mode', 'Dark'), icon: <Moon className="w-3.5 h-3.5 text-blue-400" /> },
                  { id: 'system', label: t('nav.system_mode', 'System'), icon: <Monitor className="w-3.5 h-3.5 text-emerald-500" /> },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setTheme(mode.id as any)}
                    className={cn(
                      'w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer',
                      theme === mode.id
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {mode.icon}
                      <span>{mode.label}</span>
                    </div>
                    {theme === mode.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-extrabold transition-colors text-[10px] sm:text-xs cursor-pointer">
                <span>{currency}</span>
                <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/70 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1 min-w-[90px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {(['USD', 'KHR'] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={cn(
                      'w-full text-left px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer',
                      currency === curr
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    {curr === 'USD' ? '$ USD' : '៛ KHR'}
                  </button>
                ))}
              </div>
            </div>

            {/* 5-Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-extrabold transition-colors text-[10px] sm:text-xs cursor-pointer">
                <Globe className="w-3 h-3 text-blue-300" />
                <span>{currentLang.short}</span>
                <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/70 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1 border-b border-slate-100 dark:border-slate-800 mb-1">
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer',
                      language === l.code
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    <span>{l.label}</span>
                    {language === l.code && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TrackOrderModal isOpen={trackOpen} onClose={() => setTrackOpen(false)} />
      <WarrantyCheckModal isOpen={warrantyOpen} onClose={() => setWarrantyOpen(false)} />
    </>
  )
}

export default TopUtilityBar
