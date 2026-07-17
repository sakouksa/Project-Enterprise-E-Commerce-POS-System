import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Eye, RefreshCw, X, ShoppingBag, CheckCircle, Trash2, Loader2 } from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface Purchase {
  id: number
  po_number: string
  supplier?: { name: string }
  warehouse?: { name: string }
  grand_total: number
  status: string
  created_at: string
}

const STATUS_BADGE: Record<string, string> = {
  ordered:   'badge-info',
  received:  'badge-success',
  cancelled: 'badge-danger',
}

const PurchasesPage: React.FC = () => {
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
    adjustAfterDelete,
  } = useServerPagination({ storageKey: 'purchases' })
    const [modalOpen, setModalOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<any | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)

  // Form states (simple creation)
  const [supplierId, setSupplierId] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [poNumber, setPoNumber] = useState('')
  const [total, setTotal] = useState('')

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers-list'],
    queryFn: () => api.get('/suppliers').then(r => r.data.data),
  })

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses-list'],
    queryFn: () => api.get('/warehouses').then(r => r.data.data),
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['purchases', page, debouncedSearch, perPage],
    queryFn: () => api.get('/purchases', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const createMutation = useMutation({
    mutationFn: (newPO: any) => api.post('/purchases', newPO),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchases'] })
      toast.success('Purchase order created successfully.')
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create purchase order.')
    },
  })

  const receiveMutation = useMutation({
    mutationFn: (id: number) => api.post(`/purchases/${id}/receive`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchases'] })
      toast.success('Purchase received (GRN recorded).')
      setSelectedPurchase(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to receive purchase.')
    },
  })

  const cancelPurchaseMutation = useMutation({
    mutationFn: (id: number) => api.post(`/purchases/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchases'] })
      toast.success('Purchase order cancelled.')
      setDeleteTarget(null)
      setSelectedPurchase(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to cancel purchase.')
      setDeleteTarget(null)
    },
  })

  const purchases: Purchase[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setPoNumber('PO-' + Math.floor(100000 + Math.random() * 900000))
    setSupplierId('')
    setWarehouseId('')
    setTotal('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      company_id: 1,
      supplier_id: supplierId,
      warehouse_id: warehouseId,
      po_number: poNumber,
      date: new Date().toISOString().split('T')[0],
      grand_total: total,
      items: [
        { product_id: 1, ordered_qty: 10, unit_cost: parseFloat(total) / 10 }
      ]
    })
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Purchase Orders</h1>
          <p className="text-muted-foreground text-sm">{pagination.total} purchase orders total</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                     bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus size={16} />
          Add Purchase Order
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search..." />
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['purchases'] })}
            className="p-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
      <TableWrapper isFetching={isFetching}>
        <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">PO Number</th>
                <th className="text-left">Supplier</th>
                <th className="text-left">Warehouse</th>
                <th className="text-left">Date</th>
                <th className="text-left">Grand Total</th>
                <th className="text-left">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td><div className="skeleton h-4 w-28 rounded" /></td>
                      <td><div className="skeleton h-4 w-32 rounded" /></td>
                      <td><div className="skeleton h-4 w-32 rounded" /></td>
                      <td><div className="skeleton h-4 w-24 rounded" /></td>
                      <td><div className="skeleton h-4 w-20 rounded" /></td>
                      <td><div className="skeleton h-4 w-16 rounded" /></td>
                      <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                    </tr>
                  ))
                : purchases.map((purchase) => (
                    <tr key={purchase.id} className="group">
                      <td className="font-semibold text-primary text-sm font-mono">#{purchase.po_number}</td>
                      <td className="text-sm text-foreground">{purchase.supplier?.name ?? '—'}</td>
                      <td className="text-sm text-muted-foreground">{purchase.warehouse?.name ?? '—'}</td>
                      <td className="text-muted-foreground text-sm">{new Date(purchase.created_at).toLocaleDateString()}</td>
                      <td className="font-semibold text-sm">Rp {purchase.grand_total.toLocaleString('id-ID')}</td>
                      <td>
                        <span className={STATUS_BADGE[purchase.status] ?? 'badge-muted'}>
                          {purchase.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedPurchase(purchase)}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-xs font-medium"
                          >
                            <Eye size={14} />
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
              {!isLoading && purchases.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <ShoppingBag size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No purchases found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </TableWrapper>
        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
      </div>

      {/* Details Side-Drawer */}
      <AnimatePresence>
        {selectedPurchase && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card w-full max-w-lg border-l border-border h-full flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground font-mono">
                  PO #{selectedPurchase.po_number}
                </h3>
                <button onClick={() => setSelectedPurchase(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-muted/40 p-4 rounded-xl space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Purchase Lifecycle Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPurchase.status === 'ordered' && (
                      <button
                        onClick={() => receiveMutation.mutate(selectedPurchase.id)}
                        disabled={receiveMutation.isPending}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-500 flex items-center gap-1 disabled:opacity-60"
                      >
                        {receiveMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={14} />}
                        {receiveMutation.isPending ? 'Processing...' : 'Receive Shipment (GRN)'}
                      </button>
                    )}
                    {selectedPurchase.status === 'ordered' && (
                      <button
                        onClick={() => setDeleteTarget(selectedPurchase)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-500 flex items-center gap-1"
                      >
                        Cancel PO
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Supplier: <span className="font-medium text-foreground">{selectedPurchase.supplier?.name}</span></p>
                  <p className="text-sm text-muted-foreground">Warehouse: <span className="font-medium text-foreground">{selectedPurchase.warehouse?.name}</span></p>
                  <p className="text-sm text-muted-foreground">Date: <span className="font-medium text-foreground">{new Date(selectedPurchase.created_at).toLocaleDateString()}</span></p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
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
                  Create Purchase Order
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">PO Number</label>
                  <input value={poNumber} disabled className="form-input bg-muted cursor-not-allowed font-mono" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Supplier</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    required
                    className="form-input"
                  >
                    <option value="">Select Supplier</option>
                    {(suppliers ?? []).map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
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

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Grand Total Value</label>
                  <input
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    required
                    placeholder="Rp"
                    className="form-input"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 shadow-sm"
                  >
                    Create PO
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Cancel Purchase Order"
        message={`Are you sure you want to cancel PO #${deleteTarget?.po_number}? This action cannot be undone.`}
        confirmText="Cancel PO"
        loading={cancelPurchaseMutation.isPending}
        onConfirm={() => deleteTarget && cancelPurchaseMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        variant="warning"
      />
    </div>
  )
}

export default PurchasesPage
