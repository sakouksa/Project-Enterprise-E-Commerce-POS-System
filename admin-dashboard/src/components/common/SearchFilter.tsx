import React from 'react'
import { Search, RefreshCw, Filter } from 'lucide-react'

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
    {filters.map(f => (
      <div key={f.key} className="relative">
        <Filter size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <select
          value={f.value}
          onChange={e => f.onChange(e.target.value)}
          className="pl-7 pr-8 py-2 text-sm bg-muted border border-border rounded-lg appearance-none
                     focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-background
                     text-foreground cursor-pointer transition-all"
        >
          {f.placeholder && <option value="">{f.placeholder}</option>}
          {f.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    ))}

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
