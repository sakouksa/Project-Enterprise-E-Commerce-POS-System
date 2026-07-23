import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Search, X, Loader2, AlertCircle, RefreshCw, User, Package, Building2, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '@/api/client'
import { sound } from '@/utils/sound'

export interface EnterpriseSelectOption {
  value: string | number
  label: string
  title?: string
  subtitle?: string
  description?: string
  code?: string
  badge?: string | { name?: string; label?: string }
  badgeColor?: string
  avatar?: string
  icon?: React.ReactNode
  disabled?: boolean
  raw?: any
}

export interface EnterpriseSelectProps {
  value?: string | number | (string | number)[]
  onChange?: (value: any, option?: EnterpriseSelectOption | EnterpriseSelectOption[]) => void
  options?: EnterpriseSelectOption[]
  asyncSearch?: (query: string) => Promise<EnterpriseSelectOption[]>
  fetchUrl?: string
  queryParams?: Record<string, any>
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  multiple?: boolean
  clearable?: boolean
  allowClear?: boolean
  disabled?: boolean
  required?: boolean
  loading?: boolean
  error?: string
  helperText?: string
  icon?: React.ReactNode
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  className?: string
  buttonClassName?: string
  dropdownClassName?: string
  align?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
  autoFocusSearch?: boolean
}

export const EnterpriseSelect: React.FC<EnterpriseSelectProps> = ({
  value,
  onChange,
  options: staticOptions,
  asyncSearch,
  fetchUrl,
  queryParams,
  label,
  placeholder,
  searchPlaceholder,
  multiple = false,
  clearable = true,
  allowClear = true,
  disabled = false,
  required = false,
  loading: externalLoading = false,
  error: externalError,
  helperText,
  icon,
  prefix,
  suffix,
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  align = 'left',
  size = 'md',
  autoFocusSearch = true,
}) => {
  const { t } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [asyncOptions, setAsyncOptions] = useState<EnterpriseSelectOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const [coords, setCoords] = useState<{
    top: number
    left: number
    right?: number
    width: number
    placement: 'top' | 'bottom'
  }>({ top: 0, left: 0, width: 0, placement: 'bottom' })

  const isClearable = clearable && allowClear

  // Calculate coordinates for portal floating dropdown
  const updateCoords = useCallback(() => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const dropdownEstimatedHeight = 280
    const placement = spaceBelow < dropdownEstimatedHeight && rect.top > spaceBelow ? 'top' : 'bottom'

    const top = placement === 'bottom' ? rect.bottom + 6 : rect.top - 6
    const left = align === 'right' ? undefined : rect.left
    const right = align === 'right' ? window.innerWidth - rect.right : undefined

    setCoords({
      top,
      left: left ?? 0,
      right,
      width: Math.max(rect.width, 220),
      placement,
    })
  }, [align])

  useEffect(() => {
    if (!isOpen) return
    updateCoords()
    window.addEventListener('resize', updateCoords)
    window.addEventListener('scroll', updateCoords, true)
    return () => {
      window.removeEventListener('resize', updateCoords)
      window.removeEventListener('scroll', updateCoords, true)
    }
  }, [isOpen, updateCoords])

  // Fetch Remote Options if fetchUrl or asyncSearch provided
  const loadAsyncData = useCallback(async (query: string = '') => {
    if (!asyncSearch && !fetchUrl) return
    setIsLoading(true)
    setFetchError(null)

    try {
      if (asyncSearch) {
        const res = await asyncSearch(query)
        setAsyncOptions(res || [])
      } else if (fetchUrl) {
        const res = await api.get(fetchUrl, {
          params: { q: query, search: query, limit: 50, ...queryParams },
        })
        const data = res.data?.data?.data || res.data?.data || res.data || []
        const mapped: EnterpriseSelectOption[] = data.map((item: any) => ({
          value: item.id ?? item.code ?? item.value,
          label: item.name ?? item.title ?? item.label ?? String(item.id),
          title: item.name ?? item.title ?? item.label,
          subtitle: item.code || item.sku || item.phone || item.email || item.description || item.department?.name,
          code: item.code || item.sku,
          badge: item.status || item.role || item.group?.name || item.type,
          avatar: item.avatar || item.primary_image?.image || item.image,
          raw: item,
        }))
        setAsyncOptions(mapped)
      }
    } catch (err: any) {
      setFetchError(err?.message || 'Failed to load options')
    } finally {
      setIsLoading(false)
    }
  }, [asyncSearch, fetchUrl, queryParams])

  // Initial and debounced API fetching
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      loadAsyncData(filterText)
    }, asyncSearch || fetchUrl ? 300 : 0)
    return () => clearTimeout(timer)
  }, [filterText, isOpen, loadAsyncData, asyncSearch, fetchUrl])

  // Combine static and remote options
  const allOptions = useMemo(() => {
    if (fetchUrl || asyncSearch) {
      return asyncOptions
    }
    return staticOptions || []
  }, [fetchUrl, asyncSearch, asyncOptions, staticOptions])

  // Filter options locally if no remote API search
  const filteredOptions = useMemo(() => {
    if (fetchUrl || asyncSearch) return allOptions
    if (!filterText.trim()) return allOptions
    const q = filterText.toLowerCase()
    return allOptions.filter((o) => {
      const badgeText = typeof o.badge === 'object' && o.badge ? o.badge.name || o.badge.label || '' : String(o.badge || '')
      return (
        o.label.toLowerCase().includes(q) ||
        (o.title && o.title.toLowerCase().includes(q)) ||
        (o.subtitle && o.subtitle.toLowerCase().includes(q)) ||
        (o.code && o.code.toLowerCase().includes(q)) ||
        badgeText.toLowerCase().includes(q)
      )
    })
  }, [allOptions, filterText, fetchUrl, asyncSearch])

  // Selected Option(s) lookup
  const selectedOption = useMemo(() => {
    if (multiple && Array.isArray(value)) {
      return allOptions.filter((o) => value.map(String).includes(String(o.value)))
    }
    return allOptions.find((o) => String(o.value) === String(value))
  }, [value, allOptions, multiple])

  const popoverRef = useRef<HTMLDivElement>(null)

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const isInsideContainer = containerRef.current && containerRef.current.contains(target)
      const isInsidePopover = popoverRef.current && popoverRef.current.contains(target)
      if (!isInsideContainer && !isInsidePopover) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto focus search input when opening
  useEffect(() => {
    if (isOpen && autoFocusSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
    if (isOpen) {
      setHighlightedIndex(0)
    }
  }, [isOpen, autoFocusSearch])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
      case 'Tab':
        setIsOpen(false)
        break
    }
  }

  // Handle option selection
  const handleSelect = (opt: EnterpriseSelectOption) => {
    if (opt.disabled) return
    sound.playSuccess()

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : []
      const exists = currentValues.map(String).includes(String(opt.value))
      let newValues: (string | number)[]
      if (exists) {
        newValues = currentValues.filter((v) => String(v) !== String(opt.value))
      } else {
        newValues = [...currentValues, opt.value]
      }
      const selectedOpts = allOptions.filter((o) => newValues.map(String).includes(String(o.value)))
      onChange?.(newValues, selectedOpts)
    } else {
      onChange?.(opt.value, opt)
      setIsOpen(false)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    sound.playClick()
    onChange?.(multiple ? [] : '', multiple ? [] : undefined)
  }

  // Size styling
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs rounded-xl h-[34px]',
    md: 'px-3 py-1.5 text-xs rounded-xl h-[38px]',
    lg: 'px-4 py-2 text-sm rounded-2xl h-[44px]',
  }[size]

  const displayPlaceholder = placeholder || t('select.placeholder', 'Select option...')
  const displaySearchPlaceholder = searchPlaceholder || t('select.search', 'Search...')
  const alignPositionClass = align === 'right' ? 'right-0' : 'left-0'

  const hasValue = multiple
    ? Array.isArray(value) && value.length > 0
    : value !== undefined && value !== null && value !== ''

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`} onKeyDown={handleKeyDown}>
      {label && (
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return
          sound.playClick()
          setIsOpen(!isOpen)
          setFilterText('')
        }}
        className={`w-full flex items-center justify-between gap-2 bg-card border text-foreground transition-all cursor-pointer shadow-2xs ${sizeClasses} ${
          isOpen ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-border hover:border-primary/50 hover:bg-accent/40'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-muted' : ''} ${externalError ? 'border-rose-500 ring-2 ring-rose-500/20' : ''} ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate flex-1 text-left">
          {(icon || prefix) && <span className="text-primary shrink-0">{icon || prefix}</span>}

          {/* Selected Content Display */}
          {multiple && Array.isArray(selectedOption) ? (
            selectedOption.length > 0 ? (
              <div className="flex flex-wrap gap-1 items-center max-w-full truncate">
                {selectedOption.slice(0, 3).map((opt) => (
                  <span
                    key={opt.value}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[11px] font-bold"
                  >
                    {opt.label}
                  </span>
                ))}
                {selectedOption.length > 3 && (
                  <span className="text-[10px] font-bold text-muted-foreground">+{selectedOption.length - 3}</span>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground font-medium truncate">{displayPlaceholder}</span>
            )
          ) : !multiple && selectedOption && !Array.isArray(selectedOption) ? (
            <div className="flex items-center gap-2 min-w-0 truncate">
              {selectedOption.avatar ? (
                <img src={selectedOption.avatar} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
              ) : selectedOption.icon ? (
                <span className="shrink-0">{selectedOption.icon}</span>
              ) : null}
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-extrabold text-foreground truncate">{selectedOption.label}</span>
                {selectedOption.subtitle && (
                  <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                    ({selectedOption.subtitle})
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground font-medium truncate">{displayPlaceholder}</span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(externalLoading || isLoading) && <Loader2 size={14} className="animate-spin text-primary shrink-0" />}

          {isClearable && hasValue && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors cursor-pointer"
            >
              <X size={13} />
            </span>
          )}

          {suffix}

          <ChevronDown
            size={14}
            className={`text-muted-foreground shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
          />
        </div>
      </button>

      {/* Helper Text or Error */}
      {(externalError || helperText) && (
        <p className={`text-[11px] mt-1 ${externalError ? 'text-rose-500 font-semibold' : 'text-muted-foreground'}`}>
          {externalError || helperText}
        </p>
      )}

      {/* Popover Dropdown Panel rendered via Portal to prevent modal height distortion & overflow clipping */}
      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, y: coords.placement === 'top' ? 8 : -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: coords.placement === 'top' ? 8 : -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: coords.placement === 'bottom' ? `${coords.top}px` : 'auto',
                bottom: coords.placement === 'top' ? `${window.innerHeight - coords.top}px` : 'auto',
                left: align === 'right' ? 'auto' : `${coords.left}px`,
                right: align === 'right' ? `${coords.right}px` : 'auto',
                minWidth: `${coords.width}px`,
                maxWidth: '380px',
                zIndex: 99999,
              }}
              className={`bg-card border border-border rounded-2xl shadow-2xl p-2 space-y-1 ring-1 ring-black/5 dark:ring-white/10 ${dropdownClassName}`}
            >
              {/* Quick Search Box */}
              <div className="relative mb-1 px-1">
                <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder={displaySearchPlaceholder}
                  className="w-full bg-muted/40 border border-border/70 rounded-xl pl-8 pr-8 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground"
                />
                {filterText && (
                  <button
                    type="button"
                    onClick={() => setFilterText('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Options List Container */}
              <div ref={listRef} className="max-h-64 overflow-y-auto space-y-1 pr-0.5 custom-scrollbar">
                {isLoading ? (
                  <div className="p-4 text-center space-y-2">
                    <Loader2 size={18} className="animate-spin text-primary mx-auto" />
                    <p className="text-xs text-muted-foreground font-medium">{t('loading', 'Loading options...')}</p>
                  </div>
                ) : fetchError ? (
                  <div className="p-3 text-center space-y-2">
                    <AlertCircle size={18} className="text-rose-500 mx-auto" />
                    <p className="text-xs text-rose-500 font-medium">{fetchError}</p>
                    <button
                      type="button"
                      onClick={() => loadAsyncData(filterText)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                    >
                      <RefreshCw size={12} /> {t('retry', 'Retry')}
                    </button>
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="p-4 text-center space-y-1 text-muted-foreground">
                    <Search size={20} className="mx-auto opacity-40 mb-1" />
                    <p className="text-xs font-semibold">{t('noOptions', 'No options found')}</p>
                    {filterText && <p className="text-[11px] opacity-75">"{filterText}"</p>}
                  </div>
                ) : (
                  filteredOptions.map((opt, idx) => {
                    const isSelected = multiple
                      ? Array.isArray(value) && value.map(String).includes(String(opt.value))
                      : String(opt.value) === String(value)

                    const isHighlighted = idx === highlightedIndex
                    const badgeText = typeof opt.badge === 'object' && opt.badge ? opt.badge.name || opt.badge.label || '' : String(opt.badge || '')

                    return (
                      <button
                        key={`${opt.value}-${idx}`}
                        type="button"
                        disabled={opt.disabled}
                        onClick={() => handleSelect(opt)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-primary text-primary-foreground font-black shadow-xs'
                            : isHighlighted
                            ? 'bg-primary/15 text-primary font-bold'
                            : 'text-foreground hover:bg-primary/10 hover:text-primary font-semibold'
                        } ${opt.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 truncate flex-1">
                          {opt.avatar ? (
                            <img src={opt.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/20" />
                          ) : opt.icon ? (
                            <span className="shrink-0">{opt.icon}</span>
                          ) : null}

                          <div className="min-w-0 truncate">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="truncate font-extrabold">{opt.title || opt.label}</span>
                              {opt.code && (
                                <span className={`text-[10px] font-mono font-bold px-1 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
                                  {opt.code}
                                </span>
                              )}
                            </div>
                            {(opt.subtitle || opt.description) && (
                              <p className={`text-[10px] truncate ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                {opt.subtitle || opt.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {badgeText && (
                            <span
                              className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {badgeText}
                            </span>
                          )}
                          {isSelected && <Check size={14} className="shrink-0" />}
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}

export default EnterpriseSelect
