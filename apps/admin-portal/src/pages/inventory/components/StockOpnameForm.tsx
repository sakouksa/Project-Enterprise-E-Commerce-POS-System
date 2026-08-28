import React, { useState, useEffect, useMemo } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Warehouse,
  Package,
  Info,
  Plus,
  Minus,
  Search,
  CheckCheck,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles,
  RotateCcw,
  Check
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/client'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/useToast'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'
import { motion, AnimatePresence } from 'framer-motion'

interface StockOpnameFormProps {
  opnameId?: number | null
  onClose: () => void
}

type FilterTab = 'all' | 'discrepancy' | 'matched' | 'surplus' | 'deficit'

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
  
  // Search & Filter state for counting matrix
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>('all')

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

  const discrepancyCount = useMemo(
    () => items.filter(it => it.physical_quantity !== it.system_quantity).length,
    [items]
  )

  const matchedCount = useMemo(
    () => items.filter(it => it.physical_quantity === it.system_quantity).length,
    [items]
  )

  const surplusCount = useMemo(
    () => items.filter(it => it.physical_quantity > it.system_quantity).length,
    [items]
  )

  const deficitCount = useMemo(
    () => items.filter(it => it.physical_quantity < it.system_quantity).length,
    [items]
  )

  // Filtered items list based on search and tab
  const filteredItems = useMemo(() => {
    return items.filter(it => {
      const pName = (it.product?.name || '').toLowerCase()
      const pSku = (it.product?.sku || '').toLowerCase()
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q || pName.includes(q) || pSku.includes(q)

      if (!matchesSearch) return false

      const diff = it.physical_quantity - it.system_quantity
      if (activeFilterTab === 'discrepancy') return diff !== 0
      if (activeFilterTab === 'matched') return diff === 0
      if (activeFilterTab === 'surplus') return diff > 0
      if (activeFilterTab === 'deficit') return diff < 0
      return true
    })
  }, [items, searchQuery, activeFilterTab])

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/stock-opnames', payload),
    onSuccess: (res: any) => {
      const created = res?.data?.data || res?.data
      if (created?.id) {
        setCurrentOpnameId(created.id)
        qc.invalidateQueries({ queryKey: ['stock-opnames'] })
        qc.invalidateQueries({ queryKey: ['inventory-opnames'] })
        qc.invalidateQueries({ queryKey: ['stock-opname-detail', created.id] })
        toast.success(t('draftCreatedSuccess', t('inventory.draftCreatedSuccess', 'Stock opname created and inventory snapshot taken successfully!')))
      } else {
        qc.invalidateQueries({ queryKey: ['stock-opnames'] })
        qc.invalidateQueries({ queryKey: ['inventory-opnames'] })
        onClose()
      }
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err?.message || 'Unexpected server error.'
      toast.error(`${t('opnameStartError', t('inventory.opnameStartError', 'Failed to start stock opname'))}: ${errMsg}`)
    }
  })

  const completeMutation = useMutation({
    mutationFn: (opnameItems: any) => api.post(`/stock-opnames/${currentOpnameId}/complete`, { items: opnameItems }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stock-opnames'] })
      qc.invalidateQueries({ queryKey: ['inventory-opnames'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      qc.invalidateQueries({ queryKey: ['inventory-dashboard-stats'] })
      toast.success(t('reconcileSuccess', t('inventory.reconcileSuccess', 'Stock opname count completed and discrepancies reconciled!')))
      onClose()
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || err?.message || 'Unexpected server error.'
      toast.error(`${t('opnameCompleteError', t('inventory.opnameCompleteError', 'Failed to complete stock opname'))}: ${errMsg}`)
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

  const handleSetAllToMatch = () => {
    setItems(prev => prev.map(it => ({
      ...it,
      physical_quantity: it.system_quantity,
      notes: ''
    })))
    toast.success(t('setAllMatchSuccess', 'All physical counts set to match system quantities.'))
  }

  const handleStartOpname = (e: React.FormEvent) => {
    e.preventDefault()
    if (!warehouseId) {
      toast.error(t('selectWarehouseHint', t('inventory.selectWarehouseHint', 'Please select a warehouse location to start audit count')))
      return
    }
    createMutation.mutate({
      warehouse_id: parseInt(warehouseId),
      notes,
    })
  }

  const handleCompleteOpname = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
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
      <div className="p-16 text-center bg-card rounded-2xl border border-border shadow-xs flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm font-bold text-foreground">{t('loadingOpnameData', 'Loading Stock Opname Data...')}</p>
        <p className="text-xs text-muted-foreground">{t('fetchingSnapshotDetails', 'Retrieving warehouse snapshot matrix...')}</p>
      </div>
    )
  }

  const status = detail?.status || (isEdit ? 'loading' : 'draft')
  const isDraft = status === 'draft'
  const isDone = status === 'done' || status === 'completed'

  return (
    <div className="space-y-6">
      
      {/* ─── Top Dedicated Header Bar ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/80 p-5 sm:p-6 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {isEdit
                  ? t('opnameDetails', t('inventory.opnameDetails', 'Stock Audit Details'))
                  : t('create_opname', t('inventory.create_opname', 'New Stock Audit'))}
              </h1>
              {isEdit && (
                <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-bold bg-muted text-foreground border border-border">
                  {detail?.reference_number || `OPN-${currentOpnameId}`}
                </span>
              )}
              {isEdit && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isDone
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}>
                  {isDone ? t('statusDone', 'Completed') : t('statusDraft', 'In Progress / Draft')}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('opname_desc', t('inventory.opname_desc', 'Snap real-time system stock snapshot and reconcile on-ground physical inventory.'))}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all font-bold text-xs shadow-xs cursor-pointer active:scale-95 shrink-0 self-start sm:self-center"
        >
          <ArrowLeft size={16} />
          <span>{t('backToOpnames', t('inventory.backToOpnames', 'Back to Stock List'))}</span>
        </button>
      </div>

      {/* ─── INITIAL CREATION SCREEN (Before Snapshot) ────────────────────── */}
      {!isEdit && (
        <form onSubmit={handleStartOpname} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Form Setup (5 cols) */}
            <div className="lg:col-span-5 bg-card border border-border/80 p-6 rounded-2xl shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 border-b border-border pb-3.5">
                <Info size={16} className="text-primary" />
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                  {t('generalInformation', t('inventory.generalInfoCard', 'Audit Parameters'))}
                </h3>
              </div>

              {/* Warehouse Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-foreground">
                  {t('warehouse', t('inventory.warehouse', 'Target Warehouse Location'))} <span className="text-rose-500">*</span>
                </label>
                <ModernSelect
                  value={warehouseId}
                  onChange={(val) => setWarehouseId(String(val))}
                  options={[
                    { value: '', label: t('selectWarehouseLocation', t('inventory.selectWarehouseLocation', 'Select Warehouse Location...')) },
                    ...(warehouses ?? []).map((w: any) => ({ value: w.id, label: w.name })),
                  ]}
                  placeholder={t('selectWarehouseLocation', t('inventory.selectWarehouseLocation', 'Select Warehouse Location...'))}
                />
                <p className="text-[11px] text-muted-foreground">
                  {t('warehouseSnapshotNotice', 'The system will instantly snap all products & current quantities in this warehouse.')}
                </p>
              </div>

              {/* Audit Notes */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-foreground">
                  {t('notes', t('inventory.notes', 'Audit Notes / Purpose'))}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder={t('auditDescPlaceholder', t('inventory.auditDescPlaceholder', 'e.g., Monthly Cycle Count, Mid-Year Audit, End-of-Week Reconciliation...'))}
                  className="w-full p-3.5 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none font-medium placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending || !warehouseId}
                  className="w-full py-3 text-xs font-bold text-white bg-primary hover:opacity-90 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{t('snappingInventory', 'Capturing Snapshot...')}</span>
                    </>
                  ) : (
                    <>
                      <Warehouse size={16} />
                      <span>{t('startAuditSnapshot', t('inventory.startAuditSnapshot', 'Start Stock Audit Snapshot'))}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Feature Card (7 cols) */}
            <div className="lg:col-span-7 bg-card border border-border/80 p-6 sm:p-8 rounded-2xl shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  <Sparkles size={14} />
                  <span>{t('smartCycleCounting', 'Enterprise Stock Audit Workflow')}</span>
                </div>
                <h3 className="text-lg font-black text-foreground tracking-tight">
                  {t('howOpnameWorks', 'How Stock Audit & Count Verification Works')}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('opnameWorkflowExplanation', 'Stock Audit allows warehouse managers to record a frozen snapshot of book inventory, record actual physical items counted on the shelves, calculate discrepancy variances, and automatically reconcile stock levels upon completion.')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <h4 className="text-xs font-bold text-foreground">{t('snapStock', 'Snap Stock')}</h4>
                    <p className="text-[11px] text-muted-foreground">{t('snapStockDesc', 'Captures live quantities across all catalog SKUs in selected warehouse.')}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <h4 className="text-xs font-bold text-foreground">{t('physicalCount', 'Physical Count')}</h4>
                    <p className="text-[11px] text-muted-foreground">{t('physicalCountDesc', 'Staff inputs actual verified quantities with quick steppers & variance tags.')}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <h4 className="text-xs font-bold text-foreground">{t('reconcileStock', 'Reconcile')}</h4>
                    <p className="text-[11px] text-muted-foreground">{t('reconcileStockDesc', 'Automatic inventory adjustments and audit movement logs generated.')}</p>
                  </div>
                </div>
              </div>

              {selectedWarehouseObj && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                      <Warehouse size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{selectedWarehouseObj.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{selectedWarehouseObj.address || t('activeWarehouseHub', 'Active Warehouse Hub')}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary text-white text-center shrink-0 shadow-2xs">
                    {t('readyToSnap', 'Ready to Snap')}
                  </span>
                </div>
              )}
            </div>

          </div>
        </form>
      )}

      {/* ─── ACTIVE COUNTING MATRIX SCREEN (Editing / In Progress) ────────── */}
      {isEdit && (
        <div className="space-y-6">
          
          {/* Header Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-card border border-border/80 p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('auditedSKUs', 'Total SKUs Audited')}</span>
              <p className="text-xl font-black text-foreground font-mono">{items.length}</p>
            </div>

            <div className="bg-card border border-border/80 p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('system_qty', 'System Book Units')}</span>
              <p className="text-xl font-black text-foreground font-mono">{totalSystemUnits}</p>
            </div>

            <div className="bg-card border border-border/80 p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('physical_qty', 'Physical Counted')}</span>
              <p className="text-xl font-black text-foreground font-mono">{totalPhysicalUnits}</p>
            </div>

            <div className="bg-card border border-border/80 p-4 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('variance', 'Net Discrepancy')}</span>
              <p className={`text-xl font-black font-mono ${totalDiff > 0 ? 'text-emerald-600 dark:text-emerald-400' : totalDiff < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-foreground'}`}>
                {totalDiff > 0 ? `+${totalDiff}` : totalDiff}
              </p>
            </div>
          </div>

          {/* Main Matrix Card */}
          <div className="bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden">
            
            {/* Search & Filter Tabs Toolbar */}
            <div className="p-4 border-b border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveFilterTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilterTab === 'all'
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('all', 'All')} ({items.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilterTab('discrepancy')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilterTab === 'discrepancy'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('discrepancies', 'Discrepancies')} ({discrepancyCount})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilterTab('matched')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilterTab === 'matched'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('matched', 'Matched')} ({matchedCount})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilterTab('surplus')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilterTab === 'surplus'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('surplus', 'Surplus (+)')} ({surplusCount})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilterTab('deficit')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilterTab === 'deficit'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('shortage', 'Shortage (-)')} ({deficitCount})
                </button>
              </div>

              {/* Search & Quick Action Buttons */}
              <div className="flex items-center gap-2.5">
                <div className="relative min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchProductOrSku', 'Search product or SKU...')}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all font-medium"
                  />
                </div>

                {isDraft && (
                  <button
                    type="button"
                    onClick={handleSetAllToMatch}
                    title={t('setAllToMatchTooltip', 'Fill all physical quantities with system quantities')}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl border border-border bg-card hover:bg-muted text-foreground flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
                  >
                    <CheckCheck size={14} className="text-emerald-500" />
                    <span className="hidden sm:inline">{t('matchAll', 'Match All')}</span>
                  </button>
                )}
              </div>

            </div>

            {/* Items Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted/30">
                    <th className="py-3.5 px-4">{t('colProduct', 'Product / SKU')}</th>
                    <th className="py-3.5 px-4 w-36 text-center">{t('system_qty', 'System Book Qty')}</th>
                    <th className="py-3.5 px-4 w-52 text-center">{t('physical_qty', 'Physical Counted')}</th>
                    <th className="py-3.5 px-4 w-36 text-center">{t('variance', 'Variance Diff')}</th>
                    <th className="py-3.5 px-4">{t('itemNotes', 'Discrepancy Reason / Notes')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs font-semibold">
                  {filteredItems.map((item) => {
                    const originalIndex = items.findIndex(it => it.id === item.id)
                    const variance = item.physical_quantity - item.system_quantity
                    
                    return (
                      <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                        
                        {/* Product info */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-xs text-foreground block">
                              {item.product?.name || 'Unknown Product'}
                            </span>
                            {item.product?.sku && (
                              <span className="font-mono text-[11px] text-muted-foreground block">
                                {item.product.sku}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* System Qty */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-mono font-bold text-xs bg-muted/60 px-3 py-1.5 rounded-lg text-foreground border border-border/70 inline-block">
                            {item.system_quantity}
                          </span>
                        </td>

                        {/* Physical Qty Stepper */}
                        <td className="py-3.5 px-4">
                          {isDone ? (
                            <div className="text-center font-mono font-black text-sm text-foreground">
                              {item.physical_quantity}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleStepPhysicalQuantity(originalIndex, -1)}
                                className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 text-foreground border border-border flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95"
                              >
                                <Minus size={13} />
                              </button>
                              <input
                                type="number"
                                value={item.physical_quantity}
                                onChange={(e) => handleItemChange(originalIndex, 'physical_quantity', parseInt(e.target.value, 10) || 0)}
                                min="0"
                                step="1"
                                className="w-20 h-8 px-2 bg-background border border-border rounded-lg font-mono font-bold text-center text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => handleStepPhysicalQuantity(originalIndex, 1)}
                                className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 text-foreground border border-border flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Variance badge */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold ${
                            variance > 0
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : variance < 0
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                : 'bg-muted/40 text-muted-foreground border border-border/40'
                          }`}>
                            {variance > 0 ? `+${variance}` : variance}
                          </span>
                        </td>

                        {/* Note input */}
                        <td className="py-3.5 px-4">
                          {isDone ? (
                            <span className="text-muted-foreground font-normal italic text-[11px]">
                              {formatNoteText(item.notes) || '—'}
                            </span>
                          ) : (
                            <input
                              type="text"
                              value={formatNoteText(item.notes)}
                              onChange={(e) => handleItemChange(originalIndex, 'notes', e.target.value)}
                              placeholder={t('reasonDiffPlaceholder', t('inventory.reasonDiffPlaceholder', 'Reason for diff...'))}
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-foreground text-xs focus:outline-none focus:border-primary transition-all font-medium placeholder:text-muted-foreground/50"
                            />
                          )}
                        </td>

                      </tr>
                    )
                  })}

                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-muted-foreground text-xs">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Package size={36} className="text-muted-foreground/40" />
                          <p className="font-bold text-foreground">
                            {t('noMatchingItems', 'No items match your filter criteria.')}
                          </p>
                          <p className="text-[11px]">
                            {t('tryAdjustingSearchOrTab', 'Try adjusting your search query or switching tabs.')}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions & Reconciliation Bar */}
            <div className="p-5 border-t border-border bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Info size={15} className="text-primary shrink-0" />
                <span>
                  {isDraft
                    ? t('reconcileNotice', 'Review counted numbers above. Clicking "Verify & Reconcile" will update active warehouse stock.')
                    : t('completedNotice', 'This audit is completed and stock reconciliations have already been applied.')}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-bold text-foreground border border-border rounded-xl hover:bg-muted transition-colors bg-card cursor-pointer active:scale-95"
                >
                  {t('close', 'Close')}
                </button>

                {isDraft && (
                  <button
                    type="button"
                    onClick={() => handleCompleteOpname()}
                    disabled={completeMutation.isPending}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {completeMutation.isPending ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>{t('reconciling', 'Reconciling Stock...')}</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>{t('verifyAndReconcile', t('inventory.verifyAndReconcile', 'Verify & Reconcile Stock'))}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default StockOpnameForm
