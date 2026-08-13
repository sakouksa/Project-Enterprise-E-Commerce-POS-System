import React from 'react'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'

interface RegistersTabProps {
  registers: any[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  openEditDrawer: (row: any) => void
  handleDelete: (id: number) => void
}

export const RegistersTab: React.FC<RegistersTabProps> = ({
  registers = [],
  isLoading,
  isFetching,
  visibleColumns,
  openEditDrawer,
  handleDelete,
}) => {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden print:hidden">
      <TableWrapper isFetching={isFetching}>
        <div className="overflow-x-auto">
          <table className="w-full data-table border-collapse">
            <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
              <tr>
                {visibleColumns.register_title && <th>Register Title</th>}
                {visibleColumns.register_balance && <th>Current Balance</th>}
                {visibleColumns.register_status && <th>Till Status</th>}
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={4} />
              ) : registers.length === 0 ? (
                <EmptyState cols={4} message="No cash registers found." />
              ) : (
                registers.map((row: any) => (
                  <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                    {visibleColumns.register_title && (
                      <td className="font-semibold text-foreground">{row.title || row.name || `Register #${row.id}`}</td>
                    )}
                    {visibleColumns.register_balance && (
                      <td className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        ${Number(row.closing_balance ?? row.opening_balance ?? row.balance ?? 0).toFixed(2)}
                      </td>
                    )}
                    {visibleColumns.register_status && (
                      <td>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                          row.status === 'open' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-600 border border-slate-500/20'
                        }`}>
                          {row.status || 'closed'}
                        </span>
                      </td>
                    )}
                    <td className="text-right">
                      <TableActionMenu
                        onEdit={() => openEditDrawer(row)}
                        onDelete={() => handleDelete(row.id)}
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
