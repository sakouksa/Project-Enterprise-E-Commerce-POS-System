import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb'

export type FormHeaderIconVariant = 'primary' | 'purple' | 'blue' | 'emerald' | 'amber' | 'rose' | 'neutral'

export interface FormHeaderProps {
  /** Title of the form (e.g. "បន្ថែមអតិថិជនថ្មី", "កែសម្រួលអ្នកផ្គត់ផ្គង់") */
  title: React.ReactNode
  /** Subtitle or explanatory description */
  subtitle?: React.ReactNode
  /** Whether the form is in edit mode */
  isEdit?: boolean
  /** Leading Icon (optional) */
  icon?: React.ReactNode
  /** Color theme variant for icon container (legacy support) */
  iconBg?: string
  /** Optional Breadcrumb navigation items */
  breadcrumbs?: BreadcrumbItem[]
  /** Optional Status Badge on right of title */
  statusBadge?: React.ReactNode
  /** Path for Back button. If not provided, calls onBack or navigate(-1) */
  backPath?: string
  /** Label for Back button. Defaults to t('common.back', 'Back') */
  backLabel?: string
  /** Whether to show the back button (defaults to true) */
  showBack?: boolean
  /** Custom handler for back button */
  onBack?: () => void
  /** Is the form currently submitting / saving? (legacy) */
  isSubmitting?: boolean
  /** Handler for submit button (deprecated: global forms place submit in footer only) */
  onSubmit?: (e: React.FormEvent) => void
  /** Custom label for submit button (deprecated) */
  submitLabel?: string
  /** Whether to render submit button directly inside header (strictly disabled: global forms use footer only) */
  showSubmit?: boolean
  /** Custom icon for submit button (deprecated) */
  submitIcon?: React.ReactNode
  /** Additional action buttons rendered beside Back button */
  extraActions?: React.ReactNode
  /** Additional classes for container */
  className?: string
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  subtitle,
  icon,
  iconBg = 'bg-primary/10 text-primary border-primary/20',
  breadcrumbs,
  statusBadge,
  backPath,
  backLabel,
  showBack = true,
  onBack,
  isSubmitting: _isSubmitting = false,
  onSubmit: _onSubmit,
  submitLabel: _submitLabel,
  showSubmit: _showSubmit,
  isEdit: _isEdit = false,
  submitIcon: _submitIcon,
  extraActions,
  className = '',
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation(['common'])

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backPath) {
      navigate(backPath)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className={`p-4 sm:p-5 md:p-6 bg-card border-b border-border/80 dark:border-slate-800 space-y-3.5 transition-all shadow-2xs ${className}`}>
      {/* Top: Breadcrumb Bar */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} className="text-xs" />
      )}

      {/* Main Header Content: Title, Subtitle, and Right Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Icon + Title + Status Badge */}
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center border shadow-xs shrink-0 ${iconBg}`}>
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base sm:text-lg md:text-xl font-black text-foreground tracking-tight truncate">
                {title}
              </h1>
              {statusBadge}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 font-medium line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Modern Action Controls Group */}
        <div className="flex items-center gap-2 self-start md:self-center flex-wrap shrink-0">
          {/* Back Button */}
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              className="h-9 min-h-[36px] px-3.5 sm:px-4 rounded-xl border border-border/80 dark:border-slate-700 bg-card dark:bg-slate-900/90 text-muted-foreground dark:text-slate-300 hover:text-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-slate-800 text-xs sm:text-[13px] font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft size={14} />
              <span>{backLabel || t('common.back', 'Back')}</span>
            </button>
          )}

          {/* Extra Custom Action Buttons (e.g. Live Preview) */}
          {extraActions}
        </div>
      </div>
    </div>
  )
}

export default FormHeader
