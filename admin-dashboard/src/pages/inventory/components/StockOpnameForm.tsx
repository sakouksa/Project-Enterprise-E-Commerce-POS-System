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



  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/80 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <span>{isEdit ? t('inventory.opname_details', 'Stock Opname Details') : t('inventory.create_opname', 'New Stock Opname Audit')}</span>
            {isEdit && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-muted border border-border/80 text-muted-foreground font-semibold">
                {detail?.reference_number || `OPN-${opnameId}`}
              </span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{t('inventory.opname_desc', 'Snap system stock snapshot and verify physical inventory counts.')}</p>
        </div>

        {/* Back Button on Right Side with Text */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all font-semibold text-xs shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft size={16} />
          <span>Back to Stock Opnames</span>
        </button>
      </div>

      {/* Top Banner Card - Status Banner */}
      {isEdit && (
        <div className="bg-muted/30 border border-border/70 rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-card border border-border/80 flex items-center justify-center text-primary shadow-2xs shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="text-sm font-bold text-foreground truncate">{detail?.reference_number || `OPN-${opnameId}`}</h3>
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
      <form onSubmit={handleStartOpname} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: General Information Card */}
          <div className="lg:col-span-1 bg-card border border-border/80 rounded-2xl p-6 space-y-5 shadow-sm h-fit">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Info size={16} className="text-primary" />
              <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                GENERAL INFORMATION
              </h3>
            </div>

            {isEdit ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 gap-y-3.5">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium mb-0.5">{t('products.warehouse', 'Warehouse Hub')}</span>
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
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                    {t('products.warehouse', 'Warehouse Hub')} <span className="text-rose-500">*</span>
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
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('inventory.notes', 'Notes')}</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Audit description or reference..."
                    className="w-full p-3 rounded-xl border border-border bg-card text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Count Verification Card */}
          <div className="lg:col-span-2 bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <Package size={16} className="text-primary" />
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">COUNT VERIFICATION</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/30">
                      <th className="py-3 px-4">{t('products.title', 'PRODUCT MANAGEMENT')}</th>
                      <th className="py-3 px-4 w-28">{t('inventory.system_qty', 'SYSTEM QTY')}</th>
                      <th className="py-3 px-4 w-32">{t('inventory.physical_qty', 'PHYSICAL QTY')}</th>
                      <th className="py-3 px-4 w-24">{t('inventory.variance', 'VARIANCE')}</th>
                      <th className="py-3 px-4">{t('inventory.notes', 'ITEM NOTES')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs text-foreground font-medium">
                    {items.map((item, idx) => {
                      const variance = item.physical_quantity - item.system_quantity
                      return (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="space-y-0.5">
                              <span className="font-bold text-xs text-foreground block">{item.product?.name}</span>
                              <span className="font-mono text-[10px] text-muted-foreground block">{item.product?.sku}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-xs font-bold text-foreground">
                            {item.system_quantity}
                          </td>
                          <td className="py-3 px-4 text-xs text-foreground">
                            {isDone ? (
                              <span className="font-bold text-sm">{item.physical_quantity}</span>
                            ) : (
                              <input
                                type="number"
                                value={item.physical_quantity}
                                onChange={(e) => handleItemChange(idx, 'physical_quantity', parseInt(e.target.value, 10) || 0)}
                                required
                                min="0"
                                step="1"
                                className="w-full p-2 rounded-xl border border-border bg-card text-foreground font-bold text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              />
                            )}
                          </td>
                          <td className={`py-3 px-4 text-xs font-bold ${variance > 0 ? 'text-emerald-600' : variance < 0 ? 'text-rose-600' : 'text-muted-foreground'}`}>
                            {variance > 0 ? `+${variance}` : variance}
                          </td>
                          <td className="py-3 px-4 text-xs text-foreground">
                            {isDone ? (
                              <span className="text-muted-foreground font-normal italic">{item.notes || '—'}</span>
                            ) : (
                              <input
                                type="text"
                                value={item.notes}
                                onChange={(e) => handleItemChange(idx, 'notes', e.target.value)}
                                placeholder="Reason for diff..."
                                className="w-full p-2 rounded-xl border border-border bg-card text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              />
                            )}
                          </td>
                        </tr>
                      )
                    })}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-xs text-muted-foreground">
                          <div className="space-y-2">
                            <Package size={32} className="mx-auto text-muted-foreground/40" />
                            <p className="font-semibold">No inventory records snapped for this warehouse yet.</p>
                            <p className="text-[11px]">Select a warehouse and click <span className="text-primary font-bold">Start Audit Snapshot</span>.</p>
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
            {isEdit ? (
              <span>Auditing <span className="font-bold text-foreground">{items.length}</span> item(s) in warehouse snapshot</span>
            ) : (
              <span>Select a warehouse location to start audit count</span>
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

            {!isEdit && (
              <button
                type="button"
                onClick={handleStartOpname}
                disabled={createMutation.isPending}
                className="px-6 py-2.5 text-xs font-bold text-white bg-primary rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                {createMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Warehouse size={15} />}
                <span>Start Audit Snapshot</span>
              </button>
            )}

            {isEdit && isDraft && (
              <button
                type="button"
                onClick={handleCompleteOpname}
                disabled={completeMutation.isPending}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer"
              >
                {completeMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                <span>Verify & Reconcile</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
export default StockOpnameForm
