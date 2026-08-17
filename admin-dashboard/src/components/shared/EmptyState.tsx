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
  cols = 50,
  icon = <Inbox size={44} className="mx-auto mb-3 text-muted-foreground/30" />,
}) => {
  const { t } = useTranslation(['common', 'empty'])
  const displayMessage = message ?? t('common.noData', 'No data available')

  return (
    <tr>
      <td colSpan={cols} className="py-16 text-center w-full">
        <div className="flex flex-col items-center justify-center mx-auto text-center max-w-md">
          {icon}
          <p className="text-muted-foreground text-sm font-medium">{displayMessage}</p>
        </div>
      </td>
    </tr>
  )
}

export default EmptyState
