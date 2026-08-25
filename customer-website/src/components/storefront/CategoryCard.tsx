import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn, resolveMediaUrl } from '@/lib/utils'

export interface CategoryItem {
  id: number
  name: string
  slug: string
  image?: string | null
  icon?: string | null
  description?: string | null
  product_count?: number
}

interface CategoryCardProps {
  category: CategoryItem
  className?: string
}

export const CategoryCard = React.memo<CategoryCardProps>(({ category, className }) => {
  const { t } = useTranslation()
  const fallbackPlaceholder = '/images/placeholder-product.png'
  const imgSrc = resolveMediaUrl(category.image, 'category') || fallbackPlaceholder

  return (
    <Link
      to={`/category/${category.slug}`}
      className={cn(
        'group flex flex-col items-center text-center p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 transform hover:-translate-y-1',
        className
      )}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 dark:bg-slate-800/80 overflow-hidden mb-3.5 p-1.5 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
        <img
          src={imgSrc}
          alt={category.name}
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = fallbackPlaceholder
          }}
          className="w-full h-full object-contain rounded-xl"
          loading="lazy"
        />
      </div>

      <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
        {category.name}
      </h3>

      <span className="text-[11px] font-semibold text-slate-400 mt-1">
        {category.product_count ?? 10}+ {t('common.items')}
      </span>
    </Link>
  )
})

CategoryCard.displayName = 'CategoryCard'

export default CategoryCard
