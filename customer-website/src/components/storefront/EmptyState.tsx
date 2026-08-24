import React from 'react'
import { PackageOpen, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}) => {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl bg-gray-50/50 dark:bg-gray-900/30 border border-dashed border-gray-200 dark:border-gray-800',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-4">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
        {title || t('common.no_items')}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
