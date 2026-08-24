import React from 'react'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'
import StatusBadge from '@/components/common/StatusBadge'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'
import { getAbsoluteImageUrl } from '@/utils/image'
import type { Customer } from '../types'

interface CustomerTableSectionProps {
  customers: Customer[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  selectedRows: number[]
  handleSelectAll: (checked: boolean) => void
  handleSelectRow: (id: number, checked: boolean) => void
  openEditModal: (cust: Customer) => void
  setViewCustomer: (cust: Customer) => void
  setDeleteTarget: (cust: Customer) => void
}

export const CustomerTableSection: React.FC<CustomerTableSectionProps> = ({
  customers = [],
  isLoading,
  isFetching,
  visibleColumns,
  selectedRows = [],
  handleSelectAll,
  handleSelectRow,
  openEditModal,
  setViewCustomer,
  setDeleteTarget,
}) => {
  const { language } = useThemeStore()
  const { t } = useTranslation(['customers', 'common'])

  return (
    <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden print:hidden">
      <TableWrapper isFetching={isFetching}>
        <div className="overflow-x-auto">
          <table className="w-full data-table border-collapse">
            <thead className="bg-muted/40 sticky top-0 border-b border-border z-10 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-10 text-center !px-3">
                  <input
                    type="checkbox"
                    className="checkbox h-4 w-4 rounded border-border"
                    checked={customers.length > 0 && selectedRows.length === customers.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                {visibleColumns.name !== false && <th>{t('customers.name', 'Customer Name')}</th>}
                {visibleColumns.email !== false && <th>{t('customers.email', 'Email')}</th>}
                {visibleColumns.phone !== false && <th>{t('customers.phone', 'Phone')}</th>}
                {visibleColumns.group !== false && <th>{t('customers.customerGroup', 'Group')}</th>}
                {visibleColumns.totalSpent !== false && <th>{t('customers.totalSpent', 'Total Spent')}</th>}
                {visibleColumns.orderCount !== false && <th>{t('customers.ordersCount', 'Orders')}</th>}
                {visibleColumns.loyaltyPoints !== false && <th>{t('customers.loyaltyPoints', 'Loyalty Points')}</th>}
                {visibleColumns.status !== false && <th>{t('common.status', 'Status')}</th>}
                {visibleColumns.actions !== false && <th className="text-right pr-4">{t('common.actions', 'Actions')}</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={10} />
              ) : customers.length === 0 ? (
                <EmptyState cols={10} message={t('customers.noCustomersFound', 'No customer records found matching query.')} />
              ) : (
                customers.map((cust) => {
                  const isSelected = selectedRows.includes(cust.id)
                  return (
                    <tr
                      key={cust.id}
                      className={`hover:bg-muted/40 transition-colors border-b border-border/40 ${
                        isSelected ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="w-10 text-center !px-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="checkbox h-4 w-4 rounded border-border"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(cust.id, e.target.checked)}
                        />
                      </td>
                      {visibleColumns.name !== false && (
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0 overflow-hidden">
                              {(() => {
                                const photoUrl = getAbsoluteImageUrl(cust.photo)
                                return photoUrl ? (
                                  <img
                                    src={photoUrl}
                                    alt={cust.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                      const parent = e.currentTarget.parentElement
                                      if (parent && !parent.querySelector('.cust-initial')) {
                                        const span = document.createElement('span')
                                        span.className = 'cust-initial text-xs font-bold text-primary'
                                        span.innerText = cust.name[0]?.toUpperCase() || 'C'
                                        parent.appendChild(span)
                                      }
                                    }}
                                  />
                                ) : (
                                  <span className="text-xs font-bold">{cust.name[0]?.toUpperCase() || 'C'}</span>
                                )
                              })()}
                            </div>
                            <p onClick={() => setViewCustomer(cust)} className="font-bold text-foreground hover:text-primary cursor-pointer text-sm">
                              {cust.name}
                            </p>
                          </div>
                        </td>
                      )}
                      {visibleColumns.email !== false && (
                        <td className="text-xs text-muted-foreground">{cust.email || '—'}</td>
                      )}
                      {visibleColumns.phone !== false && (
                        <td className="text-xs font-mono">{cust.phone || '—'}</td>
                      )}
                      {visibleColumns.group !== false && (
                        <td className="text-xs font-semibold text-foreground">
                          {cust.group?.name || t('customers.standardGroup', 'Standard')}
                        </td>
                      )}
                      {visibleColumns.totalSpent !== false && (
                        <td className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          ${Number(cust.total_spent || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      )}
                      {visibleColumns.orderCount !== false && (
                        <td className="font-mono text-xs font-bold text-foreground">
                          {Number(cust.order_count || 0).toLocaleString('en-US')}
                        </td>
                      )}
                      {visibleColumns.loyaltyPoints !== false && (
                        <td className="font-mono text-xs font-bold text-amber-500">
                          {Number(cust.loyalty_points || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} {t('customers.pts', 'PTS')}
                        </td>
                      )}
                      {visibleColumns.status !== false && (
                        <td>
                          <StatusBadge status={cust.is_active} />
                        </td>
                      )}
                      {visibleColumns.actions !== false && (
                        <td className="text-right pr-4" onClick={(e) => e.stopPropagation()}>
                          <TableActionMenu
                            onView={() => setViewCustomer(cust)}
                            onEdit={() => openEditModal(cust)}
                            onDelete={() => setDeleteTarget(cust)}
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

export default CustomerTableSection
