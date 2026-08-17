import React from 'react'
import { useTranslation } from 'react-i18next'
import { Sliders, PlusCircle, MinusCircle, RefreshCw, CheckCircle2, Clock, Eye, Edit, Trash2, Check, Warehouse, XCircle } from 'lucide-react'
import TableWrapper from '@/components/shared/TableWrapper'
import TableActionMenu from '@/components/shared/TableActionMenu'
import Pagination from '@/components/shared/Pagination'

interface StockAdjustmentsTableProps {
  data: any
  isLoading: boolean
  isFetching: boolean
  pagination: any
  perPage: number
  setPage: (p: number) => void
  setPerPage: (p: number) => void
  onViewItem: (id: number) => void
  onEditItem?: (id: number) => void
  onDeleteItem?: (id: number) => void
  onApproveItem?: (id: number) => void
  visibleColumns?: Record<string, boolean>
}

export const StockAdjustmentsTable: React.FC<StockAdjustmentsTableProps> = ({
  data,
  isLoading,
  isFetching,
  pagination,
  perPage,
  setPage,
  setPerPage,
  onViewItem,
  onEditItem,
  onDeleteItem,
  onApproveItem,
  visibleColumns = {},
}) => {
  const { t } = useTranslation(['inventory', 'common', 'buttons'])
  const items: any[] = data?.data ?? []

  const activeColCount = 1 + Object.values(visibleColumns).filter(v => v !== false).length

  const formatShortDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return '—'
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'addition':
      case 'in':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <PlusCircle size={10} />
            {t('typeAddition', 'Addition (+)')}
          </span>
        )
      case 'subtraction':
      case 'out':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <MinusCircle size={10} />
            {t('typeSubtraction', 'Subtraction (-)')}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <RefreshCw size={10} />
            {t('typeRecount', 'Recount')}
          </span>
        )
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'done':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={10} />
            {t('approved', 'Approved')}
          </span>
        )
      case 'rejected':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle size={10} />
            {t('rejected', 'Rejected')}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock size={10} />
            {t('pendingApproval', 'Pending Approval')}
          </span>
        )
    }
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden print:hidden">
      <TableWrapper isFetching={isFetching}>
        <table className="w-full data-table">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {visibleColumns.date !== false && (
                <th className="text-left py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                  {t('colDate', 'Date')}
                </th>
              )}
              {visibleColumns.reference !== false && (
                <th className="text-left py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                  {t('colReference', 'Reference #')}
                </th>
              )}
              {visibleColumns.warehouse !== false && (
                <th className="text-left py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                  {t('colWarehouse', 'Warehouse')}
                </th>
              )}
              {visibleColumns.type !== false && (
                <th className="text-center py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                  {t('type', 'Type')}
                </th>
              )}
              {visibleColumns.items !== false && (
                <th className="text-center py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                  {t('colItemsCount', 'Items')}
                </th>
              )}
              {visibleColumns.reason !== false && (
                <th className="text-left py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                  {t('reason', 'Reason')}
                </th>
              )}
              {visibleColumns.status !== false && (
                <th className="text-center py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                  {t('colStatus', 'Status')}
                </th>
              )}
              {visibleColumns.user !== false && (
                <th className="text-left py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                  {t('colUser', 'Created By')}
                </th>
              )}
              <th className="sticky right-0 z-10 bg-background border-l border-border text-center py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap min-w-[80px]">
                {t('common.actions', 'Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {visibleColumns.date !== false && <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>}
                  {visibleColumns.reference !== false && <td className="p-4"><div className="skeleton h-4 w-24 rounded" /></td>}
                  {visibleColumns.warehouse !== false && <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>}
                  {visibleColumns.type !== false && <td className="p-4"><div className="skeleton h-4 w-20 rounded mx-auto" /></td>}
                  {visibleColumns.items !== false && <td className="p-4"><div className="skeleton h-4 w-12 rounded mx-auto" /></td>}
                  {visibleColumns.reason !== false && <td className="p-4"><div className="skeleton h-4 w-32 rounded" /></td>}
                  {visibleColumns.status !== false && <td className="p-4"><div className="skeleton h-4 w-16 rounded mx-auto" /></td>}
                  {visibleColumns.user !== false && <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>}
                  <td className="p-4"><div className="skeleton h-4 w-8 rounded ml-auto" /></td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={activeColCount || 9} className="py-16 text-center text-muted-foreground text-sm">
                  <Sliders size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                  <p>{t('noAdjustmentsFound', 'No stock adjustment records found.')}</p>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const itemsCount = item.items?.length || Number(item.items_count || 1)
                const isApproved = item.status === 'approved' || item.status === 'completed' || item.status === 'done'
                const canEdit = !isApproved
                const canDelete = !isApproved

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => onViewItem(item.id)}
                  >
                    {visibleColumns.date !== false && (
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {formatShortDate(item.created_at || item.date)}
                      </td>
                    )}
                    {visibleColumns.reference !== false && (
                      <td className="py-3 px-4 font-mono font-bold text-xs text-primary whitespace-nowrap">
                        {item.reference_number || `ADJ-${item.id}`}
                      </td>
                    )}
                    {visibleColumns.warehouse !== false && (
                      <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Warehouse size={13} className="text-muted-foreground/60" />
                          <span>{item.warehouse?.name || 'Main Warehouse'}</span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.type !== false && (
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {getTypeBadge(item.type)}
                      </td>
                    )}
                    {visibleColumns.items !== false && (
                      <td className="py-3 px-4 text-center font-bold text-xs text-foreground whitespace-nowrap">
                        {itemsCount}
                      </td>
                    )}
                    {visibleColumns.reason !== false && (
                      <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs truncate">
                        {item.reason || item.notes || 'Routine stock count adjustment'}
                      </td>
                    )}
                    {visibleColumns.status !== false && (
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                    )}
                    {visibleColumns.user !== false && (
                      <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {item.user?.name || 'Admin'}
                      </td>
                    )}
                    <td className="sticky right-0 z-10 bg-background group-hover:bg-muted border-l border-border py-3 px-4 text-center whitespace-nowrap min-w-[80px]" onClick={(e) => e.stopPropagation()}>
                      <TableActionMenu
                        onView={() => onViewItem(item.id)}
                        onEdit={canEdit && onEditItem ? () => onEditItem(item.id) : undefined}
                        onDelete={canDelete && onDeleteItem ? () => onDeleteItem(item.id) : undefined}
                      />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </TableWrapper>
      <Pagination
        currentPage={pagination?.current_page || pagination?.currentPage || 1}
        lastPage={pagination?.last_page || pagination?.lastPage || 1}
        total={pagination?.total ?? (data?.total || items.length)}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
      />
    </div>
  )
}

export default StockAdjustmentsTable
