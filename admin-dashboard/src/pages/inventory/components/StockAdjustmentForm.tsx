import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Trash2, CheckCircle, XCircle, Clock, Loader2, DollarSign, Package, User, Save, ArrowLeftRight, FileText, Info, Warehouse, Sliders } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/useToast'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'

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

  const { data: rawProducts } = useQuery({
    queryKey: ['products-list'],
    queryFn: () => api.get('/products', { params: { per_page: 1000 } }).then(r => r.data.data),
  })

  const products = Array.isArray(rawProducts) ? rawProducts : (rawProducts?.data ?? [])

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
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span>{isEdit ? t('inventory.view_adj', 'Stock Adjustment Details') : t('inventory.create_adj', 'New Stock Adjustment')}</span>
              {isEdit && (
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-muted border border-border/80 text-muted-foreground font-semibold">
                  {detail?.reference_number || `ADJ-${adjustmentId}`}
                </span>
              )}
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

      {/* Top Banner Card - Exact Employee Profile Card Style */}
      {isEdit && (
        <div className="bg-muted/30 border border-border/70 rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-card border border-border/80 flex items-center justify-center text-primary shadow-2xs shrink-0">
            <Sliders size={24} />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="text-base font-bold text-foreground truncate">{detail?.reference_number || `ADJ-${adjustmentId}`}</h3>
            <p className="text-xs text-muted-foreground truncate">
              Warehouse: {warehouses?.find((w: any) => w.id.toString() === warehouseId)?.name || 'Main Warehouse'}
            </p>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                isApproved ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
              }`}>
                {detail?.status || 'Draft'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: General Info */}
        <div className="lg:col-span-1 bg-card border border-border/50 rounded-2xl p-6 space-y-5 shadow-sm h-fit">
          <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider border-b border-border/50 pb-2">
            GENERAL INFORMATION
          </h3>
          
          {isApproved ? (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-y-3">
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('products.warehouse', 'Warehouse')}</span>
                  <span className="font-bold text-foreground block">
                    {warehouses?.find((w: any) => w.id.toString() === warehouseId)?.name || 'Unknown Warehouse'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('inventory.type', 'Adjustment Type')}</span>
                  <span className="font-bold text-foreground block capitalize">{type}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('inventory.reason', 'Reason')}</span>
                  <span className="font-bold text-foreground block">{reason || '—'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('inventory.notes', 'Notes')}</span>
                  <span className="font-medium text-muted-foreground block italic">"{notes || '—'}"</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('inventory.approved_by', 'Approved By')}</span>
                  <span className="font-bold text-foreground block">{detail?.user?.name || 'Super Admin'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">{t('products.warehouse', 'Warehouse')}</label>
                <ModernSelect
                  value={warehouseId}
                  onChange={(val) => setWarehouseId(String(val))}
                  options={[
                    { value: '', label: 'Select Warehouse' },
                    ...(warehouses ?? []).map((w: any) => ({ value: w.id, label: w.name })),
                  ]}
                  placeholder="Select Warehouse"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">{t('inventory.type', 'Adjustment Type')}</label>
                <ModernSelect
                  value={type}
                  onChange={(val) => setType(String(val))}
                  options={[
                    { value: 'addition', label: 'Addition (+)' },
                    { value: 'subtraction', label: 'Subtraction (-)' },
                    { value: 'recount', label: 'Recount (Set Qty)' },
                  ]}
                  placeholder="Select Type"
                />
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
                        <ModernSelect
                          value={item.product_id}
                          onChange={(val) => handleItemChange(idx, 'product_id', String(val))}
                          options={[
                            { value: '', label: 'Select Product' },
                            ...(item.product && !(products ?? []).some((p: any) => p.id.toString() === item.product_id)
                              ? [{ value: item.product.id.toString(), label: `${item.product.name} (${item.product.sku})` }]
                              : []),
                            ...(products ?? []).map((p: any) => ({
                              value: p.id.toString(),
                              label: p.name,
                              code: p.sku,
                            })),
                          ]}
                          placeholder="Select Product"
                        />
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
