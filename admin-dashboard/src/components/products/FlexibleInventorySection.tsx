import React, { useState } from 'react'
import {
  Boxes,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  RefreshCw,
  History,
  Building2,
  Sliders,
  ShieldAlert,
  Loader2,
  Package,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface WarehouseItem {
  id: number | string
  name: string
}

interface StockMovementItem {
  id: number | string
  created_at: string
  type: string
  quantity: number | string
  reason?: string
  warehouse?: { name: string }
  user?: { name: string }
}

interface FlexibleInventorySectionProps {
  trackInventory: boolean
  lowStockThreshold: string
  onTrackInventoryChange: (track: boolean) => void
  onLowStockThresholdChange: (val: string) => void
  hasVariants?: boolean
  onHasVariantsChange?: (val: boolean) => void
  onSaveSettings?: () => void
  isSavingSettings?: boolean
  warehouses?: WarehouseItem[]
  movements?: StockMovementItem[]
  isLoadingMovements?: boolean
  currentStock?: number
  costPrice?: string
  sellingPrice?: string
  variants?: any[]
  onAddAdjustment?: (data: {
    warehouse_id: string
    variant_id?: string
    type: string
    quantity: string
    reason: string
  }) => void
  isAddingAdjustment?: boolean
}

export const FlexibleInventorySection: React.FC<FlexibleInventorySectionProps> = ({
  trackInventory,
  lowStockThreshold,
  onTrackInventoryChange,
  onLowStockThresholdChange,
  onSaveSettings,
  isSavingSettings = false,
  warehouses = [],
  movements = [],
  isLoadingMovements = false,
  currentStock = 0,
  costPrice = '0',
  sellingPrice = '0',
  variants = [],
  onAddAdjustment,
  isAddingAdjustment = false,
}) => {
  const { t } = useTranslation(['products', 'common'])

  // Local Adjustment Form State
  const [warehouseId, setWarehouseId] = useState<string>(
    warehouses.length > 0 ? String(warehouses[0].id) : ''
  )
  const [variantId, setVariantId] = useState<string>('')
  const [adjustmentType, setAdjustmentType] = useState<string>('addition')
  const [quantity, setQuantity] = useState<string>('')
  const [reason, setReason] = useState<string>('')
  const [historyFilter, setHistoryFilter] = useState<string>('all')

  const threshold = parseInt(lowStockThreshold) || 5
  const cost = parseFloat(costPrice) || 0
  const selling = parseFloat(sellingPrice) || 0
  const totalCostValue = currentStock * cost
  const totalSellingValue = currentStock * selling

  // Quick Quantity Presets
  const handleQuickQty = (num: number) => {
    const curr = parseInt(quantity) || 0
    setQuantity(String(Math.max(1, curr + num)))
  }

  // Quick Reasons
  const quickReasons = [
    { label: t('reasonRestock', 'Restock'), val: 'Restock inventory purchase' },
    { label: t('reasonDamaged', 'Damaged'), val: 'Damaged or defective stock' },
    { label: t('reasonLost', 'Lost'), val: 'Inventory count mismatch' },
    { label: t('reasonAudit', 'Audit'), val: 'Physical stock audit alignment' },
  ]

  // Submit Adjustment
  const handleSubmitAdjustment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!warehouseId || !quantity || parseFloat(quantity) <= 0) return
    onAddAdjustment?.({
      warehouse_id: warehouseId,
      variant_id: variantId || undefined,
      type: adjustmentType,
      quantity,
      reason: reason.trim() || (adjustmentType === 'addition' ? 'Manual Restock' : 'Manual Deduction'),
    })
    setQuantity('')
    setReason('')
  }

  // Calculated Preview Stock After Adjustment
  const parsedQty = parseFloat(quantity) || 0
  const newStockPreview =
    adjustmentType === 'addition'
      ? currentStock + parsedQty
      : adjustmentType === 'subtraction'
      ? Math.max(0, currentStock - parsedQty)
      : parsedQty // audit count

  // Safely extract movements list whether passed as an array, paginated response, or nested data
  const safeMovements: any[] = React.useMemo(() => {
    if (Array.isArray(movements)) return movements
    if (Array.isArray((movements as any)?.data)) return (movements as any).data
    if (Array.isArray((movements as any)?.data?.data)) return (movements as any).data.data
    return []
  }, [movements])

  // Helper to determine movement direction
  const isAdditionType = (m: any) => {
    const t = (m.type || '').toLowerCase()
    const q = typeof m.quantity === 'number' ? m.quantity : parseFloat(String(m.quantity || 0))
    return t === 'addition' || t === 'in' || t === 'purchase' || t === 'transfer_in' || (t !== 'subtraction' && t !== 'out' && t !== 'sale' && q > 0)
  }

  const isSubtractionType = (m: any) => {
    const t = (m.type || '').toLowerCase()
    const q = typeof m.quantity === 'number' ? m.quantity : parseFloat(String(m.quantity || 0))
    return t === 'subtraction' || t === 'out' || t === 'sale' || t === 'transfer_out' || t === 'purchase_return' || (t !== 'addition' && t !== 'in' && q < 0)
  }

  // Filtered Movements for Table
  const filteredMovements = React.useMemo(() => {
    return safeMovements.filter((m) => {
      if (historyFilter === 'all') return true
      if (historyFilter === 'addition') return isAdditionType(m)
      if (historyFilter === 'subtraction') return isSubtractionType(m)
      return true
    })
  }, [safeMovements, historyFilter])

  return (
    <div className="space-y-5">
      {/* ─── Top 4 Sleek KPI Metric Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Card 1: Total Stock */}
        <div className="bg-card/90 dark:bg-card/60 border border-border/80 p-3.5 rounded-2xl shadow-2xs hover:border-indigo-500/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {t('totalStockInSystem', 'ស្តុកសរុបក្នុងប្រព័ន្ធ')}
            </span>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
              <Boxes size={15} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-xl font-black font-mono tracking-tight text-foreground">
                {currentStock.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">{t('unitsUnit', 'គ្រឿង')}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-border/40 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground text-[10px]">{t('stockStatusLabel', 'ស្ថានភាព:')}</span>
              {currentStock <= 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                  <AlertTriangle size={10} /> {t('outOfStock', 'ដាច់ស្តុក')}
                </span>
              ) : currentStock <= threshold ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <ShieldAlert size={10} /> {t('lowStock', 'ស្តុកជិតអស់')}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 size={10} /> {t('inStock', 'មានស្តុក')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Cost Value */}
        <div className="bg-card/90 dark:bg-card/60 border border-border/80 p-3.5 rounded-2xl shadow-2xs hover:border-purple-500/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {t('totalCostValue', 'តម្លៃដើមស្តុកសរុប')}
            </span>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
              <Package size={15} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-black font-mono tracking-tight text-purple-600 dark:text-purple-400">
              ${totalCostValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="pt-2 mt-2 border-t border-border/40 text-[10px] text-muted-foreground font-medium">
              {t('costValueFormula', '(ស្តុកសរុប × តម្លៃដើម)')}
            </div>
          </div>
        </div>

        {/* Card 3: Selling Value */}
        <div className="bg-card/90 dark:bg-card/60 border border-border/80 p-3.5 rounded-2xl shadow-2xs hover:border-emerald-500/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {t('totalSellingValue', 'តម្លៃលក់ស្តុកសរុប')}
            </span>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <TrendingUp size={15} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              ${totalSellingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="pt-2 mt-2 border-t border-border/40 text-[10px] text-muted-foreground font-medium">
              {t('sellingValueFormula', '(ស្តុកសរុប × តម្លៃលក់)')}
            </div>
          </div>
        </div>

        {/* Card 4: Low Stock Threshold */}
        <div className="bg-card/90 dark:bg-card/60 border border-border/80 p-3.5 rounded-2xl shadow-2xs hover:border-amber-500/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {t('lowStockThresholdLabel', 'កម្រិតស្តុកជិតអស់')}
            </span>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
              <Sliders size={15} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-400">
                {threshold}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">{t('unitsUnit', 'គ្រឿង')}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-border/40 text-[10px] text-muted-foreground font-medium truncate">
              {trackInventory ? t('trackingEnabled', 'កំពុងតាមដានកម្រិតស្តុក') : t('trackingDisabled', 'មិនតាមដានកម្រិតស្តុកទេ')}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Compact Settings & Control Banner (Simple & Streamlined) ─── */}
      <div className="bg-card/80 border border-border/80 p-4 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            <Sliders size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">
              {t('stockTrackingSettings', 'ការកំណត់តាមដានស្តុក')}
            </h4>
            <p className="text-[11px] text-muted-foreground">
              {t('stockTrackingDesc', 'តាមដានចំនួនស្តុកស្វ័យប្រវត្តិពេលលក់ និងកំណត់កម្រិតប្រកាសអាសន្ន')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Toggle Track Inventory */}
          <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-xl bg-muted/30 border border-border/60 hover:bg-muted/60 transition-all select-none">
            <input
              type="checkbox"
              checked={trackInventory}
              onChange={(e) => onTrackInventoryChange(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
            />
            <span className="text-xs font-bold text-foreground">
              {t('trackStockLevel', 'តាមដានស្តុក')}
            </span>
          </label>

          {/* Threshold Input */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">{t('products.lowStockThreshold', 'កម្រិតស្តុកទាប:')}</span>
            <input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => onLowStockThresholdChange(e.target.value)}
              className="form-input text-xs font-bold font-mono w-20 py-1.5 px-2.5 rounded-lg bg-background text-foreground border-border/80 focus:ring-2 focus:ring-primary/20"
              disabled={!trackInventory}
              placeholder="5"
            />
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={onSaveSettings}
            disabled={isSavingSettings}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isSavingSettings ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
            <span>{t('products.saveBtn', 'រក្សាទុក')}</span>
          </button>
        </div>
      </div>

      {/* ─── Flexible Workspace Layout: 2-Column Desktop Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Adjustment Form (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-card border border-border/80 p-5 rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <RefreshCw size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  {t('products.warehouseStockLedger', 'កែប្រែស្តុកស្វ័យប្រវត្តិ (Stock Adjustment)')}
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  {t('products.stockAdjustmentDesc', 'បន្ថែមស្តុក កាត់ស្តុកខូចខាត ឬធ្វើសវនកម្មផ្ទៀងផ្ទាត់')}
                </p>
              </div>
            </div>

            {/* Live Preview Badge */}
            {parsedQty > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold font-mono">
                <span>ស្តុក: {currentStock}</span>
                <ArrowRight size={12} />
                <span className="text-primary">ថ្មី: {newStockPreview}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmitAdjustment} className="space-y-3.5">
            <div className={`grid grid-cols-1 ${variants && variants.length > 0 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3.5`}>
              {/* Warehouse Location */}
              <div>
                <label className="block text-xs font-semibold text-foreground/90 mb-1">
                  {t('products.warehouseLocationLabel', 'ទីតាំងឃ្លាំង (Warehouse)')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="">{t('products.selectWarehousePlaceholder', 'ជ្រើសរើសឃ្លាំង...')}</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={String(w.id)}>{w.name}</option>
                  ))}
                </select>
              </div>

              {/* Variant Selector (If Product Has Variants) */}
              {variants && variants.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-foreground/90 mb-1">
                    {t('products.variantOptionLabel', 'ជម្រើសទំនិញ (Variant)')}
                  </label>
                  <select
                    value={variantId}
                    onChange={(e) => setVariantId(e.target.value)}
                    className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    <option value="">{t('products.allMainStockPlaceholder', 'ស្តុកទូទៅ (All / Main Stock)')}</option>
                    {variants.map((v) => (
                      <option key={v.id} value={String(v.id)}>{v.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity Input */}
              <div>
                <label className="block text-xs font-semibold text-foreground/90 mb-1">
                  {t('products.quantityLabel', 'ចំនួនស្តុក (Quantity)')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    placeholder={t('products.enterQtyPlaceholder', 'បញ្ចូលចំនួន...')}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] font-mono rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Adjustment Type Segmented Tab */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1">
                {t('products.actionLabel', 'ប្រភេទការកែប្រែ (Action)')} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted/30 dark:bg-slate-900/50 rounded-lg border border-border/70">
                <button
                  type="button"
                  onClick={() => setAdjustmentType('addition')}
                  className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    adjustmentType === 'addition'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Plus size={13} />
                  <span>{t('products.actionAdd', '+ បន្ថែម')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustmentType('subtraction')}
                  className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    adjustmentType === 'subtraction'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Minus size={13} />
                  <span>{t('products.actionDeduct', '- កាត់')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustmentType('audit')}
                  className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    adjustmentType === 'audit'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <RefreshCw size={12} />
                  <span>{t('products.actionAudit', '= សវនកម្ម')}</span>
                </button>
              </div>
            </div>

            {/* Quick Quantity Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-bold text-muted-foreground mr-1 flex items-center gap-1">
                <Zap size={12} className="text-amber-500" />
                {t('products.quickQty', 'រហ័ស:')}
              </span>
              {[1, 5, 10, 25, 50, 100].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleQuickQty(num)}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-muted/30 hover:bg-primary/10 text-muted-foreground hover:text-primary border border-border/60 transition-all cursor-pointer active:scale-95"
                >
                  +{num}
                </button>
              ))}
            </div>

            {/* Reason Description & Presets */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground/90">
                {t('products.reasonLabel', 'មូលហេតុនៃការកែប្រែ (Reason)')}
              </label>
              <input
                type="text"
                placeholder={t('products.reasonPlaceholder', 'ឧទាហរណ៍៖ ទិញចូលបន្ថែម, ទំនិញខូច, ផ្ទៀងផ្ទាត់ស្តុក...')}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
              />

              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[11px] font-semibold text-muted-foreground">{t('products.quickSelect', 'ជ្រើសរើស:')}</span>
                {quickReasons.map((qr) => (
                  <button
                    key={qr.label}
                    type="button"
                    onClick={() => setReason(qr.val)}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted/30 hover:bg-muted/70 text-muted-foreground border border-border/50 transition-all cursor-pointer"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isAddingAdjustment || !quantity}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isAddingAdjustment ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                <span>{t('logAdjustment', 'Save Stock Adjustment')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Movement History Ledger Table (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-card border border-border/80 p-5 rounded-2xl shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <History size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    {t('stockMovementHistory', 'Stock Movement History')}
                  </h4>
                  <p className="text-[10px] text-muted-foreground">{t('stockMovementHistorySub', 'Track stock adjustments and transactions')}</p>
                </div>
              </div>

              {/* Table Action Filter */}
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setHistoryFilter('all')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    historyFilter === 'all'
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('filterAll', 'All')}
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('addition')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    historyFilter === 'addition'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('filterAdd', '+ Add')}
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('subtraction')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    historyFilter === 'subtraction'
                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('filterDeduct', '- Deduct')}
                </button>
              </div>
            </div>

            {/* History Table Container */}
            <div className="border border-border/70 rounded-xl overflow-hidden shadow-2xs max-h-[360px] overflow-y-auto">
              <table className="w-full data-table text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground sticky top-0 bg-card">
                    <th className="text-left py-2.5 px-3 font-bold text-[10px] uppercase">{t('tableType', 'Type')}</th>
                    <th className="text-left py-2.5 px-3 font-bold text-[10px] uppercase">{t('tableQty', 'Qty')}</th>
                    <th className="text-left py-2.5 px-3 font-bold text-[10px] uppercase">{t('tableReason', 'Reason')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {isLoadingMovements ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-muted-foreground text-xs">
                        <Loader2 className="animate-spin mx-auto mb-2 text-primary" size={20} />
                        <span className="font-semibold text-[11px] text-foreground/80">{t('products.loadingMovements', 'កំពុងទាញយកប្រវត្តិកែប្រែស្តុក...')}</span>
                      </td>
                    </tr>
                  ) : filteredMovements && filteredMovements.length > 0 ? (
                    filteredMovements.map((m) => {
                      const isAdd = isAdditionType(m)
                      const isSub = isSubtractionType(m)
                      const qtyVal = typeof m.quantity === 'number' ? m.quantity : parseFloat(String(m.quantity || 0))
                      const absQty = Math.abs(qtyVal)

                      return (
                        <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                                isAdd
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : isSub
                                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                  : 'bg-primary/15 text-primary border border-primary/20'
                              }`}
                            >
                              {isAdd && t('products.filterAdd', '+ បន្ថែម')}
                              {isSub && t('products.filterDeduct', '- កាត់')}
                              {!isAdd && !isSub && t('products.actionAudit', '= សវនកម្ម')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-extrabold font-mono text-foreground text-xs">
                            {isSub ? `-${absQty}` : `+${absQty}`}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground text-[11px]" title={m.reason || m.notes || ''}>
                            <div className="truncate max-w-[140px] font-medium text-foreground/90">
                              {m.reason || m.notes || 'Manual adjustment'}
                            </div>
                            {m.created_at && (
                              <div className="text-[9px] text-muted-foreground/70">
                                {new Date(m.created_at).toLocaleDateString('km-KH', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-muted-foreground italic text-xs">
                        <History className="mx-auto mb-1.5 opacity-40" size={22} />
                        {t('products.noMovementsFound', 'មិនទាន់មានប្រវត្តិប្រតិបត្តិការស្តុកនៅឡើយទេ។')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 border-t border-border/40 text-[10px] text-muted-foreground text-center">
            {t('products.automaticLogFooter', 'កំណត់ត្រាស្វ័យប្រវត្តិនៃការផ្លាស់ប្តូរស្តុក')}
          </div>
        </div>
      </div>
    </div>
  )
}
