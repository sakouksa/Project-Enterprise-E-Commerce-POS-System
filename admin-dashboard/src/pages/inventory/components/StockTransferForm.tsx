import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Trash2, CheckCircle, Clock, Loader2, ArrowLeftRight, Truck, User, Package } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/useToast'

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

  const { data: products } = useQuery({
    queryKey: ['products-list'],
    queryFn: () => api.get('/products').then(r => r.data.data),
  })

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors border border-border bg-card">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isEdit ? `${t('inventory.edit_trf', 'Stock Transfer')}: ${detail?.reference_number}` : t('inventory.create_trf', 'New Stock Transfer')}
            </h2>
            <p className="text-xs text-muted-foreground">{t('inventory.trf_desc', 'Transfer goods between warehouse locations.')}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isEdit && isDraft && (
            <button
              onClick={() => shipMutation.mutate()}
              disabled={shipMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-xl flex items-center gap-1.5 shadow-sm hover:opacity-90"
            >
              {shipMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
              {t('buttons.ship', 'Ship Transfer')}
            </button>
          )}
          {isEdit && isInTransit && (
            <button
              onClick={handleReceiveSubmit}
              disabled={receiveMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-emerald-500"
            >
              {receiveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              {t('buttons.receive', 'Receive Transfer')}
            </button>
          )}
          {isDraft && (
            <button
              onClick={handleSubmit}
              disabled={saveMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-xl hover:bg-muted transition-colors"
            >
              {saveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />}
              {t('buttons.save', 'Save Draft')}
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
                           ${isReceived ? 'text-emerald-500' : isInTransit ? 'text-blue-500' : 'text-amber-500'}`}>
              {status}
            </span>
          </div>
          <div className="p-3 bg-muted/20 rounded-xl">
            <Truck size={18} />
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">{t('inventory.from', 'From Warehouse')}</span>
            <span className="block text-sm font-bold text-foreground mt-1">{detail?.from_warehouse?.name || '—'}</span>
          </div>
          <div className="p-3 bg-muted/20 rounded-xl">
            <ArrowLeftRight size={18} />
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">{t('inventory.to', 'To Warehouse')}</span>
            <span className="block text-sm font-bold text-foreground mt-1">{detail?.to_warehouse?.name || '—'}</span>
          </div>
          <div className="p-3 bg-muted/20 rounded-xl">
            <ArrowLeftRight size={18} />
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
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: General Info */}
        <div className="lg:col-span-1 bg-card border border-border/50 rounded-2xl p-5 space-y-4 shadow-sm h-fit">
          <h3 className="text-sm font-bold text-foreground font-semibold uppercase tracking-wider">{t('inventory.general_info', 'General Info')}</h3>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">{t('inventory.from_warehouse', 'Source Warehouse')}</label>
            <select
              value={fromWarehouseId}
              onChange={(e) => setFromWarehouseId(e.target.value)}
              required
              disabled={!isDraft}
              className="form-input"
            >
              <option value="">Select Source</option>
              {(warehouses ?? []).map((w: any) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">{t('inventory.to_warehouse', 'Destination Warehouse')}</label>
            <select
              value={toWarehouseId}
              onChange={(e) => setToWarehouseId(e.target.value)}
              required
              disabled={!isDraft}
              className="form-input"
            >
              <option value="">Select Destination</option>
              {(warehouses ?? []).map((w: any) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">{t('inventory.notes', 'Notes')}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!isDraft}
              rows={3}
              placeholder="Detailed notes/reference..."
              className="form-input"
            />
          </div>
        </div>

        {/* Right Side: Items Management */}
        <div className="lg:col-span-2 bg-card border border-border/50 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground font-semibold uppercase tracking-wider">{t('inventory.items', 'Transfer Items')}</h3>
            {isDraft && (
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1 shadow-sm transition-colors"
              >
                <Plus size={13} />
                {t('inventory.add_item', 'Add Item')}
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20">
                  <th className="py-2.5 px-3">{t('products.title', 'Product')}</th>
                  <th className="py-2.5 px-3 w-32">{t('inventory.qty_requested', 'Req Qty')}</th>
                  {isInTransit && <th className="py-2.5 px-3 w-32">{t('inventory.qty_received', 'Rec Qty')}</th>}
                  {isDraft && <th className="py-2.5 px-3 w-12 text-center"></th>}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-border/20 last:border-0 hover:bg-muted/10">
                    <td className="py-2 px-3">
                      <select
                        value={item.product_id}
                        onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
                        required
                        disabled={!isDraft}
                        className="form-input text-xs"
                      >
                        <option value="">Select Product</option>
                        {(products ?? []).map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                        required
                        min="0.0001"
                        disabled={!isDraft}
                        className="form-input text-xs"
                      />
                    </td>
                    {isInTransit && (
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={item.quantity_received ?? item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity_received', parseFloat(e.target.value) || 0)}
                          required
                          min="0"
                          className="form-input text-xs border-emerald-500/60 focus:ring-emerald-500/30"
                        />
                      </td>
                    )}
                    {isDraft && (
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 hover:bg-red-50 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={isInTransit ? 3 : 2} className="text-center py-6 text-xs text-muted-foreground">
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
export default StockTransferForm
