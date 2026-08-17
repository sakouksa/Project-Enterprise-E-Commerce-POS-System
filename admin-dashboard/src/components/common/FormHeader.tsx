import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Check, Loader2 } from 'lucide-react'
import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb'

export type FormHeaderIconVariant = 'primary' | 'purple' | 'blue' | 'emerald' | 'amber' | 'rose' | 'neutral'

export interface FormHeaderProps {
  /** Title of the form (e.g. "បន្ថែមអតិថិជនថ្មី", "កែសម្រួលអ្នកផ្គត់ផ្គង់") */
  title: React.ReactNode
  /** Subtitle or explanatory description */
  subtitle?: React.ReactNode
  /** Whether the form is in edit mode (defaults showSubmit to true for edit, false for create) */
  isEdit?: boolean
  /** Leading Icon (optional) */
  icon?: React.ReactNode
  /** Color theme variant for icon container (legacy support) */
  iconVariant?: FormHeaderIconVariant
  /** Optional Breadcrumb navigation items */
  breadcrumbs?: BreadcrumbItem[]
  /** Optional Status Badge on right of title */
  statusBadge?: React.ReactNode
  /** Path for Back button (e.g. "/customers", "/suppliers", "/products"). If not provided, calls onBack or navigate(-1) */
  backPath?: string
  /** Label for Back button. Defaults to t('common.back', 'ត្រឡប់ក្រោយ') */
  backLabel?: string
  /** Whether to show the back button (defaults to true) */
  showBack?: boolean
  /** Custom handler for back button */
  onBack?: () => void
  /** Is the form currently submitting / saving? */
  isSubmitting?: boolean
  /** Handler for submit button if header contains submit trigger */
  onSubmit?: (e: React.FormEvent) => void
  /** Label for submit button */
  submitLabel?: string
  /** Custom icon for submit button (defaults to Check) */
  submitIcon?: React.ReactNode
  /** Whether to show the submit button in the header (defaults to true on isEdit, false on create) */
  showSubmit?: boolean
  /** Extra custom action buttons (e.g. Live Preview, Reset, Price History, Audit Logs) */
  extraActions?: React.ReactNode
  /** Make header sticky at top (optional) */
  sticky?: boolean
  /** Custom children element rendered in the header */
  children?: React.ReactNode
  /** Custom CSS classes for the outer wrapper */
  className?: string
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  subtitle,
  isEdit,
  breadcrumbs,
  statusBadge,
  backPath,
  backLabel,
  showBack = true,
  onBack,
  isSubmitting = false,
  onSubmit,
  submitLabel,
  submitIcon,
  showSubmit,
  extraActions,
  children,
  className = '',
}) => {
  const { t } = useTranslation(['common'])
  const navigate = useNavigate()

  // Enterprise pattern: Show submit in header on Edit mode (for quick save), hide on Create mode (clean header)
  const shouldShowSubmit = showSubmit !== undefined ? showSubmit : (isEdit ?? false)

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
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      {/* ─── Breadcrumb ─── */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="px-0.5">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      {/* ─── Modern Form Title & Action Bar (Clean & Distinct from List Page Header) ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-0.5">
        {/* Left: Clean Title, Status Badge & Subtitle */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground truncate">
              {title}
            </h1>
            {statusBadge && <div className="shrink-0">{statusBadge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Custom children slot between left and right if provided */}
        {children && <div className="flex items-center gap-2 min-w-0">{children}</div>}

        {/* Right: Modern Action Controls Group */}
        <div className="flex items-center gap-2 self-start md:self-center flex-wrap shrink-0">
          {/* Back Button */}
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              className="h-9 px-3.5 sm:px-4 rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted text-xs sm:text-[13px] font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft size={14} />
              <span>{backLabel || t('common.back', 'ត្រឡប់ក្រោយ')}</span>
            </button>
          )}

          {/* Extra Custom Action Buttons (e.g. Live Preview) */}
          {extraActions}

          {/* Submit Button (Shown on Edit mode for quick save or when explicitly requested) */}
          {shouldShowSubmit && (
            <button
              type={onSubmit ? 'button' : 'submit'}
              onClick={onSubmit}
              disabled={isSubmitting}
              className="h-9 px-4 sm:px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-[13px] font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                submitIcon || <Check size={14} strokeWidth={2.5} />
              )}
              <span>{submitLabel || (isEdit ? t('common.saveChanges', 'រក្សាទុកការផ្លាស់ប្តូរ') : t('common.save', 'រក្សាទុក'))}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormHeader
