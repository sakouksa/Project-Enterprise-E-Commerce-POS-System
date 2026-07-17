import React from 'react'
import { FilterX } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ResetButtonProps {
  onClick: () => void
  label?: string
}

export const ResetButton: React.FC<ResetButtonProps> = ({ onClick, label }) => {
  const { t } = useTranslation()
  const displayLabel = label ? t(label, { defaultValue: label }) : t('common.reset')

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
      type="button"
    >
      <FilterX className="w-4 h-4" />
      {displayLabel}
    </button>
  )
}

export default ResetButton
