import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Trash2, CheckCircle, Clock, Loader2, ArrowLeftRight, Truck, User, Package, Info, FileText, Warehouse } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/useToast'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'

interface StockTransferFormProps {
  transferId?: number | null
  onClose: () => void
}

export const StockTransferForm: React.FC<StockTransferFormProps> = ({ transferId, onClose }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const qc = useQueryClient()
  const isEdit = !!transferId

  // Form States
  const [fromWarehouseId, setFromWarehouseId] = useState('')
  const [toWarehouseId, setToWarehouseId] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<Array<{ id?: number; product_id: string; variant_id: string; quantity: number; quantity_received?: number }>>([])

  // Queries
  const { data: detail, isLoading: loadingDetail } = useQuery({
    queryKey: ['stock-transfer-detail', transferId],
    queryFn: () => api.get(`/stock-transfers/${transferId}`).then(r => r.data.data),
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
      setFromWarehouseId(detail.from_warehouse_id?.toString() || '')
      setToWarehouseId(detail.to_warehouse_id?.toString() || '')
      setNotes(detail.notes || '')
      if (detail.items) {
        setItems(detail.items.map((it: any) => ({
          id: it.id,
          product_id: it.product_id?.toString() || '',
          variant_id: it.product_variant_id?.toString() || '',
          quantity: parseFloat(it.quantity_requested) || 0,
          quantity_received: parseFloat(it.quantity_received) || 0,
        })))
      }
    }
  }, [detail])

  // Mutations
  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (isEdit) {
        return api.put(`/stock-transfers/${transferId}`, payload)
      }
      return api.post('/stock-transfers', payload)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock-transfers'] })
      toast.success(isEdit ? 'Stock transfer updated' : 'Stock transfer created as draft')
      onClose()
    },
    onError: () => toast.error('Failed to save stock transfer.')
  })

  const shipMutation = useMutation({
    mutationFn: () => api.post(`/stock-transfers/${transferId}/ship`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock-transfers'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      toast.success('Stock transfer is now in transit')
      onClose()
    },
    onError: () => toast.error('Failed to ship transfer.')
  })

  const receiveMutation = useMutation({
    mutationFn: (receivedItems: any) => api.post(`/stock-transfers/${transferId}/receive`, { items: receivedItems }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock-transfers'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      toast.success('Stock transfer successfully received and stock updated')
      onClose()
    },
    onError: () => toast.error('Failed to receive transfer.')
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error('Please add at least one item.')
      return
    }

    const payload = {
      from_warehouse_id: parseInt(fromWarehouseId),
      to_warehouse_id: parseInt(toWarehouseId),
      notes,
      items: items.map(it => ({
        product_id: parseInt(it.product_id),
        variant_id: it.variant_id ? parseInt(it.variant_id) : null,
        quantity: parseFloat(it.quantity.toString()),
      }))
    }

    saveMutation.mutate(payload)
  }

  const handleReceiveSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const receivedPayload = items.map(it => ({
      id: it.id,
      received_quantity: it.quantity_received || 0
    }))
    receiveMutation.mutate(receivedPayload)
  }

  if (isEdit && loadingDetail) {
    return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto mb-2 text-primary" />Loading Details...</div>
  }

  const status = detail?.status || 'draft'
  const isDraft = status === 'draft'
  const isInTransit = status === 'in_transit'
  const isReceived = status === 'received'

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/80 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <span>{isEdit ? t('inventory.view_trf', 'Stock Transfer Details') : t('inventory.create_trf', 'New Stock Transfer')}</span>
            {isEdit && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-muted border border-border/80 text-muted-foreground font-semibold">
                {detail?.reference_number || `TRF-${transferId}`}
              </span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{t('inventory.trf_desc', 'Transfer goods between warehouse locations.')}</p>
        </div>

        {/* Back Button on Right Side with Text */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all font-semibold text-xs shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft size={16} />
          <span>Back to Transfers</span>
        </button>
      </div>

      {/* Top Banner Card - Status Banner */}
      {isEdit && (
        <div className="bg-muted/30 border border-border/70 rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-card border border-border/80 flex items-center justify-center text-primary shadow-2xs shrink-0">
            <ArrowLeftRight size={22} />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="text-sm font-bold text-foreground truncate">{detail?.reference_number || `TRF-${transferId}`}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {warehouses?.find((w: any) => w.id.toString() === fromWarehouseId)?.name || 'Source Warehouse'} → {warehouses?.find((w: any) => w.id.toString() === toWarehouseId)?.name || 'Destination Warehouse'}
            </p>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                isReceived ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                isInTransit ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                'bg-amber-500/10 text-amber-600 border border-amber-500/20'
              }`}>
                {status}
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

            {!isDraft ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 gap-y-3.5">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('inventory.from_warehouse', 'Source Warehouse')}</span>
                    <span className="font-bold text-foreground block">
                      {warehouses?.find((w: any) => w.id.toString() === fromWarehouseId)?.name || 'Unknown Warehouse'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('inventory.to_warehouse', 'Destination Warehouse')}</span>
                    <span className="font-bold text-foreground block">
                      {warehouses?.find((w: any) => w.id.toString() === toWarehouseId)?.name || 'Unknown Warehouse'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('inventory.notes', 'Notes')}</span>
                    <span className="font-medium text-muted-foreground block italic">
                      "{notes || '—'}"
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Total Line Items</span>
                    <span className="font-bold text-foreground block">{items.length} items</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                    {t('inventory.from_warehouse', 'Source Warehouse')} <span className="text-rose-500">*</span>
                  </label>
                  <ModernSelect
                    value={fromWarehouseId}
                    onChange={(val) => setFromWarehouseId(String(val))}
                    options={[
                      { value: '', label: 'Select Source' },
                      ...(warehouses ?? []).map((w: any) => ({ value: w.id, label: w.name })),
                    ]}
                    placeholder="Select Source"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                    {t('inventory.to_warehouse', 'Destination Warehouse')} <span className="text-rose-500">*</span>
                  </label>
                  <ModernSelect
                    value={toWarehouseId}
                    onChange={(val) => setToWarehouseId(String(val))}
                    options={[
                      { value: '', label: 'Select Destination' },
                      ...(warehouses ?? []).map((w: any) => ({ value: w.id, label: w.name })),
                    ]}
                    placeholder="Select Destination"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('inventory.notes', 'Notes')}</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Detailed notes or transfer reference..."
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
                  <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">TRANSFER ITEMS</h3>
                </div>
                {isDraft && (
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
                      <th className="py-3 px-4 w-36">{t('inventory.qty_requested', 'REQ QTY')}</th>
                      {(isInTransit || isReceived) && <th className="py-3 px-4 w-36">{t('inventory.qty_received', 'REC QTY')}</th>}
                      {isDraft && <th className="py-3 px-4 w-12 text-center"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs text-foreground font-medium">
                    {items.map((item, idx) => {
                      const productObj = products?.find((p: any) => p.id.toString() === item.product_id)
                      return (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4">
                            {!isDraft ? (
                              <div className="space-y-0.5">
                                <span className="text-xs text-foreground font-bold block">
                                  {productObj?.name || 'Unknown Product'}
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground block">
                                  {productObj?.sku || 'SKU-0000'}
                                </span>
                              </div>
                            ) : (
                              <ModernSelect
                                value={item.product_id}
                                onChange={(val) => handleItemChange(idx, 'product_id', String(val))}
                                options={[
                                  { value: '', label: 'Select Product' },
                                  ...(products ?? []).map((p: any) => ({
                                    value: p.id,
                                    label: p.name,
                                    code: p.sku,
                                  })),
                                ]}
                                placeholder="Select Product"
                              />
                            )}
                          </td>
                          <td className="py-3 px-4 text-xs text-foreground">
                            {!isDraft ? (
                              <span className="font-bold text-sm">{item.quantity}</span>
                            ) : (
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value, 10) || 0)}
                                required
                                min="1"
                                step="1"
                                className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground font-bold text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              />
                            )}
                          </td>
                          {isInTransit && (
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                value={item.quantity_received ?? item.quantity}
                                onChange={(e) => handleItemChange(idx, 'quantity_received', parseInt(e.target.value, 10) || 0)}
                                required
                                min="0"
                                step="1"
                                className="w-full p-2.5 rounded-xl border border-emerald-500/60 bg-emerald-500/5 text-emerald-600 font-bold text-xs focus:ring-2 focus:ring-emerald-500/20"
                              />
                            </td>
                          )}
                          {isReceived && (
                            <td className="py-3 px-4 text-xs text-foreground font-bold text-emerald-600">
                              {item.quantity_received}
                            </td>
                          )}
                          {isDraft && (
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
                      )
                    })}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={isInTransit ? 4 : 3} className="text-center py-12 text-xs text-muted-foreground">
                          <div className="space-y-2">
                            <Package size={32} className="mx-auto text-muted-foreground/40" />
                            <p className="font-semibold">No items added to this transfer yet.</p>
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
              <span><span className="font-bold text-foreground">{items.length}</span> item(s) configured for warehouse transfer</span>
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

            {isEdit && isDraft && (
              <button
                type="button"
                onClick={() => shipMutation.mutate()}
                disabled={shipMutation.isPending}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-blue-500 active:scale-95 transition-all cursor-pointer"
              >
                {shipMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
                <span>Ship Transfer</span>
              </button>
            )}

            {isEdit && isInTransit && (
              <button
                type="button"
                onClick={handleReceiveSubmit}
                disabled={receiveMutation.isPending}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer"
              >
                {receiveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                <span>Receive Transfer</span>
              </button>
            )}

            {isDraft && (
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="px-6 py-2.5 text-xs font-bold text-white bg-primary rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                {saveMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Clock size={15} />}
                <span>Save Changes</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
export default StockTransferForm
