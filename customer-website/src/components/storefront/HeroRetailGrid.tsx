import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import CategorySidebar from './CategorySidebar'
import HeroBannerSlider, { type BannerItem } from './HeroBannerSlider'
import { cn } from '@/lib/utils'

interface HeroRetailGridProps {
  banners?: BannerItem[]
  className?: string
}

export const HeroRetailGrid: React.FC<HeroRetailGridProps> = ({ banners = [], className }) => {
  const quickCards = [
    {
      id: 1,
      title: 'កុំព្យូទ័រ & Laptops',
      titleEn: 'Computers & Mac',
      link: '/products?category=laptops',
      bgGradient: 'from-[#f5b841] to-[#f7c844]',
      arrowBg: 'bg-[#e09e1f]',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 2,
      title: 'ហ្គេម & Gaming Arena',
      titleEn: 'Pro Gaming Gear',
      link: '/products?category=keyboards',
      bgGradient: 'from-[#e6007e] to-[#f06ea9]',
      arrowBg: 'bg-[#c4006b]',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 3,
      title: 'សំឡេង & គ្រឿងបន្លាស់',
      titleEn: 'Studio Audio & Accs',
      link: '/products?category=audio-sound',
      bgGradient: 'from-[#f26565] to-[#f88585]',
      arrowBg: 'bg-[#db4848]',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    },
  ]

  return (
    <div className={cn('w-full pt-3 sm:pt-4', className)}>
      <div className="container-site">
        <div className="flex gap-3 lg:gap-4 items-stretch">
          {/* Desktop Left Category Tree Menu (AEON Style Sidebar) */}
          <CategorySidebar className="flex-shrink-0" />

          {/* Center / Right Hero Section (Slider + 3 AEON Quick Promo Cards) */}
          <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
            {/* Top: AEON Style Hero Banner Slider */}
            <HeroBannerSlider banners={banners} className="pt-0" />

            {/* Bottom: 3 AEON Promotional Sub-Banners with Diagonal Arrow Button ↗ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {quickCards.map((card) => (
                <Link
                  key={card.id}
                  to={card.link}
                  className={cn(
                    'group relative flex items-center justify-between p-3 sm:p-3.5 rounded-2xl text-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 select-none bg-gradient-to-r',
                    card.bgGradient
                  )}
                >
                  {/* Left Title & Arrow Button */}
                  <div className="relative z-10 flex flex-col justify-between h-full space-y-2">
                    <h3 className="text-xs sm:text-sm font-black font-display tracking-tight leading-snug drop-shadow-xs">
                      {card.title}
                    </h3>
                    <div
                      className={cn(
                        'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-45',
                        card.arrowBg
                      )}
                    >
                      <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                  </div>

                  {/* Right Cutout Image */}
                  <div className="relative w-20 h-16 sm:w-24 sm:h-18 flex-shrink-0 flex items-center justify-end overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover rounded-xl shadow-xs group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroRetailGrid
