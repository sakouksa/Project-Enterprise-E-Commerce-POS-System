import React from 'react'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'
import StatusBadge from '@/components/common/StatusBadge'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'
import { getAbsoluteImageUrl } from '@/utils/image'
import { 
  ShieldAlert, 
  CreditCard, 
  Tag, 
  Sparkles, 
  AlertCircle, 
  Crown, 
  Gem, 
  Rocket, 
  AlertTriangle, 
  Moon, 
  UserPlus,
  Banknote,
  Printer
} from 'lucide-react'
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
  onSettleDebt?: (cust: Customer) => void
  onPrintStatement?: (cust: Customer) => void
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
  onSettleDebt,
  onPrintStatement,
}) => {
  const { language } = useThemeStore()
  const { t } = useTranslation(['customers', 'common'])

  const renderRfmBadge = (segment?: string) => {
    switch (segment) {
      case 'champions':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <Crown size={11} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            {t('customers.rfmChampions', 'Champions')}
          </span>
        )
      case 'loyal':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30">
            <Gem size={11} className="text-blue-600 dark:text-blue-400 shrink-0" />
            {t('customers.rfmLoyal', 'Loyal')}
          </span>
        )
      case 'potential':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30">
            <Rocket size={11} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
            {t('customers.rfmPotential', 'Potential')}
          </span>
        )
      case 'at_risk':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <AlertTriangle size={11} className="text-amber-600 dark:text-amber-400 shrink-0" />
            {t('customers.rfmAtRisk', 'At-Risk')}
          </span>
        )
      case 'hibernating':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            <Moon size={11} className="text-rose-600 dark:text-rose-400 shrink-0" />
            {t('customers.rfmHibernating', 'Inactive')}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border/60">
            <UserPlus size={11} className="text-purple-500 shrink-0" />
            {t('customers.rfmNew', 'New')}
          </span>
        )
    }
  }

  const renderTermsBadge = (term?: string) => {
    switch (term) {
      case 'net_15':
        return <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 text-[10px] font-mono font-bold">{t('customers.paymentTermNet15', 'Net 15')}</span>
      case 'net_30':
        return <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 text-[10px] font-mono font-bold">{t('customers.paymentTermNet30', 'Net 30')}</span>
      case 'net_60':
        return <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 text-[10px] font-mono font-bold">{t('customers.paymentTermNet60', 'Net 60')}</span>
      case 'eom':
        return <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[10px] font-mono font-bold">{t('customers.paymentTermEom', 'EOM')}</span>
      default:
        return <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-mono">{t('customers.termPrepaid', 'Prepaid')}</span>
    }
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-2xs overflow-hidden print:hidden">
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
                {visibleColumns.name !== false && <th>{t('customers.name', 'Customer Profile')}</th>}
                {visibleColumns.email !== false && <th>{t('customers.email', 'Email / Phone')}</th>}
                {visibleColumns.group !== false && <th>{t('customers.customerGroup', 'Group & Segment')}</th>}
                {visibleColumns.credit !== false && <th>{t('customers.creditAndTerms', 'Credit & Terms')}</th>}
                {visibleColumns.wallet !== false && <th>{t('customers.walletAndPoints', 'Wallet & Points')}</th>}
                {visibleColumns.totalSpent !== false && <th>{t('customers.totalSpent', 'Total Spent')}</th>}
                {visibleColumns.orderCount !== false && <th>{t('customers.ordersCount', 'Orders')}</th>}
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
                  const tags = Array.isArray(cust.tags) ? cust.tags : (cust.tags ? [cust.tags] : [])

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

                      {/* Customer Name & Enterprise Badges */}
                      {visibleColumns.name !== false && (
                        <td className="py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0 overflow-hidden shadow-2xs">
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
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p 
                                  onClick={() => setViewCustomer(cust)} 
                                  className="font-bold text-foreground hover:text-primary cursor-pointer text-sm truncate"
                                >
                                  {cust.name}
                                </p>
                                {cust.is_credit_hold && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 text-[10px] font-bold border border-rose-500/20" title="Credit Lock Active">
                                    <ShieldAlert size={10} />
                                    Hold
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  #{String(cust.id).padStart(4, '0')}
                                </span>
                                {tags.slice(0, 2).map((t, idx) => (
                                  <span key={idx} className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-muted px-1.5 py-0.2 rounded border border-border/50">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Email & Phone */}
                      {visibleColumns.email !== false && (
                        <td className="text-xs">
                          <p className="text-muted-foreground truncate max-w-[150px]">{cust.email || '—'}</p>
                          <p className="font-mono text-foreground font-medium text-[11px]">{cust.phone || '—'}</p>
                        </td>
                      )}

                      {/* Group & RFM Segment */}
                      {visibleColumns.group !== false && (
                        <td>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-foreground truncate">
                              {cust.group?.name || '—'}
                            </p>
                            <div>{renderRfmBadge(cust.rfm_segment)}</div>
                          </div>
                        </td>
                      )}

                      {/* Credit & Terms */}
                      {visibleColumns.credit !== false && (
                        <td>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              {renderTermsBadge(cust.payment_terms)}
                            </div>
                            {Number(cust.credit_limit || 0) > 0 ? (
                              <p className="text-[11px] font-mono text-muted-foreground">
                                <span className="font-bold text-foreground">
                                  ${Number(cust.outstanding_balance || 0).toLocaleString()}
                                </span>
                                {' / '}${Number(cust.credit_limit || 0).toLocaleString()}
                              </p>
                            ) : (
                              <p className="text-[10px] text-muted-foreground">—</p>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Wallet & Loyalty Points */}
                      {visibleColumns.wallet !== false && (
                        <td>
                          <div className="space-y-1 font-mono text-xs">
                            <p className="font-bold text-emerald-600 dark:text-emerald-400">
                              ${Number(cust.wallet_balance || 0).toFixed(2)}
                            </p>
                            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                              ★ {Number(cust.loyalty_points || 0).toLocaleString()} pts
                            </p>
                          </div>
                        </td>
                      )}

                      {/* Total Spent */}
                      {visibleColumns.totalSpent !== false && (
                        <td className="font-mono text-xs font-bold text-foreground">
                          ${Number(cust.total_spent || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      )}

                      {/* Orders Count */}
                      {visibleColumns.orderCount !== false && (
                        <td className="font-mono text-xs font-bold text-center">
                          <span className="px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                            {cust.order_count || 0}
                          </span>
                        </td>
                      )}

                      {/* Status */}
                      {visibleColumns.status !== false && (
                        <td>
                          <StatusBadge status={cust.is_active} />
                        </td>
                      )}

                      {/* Actions */}
                      {visibleColumns.actions !== false && (
                        <td className="text-right pr-4" onClick={(e) => e.stopPropagation()}>
                          <TableActionMenu
                            onView={() => setViewCustomer(cust)}
                            onEdit={() => openEditModal(cust)}
                            onDelete={() => setDeleteTarget(cust)}
                            onPrint={onPrintStatement ? () => onPrintStatement(cust) : undefined}
                            printLabel={t('customers.printStatement', 'Print Statement (SOA)')}
                            items={onSettleDebt && Number(cust.outstanding_balance || 0) > 0 ? [{
                              label: t('customers.settleDebt', 'Settle Debt'),
                              icon: Banknote,
                              onClick: () => onSettleDebt(cust),
                              variant: 'success' as const,
                            }] : []}
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
