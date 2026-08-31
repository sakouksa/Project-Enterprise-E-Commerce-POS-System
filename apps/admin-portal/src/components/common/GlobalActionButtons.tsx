import React from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Download, Upload, QrCode, Check, Loader2, X, RefreshCw, Filter, RotateCcw } from 'lucide-react'

/**
 * Standard Header Action Button Group container.
 * Keeps spacing, wrapping, and heights completely consistent across all enterprise pages.
 */
export interface HeaderActionsGroupProps {
  children: React.ReactNode
  className?: string
}

export const HeaderActionsGroup: React.FC<HeaderActionsGroupProps> = ({ children, className = '' }) => (
  <div className={`flex items-center flex-wrap gap-2.5 shrink-0 ${className}`}>
    {children}
  </div>
)

/**
 * Standard Primary Action Button (e.g. "+ បន្ថែម...", "+ Add ...", "+ Create ...")
 */
export interface AddButtonProps {
  onClick?: (e?: React.MouseEvent) => void
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  className?: string
  title?: string
  type?: 'button' | 'submit'
}

export const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  label,
  icon,
  disabled = false,
  loading = false,
  className = '',
  title,
  type = 'button',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    title={title || label}
    className={`h-10 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs sm:text-[13px] font-bold shadow-xs hover:shadow active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {loading ? <Loader2 size={15} className="animate-spin" /> : icon || <Plus size={15} strokeWidth={2.5} />}
    <span>{label}</span>
  </button>
)

/**
 * Standard Secondary / Action Button (e.g. outline button, audit, transfer, custom actions)
 */
export interface ActionButtonProps {
  onClick?: (e?: React.MouseEvent) => void
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  className?: string
  title?: string
  variant?: 'outline' | 'secondary' | 'soft' | 'primary' | 'emerald' | 'danger'
  type?: 'button' | 'submit'
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  label,
  icon,
  disabled = false,
  loading = false,
  className = '',
  title,
  variant = 'outline',
  type = 'button',
}) => {
  const variantStyles: Record<string, string> = {
    outline: 'border border-border/80 dark:border-slate-700 bg-card dark:bg-slate-800/80 hover:bg-muted/80 dark:hover:bg-slate-700 text-foreground dark:text-slate-200 shadow-2xs hover:shadow-xs',
    secondary: 'bg-muted/70 hover:bg-muted dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground border border-border/60 dark:border-slate-700 shadow-2xs',
    soft: 'bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 shadow-2xs',
    primary: 'bg-primary hover:bg-primary/90 text-white shadow-xs hover:shadow border border-primary',
    emerald: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs hover:shadow border border-emerald-600',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs hover:shadow border border-rose-600',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title || label}
      className={`h-10 inline-flex items-center justify-center gap-2 px-4 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant] || variantStyles.outline} ${className}`}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : icon}
      <span>{label}</span>
    </button>
  )
}

export const SecondaryButton = ActionButton

/**
 * Standard Export CSV / Excel Button (e.g. "នាំចេញ CSV")
 */
export interface ExportButtonProps {
  onClick?: (e?: React.MouseEvent) => void
  label?: string
  icon?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  className?: string
  title?: string
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onClick,
  label,
  icon,
  disabled = false,
  loading = false,
  className = '',
  title,
}) => {
  const { t } = useTranslation(['common'])
  const displayLabel = label || t('common.exportCsv', 'Export CSV')
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      title={title || displayLabel}
      className={`h-10 inline-flex items-center justify-center gap-2 px-3.5 rounded-xl border border-border/80 dark:border-slate-700 bg-card dark:bg-slate-800/80 hover:bg-muted/80 dark:hover:bg-slate-700 text-foreground dark:text-slate-200 text-xs sm:text-[13px] font-semibold shadow-2xs hover:shadow-xs active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : icon || <Download size={15} />}
      <span>{displayLabel}</span>
    </button>
  )
}

/**
 * Standard Import CSV Button (e.g. "Import CSV")
 */
export interface ImportButtonProps {
  onClick?: (e?: React.MouseEvent) => void
  label?: string
  icon?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  className?: string
  title?: string
}

export const ImportButton: React.FC<ImportButtonProps> = ({
  onClick,
  label,
  icon,
  disabled = false,
  loading = false,
  className = '',
  title,
}) => {
  const { t } = useTranslation(['common'])
  const displayLabel = label || t('common.importCsv', 'Import CSV')
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      title={title || displayLabel}
      className={`h-10 inline-flex items-center justify-center gap-2 px-3.5 rounded-xl border border-border/80 dark:border-slate-700 bg-card dark:bg-slate-800/80 hover:bg-muted/80 dark:hover:bg-slate-700 text-foreground dark:text-slate-200 text-xs sm:text-[13px] font-semibold shadow-2xs hover:shadow-xs active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : icon || <Upload size={15} />}
      <span>{displayLabel}</span>
    </button>
  )
}

/**
 * Standard QR Kiosk Button (e.g. "Launch QR Kiosk")
 */
export interface QrKioskButtonProps {
  onClick?: (e?: React.MouseEvent) => void
  label?: string
  icon?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  className?: string
  title?: string
}

export const QrKioskButton: React.FC<QrKioskButtonProps> = ({
  onClick,
  label,
  icon,
  disabled = false,
  loading = false,
  className = '',
  title,
}) => {
  const { t } = useTranslation(['employees', 'common'])
  const displayLabel = label || t('employees.launch_qr_kiosk', 'Launch QR Kiosk')
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      title={title || displayLabel}
      className={`h-10 inline-flex items-center justify-center gap-2 px-3.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 text-xs sm:text-[13px] font-semibold shadow-2xs hover:shadow-xs active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : icon || <QrCode size={15} />}
      <span>{displayLabel}</span>
    </button>
  )
}

/**
 * Standard Save / Update Form Action Button (e.g. "Save", "Save Changes")
 */
export interface SaveButtonProps {
  onClick?: (e?: React.MouseEvent) => void
  type?: 'submit' | 'button'
  label?: string
  isEdit?: boolean
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  className?: string
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  type = 'submit',
  label,
  isEdit = false,
  loading = false,
  disabled = false,
  icon,
  className = '',
}) => {
  const { t } = useTranslation(['common'])
  const displayLabel = label || (isEdit ? t('common.saveChanges', 'Save Changes') : t('common.save', 'Save'))
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`h-10 inline-flex items-center justify-center gap-2 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs sm:text-[13px] font-bold shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer active:scale-95 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon || <Check size={14} strokeWidth={2.5} />}
      <span>{displayLabel}</span>
    </button>
  )
}

/**
 * Standard Cancel Form Action Button (e.g. "Cancel")
 */
export interface CancelButtonProps {
  onClick?: (e?: React.MouseEvent) => void
  label?: string
  icon?: React.ReactNode
  disabled?: boolean
  className?: string
}

export const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  label,
  icon,
  disabled = false,
  className = '',
}) => {
  const { t } = useTranslation(['common'])
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-10 inline-flex items-center justify-center gap-1.5 px-4 rounded-xl border border-border/80 dark:border-slate-700 bg-muted/60 hover:bg-muted dark:bg-slate-800 dark:hover:bg-slate-700 text-xs sm:text-[13px] font-bold text-muted-foreground dark:text-slate-300 hover:text-foreground dark:hover:text-white transition-colors cursor-pointer active:scale-95 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {icon}
      <span>{label || t('common.cancel', 'Cancel')}</span>
    </button>
  )
}

/**
 * Standard Filter Button (e.g. "Filter")
 */
export interface FilterButtonProps {
  onClick: (e?: React.MouseEvent) => void
  isActive?: boolean
  activeCount?: number
  label?: string
  disabled?: boolean
  className?: string
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  isActive = false,
  activeCount,
  label,
  disabled = false,
  className = '',
}) => {
  const { t } = useTranslation(['common'])
  const displayLabel = label || t('common.filter', 'Filter')
  const hasActive = isActive || (activeCount !== undefined && activeCount > 0)

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 h-10 px-3.5 text-xs sm:text-[13px] font-semibold rounded-xl border transition-all duration-200 shadow-xs hover:shadow active:scale-[0.98] cursor-pointer select-none shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
        hasActive
          ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/15'
          : 'border-border bg-card hover:bg-muted/80 text-foreground'
      } ${className}`}
    >
      <Filter size={15} className={hasActive ? 'text-primary' : 'text-muted-foreground'} />
      <span>{displayLabel}</span>
      {hasActive && (
        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
      )}
    </button>
  )
}

/**
 * Standard Refresh Action Button (e.g. "Refresh")
 */
export interface RefreshButtonProps {
  onClick: (e?: React.MouseEvent) => void
  loading?: boolean
  disabled?: boolean
  title?: string
  className?: string
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  title,
  className = '',
}) => {
  const { t } = useTranslation(['common'])
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      title={title || t('common.refresh', 'Refresh')}
      className={`h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-muted/80 transition-all duration-200 shadow-xs hover:shadow active:scale-[0.98] cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
    </button>
  )
}

/**
 * Standard Reset Action Button (e.g. "Reset", "កំណត់ឡើងវិញ")
 */
export interface ResetButtonProps {
  onClick?: (e?: React.MouseEvent) => void
  label?: string
  iconOnly?: boolean
  disabled?: boolean
  className?: string
  title?: string
  size?: 'sm' | 'md' | 'lg'
}

export const ResetButton: React.FC<ResetButtonProps> = ({
  onClick,
  label,
  iconOnly = false,
  disabled = false,
  className = '',
  title,
  size = 'md',
}) => {
  const { t } = useTranslation(['common', 'buttons'])
  const displayLabel = label
    ? label.includes('.')
      ? t(label, { defaultValue: label })
      : label
    : t('common.reset', 'Reset')

  const heightClass =
    size === 'sm'
      ? 'h-8 min-h-[32px] text-xs'
      : size === 'lg'
      ? 'h-12 min-h-[48px] text-sm'
      : 'h-10 min-h-[40px] text-xs sm:text-[13px]'

  const paddingClass = iconOnly
    ? size === 'sm'
      ? 'w-8 min-w-[32px] px-0'
      : size === 'lg'
      ? 'w-12 min-w-[48px] px-0'
      : 'w-10 min-w-[40px] px-0'
    : 'px-3.5'

  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 15

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title || displayLabel}
      aria-label={displayLabel}
      className={`group inline-flex items-center justify-center gap-1.5 ${heightClass} ${paddingClass} font-semibold text-foreground border border-border bg-card hover:bg-muted/80 rounded-xl transition-all duration-200 shadow-xs hover:shadow active:scale-[0.98] cursor-pointer select-none shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <RotateCcw
        size={iconSize}
        className="text-muted-foreground group-hover:text-foreground group-hover:-rotate-90 transition-transform duration-300 ease-out shrink-0"
      />
      {!iconOnly && <span>{displayLabel}</span>}
    </button>
  )
}

export default {
  HeaderActionsGroup,
  AddButton,
  ActionButton,
  SecondaryButton,
  ExportButton,
  ImportButton,
  QrKioskButton,
  SaveButton,
  CancelButton,
  FilterButton,
  RefreshButton,
  ResetButton,
}

