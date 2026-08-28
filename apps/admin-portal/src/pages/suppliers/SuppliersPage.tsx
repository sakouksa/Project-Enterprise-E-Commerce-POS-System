import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X, Truck, ToggleLeft, ToggleRight,
  Loader2, Eye, Mail, Phone, MapPin, DollarSign, BookOpen, Building,
  ChevronUp, ChevronDown, TrendingUp, ShoppingCart, Wallet, Filter,
  Settings, Download, Printer, ArrowLeft, Calendar, Award, AlertCircle
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import ResetButton from '@/components/shared/ResetButton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import TableActionMenu from '@/components/shared/TableActionMenu'
import Breadcrumb from '@/components/common/Breadcrumb'
import StatusBadge from '@/components/common/StatusBadge'
import ColumnSettingsPopover from '@/components/shared/ColumnSettingsPopover'

// Types & Sub-components
import { type Supplier } from './types/supplier.types'
import { SuppliersStatsCards } from './components/SuppliersStatsCards'
import { SuppliersFilterDrawer } from './components/SuppliersFilterDrawer'
import { SupplierDetailDrawer } from './components/SupplierDetailDrawer'

const SuppliersPage: React.FC = () => {
  const { t } = useTranslation(['suppliers', 'common', 'nav'])
  const navigate = useNavigate()
  const qc    = useQueryClient()
  const toast = useToast()

  const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    reset,
  } = useServerPagination({ storageKey: 'suppliers' })

  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)

  // Column Customization State
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    code: true,
    contacts: true,
    location: true,
    taxNumber: true,
    status: true,
  })


  // Filters State
  const [statusFilter, setStatusFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [createdByFilter, setCreatedByFilter] = useState('')
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
  }

  const handleResetFilters = () => {
    setStatusFilter('')
    setCountryFilter('')
    setCityFilter('')
    setCreatedByFilter('')
    setSelectedRows([])
    reset()
  }

  const { data: users } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => api.get('/users', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: reportData } = useQuery({
    queryKey: ['purchase-dashboard-stats'],
    queryFn: () => api.get('/purchase-report').then(r => r.data.data),
  })

  // Suppliers Query
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [
      'suppliers', page, debouncedSearch, perPage, sortBy, sortOrder,
      statusFilter, countryFilter, cityFilter, createdByFilter
    ],
    queryFn: () => api.get('/suppliers', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        status: statusFilter !== '' ? statusFilter : undefined,
        is_active: statusFilter !== '' ? statusFilter : undefined,
        country: countryFilter || undefined,
        city: cityFilter || undefined,
        created_by: createdByFilter || undefined
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const suppliers: Supplier[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Selection Handlers
  const isAllSelected = suppliers.length > 0 && suppliers.every(s => selectedRows.includes(s.id))
  const isSomeSelected = suppliers.some(s => selectedRows.includes(s.id)) && !isAllSelected

  const handleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = new Set(suppliers.map(s => s.id))
      setSelectedRows(prev => prev.filter(id => !pageIds.has(id)))
    } else {
      const pageIds = suppliers.map(s => s.id)
      setSelectedRows(prev => Array.from(new Set([...prev, ...pageIds])))
    }
  }

  const handleSelectRow = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/suppliers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      qc.invalidateQueries({ queryKey: ['suppliers-list'] })
      toast.success(t('suppliers.toast.deleteSuccess', 'Supplier deleted successfully.'))
      setDeleteTarget(null)
      setSelectedRows(prev => prev.filter(id => id !== deleteTarget?.id))
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('common.error', 'Failed to delete supplier.'))
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => api.post('/suppliers/bulk-delete', { ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      qc.invalidateQueries({ queryKey: ['suppliers-list'] })
      toast.success(t('suppliers.bulkDeleteSuccess', 'Selected suppliers deleted successfully.'))
      setSelectedRows([])
      setBulkDeleteConfirmOpen(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('suppliers.bulkDeleteError', 'Failed to delete selected suppliers.'))
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="print:hidden space-y-2">
        <Breadcrumb items={[{ label: t('nav.purchaseManagement', 'Purchase Management') }, { label: t('nav.suppliers', 'Suppliers') }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              {t('suppliers.title', 'Supplier Directory')}
            </h1>
            <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
              {t('suppliers.subtitle', 'Manage enterprise vendor relationships, logistics points of contact, credit terms, and banking information.')}
            </p>
          </div>
          <button
            onClick={() => navigate('/suppliers/create')}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            {t('suppliers.addSupplier', 'Add Supplier')}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <SuppliersStatsCards suppliers={suppliers} reportData={reportData} />

      {/* Bulk Actions Panel (like Categories page) */}
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-3.5 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 rounded-2xl shadow-xs animate-in fade-in slide-in-from-top-2 duration-200 print:hidden">
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
            <AlertCircle size={16} />
            <span>{selectedRows.length} {t('suppliers.selectedCount', 'selected')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBulkDeleteConfirmOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl cursor-pointer transition-colors shadow-xs"
            >
              <Trash2 size={13} />
              {t('suppliers.deleteSelected', 'Delete Selected')}
            </button>
            <button
              onClick={() => setSelectedRows([])}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 cursor-pointer font-medium"
            >
              {t('common.cancel', 'Cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Search & Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-sm print:hidden">
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto flex-1">
          <div className="relative min-w-[280px] sm:min-w-[340px] md:w-96 max-w-md flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t('suppliers.searchPlaceholder', 'Search Supplier Name, Code, Phone, Email, Company...')}
              className="w-full h-10 pl-10 pr-9 text-xs sm:text-sm rounded-xl border border-border bg-card hover:border-muted-foreground/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all placeholder:text-muted-foreground shadow-sm font-medium"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
                type="button"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setFilterDrawerOpen(true)}
            className={`inline-flex items-center gap-2 h-10 px-3.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer select-none shrink-0 ${
              (statusFilter || countryFilter)
                ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/15'
                : 'border-border bg-card hover:bg-muted/80 text-foreground'
            }`}
          >
            <Filter size={15} className={(statusFilter || countryFilter) ? 'text-primary' : 'text-muted-foreground'} />
            <span>{t('suppliers.filter', 'Filter')}</span>
            {(statusFilter || countryFilter) && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>

          <ResetButton onClick={handleResetFilters} label={t('suppliers.reset', 'Reset')} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => refetch()}
            className="h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-muted/80 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer shrink-0"
            title={t('common.refresh', 'Refresh')}
          >
            <RefreshCw size={15} />
          </button>
          <ColumnSettingsPopover
            columns={[
              { key: 'name', label: t('suppliers.tableSupplier', 'Supplier') },
              { key: 'code', label: t('suppliers.tableCode', 'Code') },
              { key: 'contacts', label: t('suppliers.tableContacts', 'Contacts') },
              { key: 'location', label: t('suppliers.tableLocation', 'Location') },
              { key: 'taxNumber', label: t('suppliers.tableTaxNumber', 'Tax Number') },
              { key: 'status', label: t('suppliers.tableStatus', 'Status') },
            ]}
            visibleColumns={visibleColumns}
            onChange={(cols) => setVisibleColumns(cols)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden print:hidden">
        <TableWrapper isFetching={isFetching}>
          <table className="w-full data-table">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="w-10 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected
                    }}
                    onChange={handleSelectAll}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    aria-label="Select all suppliers"
                  />
                </th>
                {visibleColumns.name !== false && (
                  <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                    {t('suppliers.tableSupplier', 'Supplier')} {renderSortIcon('name')}
                  </th>
                )}
                {visibleColumns.code !== false && (
                  <th onClick={() => handleSort('code')} className="text-left cursor-pointer hover:bg-muted py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                    {t('suppliers.tableCode', 'Code')} {renderSortIcon('code')}
                  </th>
                )}
                {visibleColumns.contacts !== false && (
                  <th className="text-left py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                    {t('suppliers.tableContacts', 'Contacts')}
                  </th>
                )}
                {visibleColumns.location !== false && (
                  <th onClick={() => handleSort('city')} className="text-left cursor-pointer hover:bg-muted py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                    {t('suppliers.tableLocation', 'Location')} {renderSortIcon('city')}
                  </th>
                )}
                {visibleColumns.taxNumber !== false && (
                  <th className="text-left py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                    {t('suppliers.tableTaxNumber', 'Tax Number')}
                  </th>
                )}
                {visibleColumns.status !== false && (
                  <th onClick={() => handleSort('is_active')} className="text-left cursor-pointer hover:bg-muted py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                    {t('suppliers.tableStatus', 'Status')} {renderSortIcon('is_active')}
                  </th>
                )}
                <th className="sticky right-0 z-10 bg-background border-l border-border text-center py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap min-w-[96px]">
                  {t('suppliers.tableActions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-4 text-center"><div className="skeleton h-4 w-4 rounded mx-auto" /></td>
                    {visibleColumns.name !== false && <td className="p-4"><div className="skeleton h-4 w-32 rounded" /></td>}
                    {visibleColumns.code !== false && <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>}
                    {visibleColumns.contacts !== false && <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>}
                    {visibleColumns.location !== false && <td className="p-4"><div className="skeleton h-4 w-36 rounded" /></td>}
                    {visibleColumns.taxNumber !== false && <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>}
                    {visibleColumns.status !== false && <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>}
                    <td className="p-4"><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={2 + Object.values(visibleColumns).filter(Boolean).length} className="py-16 text-center text-muted-foreground text-sm">
                    {t('suppliers.noSuppliersFound', 'No suppliers found.')}
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => {
                  const isSelected = selectedRows.includes(supplier.id)
                  return (
                    <tr
                      key={supplier.id}
                      className={`hover:bg-muted/30 transition-colors group cursor-pointer ${
                        isSelected ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                      onClick={() => setViewSupplier(supplier)}
                    >
                      <td className="w-10 px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(supplier.id)}
                          className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                          aria-label={`Select supplier ${supplier.name}`}
                        />
                      </td>
                      {visibleColumns.name !== false && (
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Truck size={15} className="text-primary shrink-0" />
                            <span className="font-bold text-foreground text-xs">{supplier.name}</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.code !== false && (
                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {supplier.code}
                        </td>
                      )}
                      {visibleColumns.contacts !== false && (
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          <div className="space-y-0.5">
                            {supplier.email && <div className="flex items-center gap-1"><Mail size={11} /> {supplier.email}</div>}
                            {supplier.phone && <div className="flex items-center gap-1"><Phone size={11} /> {supplier.phone}</div>}
                          </div>
                        </td>
                      )}
                      {visibleColumns.location !== false && (
                        <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                          {supplier.city ? `${supplier.city}, ${supplier.country || ''}` : supplier.address || '—'}
                        </td>
                      )}
                      {visibleColumns.taxNumber !== false && (
                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {supplier.tax_number || '—'}
                        </td>
                      )}
                      {visibleColumns.status !== false && (
                        <td className="py-3 px-4 whitespace-nowrap text-xs font-bold">
                          <StatusBadge status={supplier.is_active} />
                        </td>
                      )}
                      <td className="sticky right-0 z-10 bg-background group-hover:bg-muted border-l border-border py-3 px-4 text-center whitespace-nowrap min-w-[96px]" onClick={(e) => e.stopPropagation()}>
                        <TableActionMenu
                          onView={() => setViewSupplier(supplier)}
                          onEdit={() => navigate(`/suppliers/${supplier.id}/edit`)}
                          onDelete={() => setDeleteTarget(supplier)}
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
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          total={pagination.total}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
        />
      </div>

      {/* Detail Drawer */}
      <SupplierDetailDrawer
        supplier={viewSupplier}
        onClose={() => setViewSupplier(null)}
        onOpenEdit={(s) => navigate(`/suppliers/${s.id}/edit`)}
      />

      {/* Filter Drawer */}
      <SuppliersFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
        users={users || []}
        createdByFilter={createdByFilter}
        setCreatedByFilter={setCreatedByFilter}
        onReset={handleResetFilters}
        setPage={setPage}
      />

      {/* Single Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="suppliers.deleteTitle"
        itemName={deleteTarget?.name}
        confirmText="common.confirmDelete"
        cancelText="common.cancel"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        title={t('suppliers.bulkDeleteConfirmTitle', 'Delete Selected Suppliers')}
        message={t('suppliers.bulkDeleteConfirmMessage', `Are you sure you want to permanently delete ${selectedRows.length} selected suppliers? This action cannot be undone.`, { count: selectedRows.length })}
        confirmText={t('suppliers.deleteSelected', 'Delete Selected')}
        cancelText={t('common.cancel', 'Cancel')}
        loading={bulkDeleteMutation.isPending}
        onConfirm={() => bulkDeleteMutation.mutate(selectedRows)}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
        variant="danger"
      />
    </div>
  )
}

export default SuppliersPage
