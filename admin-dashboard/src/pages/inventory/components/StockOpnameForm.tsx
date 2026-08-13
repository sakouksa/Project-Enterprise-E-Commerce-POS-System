import React, { useState, useEffect, useMemo } from 'react'
import {
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Warehouse,
  Package,
  Info,
  Plus,
  Minus,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/useToast'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'

interface StockOpnameFormProps {
  opnameId?: number | null
  onClose: () => void
}

export const StockOpnameForm: React.FC<StockOpnameFormProps> = ({ opnameId, onClose }) => {
  const { t } = useTranslation(['inventory', 'buttons', 'common', 'products'])
  const toast = useToast()
  const qc = useQueryClient()
  const [currentOpnameId, setCurrentOpnameId] = useState<number | null>(opnameId || null)
  const isEdit = !!currentOpnameId

  // Form States
  const [warehouseId, setWarehouseId] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<Array<{ id: number; product: any; system_quantity: number; physical_quantity: number; notes: string }>>([])

  // Queries
  const { data: detail, isLoading: loadingDetail } = useQuery({
    queryKey: ['stock-opname-detail', currentOpnameId],
    queryFn: () => api.get(`/stock-opnames/${currentOpnameId}`).then(r => r.data.data),
    enabled: isEdit,
  })

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses-list'],
    queryFn: () => api.get('/warehouses').then(r => r.data.data),
  })

  // Auto fill form if editing
  useEffect(() => {
    if (detail) {
      setWarehouseId(detail.warehouse_id?.toString() || '')
      setNotes(detail.notes || '')
      if (detail.items) {
        setItems(detail.items.map((it: any) => ({
          id: it.id,
          product: it.product,
          system_quantity: parseFloat(it.system_quantity) || 0,
          physical_quantity: it.physical_quantity !== null ? parseFloat(it.physical_quantity) : parseFloat(it.system_quantity),
          notes: it.notes || '',
        })))
      }
    }
  }, [detail])

  // Computed Values
  const selectedWarehouseObj = useMemo(
    () => warehouses?.find((w: any) => w.id.toString() === warehouseId),
    [warehouses, warehouseId]
  )

  const totalDiff = useMemo(
    () => items.reduce((acc, it) => acc + (it.physical_quantity - it.system_quantity), 0),
    [items]
  )

  const totalSystemUnits = useMemo(
    () => items.reduce((acc, it) => acc + (it.system_quantity || 0), 0),
    [items]
  )

  const totalPhysicalUnits = useMemo(
    () => items.reduce((acc, it) => acc + (it.physical_quantity || 0), 0),
    [items]
  )

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/stock-opnames', payload),
    onSuccess: (res: any) => {
      const created = res?.data?.data || res?.data
      if (created?.id) {
        setCurrentOpnameId(created.id)
        qc.invalidateQueries({ queryKey: ['stock-opnames'] })
        qc.invalidateQueries({ queryKey: ['stock-opname-detail', created.id] })
        toast.success(t('inventory.draftCreatedSuccess', 'Stock opname created as draft and warehouse stock levels snapped'))
      } else {
        qc.invalidateQueries({ queryKey: ['stock-opnames'] })
        onClose()
      }
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err?.message || 'Unexpected server error.'
      toast.error(`${t('inventory.opnameStartError', 'Failed to start stock opname')}: ${errMsg}`)
    }
  })

  const completeMutation = useMutation({
    mutationFn: (opnameItems: any) => api.post(`/stock-opnames/${currentOpnameId}/complete`, { items: opnameItems }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock-opnames'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      toast.success(t('inventory.reconcileSuccess', 'Stock opname count completed and discrepancies reconciled'))
      onClose()
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err?.message || 'Unexpected server error.'
      toast.error(`${t('inventory.opnameCompleteError', 'Failed to complete stock opname')}: ${errMsg}`)
    }
  })

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value }
      }
      return item
    }))
  }

  const handleStepPhysicalQuantity = (index: number, delta: number) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        const current = parseInt(String(item.physical_quantity)) || 0
        const nextVal = Math.max(0, current + delta)
        return { ...item, physical_quantity: nextVal }
      }
      return item
    }))
  }

  const handleStartOpname = (e: React.FormEvent) => {
    e.preventDefault()
    if (!warehouseId) {
      toast.error(t('inventory.selectWarehouseHint', 'Please select a warehouse location to start audit count'))
      return
    }
    createMutation.mutate({
      warehouse_id: parseInt(warehouseId),
      notes,
    })
  }

  const handleCompleteOpname = (e: React.FormEvent) => {
    e.preventDefault()
    const opnameItems = items.map(it => ({
      id: it.id,
      physical_quantity: parseFloat(it.physical_quantity.toString()),
      notes: it.notes,
    }))
    completeMutation.mutate(opnameItems)
  }

  const formatNoteText = (noteText: string) => {
    if (!noteText) return ''
    if (noteText === 'Initial snapshot') return t('initialSnapshot', t('inventory.initialSnapshot', 'Initial snapshot'))
    if (noteText.includes('Initial snapshot (0 stock)')) return t('initialSnapshotZero', t('inventory.initialSnapshotZero', 'Initial snapshot (0 stock)'))
    return noteText
  }

  if (isEdit && loadingDetail) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <Loader2 className="animate-spin mx-auto mb-3 text-primary" size={28} />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading Details...</p>
      </div>
    )
  }

  const status = detail?.status || (isEdit ? 'loading' : 'draft')
  const isDraft = status === 'draft'
  const isDone = status === 'done' || status === 'completed'

  return (
    <div className="space-y-6">
      {/* Top Page Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <CheckCircle2 size={20} />
            </div>
            <span>
              {isEdit
                ? t('opnameDetails', t('opname_details', t('inventory.opname_details', 'Stock Opname Details')))
                : t('create_opname', t('inventory.create_opname', 'New Stock Opname Audit'))}
            </span>
            {isEdit && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                {detail?.reference_number || `OPN-${currentOpnameId}`}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('opname_desc', t('inventory.opname_desc', 'Snap system stock snapshot and verify physical inventory counts.'))}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold text-xs shadow-2xs cursor-pointer active:scale-95 shrink-0"
        >
          <ArrowLeft size={16} />
          <span>{t('backToOpnames', t('inventory.backToOpnames', 'Back to Stock Opnames'))}</span>
        </button>
      </div>

      {/* Top Banner Card - Status Banner */}
      {isEdit && (
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-primary shadow-2xs shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{detail?.reference_number || `OPN-${currentOpnameId}`}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {t('warehouse', t('inventory.warehouse', 'Warehouse Hub'))}: {detail?.warehouse?.name || 'Main Warehouse'}
            </p>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                isDone ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
              }`}>
                {isDone
                  ? t('statusDone', t('inventory.statusDone', t('common.completed', 'Completed')))
                  : t('statusDraft', t('inventory.statusDraft', t('common.draft', 'Draft')))}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleStartOpname} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: General Information Card */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 h-fit">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Info size={16} className="text-primary" />
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                {t('inventory.generalInfoCard', 'GENERAL INFORMATION')}
              </h3>
            </div>

            {isEdit ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-bold mb-0.5">
                    {t('inventory.warehouse', 'Warehouse Hub')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block text-sm">
                    {selectedWarehouseObj?.name || detail?.warehouse?.name || 'Unknown Warehouse'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-bold mb-0.5">
                    {t('inventory.auditedItemsCount', 'Audited Items Count')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    <span className="font-mono">{items.length}</span> {t('inventory.linesCount', 'items')}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-bold mb-0.5">
                    {t('inventory.netDiscrepancyVariance', 'Net Discrepancy Variance')}
                  </span>
                  <span className={`font-mono font-bold text-sm block ${totalDiff > 0 ? 'text-emerald-600 dark:text-emerald-400' : totalDiff < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {totalDiff > 0 ? `+${totalDiff}` : totalDiff}
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
                {/* Warehouse Location Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('inventory.warehouse', 'Warehouse Hub')} <span className="text-rose-500">*</span>
                  </label>
                  <ModernSelect
                    value={warehouseId}
                    onChange={(val) => setWarehouseId(String(val))}
                    options={[
                      { value: '', label: t('inventory.selectWarehouseLocation', 'Select Warehouse Location...') },
                      ...(warehouses ?? []).map((w: any) => ({ value: w.id, label: w.name })),
                    ]}
                    placeholder={t('inventory.selectWarehouseLocation', 'Select Warehouse Location...')}
                  />
                </div>

                {/* Audit Notes Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('inventory.notes', 'Notes')}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder={t('inventory.auditDescPlaceholder', 'Audit description or reference...')}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none font-medium"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Count Verification Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-primary" />
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    {t('inventory.countVerification', 'COUNT VERIFICATION')}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-bold border border-primary/20">
                    <span className="font-mono">{items.length}</span> {t('inventory.linesCount', 'items')}
                  </span>
                </div>
              </div>

              {/* Items Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60">
                      <th className="py-3 px-4">{t('inventory.colProductManagement', 'PRODUCT / SKU')}</th>
                      <th className="py-3 px-4 w-32">{t('inventory.system_qty', 'System Qty')}</th>
                      <th className="py-3 px-4 w-44">{t('inventory.physical_qty', 'Physical Qty')}</th>
                      <th className="py-3 px-4 w-36">{t('inventory.variance', 'Net Discrepancy')}</th>
                      <th className="py-3 px-4">{t('inventory.itemNotes', 'Item Notes')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs font-semibold">
                    {items.map((item, idx) => {
                      const variance = item.physical_quantity - item.system_quantity
                      return (
                        <tr key={idx} className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                          {/* Product Info */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                                {item.product?.name || 'Unknown Product'}
                              </span>
                              {item.product?.sku && (
                                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block">
                                  {item.product.sku}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* System Qty Badge */}
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 inline-block">
                              {item.system_quantity}
                            </span>
                          </td>

                          {/* Physical Qty Input & Stepper */}
                          <td className="py-3.5 px-4">
                            {isDone ? (
                              <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100">
                                {item.physical_quantity}
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleStepPhysicalQuantity(idx, -1)}
                                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95"
                                >
                                  <Minus size={13} />
                                </button>
                                <input
                                  type="number"
                                  value={item.physical_quantity}
                                  onChange={(e) => handleItemChange(idx, 'physical_quantity', parseInt(e.target.value, 10) || 0)}
                                  required
                                  min="0"
                                  step="1"
                                  className="w-16 h-8 px-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono font-bold text-center text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleStepPhysicalQuantity(idx, 1)}
                                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Variance Badge */}
                          <td className="py-3.5 px-4 font-mono font-extrabold">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs ${
                              variance > 0
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : variance < 0
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                  : 'text-slate-500 dark:text-slate-400'
                            }`}>
                              {variance > 0 ? `+${variance}` : variance}
                            </span>
                          </td>

                          {/* Item Notes */}
                          <td className="py-3.5 px-4">
                            {isDone ? (
                              <span className="text-slate-500 dark:text-slate-400 font-normal italic">
                                "{formatNoteText(item.notes) || '—'}"
                              </span>
                            ) : (
                              <input
                                type="text"
                                value={formatNoteText(item.notes)}
                                onChange={(e) => handleItemChange(idx, 'notes', e.target.value)}
                                placeholder={t('reasonDiffPlaceholder', t('inventory.reasonDiffPlaceholder', 'Reason for diff...'))}
                                className="w-full p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-primary transition-all font-medium"
                              />
                            )}
                          </td>
                        </tr>
                      )
                    })}

                    {items.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-slate-400 text-xs">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Package size={36} className="text-slate-300 dark:text-slate-700" />
                            <p className="font-semibold text-slate-600 dark:text-slate-300">
                              {t('inventory.noOpnameRecordsYet', 'No inventory records snapped for this warehouse yet.')}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {t('inventory.selectWarehouseToStart', 'Select a warehouse and click Start Audit Snapshot.')}
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
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-bold text-[10px] uppercase">
                    {t('inventory.system_qty', 'System Qty')}
                  </span>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1">
                    <span className="font-mono">{totalSystemUnits}</span>
                    <span className="font-sans text-xs font-semibold text-slate-500 dark:text-slate-400">{t('inventory.units', t('products.units', 'units'))}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-bold text-[10px] uppercase">
                    {t('inventory.physical_qty', 'Physical Qty')}
                  </span>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1">
                    <span className="font-mono">{totalPhysicalUnits}</span>
                    <span className="font-sans text-xs font-semibold text-slate-500 dark:text-slate-400">{t('inventory.units', t('products.units', 'units'))}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-bold text-[10px] uppercase text-right">
                  {t('inventory.variance', 'Net Discrepancy')}
                </span>
                <div className={`font-black text-sm flex items-center justify-end gap-1 ${totalDiff > 0 ? 'text-emerald-600 dark:text-emerald-400' : totalDiff < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
                  <span className="font-mono">{totalDiff > 0 ? `+${totalDiff}` : totalDiff}</span>
                  <span className="font-sans text-xs font-semibold text-slate-500 dark:text-slate-400">{t('inventory.units', t('products.units', 'units'))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Bottom Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isEdit ? (
              <span>{t('inventory.auditingItemsCount', 'Auditing {{count}} item(s) in warehouse snapshot', { count: items.length })}</span>
            ) : (
              <span>{t('inventory.selectWarehouseHint', 'Select a warehouse location to start audit count')}</span>
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

            {!isEdit && (
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-6 py-2.5 text-xs font-bold text-white bg-primary hover:opacity-90 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {createMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Warehouse size={15} />}
                <span>{t('inventory.startAuditSnapshot', 'Start Audit Snapshot')}</span>
              </button>
            )}

            {isEdit && isDraft && (
              <button
                type="button"
                onClick={handleCompleteOpname}
                disabled={completeMutation.isPending}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {completeMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                <span>{t('inventory.verifyAndReconcile', 'Verify & Reconcile')}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default StockOpnameForm
