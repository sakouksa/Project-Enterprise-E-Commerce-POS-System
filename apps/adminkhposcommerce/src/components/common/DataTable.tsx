import React from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Column<T> {
  key: keyof T | string
  title: string
  width?: string
  sortable?: boolean
  render?: (value: unknown, row: T, index: number) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey?: keyof T | ((row: T) => string | number)
  loading?: boolean
  emptyText?: string
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  onSort?: (key: string, dir: 'asc' | 'desc') => void
  footer?: React.ReactNode
  className?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

function DataTable<T extends object>({
  columns,
  data,
  rowKey = 'id' as keyof T,
  loading = false,
  emptyText = 'No records found',
  sortKey,
  sortDir,
  onSort,
  footer,
  className = '',
}: DataTableProps<T>) {

  const getKey = (row: T, idx: number): string | number => {
    if (typeof rowKey === 'function') return rowKey(row)
    return (row[rowKey] as string | number) ?? idx
  }

  const handleSort = (col: Column<T>) => {
    if (!col.sortable || !onSort) return
    const key = col.key as string
    const nextDir: 'asc' | 'desc' = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc'
    onSort(key, nextDir)
  }

  const getCellValue = (row: T, col: Column<T>): unknown => {
    const keys = (col.key as string).split('.')
    return keys.reduce<unknown>((obj, k) => (obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[k] : undefined), row)
  }

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-border bg-card ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Head */}
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {columns.map(col => (
                <th
                  key={col.key as string}
                  style={{ width: col.width }}
                  onClick={() => handleSort(col)}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground select-none
                    ${col.sortable ? 'cursor-pointer hover:text-foreground transition-colors' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.title}
                    {col.sortable && (
                      <span className="flex flex-col">
                        <ChevronUp
                          size={10}
                          className={sortKey === col.key && sortDir === 'asc' ? 'text-primary' : 'opacity-30'} />
                        <ChevronDown
                          size={10}
                          className={sortKey === col.key && sortDir === 'desc' ? 'text-primary' : 'opacity-30'}
                          style={{ marginTop: '-2px' }} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce"
                           style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-muted-foreground text-sm">
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={getKey(row, idx)}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  {columns.map(col => (
                    <td key={col.key as string} className="px-4 py-3">
                      {col.render
                        ? col.render(getCellValue(row, col), row, idx)
                        : String(getCellValue(row, col) ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer (pagination slot) */}
      {footer && (
        <div className="border-t border-border px-4 py-3">
          {footer}
        </div>
      )}
    </div>
  )
}

export default DataTable
