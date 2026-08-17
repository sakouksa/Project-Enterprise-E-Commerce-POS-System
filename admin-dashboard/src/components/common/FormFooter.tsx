import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, Loader2, ArrowLeft, Command } from 'lucide-react'

export interface FormFooterProps {
  /** Path for Cancel/Back button */
  cancelPath?: string
  /** Label for Cancel button. Defaults to t('common.cancel', 'បោះបង់') */
  cancelLabel?: string
  /** Custom handler for Cancel button */
  onCancel?: () => void
  /** Whether to display the cancel button (default: true) */
  showCancel?: boolean
  /** Is the form in edit mode? (optional) */
  isEdit?: boolean
  /** Is the form currently submitting / saving? */
  isSubmitting?: boolean
  /** Whether the submit button is disabled */
  disabled?: boolean
  /** Handler for submit button */
  onSubmit?: (e: React.FormEvent) => void
  /** Label for submit button */
  submitLabel?: string
  /** Custom icon for submit button */
  submitIcon?: React.ReactNode
  /** Whether to display the submit button (default: true) */
  showSubmit?: boolean
  /** Left-hand info summary or contextual indicator */
  infoSummary?: React.ReactNode
  /** Show keyboard shortcut badge (Cmd+S / Ctrl+S) on save button or summary */
  showShortcutHint?: boolean
  /** Extra custom action buttons (e.g. Reset, Delete, Draft save) */
  extraActions?: React.ReactNode
  /** Sticky to bottom of screen (defaults to false for natural in-flow scrolling) */
  sticky?: boolean
  /** Custom children rendered inside footer */
  children?: React.ReactNode
  /** Custom CSS classes */
  className?: string
}

export const FormFooter: React.FC<FormFooterProps> = ({
  cancelPath,
  cancelLabel,
  onCancel,
  showCancel = true,
  isEdit = false,
  isSubmitting = false,
  disabled = false,
  onSubmit,
  submitLabel,
  submitIcon,
  showSubmit = true,
  infoSummary,
  showShortcutHint = true,
  extraActions,
  sticky = false,
  children,
  className = '',
}) => {
  const { t } = useTranslation(['common'])
  const navigate = useNavigate()

  // Handle Cmd+S / Ctrl+S keyboard shortcut to save
  useEffect(() => {
    if (!onSubmit) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (!isSubmitting && !disabled) {
          onSubmit(e as any)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSubmit, isSubmitting, disabled])

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else if (cancelPath) {
      navigate(cancelPath)
    } else {
      navigate(-1)
    }
  }

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

  return (
    <div
      className={`${
        sticky
          ? 'fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-md border-t border-border py-3 px-4 sm:px-6 shadow-lg'
          : 'bg-card/90 dark:bg-card/80 border border-border/80 p-4 sm:p-5 rounded-2xl shadow-xs backdrop-blur-xl'
      } ${className}`}
    >
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        {/* Left: Summary Context & Helpful Hints */}
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground min-w-0 flex-1">
          {infoSummary ? (
            <div className="truncate max-w-md">{infoSummary}</div>
          ) : (
            showShortcutHint && onSubmit && (
              <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
                <span>{t('common.quickSaveHint', 'ចុច')}</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted border border-border/70 rounded-md font-semibold text-foreground/80 flex items-center gap-0.5">
                  {isMac ? <Command size={10} /> : 'Ctrl +'} S
                </kbd>
                <span>{t('common.toSave', 'ដើម្បីរក្សាទុក')}</span>
              </div>
            )
          )}
        </div>

        {/* Custom children slot if provided */}
        {children && <div className="flex items-center gap-2">{children}</div>}

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto ml-auto flex-wrap shrink-0">
          {extraActions}

          {/* Cancel Button */}
          {showCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="h-9 px-4 text-xs sm:text-[13px] font-semibold border border-border/80 bg-background/60 hover:bg-muted/80 rounded-lg text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1.5"
            >
              <ArrowLeft size={13} className="opacity-70" />
              <span>{cancelLabel || t('common.cancel', 'បោះបង់')}</span>
            </button>
          )}

          {/* Submit Button */}
          {showSubmit && (
            <button
              type={onSubmit ? 'button' : 'submit'}
              onClick={onSubmit}
              disabled={isSubmitting || disabled}
              className="h-9 px-5 text-xs sm:text-[13px] bg-primary text-primary-foreground rounded-lg font-bold shadow-xs hover:bg-primary/90 hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
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

export default FormFooter
