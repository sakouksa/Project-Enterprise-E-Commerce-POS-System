import React from 'react'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'

interface TaxesTabProps {
  taxes: any[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  openEditDrawer: (row: any) => void
  handleDelete: (id: number) => void
}

export const TaxesTab: React.FC<TaxesTabProps> = ({
  taxes = [],
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
                {visibleColumns.tax_name && <th>Tax Rule Name</th>}
                {visibleColumns.tax_rate && <th>Tax Rate</th>}
                {visibleColumns.tax_type && <th>Type</th>}
                {visibleColumns.tax_status && <th>Status</th>}
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={5} />
              ) : taxes.length === 0 ? (
                <EmptyState cols={5} message="No tax rules configured." />
              ) : (
                taxes.map((row: any) => (
                  <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                    {visibleColumns.tax_name && (
                      <td className="font-semibold text-foreground">{row.name}</td>
                    )}
                    {visibleColumns.tax_rate && (
                      <td className="font-bold text-foreground font-mono">
                        {row.rate}%
                      </td>
                    )}
                    {visibleColumns.tax_type && (
                      <td className="capitalize text-xs font-medium text-muted-foreground">{row.type || 'Percentage'}</td>
                    )}
                    {visibleColumns.tax_status && (
                      <td>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          row.is_active ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        }`}>
                          {row.is_active ? 'Active' : 'Inactive'}
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

export default TaxesTab
