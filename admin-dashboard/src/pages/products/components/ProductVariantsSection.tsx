import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Sparkles, SlidersHorizontal, Plus, Trash2, Edit2, Eye, RefreshCw, Check,
  ChevronLeft, ChevronRight, CheckCircle2, Box, Palette
} from 'lucide-react'
import { SIZE_PRESET_MAP } from '../utils/productPresets'
import { COLOR_MAP, getVariantColorHex, getDynamicColorMatchedImage } from '../utils/colorResolver'
import type { CustomColorItem } from '../types/productForm.types'

interface ProductVariantsSectionProps {
  productId: number | null
  form: any
  setField: (field: string, val: any) => void
  productDetail: any
  selectedPresetMode: string
  setSelectedPresetMode: (mode: string) => void
  customSizeCategory: string
  activeCategoryKey: string
  handleSwitchSizeCategory: (catKey: string) => void
  customSelectedSizes: string[]
  setCustomSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>
  customInputSize: string
  setCustomInputSize: (val: string) => void
  userAddedSizes: string[]
  handleAddUserCustomSize: (e: React.FormEvent) => void
  customSelectedColors: string[]
  setCustomSelectedColors: React.Dispatch<React.SetStateAction<string[]>>
  customInputColor: string
  setCustomInputColor: (val: string) => void
  customColorHex: string
  setCustomColorHex: (val: string) => void
  userAddedColors: CustomColorItem[]
  handleAddUserCustomColor: (e: React.FormEvent) => void
  isGeneratingVariants: boolean
  matrixProgress: { current: number; total: number } | null
  handleGenerateMatrix: () => void
  variantPage: number
  setVariantPage: (page: number) => void
  variantPageSize: number
  setVariantPageSize: (size: number) => void
  selectedVariantIds: number[]
  setSelectedVariantIds: React.Dispatch<React.SetStateAction<number[]>>
  onOpenEditVariant: (variant: any) => void
  onOpenViewVariant: (variant: any) => void
  onOpenDeleteVariant: (variant: { id: number; name: string }) => void
  onOpenClearAllVariants: () => void
  onOpenBulkDeleteVariants: () => void
  onQuickToggleVariantStatus: (variant: any) => void
}

export const ProductVariantsSection: React.FC<ProductVariantsSectionProps> = ({
  productId,
  form,
  setField,
  productDetail,
  selectedPresetMode,
  setSelectedPresetMode,
  customSizeCategory,
  activeCategoryKey,
  handleSwitchSizeCategory,
  customSelectedSizes,
  setCustomSelectedSizes,
  customInputSize,
  setCustomInputSize,
  userAddedSizes,
  handleAddUserCustomSize,
  customSelectedColors,
  setCustomSelectedColors,
  customInputColor,
  setCustomInputColor,
  customColorHex,
  setCustomColorHex,
  userAddedColors,
  handleAddUserCustomColor,
  isGeneratingVariants,
  matrixProgress,
  handleGenerateMatrix,
  variantPage,
  setVariantPage,
  variantPageSize,
  setVariantPageSize,
  selectedVariantIds,
  setSelectedVariantIds,
  onOpenEditVariant,
  onOpenViewVariant,
  onOpenDeleteVariant,
  onOpenClearAllVariants,
  onOpenBulkDeleteVariants,
  onQuickToggleVariantStatus,
}) => {
  const { t } = useTranslation(['products', 'common'])
  const variants: any[] = productDetail?.variants || []

  // Pagination calculation
  const totalVariants = variants.length
  const totalPages = Math.ceil(totalVariants / variantPageSize) || 1
  const paginatedVariants = variants.slice((variantPage - 1) * variantPageSize, variantPage * variantPageSize)

  const activePresetObj = SIZE_PRESET_MAP[activeCategoryKey] || SIZE_PRESET_MAP.smartphones

  return (
    <div className="space-y-6">
      {/* Variants Enable Toggle Card */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400">
            <SlidersHorizontal size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">{t('products.enableVariants', 'Multi-Dimensional Variants')}</h3>
            <p className="text-xs text-muted-foreground">{t('products.enableVariantsSub', 'Generate color, storage, size, or material matrix for this product')}</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={form.has_variants}
            onChange={e => setField('has_variants', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      {form.has_variants && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Preset Builder Card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border/70">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{t('products.smartPresetBuilder', 'Smart Variant Matrix Generator')}</h4>
                  <p className="text-[11px] text-muted-foreground">{t('products.smartPresetSub', 'Select sizes/specs and colors to auto-calculate SKU and pricing')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {Object.entries(SIZE_PRESET_MAP).map(([key, config]) => {
                  const IconComp = config.icon
                  const isActive = activeCategoryKey === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSwitchSizeCategory(key)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <IconComp size={13} />
                      <span className="capitalize">{key}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Spec & Size Options */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">{t('products.selectSpecsOrSizes', '1. Select Sizes / Specifications:')}</span>
              <div className="flex flex-wrap gap-2">
                {activePresetObj.options.map(opt => {
                  const isSelected = customSelectedSizes.includes(opt.code)
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => {
                        setCustomSelectedSizes(prev =>
                          isSelected ? prev.filter(s => s !== opt.code) : [...prev, opt.code]
                        )
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-primary/15 text-primary border border-primary/30 shadow-2xs'
                          : 'bg-muted/30 hover:bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      {isSelected && <Check size={12} />}
                      <span>{opt.code}</span>
                      <span className="text-[10px] font-normal opacity-70">({opt.badge})</span>
                    </button>
                  )
                })}

                {userAddedSizes.map(s => {
                  const isSelected = customSelectedSizes.includes(s)
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setCustomSelectedSizes(prev =>
                          isSelected ? prev.filter(x => x !== s) : [...prev, s]
                        )
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-primary/15 text-primary border border-primary/30 shadow-2xs'
                          : 'bg-muted/30 hover:bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      {isSelected && <Check size={12} />}
                      <span>{s}</span>
                    </button>
                  )
                })}
              </div>

              {/* Custom Size Adder */}
              <form onSubmit={handleAddUserCustomSize} className="flex items-center gap-2 pt-1 max-w-sm">
                <input
                  type="text"
                  value={customInputSize}
                  onChange={e => setCustomInputSize(e.target.value)}
                  placeholder={t('products.addCustomSizePlaceholder', '+ Add custom size (e.g. 2TB, XXL)...')}
                  className="form-input text-xs w-full"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </form>
            </div>

            {/* Colors Selection */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="text-xs font-bold text-foreground block">{t('products.selectColors', '2. Select Colors & Swatches:')}</span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Black', 'White', 'Silver', 'Space Gray', 'Natural Titanium',
                  'Midnight', 'Starlight', 'Red', 'Blue', 'Gold', 'Green', 'Purple', 'Pink'
                ].map(c => {
                  const isSelected = customSelectedColors.includes(c)
                  const hex = COLOR_MAP[c.toLowerCase()] || '#6b7280'
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCustomSelectedColors(prev =>
                          isSelected ? prev.filter(x => x !== c) : [...prev, c]
                        )
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-primary/15 text-primary border border-primary/30 shadow-2xs'
                          : 'bg-muted/30 hover:bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: hex }} />
                      <span>{c}</span>
                    </button>
                  )
                })}

                {userAddedColors.map(c => {
                  const isSelected = customSelectedColors.includes(c.key)
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => {
                        setCustomSelectedColors(prev =>
                          isSelected ? prev.filter(x => x !== c.key) : [...prev, c.key]
                        )
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-primary/15 text-primary border border-primary/30 shadow-2xs'
                          : 'bg-muted/30 hover:bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Custom Color Adder */}
              <form onSubmit={handleAddUserCustomColor} className="flex items-center gap-2 pt-1 max-w-md">
                <input
                  type="color"
                  value={customColorHex}
                  onChange={e => setCustomColorHex(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-border"
                  title="Pick Color"
                />
                <input
                  type="text"
                  value={customInputColor}
                  onChange={e => setCustomInputColor(e.target.value)}
                  placeholder={t('products.addCustomColorPlaceholder', '+ Add custom color (e.g. Cobalt Blue)...')}
                  className="form-input text-xs flex-1"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </form>
            </div>

            {/* Matrix Generation Action */}
            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {customSelectedSizes.length} sizes × {customSelectedColors.length} colors = <strong>{customSelectedSizes.length * customSelectedColors.length} variants</strong>
              </span>

              <button
                type="button"
                onClick={handleGenerateMatrix}
                disabled={isGeneratingVariants || customSelectedSizes.length === 0 || customSelectedColors.length === 0}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <Sparkles size={14} />
                <span>{isGeneratingVariants ? t('products.generating', 'Generating...') : t('products.generateMatrix', 'Generate Matrix')}</span>
              </button>
            </div>

            {matrixProgress && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-primary">
                  <span>Generating Variant Matrix...</span>
                  <span>{matrixProgress.current} / {matrixProgress.total}</span>
                </div>
                <div className="w-full h-1.5 bg-primary/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(matrixProgress.current / matrixProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Generated Variants Table */}
          {variants.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    {t('products.existingVariants', 'Existing Product Variants')} ({variants.length})
                  </h4>
                  <p className="text-[11px] text-muted-foreground">{t('products.variantsTableSub', 'Individual SKU codes, barcodes, price overrides and POS status')}</p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedVariantIds.length > 0 && (
                    <button
                      type="button"
                      onClick={onOpenBulkDeleteVariants}
                      className="px-3 py-1.5 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>{t('common.delete', 'Delete')} ({selectedVariantIds.length})</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onOpenClearAllVariants}
                    className="px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10 rounded-xl font-semibold cursor-pointer"
                  >
                    {t('products.clearAllVariants', 'Clear All')}
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-border/80 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold uppercase text-[10px] tracking-wider border-b border-border/80">
                    <tr>
                      <th className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedVariantIds.length === variants.length && variants.length > 0}
                          onChange={e => {
                            if (e.target.checked) setSelectedVariantIds(variants.map(v => v.id))
                            else setSelectedVariantIds([])
                          }}
                          className="w-3.5 h-3.5 rounded text-primary focus:ring-primary/30 cursor-pointer"
                        />
                      </th>
                      <th className="p-3">{t('products.variant', 'Variant')}</th>
                      <th className="p-3 font-mono">{t('products.sku', 'SKU')}</th>
                      <th className="p-3">{t('products.sellingPrice', 'Price')}</th>
                      <th className="p-3">{t('products.costPrice', 'Cost')}</th>
                      <th className="p-3">{t('products.stock', 'Stock')}</th>
                      <th className="p-3 text-center">{t('products.status', 'Status')}</th>
                      <th className="p-3 text-right">{t('common.actions', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {paginatedVariants.map((v: any) => {
                      const hex = getVariantColorHex(v)
                      const isSelected = selectedVariantIds.includes(v.id)
                      return (
                        <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={e => {
                                if (e.target.checked) setSelectedVariantIds(prev => [...prev, v.id])
                                else setSelectedVariantIds(prev => prev.filter(x => x !== v.id))
                              }}
                              className="w-3.5 h-3.5 rounded text-primary focus:ring-primary/30 cursor-pointer"
                            />
                          </td>
                          <td className="p-3 font-medium text-foreground flex items-center gap-2">
                            {hex && (
                              <span className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: hex }} />
                            )}
                            <span className="truncate max-w-[200px]">{v.name}</span>
                          </td>
                          <td className="p-3 font-mono text-muted-foreground">{v.sku || '—'}</td>
                          <td className="p-3 font-bold text-primary">${Number(v.selling_price || 0).toFixed(2)}</td>
                          <td className="p-3 font-mono text-muted-foreground">${Number(v.cost_price || 0).toFixed(2)}</td>
                          <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">{v.stock ?? 0}</td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => onQuickToggleVariantStatus(v)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                v.is_active
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20'
                                  : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                              }`}
                            >
                              {v.is_active ? t('products.active', 'Active') : t('products.inactive', 'Inactive')}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => onOpenViewVariant(v)}
                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                title={t('common.view', 'View')}
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => onOpenEditVariant(v)}
                                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                title={t('common.edit', 'Edit')}
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => onOpenDeleteVariant({ id: v.id, name: v.name })}
                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 cursor-pointer"
                                title={t('common.delete', 'Delete')}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    Page {variantPage} of {totalPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={variantPage <= 1}
                      onClick={() => setVariantPage(variantPage - 1)}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={variantPage >= totalPages}
                      onClick={() => setVariantPage(variantPage + 1)}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
