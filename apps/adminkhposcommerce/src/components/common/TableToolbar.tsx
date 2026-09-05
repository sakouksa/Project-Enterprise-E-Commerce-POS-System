import React from 'react'
import { useTranslation } from 'react-i18next'
import SearchInput from '@/components/shared/SearchInput'
import {
  FilterButton,
  ResetButton,
  RefreshButton,
} from './GlobalActionButtons'
import ColumnSettingsPopover, {
  type ColumnOption,
} from '@/components/shared/ColumnSettingsPopover'

export interface TableToolbarProps {
  /** Search value */
  search?: string
  /** Handler when search input changes */
  onSearchChange?: (value: string) => void
  /** Custom placeholder for search input (or i18n key) */
  searchPlaceholder?: string
  /** Whether search input is disabled */
  searchDisabled?: boolean
  /** Custom class for search container */
  searchClassName?: string
  /** Hide search input */
  hideSearch?: boolean

  /** Handler when clicking Filter button (e.g. opens filter drawer / modal) */
  onFilterClick?: (e?: React.MouseEvent) => void
  /** Whether any filter is active (highlights filter button) */
  isFilterActive?: boolean
  /** Number of active filters to display as a badge */
  filterActiveCount?: number
  /** Custom label for filter button */
  filterLabel?: string
  /** Whether filter button is disabled */
  filterDisabled?: boolean
  /** Hide filter button */
  hideFilterButton?: boolean

  /** Handler when clicking Reset button ("កំណត់ឡើងវិញ" / "Reset") */
  onReset?: (e?: React.MouseEvent) => void
  /** Custom label for reset button */
  resetLabel?: string
  /** Tooltip/Title for reset button */
  resetTitle?: string
  /** Whether reset button is disabled */
  resetDisabled?: boolean
  /** Whether reset button should only show icon */
  resetIconOnly?: boolean
  /** Hide reset button */
  hideResetButton?: boolean

  /** Handler when clicking Refresh icon button */
  onRefresh?: (e?: React.MouseEvent) => void
  /** Whether refresh query is loading/fetching (spins icon) */
  refreshLoading?: boolean
  /** Whether refresh button is disabled */
  refreshDisabled?: boolean
  /** Tooltip/Title for refresh button */
  refreshTitle?: string
  /** Hide refresh button */
  hideRefreshButton?: boolean

  /** Column definitions for column visibility settings */
  columns?: ColumnOption[]
  /** Current column visibility map */
  visibleColumns?: Record<string, boolean>
  /** Handler when column visibility map changes */
  onColumnChange?: (updated: Record<string, boolean>) => void
  /** Default visible columns map for reset action */
  defaultVisibleColumns?: Record<string, boolean>
  /** Custom title for column settings popover */
  columnSettingsTitle?: string
  /** Hide column settings popover */
  hideColumnSettings?: boolean

  /** Additional actions/components to render on the left side */
  leftActions?: React.ReactNode
  /** Additional actions/components to render on the right side (e.g. view mode switcher, export, print) */
  rightActions?: React.ReactNode
  /** Children to render inside toolbar */
  children?: React.ReactNode

  /** Custom root className */
  className?: string
  /** Custom left container className */
  leftClassName?: string
  /** Custom right container className */
  rightClassName?: string
  /** Size variant for toolbar elements */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Standard Global Table Toolbar Component.
 * Provides unified Search Input, Filter Button, Reset Button, Refresh Button, and Column Settings Popover.
 * Responsive, dark/light mode harmonized, and fully customizable.
 */
export const TableToolbar: React.FC<TableToolbarProps> = ({
  search,
  onSearchChange,
  searchPlaceholder,
  searchDisabled = false,
  searchClassName = '',
  hideSearch = false,

  onFilterClick,
  isFilterActive = false,
  filterActiveCount,
  filterLabel,
  filterDisabled = false,
  hideFilterButton = false,

  onReset,
  resetLabel,
  resetTitle,
  resetDisabled = false,
  resetIconOnly = false,
  hideResetButton = false,

  onRefresh,
  refreshLoading = false,
  refreshDisabled = false,
  refreshTitle,
  hideRefreshButton = false,

  columns,
  visibleColumns,
  onColumnChange,
  defaultVisibleColumns,
  columnSettingsTitle,
  hideColumnSettings = false,

  leftActions,
  rightActions,
  children,

  className = '',
  leftClassName = '',
  rightClassName = '',
  size = 'md',
}) => {
  const { t } = useTranslation(['common'])

  const showLeft =
    (!hideSearch && onSearchChange !== undefined && search !== undefined) ||
    (!hideFilterButton && onFilterClick !== undefined) ||
    (!hideResetButton && onReset !== undefined) ||
    Boolean(leftActions)

  const showRight =
    (!hideRefreshButton && onRefresh !== undefined) ||
    (!hideColumnSettings && columns && visibleColumns && onColumnChange) ||
    Boolean(rightActions)

  return (
    <div
      className={`flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-card p-4 rounded-xl border border-border shadow-xs print:hidden transition-all duration-200 ${className}`}
    >
      {/* Left Section: Search, Filters, Reset & Custom Left Actions */}
      {showLeft && (
        <div
          className={`flex flex-wrap items-center gap-3 w-full lg:w-auto flex-1 min-w-0 ${leftClassName}`}
        >
          {/* Global Search Input */}
          {!hideSearch && onSearchChange !== undefined && search !== undefined && (
            <SearchInput
              value={search}
              onChange={onSearchChange}
              placeholder={searchPlaceholder || t('common.search', 'Search...')}
              disabled={searchDisabled}
              size={size}
              className={searchClassName}
            />
          )}

          {/* Global Filter Trigger Button */}
          {!hideFilterButton && onFilterClick !== undefined && (
            <FilterButton
              onClick={onFilterClick}
              isActive={isFilterActive}
              activeCount={filterActiveCount}
              label={filterLabel}
              disabled={filterDisabled}
              size={size}
            />
          )}

          {/* Global Reset Action Button */}
          {!hideResetButton && onReset !== undefined && (
            <ResetButton
              onClick={onReset}
              label={resetLabel}
              title={resetTitle}
              disabled={resetDisabled}
              iconOnly={resetIconOnly}
              size={size}
            />
          )}

          {/* Extra Left Action Slots */}
          {leftActions}
        </div>
      )}

      {/* Children slot between or alongside */}
      {children}

      {/* Right Section: Refresh Button, Column Settings & Custom Right Actions */}
      {showRight && (
        <div
          className={`flex items-center gap-2 w-full lg:w-auto justify-end shrink-0 ${rightClassName}`}
        >
          {/* Custom Right Action Slots */}
          {rightActions}

          {/* Global Refresh Action Button */}
          {!hideRefreshButton && onRefresh !== undefined && (
            <RefreshButton
              onClick={onRefresh}
              loading={refreshLoading}
              disabled={refreshDisabled}
              title={refreshTitle || t('common.refresh', 'Refresh')}
              size={size}
            />
          )}

          {/* Global Column Settings Popover */}
          {!hideColumnSettings &&
            columns &&
            visibleColumns &&
            onColumnChange && (
              <ColumnSettingsPopover
                columns={columns}
                visibleColumns={visibleColumns}
                onChange={onColumnChange}
                defaultVisibleColumns={defaultVisibleColumns}
                title={columnSettingsTitle}
                size={size}
              />
            )}
        </div>
      )}
    </div>
  )
}

export const TableFilterToolbar = TableToolbar
export const DataTableToolbar = TableToolbar
export const SearchFilterToolbar = TableToolbar

export default TableToolbar
