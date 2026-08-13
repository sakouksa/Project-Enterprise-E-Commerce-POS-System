import React from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles, Layers, Tag, Box, Percent, Shield, Wand2, RefreshCw } from 'lucide-react'
import type { ProductForm } from '../types/productForm.types'

interface ProductBasicInfoSectionProps {
  form: ProductForm
  setField: (field: keyof ProductForm, value: any) => void
  categories: any[]
  brands: any[]
  units: any[]
  taxes: any[]
  isSkuManuallyEdited: boolean
  setIsSkuManuallyEdited: (val: boolean) => void
  generateSKU: (name: string) => string
}

export const ProductBasicInfoSection: React.FC<ProductBasicInfoSectionProps> = ({
  form,
  setField,
  categories,
  brands,
  units,
  taxes,
  isSkuManuallyEdited,
  setIsSkuManuallyEdited,
  generateSKU,
}) => {
  const { t } = useTranslation(['products', 'common'])

  const handleNameChange = (val: string) => {
    const autoSku = (!isSkuManuallyEdited || !form.sku.trim()) ? generateSKU(val) : form.sku
    setField('name', val)
    if (!isSkuManuallyEdited || !form.sku.trim()) {
      setField('sku', autoSku)
    }
  }

  const handleAutoGenerateBarcode = () => {
    const random12 = Math.floor(100000000000 + Math.random() * 900000000000).toString()
    setField('barcode', random12)
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3.5 mb-4 border-b border-border/70">
        <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
          <Layers size={18} />
        </div>
        <div>
          <h3 className="font-bold text-sm text-foreground">{t('products.generalInfo')}</h3>
          <p className="text-[11px] text-muted-foreground">{t('products.generalInfoSub', 'Core identifiers, classification and taxonomy')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Row 1: Product Name */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            {t('products.name')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={form.name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder={t('products.namePlaceholder', 'e.g. iPhone 16 Pro Max 256GB Desert Titanium')}
              className="form-input w-full text-sm font-medium"
            />
          </div>
        </div>

        {/* Row 2: SKU & Barcode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-muted-foreground">
                {t('products.sku')} <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setField('sku', generateSKU(form.name) || `SKU-${Date.now().toString().slice(-6)}`)
                  setIsSkuManuallyEdited(false)
                }}
                className="text-[10px] text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <RefreshCw size={10} />
                <span>{t('products.autoGenerate', 'Auto Gen')}</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={form.sku}
              onChange={e => {
                setField('sku', e.target.value)
                setIsSkuManuallyEdited(true)
              }}
              placeholder="SKU-IPHONE-16-PRO"
              className="form-input w-full font-mono text-xs uppercase"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-muted-foreground">
                {t('products.barcode')}
              </label>
              <button
                type="button"
                onClick={handleAutoGenerateBarcode}
                className="text-[10px] text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <Wand2 size={10} />
                <span>{t('products.generateBarcode', 'Gen EAN-13')}</span>
              </button>
            </div>
            <input
              type="text"
              value={form.barcode}
              onChange={e => setField('barcode', e.target.value)}
              placeholder="885909123456"
              className="form-input w-full font-mono text-xs"
            />
          </div>
        </div>

        {/* Row 3: Category, Brand, Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              {t('products.category')} <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category_id}
              onChange={e => setField('category_id', e.target.value)}
              className="form-select w-full text-xs font-medium cursor-pointer"
              required
            >
              <option value="">{t('products.selectCategory', 'Select Category...')}</option>
              {(categories || []).map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              {t('products.brand')}
            </label>
            <select
              value={form.brand_id}
              onChange={e => setField('brand_id', e.target.value)}
              className="form-select w-full text-xs font-medium cursor-pointer"
            >
              <option value="">{t('products.selectBrand', 'None / Generic...')}</option>
              {(brands || []).map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              {t('products.unit')}
            </label>
            <select
              value={form.unit_id}
              onChange={e => setField('unit_id', e.target.value)}
              className="form-select w-full text-xs font-medium cursor-pointer"
            >
              <option value="">{t('products.selectUnit', 'Piece (pcs)...')}</option>
              {(units || []).map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol || u.code || 'pcs'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Short Description & Full Description */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            {t('products.shortDescription', 'Short Summary (POS Display)')}
          </label>
          <input
            type="text"
            value={form.short_description}
            onChange={e => setField('short_description', e.target.value)}
            placeholder={t('products.shortDescPlaceholder', 'Quick 1-line feature highlight for POS receipt & cashier view')}
            className="form-input w-full text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            {t('products.description', 'Full Specifications & Description')}
          </label>
          <textarea
            value={form.description}
            onChange={e => setField('description', e.target.value)}
            rows={4}
            placeholder={t('products.descPlaceholder', 'Full catalog details and technical specifications...')}
            className="form-input w-full resize-none text-xs"
          />
        </div>

        {/* Row 5: Status & Feature Switches */}
        <div className="pt-2 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border/70 hover:bg-muted/30 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={form.status === 'active'}
              onChange={e => setField('status', e.target.checked ? 'active' : 'inactive')}
              className="w-4 h-4 rounded text-primary focus:ring-primary/30"
            />
            <div>
              <span className="text-xs font-bold text-foreground block">{t('products.active', 'Active')}</span>
              <span className="text-[10px] text-muted-foreground">{t('products.activeDesc', 'Visible in sales')}</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border/70 hover:bg-muted/30 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={e => setField('is_featured', e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary/30"
            />
            <div>
              <span className="text-xs font-bold text-foreground block">{t('products.featured', 'Featured')}</span>
              <span className="text-[10px] text-muted-foreground">{t('products.featuredDesc', 'Top showcase')}</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border/70 hover:bg-muted/30 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={form.is_digital}
              onChange={e => setField('is_digital', e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary/30"
            />
            <div>
              <span className="text-xs font-bold text-foreground block">{t('products.digital', 'Digital')}</span>
              <span className="text-[10px] text-muted-foreground">{t('products.digitalDesc', 'No physical delivery')}</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border/70 hover:bg-muted/30 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={form.track_inventory}
              onChange={e => setField('track_inventory', e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary/30"
            />
            <div>
              <span className="text-xs font-bold text-foreground block">{t('products.trackStock', 'Stock Track')}</span>
              <span className="text-[10px] text-muted-foreground">{t('products.trackStockDesc', 'Deduct on sale')}</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
