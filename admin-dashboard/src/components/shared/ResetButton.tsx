import React from 'react'
import { RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ResetButtonProps {
  onClick: () => void
  label?: string
  className?: string
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const ResetButton: React.FC<ResetButtonProps> = ({ 
  onClick, 
  label, 
  className = '',
  iconOnly = false,
  size = 'md'
}) => {
  const { t } = useTranslation(['common', 'buttons'])
  const displayLabel = label ? t(label, { defaultValue: label }) : t('common.reset', 'Reset')

  const heightClass = size === 'sm' ? 'h-8 text-xs' : size === 'lg' ? 'h-11 text-sm' : 'h-10 text-xs sm:text-sm'
  const paddingClass = iconOnly ? (size === 'sm' ? 'w-8 px-0' : size === 'lg' ? 'w-11 px-0' : 'w-10 px-0') : 'px-3.5'

  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 ${heightClass} ${paddingClass} font-semibold text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-muted/80 rounded-xl transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer select-none shrink-0 ${className}`}
      type="button"
      title={displayLabel}
      aria-label={displayLabel}
    >
      <RotateCcw 
        className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:-rotate-90 transition-transform duration-300 ease-out shrink-0" 
        strokeWidth={2} 
      />
      {!iconOnly && <span className="tracking-tight">{displayLabel}</span>}
    </button>
  )
}

export default ResetButton

