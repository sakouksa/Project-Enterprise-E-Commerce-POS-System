import React from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Download, Upload, QrCode, Check, Loader2, X, RefreshCw, Filter } from 'lucide-react'

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
    className={`h-10 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-[13px] font-bold shadow-xs hover:shadow active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {loading ? <Loader2 size={15} className="animate-spin" /> : icon || <Plus size={15} strokeWidth={2.5} />}
    <span>{label}</span>
  </button>
)

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
  const displayLabel = label || t('common.exportCsv', 'នាំចេញ CSV')
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
 * Standard Import CSV Button (e.g. "នាំចូល CSV")
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
  const displayLabel = label || t('common.importCsv', 'នាំចូល CSV')
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
 * Standard QR Kiosk Button (e.g. "បើក QR Kiosk")
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
  const displayLabel = label || t('employees.launch_qr_kiosk', 'បើក QR Kiosk')
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
 * Standard Save / Update Form Action Button (e.g. "រក្សាទុក", "រក្សាទុកការផ្លាស់ប្តូរ")
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
  const displayLabel = label || (isEdit ? t('common.saveChanges', 'រក្សាទុកការផ្លាស់ប្តូរ') : t('common.save', 'រក្សាទុក'))
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
 * Standard Cancel Form Action Button (e.g. "បោះបង់")
 */
export interface CancelButtonProps {
  onClick?: (e?: React.MouseEvent) => void
  label?: string
  disabled?: boolean
  className?: string
}

export const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  label,
  disabled = false,
  className = '',
}) => {
  const { t } = useTranslation(['common'])
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-10 inline-flex items-center justify-center px-4 rounded-xl border border-border/80 dark:border-slate-700 bg-card dark:bg-slate-800 text-xs sm:text-[13px] font-semibold text-muted-foreground dark:text-slate-300 hover:text-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-slate-700 transition-colors cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {label || t('common.cancel', 'បោះបង់')}
    </button>
  )
}

/**
 * Standard Filter Button (e.g. "ចម្រោះ", "Filter")
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
  const displayLabel = label || t('common.filter', 'ចម្រោះ')
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
 * Standard Refresh Action Button (e.g. "ផ្ទុកឡើងវិញ")
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
      title={title || t('common.refresh', 'ផ្ទុកឡើងវិញ')}
      className={`h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-muted/80 transition-all duration-200 shadow-xs hover:shadow active:scale-[0.98] cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
    </button>
  )
}

export default {
  HeaderActionsGroup,
  AddButton,
  ExportButton,
  ImportButton,
  QrKioskButton,
  SaveButton,
  CancelButton,
  FilterButton,
  RefreshButton,
}

