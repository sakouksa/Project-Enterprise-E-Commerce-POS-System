import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  isValid,
  setMonth,
  setYear
} from 'date-fns'
import { sound } from '@/utils/sound'

export interface EnterpriseDatePickerProps {
  value?: string // format YYYY-MM-DD
  onChange?: (dateStr: string) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  clearable?: boolean
  className?: string
  buttonClassName?: string
  align?: 'left' | 'right'
  minDate?: string
  maxDate?: string
}

export const EnterpriseDatePicker: React.FC<EnterpriseDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select date...',
  disabled = false,
  required = false,
  clearable = true,
  className = '',
  buttonClassName = '',
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Parse current selected date
  const selectedDate = useMemo(() => {
    if (!value) return null
    const parsed = parseISO(value)
    return isValid(parsed) ? parsed : null
  }, [value])

  // View date for calendar month grid (defaults to selected date or today)
  const [viewDate, setViewDate] = useState<Date>(() => selectedDate || new Date())

  // Keep viewDate in sync when value changes or popover opens
  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate)
    }
  }, [selectedDate, isOpen])

  // Floating coordinates for Portal
  const [coords, setCoords] = useState<{
    top: number
    left: number
    right?: number
    width: number
    placement: 'top' | 'bottom'
  }>({ top: 0, left: 0, width: 280, placement: 'bottom' })

  const updateCoords = useCallback(() => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const dropdownEstimatedHeight = 340
    const placement = spaceBelow < dropdownEstimatedHeight && rect.top > spaceBelow ? 'top' : 'bottom'

    const top = placement === 'bottom' ? rect.bottom + 6 : rect.top - 6
    const left = align === 'right' ? undefined : rect.left
    const right = align === 'right' ? window.innerWidth - rect.right : undefined

    setCoords({
      top,
      left: left ?? 0,
      right,
      width: Math.max(rect.width, 280),
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

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const isInsideContainer = containerRef.current?.contains(target)
      const isInsidePopover = popoverRef.current?.contains(target)
      if (!isInsideContainer && !isInsidePopover) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Days matrix for current month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(viewDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })
    return eachDayOfInterval({ start: startDate, end: endDate })
  }, [viewDate])

  const handleSelectDay = (day: Date) => {
    sound.playSuccess()
    const formatted = format(day, 'yyyy-MM-dd')
    onChange?.(formatted)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    sound.playClick()
    onChange?.('')
  }

  const handleToday = () => {
    sound.playSuccess()
    const today = new Date()
    setViewDate(today)
    onChange?.(format(today, 'yyyy-MM-dd'))
    setIsOpen(false)
  }

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    sound.playClick()
    setViewDate((prev) => subMonths(prev, 1))
  }

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    sound.playClick()
    setViewDate((prev) => addMonths(prev, 1))
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = parseInt(e.target.value, 10)
    setViewDate((prev) => setMonth(prev, m))
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const y = parseInt(e.target.value, 10)
    setViewDate((prev) => setYear(prev, y))
  }

  // Generate Year options (current year +/- 15)
  const currentYear = new Date().getFullYear()
  const yearOptions = useMemo(() => {
    const years = []
    for (let y = currentYear - 15; y <= currentYear + 15; y++) {
      years.push(y)
    }
    return years
  }, [currentYear])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayOfWeekLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const displayFormatted = selectedDate ? format(selectedDate, 'MM/dd/yyyy') : ''

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
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
        }}
        className={`w-full h-[38px] flex items-center justify-between gap-2 px-3 py-1.5 bg-card border text-xs font-bold text-foreground rounded-xl transition-all cursor-pointer shadow-2xs ${
          isOpen ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-border/80 hover:border-primary/50 hover:bg-accent/40'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-muted' : ''} ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate flex-1 text-left">
          <CalendarIcon size={14} className="text-primary shrink-0" />
          {displayFormatted ? (
            <span className="font-extrabold text-foreground tracking-wide">{displayFormatted}</span>
          ) : (
            <span className="text-muted-foreground font-medium truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {clearable && value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors cursor-pointer"
            >
              <X size={13} />
            </span>
          )}
        </div>
      </button>

      {/* Portal Popover Calendar */}
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
                width: '300px',
                zIndex: 99999,
              }}
              className="bg-card border border-border/80 rounded-2xl shadow-2xl p-3 space-y-3 ring-1 ring-black/5 dark:ring-white/10"
            >
              {/* Header Navigation */}
              <div className="flex items-center justify-between gap-1 pb-2 border-b border-border/60">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1 text-xs font-black text-foreground">
                  <select
                    value={viewDate.getMonth()}
                    onChange={handleMonthChange}
                    className="bg-transparent hover:bg-accent cursor-pointer font-bold rounded px-1 py-0.5 outline-none text-foreground border border-transparent hover:border-border"
                  >
                    {months.map((m, idx) => (
                      <option key={m} value={idx} className="bg-card text-foreground">
                        {m}
                      </option>
                    ))}
                  </select>

                  <select
                    value={viewDate.getFullYear()}
                    onChange={handleYearChange}
                    className="bg-transparent hover:bg-accent cursor-pointer font-bold rounded px-1 py-0.5 outline-none text-foreground border border-transparent hover:border-border"
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y} className="bg-card text-foreground">
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 text-center gap-1">
                {dayOfWeekLabels.map((day) => (
                  <span key={day} className="text-[11px] font-extrabold text-muted-foreground uppercase py-1">
                    {day}
                  </span>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((day) => {
                  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
                  const isCurrentMonth = isSameMonth(day, viewDate)
                  const isDayToday = isToday(day)

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className={`h-8 w-full rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-500/30 scale-105'
                          : isDayToday
                          ? 'border border-primary text-primary font-black bg-primary/10'
                          : isCurrentMonth
                          ? 'text-foreground hover:bg-primary/15 hover:text-primary'
                          : 'text-muted-foreground/35 hover:text-foreground hover:bg-accent/40'
                      }`}
                    >
                      {format(day, 'd')}
                    </button>
                  )
                })}
              </div>

              {/* Footer Quick Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs font-bold">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-rose-500 hover:text-rose-600 hover:underline px-2 py-1 transition-all cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleToday}
                  className="text-blue-600 dark:text-blue-400 hover:underline px-2 py-1 transition-all cursor-pointer font-extrabold"
                >
                  Today
                </button>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}

export default EnterpriseDatePicker
