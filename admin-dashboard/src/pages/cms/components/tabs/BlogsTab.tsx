import React from 'react'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'

interface BlogsTabProps {
  records: any[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  openEditModal: (item: any) => void
  confirmDelete: (id: number) => void
}

export const BlogsTab: React.FC<BlogsTabProps> = ({
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
                {visibleColumns.title && <th>Article Headline</th>}
                {visibleColumns.slug && <th>Slug</th>}
                {visibleColumns.category && <th>Category</th>}
                {visibleColumns.status && <th>Status</th>}
                {visibleColumns.actions && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={5} />
              ) : records.length === 0 ? (
                <EmptyState cols={5} message="No blog articles found matching query." />
              ) : (
                records.map((r) => {
                  const st = (r.status || 'published').toLowerCase()
                  return (
                    <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                      {visibleColumns.title && (
                        <td>
                          <div>
                            <p onClick={() => openEditModal(r)} className="font-bold text-foreground hover:text-primary cursor-pointer text-sm">
                              {r.title}
                            </p>
                            {r.excerpt && <p className="text-xs text-muted-foreground line-clamp-1">{r.excerpt}</p>}
                          </div>
                        </td>
                      )}
                      {visibleColumns.slug && (
                        <td>
                          <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                            {r.slug}
                          </span>
                        </td>
                      )}
                      {visibleColumns.category && (
                        <td className="text-xs font-semibold text-foreground">
                          {r.blog_category?.name || r.category_name || 'General'}
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            st === 'published' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                            st === 'draft' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                            'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          }`}>
                            {st}
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
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </TableWrapper>
    </div>
  )
}

export default BlogsTab
