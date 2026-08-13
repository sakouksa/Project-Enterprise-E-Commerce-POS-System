import React from 'react'
import { Sparkles, Check, Palette, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { THEME_TEMPLATES, panelTemplates, type ThemeTemplate, type PanelTemplate } from '../../types'

interface TemplatesTabProps {
  customizer: any
  handleApplyTemplate: (tpl: ThemeTemplate) => void
  handleApplyPanelTemplate: (tpl: PanelTemplate) => void
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
  customizer,
  handleApplyTemplate,
  handleApplyPanelTemplate,
}) => {
  const { t } = useTranslation(['settings', 'common'])

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-bold text-foreground">{t('settings.themeAndColorTitle', 'Theme & Primary Color')}</h3>
        <p className="text-muted-foreground text-xs">{t('settings.themeAndColorSub', 'Set your system color scheme, curated templates, and accents')}</p>
      </div>

      {/* GALLERY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              <span>{t('settings.themeTemplatesTitle', 'Pre-built Theme Templates')}</span>
            </h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              <span>{t('settings.themeTemplatesSub', 'Select a preset color combination with one click')}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {THEME_TEMPLATES.map((tpl) => {
            const isSelected = customizer.primaryColor?.toLowerCase() === tpl.primaryColor.toLowerCase() && (tpl.mode === 'system' || customizer.themeMode === tpl.mode)
            return (
              <div
                key={tpl.id}
                onClick={() => handleApplyTemplate(tpl)}
                className={`relative group rounded-2xl border p-4 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-card shadow-md scale-[1.02]'
                    : 'border-border/70 hover:border-primary/50 bg-muted/20 hover:bg-card'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${tpl.gradient} shadow-xs flex items-center justify-center text-white`}>
                      {isSelected ? <Check size={16} strokeWidth={3} /> : <Palette size={14} />}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tpl.badgeColor}`}>
                      {isSelected ? t('settings.activeTemplateBadge', 'Active') : tpl.mode}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{t(`settings.${tpl.nameKey}`, tpl.defaultName)}</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{t(`settings.${tpl.descKey}`, tpl.defaultDesc)}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40 mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground">Primary: {tpl.primaryColor}</span>
                  <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: tpl.primaryColor }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* PANEL TEMPLATES */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Palette size={14} className="text-primary" />
          <span>Sidebar & Navbar Color Presets</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {panelTemplates.map((pt) => (
            <div
              key={pt.id}
              onClick={() => handleApplyPanelTemplate(pt)}
              className="p-3.5 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md border" style={{ backgroundColor: pt.sidebarBg }} />
                <div className="w-5 h-5 rounded-md border" style={{ backgroundColor: pt.activeBg }} />
                <div className="w-5 h-5 rounded-md border" style={{ backgroundColor: pt.navbarBg }} />
              </div>
              <h5 className="text-xs font-bold text-foreground">{t(`settings.${pt.nameKey}`, pt.id)}</h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TemplatesTab
