import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Eye, RefreshCw, X, Package, ArrowLeftRight, CheckCircle, AlertTriangle, Loader2, RotateCcw, FilterX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'

interface InventoryItem {
  id: number
  product?: { name: string; sku: string }
  warehouse?: { name: string }
  stock_qty: number
  min_stock_qty: number
}

interface StockAdjustment {
  id: number
  product?: { name: string; sku: string }
  warehouse?: { name: string }
  quantity: number
  type: string
  notes?: string
  status: string
  created_at: string
}

interface StockTransfer {
  id: number
  from_warehouse?: { name: string }
  to_warehouse?: { name: string }
  status: string
  created_at: string
}

interface StockOpname {
  id: number
  warehouse?: { name: string }
  status: string
  created_at: string
}

const InventoryPage: React.FC<{ tab?: string }> = ({ tab }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const qc = useQueryClient()
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
    adjustAfterDelete,
  } = useServerPagination({ storageKey: `inventory_${tab || 'levels'}` })

  const [modalOpen, setModalOpen] = useState(false)

  // Form states (stock adjustment / transfer / opname)
  const [productId, setProductId] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [toWarehouseId, setToWarehouseId] = useState('')
  const [qty, setQty] = useState('')
  const [type, setType] = useState('addition') // addition or subtraction
  const [notes, setNotes] = useState('')

  // Queries
  const { data: products } = useQuery({
    queryKey: ['products-list'],
    queryFn: () => api.get('/products').then(r => r.data.data),
  })

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses-list'],
    queryFn: () => api.get('/warehouses').then(r => r.data.data),
  })

  // Tab-specific queries
  const { data: stockLevels, isLoading: loadingLevels, isFetching: fetchingLevels } = useQuery({
    queryKey: ['inventory-levels', page, debouncedSearch, perPage],
    queryFn: () => api.get('/inventory', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
    enabled: !tab,
  })

  const { data: adjustmentsData, isLoading: loadingAdjustments, isFetching: fetchingAdjustments } = useQuery({
    queryKey: ['inventory-adjustments', page, debouncedSearch, perPage],
    queryFn: () => api.get('/stock-adjustments', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
    enabled: tab === 'adjustments',
  })

  const { data: transfersData, isLoading: loadingTransfers, isFetching: fetchingTransfers } = useQuery({
    queryKey: ['inventory-transfers', page, debouncedSearch, perPage],
    queryFn: () => api.get('/stock-transfers', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
    enabled: tab === 'transfers',
  })

  const { data: opnamesData, isLoading: loadingOpnames, isFetching: fetchingOpnames } = useQuery({
    queryKey: ['inventory-opnames', page, debouncedSearch, perPage],
    queryFn: () => api.get('/stock-opnames', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
    enabled: tab === 'opnames',
  })

  const { data: movementsData, isLoading: loadingMovements, isFetching: fetchingMovements } = useQuery({
    queryKey: ['inventory-movements-list', page, debouncedSearch, perPage],
    queryFn: () => api.get('/inventory-movements', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
    enabled: tab === 'movements',
  })

  const isFetching = fetchingLevels || fetchingAdjustments || fetchingTransfers || fetchingOpnames || fetchingMovements
  const isLoading = loadingLevels || loadingAdjustments || loadingTransfers || loadingOpnames || loadingMovements

  // Mutations
  const adjustMutation = useMutation({
    mutationFn: (payload: any) => api.post('/stock-adjustments', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-adjustments'] })
      closeModal()
      toast.success('Stock adjustment created successfully.')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'Failed to create adjustment.'
      toast.error(msg)
    },
  })

  const transferMutation = useMutation({
    mutationFn: (payload: any) => api.post('/stock-transfers', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-transfers'] })
      closeModal()
      toast.success('Stock transfer created successfully.')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'Failed to create stock transfer.'
      toast.error(msg)
    },
  })

  const opnameMutation = useMutation({
    mutationFn: (payload: any) => api.post('/stock-opnames', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-opnames'] })
      closeModal()
      toast.success('Stock opname created successfully.')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'Failed to create stock opname.'
      toast.error(msg)
    },
  })

  const openModal = () => {
    setProductId('')
    setWarehouseId('')
    setToWarehouseId('')
    setQty('')
    setType('addition')
    setNotes('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const resetFilters = () => {
    setSearch('')
    setPage(1)
  }

  const handleSubmitAdjustment = (e: React.FormEvent) => {
    e.preventDefault()
    adjustMutation.mutate({
      company_id: 1,
      product_id: parseInt(productId),
      warehouse_id: parseInt(warehouseId),
      quantity: parseFloat(qty),
      type,
      notes,
    })
  }

  const handleSubmitTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    const fromId = parseInt(warehouseId)
    const toId = parseInt(toWarehouseId)
    if (fromId === toId) {
      toast.error(t('The from warehouse and to warehouse must be different.'))
      return
    }
    transferMutation.mutate({
      company_id: 1,
      from_warehouse_id: fromId,
      to_warehouse_id: toId,
      items: [
        {
          product_id: parseInt(productId),
          quantity: parseFloat(qty),
        }
      ],
      notes,
    })
  }

  const handleSubmitOpname = (e: React.FormEvent) => {
    e.preventDefault()
    opnameMutation.mutate({
      company_id: 1,
      warehouse_id: parseInt(warehouseId),
      date: new Date().toISOString().split('T')[0],
      notes,
    })
  }

  const getPagination = () => {
    if (!tab) return stockLevels?.pagination
    if (tab === 'adjustments') return adjustmentsData?.pagination
    if (tab === 'transfers') return transfersData?.pagination
    if (tab === 'opnames') return opnamesData?.pagination
    if (tab === 'movements') return movementsData?.pagination
    return null
  }

  const pagination = getPagination() ?? { total: 0, current_page: 1, last_page: 1 }

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: t('Inventory') },
          {
            label: !tab ? t('Stock Levels') :
              tab === 'adjustments' ? t('Stock Adjustments') :
                tab === 'transfers' ? t('Stock Transfers') :
                  tab === 'opnames' ? t('Stock Opnames') :
                    t('Stock Ledger (Movements)')
          }
        ]}
      />

      {/* Workspace Tabs */}
      <div className="flex border-b border-border bg-card rounded-t-xl px-4 overflow-x-auto gap-2">
        {[
          { id: 'levels', label: t('Stock Levels'), icon: <Package size={14} />, path: '/inventory' },
          { id: 'adjustments', label: t('Stock Adjustments'), icon: <Plus size={14} />, path: '/inventory/adjustments' },
          { id: 'transfers', label: t('Stock Transfers'), icon: <ArrowLeftRight size={14} />, path: '/inventory/transfers' },
          { id: 'opnames', label: t('Stock Opnames'), icon: <CheckCircle size={14} />, path: '/inventory/opnames' },
          { id: 'movements', label: t('Stock Ledger (Movements)'), icon: <RefreshCw size={14} />, path: '/inventory/movements' },
        ].map(item => {
          const isActive = (!tab && item.id === 'levels') || tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { reset(); navigate(item.path); }}
              className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 -mb-[2px] transition-colors whitespace-nowrap
                          ${isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Header */}
      <PageHeader
        title={
          !tab ? t('Stock Levels') :
            tab === 'adjustments' ? t('Stock Adjustments') :
              tab === 'transfers' ? t('Stock Transfers') :
                tab === 'opnames' ? t('Stock Opnames') :
                  t('Stock Ledger (Movements)')
        }
        subtitle={t('Manage product storage distribution, track inventory levels, and process corrections')}
        action={
          (tab && tab !== 'movements') && (
            <button
              onClick={openModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                         bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus size={16} />
              {tab === 'adjustments' ? t('New Adjustment') :
                tab === 'transfers' ? t('New Transfer') :
                  t('Record Opname')}
            </button>
          )
        }
      />

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder={t('common.search')} />
          <ResetButton onClick={reset} label={t("common.reset")} />
        </div>
      </div>

      {/* Table Card */}
      <TableWrapper isFetching={isFetching}>
        {!tab && (
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Product</th>
                <th className="text-left">SKU</th>
                <th className="text-left">Warehouse</th>
                <th className="text-left">Stock Quantity</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={5} />
              ) : (stockLevels?.data ?? []).map((item: InventoryItem) => (
                <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                  <td className="font-medium text-foreground text-sm flex items-center gap-2">
                    <Package size={16} className="text-blue-500" />
                    {item.product?.name ?? '—'}
                  </td>
                  <td className="text-muted-foreground font-mono text-xs">{item.product?.sku ?? '—'}</td>
                  <td className="text-muted-foreground text-sm">{item.warehouse?.name ?? '—'}</td>
                  <td className="font-semibold text-sm">{item.stock_qty}</td>
                  <td>
                    {item.stock_qty <= item.min_stock_qty ? (
                      <span className="badge-danger flex items-center gap-1 w-fit text-xs font-medium">
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    ) : (
                      <span className="badge-success text-xs font-medium">In Stock</span>
                    )}
                  </td>
                </tr>
              ))}
              {!isLoading && (stockLevels?.data ?? []).length === 0 && (
                <EmptyState cols={5} message="No inventory items found" icon={<Package size={40} className="mx-auto mb-3 text-muted-foreground/30" />} />
              )}
            </tbody>
          </table>
        )}

        {tab === 'adjustments' && (
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Product</th>
                <th className="text-left">Warehouse</th>
                <th className="text-left">Qty</th>
                <th className="text-left">Type</th>
                <th className="text-left">Notes</th>
                <th className="text-left">Status</th>
                <th className="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={7} />
              ) : (adjustmentsData?.data ?? []).map((adj: StockAdjustment) => (
                <tr key={adj.id} className="hover:bg-muted/10 transition-colors">
                  <td className="font-medium text-foreground text-sm">{adj.product?.name ?? '—'}</td>
                  <td className="text-muted-foreground text-sm">{adj.warehouse?.name ?? '—'}</td>
                  <td className="font-semibold text-sm">{adj.quantity}</td>
                  <td className="text-sm font-medium">
                    <span className={adj.type === 'addition' ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                      {adj.type === 'addition' ? '+' : '-'}
                    </span>
                  </td>
                  <td className="text-muted-foreground text-xs truncate max-w-[150px]">{adj.notes ?? '—'}</td>
                  <td>
                    <span className={adj.status === 'approved' ? 'badge-success' : 'badge-warning'}>
                      {adj.status}
                    </span>
                  </td>
                  <td className="text-right text-xs text-muted-foreground font-mono">{new Date(adj.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!isLoading && (adjustmentsData?.data ?? []).length === 0 && (
                <EmptyState cols={7} message="No adjustments found" icon={<Package size={40} className="mx-auto mb-3 text-muted-foreground/30" />} />
              )}
            </tbody>
          </table>
        )}

        {tab === 'transfers' && (
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">From Warehouse</th>
                <th className="text-left">To Warehouse</th>
                <th className="text-left">Status</th>
                <th className="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={4} />
              ) : (transfersData?.data ?? []).map((tr: StockTransfer) => (
                <tr key={tr.id} className="hover:bg-muted/10 transition-colors">
                  <td className="font-medium text-foreground text-sm flex items-center gap-2">
                    <ArrowLeftRight size={14} className="text-blue-500" />
                    {tr.from_warehouse?.name ?? '—'}
                  </td>
                  <td className="text-foreground text-sm">{tr.to_warehouse?.name ?? '—'}</td>
                  <td>
                    <span className={tr.status === 'received' ? 'badge-success' : 'badge-warning'}>
                      {tr.status}
                    </span>
                  </td>
                  <td className="text-right text-xs text-muted-foreground font-mono">{new Date(tr.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!isLoading && (transfersData?.data ?? []).length === 0 && (
                <EmptyState cols={4} message="No stock transfers found" icon={<Package size={40} className="mx-auto mb-3 text-muted-foreground/30" />} />
              )}
            </tbody>
          </table>
        )}

        {tab === 'opnames' && (
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Warehouse</th>
                <th className="text-left">Status</th>
                <th className="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={3} />
              ) : (opnamesData?.data ?? []).map((op: StockOpname) => (
                <tr key={op.id} className="hover:bg-muted/10 transition-colors">
                  <td className="font-medium text-foreground text-sm flex items-center gap-2">
                    <Package size={16} className="text-indigo-500" />
                    {op.warehouse?.name ?? '—'}
                  </td>
                  <td>
                    <span className={op.status === 'completed' ? 'badge-success' : 'badge-warning'}>
                      {op.status}
                    </span>
                  </td>
                  <td className="text-right text-xs text-muted-foreground font-mono">{new Date(op.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!isLoading && (opnamesData?.data ?? []).length === 0 && (
                <EmptyState cols={3} message="No stock opnames found" icon={<Package size={40} className="mx-auto mb-3 text-muted-foreground/30" />} />
              )}
            </tbody>
          </table>
        )}

        {tab === 'movements' && (
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Product</th>
                <th className="text-left">SKU</th>
                <th className="text-left">Warehouse</th>
                <th className="text-left">Type</th>
                <th className="text-left">Qty</th>
                <th className="text-left">Reference</th>
                <th className="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={7} />
              ) : (movementsData?.data ?? []).map((m: any) => (
                <tr key={m.id} className="hover:bg-muted/10 transition-colors">
                  <td className="font-medium text-foreground text-sm">{m.product?.name ?? '—'}</td>
                  <td className="text-muted-foreground font-mono text-xs">{m.product?.sku ?? '—'}</td>
                  <td className="text-muted-foreground text-sm">{m.warehouse?.name ?? '—'}</td>
                  <td className="text-sm">
                    <span className={`badge ${m.type === 'addition' || m.type === 'purchase' ? 'badge-success' : 'badge-danger'}`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="font-semibold text-sm">{m.quantity}</td>
                  <td className="text-muted-foreground text-xs">{m.reference_type || 'Manual'} ({m.reference_id || 'Adjustment'})</td>
                  <td className="text-right text-xs text-muted-foreground font-mono">{new Date(m.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {!isLoading && (movementsData?.data ?? []).length === 0 && (
                <EmptyState cols={7} message="No stock movement logs found" icon={<Package size={40} className="mx-auto mb-3 text-muted-foreground/30" />} />
              )}
            </tbody>
          </table>
        )}
      </TableWrapper>

      <Pagination
        currentPage={pagination.current_page}
        lastPage={pagination.last_page}
        total={pagination.total}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
      />

      {/* Form Action Modals */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">
                  {tab === 'adjustments' ? 'Stock Adjustment' :
                    tab === 'transfers' ? 'Stock Transfer' :
                      tab === 'opnames' ? 'Record Stock Opname' :
                        'Stock Level Adjustment'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              {/* Adjustments Form */}
              {(!tab || tab === 'adjustments') && (
                <form onSubmit={handleSubmitAdjustment} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Product</label>
                    <select
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      required
                      className="form-input"
                    >
                      <option value="">Select Product</option>
                      {(products ?? []).map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Warehouse</label>
                    <select
                      value={warehouseId}
                      onChange={(e) => setWarehouseId(e.target.value)}
                      required
                      className="form-input"
                    >
                      <option value="">Select Warehouse</option>
                      {(warehouses ?? []).map((w: any) => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Quantity</label>
                      <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="form-input"
                      >
                        <option value="addition">Addition (+)</option>
                        <option value="subtraction">Subtraction (-)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Reason for adjustment..."
                      className="form-input"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                    <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={adjustMutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg shadow-sm flex items-center gap-1.5">
                      {adjustMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                      Submit Adjustment
                    </button>
                  </div>
                </form>
              )}

              {/* Transfers Form */}
              {tab === 'transfers' && (
                <form onSubmit={handleSubmitTransfer} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Product</label>
                    <select
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      required
                      className="form-input"
                    >
                      <option value="">Select Product</option>
                      {(products ?? []).map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Source Warehouse</label>
                    <select
                      value={warehouseId}
                      onChange={(e) => setWarehouseId(e.target.value)}
                      required
                      className="form-input"
                    >
                      <option value="">Select Source</option>
                      {(warehouses ?? []).map((w: any) => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Destination Warehouse</label>
                    <select
                      value={toWarehouseId}
                      onChange={(e) => setToWarehouseId(e.target.value)}
                      required
                      className="form-input"
                    >
                      <option value="">Select Destination</option>
                      {(warehouses ?? []).map((w: any) => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Quantity</label>
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Transfer reference/reason..."
                      className="form-input"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                    <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={transferMutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg shadow-sm flex items-center gap-1.5">
                      {transferMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                      Submit Transfer
                    </button>
                  </div>
                </form>
              )}

              {/* Opnames Form */}
              {tab === 'opnames' && (
                <form onSubmit={handleSubmitOpname} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Target Warehouse</label>
                    <select
                      value={warehouseId}
                      onChange={(e) => setWarehouseId(e.target.value)}
                      required
                      className="form-input"
                    >
                      <option value="">Select Warehouse</option>
                      {(warehouses ?? []).map((w: any) => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Stock Opname description..."
                      className="form-input"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                    <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={opnameMutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg shadow-sm flex items-center gap-1.5">
                      {opnameMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                      Submit Opname
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InventoryPage
