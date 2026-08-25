import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles, ArrowRight, Tag, Percent, Flame } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useCategories } from '@/hooks'
import { getCategoryIconElement } from '@/lib/icons'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/store'

export const CategorySidebar: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation()
  const { data: categories = [] } = useCategories()
  const [hoveredCat, setHoveredCat] = useState<Category | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (cat: Category) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setHoveredCat(cat)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setHoveredCat(null)
    }, 180)
  }

  const handleFlyoutEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  return (
    <div
      className={cn(
        'relative w-64 bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-between hidden lg:flex select-none',
        className
      )}
      onMouseLeave={handleMouseLeave}
    >
      <div className="space-y-1">
        {/* Header with localized Categories label & Total counter */}
        <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 mb-1">
          <span>{t('nav.categories', 'Categories')}</span>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
            {categories.length} {t('common.total', 'Total')}
          </span>
        </div>

        {/* Category List with interactive Hover triggers */}
        {categories.slice(0, 9).map((cat) => {
          const isHovered = hoveredCat?.id === cat.id

          return (
            <div
              key={cat.id}
              onMouseEnter={() => handleMouseEnter(cat)}
              className="relative"
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all group',
                  isHovered
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400'
                )}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {getCategoryIconElement(cat.slug)}
                  <span className="truncate">{cat.name}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {cat.products_count !== undefined && (
                    <span
                      className={cn(
                        'text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors',
                        isHovered
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      )}
                    >
                      {cat.products_count}
                    </span>
                  )}
                  <ChevronRight
                    className={cn(
                      'w-3.5 h-3.5 transition-transform',
                      isHovered
                        ? 'text-white translate-x-0.5'
                        : 'text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5'
                    )}
                  />
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      {/* ── Rich Subcategory & Quick Filter Hover Popover Panel ────────── */}
      <AnimatePresence>
        {hoveredCat && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={handleFlyoutEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute left-full top-0 ml-3 w-80 bg-white dark:bg-slate-900 rounded-3xl p-4.5 border border-slate-200/90 dark:border-slate-800 shadow-2xl z-50 text-slate-900 dark:text-slate-100 flex flex-col justify-between min-h-[360px]"
          >
            <div className="space-y-3.5">
              {/* Category Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    {getCategoryIconElement(hoveredCat.slug)}
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {hoveredCat.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {hoveredCat.products_count ?? 10}+ {t('common.items')}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/products?category=${hoveredCat.slug}`}
                  onClick={() => setHoveredCat(null)}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 flex-shrink-0"
                >
                  <span>{t('common.view_all')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Subcategories if present */}
              {hoveredCat.children && hoveredCat.children.length > 0 ? (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {t('nav.subcategories', 'Subcategories')}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {hoveredCat.children.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/products?category=${sub.slug}`}
                        onClick={() => setHoveredCat(null)}
                        className="flex flex-col p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800 transition-colors group"
                      >
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          {sub.name}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {sub.products_count ?? 0} {t('common.items')}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Quick Filter Explore Shortcuts */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {t('nav.deals', 'Curated Highlights')}
                </div>
                <div className="space-y-1">
                  <Link
                    to={`/products?category=${hoveredCat.slug}&sort=price_asc`}
                    onClick={() => setHoveredCat(null)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800 transition-colors text-xs font-bold text-slate-700 dark:text-slate-300 group"
                  >
                    <Percent className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {t('nav.best_value_models', 'Best Value Models')}
                    </span>
                  </Link>

                  <Link
                    to={`/products?category=${hoveredCat.slug}&sort=deals`}
                    onClick={() => setHoveredCat(null)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 hover:bg-rose-100/80 border border-rose-100 dark:border-rose-900/40 transition-colors text-xs font-bold text-rose-600 dark:text-rose-400 group"
                  >
                    <Flame className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span className="truncate">
                      {t('nav.discount_deals', 'Discount Deals')}
                    </span>
                  </Link>

                  <Link
                    to={`/products?category=${hoveredCat.slug}&sort=newest`}
                    onClick={() => setHoveredCat(null)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/80 border border-emerald-100 dark:border-emerald-900/40 transition-colors text-xs font-bold text-emerald-600 dark:text-emerald-400 group"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span className="truncate">
                      {t('nav.new_2026_releases', 'New 2026 Releases')}
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Direct Link */}
            <Link
              to={`/products?category=${hoveredCat.slug}`}
              onClick={() => setHoveredCat(null)}
              className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors border border-blue-200/50 dark:border-blue-800/50"
            >
              <span>{t('common.view_all_in', 'View All in')} {hoveredCat.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View All Categories Link */}
      <Link
        to="/products"
        className="mt-2 flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors border border-blue-200/50 dark:border-blue-800/50"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('common.view_all_products', 'View All Products')}</span>
        </div>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

export default CategorySidebar
