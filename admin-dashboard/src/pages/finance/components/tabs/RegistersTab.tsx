import React from 'react'
import { useTranslation } from 'react-i18next'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'
import StatusBadge from '@/components/common/StatusBadge'
import { formatCurrency } from '@/utils/formatters'

interface RegistersTabProps {
  registers: any[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  openEditDrawer: (row: any) => void
  handleDelete: (id: number, name?: string) => void
}

export const RegistersTab: React.FC<RegistersTabProps> = ({
  registers = [],
  isLoading,
  isFetching,
  visibleColumns,
  openEditDrawer,
  handleDelete,
}) => {
  const { t, i18n } = useTranslation(['finance', 'common'])
  const currentLocale = i18n.language === 'km' ? 'km-KH' : i18n.language

  return (
    <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden print:hidden">
      <TableWrapper isFetching={isFetching}>
        <div className="overflow-x-auto">
          <table className="w-full data-table border-collapse">
            <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
              <tr>
                {visibleColumns.register_title && <th>{t('finance.register_title', 'Register Title')}</th>}
                {visibleColumns.register_balance && <th>{t('finance.current_balance', 'Current Balance')}</th>}
                {visibleColumns.register_status && <th>{t('finance.status_col', 'Status')}</th>}
                <th className="text-right">{t('finance.actions_col', t('common.actions', 'Actions'))}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={4} />
              ) : registers.length === 0 ? (
                <EmptyState cols={4} message={t('finance.no_data_registers', 'No cash registers found.')} />
              ) : (
                registers.map((row: any) => (
                  <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                    {visibleColumns.register_title && (
                      <td className="font-semibold text-foreground">{row.title || row.name || `Register #${row.id}`}</td>
                    )}
                    {visibleColumns.register_balance && (
                      <td className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {formatCurrency(row.closing_balance ?? row.opening_balance ?? row.balance ?? 0, { locale: currentLocale })}
                      </td>
                    )}
                    {visibleColumns.register_status && (
                      <td>
                        <StatusBadge status={row.status || 'closed'} />
                      </td>
                    )}
                    <td className="text-right">
                      <TableActionMenu
                        onEdit={() => openEditDrawer(row)}
                        onDelete={() => handleDelete(row.id, row.title || row.name)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </TableWrapper>
    </div>
  )
}

export default RegistersTab
