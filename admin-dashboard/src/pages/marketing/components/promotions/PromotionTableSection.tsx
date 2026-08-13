import React from 'react'
import { Copy } from 'lucide-react'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'
import type { Promotion } from '../../types/promotion'

interface PromotionTableSectionProps {
  promotions: Promotion[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  getPromoStatus: (p: Promotion) => 'running' | 'scheduled' | 'expired' | 'paused' | 'draft'
  setDetailDrawerPromo: (p: Promotion) => void
  openEditModal: (p: Promotion) => void
  handleDuplicate: (p: Promotion) => void
  setDeleteTarget: (p: Promotion) => void
  toggleStatusMutation: any
}

export const PromotionTableSection: React.FC<PromotionTableSectionProps> = ({
  promotions = [],
  isLoading,
  isFetching,
  visibleColumns,
  getPromoStatus,
  setDetailDrawerPromo,
  openEditModal,
  handleDuplicate,
  setDeleteTarget,
  toggleStatusMutation,
}) => {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden print:hidden">
      <TableWrapper isFetching={isFetching}>
        <div className="overflow-x-auto">
          <table className="w-full data-table border-collapse">
            <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
              <tr>
                {visibleColumns.name && <th>Promotion Campaign</th>}
                {visibleColumns.type && <th>Type</th>}
                {visibleColumns.priority && <th>Priority</th>}
                {visibleColumns.dates && <th>Schedule (Start - End)</th>}
                {visibleColumns.performance && <th>Orders Driven</th>}
                {visibleColumns.status && <th>Status</th>}
                {visibleColumns.actions && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={7} />
              ) : promotions.length === 0 ? (
                <EmptyState cols={7} message="No promotion rules found matching query." />
              ) : (
                promotions.map((p) => {
                  const st = getPromoStatus(p)
                  return (
                    <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                      {visibleColumns.name && (
                        <td>
                          <div>
                            <p
                              onClick={() => setDetailDrawerPromo(p)}
                              className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors text-sm"
                            >
                              {p.name}
                            </p>
                            {p.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                            )}
                          </div>
                        </td>
                      )}
                      {visibleColumns.type && (
                        <td className="capitalize text-xs font-medium">
                          <span className="bg-muted px-2 py-0.5 rounded border border-border">
                            {p.type.replace('_', ' ')}
                          </span>
                        </td>
                      )}
                      {visibleColumns.priority && (
                        <td className="font-mono text-xs font-bold text-muted-foreground">{p.priority}</td>
                      )}
                      {visibleColumns.dates && (
                        <td className="text-xs font-mono">
                          <div>Starts: {p.starts_at ? new Date(p.starts_at).toLocaleDateString() : 'Immediate'}</div>
                          <div className="text-muted-foreground">Ends: {p.ends_at ? new Date(p.ends_at).toLocaleDateString() : 'Never'}</div>
                        </td>
                      )}
                      {visibleColumns.performance && (
                        <td className="font-mono text-xs font-bold text-foreground">{p.orders_count || 0}</td>
                      )}
                      {visibleColumns.status && (
                        <td>
                          <button
                            type="button"
                            onClick={() => toggleStatusMutation.mutate({ id: p.id, is_active: !p.is_active })}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                              st === 'running'
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : st === 'scheduled'
                                ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                                : st === 'expired'
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              st === 'running' ? 'bg-emerald-500' : st === 'scheduled' ? 'bg-blue-500' : st === 'expired' ? 'bg-amber-500' : 'bg-rose-500'
                            }`} />
                            <span className="capitalize">{st}</span>
                          </button>
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td className="text-right" onClick={(e) => e.stopPropagation()}>
                          <TableActionMenu
                            onView={() => setDetailDrawerPromo(p)}
                            onEdit={() => openEditModal(p)}
                            onDelete={() => setDeleteTarget(p)}
                            items={[
                              {
                                label: 'Duplicate Rule',
                                icon: Copy,
                                onClick: () => handleDuplicate(p),
                              },
                            ]}
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

export default PromotionTableSection
