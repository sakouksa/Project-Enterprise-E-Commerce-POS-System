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
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/80 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <span>{isEdit ? t('inventory.view_adj', 'Stock Adjustment Details') : t('inventory.create_adj', 'New Stock Adjustment')}</span>
            {isEdit && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-muted border border-border/80 text-muted-foreground font-semibold">
                {detail?.reference_number || `ADJ-${adjustmentId}`}
              </span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{t('inventory.adj_desc', 'Adjust warehouse stock quantities with audit tracking.')}</p>
        </div>

        {/* Back Button on Right Side with Text */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all font-semibold text-xs shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft size={16} />
          <span>Back to Adjustments</span>
        </button>
      </div>

      {/* Top Banner Card - Status Banner */}
      {isEdit && (
        <div className="bg-muted/30 border border-border/70 rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-card border border-border/80 flex items-center justify-center text-primary shadow-2xs shrink-0">
            <Sliders size={22} />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="text-sm font-bold text-foreground truncate">{detail?.reference_number || `ADJ-${adjustmentId}`}</h3>
            <p className="text-xs text-muted-foreground truncate">
              Warehouse Hub: {warehouses?.find((w: any) => w.id.toString() === warehouseId)?.name || 'Main Warehouse'}
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: General Information Card */}
          <div className="lg:col-span-1 bg-card border border-border/80 rounded-2xl p-6 space-y-5 shadow-sm h-fit">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Info size={16} className="text-primary" />
              <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                GENERAL INFORMATION
              </h3>
            </div>

            {isApproved ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 gap-y-3.5">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('products.warehouse', 'Warehouse Hub')}</span>
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
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                    {t('products.warehouse', 'Warehouse Hub')} <span className="text-rose-500">*</span>
                  </label>
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
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                    {t('inventory.type', 'Adjustment Type')} <span className="text-rose-500">*</span>
                  </label>
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
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                    {t('inventory.reason', 'Reason')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    placeholder="e.g. Broken stock, discrepancy..."
                    className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('inventory.notes', 'Notes')}</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Detailed explanation..."
                    className="w-full p-3 rounded-xl border border-border bg-card text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Items Management Card */}
          <div className="lg:col-span-2 bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-primary" />
                  <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">ADJUSTMENT ITEMS</h3>
                </div>
                {!isApproved && (
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-primary rounded-xl flex items-center gap-1.5 shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Item</span>
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/30">
                      <th className="py-3 px-4">{t('products.title', 'PRODUCT MANAGEMENT')}</th>
                      <th className="py-3 px-4 w-36 text-right">{t('inventory.quantity', 'ADJUST QTY')}</th>
                      {!isApproved && <th className="py-3 px-4 w-12 text-center"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs text-foreground font-medium">
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          {isApproved ? (
                            <div className="space-y-0.5">
                              <span className="font-bold text-xs text-foreground block">
                                {item.product?.name || 'Unknown Product'}
                              </span>
                              {item.product?.sku && (
                                <span className="text-[10px] text-muted-foreground font-mono block">
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
                            <span className="font-mono text-xs font-bold bg-muted/60 px-3 py-1 rounded-lg text-foreground border border-border/50 inline-block">
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
                              className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground font-bold text-xs text-right focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all max-w-[120px] ml-auto block"
                            />
                          )}
                        </td>
                        {!isApproved && (
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="p-1.5 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                              title="Remove Item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center py-12 text-xs text-muted-foreground">
                          <div className="space-y-2">
                            <Package size={32} className="mx-auto text-muted-foreground/40" />
                            <p className="font-semibold">No items added to this adjustment yet.</p>
                            <p className="text-[11px]">Click <span className="text-primary font-bold">Add Item</span> above to select products.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Bottom Action Bar Container */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border/80 p-5 rounded-2xl shadow-sm">
          <div className="text-xs text-muted-foreground font-medium">
            {items.length > 0 ? (
              <span><span className="font-bold text-foreground">{items.length}</span> item(s) configured for stock adjustment</span>
            ) : (
              <span>Please add at least 1 item to proceed</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-muted-foreground border border-border rounded-xl hover:bg-muted transition-colors bg-card cursor-pointer"
            >
              Cancel
            </button>

            {!isApproved && (
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="px-6 py-2.5 text-xs font-bold text-white bg-primary rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                {saveMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                <span>Save Changes</span>
              </button>
            )}

            {isEdit && !isApproved && (
              <button
                type="button"
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer"
              >
                {approveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                <span>Approve Adjustment</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
export default StockAdjustmentForm
