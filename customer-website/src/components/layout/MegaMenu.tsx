import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCategories, useBrands } from '@/hooks'
import { getCategoryIconElement } from '@/lib/icons'
import { cn } from '@/lib/utils'

export const MegaMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation()

  // Use global custom hooks
  const { data: categories = [] } = useCategories()
  const { data: brands = [] } = useBrands()

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)

  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) || categories[0] || null

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.15 }}
        className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl z-50 text-slate-900 dark:text-slate-100"
      >
        <div className="container-site py-6">
          <div className="grid grid-cols-12 gap-6 min-h-[380px]">
            {/* ── Left Column: Categories List ──────────────────────────── */}
            <div className="col-span-3 border-r border-slate-100 dark:border-slate-800 pr-4 space-y-1">
              <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 mb-2">
                <span>{t('nav.all_categories', 'All Categories')}</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                  {categories.length} {t('common.total', 'Total')}
                </span>
              </div>

              <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
                {categories.map((cat) => {
                  const isSelected = activeCategory?.id === cat.id
                  return (
                    <button
                      key={cat.id}
                      onMouseEnter={() => setActiveCategoryId(cat.id)}
                      onClick={() => onClose()}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all text-left group cursor-pointer',
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-blue-600 dark:hover:text-blue-400'
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {getCategoryIconElement(cat.slug)}
                        <span className="truncate">{cat.name}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {cat.products_count !== undefined && (
                          <span
                            className={cn(
                              'text-[10px] px-1.5 py-0.5 rounded-full font-extrabold',
                              isSelected
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
                            isSelected
                              ? 'text-white translate-x-0.5'
                              : 'text-slate-400 group-hover:text-blue-500'
                          )}
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Middle Column: Active Category Details & Products ─────── */}
            <div className="col-span-6 pl-2 pr-4 space-y-4">
              {activeCategory && (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        {getCategoryIconElement(activeCategory.slug)}
                        <span>{activeCategory.name} {t('nav.catalog', 'Catalog')}</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activeCategory.description || t('nav.genuine_tech_warranty', '100% Genuine Tech with Official Warranty')}
                      </p>
                    </div>

                    <Link
                      to={`/products?category=${activeCategory.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                    >
                      <span>{t('common.view_all_in', 'View All in')} {activeCategory.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Subcategory Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {activeCategory.children && activeCategory.children.length > 0 ? (
                      activeCategory.children.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/products?category=${sub.slug}`}
                          onClick={onClose}
                          className="flex flex-col p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-700/60 transition-all group"
                        >
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {sub.name}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1">
                            {sub.products_count ?? 0} {t('common.items', 'items')}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <>
                        <Link
                          to={`/products?category=${activeCategory.slug}&sort=price_asc`}
                          onClick={onClose}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/60 border border-slate-100 dark:border-slate-800 transition-all text-xs font-bold text-slate-700 dark:text-slate-300"
                        >
                          💸 {t('nav.best_value_models', 'Best Value Models')}
                        </Link>
                        <Link
                          to={`/products?category=${activeCategory.slug}&sort=deals`}
                          onClick={onClose}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50/60 border border-slate-100 dark:border-slate-800 transition-all text-xs font-bold text-rose-600 dark:text-rose-400"
                        >
                          🔥 {t('nav.discount_deals', 'Discount Deals')}
                        </Link>
                        <Link
                          to={`/products?category=${activeCategory.slug}&sort=newest`}
                          onClick={onClose}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/60 border border-slate-100 dark:border-slate-800 transition-all text-xs font-bold text-emerald-600 dark:text-emerald-400"
                        >
                          ✨ {t('nav.new_2026_releases', 'New 2026 Releases')}
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ── Right Column: Official Brands & Featured Showcase ───── */}
            <div className="col-span-3 border-l border-slate-100 dark:border-slate-800 pl-4 space-y-4">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between mb-2">
                  <span>{t('nav.official_brands', 'Official Brands')}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {brands.slice(0, 6).map((brand) => (
                    <Link
                      key={brand.id}
                      to={`/products?brand=${brand.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors group"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                        {brand.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Promo Banner Card inside Mega Menu */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#2C376B] to-slate-900 text-white shadow-lg space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300">
                  {t('nav.enterprise_warranty', 'Enterprise Warranty')}
                </div>
                <div className="text-xs font-black">
                  {t('nav.genuine_tech_warranty', '100% Genuine Tech with Official Warranty')}
                </div>
                <Link
                  to="/products?sort=deals"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:underline pt-1"
                >
                  <span>{t('nav.explore_special_promotions', 'Explore Special Promotions')}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MegaMenu
