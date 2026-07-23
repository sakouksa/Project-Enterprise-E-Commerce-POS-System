import React, { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, CheckCircle2, Clock, Loader2, Warehouse, FileText, User, Package, X, Info } from 'lucide-react'
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
  const { t } = useTranslation()
  const toast = useToast()
  const qc = useQueryClient()
  const isEdit = !!opnameId

  // Form States
  const [warehouseId, setWarehouseId] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<Array<{ id: number; product: any; system_quantity: number; physical_quantity: number; notes: string }>>([])

  // Queries
  const { data: detail, isLoading: loadingDetail } = useQuery({
    queryKey: ['stock-opname-detail', opnameId],
    queryFn: () => api.get(`/stock-opnames/${opnameId}`).then(r => r.data.data),
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

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/stock-opnames', payload),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['stock-opnames'] })
      toast.success('Stock opname created as draft and warehouse stock levels snapped')
      // Switch view or reload
      onClose()
    },
    onError: () => toast.error('Failed to start stock opname.')
  })

  const completeMutation = useMutation({
    mutationFn: (opnameItems: any) => api.post(`/stock-opnames/${opnameId}/complete`, { items: opnameItems }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock-opnames'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      toast.success('Stock opname count completed and discrepancies reconciled')
      onClose()
    },
    onError: () => toast.error('Failed to complete stock opname.')
  })

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value }
      }
      return item
    }))
  }

  const handleStartOpname = (e: React.FormEvent) => {
    e.preventDefault()
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

  if (isEdit && loadingDetail) {
    return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto mb-2 text-primary" />Loading Details...</div>
  }

  const status = detail?.status || 'draft'
  const isDraft = status === 'draft'
  const isDone = status === 'done'

  // Calculate total positive and negative difference variances
  const totalDiff = items.reduce((acc, it) => acc + (it.physical_quantity - it.system_quantity), 0)

  if (!isEdit) {
    return (
      <form onSubmit={handleStartOpname} className="space-y-6 text-left">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {t('inventory.create_opname', 'New Stock Opname count')}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('inventory.opname_desc', 'Snap system stock level snapshot and verify physically.')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors cursor-pointer border border-border bg-card"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-5 py-2">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              {t('products.warehouse', 'Warehouse')} <span className="text-rose-500">*</span>
            </label>
            <ModernSelect
              value={warehouseId}
              onChange={(val) => setWarehouseId(String(val))}
              options={[
                { value: '', label: 'Select Warehouse Location' },
                ...(warehouses ?? []).map((w: any) => ({ value: w.id, label: w.name })),
              ]}
              placeholder="Select Warehouse Location"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              {t('inventory.notes', 'Notes')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Details or reference..."
              className="form-input rounded-xl"
            />
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all cursor-pointer"
          >
            {t('buttons.cancel', 'បោះបង់')}
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 hover:opacity-90 active:scale-95 cursor-pointer"
          >
            {createMutation.isPending && <Loader2 size={15} className="animate-spin" />}
            {t('inventory.start_counting', 'Start Audit Count')}
          </button>
        </div>
      </form>
    )
  }

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
              <span>{isEdit ? t('inventory.opname_details', 'Stock Opname Details') : t('inventory.create_opname', 'New Stock Opname count')}</span>
              {isEdit && (
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-muted border border-border/80 text-muted-foreground font-semibold">
                  {detail?.reference_number || `OPN-${opnameId}`}
                </span>
              )}
            </h2>
            <p className="text-xs text-muted-foreground">{t('inventory.opname_desc', 'Snap system stock level snapshot and verify physically.')}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isEdit && (
            <button
              onClick={handleStartOpname}
              disabled={createMutation.isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl flex items-center gap-1.5 shadow-sm hover:opacity-90 cursor-pointer"
            >
              {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Warehouse size={14} />}
              {t('buttons.start_opname', 'Start Count Snapshot')}
            </button>
          )}
          {isEdit && isDraft && (
            <button
              onClick={handleCompleteOpname}
              disabled={completeMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-emerald-500 cursor-pointer"
            >
              {completeMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              {t('buttons.complete_opname', 'Verify & Reconcile')}
            </button>
          )}
        </div>
      </div>

      {/* Top Banner Card - Exact Employee Profile Card Style */}
      {isEdit && (
        <div className="bg-muted/30 border border-border/70 rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-card border border-border/80 flex items-center justify-center text-primary shadow-2xs shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="text-base font-bold text-foreground truncate">{detail?.reference_number || `OPN-${opnameId}`}</h3>
            <p className="text-xs text-muted-foreground truncate">
              Warehouse Hub: {detail?.warehouse?.name || 'Main Warehouse'}
            </p>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                isDone ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
              }`}>
                {status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className={isEdit ? "grid grid-cols-1 lg:grid-cols-3 gap-6" : "w-full"}>
        {/* Left Side: General Info */}
        <div className={`${isEdit ? "lg:col-span-1" : "w-full"} bg-card border border-border/50 rounded-2xl p-6 space-y-5 shadow-sm h-fit`}>
          <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider border-b border-border/50 pb-2">
            GENERAL INFORMATION
          </h3>

          {isEdit ? (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-y-3">
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('products.warehouse', 'Warehouse')}</span>
                  <span className="font-bold text-foreground block">
                    {warehouses?.find((w: any) => w.id.toString() === warehouseId)?.name || 'Unknown Warehouse'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Audited Items Count</span>
                  <span className="font-bold text-foreground block">{items.length} items</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">Net Discrepancy Variance</span>
                  <span className={`font-bold block ${totalDiff > 0 ? 'text-emerald-600' : totalDiff < 0 ? 'text-rose-600' : 'text-foreground'}`}>
                    {totalDiff > 0 ? `+${totalDiff}` : totalDiff}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('inventory.auditor', 'Counted By')}</span>
                  <span className="font-bold text-foreground block">{detail?.user?.name || 'Super Admin'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('inventory.notes', 'Notes')}</span>
                  <span className="font-medium text-muted-foreground block italic">"{notes || '—'}"</span>
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
                    { value: '', label: 'Select Warehouse Location' },
                    ...(warehouses ?? []).map((w: any) => ({ value: w.id, label: w.name })),
                  ]}
                  placeholder="Select Warehouse Location"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">{t('inventory.notes', 'Notes')}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Details or reference..."
                  className="form-input"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: snapped items physical counts */}
        {isEdit && (
          <div className="lg:col-span-2 bg-card border border-border/50 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground font-semibold uppercase tracking-wider">{t('inventory.items', 'Count Verification')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20">
                    <th className="py-2.5 px-3">{t('products.title', 'Product')}</th>
                    <th className="py-2.5 px-3 w-28">{t('inventory.system_qty', 'System Qty')}</th>
                    <th className="py-2.5 px-3 w-28">{t('inventory.physical_qty', 'Physical Qty')}</th>
                    <th className="py-2.5 px-3 w-24">{t('inventory.variance', 'Diff')}</th>
                    <th className="py-2.5 px-3">{t('inventory.notes', 'Item Notes')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const variance = item.physical_quantity - item.system_quantity
                    return (
                      <tr key={idx} className="border-b border-border/20 last:border-0 hover:bg-muted/10">
                        <td className="py-2 px-3 text-xs text-foreground font-medium">
                          {item.product?.name} ({item.product?.sku})
                        </td>
                        <td className="py-2 px-3 text-xs text-foreground">
                          {item.system_quantity}
                        </td>
                        <td className="py-2 px-3 text-xs text-foreground">
                          {isDone ? (
                            <span className="font-semibold">{item.physical_quantity}</span>
                          ) : (
                            <input
                              type="number"
                              value={item.physical_quantity}
                              onChange={(e) => handleItemChange(idx, 'physical_quantity', parseInt(e.target.value, 10) || 0)}
                              required
                              min="0"
                              step="1"
                              className="form-input text-xs"
                            />
                          )}
                        </td>
                        <td className={`py-2 px-3 text-xs font-bold
                                       ${variance > 0 ? 'text-emerald-500' : variance < 0 ? 'text-rose-500' : 'text-muted-foreground'}`}>
                          {variance > 0 ? `+${variance}` : variance}
                        </td>
                        <td className="py-2 px-3 text-xs text-foreground">
                          {isDone ? (
                            <span className="text-muted-foreground font-normal italic">{item.notes || '—'}</span>
                          ) : (
                            <input
                              type="text"
                              value={item.notes}
                              onChange={(e) => handleItemChange(idx, 'notes', e.target.value)}
                              placeholder="Item note"
                              className="form-input text-xs"
                            />
                          )}
                        </td>
                      </tr>
                    )
                  })}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-xs text-muted-foreground">
                        {t('inventory.no_items', 'No inventory snap records found in this warehouse location.')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default StockOpnameForm
