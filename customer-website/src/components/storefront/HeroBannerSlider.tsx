import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export interface BannerItem {
  id: number
  title: string
  subtitle?: string | null
  image?: string | null
  mobile_image?: string | null
  link?: string | null
  button_text?: string | null
  type?: string
  position?: string
  badge?: string
  discount_tag?: string
  theme_gradient?: string
}

interface HeroBannerSliderProps {
  banners?: BannerItem[]
  className?: string
}

export const HeroBannerSlider: React.FC<HeroBannerSliderProps> = ({ banners, className }) => {
  const { t } = useTranslation()
  const [activeIdx, setActiveIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const SLIDE_DURATION = 5500

  const defaultBanners: BannerItem[] = [
    {
      id: 1,
      title: 'HAPPY TECH WEEKEND',
      subtitle: 'មហោស្រពទំនិញបច្ចេកវិទ្យាប្រចាំខែ បញ្ចុះតម្លៃពិសេសលើ Laptops, Mac & Gaming Gear ជំនាន់ថ្មី 2026',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80',
      link: '/products?sort=deals',
      button_text: t('hero.shop_now', 'ទិញឥឡូវនេះ'),
      badge: 'AEON ONLINE TECH',
      discount_tag: 'បញ្ចុះតម្លៃ $300',
      theme_gradient: 'from-[#6b0f38]/90 via-[#450a24]/80 to-transparent',
    },
    {
      id: 2,
      title: 'NEXT-GEN PRO GAMING ARENA',
      subtitle: 'ឧបករណ៍ហ្គេមអាជីព RTX 5090, 240Hz OLED Displays & Mechanical Keyboards ធានាផ្លូវការ',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1600&q=80',
      link: '/products?category=keyboards',
      button_text: t('hero.explore', 'ស្វែងរកទំនិញ'),
      badge: 'OFFICIAL ESPORTS GEAR',
      discount_tag: 'បញ្ចុះតម្លៃ 35%',
      theme_gradient: 'from-[#1a1c4b]/90 via-[#0f1130]/80 to-transparent',
    },
    {
      id: 3,
      title: 'STUDIO AUDIO & WIRELESS HI-RES',
      subtitle: 'សំឡេងកម្រិតស្ទូឌីយោ Spatial Audio & Active Noise Cancellation គុណភាពខ្ពស់បំផុត',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80',
      link: '/products?category=audio-sound',
      button_text: t('hero.view_collection', 'មើលការប្រមូលផ្តុំ'),
      badge: 'HI-RES AUDIOPHILE',
      discount_tag: 'តម្លៃចាប់ពី $99',
      theme_gradient: 'from-[#0b3866]/90 via-[#06203d]/80 to-transparent',
    },
    {
      id: 4,
      title: 'ENTERPRISE SMART POS HARDWARE',
      subtitle: 'ប្រព័ន្ធគ្រប់គ្រងការលក់ POS All-in-One, ម៉ាស៊ីនស្កេនបាកូដ និងម៉ាស៊ីនព្រីនវិក្កយបត្រស្ដង់ដារ',
      image: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=1600&q=80',
      link: '/products?category=printers-scanners',
      button_text: t('hero.shop_now', 'ទិញឥឡូវនេះ'),
      badge: 'ENTERPRISE SOLUTION',
      discount_tag: 'ធានារយៈពេល ២ ឆ្នាំ',
      theme_gradient: 'from-[#1e3a5f]/90 via-[#0f1d30]/80 to-transparent',
    },
    {
      id: 5,
      title: 'FLAGSHIP SMARTPHONES & 5G',
      subtitle: 'ទូរស័ព្ទស្មាតហ្វូន & ថេប្លេត Flagship ជំនាន់ចុងក្រោយ បង់រំលស់ការប្រាក់ 0%',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80',
      link: '/products?category=smartphones',
      button_text: t('hero.shop_now', 'ទិញឥឡូវនេះ'),
      badge: 'PRE-ORDER NOW',
      discount_tag: 'ថែមជូនកាដូ $120',
      theme_gradient: 'from-[#4a154b]/90 via-[#2d0d2e]/80 to-transparent',
    },
  ]

  const items = banners && banners.length > 0 ? banners : defaultBanners

  useEffect(() => {
    if (items.length <= 1 || isPaused) return

    setProgress(0)
    const intervalTime = 50
    const step = (intervalTime / SLIDE_DURATION) * 100

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIdx((current) => (current + 1) % items.length)
          return 0
        }
        return prev + step
      })
    }, intervalTime)

    return () => clearInterval(progressTimer)
  }, [items.length, isPaused, activeIdx])

  const nextSlide = () => {
    setProgress(0)
    setActiveIdx((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setProgress(0)
    setActiveIdx((prev) => (prev - 1 + items.length) % items.length)
  }

  const selectSlide = (index: number) => {
    setProgress(0)
    setActiveIdx(index)
  }

  return (
    <div
      className={cn('relative w-full select-none', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Main Slideshow Container (AEON Proportional Dimensions) ── */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-slate-950 border border-slate-200/50 dark:border-slate-800 h-[280px] sm:h-[340px] lg:h-[380px] xl:h-[400px] flex items-center">
        <AnimatePresence mode="wait">
          {items.map((banner, idx) => {
            if (idx !== activeIdx) return null

            return (
              <motion.div
                key={banner.id || idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center"
              >
                {/* Background Imagery with Smooth Zoom Motion */}
                <motion.div
                  initial={{ scale: 1.04 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 5.5, ease: 'easeOut' }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={banner.image || defaultBanners[0].image!}
                    alt={banner.title}
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                </motion.div>

                {/* Lateral Ambient Gradient Overlay (AEON Style Lighting) */}
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-r w-full md:w-[72%] z-1',
                    banner.theme_gradient || 'from-[#2C376B]/90 via-[#1c244b]/80 to-transparent'
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden z-1" />

                {/* Banner Content (Headline, Badge, Pricing, CTA) */}
                <div className="relative z-10 w-full max-w-xl p-5 sm:p-8 lg:p-10 space-y-2.5 sm:space-y-3.5">
                  {/* Top Badge & Discount Tag (AEON Style Stamps) */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.08 }}
                    className="flex items-center gap-2 flex-wrap"
                  >
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 text-[10px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-xs">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{banner.badge || 'AEON ONLINE TECH'}</span>
                    </span>

                    {banner.discount_tag && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e6007e] text-white text-[10px] sm:text-xs font-black shadow-md border border-white/20">
                        <Tag className="w-3 h-3" />
                        <span>{banner.discount_tag}</span>
                      </span>
                    )}
                  </motion.div>

                  {/* Main Title (AEON Impact Typography) */}
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="text-xl sm:text-3xl lg:text-4xl font-black text-white font-display leading-[1.14] tracking-tight drop-shadow-md"
                  >
                    {banner.title}
                  </motion.h2>

                  {/* Subtitle / Description */}
                  {banner.subtitle && (
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.22 }}
                      className="text-[11px] sm:text-xs lg:text-sm text-slate-200 font-normal leading-relaxed line-clamp-2 max-w-lg"
                    >
                      {banner.subtitle}
                    </motion.p>
                  )}

                  {/* Action Button & Service Guarantees */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="pt-1.5 sm:pt-2 flex items-center gap-3 flex-wrap"
                  >
                    <Link
                      to={banner.link || '/products'}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#e6007e] hover:bg-[#c9006e] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-pink-600/30 transition-all transform active:scale-95 inline-flex items-center gap-1.5 group cursor-pointer"
                    >
                      <span>{banner.button_text || t('hero.shop_now', 'ទិញឥឡូវនេះ')}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-200 font-semibold">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>២៥ ខេត្តក្រុង</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                        <span>ធានា ១០០%</span>
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* ── AEON Style Circular Side Arrow Controls (សងខាង) ── */}
        {items.length > 1 && (
          <>
            {/* Left Prev Arrow */}
            <button
              onClick={prevSlide}
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-black/60 text-white shadow-xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-90 cursor-pointer border border-white/20"
              aria-label="Previous Banner"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Next Arrow */}
            <button
              onClick={nextSlide}
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-black/60 text-white shadow-xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-90 cursor-pointer border border-white/20"
              aria-label="Next Banner"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* ── AEON EXACT STYLE PAGINATION CAPSULE (សំខាន់គ្រាប់ ដែលដឹងថាយើងនៅ ទីតាំងមួយណា) ── */}
        {items.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 z-20 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#1c1c1c]/80 backdrop-blur-md border border-white/20 shadow-2xl">
            {items.map((_, idx) => {
              const isActive = activeIdx === idx

              return (
                <button
                  key={idx}
                  onClick={() => selectSlide(idx)}
                  className={cn(
                    'transition-all duration-300 rounded-full cursor-pointer relative flex items-center justify-center',
                    isActive
                      ? 'w-7 sm:w-9 h-2 sm:h-2.5 bg-[#e6007e] shadow-xs shadow-pink-500/80'
                      : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/70 hover:bg-white'
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  {/* Subtle Progress Fill Animation on Active Pink Pill */}
                  {isActive && (
                    <div
                      className="absolute inset-0 bg-white/30 rounded-full transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default HeroBannerSlider
