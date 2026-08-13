import React from 'react'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'

interface CurrenciesTabProps {
  currencies: any[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  openEditDrawer: (row: any) => void
  handleDelete: (id: number) => void
}

export const CurrenciesTab: React.FC<CurrenciesTabProps> = ({
  currencies = [],
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
                {visibleColumns.currency_name && <th>Currency Name</th>}
                {visibleColumns.currency_code && <th>ISO Code</th>}
                {visibleColumns.currency_symbol && <th>Symbol</th>}
                {visibleColumns.currency_rate && <th>Exchange Rate</th>}
                {visibleColumns.currency_status && <th>Status</th>}
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={6} />
              ) : currencies.length === 0 ? (
                <EmptyState cols={6} message="No currencies configured." />
              ) : (
                currencies.map((row: any) => (
                  <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                    {visibleColumns.currency_name && (
                      <td className="font-semibold text-foreground">
                        {row.name} {row.is_default && <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded ml-1">Default</span>}
                      </td>
                    )}
                    {visibleColumns.currency_code && (
                      <td className="font-mono text-xs font-bold">{row.code}</td>
                    )}
                    {visibleColumns.currency_symbol && (
                      <td className="font-bold text-center w-12">{row.symbol}</td>
                    )}
                    {visibleColumns.currency_rate && (
                      <td className="font-mono text-xs font-semibold">{Number(row.exchange_rate || 1).toFixed(4)}</td>
                    )}
                    {visibleColumns.currency_status && (
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

export default CurrenciesTab
