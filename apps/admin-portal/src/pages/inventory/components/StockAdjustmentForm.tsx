import React, { useState, useEffect, useMemo } from 'react'
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Loader2,
  Package,
  Info,
  Warehouse,
  Sliders,
  Minus,
  RotateCcw,
} from 'lucide-react'
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
  const { t } = useTranslation(['inventory', 'buttons', 'common', 'products'])
  const toast = useToast()
  const qc = useQueryClient()
  const isEdit = !!adjustmentId

  // Form States
  const [warehouseId, setWarehouseId] = useState('')
  const [type, setType] = useState<'addition' | 'subtraction' | 'recount'>('addition')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<Array<{ product_id: string; variant_id: string; quantity: number; product?: any }>>([
    { product_id: '', variant_id: '', quantity: 1 }
  ])

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
      setType((detail.type as any) || 'addition')
      setReason(detail.reason || '')
      setNotes(detail.notes || '')
      if (detail.items && detail.items.length > 0) {
        setItems(detail.items.map((it: any) => ({
          product_id: it.product_id?.toString() || '',
          variant_id: it.product_variant_id?.toString() || '',
          quantity: Math.abs(parseFloat(it.quantity_adjusted)) || 1,
          product: it.product,
        })))
      }
    }
  }, [detail])

  // Computed Values
  const selectedWarehouseObj = useMemo(
    () => warehouses?.find((w: any) => w.id.toString() === warehouseId),
    [warehouses, warehouseId]
  )

  const totalAdjustedUnits = useMemo(
    () => items.reduce((acc, curr) => acc + (parseInt(String(curr.quantity)) || 0), 0),
    [items]
  )

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
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      toast.success(isEdit
        ? t('inventory.transferUpdatedSuccess', 'Stock adjustment updated successfully')
        : t('inventory.transferCreatedSuccess', 'Stock adjustment created successfully')
      )
      onClose()
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err?.message || 'Unexpected server error.'
      toast.error(`${t('inventory.transferSaveError', 'Failed to save adjustment')}: ${errMsg}`)
    }
  })

  const approveMutation = useMutation({
    mutationFn: () => api.post(`/stock-adjustments/${adjustmentId}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-adjustments'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      toast.success(t('inventory.transferReceivedSuccess', 'Stock adjustment approved and stock levels recalculated'))
      onClose()
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err?.message || 'Unexpected server error.'
      toast.error(`${t('inventory.adjApproveError', 'Failed to approve stock adjustment')}: ${errMsg}`)
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!warehouseId) {
      toast.error(t('inventory.selectWarehouse', 'Please select a warehouse.'))
      return
    }

    const validItems = items.filter(it => !!it.product_id && (parseInt(String(it.quantity)) || 0) > 0)
    if (validItems.length === 0) {
      toast.error(t('inventory.addAtLeastOneItemHint', 'Please add at least 1 item to proceed'))
      return
    }

    const payload = {
      warehouse_id: parseInt(warehouseId),
      type,
      reason,
      notes,
      items: validItems.map(it => ({
        product_id: parseInt(it.product_id),
        variant_id: it.variant_id ? parseInt(it.variant_id) : null,
        quantity: parseFloat(it.quantity.toString()),
      }))
    }

    saveMutation.mutate(payload)
  }

  if (isEdit && loadingDetail) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <Loader2 className="animate-spin mx-auto mb-3 text-primary" size={28} />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading Details...</p>
      </div>
    )
  }

  const isApproved = detail?.status === 'approved'

  return (
    <div className="space-y-6">
      {/* Top Page Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Sliders size={20} />
            </div>
            <span>
              {isEdit
                ? t('inventory.view_adj', 'Stock Adjustment Details')
                : t('inventory.create_adj', 'Create New Stock Adjustment')}
            </span>
            {isEdit && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                {detail?.reference_number || `ADJ-${adjustmentId}`}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('inventory.adj_desc', 'Adjust warehouse stock quantities with audit tracking.')}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold text-xs shadow-2xs cursor-pointer active:scale-95 shrink-0"
        >
          <ArrowLeft size={16} />
          <span>{t('inventory.backToAdjustments', 'Back to Stock Adjustments')}</span>
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: General Information */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 h-fit">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Info size={16} className="text-primary" />
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                {t('inventory.generalInfoCard', 'GENERAL INFORMATION')}
              </h3>
            </div>

            {isApproved ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-bold mb-0.5">
                    {t('inventory.warehouse', 'Warehouse Hub')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block text-sm">
                    {selectedWarehouseObj?.name || 'Unknown Warehouse'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-bold mb-0.5">
                    {t('inventory.type', 'Adjustment Type')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block capitalize">
                    {type}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-bold mb-0.5">
                    {t('inventory.reason', 'Reason')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    {reason || '—'}
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
                {/* Warehouse Select */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('inventory.warehouse', 'Warehouse Hub')} <span className="text-rose-500">*</span>
                  </label>
                  <ModernSelect
                    value={warehouseId}
                    onChange={(val) => setWarehouseId(String(val))}
                    options={[
                      { value: '', label: t('inventory.selectWarehouse', 'Select Warehouse...') },
                      ...(warehouses ?? []).map((w: any) => ({ value: w.id, label: w.name })),
                    ]}
                    placeholder={t('inventory.selectWarehouse', 'Select Warehouse...')}
                  />
                </div>

                {/* Adjustment Type Selector Buttons */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('inventory.type', 'Adjustment Type')} <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setType('addition')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        type === 'addition'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <Plus size={14} />
                      <span className="text-[10px]">{t('inventory.typeAddition', 'Addition (+)')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setType('subtraction')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        type === 'subtraction'
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <Minus size={14} />
                      <span className="text-[10px]">{t('inventory.typeSubtraction', 'Subtraction (-)')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setType('recount')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        type === 'recount'
                          ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <RotateCcw size={14} />
                      <span className="text-[10px]">{t('inventory.typeRecount', 'Recount')}</span>
                    </button>
                  </div>
                </div>

                {/* Reason Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('inventory.reason', 'Reason')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    placeholder={t('inventory.reasonPlaceholder', 'e.g. Broken stock, discrepancy...')}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium"
                  />
                </div>

                {/* Notes Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('inventory.notes', 'Notes')}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder={t('inventory.notesPlaceholder', 'Detailed explanation...')}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none font-medium"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Adjustment Items Manager */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-primary" />
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    {t('inventory.adjustmentItems', 'ADJUSTMENT ITEMS')}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-bold border border-primary/20">
                    <span className="font-mono">{items.length}</span> {t('inventory.linesCount', 'items')}
                  </span>
                </div>

                {!isApproved && (
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
                      <th className="py-3 px-4 w-44">{t('inventory.qty_adjusted', 'ADJUST QTY')}</th>
                      {!isApproved && <th className="py-3 px-4 w-12 text-center"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs font-semibold">
                    {items.map((item, idx) => {
                      const productObj = products?.find((p: any) => p.id.toString() === item.product_id) || item.product
                      return (
                        <tr key={idx} className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                          {/* Product Selector */}
                          <td className="py-3.5 px-4">
                            {isApproved ? (
                              <div className="space-y-0.5">
                                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                                  {productObj?.name || 'Unknown Product'}
                                </span>
                                {productObj?.sku && (
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">
                                    {productObj.sku}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <ModernSelect
                                value={item.product_id}
                                onChange={(val) => handleItemChange(idx, 'product_id', String(val))}
                                options={[
                                  { value: '', label: t('inventory.selectProduct', t('products.selectProduct', 'Select Product...')) },
                                  ...(item.product && !(products ?? []).some((p: any) => p.id.toString() === item.product_id)
                                    ? [{ value: item.product.id.toString(), label: `${item.product.name} (${item.product.sku})` }]
                                    : []),
                                  ...(products ?? []).map((p: any) => ({
                                    value: p.id.toString(),
                                    label: p.name,
                                    code: p.sku,
                                  })),
                                ]}
                                placeholder={t('inventory.selectProduct', t('products.selectProduct', 'Select Product...'))}
                              />
                            )}
                          </td>

                          {/* Quantity Input & Stepper */}
                          <td className="py-3.5 px-4">
                            {isApproved ? (
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

                          {/* Delete Item Action */}
                          {!isApproved && (
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
                        <td colSpan={isApproved ? 2 : 3} className="text-center py-12 text-slate-400 text-xs">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Package size={36} className="text-slate-300 dark:text-slate-700" />
                            <p className="font-semibold text-slate-600 dark:text-slate-300">
                              {t('inventory.noAdjustmentItemsYet', 'No items added to this adjustment yet.')}
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
                <span className="font-mono">{totalAdjustedUnits}</span> {t('inventory.units', t('products.units', 'units'))}
              </span>
            </div>
          </div>
        </div>

        {/* Floating Bottom Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {items.length > 0 ? (
              <span>{t('inventory.configuredItemsForAdjustment', '{{count}} item(s) configured for stock adjustment', { count: items.length })}</span>
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

            {!isApproved && (
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="px-6 py-2.5 text-xs font-bold text-white bg-primary hover:opacity-90 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {saveMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Clock size={15} />}
                <span>{isEdit ? t('inventory.saveAdjustment', 'Save Changes') : t('inventory.saveAdjustment', 'Save Adjustment')}</span>
              </button>
            )}

            {isEdit && !isApproved && (
              <button
                type="button"
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {approveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                <span>{t('inventory.approveAdjustment', 'Approve Adjustment')}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default StockAdjustmentForm
