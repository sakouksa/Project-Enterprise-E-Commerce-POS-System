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
    resolvedPlaceholder = t('common.search', 'ស្វែងរក...')
  } else if (!placeholder.includes(' ') && placeholder.includes('.') && !placeholder.includes('...')) {
    resolvedPlaceholder = t(placeholder, { defaultValue: placeholder })
  }

  const heightClass = size === 'sm' ? 'h-8 text-xs' : size === 'lg' ? 'h-11 text-sm' : 'h-10 text-xs sm:text-sm'

  return (
    <div className={`relative min-w-[280px] sm:min-w-[340px] md:w-96 max-w-md flex-1 ${className}`} key={language}>
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={resolvedPlaceholder}
        className={`w-full ${heightClass} pl-10 pr-9 rounded-xl border border-border bg-card hover:border-muted-foreground/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all placeholder:text-muted-foreground font-medium text-xs sm:text-sm shadow-sm`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
          type="button"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

export default SearchInput
