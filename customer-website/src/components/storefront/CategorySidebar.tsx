import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCategories } from '@/hooks'
import { getCategoryIconElement } from '@/lib/icons'
import { cn } from '@/lib/utils'

export const CategorySidebar: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation()
  // Use global custom hook
  const { data: categories = [] } = useCategories()

  return (
    <div
      className={cn(
        'w-64 bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-between hidden lg:flex select-none',
        className
      )}
    >
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 mb-1">
          <span>{t('nav.categories', 'Categories')}</span>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
            {categories.length} Total
          </span>
        </div>

        {categories.slice(0, 9).map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.slug}`}
            className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
          >
            <div className="flex items-center gap-2.5 truncate">
              {getCategoryIconElement(cat.slug)}
              <span className="truncate">{cat.name}</span>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {cat.products_count !== undefined && (
                <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  {cat.products_count}
                </span>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* View All Categories Link */}
      <Link
        to="/products"
        className="mt-2 flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors border border-blue-200/50 dark:border-blue-800/50"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('common.view_all', 'View All Products')}</span>
        </div>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

export default CategorySidebar
