import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  RotateCcw, ShoppingBag, Package, AlertCircle,
  FileText, CheckCircle, Plus, Minus, ShieldCheck, CreditCard,
  Warehouse, Save, User, Building, Phone, Mail, Loader2,
  AlertTriangle, Tag, Clock, PackagePlus, ShieldAlert
} from 'lucide-react'
import { FormHeader, FormFooter, EnterpriseSelect } from '@/components/common'
import { formatCurrency } from '../utils/purchaseCurrency'

interface PurchaseReturnFormSectionProps {
  purchaseId: string
  setPurchaseId: (val: string) => void
  purchasesData: any[]
  loadingPurchaseDetails: boolean
  returnDate: string
  setReturnDate: (val: string) => void
  status: string
  setStatus: (val: string) => void
  returnItems: any[]
  handleItemQtyChange: (idx: number, val: string) => void
  handleItemNotesChange: (idx: number, val: string) => void
  getReturnTotal: () => number
  reason: string
  setReason: (val: string) => void
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export const PurchaseReturnFormSection: React.FC<PurchaseReturnFormSectionProps> = ({
  purchaseId,
  setPurchaseId,
  purchasesData,
  loadingPurchaseDetails,
  returnDate,
  setReturnDate,
  status,
  setStatus,
  returnItems,
  handleItemQtyChange,
  handleItemNotesChange,
  getReturnTotal,
  reason,
  setReason,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation(['purchases', 'common'])
  const returnTotalUSD = getReturnTotal()
  const returnTotalKHR = returnTotalUSD * 4100

  // Calculate selected units & distinct items
  const activeItemsCount = returnItems.filter(item => (parseFloat(item.quantity) || 0) > 0).length
  const totalUnitsSelected = returnItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0)

  // Fast action: Return All Max
  const handleReturnAllMax = () => {
    returnItems.forEach((item, idx) => {
      handleItemQtyChange(idx, String(item.available_to_return || 0))
    })
  }

  // Fast action: Reset All
  const handleResetAll = () => {
    returnItems.forEach((_, idx) => {
      handleItemQtyChange(idx, '0')
    })
  }

  // Quick reason chips with Lucide icons
  const quickReasons = [
    {
      icon: <AlertTriangle size={13} className="text-rose-500 shrink-0" />,
      label: t('purchases.reasonDamaged', 'Damaged in transit'),
    },
    {
      icon: <Tag size={13} className="text-amber-500 shrink-0" />,
      label: t('purchases.reasonWrongVariant', 'Wrong variant or product model'),
    },
    {
      icon: <Clock size={13} className="text-orange-500 shrink-0" />,
      label: t('purchases.reasonExpired', 'Near expiry or expired'),
    },
    {
      icon: <PackagePlus size={13} className="text-blue-500 shrink-0" />,
      label: t('purchases.reasonExcess', 'Excess quantity shipped'),
    },
    {
      icon: <ShieldAlert size={13} className="text-red-500 shrink-0" />,
      label: t('purchases.reasonQuality', 'Poor quality or below specification'),
    },
  ]

  const handleChipClick = (localizedReasonText: string) => {
    if (!reason.trim()) {
      setReason(localizedReasonText)
    } else if (!reason.includes(localizedReasonText)) {
      setReason(`${reason}, ${localizedReasonText}`)
    }
  }

  // Selected PO object
  const selectedPO = (purchasesData ?? []).find((p: any) => String(p.id) === String(purchaseId))

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ─── Global Form Header (Unboxed, Clean & Distinct) ─── */}
      <FormHeader
        title={t('purchases.createPurchaseReturn', 'Create Purchase Return (Debit Note)')}
        subtitle={t('purchases.returnSubtitle', 'Return damaged or excess products back to supplier and reduce stock')}
        breadcrumbs={[
          { label: t('nav.purchases', 'Purchases'), path: '/purchases' },
          { label: t('purchases.purchaseReturns', 'Purchase Returns'), path: '/purchases/returns' },
          { label: t('purchases.createReturn', 'Create Return') },
        ]}
        backPath="/purchases/returns"
        backLabel={t('common.back', 'Back')}
        onBack={onCancel}
      />

      {/* Main Form Content - 2 Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 / 12) - Main Form Inputs */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. PO Selection & General Info Card */}
          <div className="bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-foreground dark:text-slate-100 uppercase tracking-wider">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <ShoppingBag size={15} />
                </div>
                <span>{t('purchases.poSelection', 'Purchase Order Selection')}</span>
              </div>
              {selectedPO && (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {selectedPO.supplier?.name} • {selectedPO.warehouse?.name || 'Warehouse'}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('purchases.selectPurchaseOrder', 'Select Purchase Order')} <span className="text-destructive">*</span>
              </label>
              <EnterpriseSelect
                value={purchaseId}
                onChange={(val) => setPurchaseId(val ? String(val) : '')}
                placeholder={t('purchases.choosePOToReturn', 'Choose purchase order to return items from...')}
                searchPlaceholder={t('purchases.searchPOPlaceholder', 'Search PO reference, supplier...')}
                options={(purchasesData ?? [])
                  .filter((p: any) => p.status === 'received' || p.status === 'completed' || p.status === 'partial' || p.status === 'ordered')
                  .map((p: any) => ({
                    value: String(p.id),
                    label: `${p.reference_number} — ${p.supplier?.name || ''} ($${Number(p.grand_total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
                    title: p.reference_number,
                    subtitle: `${p.supplier?.name ? `${p.supplier.name} • ` : ''}${p.warehouse?.name ? `${p.warehouse.name} • ` : ''}$${Number(p.grand_total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    code: p.reference_number,
                    badge: p.status,
                    raw: p,
                  }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                  {t('purchases.returnDate', 'Return Date')} <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  className="h-10 min-h-[40px] w-full px-3.5 py-2 text-xs sm:text-[13px] bg-background dark:bg-slate-900/90 border border-border/80 dark:border-slate-700/80 rounded-lg text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium dark:[color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                  {t('purchases.status', 'Status')} <span className="text-destructive">*</span>
                </label>
                <EnterpriseSelect
                  value={status}
                  onChange={(val) => setStatus(val ? String(val) : 'draft')}
                  options={[
                    { value: 'draft', label: t('purchases.draft', 'Draft (Pending Review)'), badge: 'draft' },
                    { value: 'approved', label: t('purchases.approved', 'Approved (Deduct Stock Immediately)'), badge: 'approved' },
                  ]}
                  placeholder={t('purchases.status', 'Status')}
                />
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          {loadingPurchaseDetails && (
            <div className="flex items-center justify-center py-12 bg-card dark:bg-slate-900 rounded-2xl border border-dashed border-border dark:border-slate-800 text-muted-foreground dark:text-slate-400">
              <Loader2 className="animate-spin text-primary mr-2.5" size={20} />
              <span className="font-medium text-xs">{t('purchases.loadingPOItems', 'Loading items from purchase order...')}</span>
            </div>
          )}

          {/* 2. Items Breakdown Table Card */}
          {returnItems.length > 0 && (
            <div className="bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 dark:border-slate-800 pb-3.5">
                <div className="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-foreground dark:text-slate-100 uppercase tracking-wider">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Package size={15} />
                  </div>
                  <span>{t('purchases.returnItemsQuantities', 'Return Items & Quantities')}</span>
                </div>

                {/* Fast Action Buttons & Counter */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all ${
                    activeItemsCount > 0
                      ? 'bg-primary/10 text-primary border-primary/20 font-bold'
                      : 'bg-muted text-muted-foreground border-border/80'
                  }`}>
                    {activeItemsCount}/{returnItems.length} {t('purchases.itemsAvailable', 'Items')} ({totalUnitsSelected} {t('purchases.unitsSelected', 'Units selected')})
                  </span>
                  <button
                    type="button"
                    onClick={handleReturnAllMax}
                    className="h-8 px-3 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
                  >
                    <CheckCircle size={13} />
                    <span>{t('purchases.returnAllMax', 'Return All (Max)')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="h-8 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-lg border border-border/80 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <RotateCcw size={13} />
                    <span>{t('purchases.resetItems', 'Reset')}</span>
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div className="border border-border/80 rounded-xl overflow-hidden overflow-x-auto shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border/80">
                      <th className="py-2.5 px-4 font-bold text-muted-foreground text-[11px] tracking-wider uppercase min-w-[240px]">
                        {t('purchases.product', 'Product')}
                      </th>
                      <th className="py-2.5 px-3 font-bold text-muted-foreground text-[11px] tracking-wider uppercase text-center w-[90px]">
                        {t('purchases.ordered', 'Ordered')}
                      </th>
                      <th className="py-2.5 px-3 font-bold text-muted-foreground text-[11px] tracking-wider uppercase text-center w-[90px]">
                        {t('purchases.delivered', 'Delivered')}
                      </th>
                      <th className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 text-[11px] tracking-wider uppercase text-center w-[110px]">
                        {t('purchases.available', 'Returnable')}
                      </th>
                      <th className="py-2.5 px-3 font-bold text-muted-foreground text-[11px] tracking-wider uppercase text-center min-w-[190px]">
                        {t('purchases.returnQty', 'Return Qty')}
                      </th>
                      <th className="py-2.5 px-4 font-bold text-muted-foreground text-[11px] tracking-wider uppercase text-right w-[120px]">
                        {t('purchases.unitCost', 'Unit Cost')}
                      </th>
                      <th className="py-2.5 px-4 font-bold text-muted-foreground text-[11px] tracking-wider uppercase text-right w-[130px]">
                        {t('purchases.total', 'Total')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {returnItems.map((item, idx) => {
                      const returnQty = parseFloat(item.quantity) || 0
                      const lineTotalUSD = returnQty * (item.unit_cost || 0)
                      const lineTotalKHR = lineTotalUSD * 4100
                      const unitCostUSD = item.unit_cost || 0
                      const unitCostKHR = unitCostUSD * 4100
                      const maxQty = item.available_to_return || 0
                      const isSelected = returnQty > 0

                      return (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            isSelected
                              ? 'bg-primary/5 hover:bg-primary/8 dark:bg-primary/10'
                              : 'hover:bg-muted/20'
                          }`}
                        >
                          {/* Product Info */}
                          <td className="py-3 px-4">
                            <div className="flex items-start gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-muted/80 flex items-center justify-center text-muted-foreground shrink-0 border border-border/80 mt-0.5">
                                <Package size={14} />
                              </div>
                              <div className="space-y-1 flex-1 min-w-0">
                                <span className="font-bold text-foreground text-xs block leading-snug truncate">
                                  {item.product_name}
                                </span>
                                {item.sku && (
                                  <span className="inline-block px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-mono font-semibold border border-border/50">
                                    SKU: {item.sku}
                                  </span>
                                )}
                                <div className="flex items-center gap-1.5 mt-1 bg-background/80 hover:bg-background focus-within:bg-background focus-within:ring-1 focus-within:ring-primary/40 px-2 py-0.5 rounded-md border border-border/60 transition-all max-w-sm">
                                  <FileText size={11} className="text-muted-foreground/60 shrink-0" />
                                  <input
                                    placeholder={t('purchases.addItemNotes', 'Add item remarks / serial...')}
                                    value={item.notes || ''}
                                    onChange={(e) => handleItemNotesChange(idx, e.target.value)}
                                    className="w-full bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground/40 outline-none border-none p-0"
                                  />
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Ordered */}
                          <td className="py-3 px-3 text-center">
                            <span className="font-mono text-xs text-muted-foreground">{item.quantity_ordered}</span>
                          </td>

                          {/* Delivered */}
                          <td className="py-3 px-3 text-center">
                            <span className="font-mono text-xs font-semibold text-foreground">{item.quantity_received}</span>
                          </td>

                          {/* Available (Max Returnable) */}
                          <td className="py-3 px-3 text-center bg-emerald-500/5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs border border-emerald-500/20">
                              {maxQty}
                            </span>
                          </td>

                          {/* Return Qty Stepper */}
                          <td className="py-3 px-3 text-center">
                            <div className="inline-flex items-center gap-1 bg-background border border-border/80 p-0.5 rounded-lg shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleItemQtyChange(idx, String(Math.max(0, returnQty - 1)))}
                                disabled={returnQty <= 0}
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer transition-colors active:scale-95"
                                title="Decrease"
                              >
                                <Minus size={12} />
                              </button>
                              <input
                                type="number"
                                min="0"
                                max={maxQty}
                                value={item.quantity}
                                onChange={(e) => {
                                  const inputVal = parseFloat(e.target.value) || 0
                                  if (inputVal > maxQty) {
                                    handleItemQtyChange(idx, String(maxQty))
                                  } else {
                                    handleItemQtyChange(idx, e.target.value)
                                  }
                                }}
                                className="w-12 text-center text-xs font-bold font-mono bg-transparent border-0 outline-none p-0 text-foreground"
                              />
                              <button
                                type="button"
                                onClick={() => handleItemQtyChange(idx, String(Math.min(maxQty, returnQty + 1)))}
                                disabled={returnQty >= maxQty}
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer transition-colors active:scale-95"
                                title="Increase"
                              >
                                <Plus size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleItemQtyChange(idx, String(maxQty))}
                                disabled={returnQty === maxQty || maxQty === 0}
                                className="h-7 px-2 text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white disabled:opacity-30 rounded-md transition-all cursor-pointer ml-0.5"
                              >
                                {t('purchases.max', 'Max')}
                              </button>
                            </div>
                          </td>

                          {/* Cost Price */}
                          <td className="py-3 px-4 text-right">
                            <span className="font-mono text-xs font-semibold text-foreground block">
                              {formatCurrency(unitCostUSD, 'USD')}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground block">
                              {formatCurrency(unitCostKHR, 'KHR')}
                            </span>
                          </td>

                          {/* Line Total */}
                          <td className="py-3 px-4 text-right">
                            <span className={`font-mono text-xs font-bold block ${isSelected ? 'text-rose-600 dark:text-rose-400' : 'text-foreground'}`}>
                              {formatCurrency(lineTotalUSD, 'USD')}
                            </span>
                            {isSelected && (
                              <span className="font-mono text-[10px] text-muted-foreground block">
                                {formatCurrency(lineTotalKHR, 'KHR')}
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Reason for Return Card */}
          <div className="bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-foreground dark:text-slate-100 uppercase tracking-wider">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileText size={15} />
                </div>
                <span>{t('purchases.reasonForReturn', 'Reason for Return')}</span>
              </div>
              <span className="text-[11px] text-muted-foreground dark:text-slate-400 font-medium">
                {t('purchases.quickReasons', 'Quick Reason Chips')}
              </span>
            </div>

            {/* Quick Reason Chips */}
            <div className="flex flex-wrap gap-2">
              {quickReasons.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleChipClick(chip.label)}
                  className="px-3 py-1.5 text-xs font-medium bg-muted/60 dark:bg-slate-800/80 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary hover:border-primary/30 dark:hover:border-primary/50 border border-border/80 dark:border-slate-700 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 text-foreground dark:text-slate-200"
                >
                  {chip.icon}
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('purchases.returnReasonPlaceholder', 'Enter reason for return (e.g. damaged goods, wrong variant, over-shipped)...')}
              rows={3}
              className="w-full resize-none p-3 text-xs sm:text-[13px] bg-background dark:bg-slate-900/90 border border-border/80 dark:border-slate-700/80 rounded-xl text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium leading-relaxed"
            />
          </div>
        </div>

        {/* Right Column (4 / 12) - Summary & Metadata Cards */}
        <div className="lg:col-span-4 space-y-6">
          {/* Estimated Return Value Card */}
          <div className="bg-gradient-to-br from-card to-rose-500/5 dark:from-slate-900 dark:to-rose-950/20 border border-rose-500/20 dark:border-rose-500/30 rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              <AlertCircle size={15} />
              <span>{t('purchases.estimatedReturnValue', 'Estimated Return Value')}</span>
            </div>

            <div className="pt-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono tracking-tight">
                {formatCurrency(returnTotalUSD, 'USD')}
              </div>
              <div className="text-xs text-muted-foreground dark:text-slate-400 font-mono mt-0.5">
                {formatCurrency(returnTotalKHR, 'KHR')}
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 dark:border-slate-800 flex items-center justify-between text-xs text-muted-foreground dark:text-slate-400">
              <span>{t('purchases.itemsAvailable', 'Items')}:</span>
              <span className="font-bold text-foreground dark:text-slate-200 font-mono">
                {activeItemsCount} {t('purchases.itemsAvailable', 'Items')} ({totalUnitsSelected} {t('purchases.unitsSelected', 'Units selected')})
              </span>
            </div>
          </div>

          {/* Supplier & Warehouse Metadata Card */}
          {selectedPO && (
            <div className="bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground dark:text-slate-100 uppercase tracking-wider border-b border-border/60 dark:border-slate-800 pb-3">
                <Building size={15} className="text-primary" />
                <span>{t('purchases.supplierDetails', 'Supplier Details')}</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-foreground dark:text-slate-100 font-bold">
                  <User size={14} className="text-muted-foreground dark:text-slate-400 shrink-0" />
                  <span>{selectedPO.supplier?.name}</span>
                </div>
                {selectedPO.supplier?.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground dark:text-slate-400">
                    <Phone size={14} className="text-muted-foreground dark:text-slate-400 shrink-0" />
                    <span>{selectedPO.supplier.phone}</span>
                  </div>
                )}
                {selectedPO.supplier?.email && (
                  <div className="flex items-center gap-2 text-muted-foreground dark:text-slate-400">
                    <Mail size={14} className="text-muted-foreground dark:text-slate-400 shrink-0" />
                    <span>{selectedPO.supplier.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground dark:text-slate-400 pt-1.5 border-t border-border/60 dark:border-slate-800">
                  <Warehouse size={14} className="text-muted-foreground dark:text-slate-400 shrink-0" />
                  <span>{selectedPO.warehouse?.name || 'Main Warehouse'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Automated System Operations Card */}
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
              <ShieldCheck size={15} />
              <span>{t('purchases.impactTitle', 'Automated Operations')}</span>
            </div>

            <div className="space-y-2.5 text-xs text-muted-foreground dark:text-slate-300">
              <div className="flex items-start gap-2">
                <Warehouse size={14} className="text-primary shrink-0 mt-0.5" />
                <span>{t('purchases.impactStock', 'Deduct inventory stock levels immediately')}</span>
              </div>
              <div className="flex items-start gap-2">
                <CreditCard size={14} className="text-primary shrink-0 mt-0.5" />
                <span>{t('purchases.impactDebitNote', 'Issue Debit Note for accounts payable deduction or refund')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Global Form Footer (In-flow, Clean & Unified) ─── */}
      <FormFooter
        onCancel={onCancel}
        cancelPath="/purchases/returns"
        cancelLabel={t('common.cancel', 'Cancel')}
        isSubmitting={isSubmitting}
        disabled={!!purchaseId && returnItems.length === 0}
        submitLabel={t('purchases.approveAndSave', 'Approve & Save Return')}
        extraActions={
          <button
            type="submit"
            onClick={() => setStatus('draft')}
            disabled={isSubmitting || (!!purchaseId && returnItems.length === 0)}
            className="h-10 min-h-[40px] px-4 text-xs sm:text-[13px] font-semibold border border-border/80 dark:border-slate-700 bg-muted/80 dark:bg-slate-800 hover:bg-muted dark:hover:bg-slate-700 text-foreground dark:text-slate-200 rounded-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            <Save size={14} />
            <span>{t('purchases.saveDraftReturn', 'Save as Draft')}</span>
          </button>
        }
      />
    </form>
  )
}

export default PurchaseReturnFormSection
