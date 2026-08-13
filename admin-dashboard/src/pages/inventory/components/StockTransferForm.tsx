import React, { useState, useEffect, useMemo } from 'react'
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Loader2,
  ArrowLeftRight,
  Truck,
  Package,
  Info,
  Warehouse,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Minus,
} from 'lucide-react'
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
  const { t } = useTranslation(['inventory', 'buttons', 'common', 'products'])
  const toast = useToast()
  const qc = useQueryClient()
  const isEdit = !!transferId

  // Form States
  const [fromWarehouseId, setFromWarehouseId] = useState('')
  const [toWarehouseId, setToWarehouseId] = useState('')
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<Array<{ id?: number; product_id: string; variant_id: string; quantity: number; quantity_received?: number }>>([
    { product_id: '', variant_id: '', quantity: 1 }
  ])

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
      if (detail.items && detail.items.length > 0) {
        setItems(detail.items.map((it: any) => ({
          id: it.id,
          product_id: it.product_id?.toString() || '',
          variant_id: it.product_variant_id?.toString() || '',
          quantity: parseFloat(it.quantity_requested) || 1,
          quantity_received: parseFloat(it.quantity_received) || 0,
        })))
      }
    }
  }, [detail])

  // Computed Values
  const fromWarehouseObj = useMemo(
    () => warehouses?.find((w: any) => w.id.toString() === fromWarehouseId),
    [warehouses, fromWarehouseId]
  )

  const toWarehouseObj = useMemo(
    () => warehouses?.find((w: any) => w.id.toString() === toWarehouseId),
    [warehouses, toWarehouseId]
  )

  const isSameWarehouse = useMemo(
    () => !!fromWarehouseId && !!toWarehouseId && fromWarehouseId === toWarehouseId,
    [fromWarehouseId, toWarehouseId]
  )

  const totalRequestedUnits = useMemo(
    () => items.reduce((acc, curr) => acc + (parseInt(String(curr.quantity)) || 0), 0),
    [items]
  )

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
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      toast.success(isEdit 
        ? t('transferUpdatedSuccess', t('inventory.transferUpdatedSuccess', 'Stock transfer updated successfully')) 
        : t('transferCreatedSuccess', t('inventory.transferCreatedSuccess', 'Stock transfer created as draft successfully'))
      )
      onClose()
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err?.message || 'Unexpected server error.'
      toast.error(`${t('transferSaveError', t('inventory.transferSaveError', 'Failed to save stock transfer'))}: ${errMsg}`)
    }
  })

  const shipMutation = useMutation({
    mutationFn: () => api.post(`/stock-transfers/${transferId}/ship`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock-transfers'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      toast.success(t('transferShippedSuccess', t('inventory.transferShippedSuccess', 'Stock transfer is now in transit')))
      onClose()
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err?.message || 'Unexpected server error.'
      toast.error(`${t('transferShipError', t('inventory.transferShipError', 'Failed to ship transfer'))}: ${errMsg}`)
    }
  })

  const receiveMutation = useMutation({
    mutationFn: (receivedItems: any) => api.post(`/stock-transfers/${transferId}/receive`, { items: receivedItems }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock-transfers'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      toast.success(t('transferReceivedSuccess', t('inventory.transferReceivedSuccess', 'Stock transfer successfully received and stock updated')))
      onClose()
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err?.message || 'Unexpected server error.'
      toast.error(`${t('transferReceiveError', t('inventory.transferReceiveError', 'Failed to receive transfer'))}: ${errMsg}`)
    }
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

  const handleStepQuantity = (index: number, delta: number) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        const current = parseInt(String(item.quantity)) || 1
        const nextVal = Math.max(1, current + delta)
        return { ...item, quantity: nextVal }
      }
      return item
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fromWarehouseId || !toWarehouseId) {
      toast.error(t('selectBothWarehouses', t('inventory.selectBothWarehouses', 'Please select both source and destination warehouses.')))
      return
    }

    if (isSameWarehouse) {
      toast.error(t('sameWarehouseWarning', t('inventory.sameWarehouseWarning', 'Source and destination warehouses must be different!')))
      return
    }

    const validItems = items.filter(it => !!it.product_id && (parseInt(String(it.quantity)) || 0) > 0)
    if (validItems.length === 0) {
      toast.error(t('addAtLeastOneItemHint', t('inventory.addAtLeastOneItemHint', 'Please add at least 1 item to proceed')))
      return
    }

    const payload = {
      from_warehouse_id: parseInt(fromWarehouseId),
      to_warehouse_id: parseInt(toWarehouseId),
      notes,
      items: validItems.map(it => ({
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
    return (
      <div className="p-12 text-center bg-card rounded-2xl border border-border/80 shadow-sm">
        <Loader2 className="animate-spin mx-auto mb-3 text-primary" size={28} />
        <p className="text-sm font-semibold text-muted-foreground">Fetching Transfer Record Details...</p>
      </div>
    )
  }

  const status = detail?.status || 'draft'
  const isDraft = status === 'draft'
  const isInTransit = status === 'in_transit'
  const isReceived = status === 'received'

  return (
    <div className="space-y-6">
      {/* Top Page Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <ArrowLeftRight size={20} />
            </div>
            <span>
              {isEdit
                ? t('inventory.edit_trf', 'Edit Stock Transfer')
                : t('inventory.create_trf', 'Create New Stock Transfer')}
            </span>
            {isEdit && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                {detail?.reference_number || `TRF-${transferId}`}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('inventory.trf_desc', 'Transfer inventory items between warehouse locations.')}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold text-xs shadow-2xs cursor-pointer active:scale-95 shrink-0"
        >
          <ArrowLeft size={16} />
          <span>{t('inventory.backToTransfers', 'Back to Stock Transfers')}</span>
        </button>
      </div>

      {/* ─── LIVE TRANSFER ROUTE CONNECTOR BANNER ─── */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles size={14} className="text-primary" />
            {t('inventory.transferRoute', 'Warehouse Transfer Route')}
          </span>
          {isSameWarehouse && (
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
              <AlertTriangle size={13} />
              {t('inventory.sameWarehouseWarning', 'Source and destination warehouses must be different!')}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          {/* Source Hub Pill */}
          <div className="md:col-span-5 flex items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <Warehouse size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                {t('inventory.from_warehouse', 'Source Warehouse')}
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate block mt-0.5">
                {fromWarehouseObj?.name || t('inventory.selectSourceWarehouse', 'Select Source Warehouse...')}
              </span>
            </div>
          </div>

          {/* Route Pipeline Arrow Connector */}
          <div className="md:col-span-1 flex items-center justify-center py-1">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-2xs">
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Destination Hub Pill */}
          <div className="md:col-span-5 flex items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              <Warehouse size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                {t('inventory.to_warehouse', 'Destination Warehouse')}
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate block mt-0.5">
                {toWarehouseObj?.name || t('inventory.selectDestinationWarehouse', 'Select Destination Warehouse...')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Warehouse Route & Notes Config */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 h-fit">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Info size={16} className="text-primary" />
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                {t('inventory.generalInfoCard', 'GENERAL INFORMATION')}
              </h3>
            </div>

            {!isDraft ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-bold mb-0.5">
                    {t('inventory.from_warehouse', 'Source Warehouse')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block text-sm">
                    {fromWarehouseObj?.name || 'Unknown Warehouse'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-bold mb-0.5">
                    {t('inventory.to_warehouse', 'Destination Warehouse')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block text-sm">
                    {toWarehouseObj?.name || 'Unknown Warehouse'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-bold mb-0.5">
                    {t('inventory.notes', 'Notes')}
                  </span>
                  <span className="font-medium text-slate-600 dark:text-slate-300 block italic bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    "{notes || '—'}"
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Source Warehouse Select */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('inventory.from_warehouse', 'Source Warehouse')} <span className="text-rose-500">*</span>
                  </label>
                  <ModernSelect
                    value={fromWarehouseId}
                    onChange={(val) => setFromWarehouseId(String(val))}
                    options={[
                      { value: '', label: t('inventory.selectSourceWarehouse', 'Select Source Warehouse...') },
                      ...(warehouses ?? []).map((w: any) => ({ value: w.id, label: w.name })),
                    ]}
                    placeholder={t('inventory.selectSourceWarehouse', 'Select Source Warehouse...')}
                  />
                </div>

                {/* Destination Warehouse Select */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('inventory.to_warehouse', 'Destination Warehouse')} <span className="text-rose-500">*</span>
                  </label>
                  <ModernSelect
                    value={toWarehouseId}
                    onChange={(val) => setToWarehouseId(String(val))}
                    options={[
                      { value: '', label: t('inventory.selectDestinationWarehouse', 'Select Destination Warehouse...') },
                      ...(warehouses ?? []).map((w: any) => ({ value: w.id, label: w.name })),
                    ]}
                    placeholder={t('inventory.selectDestinationWarehouse', 'Select Destination Warehouse...')}
                  />
                </div>

                {/* Priority Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('inventory.priority', 'Priority Level')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPriority('normal')}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        priority === 'normal'
                          ? 'bg-primary/10 text-primary border-primary/30 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {t('inventory.priorityNormal', 'Normal')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriority('high')}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        priority === 'high'
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {t('inventory.priorityHigh', 'High')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriority('urgent')}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        priority === 'urgent'
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {t('inventory.priorityUrgent', 'Urgent')}
                    </button>
                  </div>
                </div>

                {/* Notes Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('inventory.notes', 'Notes')}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder={t('inventory.transferNotesPlaceholder', 'Detailed notes or transfer reference...')}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none font-medium"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Transfer Items Manager */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-primary" />
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    {t('inventory.transferItems', 'TRANSFER ITEMS')}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-bold border border-primary/20">
                    <span className="font-mono">{items.length}</span> {t('inventory.linesCount', 'items')}
                  </span>
                </div>

                {isDraft && (
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-primary rounded-xl flex items-center gap-1.5 shadow-2xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>{t('inventory.addItem', 'Add Item')}</span>
                  </button>
                )}
              </div>

              {/* Items Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60">
                      <th className="py-3 px-4">{t('inventory.colProductManagement', 'PRODUCT / SKU')}</th>
                      <th className="py-3 px-4 w-44">{t('inventory.qty_requested', 'REQ QTY')}</th>
                      {(isInTransit || isReceived) && <th className="py-3 px-4 w-36">{t('inventory.qty_received', 'REC QTY')}</th>}
                      {isDraft && <th className="py-3 px-4 w-12 text-center"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs font-semibold">
                    {items.map((item, idx) => {
                      const productObj = products?.find((p: any) => p.id.toString() === item.product_id)
                      return (
                        <tr key={idx} className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                          {/* Product Selector */}
                          <td className="py-3.5 px-4">
                            {!isDraft ? (
                              <div className="space-y-0.5">
                                <span className="text-xs text-slate-900 dark:text-slate-100 font-bold block">
                                  {productObj?.name || 'Unknown Product'}
                                </span>
                                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block">
                                  {productObj?.sku || 'SKU-0000'}
                                </span>
                              </div>
                            ) : (
                              <ModernSelect
                                value={item.product_id}
                                onChange={(val) => handleItemChange(idx, 'product_id', String(val))}
                                options={[
                                  { value: '', label: t('inventory.selectProduct', t('products.selectProduct', 'Select Product...')) },
                                  ...(products ?? []).map((p: any) => ({
                                    value: p.id,
                                    label: p.name,
                                    code: p.sku,
                                  })),
                                ]}
                                placeholder={t('inventory.selectProduct', t('products.selectProduct', 'Select Product...'))}
                              />
                            )}
                          </td>

                          {/* Requested Qty Input & Stepper */}
                          <td className="py-3.5 px-4">
                            {!isDraft ? (
                              <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100">
                                {item.quantity}
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleStepQuantity(idx, -1)}
                                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95"
                                >
                                  <Minus size={13} />
                                </button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value, 10) || 0)}
                                  required
                                  min="1"
                                  step="1"
                                  className="w-16 h-8 px-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono font-bold text-center text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleStepQuantity(idx, 1)}
                                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Received Qty */}
                          {isInTransit && (
                            <td className="py-3.5 px-4">
                              <input
                                type="number"
                                value={item.quantity_received ?? item.quantity}
                                onChange={(e) => handleItemChange(idx, 'quantity_received', parseInt(e.target.value, 10) || 0)}
                                required
                                min="0"
                                step="1"
                                className="w-full h-8 px-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs focus:outline-none"
                              />
                            </td>
                          )}

                          {isReceived && (
                            <td className="py-3.5 px-4 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {item.quantity_received}
                            </td>
                          )}

                          {/* Delete Item Action */}
                          {isDraft && (
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                className="p-1.5 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-500/20"
                                title={t('common.delete', 'Remove Item')}
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
                        <td colSpan={isDraft ? 3 : 2} className="text-center py-12 text-slate-400 text-xs">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Package size={36} className="text-slate-300 dark:text-slate-700" />
                            <p className="font-semibold text-slate-600 dark:text-slate-300">
                              {t('inventory.noTransferItemsYet', 'No items added to this transfer yet.')}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {t('inventory.clickAddItemToSelect', 'Click Add Item above to select products.')}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Summary Bar */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-bold">
                {t('inventory.totalUnits', 'Total Units')}:
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                <span className="font-mono">{totalRequestedUnits}</span> {t('inventory.units', t('products.units', 'units'))}
              </span>
            </div>
          </div>
        </div>

        {/* Floating Bottom Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {items.length > 0 ? (
              <span>{t('inventory.configuredItemsForTransfer', '{{count}} item(s) configured for transfer', { count: items.length })}</span>
            ) : (
              <span>{t('inventory.addAtLeastOneItemHint', 'Please add at least 1 item to proceed')}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900 cursor-pointer active:scale-95"
            >
              {t('common.cancel', 'Cancel')}
            </button>

            {isEdit && isDraft && (
              <button
                type="button"
                onClick={() => shipMutation.mutate()}
                disabled={shipMutation.isPending}
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {shipMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
                <span>{t('inventory.shipTransfer', 'Ship Transfer')}</span>
              </button>
            )}

            {isEdit && isInTransit && (
              <button
                type="button"
                onClick={handleReceiveSubmit}
                disabled={receiveMutation.isPending}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {receiveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                <span>{t('inventory.receiveTransfer', 'Receive Transfer')}</span>
              </button>
            )}

            {isDraft && (
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="px-6 py-2.5 text-xs font-bold text-white bg-primary hover:opacity-90 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {saveMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Clock size={15} />}
                <span>{isEdit ? t('inventory.saveTransfer', 'Save Changes') : t('inventory.createTransfer', 'Create Transfer')}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default StockTransferForm
