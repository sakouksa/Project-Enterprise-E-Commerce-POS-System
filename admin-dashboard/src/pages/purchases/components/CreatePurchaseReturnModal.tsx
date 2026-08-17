import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Loader2, RotateCcw, ShoppingBag, Calendar, Info, Package,
  AlertCircle, FileText, CheckCircle, Plus, Minus, Sparkles,
  ArrowRight, ShieldCheck, CreditCard, Warehouse, Save
} from 'lucide-react'
import { formatCurrency } from '../utils/purchaseCurrency'

interface CreatePurchaseReturnModalProps {
  isOpen: boolean
  onClose: () => void
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
}

export const CreatePurchaseReturnModal: React.FC<CreatePurchaseReturnModalProps> = ({
  isOpen,
  onClose,
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

  // Quick reason chips
  const quickReasons = [
    { label: t('purchases.reasonDamaged', '💔 Damaged in transit'), text: 'Damaged in transit / defective items' },
    { label: t('purchases.reasonWrongVariant', '🏷️ Wrong model / SKU delivered'), text: 'Wrong variant / SKU delivered by supplier' },
    { label: t('purchases.reasonExpired', '⏳ Near expiry / Expired'), text: 'Near expiry or expired product lot' },
    { label: t('purchases.reasonExcess', '📦 Excess delivery quantity'), text: 'Excess quantity delivered over purchase order' },
    { label: t('purchases.reasonQuality', '⚠️ Defective / Below specs'), text: 'Quality does not meet contractual specifications' },
  ]

  const handleChipClick = (chipText: string) => {
    if (!reason.trim()) {
      setReason(chipText)
    } else if (!reason.includes(chipText)) {
      setReason(`${reason}, ${chipText}`)
    }
  }

  // Selected PO object
  const selectedPO = (purchasesData ?? []).find((p: any) => String(p.id) === String(purchaseId))

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl my-auto"
          >
            {/* 1. Fixed Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20 shrink-0">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    {t('purchases.createPurchaseReturn', 'Create Purchase Return (Goods Return / Debit Note)')}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {t('purchases.returnSubtitle', 'Return damaged or excess goods back to vendor and adjust inventory')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* 2. Visual Process Stepper Banner (Fixed below header) */}
            <div className="bg-muted/40 border-b border-border px-6 py-2.5 flex items-center justify-between text-[11px] font-medium text-muted-foreground overflow-x-auto gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-primary font-bold shrink-0">
                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">1</div>
                <span>{t('purchases.stepSelectItems', '1. Select Items')}</span>
              </div>
              <ArrowRight size={13} className="text-muted-foreground/40 shrink-0" />
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-5 h-5 rounded-full bg-muted border border-border text-foreground flex items-center justify-center text-[10px]">2</div>
                <span>{t('purchases.stepReason', '2. Reason & Notes')}</span>
              </div>
              <ArrowRight size={13} className="text-muted-foreground/40 shrink-0" />
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-5 h-5 rounded-full bg-muted border border-border text-foreground flex items-center justify-center text-[10px]">3</div>
                <span>{t('purchases.stepImpact', '3. Stock Debit & Debit Note')}</span>
              </div>
            </div>

            {/* 3. Form wrapper with Scrollable Content + Sticky Footer */}
            <form onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                {/* Section 1: PO & General Settings */}
                <div className="bg-muted/20 p-4 rounded-xl border border-border space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      <ShoppingBag size={14} className="text-primary" />
                      <span>{t('purchases.poSelection', 'Purchase Order Selection')}</span>
                    </div>
                    {selectedPO && (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        {selectedPO.supplier?.name} • {selectedPO.warehouse?.name || 'Warehouse'}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1.5">
                      {t('purchases.selectPurchaseOrder', 'Select Purchase Order')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={purchaseId}
                      onChange={(e) => setPurchaseId(e.target.value)}
                      required
                      className="form-select w-full py-2 px-3 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="">{t('purchases.choosePOToReturn', 'Choose a Purchase Order to return items from...')}</option>
                      {(purchasesData ?? [])
                        .filter((p: any) => p.status === 'received' || p.status === 'completed' || p.status === 'partial' || p.status === 'ordered')
                        .map((p: any) => (
                          <option key={p.id} value={p.id}>
                            {p.reference_number} — {p.supplier?.name} (Total: ${Number(p.grand_total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div>
                      <label className="block font-semibold text-foreground mb-1.5">
                        {t('purchases.returnDate', 'Return Date')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        required
                        className="form-input w-full py-2 px-3 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-foreground mb-1.5">
                        {t('purchases.status', 'Status')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        className="form-select w-full py-2 px-3 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="draft">{t('purchases.draft', 'Draft (Pending Review)')}</option>
                        <option value="approved">{t('purchases.approved', 'Approved (Debit Stock Immediately)')}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                {loadingPurchaseDetails && (
                  <div className="flex items-center justify-center py-10 bg-muted/10 rounded-xl border border-dashed border-border text-muted-foreground">
                    <Loader2 className="animate-spin text-primary mr-2.5" size={20} />
                    <span className="font-medium text-xs">{t('purchases.loadingPOItems', 'Loading items from Purchase Order...')}</span>
                  </div>
                )}

                {/* Section 2: Items Table with Quick Controls */}
                {returnItems.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        <Package size={14} className="text-primary" />
                        <span>{t('purchases.returnItemsQuantities', 'Return Items & Quantities')}</span>
                      </div>

                      {/* Quick Select Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleReturnAllMax}
                          className="px-2.5 py-1 text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/20 transition-all cursor-pointer"
                        >
                          {t('purchases.returnAllMax', 'Return All (Max)')}
                        </button>
                        <button
                          type="button"
                          onClick={handleResetAll}
                          className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-lg border border-border transition-all cursor-pointer"
                        >
                          {t('purchases.resetItems', 'Reset (0)')}
                        </button>
                        <span className="text-[11px] text-muted-foreground font-mono pl-1">
                          {activeItemsCount}/{returnItems.length} {t('purchases.itemsAvailable', 'items')} ({totalUnitsSelected} {t('purchases.unitsSelected', 'units')})
                        </span>
                      </div>
                    </div>

                    <div className="border border-border rounded-xl overflow-hidden overflow-x-auto shadow-2xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-muted/40 border-b border-border">
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground">{t('purchases.product', 'Product & SKU')}</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center">{t('purchases.ordered', 'Ordered')}</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center">{t('purchases.delivered', 'Delivered')}</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center bg-primary/10 text-primary">{t('purchases.available', 'Available')}</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center min-w-[150px]">{t('purchases.returnQty', 'Return Qty')}</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-right">{t('purchases.unitCost', 'Cost Price')}</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-right">{t('purchases.total', 'Total')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {returnItems.map((item, idx) => {
                            const returnQty = parseFloat(item.quantity) || 0
                            const lineTotal = returnQty * (item.unit_cost || 0)
                            const maxQty = item.available_to_return || 0

                            return (
                              <tr key={idx} className={`hover:bg-muted/10 transition-colors ${returnQty > 0 ? 'bg-orange-500/5' : ''}`}>
                                <td className="py-3 px-3">
                                  <span className="font-semibold text-foreground block">{item.product_name}</span>
                                  {item.sku && <span className="text-[10px] text-muted-foreground font-mono">SKU: {item.sku}</span>}
                                  <input
                                    placeholder={t('purchases.addItemNotes', 'Add notes for item...')}
                                    value={item.notes || ''}
                                    onChange={(e) => handleItemNotesChange(idx, e.target.value)}
                                    className="block mt-1 w-full text-[11px] bg-transparent border-0 border-b border-border/40 focus:border-primary p-0.5 text-muted-foreground placeholder:text-muted-foreground/40 transition-colors"
                                  />
                                </td>
                                <td className="py-3 px-3 text-center text-muted-foreground font-mono">{item.quantity_ordered}</td>
                                <td className="py-3 px-3 text-center text-muted-foreground font-mono">{item.quantity_received}</td>
                                <td className="py-3 px-3 text-center bg-primary/5 font-bold text-primary font-mono">{maxQty}</td>
                                <td className="py-3 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleItemQtyChange(idx, String(Math.max(0, returnQty - 1)))}
                                      disabled={returnQty <= 0}
                                      className="p-1 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                                      title="Decrease"
                                    >
                                      <Minus size={11} />
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
                                      className="form-input w-16 p-1 text-center text-xs bg-background border border-border rounded-md font-bold font-mono focus:border-primary"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleItemQtyChange(idx, String(Math.min(maxQty, returnQty + 1)))}
                                      disabled={returnQty >= maxQty}
                                      className="p-1 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                                      title="Increase"
                                    >
                                      <Plus size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleItemQtyChange(idx, String(maxQty))}
                                      className="px-1.5 py-0.5 text-[10px] font-bold text-primary hover:underline cursor-pointer"
                                      title="Set Max"
                                    >
                                      {t('purchases.max', 'Max')}
                                    </button>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-right text-muted-foreground font-mono">
                                  ${Number(item.unit_cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="py-3 px-3 text-right font-bold text-foreground font-mono">
                                  ${Number(lineTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Estimated Return Value Card */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-rose-500/5 p-4 rounded-xl border border-rose-500/20">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={16} className="text-rose-500 shrink-0" />
                        <div>
                          <span className="font-semibold text-foreground text-xs block">
                            {t('purchases.estimatedReturnValue', 'Estimated Return Value')}:
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {activeItemsCount} {t('purchases.itemsAvailable', 'items')} • {totalUnitsSelected} {t('purchases.unitsSelected', 'units')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400 font-mono block">
                          {formatCurrency(returnTotalUSD, 'USD')}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono block">
                          {formatCurrency(returnTotalKHR, 'KHR')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 3: Return Reason with Quick Clickable Chips */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-foreground">
                      {t('purchases.reasonForReturn', 'Reason for Return')}
                    </label>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {t('purchases.quickReasons', 'Click to quick-fill reason')}:
                    </span>
                  </div>

                  {/* Quick Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {quickReasons.map((chip, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleChipClick(chip.text)}
                        className="px-2.5 py-1 text-[11px] bg-muted/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-border rounded-lg transition-all cursor-pointer"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={t('purchases.returnReasonPlaceholder', 'Enter return reason (e.g., damaged goods, defective lot, excess delivery)...')}
                    rows={3}
                    className="form-input w-full resize-none py-2 px-3 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                {/* Section 4: Automated System Impact Callout */}
                <div className="bg-primary/5 p-3.5 rounded-xl border border-primary/15 space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <ShieldCheck size={14} />
                    <span>{t('purchases.impactTitle', 'Automated system actions on submit')}:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground pt-0.5">
                    <div className="flex items-start gap-1.5">
                      <Warehouse size={13} className="text-primary shrink-0 mt-0.5" />
                      <span>{t('purchases.impactStock', 'Warehouse stock is immediately debited (-X units)')}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CreditCard size={13} className="text-primary shrink-0 mt-0.5" />
                      <span>{t('purchases.impactDebitNote', 'Debit Note generated to offset vendor payables or request refund')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Fixed / Sticky Footer Actions */}
              <div className="px-6 py-3.5 border-t border-border bg-card/95 backdrop-blur-xs flex items-center justify-between gap-3 shrink-0 shadow-xs">
                {/* Left side: Live summary badge */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-muted-foreground hidden sm:inline">
                    {t('purchases.totalAmount', 'Total')}:
                  </span>
                  <span className="font-mono font-extrabold text-rose-600 dark:text-rose-400 text-sm">
                    {formatCurrency(returnTotalUSD, 'USD')}
                  </span>
                  {activeItemsCount > 0 && (
                    <span className="text-[11px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-md border border-border">
                      {activeItemsCount} {t('purchases.itemsAvailable', 'items')} ({totalUnitsSelected} {t('purchases.unitsSelected', 'units')})
                    </span>
                  )}
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl font-semibold transition-colors cursor-pointer text-xs"
                  >
                    {t('common.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (!!purchaseId && returnItems.length === 0)}
                    className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50 text-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>{t('common.saving', 'Saving...')}</span>
                      </>
                    ) : status === 'approved' ? (
                      <>
                        <CheckCircle size={14} />
                        <span>{t('purchases.approveAndSave', 'Approve & Return Goods')}</span>
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        <span>{t('purchases.saveDraftReturn', 'Save Draft Return')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
