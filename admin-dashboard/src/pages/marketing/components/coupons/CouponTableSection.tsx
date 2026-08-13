import React from 'react'
import { Copy } from 'lucide-react'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'
import type { Coupon } from '../../types/coupon'

interface CouponTableSectionProps {
  coupons: Coupon[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  setDetailDrawerCoupon: (coupon: Coupon) => void
  openEditModal: (coupon: Coupon) => void
  handleDuplicate: (coupon: Coupon) => void
  setDeleteTarget: (coupon: Coupon) => void
  toggleStatusMutation: any
}

export const CouponTableSection: React.FC<CouponTableSectionProps> = ({
  coupons = [],
  isLoading,
  isFetching,
  visibleColumns,
  setDetailDrawerCoupon,
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
                {visibleColumns.name && <th>Coupon Campaign</th>}
                {visibleColumns.code && <th>Code</th>}
                {visibleColumns.type && <th>Type</th>}
                {visibleColumns.value && <th>Value</th>}
                {visibleColumns.minSpend && <th>Min Spend</th>}
                {visibleColumns.usageLimit && <th>Redemptions / Limit</th>}
                {visibleColumns.expiresAt && <th>Expiry Date</th>}
                {visibleColumns.status && <th>Status</th>}
                {visibleColumns.actions && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={9} />
              ) : coupons.length === 0 ? (
                <EmptyState cols={9} message="No coupons or vouchers found matching query." />
              ) : (
                coupons.map((coupon) => {
                  const isExp = coupon.expires_at && new Date(coupon.expires_at) < new Date()
                  return (
                    <tr key={coupon.id} className="hover:bg-muted/40 transition-colors">
                      {visibleColumns.name && (
                        <td>
                          <p
                            onClick={() => setDetailDrawerCoupon(coupon)}
                            className="font-bold text-foreground hover:text-primary cursor-pointer transition-colors text-sm"
                          >
                            {coupon.name}
                          </p>
                        </td>
                      )}
                      {visibleColumns.code && (
                        <td>
                          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                            {coupon.code}
                          </span>
                        </td>
                      )}
                      {visibleColumns.type && (
                        <td className="capitalize text-xs font-medium">
                          {coupon.type.replace('_', ' ')}
                        </td>
                      )}
                      {visibleColumns.value && (
                        <td className="font-bold text-foreground">
                          {coupon.type === 'percentage' ? `${coupon.value}%` : coupon.type === 'fixed' ? `$${coupon.value}` : 'Free'}
                        </td>
                      )}
                      {visibleColumns.minSpend && (
                        <td className="text-xs font-mono">${coupon.minimum_amount || 0}</td>
                      )}
                      {visibleColumns.usageLimit && (
                        <td className="text-xs font-mono">
                          {coupon.used_count || 0} / {coupon.usage_limit || '∞'}
                        </td>
                      )}
                      {visibleColumns.expiresAt && (
                        <td className="text-xs font-mono">
                          {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td>
                          <button
                            type="button"
                            onClick={() => toggleStatusMutation.mutate({ id: coupon.id, is_active: !coupon.is_active })}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                              isExp
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                : coupon.is_active
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isExp ? 'bg-amber-500' : coupon.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span>{isExp ? 'Expired' : coupon.is_active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td className="text-right" onClick={(e) => e.stopPropagation()}>
                          <TableActionMenu
                            onView={() => setDetailDrawerCoupon(coupon)}
                            onEdit={() => openEditModal(coupon)}
                            onDelete={() => setDeleteTarget(coupon)}
                            items={[
                              {
                                label: 'Duplicate',
                                icon: Copy,
                                onClick: () => handleDuplicate(coupon),
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

export default CouponTableSection
