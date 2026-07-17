import React from 'react'
import { Inbox } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface EmptyStateProps {
  message?: string
  cols?: number
  icon?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  cols = 1,
  icon = <Inbox size={40} className="mx-auto mb-3 text-muted-foreground/30" />,
}) => {
  const { t } = useTranslation()
  const displayMessage = message ? t(message, { defaultValue: message }) : t('common.noData')

  return (
    <tr>
      <td colSpan={cols} className="py-16 text-center">
        {icon}
        <p className="text-muted-foreground text-sm font-medium">{displayMessage}</p>
      </td>
    </tr>
  )
}

export default EmptyState
