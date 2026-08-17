import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Eye, RefreshCw, X, ArrowLeftRight, Loader2,
  CheckCircle, Trash2, Printer, Calendar, Tag, Info, Trash,
  ChevronUp, ChevronDown, RotateCcw, DollarSign, Wallet, Truck,
  Warehouse, Filter, Settings, Download, Sliders, AlertCircle
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import ResetButton from '@/components/shared/ResetButton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import TableActionMenu from '@/components/shared/TableActionMenu'
import Breadcrumb from '@/components/common/Breadcrumb'
import { ColumnSettingsPopover } from '@/components/shared/ColumnSettingsPopover'

// Types & Sub-components
import { RETURN_STATUS_BADGE, type PurchaseReturn, type PurchaseReturnItem } from './types/purchaseReturn.types'
import { PurchaseReturnsStatsCards } from './components/PurchaseReturnsStatsCards'
import { PurchaseReturnsFilterDrawer } from './components/PurchaseReturnsFilterDrawer'
import { PurchaseReturnDetailDrawer } from './components/PurchaseReturnDetailDrawer'
import { PurchaseReturnFormSection } from './components/PurchaseReturnFormSection'
import { PurchaseReturnPrintVoucher } from './components/PurchaseReturnPrintVoucher'
import { formatCurrency } from './utils/purchaseCurrency'

const PurchaseReturnsPage: React.FC = () => {
  const { t } = useTranslation(['purchases', 'common'])
  const toast = useToast()
  const qc = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'list' | 'create'>('list')
  const [selectedReturn, setSelectedReturn] = useState<PurchaseReturn | null>(null)
  const [printReturn, setPrintReturn] = useState<PurchaseReturn | null>(null)
  const [approveTarget, setApproveTarget] = useState<PurchaseReturn | null>(null)
  const [cancelTarget, setCancelTarget] = useState<PurchaseReturn | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PurchaseReturn | null>(null)

  const handlePrint = (ret: PurchaseReturn) => {
    setPrintReturn(ret)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  // Column Customization State
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    reference: true,
    poReference: true,
    supplier: true,
    date: true,
    items: true,
    amount: true,
    status: true,
  })

  // Filters state
  const [statusFilter, setStatusFilter] = useState('')
  const [refundStatusFilter, setRefundStatusFilter] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('')
  const [purchaseRefFilter, setPurchaseRefFilter] = useState('')
  const [warehouseFilter, setWarehouseFilter] = useState('')
  const [minReturnAmountFilter, setMinReturnAmountFilter] = useState('')
  const [maxReturnAmountFilter, setMaxReturnAmountFilter] = useState('')
  const [returnDateStartFilter, setReturnDateStartFilter] = useState('')
  const [returnDateEndFilter, setReturnDateEndFilter] = useState('')
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

  const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    reset
  } = useServerPagination({ storageKey: 'purchase-returns' })

  const handleResetFilters = () => {
    setStatusFilter('')
    setRefundStatusFilter('')
    setSupplierFilter('')
    setPurchaseRefFilter('')
    setWarehouseFilter('')
    setMinReturnAmountFilter('')
    setMaxReturnAmountFilter('')
    setReturnDateStartFilter('')
    setReturnDateEndFilter('')
    setCreatedByFilter('')
    reset()
  }

  // Lookups
  const { data: filterSuppliers } = useQuery({
    queryKey: ['filter-suppliers-list'],
    queryFn: () => api.get('/suppliers', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: filterWarehouses } = useQuery({
    queryKey: ['filter-warehouses-list'],
    queryFn: () => api.get('/warehouses', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: filterUsers } = useQuery({
    queryKey: ['filter-users-list'],
    queryFn: () => api.get('/users', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: purchasesData } = useQuery({
    queryKey: ['purchases-for-return-select'],
    queryFn: () => api.get('/purchases', { params: { per_page: 200 } }).then(r => r.data.data ?? []),
  })

  // Create form state
  const [purchaseId, setPurchaseId] = useState('')
  const [reason, setReason] = useState('')
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState('draft')
  const [returnItems, setReturnItems] = useState<any[]>([])

  useEffect(() => {
    const pId = searchParams.get('purchase_id')
    if (pId) {
      setPurchaseId(pId)
      setActiveWorkspaceTab('create')
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const { data: purchaseDetail, isLoading: loadingPurchaseDetails } = useQuery({
    queryKey: ['purchase-detail-for-return', purchaseId],
    queryFn: () => api.get(`/purchases/${purchaseId}`).then(r => r.data.data),
    enabled: !!purchaseId,
  })

  useEffect(() => {
    if (purchaseDetail?.items) {
      const items = purchaseDetail.items.map((item: any) => {
        const ordered = item.quantity || 0
        const received = item.quantity_received || 0
        const alreadyReturned = item.quantity_returned || 0
        const maxReturnable = Math.max(0, received - alreadyReturned)

        return {
          purchase_item_id: item.id,
          product_id: item.product_id,
          product_variant_id: item.product_variant_id,
          product_name: item.product_name ?? item.product?.name ?? `Product #${item.product_id}`,
          variant_name: item.variant?.name,
          sku: item.sku ?? item.product?.sku,
          quantity_ordered: ordered,
          quantity_received: received,
          already_returned: alreadyReturned,
          available_to_return: maxReturnable,
          quantity: '0',
          unit_cost: item.unit_cost,
          notes: ''
        }
      })
      setReturnItems(items)
    } else {
      setReturnItems([])
    }
  }, [purchaseDetail])

  // Returns Query
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [
      'purchase-returns', page, debouncedSearch, perPage, sortBy, sortOrder,
      statusFilter, refundStatusFilter, supplierFilter, purchaseRefFilter,
      warehouseFilter, minReturnAmountFilter, maxReturnAmountFilter,
      returnDateStartFilter, returnDateEndFilter, createdByFilter
    ],
    queryFn: () => api.get('/purchase-returns', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        status: statusFilter || undefined,
        refund_status: refundStatusFilter || undefined,
        supplier_id: supplierFilter || undefined,
        purchase_reference: purchaseRefFilter || undefined,
        warehouse_id: warehouseFilter || undefined,
        min_amount: minReturnAmountFilter || undefined,
        max_amount: maxReturnAmountFilter || undefined,
        return_date_start: returnDateStartFilter || undefined,
        return_date_end: returnDateEndFilter || undefined,
        created_by: createdByFilter || undefined
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const returns: PurchaseReturn[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newReturn: any) => api.post('/purchase-returns', newReturn),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-returns'] })
      qc.invalidateQueries({ queryKey: ['purchases'] })
      toast.success(t('purchases.toast.returnCreatedSuccess', 'Purchase return created successfully.'))
      setActiveWorkspaceTab('list')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('toast.error')),
  })

  const approveMutation = useMutation({
    mutationFn: (id: number) => api.post(`/purchase-returns/${id}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-returns'] })
      qc.invalidateQueries({ queryKey: ['purchases'] })
      toast.success(t('purchases.toast.returnApprovedSuccess', 'Purchase return approved. Inventory updated.'))
      setApproveTarget(null)
      setSelectedReturn(null)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('toast.error')),
  })

  const cancelMutation = useMutation({
    mutationFn: (id: number) => api.post(`/purchase-returns/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-returns'] })
      qc.invalidateQueries({ queryKey: ['purchases'] })
      toast.success(t('purchases.toast.returnCancelledSuccess', 'Purchase return cancelled.'))
      setCancelTarget(null)
      setSelectedReturn(null)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('toast.error')),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/purchase-returns/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-returns'] })
      toast.success(t('purchases.toast.returnDeletedSuccess', 'Purchase return deleted successfully.'))
      setDeleteTarget(null)
      setSelectedReturn(null)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('toast.error')),
  })

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!purchaseId) return

    for (const item of returnItems) {
      const qty = parseFloat(item.quantity) || 0
      if (qty < 0) {
        toast.error('Return quantity cannot be negative.')
        return
      }
      if (qty > item.available_to_return) {
        toast.error(`Return quantity for "${item.product_name}" exceeds available quantity.`)
        return
      }
    }

    const itemsPayload = returnItems
      .map(item => ({
        purchase_item_id: item.purchase_item_id,
        product_id: item.product_id,
        product_variant_id: item.product_variant_id || null,
        quantity: parseFloat(item.quantity) || 0,
        unit_cost: parseFloat(item.unit_cost) || 0,
        notes: item.notes || null
      }))
      .filter(item => item.quantity > 0)

    if (itemsPayload.length === 0) {
      toast.error('Please input a return quantity greater than 0 for at least one item.')
      return
    }

    createMutation.mutate({
      purchase_id: Number(purchaseId),
      date: returnDate,
      reason: reason || null,
      status,
      items: itemsPayload
    })
  }

  const totalReturnValue = returns.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0)

  const columnOptions = [
    { key: 'reference', label: t('purchases.returnReference', 'Return Ref') },
    { key: 'poReference', label: t('purchases.purchaseReference', 'PO Ref') },
    { key: 'supplier', label: t('purchases.supplier', 'Supplier') },
    { key: 'date', label: t('common.date', 'Date') },
    { key: 'items', label: t('purchases.items', 'Items') },
    { key: 'amount', label: t('purchases.totalAmount', 'Amount') },
    { key: 'status', label: t('purchases.status', 'Status') },
  ]

  if (activeWorkspaceTab === 'create') {
    return (
      <div className="space-y-6">
        <PurchaseReturnFormSection
          purchaseId={purchaseId}
          setPurchaseId={setPurchaseId}
          purchasesData={purchasesData || []}
          loadingPurchaseDetails={loadingPurchaseDetails}
          returnDate={returnDate}
          setReturnDate={setReturnDate}
          status={status}
          setStatus={setStatus}
          returnItems={returnItems}
          handleItemQtyChange={(idx, val) => {
            const updated = [...returnItems]
            updated[idx].quantity = val
            setReturnItems(updated)
          }}
          handleItemNotesChange={(idx, val) => {
            const updated = [...returnItems]
            updated[idx].notes = val
            setReturnItems(updated)
          }}
          getReturnTotal={() => returnItems.reduce((acc, item) => acc + ((parseFloat(item.quantity) || 0) * (item.unit_cost || 0)), 0)}
          reason={reason}
          setReason={setReason}
          isSubmitting={createMutation.isPending}
          onSubmit={handleCreateSubmit}
          onCancel={() => setActiveWorkspaceTab('list')}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="print:hidden space-y-2">
        <Breadcrumb items={[{ label: t('nav.purchaseManagement', 'Purchase Management') }, { label: t('nav.purchaseReturns', 'Purchase Returns') }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-xs">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <RotateCcw className="h-6 w-6 text-primary" />
              {t('purchases.purchaseReturns', 'Purchase Returns (Debit Notes)')}
            </h1>
            <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
              {t('purchases.returnSubtitle', 'Return damaged or excess goods back to vendor and adjust inventory')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setPurchaseId('')
              setReturnItems([])
              setReason('')
              setStatus('draft')
              setActiveWorkspaceTab('create')
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 shadow-xs transition-all cursor-pointer"
          >
            <Plus size={16} />
            {t('purchases.createReturn', 'Create Return')}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <PurchaseReturnsStatsCards returns={returns} totalAmount={totalReturnValue} />

      {/* Search & Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-xs print:hidden">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[280px] sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t('purchases.searchReturnsPlaceholder', 'Search Return Ref, PO Ref, Supplier...')}
              className="form-input pl-9 w-full text-xs rounded-xl border border-border bg-card text-foreground"
            />
          </div>

          <button
            type="button"
            onClick={() => setFilterDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted transition-colors cursor-pointer shadow-xs"
          >
            <Filter size={14} />
            <span>{t('common.filter', 'Filter')}</span>
          </button>

          <ResetButton onClick={handleResetFilters} label={t('common.reset', 'Reset')} />
        </div>

        <div className="flex items-center gap-2 self-end lg:self-auto">
          <ColumnSettingsPopover
            columns={columnOptions}
            visibleColumns={visibleColumns}
            onChange={setVisibleColumns}
          />

          <button
            type="button"
            onClick={() => refetch()}
            className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-xs cursor-pointer"
            title={t('common.refresh', 'Refresh')}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden print:hidden">
        <TableWrapper isFetching={isFetching}>
          <table className="w-full data-table">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {visibleColumns.reference !== false && (
                  <th onClick={() => handleSort('reference_number')} className="text-left cursor-pointer hover:bg-muted py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                    {t('purchases.returnReference', 'Return Ref')} {renderSortIcon('reference_number')}
                  </th>
                )}
                {visibleColumns.poReference !== false && (
                  <th className="text-left py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                    {t('purchases.purchaseReference', 'PO Ref')}
                  </th>
                )}
                {visibleColumns.supplier !== false && (
                  <th onClick={() => handleSort('supplier_id')} className="text-left cursor-pointer hover:bg-muted py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                    {t('purchases.supplier', 'Supplier')} {renderSortIcon('supplier_id')}
                  </th>
                )}
                {visibleColumns.date !== false && (
                  <th onClick={() => handleSort('date')} className="text-left cursor-pointer hover:bg-muted py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                    {t('common.date', 'Date')} {renderSortIcon('date')}
                  </th>
                )}
                {visibleColumns.items !== false && (
                  <th className="text-left py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                    {t('purchases.items', 'Items')}
                  </th>
                )}
                {visibleColumns.amount !== false && (
                  <th onClick={() => handleSort('total_amount')} className="text-left cursor-pointer hover:bg-muted py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                    {t('purchases.totalAmount', 'Amount ($)')} {renderSortIcon('total_amount')}
                  </th>
                )}
                {visibleColumns.status !== false && (
                  <th onClick={() => handleSort('status')} className="text-left cursor-pointer hover:bg-muted py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                    {t('purchases.status', 'Status')} {renderSortIcon('status')}
                  </th>
                )}
                <th className="sticky right-0 z-10 bg-background border-l border-border text-center py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap min-w-[96px]">{t('common.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {visibleColumns.reference !== false && <td className="p-4"><div className="skeleton h-4 w-24 rounded" /></td>}
                    {visibleColumns.poReference !== false && <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>}
                    {visibleColumns.supplier !== false && <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>}
                    {visibleColumns.date !== false && <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>}
                    {visibleColumns.items !== false && <td className="p-4"><div className="skeleton h-4 w-12 rounded" /></td>}
                    {visibleColumns.amount !== false && <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>}
                    {visibleColumns.status !== false && <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>}
                    <td className="p-4"><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : returns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground text-sm">
                    <RotateCcw size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground text-sm font-medium">{t('purchases.noReturnsFound', 'No purchase returns found.')}</p>
                  </td>
                </tr>
              ) : (
                returns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-muted/30 transition-colors group cursor-pointer" onClick={() => setSelectedReturn(ret)}>
                    {visibleColumns.reference !== false && (
                      <td className="py-3 px-4 font-mono font-bold text-xs text-primary whitespace-nowrap">
                        {ret.reference_number}
                      </td>
                    )}
                    {visibleColumns.poReference !== false && (
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {ret.purchase?.reference_number ?? '—'}
                      </td>
                    )}
                    {visibleColumns.supplier !== false && (
                      <td className="py-3 px-4 text-xs font-semibold text-foreground whitespace-nowrap">
                        {ret.supplier?.name ?? '—'}
                      </td>
                    )}
                    {visibleColumns.date !== false && (
                      <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {ret.date ? new Date(ret.date).toLocaleDateString() : (ret.created_at ? new Date(ret.created_at).toLocaleDateString() : '—')}
                      </td>
                    )}
                    {visibleColumns.items !== false && (
                      <td className="py-3 px-4 text-xs text-foreground font-semibold font-mono whitespace-nowrap">
                        {ret.items?.length || 0}
                      </td>
                    )}
                    {visibleColumns.amount !== false && (
                      <td className="py-3 px-4 font-mono font-bold text-xs text-foreground whitespace-nowrap">
                        ${Number(ret.total_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    )}
                    {visibleColumns.status !== false && (
                      <td className="py-3 px-4 whitespace-nowrap text-xs font-bold">
                        <span className={RETURN_STATUS_BADGE[ret.status] || 'px-2 py-0.5 rounded text-[11px] bg-muted'}>
                          {ret.status === 'completed' || ret.status === 'approved'
                            ? t('purchases.approved', 'Approved')
                            : ret.status === 'cancelled'
                            ? t('purchases.cancelled', 'Cancelled')
                            : t('purchases.draft', 'Draft')}
                        </span>
                      </td>
                    )}
                    <td className="sticky right-0 z-10 bg-background group-hover:bg-muted border-l border-border py-3 px-4 text-center whitespace-nowrap min-w-[96px]" onClick={(e) => e.stopPropagation()}>
                      <TableActionMenu
                        onView={() => setSelectedReturn(ret)}
                        onPrint={() => handlePrint(ret)}
                        onDelete={ret.status === 'draft' ? () => setDeleteTarget(ret) : undefined}
                      />
                    </td>
                  </tr>
                ))
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
      <PurchaseReturnDetailDrawer
        selectedReturn={selectedReturn}
        onClose={() => setSelectedReturn(null)}
        onOpenApprove={(r) => setApproveTarget(r)}
        onOpenCancel={(r) => setCancelTarget(r)}
      />

      {/* Filter Drawer */}
      <PurchaseReturnsFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        suppliers={filterSuppliers || []}
        warehouses={filterWarehouses || []}
        users={filterUsers || []}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        supplierFilter={supplierFilter}
        setSupplierFilter={setSupplierFilter}
        warehouseFilter={warehouseFilter}
        setWarehouseFilter={setWarehouseFilter}
        minReturnAmountFilter={minReturnAmountFilter}
        setMinReturnAmountFilter={setMinReturnAmountFilter}
        maxReturnAmountFilter={maxReturnAmountFilter}
        setMaxReturnAmountFilter={setMaxReturnAmountFilter}
        returnDateStartFilter={returnDateStartFilter}
        setReturnDateStartFilter={setReturnDateStartFilter}
        returnDateEndFilter={returnDateEndFilter}
        setReturnDateEndFilter={setReturnDateEndFilter}
        createdByFilter={createdByFilter}
        setCreatedByFilter={setCreatedByFilter}
        onReset={handleResetFilters}
        setPage={setPage}
      />

      {/* Approve Confirm Dialog */}
      <ConfirmDialog
        open={!!approveTarget}
        onCancel={() => setApproveTarget(null)}
        onConfirm={() => {
          if (approveTarget) approveMutation.mutate(approveTarget.id)
        }}
        title={t('purchases.approveReturnTitle', 'Approve Purchase Return')}
        message={t('purchases.confirmApproveReturnMessage', {
          ref: approveTarget?.reference_number,
          defaultValue: `Are you sure you want to approve Return "${approveTarget?.reference_number}"? Inventory will be debited immediately.`
        })}
        confirmText={t('purchases.approve', 'Approve')}
        loading={approveMutation.isPending}
        variant="warning"
      />

      {/* Cancel Confirm Dialog */}
      <ConfirmDialog
        open={!!cancelTarget}
        onCancel={() => setCancelTarget(null)}
        onConfirm={() => {
          if (cancelTarget) cancelMutation.mutate(cancelTarget.id)
        }}
        title={t('purchases.cancelReturnTitle', 'Cancel Purchase Return')}
        message={t('purchases.confirmCancelReturnMessage', {
          ref: cancelTarget?.reference_number,
          defaultValue: `Are you sure you want to cancel Return "${cancelTarget?.reference_number}"?`
        })}
        confirmText={t('purchases.cancel', 'Cancel Return')}
        loading={cancelMutation.isPending}
        variant="danger"
      />

      {/* Single Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id)
        }}
        title={t('purchases.deletePurchaseReturn', 'Delete Purchase Return')}
        message={t('purchases.confirmDeleteReturnMessage', {
          ref: deleteTarget?.reference_number,
          defaultValue: `Are you sure you want to delete Return "${deleteTarget?.reference_number}"? This action cannot be undone.`
        })}
        confirmText={t('common.delete', 'Delete')}
        loading={deleteMutation.isPending}
        variant="danger"
      />

      {/* Hidden Print Voucher */}
      {printReturn && <PurchaseReturnPrintVoucher returnData={printReturn} />}
    </div>
  )
}

export default PurchaseReturnsPage
