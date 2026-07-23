import React from 'react'
import { Search, RefreshCw, Filter } from 'lucide-react'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'

// ─── Types ───────────────────────────────────────────────────────────────────

interface FilterOption {
  label: string
  value: string
}

interface FilterField {
  key: string
  placeholder?: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

interface SearchFilterProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filters?: FilterField[]
  onRefresh?: () => void
  onReset?: () => void
  loading?: boolean
  actions?: React.ReactNode   // extra buttons on the right side
}

// ─── Component ───────────────────────────────────────────────────────────────

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  onRefresh,
  onReset,
  loading = false,
  actions,
}) => (
  <div className="flex flex-wrap items-center gap-3">

    {/* Search input */}
    <div className="relative flex-1 min-w-[220px]">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={searchValue}
        onChange={e => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-background
                   placeholder:text-muted-foreground transition-all"
      />
    </div>

    {/* Dropdown filters */}
    {filters.map(f => {
      const options = [
        ...(f.placeholder ? [{ value: '', label: f.placeholder }] : []),
        ...f.options.map(opt => ({ value: opt.value, label: opt.label }))
      ]
      return (
        <ModernSelect
          key={f.key}
          value={f.value}
          onChange={(val) => f.onChange(String(val))}
          options={options}
          placeholder={f.placeholder || 'Select...'}
        />
      )
    })}

    {/* Reset */}
    {onReset && (
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm
                   text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Reset"
      >
        <Filter size={14} />
        Reset
      </button>
    )}

    {/* Refresh */}
    {onRefresh && (
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm
                   text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        title="Refresh"
      >
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
      </button>
    )}

    {/* Right-side actions */}
    {actions && <div className="flex items-center gap-2 ml-auto">{actions}</div>}
  </div>
)

export default SearchFilter
