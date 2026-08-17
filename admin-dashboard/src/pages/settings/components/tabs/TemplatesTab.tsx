import React, { useState } from 'react'
import {
  Sparkles, Check, Palette, Sliders, Layout,
  ChevronDown, ChevronUp, Wand2, RefreshCw, Eye,
  Paintbrush, Layers, SlidersHorizontal, ArrowRight,
  Sun, Moon, Laptop
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  THEME_TEMPLATES,
  panelTemplates,
  type ThemeTemplate,
  type PanelTemplate
} from '../../types'
import { sound } from '@/utils/sound'

interface TemplatesTabProps {
  customizer: any
  handleApplyTemplate: (tpl: ThemeTemplate) => void
  handleApplyPanelTemplate: (tpl: PanelTemplate) => void
}

const QUICK_ACCENT_SWATCHES = [
  { name: 'Neon Coral', hex: '#ec4899' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Emerald Mint', hex: '#10b981' },
  { name: 'Violet VIP', hex: '#8b5cf6' },
  { name: 'Sunset Amber', hex: '#f59e0b' },
  { name: 'Cyan Frost', hex: '#06b6d4' },
  { name: 'Indigo Electric', hex: '#6366f1' },
  { name: 'Crimson Red', hex: '#ef4444' },
]

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
  customizer,
  handleApplyTemplate,
  handleApplyPanelTemplate,
}) => {
  const { t } = useTranslation(['settings', 'common'])
  const [activeViewMode, setActiveViewMode] = useState<'gallery' | 'custom'>('gallery')

  const currentSidebar = customizer.sidebar || {}
  const currentNavbar = customizer.navbar || {}
  const currentPrimaryColor = customizer.primaryColor || '#ec4899'
  const currentThemeMode = customizer.themeMode || 'light'

  const isPanelActive = (tpl: PanelTemplate) => {
    return (
      currentSidebar.bgColor?.toLowerCase() === tpl.sidebarBg.toLowerCase() &&
      currentSidebar.activeBgColor?.toLowerCase() === tpl.activeBg.toLowerCase()
    )
  }

  const handleWidthChange = (width: number) => {
    customizer.updateSidebar({ width })
    sound.playClick()
  }

  const handleRoundedChange = (roundedStyle: string) => {
    customizer.updateSidebar({ roundedStyle })
    sound.playClick()
  }

  const handleShadowChange = (shadow: 'none' | 'sm' | 'md' | 'lg') => {
    customizer.updateNavbar({ shadow })
    sound.playClick()
  }

  const handleQuickAccent = (hex: string) => {
    customizer.updateSidebar({ activeBgColor: hex })
    customizer.updatePrimaryColor(hex)
    sound.playSuccess()
  }

  const handleThemeModeChange = (mode: 'light' | 'dark' | 'system') => {
    customizer.updateThemeMode(mode)
    sound.playClick()
  }

  return (
    <div className="space-y-10 pb-8">
      
      {/* ─── MAIN HEADER ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h3 className="text-lg font-black text-foreground flex items-center gap-2.5 tracking-tight">
            <Palette size={22} className="text-primary" />
            <span>{t('settings.themeAndColorTitle', 'Theme, Sidebar & Navbar Customizer')}</span>
          </h3>
          <p className="text-muted-foreground text-xs mt-1 leading-relaxed max-w-2xl">
            {t('settings.themeAndColorSub', 'Set your system color scheme, curated templates, and sidebar/navbar layouts in a flexible modern layout.')}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1.5 bg-muted/40 border border-border/80 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveViewMode('gallery')
              sound.playClick()
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeViewMode === 'gallery'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles size={15} />
            <span>{t('settings.galleryMode', '6 Curated Templates')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveViewMode('custom')
              sound.playClick()
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeViewMode === 'custom'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Paintbrush size={15} />
            <span>{t('settings.customStudioMode', 'Custom Studio')}</span>
          </button>
        </div>
      </div>

      {/* ─── SECTION 1: SYSTEM THEME & PRIMARY COLOR PRESETS (CLEAN & MINIMALIST) ─ */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-foreground flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <span>{t('settings.themeTemplatesTitle', 'Global Brand Accent & Color Scheme')}</span>
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('settings.themeTemplatesSub', 'Instant one-click theme colors with light, dark and adaptive system mode support')}
            </p>
          </div>

          {/* Theme Mode Segmented Controller */}
          <div className="flex items-center p-1 bg-muted/50 border border-border/80 rounded-2xl self-start sm:self-auto shrink-0 shadow-xs">
            <button
              type="button"
              onClick={() => handleThemeModeChange('light')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentThemeMode === 'light'
                  ? 'bg-card text-foreground shadow-xs border border-border/60'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sun size={13} className={currentThemeMode === 'light' ? 'text-amber-500' : ''} />
              <span>{t('settings.modeLight', 'Light')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleThemeModeChange('dark')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentThemeMode === 'dark'
                  ? 'bg-card text-foreground shadow-xs border border-border/60'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Moon size={13} className={currentThemeMode === 'dark' ? 'text-indigo-400' : ''} />
              <span>{t('settings.modeDark', 'Dark')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleThemeModeChange('system')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentThemeMode === 'system'
                  ? 'bg-card text-foreground shadow-xs border border-border/60'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Laptop size={13} className={currentThemeMode === 'system' ? 'text-primary' : ''} />
              <span>{t('settings.modeSystem', 'System')}</span>
            </button>
          </div>
        </div>

        {/* 6 Curated Clean Theme Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {THEME_TEMPLATES.map((tpl) => {
            const isSelected =
              currentPrimaryColor?.toLowerCase() === tpl.primaryColor.toLowerCase() &&
              (tpl.mode === 'system' || currentThemeMode === tpl.mode)

            return (
              <motion.div
                whileHover={{ y: -2 }}
                key={tpl.id}
                onClick={() => {
                  handleApplyTemplate(tpl)
                  sound.playClick()
                }}
                className={`relative group rounded-2xl border p-4 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3.5 ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/25 bg-card shadow-sm'
                    : 'border-border/70 hover:border-primary/40 bg-card/50 hover:bg-card shadow-xs'
                }`}
              >
                {/* Left Swatch & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Glowing Color Avatar */}
                  <div
                    className="w-11 h-11 rounded-2xl shadow-xs flex items-center justify-center text-white shrink-0 relative overflow-hidden transition-transform group-hover:scale-105"
                    style={{ backgroundColor: tpl.primaryColor }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {isSelected ? (
                      <Check size={20} strokeWidth={3} className="relative z-10 drop-shadow-xs" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full bg-white/40 relative z-10" />
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-black text-foreground group-hover:text-primary transition-colors truncate">
                        {t(`settings.${tpl.nameKey}`, tpl.defaultName)}
                      </h5>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1 leading-normal">
                      {t(`settings.${tpl.descKey}`, tpl.defaultDesc)}
                    </p>
                  </div>
                </div>

                {/* Right Badge & Hex */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : tpl.badgeColor
                    }`}
                  >
                    {isSelected ? t('settings.activeTemplateBadge', 'Active') : tpl.mode}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                    {tpl.primaryColor}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Direct Custom Primary Color Bar */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <Wand2 size={16} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-foreground">{t('settings.customPrimaryColor', 'Custom Brand Primary Accent')}</h5>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t('settings.customPrimaryColorDesc', 'Pick any custom hex code to match your company branding')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <input
              type="color"
              value={currentPrimaryColor}
              onChange={(e) => {
                customizer.updatePrimaryColor(e.target.value)
                customizer.updateSidebar({ activeBgColor: e.target.value })
              }}
              className="w-9 h-9 rounded-xl border border-border cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={currentPrimaryColor}
              onChange={(e) => {
                customizer.updatePrimaryColor(e.target.value)
                customizer.updateSidebar({ activeBgColor: e.target.value })
              }}
              className="w-28 px-3 py-1.5 text-xs font-mono font-bold bg-background border border-border rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: 6 CURATED ULTRA-PREMIUM SIDEBAR & NAVBAR TEMPLATES ── */}
      {activeViewMode === 'gallery' && (
        <div className="space-y-5 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                <span>{t('settings.panelTemplatesGallery', '6 Curated Sidebar & Navbar Templates')}</span>
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('settings.panelTemplatesGalleryDesc', 'Click any template below to transform your entire POS dashboard navigation layout instantly.')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveViewMode('custom')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 cursor-pointer self-start sm:self-auto py-1"
            >
              <span>{t('settings.needMoreCustom', 'Need custom colors? Open Studio')}</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {panelTemplates.map((tpl) => {
              const active = isPanelActive(tpl)
              return (
                <motion.div
                  whileHover={{ y: -3 }}
                  key={tpl.id}
                  onClick={() => {
                    handleApplyPanelTemplate(tpl)
                  }}
                  className={`group relative rounded-3xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    active
                      ? 'border-primary ring-2 ring-primary/30 bg-card shadow-lg scale-[1.01]'
                      : 'border-border/80 hover:border-primary/50 bg-card/60 hover:bg-card shadow-xs'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Card Top Pill & Badges */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border bg-muted/60 text-muted-foreground border-border/80">
                        {tpl.defaultBadge}
                      </span>
                      {active ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full bg-primary text-primary-foreground shadow-sm animate-pulse">
                          <Check size={12} strokeWidth={3} />
                          {t('settings.activeTemplateBadge', 'Active')}
                        </span>
                      ) : null}
                    </div>

                    {/* ─── High-Fidelity Interactive Mini UI Mockup ─── */}
                    <div className="h-36 w-full rounded-2xl border border-border/70 overflow-hidden flex shadow-inner bg-muted/20 relative group-hover:shadow-md transition-shadow">
                      {/* Mini Sidebar */}
                      <div
                        className="w-[36%] h-full p-2.5 flex flex-col justify-between shrink-0 border-r transition-colors"
                        style={{
                          backgroundColor: tpl.sidebarBg,
                          borderColor: 'rgba(255,255,255,0.08)'
                        }}
                      >
                        <div className="space-y-2">
                          {/* Mini Brand Logo Header */}
                          <div className="flex items-center gap-1.5 pb-1 border-b border-white/10">
                            <div
                              className="w-3.5 h-3.5 rounded-md flex items-center justify-center shadow-xs"
                              style={{ backgroundColor: tpl.activeBg }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                            <div className="w-10 h-1.5 rounded-full bg-white/30" />
                          </div>

                          {/* Mini Active Menu Item */}
                          <div
                            className="w-full h-4 rounded-lg px-1.5 flex items-center gap-1.5 shadow-xs transition-transform group-hover:scale-102"
                            style={{ backgroundColor: tpl.activeBg }}
                          >
                            <div className="w-2 h-2 rounded-full bg-white/90" />
                            <div className="w-8 h-1.5 rounded-full bg-white" />
                          </div>

                          {/* Mini Inactive Menu Items */}
                          <div className="w-full h-3 rounded-md px-1.5 flex items-center gap-1.5 opacity-60">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tpl.sidebarText }} />
                            <div className="w-7 h-1 rounded-full" style={{ backgroundColor: tpl.sidebarText }} />
                          </div>
                          <div className="w-full h-3 rounded-md px-1.5 flex items-center gap-1.5 opacity-60">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tpl.sidebarText }} />
                            <div className="w-6 h-1 rounded-full" style={{ backgroundColor: tpl.sidebarText }} />
                          </div>
                        </div>

                        {/* Mini User Profile Footer */}
                        <div className="w-full pt-1.5 border-t border-white/10 flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                          <div className="w-5 h-1 rounded-full bg-white/20" />
                        </div>
                      </div>

                      {/* Mini Content Area & Navbar */}
                      <div className="flex-1 flex flex-col h-full bg-background/60">
                        {/* Mini Navbar */}
                        <div
                          className="h-7 w-full px-2.5 border-b flex items-center justify-between shrink-0"
                          style={{
                            backgroundColor: tpl.navbarBg,
                            borderColor: tpl.navbarBorder,
                            color: tpl.navbarText,
                          }}
                        >
                          <div className="w-10 h-2 rounded-full bg-muted-foreground/20" />
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                            <div
                              className="w-3 h-3 rounded-full shadow-xs"
                              style={{ backgroundColor: tpl.activeBg }}
                            />
                          </div>
                        </div>

                        {/* Mini Canvas Dashboard Body */}
                        <div className="p-2.5 space-y-2 flex-1">
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="h-6 rounded-lg bg-card border border-border/50 shadow-xs" />
                            <div className="h-6 rounded-lg bg-card border border-border/50 shadow-xs" />
                          </div>
                          <div className="h-8 rounded-lg bg-card border border-border/50 shadow-xs" />
                        </div>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h5 className="text-xs font-black text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                        {t(`settings.${tpl.nameKey}`, tpl.defaultName)}
                      </h5>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed min-h-[36px]">
                        {t(`settings.${tpl.descKey}`, tpl.defaultDesc)}
                      </p>
                    </div>
                  </div>

                  {/* Color Swatch Dots Footer */}
                  <div className="pt-3.5 border-t border-border/60 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-muted-foreground">Palettes:</span>
                      <div
                        className="w-4 h-4 rounded-full border border-border/80 shadow-xs"
                        style={{ backgroundColor: tpl.sidebarBg }}
                        title="Sidebar Background"
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-border/80 shadow-xs"
                        style={{ backgroundColor: tpl.activeBg }}
                        title="Active Pill"
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-border/80 shadow-xs"
                        style={{ backgroundColor: tpl.navbarBg }}
                        title="Navbar Header"
                      />
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground font-bold uppercase">{tpl.id}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── SECTION 3: CUSTOM DESIGN STUDIO (BUILDER MODE) ──────────────── */}
      {activeViewMode === 'custom' && (
        <div className="space-y-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                <Paintbrush size={17} className="text-primary" />
                <span>{t('settings.customStudioTitle', 'Custom Design Studio & Color Builder')}</span>
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {t('settings.customStudioSubtitle', 'Craft your bespoke sidebar, active indicators, and navbar headers with live visual feedback.')}
              </p>
            </div>
          </div>

          {/* Quick Accent Palette Bar */}
          <div className="p-5 rounded-3xl bg-card border border-border/80 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <Wand2 size={15} className="text-amber-500" />
                <span>{t('settings.quickAccentPresets', 'Quick Accent Color Presets')}</span>
              </span>
              <span className="text-xs text-muted-foreground font-mono font-bold">{currentSidebar.activeBgColor || '#ec4899'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {QUICK_ACCENT_SWATCHES.map((swatch) => (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => handleQuickAccent(swatch.hex)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    currentSidebar.activeBgColor?.toLowerCase() === swatch.hex.toLowerCase()
                      ? 'border-primary ring-2 ring-primary/30 bg-primary/10'
                      : 'border-border/70 hover:border-primary/40 bg-muted/20'
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: swatch.hex }} />
                  <span>{swatch.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Precision Color Picker Grid */}
          <div className="p-5 rounded-3xl border border-border bg-card/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 shadow-xs">
            {/* Sidebar Background */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                {t('settings.sidebarBg', 'Sidebar Background')}
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={currentSidebar.bgColor || '#0b1329'}
                  onChange={(e) => customizer.updateSidebar({ bgColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={currentSidebar.bgColor || '#0b1329'}
                  onChange={(e) => customizer.updateSidebar({ bgColor: e.target.value })}
                  className="flex-1 px-3.5 py-2 text-xs font-mono font-bold bg-background border border-border rounded-xl"
                />
              </div>
            </div>

            {/* Active Item Background */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                {t('settings.activeBg', 'Active Button Accent')}
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={currentSidebar.activeBgColor || '#ec4899'}
                  onChange={(e) => {
                    customizer.updateSidebar({ activeBgColor: e.target.value })
                    customizer.updatePrimaryColor(e.target.value)
                  }}
                  className="w-10 h-10 rounded-xl border border-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={currentSidebar.activeBgColor || '#ec4899'}
                  onChange={(e) => {
                    customizer.updateSidebar({ activeBgColor: e.target.value })
                    customizer.updatePrimaryColor(e.target.value)
                  }}
                  className="flex-1 px-3.5 py-2 text-xs font-mono font-bold bg-background border border-border rounded-xl"
                />
              </div>
            </div>

            {/* Sidebar Text Color */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                {t('settings.sidebarText', 'Sidebar Text & Icons')}
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={currentSidebar.textColor || '#94a3b8'}
                  onChange={(e) => customizer.updateSidebar({ textColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={currentSidebar.textColor || '#94a3b8'}
                  onChange={(e) => customizer.updateSidebar({ textColor: e.target.value })}
                  className="flex-1 px-3.5 py-2 text-xs font-mono font-bold bg-background border border-border rounded-xl"
                />
              </div>
            </div>

            {/* Navbar Background */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                {t('settings.navbarBg', 'Navbar Header Background')}
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={currentNavbar.bgColor || '#ffffff'}
                  onChange={(e) => customizer.updateNavbar({ bgColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={currentNavbar.bgColor || '#ffffff'}
                  onChange={(e) => customizer.updateNavbar({ bgColor: e.target.value })}
                  className="flex-1 px-3.5 py-2 text-xs font-mono font-bold bg-background border border-border rounded-xl"
                />
              </div>
            </div>

            {/* Navbar Border Color */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                {t('settings.navbarBorder', 'Navbar Border Color')}
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={currentNavbar.borderColor || '#e2e8f0'}
                  onChange={(e) => customizer.updateNavbar({ borderColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={currentNavbar.borderColor || '#e2e8f0'}
                  onChange={(e) => customizer.updateNavbar({ borderColor: e.target.value })}
                  className="flex-1 px-3.5 py-2 text-xs font-mono font-bold bg-background border border-border rounded-xl"
                />
              </div>
            </div>

            {/* Navbar Text Color */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase">
                {t('settings.navbarText', 'Navbar Text & Search')}
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={currentNavbar.textColor || '#0f172a'}
                  onChange={(e) => customizer.updateNavbar({ textColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={currentNavbar.textColor || '#0f172a'}
                  onChange={(e) => customizer.updateNavbar({ textColor: e.target.value })}
                  className="flex-1 px-3.5 py-2 text-xs font-mono font-bold bg-background border border-border rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 4: SIDEBAR & NAVBAR DIMENSIONS & SIZING ─────────────── */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Layout size={15} className="text-primary" />
          <span>{t('settings.dimensionsAndLayout', 'Sidebar & Navbar Sizing & Layout Presets')}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {/* Sidebar Width Preset */}
          <div className="bg-card p-4 sm:p-5 rounded-3xl border border-border/80 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">{t('settings.sidebarWidth', 'Sidebar Width')}</label>
              <span className="text-xs font-mono font-bold text-primary">{currentSidebar.width || 260}px</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1">
              {[
                { label: t('settings.widthCompact', 'Compact'), val: 220 },
                { label: t('settings.widthStandard', 'Standard'), val: 260 },
                { label: t('settings.widthSpacious', 'Spacious'), val: 280 },
              ].map((w) => (
                <button
                  key={w.val}
                  type="button"
                  onClick={() => handleWidthChange(w.val)}
                  className={`py-2 px-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer truncate ${
                    (currentSidebar.width || 260) === w.val
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted border-border/60'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Item Corner Radius */}
          <div className="bg-card p-4 sm:p-5 rounded-3xl border border-border/80 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">{t('settings.menuItemRadius', 'Menu Item Corners')}</label>
              <span className="text-xs font-mono text-muted-foreground font-semibold">{currentSidebar.roundedStyle || 'rounded-xl'}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1">
              {[
                { label: t('settings.radiusSharp', 'Sharp'), val: 'rounded-md' },
                { label: t('settings.radiusSmooth', 'Smooth'), val: 'rounded-xl' },
                { label: t('settings.radiusPill', 'Pill'), val: 'rounded-2xl' },
              ].map((r) => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => handleRoundedChange(r.val)}
                  className={`py-2 px-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer truncate ${
                    (currentSidebar.roundedStyle || 'rounded-xl') === r.val
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted border-border/60'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Navbar Elevation / Shadow */}
          <div className="bg-card p-4 sm:p-5 rounded-3xl border border-border/80 space-y-2.5 shadow-2xs md:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">{t('settings.navbarShadow', 'Navbar Elevation')}</label>
              <span className="text-xs font-mono text-muted-foreground font-semibold">{currentNavbar.shadow || 'sm'}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 sm:gap-1.5 pt-1">
              {[
                { label: t('settings.shadowNone', 'Flat'), val: 'none' },
                { label: t('settings.shadowSm', 'Low'), val: 'sm' },
                { label: t('settings.shadowMd', 'Mid'), val: 'md' },
                { label: t('settings.shadowLg', 'High'), val: 'lg' },
              ].map((s) => (
                <button
                  key={s.val}
                  type="button"
                  onClick={() => handleShadowChange(s.val as any)}
                  className={`py-2 px-1 text-[10.5px] sm:text-[11px] font-bold rounded-xl border transition-all cursor-pointer truncate ${
                    (currentNavbar.shadow || 'sm') === s.val
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted border-border/60'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default TemplatesTab
