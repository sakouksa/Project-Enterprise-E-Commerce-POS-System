import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface TableActionItem {
  label: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
  onClick: () => void
  variant?: 'default' | 'danger' | 'warning' | 'success'
  disabled?: boolean
  hidden?: boolean
}

interface TableActionMenuProps {
  items?: TableActionItem[]
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
  editLabel?: string
  deleteLabel?: string
  viewLabel?: string
  align?: 'right' | 'left'
  className?: string
  triggerSize?: number
}

const TableActionMenu: React.FC<TableActionMenuProps> = ({
  items,
  onEdit,
  onDelete,
  onView,
  editLabel,
  deleteLabel,
  viewLabel,
  align = 'right',
  className = '',
  triggerSize = 16,
}) => {
  const { t } = useTranslation(['common', 'buttons', 'inventory'])
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState<{ top?: number; bottom?: number; left?: number; right?: number }>({})

  const getViewText = () => {
    if (viewLabel) return viewLabel
    const val = t('view', '')
    if (val && val !== 'view' && val !== 'common.view') return val
    const valCommon = t('common.view', '')
    if (valCommon && valCommon !== 'common.view' && valCommon !== 'view') return valCommon
    return 'View'
  }

  const getEditText = () => {
    if (editLabel) return editLabel
    const val = t('edit', '')
    if (val && val !== 'edit' && val !== 'common.edit') return val
    const valCommon = t('common.edit', '')
    if (valCommon && valCommon !== 'common.edit' && valCommon !== 'edit') return valCommon
    return 'Edit'
  }

  const getDeleteText = () => {
    if (deleteLabel) return deleteLabel
    const val = t('delete', '')
    if (val && val !== 'delete' && val !== 'common.delete') return val
    const valCommon = t('common.delete', '')
    if (valCommon && valCommon !== 'common.delete' && valCommon !== 'delete') return valCommon
    return 'Delete'
  }

  const resolvedEditLabel = getEditText()
  const resolvedDeleteLabel = getDeleteText()
  const resolvedViewLabel = getViewText()

  const updatePosition = () => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const openUpward = spaceBelow < 180 && rect.top > spaceBelow

    if (openUpward) {
      setCoords({
        bottom: window.innerHeight - rect.top + 4,
        right: align === 'right' ? window.innerWidth - rect.right : undefined,
        left: align === 'left' ? rect.left : undefined,
      })
    } else {
      setCoords({
        top: rect.bottom + 4,
        right: align === 'right' ? window.innerWidth - rect.right : undefined,
        left: align === 'left' ? rect.left : undefined,
      })
    }
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isOpen) {
      updatePosition()
    }
    setIsOpen(prev => !prev)
  }

  useEffect(() => {
    if (!isOpen) return

    const handleScrollOrResize = () => {
      setIsOpen(false)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [isOpen])

  // Build items array if custom list not passed directly or merge quick props
  const finalItems: TableActionItem[] = [...(items || [])]

  if (onView && !finalItems.some(i => i.label === resolvedViewLabel)) {
    finalItems.unshift({
      label: resolvedViewLabel,
      icon: Eye,
      onClick: onView,
      variant: 'default',
    })
  }

  if (onEdit && !finalItems.some(i => i.label === resolvedEditLabel)) {
    const viewIdx = finalItems.findIndex(i => i.label === resolvedViewLabel)
    const insertIdx = viewIdx >= 0 ? viewIdx + 1 : 0
    finalItems.splice(insertIdx, 0, {
      label: resolvedEditLabel,
      icon: Edit2,
      onClick: onEdit,
      variant: 'default',
    })
  }

  if (onDelete && !finalItems.some(i => i.label === resolvedDeleteLabel)) {
    finalItems.push({
      label: resolvedDeleteLabel,
      icon: Trash2,
      onClick: onDelete,
      variant: 'danger',
    })
  }

  const visibleItems = finalItems.filter(item => !item.hidden)

  if (visibleItems.length === 0) return null

  return (
    <div className={`inline-block text-left ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="p-1.5 rounded-xl hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Actions menu"
      >
        <MoreVertical size={triggerSize} />
      </button>

      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: coords.top !== undefined ? `${coords.top}px` : 'auto',
              bottom: coords.bottom !== undefined ? `${coords.bottom}px` : 'auto',
              left: coords.left !== undefined ? `${coords.left}px` : 'auto',
              right: coords.right !== undefined ? `${coords.right}px` : 'auto',
              zIndex: 99999,
            }}
            className="min-w-[130px] w-max max-w-[200px] bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl shadow-2xl p-1.5 space-y-0.5"
          >
            {visibleItems.map((item, idx) => {
              const Icon = item.icon
              const isDanger = item.variant === 'danger'
              const isWarning = item.variant === 'warning'
              const isSuccess = item.variant === 'success'

              let colorClasses = 'text-foreground hover:bg-muted/70'
              if (isDanger) colorClasses = 'text-rose-600 dark:text-rose-400 hover:bg-rose-500/10'
              else if (isWarning) colorClasses = 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
              else if (isSuccess) colorClasses = 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={item.disabled}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(false)
                    item.onClick()
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left disabled:opacity-40 disabled:cursor-not-allowed ${colorClasses}`}
                >
                  {Icon && <Icon size={14} className="shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </button>
              )
            })}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

export default TableActionMenu
