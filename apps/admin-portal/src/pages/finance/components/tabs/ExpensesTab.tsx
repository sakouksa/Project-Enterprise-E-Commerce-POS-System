import React, { useState, useMemo } from 'react'
import {
  Copy,
  Check,
  FileText,
  Calendar,
  Tag
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'
import { formatCurrency } from '@/utils/formatters'
import { getStorageFileUrl } from '@/utils/image'
import { useToast } from '@/hooks/useToast'
import ExpenseDetailModal from '../ExpenseDetailModal'
import { resolveCategoryVisual } from '@/components/common/categoryIconConstants'

interface ExpensesTabProps {
  expenses: any[]
  allExpenses?: any[]
  categories?: any[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  openEditDrawer: (row: any) => void
  handleDelete: (id: number, name?: string) => void
  renderSortIcon: (field: string) => React.ReactNode
  handleSort: (field: string) => void
  selectedRows?: number[]
  handleSelectRow?: (id: number) => void
  handleSelectAll?: (allIds: number[]) => void
  activeCategoryFilter?: string
  setActiveCategoryFilter?: (catId: string) => void
}

export const ExpensesTab: React.FC<ExpensesTabProps> = ({
  expenses = [],
  allExpenses = [],
  categories = [],
  isLoading,
  isFetching,
  visibleColumns,
  openEditDrawer,
  handleDelete,
  renderSortIcon,
  handleSort,
  selectedRows = [],
  handleSelectRow,
  handleSelectAll,
  activeCategoryFilter = '',
  setActiveCategoryFilter,
}) => {
  const { t, i18n } = useTranslation(['finance', 'common'])
  const currentLocale = i18n.language === 'km' ? 'km-KH' : i18n.language
  const toast = useToast()

  const [viewExpense, setViewExpense] = useState<any | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const copyRef = (e: React.MouseEvent, id: number, code: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    toast.success(t('common.copied', 'Copied to clipboard!'))
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Filter expenses by category if quick filter is chosen
  const displayedExpenses = useMemo(() => {
    if (!activeCategoryFilter) return expenses
    return expenses.filter((exp: any) => {
      const catId = String(exp.expense_category_id || exp.category?.id || '')
      return catId === String(activeCategoryFilter)
    })
  }, [expenses, activeCategoryFilter])

  const allIds = displayedExpenses.map((e: any) => e.id)
  const isAllSelected = allIds.length > 0 && allIds.every((id: number) => selectedRows.includes(id))

  const handleToggleAll = () => {
    if (handleSelectAll) {
      handleSelectAll(allIds)
    }
  }

  return (
    <div className="space-y-3 print:hidden">
      {/* ─── Interactive Quick Category Filter Strip ─── */}
      {categories.length > 0 && setActiveCategoryFilter && (() => {
        const baseExpensesForCounts = allExpenses && allExpenses.length > 0 ? allExpenses : expenses
        return (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setActiveCategoryFilter('')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                activeCategoryFilter === ''
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <Tag size={12} />
              <span>{t('finance.all_categories', 'All Categories')}</span>
              <span className={`text-[10px] px-1.5 py-0.5 font-bold rounded-md ${activeCategoryFilter === '' ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
                {baseExpensesForCounts.length}
              </span>
            </button>

            {categories.map((cat: any) => {
              const visual = resolveCategoryVisual(cat.name, cat.icon, cat.color)
              const CatIcon = visual.icon
              const isSelected = String(activeCategoryFilter) === String(cat.id)
              const count = baseExpensesForCounts.filter((e: any) => String(e.expense_category_id || e.category?.id) === String(cat.id)).length

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(isSelected ? '' : String(cat.id))}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
                    isSelected
                      ? 'bg-foreground text-background shadow-xs font-bold'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <span className={isSelected ? 'text-background' : visual.colorDef.text}><CatIcon size={13} /></span>
                  <span>{cat.name}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 font-bold rounded-md ${isSelected ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'}`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )
      })()}

      {/* ─── Main Expenses Table Wrapper ─── */}
      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <TableWrapper isFetching={isFetching}>
          <div className="overflow-x-auto">
            <table className="w-full data-table border-collapse">
              <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
                <tr>
                  {handleSelectRow && (
                    <th className="w-10 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleAll}
                        className="rounded border-border text-primary focus:ring-primary/20 h-4 w-4 cursor-pointer"
                      />
                    </th>
                  )}
                  {visibleColumns.expense_title && (
                    <th className="cursor-pointer select-none" onClick={() => handleSort('title')}>
                      <div className="flex items-center gap-1.5">
                        <span>{t('finance.title_col', 'Expense Details')}</span>
                        {renderSortIcon('title')}
                      </div>
                    </th>
                  )}
                  {visibleColumns.expense_category && (
                    <th className="cursor-pointer select-none" onClick={() => handleSort('expense_category_id')}>
                      <div className="flex items-center gap-1.5">
                        <span>{t('finance.category_col', 'Category')}</span>
                        {renderSortIcon('expense_category_id')}
                      </div>
                    </th>
                  )}
                  {visibleColumns.expense_amount && (
                    <th className="cursor-pointer select-none" onClick={() => handleSort('amount')}>
                      <div className="flex items-center gap-1.5">
                        <span>{t('finance.amount_col', 'Amount')}</span>
                        {renderSortIcon('amount')}
                      </div>
                    </th>
                  )}
                  {visibleColumns.expense_date && (
                    <th className="cursor-pointer select-none" onClick={() => handleSort('date')}>
                      <div className="flex items-center gap-1.5">
                        <span>{t('finance.date_col', 'Date')}</span>
                        {renderSortIcon('date')}
                      </div>
                    </th>
                  )}
                  {visibleColumns.expense_receipt && (
                    <th>
                      <div className="flex items-center gap-1.5">
                        <span>{t('finance.receipt_col', 'Receipt')}</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.expense_branch && (
                    <th>
                      <div className="flex items-center gap-1.5">
                        <span>{t('finance.branch_col', 'Branch')}</span>
                      </div>
                    </th>
                  )}
                  <th className="text-right">{t('common.actions', 'Actions')}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {isLoading ? (
                  <LoadingSkeleton cols={8} />
                ) : displayedExpenses.length === 0 ? (
                  <EmptyState cols={8} message={t('finance.no_data_expenses', 'No expense records found.')} />
                ) : (
                  displayedExpenses.map((row: any) => {
                    const categoryName = row.category?.name || (typeof row.expense_category === 'object' ? row.expense_category?.name : row.expense_category) || 'General'
                    const visual = resolveCategoryVisual(categoryName, row.category?.icon, row.category?.color)
                    const CatIcon = visual.icon
                    const refCode = row.reference_number || `EXP-${String(row.id).padStart(5, '0')}`
                    const isSelected = selectedRows.includes(row.id)
                    const amountVal = Number(row.amount || 0)

                    return (
                      <tr
                        key={row.id}
                        onClick={() => setViewExpense(row)}
                        className={`hover:bg-muted/40 transition-colors group cursor-pointer ${
                          isSelected ? 'bg-primary/5' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        {handleSelectRow && (
                          <td
                            className="w-10 px-4 text-center"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelectRow(row.id)
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => handleSelectRow(row.id)}
                              className="rounded border-border text-primary focus:ring-primary/20 h-4 w-4 cursor-pointer"
                            />
                          </td>
                        )}

                        {/* Title & Ref Column */}
                        {visibleColumns.expense_title && (
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${visual.colorDef.bg} ${visual.colorDef.text} ${visual.colorDef.border}`}>
                                <CatIcon size={16} />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                                  {row.title || `Expense #${row.id}`}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      copyRef(e, row.id, refCode)
                                    }}
                                    className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                                    title={t('common.copy', 'Click to copy reference')}
                                  >
                                    <span>{refCode}</span>
                                    {copiedId === row.id ? (
                                      <Check size={10} className="text-emerald-500" />
                                    ) : (
                                      <Copy size={10} />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        )}

                        {/* Category Column */}
                        {visibleColumns.expense_category && (
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${visual.colorDef.bg} ${visual.colorDef.text} ${visual.colorDef.border}`}>
                              <CatIcon size={12} />
                              <span>{categoryName}</span>
                            </span>
                          </td>
                        )}

                        {/* Amount Column */}
                        {visibleColumns.expense_amount && (
                          <td className="py-3">
                            <div>
                              <span className="font-mono font-bold text-sm text-rose-600 dark:text-rose-400">
                                {formatCurrency(amountVal, { locale: currentLocale })}
                              </span>
                              <div className="text-[10px] text-muted-foreground font-medium">
                                {String(t(`finance.status_${row.status || 'approved'}`, row.status || 'approved'))}
                              </div>
                            </div>
                          </td>
                        )}

                        {/* Date Column */}
                        {visibleColumns.expense_date && (
                          <td className="py-3 text-xs text-muted-foreground font-mono">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={13} className="text-muted-foreground/70" />
                              <span>{row.date ? new Date(row.date).toLocaleDateString(currentLocale) : '—'}</span>
                            </div>
                          </td>
                        )}

                        {/* Description Column */}
                        {visibleColumns.expense_description && (
                          <td className="py-3 text-xs text-muted-foreground max-w-xs truncate">
                            {row.description || '—'}
                          </td>
                        )}

                        {/* Receipt Attachment Column */}
                        <td className="py-3 text-center">
                          {row.receipt ? (
                            <a
                              href={getStorageFileUrl(row.receipt)}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                            >
                              <FileText size={12} />
                              <span>{t('finance.receipt_view', 'Receipt')}</span>
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </td>

                        {/* Actions Column */}
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end">
                            <TableActionMenu
                              onView={() => setViewExpense(row)}
                              onEdit={() => openEditDrawer(row)}
                              onDelete={() => handleDelete(row.id, row.title)}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </TableWrapper>
      </div>

      {/* ─── Detail Modal ─── */}
      <ExpenseDetailModal
        isOpen={Boolean(viewExpense)}
        expense={viewExpense}
        onClose={() => setViewExpense(null)}
        onEdit={openEditDrawer}
      />
    </div>
  )
}

export default ExpensesTab
