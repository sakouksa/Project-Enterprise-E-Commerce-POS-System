import React from 'react'
import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  size = 'md'
}) => {
  const { language } = useThemeStore()
  const { t } = useTranslation(['common', 'products', 'inventory'])

  // Resolve placeholder safely and reactively
  let resolvedPlaceholder = placeholder || ''
  if (!placeholder || placeholder === 'common.search') {
    resolvedPlaceholder = t('common.search', 'Search...')
  } else if (!placeholder.includes(' ') && placeholder.includes('.') && !placeholder.includes('...')) {
    resolvedPlaceholder = t(placeholder, { defaultValue: placeholder })
  }

  // Baseline standard: size 'md' is h-10 (40px) matching form-input / search input standard
  const heightClass =
    size === 'sm'
      ? 'h-8 min-h-[32px] text-xs'
      : size === 'lg'
      ? 'h-12 min-h-[48px] text-sm'
      : 'h-10 min-h-[40px] text-xs sm:text-[13px]'
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14

  return (
    <div className={`relative min-w-[280px] sm:min-w-[340px] md:w-96 max-w-md flex-1 ${className}`} key={language}>
      <Search size={iconSize} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={resolvedPlaceholder}
        className={`w-full ${heightClass} pl-9 pr-8 rounded-xl border border-border/80 bg-background hover:border-muted-foreground/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all placeholder:text-muted-foreground font-medium text-xs sm:text-[13px] shadow-xs`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
          type="button"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}

export default SearchInput
