import React from 'react'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'

interface ExpensesTabProps {
  expenses: any[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  openEditDrawer: (row: any) => void
  handleDelete: (id: number) => void
  renderSortIcon: (field: string) => React.ReactNode
  handleSort: (field: string) => void
}

export const ExpensesTab: React.FC<ExpensesTabProps> = ({
  expenses = [],
  isLoading,
  isFetching,
  visibleColumns,
  openEditDrawer,
  handleDelete,
  renderSortIcon,
  handleSort,
}) => {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden print:hidden">
      <TableWrapper isFetching={isFetching}>
        <div className="overflow-x-auto">
          <table className="w-full data-table border-collapse">
            <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
              <tr>
                {visibleColumns.expense_title && <th className="cursor-pointer select-none" onClick={() => handleSort('title')}>Title {renderSortIcon('title')}</th>}
                {visibleColumns.expense_category && <th>Category</th>}
                {visibleColumns.expense_amount && <th className="cursor-pointer select-none" onClick={() => handleSort('amount')}>Amount {renderSortIcon('amount')}</th>}
                {visibleColumns.expense_date && <th className="cursor-pointer select-none" onClick={() => handleSort('date')}>Date {renderSortIcon('date')}</th>}
                {visibleColumns.expense_description && <th>Description</th>}
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={6} />
              ) : expenses.length === 0 ? (
                <EmptyState cols={6} message="No expense records found." />
              ) : (
                expenses.map((row: any) => (
                  <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                    {visibleColumns.expense_title && (
                      <td className="font-semibold text-foreground">{row.title || `Expense #${row.id}`}</td>
                    )}
                    {visibleColumns.expense_category && (
                      <td>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                          {row.category?.name || 'General'}
                        </span>
                      </td>
                    )}
                    {visibleColumns.expense_amount && (
                      <td className="font-bold text-rose-500">${Number(row.amount || 0).toFixed(2)}</td>
                    )}
                    {visibleColumns.expense_date && (
                      <td className="text-xs font-mono">{row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}</td>
                    )}
                    {visibleColumns.expense_description && (
                      <td className="text-xs text-muted-foreground truncate max-w-xs">{row.description || '-'}</td>
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

export default ExpensesTab
