import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Tag, ArrowRight, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useBanners } from '@/hooks'
import { resolveMediaUrl } from '@/lib/utils'

export const PromoBannerPopup: React.FC = () => {
  const { t } = useTranslation()
  const { data: banners = [] } = useBanners()
  const [isOpen, setIsOpen] = useState(false)
  const [dontShowToday, setDontShowToday] = useState(false)

  // Find a designated popup banner, or fall back to the highest sort promo banner
  const popupBanner = banners.find((b) => b.position === 'popup' && b.is_active) ||
    banners.find((b) => b.discount_tag && b.is_active) ||
    banners[0]

  useEffect(() => {
    if (!popupBanner) return

    const hideUntil = localStorage.getItem('hide_promo_banner_until')
    const now = Date.now()

    if (hideUntil && now < Number(hideUntil)) {
      return
    }

    // Delay opening slightly for smooth clean presentation
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 1800)

    return () => clearTimeout(timer)
  }, [popupBanner])

  const handleClose = () => {
    setIsOpen(false)
    if (dontShowToday) {
      // 24-hour dismissal
      localStorage.setItem('hide_promo_banner_until', String(Date.now() + 24 * 60 * 60 * 1000))
    } else {
      // Session dismissal (4 hours)
      localStorage.setItem('hide_promo_banner_until', String(Date.now() + 4 * 60 * 60 * 1000))
    }
  }

  if (!popupBanner) return null

  const bannerImg = resolveMediaUrl(popupBanner.image || popupBanner.mobile_image, 'banner')

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Glassmorphic Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl z-10 text-white"
          >
            {/* Top Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              title="Close Promotion"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Banner Top Image with Subtle Dimming and Dark Scrim */}
            <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-950">
              <img
                src={bannerImg}
                alt={popupBanner.title}
                className="w-full h-full object-cover brightness-[0.70] contrast-[1.08]"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = '/images/placeholder-product.png'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent" />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md border border-white/25 shadow-xs">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{popupBanner.badge || t('popup.exclusive_offer', 'EXCLUSIVE OFFER')}</span>
                </span>
                {popupBanner.discount_tag && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e6007e] text-white text-[10px] sm:text-xs font-black shadow-md border border-white/20">
                    <Tag className="w-3 h-3" />
                    <span>{popupBanner.discount_tag}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Banner Content Body */}
            <div className="p-6 sm:p-7 space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight leading-snug">
                  {popupBanner.title}
                </h3>
                {popupBanner.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {popupBanner.subtitle}
                  </p>
                )}
              </div>

              {/* Countdown / Guarantee Pill */}
              <div className="flex items-center gap-2 py-2 px-3.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-slate-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{t('popup.limited_time', 'ការផ្ដល់ជូនពិសេសមានកំណត់ទូទាំង ២៥ ខេត្តក្រុង')}</span>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  to={popupBanner.link || '/products'}
                  onClick={handleClose}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#e6007e] hover:bg-[#cf0071] text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-pink-950/50 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer border border-white/20 group"
                >
                  <span>{popupBanner.button_text || t('hero.shop_now', 'ទិញឥឡូវនេះ')}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Dismissal Checkbox */}
              <div className="flex items-center justify-center pt-2">
                <label className="flex items-center gap-2 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={dontShowToday}
                    onChange={(e) => setDontShowToday(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-[#e6007e] focus:ring-[#e6007e] cursor-pointer"
                  />
                  <span>{t('popup.dont_show_today', 'កុំបង្ហាញការផ្ដល់ជូននេះទៀតនៅថ្ងៃនេះ')}</span>
                </label>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default PromoBannerPopup
