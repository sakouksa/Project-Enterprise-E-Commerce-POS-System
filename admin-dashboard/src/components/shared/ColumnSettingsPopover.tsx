import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Search,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface ColumnOption {
  key: string
  label: string
}

interface ColumnSettingsPopoverProps {
  columns: ColumnOption[]
  visibleColumns: Record<string, boolean>
  onChange: (updated: Record<string, boolean>) => void
  defaultVisibleColumns?: Record<string, boolean>
  title?: string
  className?: string
}

export const ColumnSettingsPopover: React.FC<ColumnSettingsPopoverProps> = ({
  columns,
  visibleColumns,
  onChange,
  defaultVisibleColumns,
  title,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const popoverRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation(['common', 'products', 'employees'])

  const visibleCount = useMemo(
    () => columns.filter((col) => visibleColumns[col.key] !== false).length,
    [columns, visibleColumns]
  )
  const hiddenCount = columns.length - visibleCount

  // Filter columns by search query
  const filteredColumns = useMemo(() => {
    if (!searchQuery.trim()) return columns
    const q = searchQuery.toLowerCase().trim()
    return columns.filter((col) => col.label.toLowerCase().includes(q))
  }, [columns, searchQuery])

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Reset search on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
    }
  }, [isOpen])

  const handleToggle = (key: string) => {
    onChange({
      ...visibleColumns,
      [key]: visibleColumns[key] === false ? true : false,
    })
  }

  const handleShowAll = () => {
    const next: Record<string, boolean> = {}
    columns.forEach((col) => {
      next[col.key] = true
    })
    onChange(next)
  }

  const handleHideAll = () => {
    const next: Record<string, boolean> = {}
    columns.forEach((col, index) => {
      // Keep at least the first column visible to prevent empty table layout collapse
      next[col.key] = index === 0
    })
    onChange(next)
  }

  const handleReset = () => {
    if (defaultVisibleColumns) {
      onChange({ ...defaultVisibleColumns })
    } else {
      const next: Record<string, boolean> = {}
      columns.forEach((col) => {
        next[col.key] = true
      })
      onChange(next)
    }
  }

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-10 w-10 rounded-xl border transition-all duration-200 shadow-xs hover:shadow active:scale-[0.98] cursor-pointer flex items-center justify-center relative shrink-0 ${
          isOpen
            ? 'bg-primary/10 border-primary/40 text-primary dark:bg-primary/20 dark:border-primary/50'
            : hiddenCount > 0
            ? 'bg-primary/5 border-primary/30 text-primary hover:bg-primary/15'
            : 'bg-card dark:bg-slate-900 text-muted-foreground dark:text-slate-300 border-border/80 dark:border-slate-800 hover:text-foreground dark:hover:text-white hover:bg-muted/80 dark:hover:bg-slate-800'
        }`}
        title={t('common.columnsVisibility', 'Column Visibility')}
        aria-expanded={isOpen}
      >
        <Settings
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? 'rotate-90 text-primary' : ''
          }`}
        />
        {hiddenCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-75">
            {hiddenCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click dismiss */}
            <div
              className="fixed inset-0 z-40 bg-black/10 dark:bg-black/30 backdrop-blur-[1px]"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-3.5 space-y-3 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-border/60 dark:border-slate-800">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <SlidersHorizontal size={14} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-bold text-foreground dark:text-slate-100 truncate">
                      {title || t('common.columnsVisibility', 'Column Visibility')}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20">
                    {visibleCount} / {columns.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground dark:hover:text-slate-200 hover:bg-muted/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title={t('common.close', 'Close')}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={handleShowAll}
                  className="flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-xl bg-muted/60 dark:bg-slate-800/80 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 text-muted-foreground dark:text-slate-300 transition-all cursor-pointer border border-border/40 dark:border-slate-700/50 shadow-2xs"
                  title={t('common.showAll', 'Show All')}
                >
                  <Eye size={11} className="shrink-0" />
                  <span className="truncate">{t('common.showAll', 'Show All')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleHideAll}
                  className="flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-xl bg-muted/60 dark:bg-slate-800/80 hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20 text-muted-foreground dark:text-slate-300 transition-all cursor-pointer border border-border/40 dark:border-slate-700/50 shadow-2xs"
                  title={t('common.hideAll', 'Hide All')}
                >
                  <EyeOff size={11} className="shrink-0" />
                  <span className="truncate">{t('common.hideAll', 'Hide All')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-xl bg-muted/60 dark:bg-slate-800/80 hover:bg-muted dark:hover:bg-slate-700 text-muted-foreground dark:text-slate-300 hover:text-foreground dark:hover:text-white transition-all cursor-pointer border border-border/40 dark:border-slate-700/50 shadow-2xs"
                  title={t('common.reset', 'Reset')}
                >
                  <RotateCcw size={11} className="shrink-0" />
                  <span className="truncate">{t('common.reset', 'Reset')}</span>
                </button>
              </div>

              {/* Search filter if there are more than 5 columns */}
              {columns.length > 5 && (
                <div className="relative">
                  <Search
                    size={12}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('common.searchColumns', 'Search columns...')}
                    className="w-full pl-7 pr-7 py-1.5 text-xs rounded-xl bg-muted/50 dark:bg-slate-800/60 border border-border/70 dark:border-slate-700/80 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>
              )}

              {/* Column Checkboxes List */}
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {filteredColumns.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground dark:text-slate-400 flex flex-col items-center justify-center gap-1.5">
                    <Search size={18} className="opacity-40" />
                    <span>{t('common.noColumnsFound', 'No columns found')}</span>
                  </div>
                ) : (
                  filteredColumns.map((col) => {
                    const isChecked = visibleColumns[col.key] !== false
                    return (
                      <div
                        key={col.key}
                        onClick={() => handleToggle(col.key)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer select-none transition-all duration-150 ${
                          isChecked
                            ? 'bg-primary/8 dark:bg-primary/15 text-foreground dark:text-slate-100 hover:bg-primary/12 dark:hover:bg-primary/25 border border-primary/15 dark:border-primary/20'
                            : 'text-muted-foreground dark:text-slate-400 hover:bg-muted/60 dark:hover:bg-slate-800/60 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                              isChecked
                                ? 'bg-primary border-primary text-primary-foreground shadow-2xs'
                                : 'border-border/80 dark:border-slate-700 bg-background dark:bg-slate-800'
                            }`}
                          >
                            {isChecked && <Check size={11} strokeWidth={3} />}
                          </div>
                          <span className="truncate">{col.label}</span>
                        </div>

                        {isChecked && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 ml-2" />
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-border/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-muted-foreground dark:text-slate-400">
                <span>
                  {t('common.columnsVisibleCount', {
                    count: visibleCount,
                    total: columns.length,
                    defaultValue: `${visibleCount} / ${columns.length} visible`,
                  })}
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="font-medium text-primary hover:text-primary/80 dark:hover:text-primary/90 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw size={10} />
                  <span>{t('common.reset', 'Reset')}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ColumnSettingsPopover
