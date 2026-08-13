import React from 'react'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'

interface PagesTabProps {
  records: any[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  openEditModal: (item: any) => void
  confirmDelete: (id: number) => void
}

export const PagesTab: React.FC<PagesTabProps> = ({
  records = [],
  isLoading,
  isFetching,
  visibleColumns,
  openEditModal,
  confirmDelete,
}) => {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden print:hidden">
      <TableWrapper isFetching={isFetching}>
        <div className="overflow-x-auto">
          <table className="w-full data-table border-collapse">
            <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
              <tr>
                {visibleColumns.title && <th>Page Title</th>}
                {visibleColumns.slug && <th>Slug</th>}
                {visibleColumns.status && <th>Status</th>}
                {visibleColumns.actions && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={4} />
              ) : records.length === 0 ? (
                <EmptyState cols={4} message="No landing pages found." />
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                    {visibleColumns.title && (
                      <td>
                        <p onClick={() => openEditModal(r)} className="font-bold text-foreground hover:text-primary cursor-pointer text-sm">
                          {r.title}
                        </p>
                      </td>
                    )}
                    {visibleColumns.slug && (
                      <td>
                        <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                          {r.slug}
                        </span>
                      </td>
                    )}
                    {visibleColumns.status && (
                      <td>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          r.status === 'published' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}>
                          {r.status || 'published'}
                        </span>
                      </td>
                    )}
                    {visibleColumns.actions && (
                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        <TableActionMenu
                          onEdit={() => openEditModal(r)}
                          onDelete={() => confirmDelete(r.id)}
                        />
                      </td>
                    )}
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

export default PagesTab
