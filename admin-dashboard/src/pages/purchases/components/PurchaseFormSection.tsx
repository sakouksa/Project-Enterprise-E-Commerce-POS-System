import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Trash, Save, Loader2 } from 'lucide-react'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'
import { formatCurrency, getDualValues } from '../utils/purchaseCurrency'

interface PurchaseFormSectionProps {
  editPurchaseId: number | null
  editLoading: boolean
  supplierId: string
  setSupplierId: (val: string) => void
  warehouseId: string
  setWarehouseId: (val: string) => void
  branchId: string
  setBranchId: (val: string) => void
  poDate: string
  setPoDate: (val: string) => void
  dueDate: string
  setDueDate: (val: string) => void
  currencyCode: string
  handleCurrencyChange: (val: string) => void
  exchangeRate: string
  setExchangeRate: (val: string) => void
  shippingCost: string
  setShippingCost: (val: string) => void
  notes: string
  setNotes: (val: string) => void
  formItems: any[]
  updateFormItem: (index: number, key: string, value: string) => void
  removeFormItem: (index: number) => void
  addProductToForm: (item: any) => void
  suppliers: any[]
  warehouses: any[]
  branches: any[]
  filteredProducts: any[]
  prodSearch: string
  setProdSearch: (val: string) => void
  prodDropdownOpen: boolean
  setProdDropdownOpen: (val: boolean) => void
  totals: { subtotal: number; discount_amount: number; tax_amount: number; grand_total: number }
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export const PurchaseFormSection: React.FC<PurchaseFormSectionProps> = ({
  editPurchaseId,
  editLoading,
  supplierId,
  setSupplierId,
  warehouseId,
  setWarehouseId,
  branchId,
  setBranchId,
  poDate,
  setPoDate,
  dueDate,
  setDueDate,
  currencyCode,
  handleCurrencyChange,
  exchangeRate,
  setExchangeRate,
  shippingCost,
  setShippingCost,
  notes,
  setNotes,
  formItems,
  updateFormItem,
  removeFormItem,
  addProductToForm,
  suppliers,
  warehouses,
  branches,
  filteredProducts,
  prodSearch,
  setProdSearch,
  prodDropdownOpen,
  setProdDropdownOpen,
  totals,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation()

  return (
    <form onSubmit={onSubmit} className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-6">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">
          {editPurchaseId ? t('purchases.editPO', 'Edit Purchase Order') : t('purchases.createPO', 'Create Purchase Order')}
        </h3>
        {editLoading ? (
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            {t('purchases.loadingItems', 'Loading items...')}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {t('purchases.autoReferenceNote', 'Auto reference generated on save')}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t('purchases.supplier', 'Supplier')} <span className="text-red-500">*</span>
          </label>
          <ModernSelect
            value={supplierId}
            onChange={(val) => setSupplierId(String(val))}
            options={[
              { value: '', label: t('purchases.selectSupplier', 'Select Supplier') },
              ...(suppliers ?? []).map((s: any) => ({
                value: s.id,
                label: s.name,
                code: s.code,
                subtitle: s.phone || s.email,
              })),
            ]}
            placeholder={t('purchases.selectSupplier', 'Select Supplier')}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t('purchases.warehouse', 'Warehouse')} <span className="text-red-500">*</span>
          </label>
          <ModernSelect
            value={warehouseId}
            onChange={(val) => setWarehouseId(String(val))}
            options={[
              { value: '', label: t('purchases.selectWarehouse', 'Select Warehouse') },
              ...(warehouses ?? []).map((w: any) => ({
                value: w.id,
                label: w.name,
                code: w.code,
              })),
            ]}
            placeholder={t('purchases.selectWarehouse', 'Select Warehouse')}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t('purchases.branch', 'Branch')} <span className="text-red-500">*</span>
          </label>
          <ModernSelect
            value={branchId}
            onChange={(val) => setBranchId(String(val))}
            options={(branches ?? []).map((b: any) => ({
              value: b.id,
              label: b.name,
              code: b.code,
            }))}
            placeholder={t('purchases.selectBranch', 'Select Branch')}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t('purchases.date', 'PO Date')} <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={poDate}
            onChange={(e) => setPoDate(e.target.value)}
            required
            className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-foreground text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t('purchases.dueDate', 'Due Date')}
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-foreground text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t('purchases.currency', 'Currency')} <span className="text-red-500">*</span>
          </label>
          <ModernSelect
            value={currencyCode}
            onChange={(val) => handleCurrencyChange(String(val))}
            options={[
              { value: 'USD', label: 'USD ($)', code: 'USD' },
              { value: 'KHR', label: 'KHR (៛)', code: 'KHR' },
            ]}
            placeholder={t('purchases.selectCurrency', 'Select Currency')}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t('purchases.exchangeRate', 'Exchange Rate')} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={currencyCode === 'KHR' ? '1' : exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
            disabled={currencyCode === 'KHR'}
            required
            min="0.000001"
            step="any"
            className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-foreground text-sm disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {t('purchases.shippingCost', 'Shipping Cost')} ({currencyCode})
          </label>
          <input
            type="number"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            min="0"
            step="any"
            className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-foreground text-sm"
          />
        </div>
      </div>

      {/* Product Search & Selector */}
      <div className="border-t border-border pt-6 relative">
        <label className="block text-sm font-bold text-foreground mb-2">
          {t('purchases.addProduct', 'Search & Add Product to Order')}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setProdDropdownOpen(!prodDropdownOpen)}
            className="w-full border border-border rounded-lg p-2.5 bg-background text-sm flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
          >
            <span className="text-muted-foreground">{t('purchases.searchProducts', 'Click to search catalog items...')}</span>
            <span className="border-l border-border pl-2.5 ml-2 text-muted-foreground text-xs">▼</span>
          </button>

          <AnimatePresence>
            {prodDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProdDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 right-0 mt-1 max-h-72 overflow-hidden bg-card border border-border rounded-xl shadow-xl z-20 flex flex-col p-2 space-y-2"
                >
                  <div className="relative flex-shrink-0">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      autoFocus
                      value={prodSearch}
                      onChange={e => setProdSearch(e.target.value)}
                      placeholder="Type product name, SKU or barcode..."
                      className="form-input w-full pl-8 text-xs border border-border rounded-lg p-2 bg-muted/20"
                    />
                  </div>

                  <div className="overflow-y-auto flex-1 divide-y divide-border/60">
                    {filteredProducts.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground">No matching products found.</div>
                    ) : (
                      filteredProducts.map((item: any) => (
                        <div
                          key={item.id}
                          onClick={() => addProductToForm(item)}
                          className="p-2.5 hover:bg-muted/40 cursor-pointer rounded-lg flex items-center justify-between transition-colors"
                        >
                          <div>
                            <span className="text-xs font-bold text-foreground block">{item.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{item.sku || 'No SKU'}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-primary">${Number(item.cost_price).toFixed(2)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Items Table */}
      <div className="border border-border rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              <th className="py-3 px-3 font-semibold text-muted-foreground">{t('purchases.product', 'Product')}</th>
              <th className="py-3 px-3 font-semibold text-muted-foreground text-center w-24">{t('purchases.quantity', 'Qty')}</th>
              <th className="py-3 px-3 font-semibold text-muted-foreground text-center w-28">{t('purchases.unitCost', 'Unit Cost')}</th>
              <th className="py-3 px-3 font-semibold text-muted-foreground text-center w-20">{t('purchases.discount', 'Disc %')}</th>
              <th className="py-3 px-3 font-semibold text-muted-foreground text-center w-20">{t('purchases.tax', 'Tax %')}</th>
              <th className="py-3 px-3 font-semibold text-muted-foreground text-right w-28">{t('purchases.total', 'Total')}</th>
              <th className="py-3 px-3 text-center w-12">{t('common.actions', '')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {formItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  No products added yet. Use the search bar above to add items.
                </td>
              </tr>
            ) : (
              formItems.map((item, idx) => {
                const qty = parseFloat(item.quantity) || 0
                const cost = parseFloat(item.unit_cost) || 0
                const disc = (qty * cost) * ((parseFloat(item.discount_percent) || 0) / 100)
                const tax = ((qty * cost) - disc) * ((parseFloat(item.tax_percent) || 0) / 100)
                const lineTotal = (qty * cost) - disc + tax

                return (
                  <tr key={idx} className="hover:bg-muted/10">
                    <td className="py-3 px-3">
                      <span className="font-semibold text-foreground">{item.product_name}</span>
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => updateFormItem(idx, 'quantity', e.target.value)}
                        className="form-input w-full p-1.5 text-center text-xs"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.unit_cost}
                        onChange={e => updateFormItem(idx, 'unit_cost', e.target.value)}
                        className="form-input w-full p-1.5 text-center text-xs font-mono"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount_percent}
                        onChange={e => updateFormItem(idx, 'discount_percent', e.target.value)}
                        className="form-input w-full p-1.5 text-center text-xs"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.tax_percent}
                        onChange={e => updateFormItem(idx, 'tax_percent', e.target.value)}
                        className="form-input w-full p-1.5 text-center text-xs"
                      />
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-foreground">
                      {formatCurrency(lineTotal, currencyCode)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeFormItem(idx)}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                      >
                        <Trash size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">{t('purchases.notes', 'Purchase Notes & Terms')}</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            placeholder="Include purchase details or terms..."
            className="form-input w-full text-xs resize-none"
          />
        </div>

        <div className="bg-card rounded-xl p-5 border border-border space-y-3">
          <h4 className="text-xs font-bold text-foreground border-b border-border pb-2 uppercase tracking-wider">
            {t('purchases.financialSummary', 'Financial Summary')}
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('purchases.subtotal', 'Subtotal')}</span>
              <span className="font-semibold">{formatCurrency(getDualValues(totals.subtotal, currencyCode, exchangeRate).usd, 'USD')}</span>
            </div>
            <div className="flex justify-between items-center text-red-500">
              <span>{t('purchases.discount', 'Discount')}</span>
              <span>- {formatCurrency(getDualValues(totals.discount_amount, currencyCode, exchangeRate).usd, 'USD')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('purchases.tax', 'Tax')}</span>
              <span>{formatCurrency(getDualValues(totals.tax_amount, currencyCode, exchangeRate).usd, 'USD')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('purchases.shippingCost', 'Shipping Cost')}</span>
              <span>{formatCurrency(getDualValues(parseFloat(shippingCost) || 0, currencyCode, exchangeRate).usd, 'USD')}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border font-bold text-sm">
              <span className="text-foreground">{t('purchases.grandTotal', 'Grand Total')}</span>
              <span className="text-primary font-mono">{formatCurrency(getDualValues(totals.grand_total, currencyCode, exchangeRate).usd, 'USD')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer"
        >
          {t('common.cancel', 'Cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          <span>{editPurchaseId ? t('purchases.updatePO', 'Update PO') : t('purchases.createPO', 'Save Purchase Order')}</span>
        </button>
      </div>
    </form>
  )
}
