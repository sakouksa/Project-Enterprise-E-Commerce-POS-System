import React, { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, Clock, Loader2, Warehouse, FileText, User, Package } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/useToast'

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
              {isEdit ? `${t('inventory.opname', 'Stock Opname')}: ${detail?.reference_number}` : t('inventory.create_opname', 'New Stock Opname count')}
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
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-xl flex items-center gap-1.5 shadow-sm hover:opacity-90"
            >
              {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Warehouse size={14} />}
              {t('buttons.start_opname', 'Start Count Snapshot')}
            </button>
          )}
          {isEdit && isDraft && (
            <button
              onClick={handleCompleteOpname}
              disabled={completeMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-emerald-500"
            >
              {completeMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              {t('buttons.complete_opname', 'Verify & Reconcile')}
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {isEdit && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-muted-foreground uppercase font-semibold">{t('inventory.status', 'Status')}</span>
              <span className={`block text-lg font-bold mt-1 uppercase
                             ${isDone ? 'text-emerald-500' : 'text-amber-500'}`}>
                {status}
              </span>
            </div>
            <div className="p-3 bg-muted/20 rounded-xl">
              <FileText size={18} />
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
              <span className="text-xs text-muted-foreground uppercase font-semibold">{t('inventory.variance', 'Net Discrepancy')}</span>
              <span className={`block text-lg font-bold mt-1
                             ${totalDiff > 0 ? 'text-emerald-500' : totalDiff < 0 ? 'text-rose-500' : 'text-foreground'}`}>
                {totalDiff > 0 ? `+${totalDiff}` : totalDiff}
              </span>
            </div>
            <div className="p-3 bg-muted/20 rounded-xl">
              <FileText size={18} />
            </div>
          </div>
          <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-muted-foreground uppercase font-semibold">{t('inventory.auditor', 'Counted By')}</span>
              <span className="block text-sm font-semibold text-foreground mt-1">{detail?.user?.name || '—'}</span>
            </div>
            <div className="p-3 bg-muted/20 rounded-xl">
              <User size={18} />
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: General Info */}
        <div className="lg:col-span-1 bg-card border border-border/50 rounded-2xl p-5 space-y-4 shadow-sm h-fit">
          <h3 className="text-sm font-bold text-foreground font-semibold uppercase tracking-wider">{t('inventory.general_info', 'General Info')}</h3>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">{t('products.warehouse', 'Warehouse')}</label>
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              required
              disabled={isEdit}
              className="form-input"
            >
              <option value="">Select Warehouse Location</option>
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
              disabled={isDone}
              rows={3}
              placeholder="Details or reference..."
              className="form-input"
            />
          </div>
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
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={item.physical_quantity}
                            onChange={(e) => handleItemChange(idx, 'physical_quantity', parseFloat(e.target.value) || 0)}
                            required
                            min="0"
                            disabled={isDone}
                            className="form-input text-xs"
                          />
                        </td>
                        <td className={`py-2 px-3 text-xs font-bold
                                       ${variance > 0 ? 'text-emerald-500' : variance < 0 ? 'text-rose-500' : 'text-muted-foreground'}`}>
                          {variance > 0 ? `+${variance}` : variance}
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => handleItemChange(idx, 'notes', e.target.value)}
                            disabled={isDone}
                            placeholder="Item note"
                            className="form-input text-xs"
                          />
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
