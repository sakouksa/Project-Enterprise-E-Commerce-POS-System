import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Trash, Loader2, Plus, Minus, Package,
  Landmark, FileText, CheckCircle2, DollarSign
} from 'lucide-react'
import { FormHeader, FormFooter } from '@/components/common'
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
  suppliers = [],
  warehouses = [],
  branches = [],
  filteredProducts = [],
  prodSearch,
  setProdSearch,
  prodDropdownOpen,
  setProdDropdownOpen,
  totals,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation(['purchases', 'common', 'nav'])

  const isEdit = !!editPurchaseId

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ─── Global Form Header (Unboxed, Clean & Distinct) ─── */}
      <FormHeader
        isEdit={isEdit}
        title={
          isEdit
            ? t('purchases.editPOTitle', 'Edit Purchase Order: {{ref}}', { ref: `#${editPurchaseId}` })
            : t('purchases.createPOTitle', 'Create Purchase Order')
        }
        subtitle={
          isEdit
            ? t('purchases.editPOSubtitle', 'Update items, pricing, and purchase order details')
            : t('purchases.createPOSubtitle', 'Select supplier, destination warehouse, and products to create an inbound purchase order')
        }
        breadcrumbs={[
          { label: t('nav.purchases', 'Purchases'), path: '/purchases' },
          {
            label: isEdit
              ? t('purchases.editPO', 'Edit Purchase Order')
              : t('purchases.createPO', 'Create Purchase Order'),
          },
        ]}
        backPath="/purchases"
        backLabel={t('common.back', 'Back')}
        onBack={onCancel}
        isSubmitting={isSubmitting}
        submitLabel={t('purchases.updatePO', 'Save Changes')}
        onSubmit={onSubmit}
      />

      {editLoading && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2 text-xs font-semibold text-primary">
          <Loader2 size={16} className="animate-spin" />
          <span>{t('purchases.loadingItems', 'Loading purchase order items...')}</span>
        </div>
      )}

      {/* ─── Card 1: Order General Information ─── */}
      <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold shrink-0 shadow-2xs">
            <Landmark size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {t('purchases.orderInformation', 'Order Information')}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {t('purchases.orderInformationDesc', 'Specify supplier, destination warehouse, order date, and transaction currency')}
            </p>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Supplier */}
          <div>
            <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
              {t('purchases.supplier', 'Supplier')} <span className="text-destructive">*</span>
            </label>
            <ModernSelect
              value={supplierId}
              onChange={(val) => setSupplierId(String(val))}
              options={[
                { value: '', label: t('purchases.selectSupplier', 'Select Supplier') },
                ...suppliers.map((s: any) => ({
                  value: s.id,
                  label: s.name,
                  code: s.code,
                  subtitle: s.phone || s.email,
                })),
              ]}
              placeholder={t('purchases.selectSupplier', 'Select Supplier')}
            />
          </div>

          {/* Warehouse */}
          <div>
            <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
              {t('purchases.warehouse', 'Receiving Warehouse')} <span className="text-destructive">*</span>
            </label>
            <ModernSelect
              value={warehouseId}
              onChange={(val) => setWarehouseId(String(val))}
              options={[
                { value: '', label: t('purchases.selectWarehouse', 'Select Warehouse') },
                ...warehouses.map((w: any) => ({
                  value: w.id,
                  label: w.name,
                  code: w.code,
                })),
              ]}
              placeholder={t('purchases.selectWarehouse', 'Select Warehouse')}
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
              {t('purchases.branch', 'Branch')} <span className="text-destructive">*</span>
            </label>
            <ModernSelect
              value={branchId}
              onChange={(val) => setBranchId(String(val))}
              options={branches.map((b: any) => ({
                value: b.id,
                label: b.name,
                code: b.code,
              }))}
              placeholder={t('purchases.selectBranch', 'Select Branch')}
            />
          </div>

          {/* PO Date */}
          <div>
            <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
              {t('purchases.date', 'Order Date')} <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              value={poDate}
              onChange={(e) => setPoDate(e.target.value)}
              required
              className="form-input w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground font-medium focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            />
          </div>

          {/* Due Date */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-foreground/90">
                {t('purchases.dueDate', 'Due Date')}
              </label>
              <div className="flex items-center gap-1">
                {[7, 15, 30].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => {
                      const base = poDate ? new Date(poDate) : new Date()
                      base.setDate(base.getDate() + days)
                      setDueDate(base.toISOString().split('T')[0])
                    }}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground font-mono transition-colors cursor-pointer"
                  >
                    +{days}d
                  </button>
                ))}
              </div>
            </div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-input w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground font-medium focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
              {t('purchases.currency', 'Currency')} <span className="text-destructive">*</span>
            </label>
            <ModernSelect
              value={currencyCode}
              onChange={(val) => handleCurrencyChange(String(val))}
              options={[
                { value: 'USD', label: 'USD ($ - US Dollar)' },
                { value: 'KHR', label: 'KHR (៛ - Khmer Riel)' },
              ]}
              placeholder={t('purchases.selectCurrency', 'Select Currency')}
            />
          </div>

          {/* Exchange Rate */}
          <div>
            <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
              {t('purchases.exchangeRate', 'Exchange Rate')} <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              value={currencyCode === 'KHR' ? '1' : exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              disabled={currencyCode === 'KHR'}
              required
              min="0.000001"
              step="any"
              className="form-input w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground font-mono font-medium disabled:opacity-60 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Shipping Cost */}
          <div>
            <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
              {t('purchases.shippingCost', 'Shipping Cost')} ({currencyCode})
            </label>
            <input
              type="number"
              value={shippingCost}
              onChange={(e) => setShippingCost(e.target.value)}
              min="0"
              step="any"
              className="form-input w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground font-mono font-medium focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ─── Card 2: Product Catalog Search & Item Table ─── */}
      <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0 shadow-2xs">
            <Package size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {t('purchases.orderItems', 'Order Items')}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {t('purchases.orderItemsDesc', 'Search and select items from product catalog to add to purchase order')}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div>
          <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
            {t('purchases.searchAndAddProduct', 'Search & Add Product')}
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setProdDropdownOpen(!prodDropdownOpen)}
              className="w-full border border-border/80 rounded-xl p-3 bg-background text-xs flex items-center justify-between text-left hover:bg-muted/30 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Search size={15} className="text-primary" />
                <span className="font-medium text-xs sm:text-[13px]">
                  {t('purchases.clickToSearchCatalog', 'Click to search catalog...')}
                </span>
              </div>
              <span className="text-muted-foreground text-[11px] px-2 py-0.5 rounded-md bg-muted font-mono">▼</span>
            </button>

            <AnimatePresence>
              {prodDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProdDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.99 }}
                    className="absolute left-0 right-0 mt-2 max-h-88 overflow-hidden bg-card border border-border/80 rounded-2xl shadow-2xl z-20 flex flex-col p-2.5 space-y-2 backdrop-blur-md"
                  >
                    <div className="relative flex-shrink-0 p-1">
                      <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        autoFocus
                        value={prodSearch}
                        onChange={e => setProdSearch(e.target.value)}
                        placeholder={t('purchases.searchCatalogPlaceholder', 'Type product name, SKU or barcode...')}
                        className="form-input w-full pl-10 text-xs sm:text-[13px] border border-border/80 rounded-xl p-2.5 bg-muted/20 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>

                    <div className="overflow-y-auto flex-1 divide-y divide-border/40 max-h-64 px-1">
                      {filteredProducts.length === 0 ? (
                        <div className="p-6 text-center text-xs text-muted-foreground">
                          {t('purchases.noMatchingProducts', 'No matching products found.')}
                        </div>
                      ) : (
                        filteredProducts.map((item: any) => {
                          const isAlreadyInForm = formItems.some(
                            i => i.product_id === (item.product_id ?? item.id) && (i.product_variant_id || null) === (item.product_variant_id ?? null)
                          )
                          return (
                            <div
                              key={item.id}
                              onClick={() => addProductToForm(item)}
                              className="p-3 hover:bg-primary/8 cursor-pointer rounded-xl flex items-center justify-between transition-all group my-0.5"
                            >
                              <div className="space-y-1 max-w-[70%]">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs sm:text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">
                                    {item.name}
                                  </span>
                                  {isAlreadyInForm && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                      <CheckCircle2 size={10} /> +1
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-md">
                                    SKU: {item.sku || 'N/A'}
                                  </span>
                                  {item.barcode && (
                                    <span className="text-[10px] text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded-md">
                                      {item.barcode}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0 pl-3">
                                <span className="text-sm font-mono font-extrabold text-primary block">
                                  ${Number(item.cost_price || 0).toFixed(2)}
                                </span>
                                <span className="text-[10px] text-muted-foreground block font-medium">
                                  {t('purchases.unitCost', 'Unit Cost')}
                                </span>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Selected Items Table */}
        <div className="border border-border/80 rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/70">
                <th className="py-3 px-4 font-bold text-muted-foreground">{t('purchases.product', 'Product')}</th>
                <th className="py-3 px-3 font-bold text-muted-foreground text-center w-36">{t('purchases.quantity', 'Quantity')}</th>
                <th className="py-3 px-3 font-bold text-muted-foreground text-center w-32">{t('purchases.unitCost', 'Unit Cost')} ({currencyCode})</th>
                <th className="py-3 px-3 font-bold text-muted-foreground text-center w-24">{t('purchases.disc', 'Discount %')}</th>
                <th className="py-3 px-3 font-bold text-muted-foreground text-center w-24">{t('purchases.taxPercent', 'Tax %')}</th>
                <th className="py-3 px-4 font-bold text-muted-foreground text-right w-32">{t('purchases.total', 'Total')}</th>
                <th className="py-3 px-3 text-center w-14 font-bold text-muted-foreground">{t('common.action', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {formItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-xs font-medium">{t('purchases.noProductsAdded', 'No products added yet. Use search above to add items.')}</p>
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
                    <tr key={idx} className="hover:bg-muted/10 transition-colors">
                      {/* Product Name */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-foreground block text-xs sm:text-[13px]">{item.product_name}</span>
                        {item.notes && <span className="text-[11px] text-muted-foreground mt-0.5 block">{item.notes}</span>}
                      </td>

                      {/* Quantity Stepper */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-center border border-border/80 rounded-xl bg-background overflow-hidden shadow-2xs w-32 mx-auto">
                          <button
                            type="button"
                            onClick={() => {
                              const current = parseFloat(item.quantity) || 1
                              if (current > 1) {
                                updateFormItem(idx, 'quantity', (current - 1).toString())
                              } else {
                                removeFormItem(idx)
                              }
                            }}
                            className="px-2.5 py-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title={t('common.decrease', 'Decrease')}
                          >
                            <Minus size={13} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            step="any"
                            value={item.quantity}
                            onChange={e => updateFormItem(idx, 'quantity', e.target.value)}
                            className="w-14 text-center text-xs font-bold bg-transparent border-0 focus:ring-0 p-1 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const current = parseFloat(item.quantity) || 1
                              updateFormItem(idx, 'quantity', (current + 1).toString())
                            }}
                            className="px-2.5 py-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title={t('common.increase', 'Increase')}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </td>

                      {/* Unit Cost */}
                      <td className="py-3.5 px-3">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.unit_cost}
                          onChange={e => updateFormItem(idx, 'unit_cost', e.target.value)}
                          className="form-input w-full p-2 text-center text-xs font-mono font-semibold rounded-xl border border-border/80 bg-background focus:ring-2 focus:ring-primary/20"
                        />
                      </td>

                      {/* Discount % */}
                      <td className="py-3.5 px-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="any"
                          value={item.discount_percent}
                          onChange={e => updateFormItem(idx, 'discount_percent', e.target.value)}
                          className="form-input w-full p-2 text-center text-xs rounded-xl border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 font-mono"
                        />
                      </td>

                      {/* Tax % */}
                      <td className="py-3.5 px-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="any"
                          value={item.tax_percent}
                          onChange={e => updateFormItem(idx, 'tax_percent', e.target.value)}
                          className="form-input w-full p-2 text-center text-xs rounded-xl border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 font-mono"
                        />
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground text-xs sm:text-[13px]">
                        {formatCurrency(lineTotal, currencyCode)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeFormItem(idx)}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                          title={t('common.delete', 'Delete')}
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
      </div>

      {/* ─── Card 3: Notes & Financial Summary ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Notes & Terms */}
        <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <FileText size={15} className="text-primary" />
            <h4 className="text-xs font-bold text-foreground">
              {t('purchases.notes', 'Notes & Purchasing Terms')}
            </h4>
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={5}
            placeholder={t('purchases.notesPlaceholder', 'Enter purchasing terms or special notes...')}
            className="form-input w-full text-xs sm:text-[13px] rounded-xl border border-border/80 bg-background p-3 resize-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          />
        </div>

        {/* Financial Summary */}
        <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <DollarSign size={15} className="text-emerald-500" />
            <h4 className="text-xs font-bold text-foreground">
              {t('purchases.financialSummary', 'Financial Summary')}
            </h4>
          </div>

          <div className="space-y-2.5 text-xs sm:text-[13px]">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('purchases.subtotal', 'Subtotal')}</span>
              <span className="font-mono font-bold text-foreground">
                {formatCurrency(getDualValues(totals.subtotal, currencyCode, exchangeRate).usd, 'USD')}
              </span>
            </div>
            <div className="flex justify-between items-center text-destructive">
              <span>{t('purchases.discount', 'Discount')}</span>
              <span className="font-mono font-bold">
                - {formatCurrency(getDualValues(totals.discount_amount, currencyCode, exchangeRate).usd, 'USD')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('purchases.tax', 'Tax')}</span>
              <span className="font-mono font-bold text-foreground">
                {formatCurrency(getDualValues(totals.tax_amount, currencyCode, exchangeRate).usd, 'USD')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('purchases.shippingCost', 'Shipping Cost')}</span>
              <span className="font-mono font-bold text-foreground">
                {formatCurrency(getDualValues(parseFloat(shippingCost) || 0, currencyCode, exchangeRate).usd, 'USD')}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border/80 font-bold text-sm sm:text-base">
              <span className="text-foreground">{t('purchases.grandTotal', 'Grand Total')}</span>
              <span className="text-primary font-mono text-lg font-black">
                {formatCurrency(getDualValues(totals.grand_total, currencyCode, exchangeRate).usd, 'USD')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Global Form Footer ─── */}
      <FormFooter
        isEdit={isEdit}
        isSubmitting={isSubmitting}
        disabled={isSubmitting || formItems.length === 0}
        onCancel={onCancel}
        cancelLabel={t('common.cancel', 'Cancel')}
        submitLabel={isEdit ? t('purchases.updatePO', 'Save Changes') : t('purchases.createPO', 'Create Purchase Order')}
      />
    </form>
  )
}

export default PurchaseFormSection
