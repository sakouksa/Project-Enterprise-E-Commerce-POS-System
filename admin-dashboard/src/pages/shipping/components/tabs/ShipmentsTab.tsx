import React from 'react'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'

interface ShipmentsTabProps {
  records: any[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  openEditModal: (item: any) => void
  setDeleteId: (id: number) => void
  setConfirmOpen: (val: boolean) => void
  setDetailDrawerItem: (item: any) => void
}

export const ShipmentsTab: React.FC<ShipmentsTabProps> = ({
  records = [],
  isLoading,
  isFetching,
  visibleColumns,
  openEditModal,
  setDeleteId,
  setConfirmOpen,
  setDetailDrawerItem,
}) => {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden print:hidden">
      <TableWrapper isFetching={isFetching}>
        <div className="overflow-x-auto">
          <table className="w-full data-table border-collapse">
            <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
              <tr>
                {visibleColumns.id && <th>Tracking / Order ID</th>}
                {visibleColumns.carrier && <th>Carrier / Provider</th>}
                {visibleColumns.cost && <th>Freight Fee</th>}
                {visibleColumns.status && <th>Status</th>}
                {visibleColumns.actions && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={5} />
              ) : records.length === 0 ? (
                <EmptyState cols={5} message="No shipments found matching query." />
              ) : (
                records.map((r) => {
                  const st = (r.status || 'pending').toLowerCase()
                  return (
                    <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                      {visibleColumns.id && (
                        <td>
                          <div>
                            <p
                              onClick={() => setDetailDrawerItem(r)}
                              className="font-mono text-xs font-bold text-primary hover:underline cursor-pointer"
                            >
                              {r.tracking_number || `TRK-${r.id * 1024}`}
                            </p>
                            <p className="text-[11px] text-muted-foreground">Order: #{r.order_id || r.id}</p>
                          </div>
                        </td>
                      )}
                      {visibleColumns.carrier && (
                        <td>
                          <span className="font-semibold text-xs text-foreground">
                            {r.carrier || r.provider || 'DHL Express'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.cost && (
                        <td className="font-mono text-xs font-bold text-foreground">
                          ${r.shipping_fee || r.price || 0}
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            st === 'delivered' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                            st === 'shipped' || st === 'in_transit' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                            st === 'pending' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                            'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              st === 'delivered' ? 'bg-emerald-500' : st === 'shipped' || st === 'in_transit' ? 'bg-blue-500' : st === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                            }`} />
                            <span>{st.replace('_', ' ')}</span>
                          </span>
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td className="text-right" onClick={(e) => e.stopPropagation()}>
                          <TableActionMenu
                            onView={() => setDetailDrawerItem(r)}
                            onEdit={() => openEditModal(r)}
                            onDelete={() => { setDeleteId(r.id); setConfirmOpen(true); }}
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

export default ShipmentsTab
