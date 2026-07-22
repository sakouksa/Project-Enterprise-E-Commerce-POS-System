import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Trash2, CheckCircle, XCircle, Clock, Loader2, DollarSign, Package, User, Save, ArrowLeftRight, FileText, Info, Warehouse } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/useToast'

interface StockAdjustmentFormProps {
  adjustmentId?: number | null
  onClose: () => void
}

export const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({ adjustmentId, onClose }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const qc = useQueryClient()
  const isEdit = !!adjustmentId

  // Form States
  const [warehouseId, setWarehouseId] = useState('')
  const [type, setType] = useState('addition')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<Array<{ product_id: string; variant_id: string; quantity: number; product?: any }>>([])

  // Queries
  const { data: detail, isLoading: loadingDetail } = useQuery({
    queryKey: ['stock-adjustment-detail', adjustmentId],
    queryFn: () => api.get(`/stock-adjustments/${adjustmentId}`).then(r => r.data.data),
    enabled: isEdit,
  })

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses-list'],
    queryFn: () => api.get('/warehouses').then(r => r.data.data),
  })

  const { data: products } = useQuery({
    queryKey: ['products-list'],
    queryFn: () => api.get('/products', { params: { per_page: 1000 } }).then(r => r.data.data),
  })

  // Auto fill form if editing
  useEffect(() => {
    if (detail) {
      setWarehouseId(detail.warehouse?.id?.toString() || detail.warehouse_id?.toString() || '')
      setType(detail.type || 'addition')
      setReason(detail.reason || '')
      setNotes(detail.notes || '')
      if (detail.items) {
        setItems(detail.items.map((it: any) => ({
          product_id: it.product_id?.toString() || '',
          variant_id: it.product_variant_id?.toString() || '',
          quantity: Math.abs(parseFloat(it.quantity_adjusted)) || 0,
          product: it.product,
        })))
      }
    }
  }, [detail])

  // Mutations
  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (isEdit) {
        return api.put(`/stock-adjustments/${adjustmentId}`, payload)
      }
      return api.post('/stock-adjustments', payload)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-adjustments'] })
      toast.success(isEdit ? 'Stock adjustment updated' : 'Stock adjustment created as draft')
      onClose()
    },
    onError: () => toast.error('Failed to save stock adjustment.')
  })

  const approveMutation = useMutation({
    mutationFn: () => api.post(`/stock-adjustments/${adjustmentId}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-adjustments'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      toast.success('Stock adjustment approved and stock levels recalculated')
      onClose()
    },
    onError: () => toast.error('Failed to approve stock adjustment.')
  })

  const handleAddItem = () => {
    setItems(prev => [...prev, { product_id: '', variant_id: '', quantity: 1 }])
  }

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value }
      }
      return item
    }))
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!warehouseId) {
      toast.error('Please select a warehouse.')
      return
    }

    if (items.length === 0) {
      toast.error('Please add at least one item.')
      return
    }

    // Client-side validation to prevent empty/NaN values
    for (let i = 0; i < items.length; i++) {
      if (!items[i].product_id) {
        toast.error(`Please select a product for item #${i + 1}.`)
        return
      }
      if (!items[i].quantity || items[i].quantity <= 0) {
        toast.error(`Quantity for item #${i + 1} must be greater than 0.`)
        return
      }
    }

    const payload = {
      warehouse_id: parseInt(warehouseId),
      type,
      reason,
      notes,
      items: items.map(it => ({
        product_id: parseInt(it.product_id),
        variant_id: it.variant_id ? parseInt(it.variant_id) : null,
        quantity: parseFloat(it.quantity.toString()),
      }))
    }

    saveMutation.mutate(payload)
  }

  if (isEdit && loadingDetail) {
    return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto mb-2 text-primary" />Loading Details...</div>
  }

  const isApproved = detail?.status === 'approved'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors border border-border bg-card">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isEdit ? `${t('inventory.edit_adj', 'Stock Adjustment')}: ${detail?.reference_number}` : t('inventory.create_adj', 'New Stock Adjustment')}
            </h2>
            <p className="text-xs text-muted-foreground">{t('inventory.adj_desc', 'Adjust warehouse stock quantities with approval logs.')}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {!isApproved && (
            <button
              onClick={handleSubmit}
              disabled={saveMutation.isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm cursor-pointer"
            >
              {saveMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {t('buttons.save', 'Save Draft')}
            </button>
          )}
          {isEdit && !isApproved && (
            <button
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl flex items-center gap-2 shadow-sm hover:bg-emerald-500 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              {approveMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
              {t('buttons.approve', 'Approve')}
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">{t('inventory.status', 'Status')}</span>
            <span className={`block text-lg font-bold mt-1 uppercase
                           ${detail?.status === 'approved' ? 'text-emerald-500' : detail?.status === 'cancelled' ? 'text-rose-500' : 'text-amber-500'}`}>
              {detail?.status || 'Draft'}
            </span>
          </div>
          <div className="p-3 bg-muted/20 rounded-xl">
            <Clock size={18} />
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">{t('inventory.type', 'Adjustment Type')}</span>
            <span className="block text-lg font-bold text-foreground mt-1 capitalize">{type}</span>
          </div>
          <div className="p-3 bg-muted/20 rounded-xl">
            <Plus size={18} />
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">{t('inventory.total_items', 'Total Items')}</span>
            <span className="block text-lg font-bold text-foreground mt-1">{items.length}</span>
          </div>
          <div className="p-3 bg-muted/20 rounded-xl">
            <Package size={18} />
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">{t('inventory.approved_by', 'Approved By')}</span>
            <span className="block text-sm font-semibold text-foreground mt-1">{detail?.user?.name || '—'}</span>
          </div>
          <div className="p-3 bg-muted/20 rounded-xl">
            <User size={18} />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: General Info */}
        <div className="lg:col-span-1 bg-card border border-border/50 rounded-2xl p-6 space-y-5 shadow-sm h-fit">
          <h3 className="text-sm font-bold text-foreground font-semibold uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-border">
            <Info size={16} className="text-indigo-500" />
            {t('inventory.general_info', 'General Info')}
          </h3>
          
          {isApproved ? (
            <div className="space-y-4">
              {/* Warehouse */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted/30 border border-border/40 text-muted-foreground rounded-lg">
                  <Warehouse size={16} />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">{t('products.warehouse', 'Warehouse')}</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">
                    {warehouses?.find((w: any) => w.id.toString() === warehouseId)?.name || 'Unknown Warehouse'}
                  </span>
                </div>
              </div>

              {/* Adjustment Type */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted/30 border border-border/40 text-muted-foreground rounded-lg">
                  <ArrowLeftRight size={16} />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">{t('inventory.type', 'Adjustment Type')}</span>
                  <span className="mt-1 block">
                    {type === 'addition' ? (
                      <span className="badge badge-success text-xs font-semibold">Addition (+)</span>
                    ) : type === 'subtraction' ? (
                      <span className="badge badge-danger text-xs font-semibold">Subtraction (-)</span>
                    ) : (
                      <span className="badge badge-info text-xs font-semibold">Recount (Set Qty)</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Reason */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted/30 border border-border/40 text-muted-foreground rounded-lg">
                  <FileText size={16} />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">{t('inventory.reason', 'Reason')}</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block leading-relaxed font-semibold">
                    {reason}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted/30 border border-border/40 text-muted-foreground rounded-lg">
                  <FileText size={16} />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">{t('inventory.notes', 'Notes')}</span>
                  <span className="text-sm text-muted-foreground mt-1 block leading-relaxed whitespace-pre-wrap font-normal italic">
                    "{notes || '—'}"
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">{t('products.warehouse', 'Warehouse')}</label>
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
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">{t('inventory.type', 'Adjustment Type')}</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="form-input"
                >
                  <option value="addition">Addition (+)</option>
                  <option value="subtraction">Subtraction (-)</option>
                  <option value="recount">Recount (Set Qty)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">{t('inventory.reason', 'Reason')}</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  placeholder="e.g. Broken stock, discrepancy..."
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">{t('inventory.notes', 'Notes')}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Detailed description..."
                  className="form-input"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Items Management */}
        <div className="lg:col-span-2 bg-card border border-border/50 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground font-semibold uppercase tracking-wider">{t('inventory.items', 'Adjustment Items')}</h3>
            {!isApproved && (
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-primary rounded-xl flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-all duration-200 active:scale-95"
              >
                <Plus size={13} />
                {t('inventory.add_item', 'Add Item')}
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/80">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30">
                  <th className="py-3 px-4">{t('products.title', 'Product')}</th>
                  <th className="py-3 px-4 w-36 text-right">{t('inventory.quantity', 'Adjust Qty')}</th>
                  {!isApproved && <th className="py-3 px-4 w-12 text-center"></th>}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-border/30 last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="py-3 px-4">
                      {isApproved ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-foreground">
                            {item.product?.name || 'Unknown Product'}
                          </span>
                          {item.product?.sku && (
                            <span className="text-xs text-muted-foreground font-mono mt-0.5">
                              {item.product.sku}
                            </span>
                          )}
                        </div>
                      ) : (
                        <select
                          value={item.product_id}
                          onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
                          required
                          className="form-input text-xs w-full max-w-md rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                        >
                          <option value="">Select Product</option>
                          {item.product && !(products ?? []).some((p: any) => p.id.toString() === item.product_id) && (
                            <option value={item.product.id.toString()}>
                              {item.product.name} ({item.product.sku})
                            </option>
                          )}
                          {(products ?? []).map((p: any) => (
                            <option key={p.id} value={p.id.toString()}>{p.name} ({p.sku})</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isApproved ? (
                        <span className="font-mono text-sm font-bold bg-muted/60 dark:bg-muted/20 px-3 py-1 rounded-lg text-foreground border border-border/50 inline-block">
                          {item.quantity}
                        </span>
                      ) : (
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value, 10) || 0)}
                          required
                          min="1"
                          step="1"
                          className="form-input text-xs text-right max-w-[120px] rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      )}
                    </td>
                    {!isApproved && (
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-muted-foreground hover:text-red-500 rounded-lg transition-colors active:scale-95 duration-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-xs text-muted-foreground">
                      {t('inventory.no_items', 'No items added. Click Add Item to start.')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  )
}
export default StockAdjustmentForm
