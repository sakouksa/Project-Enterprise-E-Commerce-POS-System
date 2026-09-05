import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Megaphone,
  Sparkles,
  Eye,
  CheckCircle2,
  Save,
  Link as LinkIcon,
  Tag,
  Gift,
  Truck,
  RotateCcw,
  ExternalLink,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cmsService } from '@/services/cmsService'
import { useToast } from '@/hooks/useToast'
import type { AnnouncementConfig } from '../../types'

const PRESET_CAMPAIGNS = [
  {
    name: '🚚 ដឹកជញ្ជូនឥតគិតថ្លៃទូទាំងប្រទេស (Free Shipping)',
    message_km: '🚚 ដឹកជញ្ជូនឥតគិតថ្លៃទូទាំង ២៥ រាជធានី-ខេត្ត សម្រាប់ការកុម្ម៉ង់ចាប់ពី $50 ឡើងទៅ!',
    message_en: '🚚 Free Nationwide Delivery across Cambodia on all orders over $50!',
    badge: 'FREE DELIVERY',
    coupon: 'FREESHIP50',
    link: '/products',
    bg: 'from-blue-600 to-indigo-700',
  },
  {
    name: '🇰🇭 ពិធីបុណ្យចូលឆ្នាំខ្មែរ (Khmer New Year Mega Sale)',
    message_km: '🎉 រីករាយពិធីបុណ្យចូលឆ្នាំខ្មែរ! បញ្ចុះតម្លៃពិសេសរហូតដល់ 35% លើគ្រប់សម្ភារៈបច្ចេកវិទ្យា',
    message_en: '🎉 Happy Khmer New Year! Get up to 35% OFF on flagship laptops and smartphones',
    badge: 'KHMER NEW YEAR',
    coupon: 'KNY2026',
    link: '/promotions',
    bg: 'from-amber-600 to-rose-600',
  },
  {
    name: '🔥 មហាសន្សំប្រចាំខែ (Mid-Month Super Deals)',
    message_km: '⚡ មហាសន្សំថ្ងៃពាក់កណ្តាលខែ! បញ្ចុះបន្ថែម $10 ភ្លាមៗដោយប្រើកូដ MIDMONTH',
    message_en: '⚡ Super Mid-Month Deals! Extra $10 OFF with voucher code MIDMONTH',
    badge: 'FLASH DEAL',
    coupon: 'MIDMONTH',
    link: '/promotions',
    bg: 'from-purple-600 to-pink-600',
  },
]

export const AnnouncementsTab: React.FC = () => {
  const { t } = useTranslation(['cms', 'common'])
  const toast = useToast()
  const qc = useQueryClient()

  const [enabled, setEnabled] = useState(true)
  const [messageKm, setMessageKm] = useState('🚚 ដឹកជញ្ជូនឥតគិតថ្លៃទូទាំង ២៥ រាជធានី-ខេត្ត សម្រាប់ការកុម្ម៉ង់ចាប់ពី $50 ឡើងទៅ!')
  const [messageEn, setMessageEn] = useState('🚚 Free Nationwide Delivery across Cambodia on all orders over $50!')
  const [badgeText, setBadgeText] = useState('SPECIAL PROMO')
  const [couponCode, setCouponCode] = useState('OPTAPOS2026')
  const [linkUrl, setLinkUrl] = useState('/promotions')
  const [bgGradient, setBgGradient] = useState('from-indigo-600 to-purple-700')

  // Fetch current announcement from settings
  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['announcement-settings'],
    queryFn: () => cmsService.getAnnouncements(),
  })

  useEffect(() => {
    if (currentSettings) {
      setEnabled(currentSettings.enabled ?? true)
      setMessageKm(currentSettings.message_km || currentSettings.message || '')
      setMessageEn(currentSettings.message || currentSettings.message_en || '')
      setBadgeText(currentSettings.badge_text || 'SPECIAL PROMO')
      setCouponCode(currentSettings.coupon_code || '')
      setLinkUrl(currentSettings.link || '/promotions')
      setBgGradient(currentSettings.bg_gradient || 'from-indigo-600 to-purple-700')
    }
  }, [currentSettings])

  const saveMutation = useMutation({
    mutationFn: (data: AnnouncementConfig) => cmsService.updateAnnouncements(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcement-settings'] })
      toast.success(t('cms.announcementSaved', 'Top announcement bar settings saved successfully.'))
    },
    onError: () => {
      toast.error(t('cms.announcementSaveFailed', 'Failed to update announcement bar.'))
    },
  })

  const handleSave = () => {
    const payload: AnnouncementConfig = {
      enabled,
      message: messageEn || messageKm,
      message_km: messageKm,
      link: linkUrl,
      coupon_code: couponCode,
      bg_gradient: bgGradient,
      badge_text: badgeText,
    }
    saveMutation.mutate(payload)
  }

  const applyPreset = (preset: typeof PRESET_CAMPAIGNS[0]) => {
    setMessageKm(preset.message_km)
    setMessageEn(preset.message_en)
    setBadgeText(preset.badge)
    setCouponCode(preset.coupon)
    setLinkUrl(preset.link)
    setBgGradient(preset.bg)
    toast.info(t('cms.presetApplied', `Loaded preset "${preset.name}". Don't forget to save.`))
  }

  return (
    <div className="space-y-6">
      {/* Live Preview Card */}
      <div className="bg-card rounded-2xl border border-border shadow-xs p-5 sm:p-6 overflow-hidden">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Eye size={18} />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm sm:text-base">
                {t('cms.announcementLivePreview', 'Storefront Live Announcement Preview')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('cms.announcementLiveDesc', 'Shows exactly how customer sees it on top of the storefront header')}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            enabled ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-muted text-muted-foreground border border-border'
          }`}>
            <span className={`w-2 h-2 rounded-full ${enabled ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
            {enabled ? t('common.active', 'Active (Showing on Website)') : t('common.inactive', 'Disabled (Hidden)')}
          </span>
        </div>

        {/* Live Banner Mockup */}
        <div className="rounded-xl border border-border/80 p-3 bg-muted/40 dark:bg-slate-900/60">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Megaphone size={12} className="text-primary" />
            <span>Storefront Top Header Strip</span>
          </div>

          {enabled ? (
            <div className={`w-full py-2.5 px-4 rounded-lg bg-gradient-to-r ${bgGradient} text-white shadow-sm transition-all duration-300 flex flex-wrap items-center justify-between gap-3 text-xs`}>
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {badgeText && (
                  <span className="bg-white/20 backdrop-blur-xs text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 border border-white/20">
                    {badgeText}
                  </span>
                )}
                <span className="font-medium truncate">{messageKm || messageEn}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {couponCode && (
                  <span className="bg-black/30 text-amber-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-amber-300/30 flex items-center gap-1">
                    <Tag size={11} />
                    {couponCode}
                  </span>
                )}
                {linkUrl && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold underline hover:text-white/80 cursor-pointer">
                    <span>Shop Now</span>
                    <ExternalLink size={10} />
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-muted-foreground italic bg-background/60 rounded-lg border border-dashed border-border">
              {t('cms.announcementBarHidden', 'Announcement bar is currently disabled and hidden from storefront visitors.')}
            </div>
          )}
        </div>
      </div>

      {/* Preset Campaign Chooser */}
      <div className="bg-card rounded-2xl border border-border shadow-xs p-5 sm:p-6">
        <h4 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          <span>{t('cms.campaignPresets', 'Quick Campaign Presets for Cambodia')}</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_CAMPAIGNS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-left p-3.5 rounded-xl border border-border/80 bg-muted/30 hover:bg-primary/5 hover:border-primary/40 transition-all group cursor-pointer"
            >
              <div className="font-bold text-xs text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                <span>{p.name}</span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                {p.message_km}
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-primary font-semibold">
                <span>Click to Apply</span>
                <span className="font-mono bg-background px-1.5 py-0.5 rounded border border-border">{p.coupon}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Configuration Form */}
      <div className="bg-card rounded-2xl border border-border shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h4 className="font-bold text-foreground text-base">
              {t('cms.announcementSettings', 'Announcement Bar Configuration')}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('cms.announcementSettingsDesc', 'Control status, dual-language messages, coupon code, and styling')}
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-xs font-bold text-foreground">
              {enabled ? t('common.enabled', 'Enabled') : t('common.disabled', 'Disabled')}
            </span>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Khmer Message */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
              <span>🇰🇭 {t('cms.messageKm', 'Message in Khmer (ភាសាខ្មែរ)')}</span>
            </label>
            <textarea
              rows={2}
              value={messageKm}
              onChange={(e) => setMessageKm(e.target.value)}
              placeholder="🚚 ដឹកជញ្ជូនឥតគិតថ្លៃទូទាំង ២៥ រាជធានី-ខេត្ត..."
              className="w-full px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>

          {/* English Message */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
              <span>🇺🇸 {t('cms.messageEn', 'Message in English')}</span>
            </label>
            <textarea
              rows={2}
              value={messageEn}
              onChange={(e) => setMessageEn(e.target.value)}
              placeholder="🚚 Free Nationwide Delivery on orders over $50..."
              className="w-full px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Badge text */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('cms.badgeTag', 'Badge Tag (ឧ. PROMO / DEAL)')}
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="SPECIAL PROMO"
              className="w-full h-10 px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Coupon code */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
              <Gift size={13} className="text-amber-500" />
              <span>{t('cms.couponCode', 'Discount Coupon Code')}</span>
            </label>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="OPTAPOS2026"
              className="w-full h-10 px-3.5 py-2 text-xs sm:text-[13px] font-mono rounded-lg border border-border bg-background text-foreground uppercase focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Target link */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
              <LinkIcon size={13} className="text-primary" />
              <span>{t('cms.linkUrl', 'Target URL / Section')}</span>
            </label>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="/promotions"
              className="w-full h-10 px-3.5 py-2 text-xs sm:text-[13px] font-mono rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Color Gradient Theme */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-2">
            {t('cms.themeGradient', 'Background Theme Gradient')}
          </label>
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'from-indigo-600 to-purple-700', label: 'Indigo Purple' },
              { id: 'from-blue-600 to-indigo-700', label: 'Ocean Blue' },
              { id: 'from-amber-600 to-rose-600', label: 'Festive Amber' },
              { id: 'from-emerald-600 to-teal-700', label: 'Emerald Green' },
              { id: 'from-purple-600 to-pink-600', label: 'Vibrant Magenta' },
              { id: 'from-slate-900 to-slate-800', label: 'Dark Obsidian' },
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setBgGradient(g.id)}
                className={`h-9 px-3.5 rounded-lg bg-gradient-to-r ${g.id} text-white text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                  bgGradient === g.id ? 'ring-2 ring-primary ring-offset-2 border-white scale-105' : 'border-transparent opacity-85 hover:opacity-100'
                }`}
              >
                {bgGradient === g.id && <CheckCircle2 size={13} />}
                <span>{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-sm hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saveMutation.isPending ? t('common.saving', 'Saving...') : t('cms.saveAnnouncement', 'Save Announcement Settings')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementsTab
