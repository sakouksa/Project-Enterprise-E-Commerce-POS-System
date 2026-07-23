import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface PaginationProps {
  currentPage: number
  lastPage: number
  total: number
  perPage?: number
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
  perPageOptions?: number[]
  isLoading?: boolean
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  total,
  perPage = 20,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 20, 50, 100],
  isLoading = false,
}) => {
  const { t } = useTranslation()
  const disabled = isLoading
  const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1
  const to = Math.min(currentPage * perPage, total)

  // Build visible page numbers (max 5, centred around current)
  const buildPages = () => {
    if (lastPage <= 7) return Array.from({ length: lastPage }, (_, i) => i + 1)
    const pages: (number | '...')[] = []
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', lastPage)
    } else if (currentPage >= lastPage - 3) {
      pages.push(1, '...', lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage)
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage)
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border bg-card">
      <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-muted-foreground w-full sm:w-auto justify-between sm:justify-start">
        {onPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap">{t('pagination.rowsPerPage', 'Rows per page:')}</span>
            <div className="relative inline-flex items-center">
              <select
                value={perPage}
                onChange={(e) => onPerPageChange(Number(e.target.value))}
                className="h-8 pl-3 pr-7 text-xs font-bold rounded-xl border border-border bg-card text-foreground hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-2xs transition-all appearance-none"
              >
                {perPageOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-card text-foreground font-semibold">
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        )}
        <div>
          {t('pagination.showing_prefix', 'Showing')}{' '}
          <span className="font-semibold text-foreground">{from}–{to}</span>{' '}
          {t('pagination.showing_of', 'of')}{' '}
          <span className="font-semibold text-foreground">{total}</span>{' '}
          {t('pagination.showing_records', 'records')}
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={disabled || currentPage <= 1}
          className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40
                     disabled:cursor-not-allowed transition-colors"
          aria-label={t('pagination.firstPage', 'First page')}
        >
          <ChevronsLeft size={15} />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={disabled || currentPage <= 1}
          className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40
                     disabled:cursor-not-allowed transition-colors"
          aria-label={t('pagination.prevPage', 'Previous page')}
        >
          <ChevronLeft size={15} />
        </button>

        {/* Page numbers */}
        <div className="hidden md:flex items-center gap-1">
          {buildPages().map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="w-8 text-center text-sm text-muted-foreground">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                disabled={disabled}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                            ${p === currentPage
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'hover:bg-muted text-muted-foreground'
                            }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Mobile current/total indicator */}
        <span className="text-sm font-medium text-muted-foreground px-2 md:hidden">
          {t('pagination.pageOf', {
            current: currentPage,
            total: lastPage || 1,
            defaultValue: 'Page {{current}} of {{total}}'
          })}
        </span>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={disabled || currentPage >= lastPage || lastPage === 0}
          className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40
                     disabled:cursor-not-allowed transition-colors"
          aria-label={t('pagination.nextPage', 'Next page')}
        >
          <ChevronRight size={15} />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(lastPage || 1)}
          disabled={disabled || currentPage >= lastPage || lastPage === 0}
          className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40
                     disabled:cursor-not-allowed transition-colors"
          aria-label={t('pagination.lastPage', 'Last page')}
        >
          <ChevronsRight size={15} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
