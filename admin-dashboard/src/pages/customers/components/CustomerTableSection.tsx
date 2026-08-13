import React from 'react'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'
import type { Customer } from '../types'

interface CustomerTableSectionProps {
  customers: Customer[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  openEditModal: (cust: Customer) => void
  setViewCustomer: (cust: Customer) => void
  setDeleteTarget: (cust: Customer) => void
}

export const CustomerTableSection: React.FC<CustomerTableSectionProps> = ({
  customers = [],
  isLoading,
  isFetching,
  visibleColumns,
  openEditModal,
  setViewCustomer,
  setDeleteTarget,
}) => {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden print:hidden">
      <TableWrapper isFetching={isFetching}>
        <div className="overflow-x-auto">
          <table className="w-full data-table border-collapse">
            <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
              <tr>
                {visibleColumns.name && <th>Customer Name</th>}
                {visibleColumns.email && <th>Email</th>}
                {visibleColumns.phone && <th>Phone</th>}
                {visibleColumns.group && <th>Group</th>}
                {visibleColumns.totalSpent && <th>Total Spent</th>}
                {visibleColumns.orderCount && <th>Orders</th>}
                {visibleColumns.loyaltyPoints && <th>Loyalty Points</th>}
                {visibleColumns.status && <th>Status</th>}
                {visibleColumns.actions && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={9} />
              ) : customers.length === 0 ? (
                <EmptyState cols={9} message="No customer records found matching query." />
              ) : (
                customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-muted/40 transition-colors">
                    {visibleColumns.name && (
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0 overflow-hidden">
                            {cust.photo ? (
                              <img src={cust.photo} alt={cust.name} className="w-full h-full object-cover" />
                            ) : (
                              cust.name[0]?.toUpperCase()
                            )}
                          </div>
                          <p onClick={() => setViewCustomer(cust)} className="font-bold text-foreground hover:text-primary cursor-pointer text-sm">
                            {cust.name}
                          </p>
                        </div>
                      </td>
                    )}
                    {visibleColumns.email && (
                      <td className="text-xs text-muted-foreground">{cust.email || '-'}</td>
                    )}
                    {visibleColumns.phone && (
                      <td className="text-xs font-mono">{cust.phone || '-'}</td>
                    )}
                    {visibleColumns.group && (
                      <td className="text-xs font-semibold text-foreground">
                        {cust.group?.name || 'Standard'}
                      </td>
                    )}
                    {visibleColumns.totalSpent && (
                      <td className="font-mono text-xs font-bold text-emerald-600">${cust.total_spent || 0}</td>
                    )}
                    {visibleColumns.orderCount && (
                      <td className="font-mono text-xs font-bold text-foreground">{cust.order_count || 0}</td>
                    )}
                    {visibleColumns.loyaltyPoints && (
                      <td className="font-mono text-xs font-bold text-amber-500">{cust.loyalty_points || 0} PTS</td>
                    )}
                    {visibleColumns.status && (
                      <td>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cust.is_active ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}`}>
                          {cust.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    )}
                    {visibleColumns.actions && (
                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        <TableActionMenu
                          onView={() => setViewCustomer(cust)}
                          onEdit={() => openEditModal(cust)}
                          onDelete={() => setDeleteTarget(cust)}
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

export default CustomerTableSection
