import React, { useMemo } from 'react'
import {
  Scale,
  Ruler,
  Box,
  Truck,
  Save,
  Check,
  Package,
  Layers,
  Smartphone,
  Shirt,
  Laptop,
  Tv,
  Navigation,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FlexibleDimensionsSectionProps {
  weight: string
  length: string
  width: string
  height: string
  onWeightChange: (val: string) => void
  onLengthChange: (val: string) => void
  onWidthChange: (val: string) => void
  onHeightChange: (val: string) => void
  onSave?: () => void
  isSaving?: boolean
}

export const FlexibleDimensionsSection: React.FC<FlexibleDimensionsSectionProps> = ({
  weight,
  length,
  width,
  height,
  onWeightChange,
  onLengthChange,
  onWidthChange,
  onHeightChange,
  onSave,
  isSaving = false,
}) => {
  const { t } = useTranslation(['products', 'common'])

  const w = parseFloat(weight) || 0
  const l = parseFloat(length) || 0
  const wi = parseFloat(width) || 0
  const h = parseFloat(height) || 0

  // 1. Calculations
  const volumeCm3 = useMemo(() => l * wi * h, [l, wi, h])
  const volumeM3 = useMemo(() => volumeCm3 / 1000000, [volumeCm3])
  const volumetricWeightKg = useMemo(() => volumeCm3 / 5000, [volumeCm3]) // Standard Logistics Formula (L*W*H / 5000)
  const billableWeight = useMemo(() => Math.max(w, volumetricWeightKg), [w, volumetricWeightKg])
  const isVolumetricHigher = volumetricWeightKg > w

  // Package Classification Preset
  const packageCategory = useMemo(() => {
    if (l === 0 && wi === 0 && h === 0 && w === 0) return t('products.pkgUnset', 'មិនទាន់កំណត់')
    if (w <= 1 && l <= 25 && wi <= 20 && h <= 10) return t('products.pkgSmall', 'កញ្ចប់តូច (Small Envelope/Box)')
    if (w <= 5 && l <= 45 && wi <= 35 && h <= 25) return t('products.pkgStandard', 'កញ្ចប់មធ្យម (Standard Parcel)')
    if (w <= 15 && l <= 60 && wi <= 50 && h <= 40) return t('products.pkgLarge', 'កញ្ចប់ធំ (Large Carton)')
    return t('products.pkgBulky', 'កញ្ចប់ធំពិសេស/ទំនិញធ្ងន់ (Bulky / Heavy Cargo)')
  }, [w, l, wi, h, t])

  // Presets with SVG icons instead of emojis
  const dimensionPresets = [
    { label: t('products.presetSmallAccessory', 'ប្រអប់តូច (Small Accessory)'), Icon: Smartphone, color: 'text-primary', l: '15', w: '10', h: '5', wt: '0.3' },
    { label: t('products.presetApparelBox', 'សម្លៀកបំពាក់ (Apparel Box)'), Icon: Shirt, color: 'text-purple-500', l: '30', w: '22', h: '6', wt: '0.5' },
    { label: t('products.presetLaptopBox', 'Laptop Box (កុំព្យូទ័រ)'), Icon: Laptop, color: 'text-blue-500', l: '42', w: '30', h: '8', wt: '2.5' },
    { label: t('products.presetStandardParcel', 'កញ្ចប់មធ្យម (Standard Parcel)'), Icon: Package, color: 'text-amber-500', l: '35', w: '25', h: '15', wt: '3.0' },
    { label: t('products.presetLargeCarton', 'កញ្ចប់ធំ (Large Carton)'), Icon: Tv, color: 'text-rose-500', l: '55', w: '40', h: '30', wt: '8.0' },
  ]

  const applyPreset = (preset: typeof dimensionPresets[0]) => {
    onLengthChange(preset.l)
    onWidthChange(preset.w)
    onHeightChange(preset.h)
    if (preset.wt) onWeightChange(preset.wt)
  }

  const handleQuickWeightAdd = (amount: number) => {
    const current = parseFloat(weight) || 0
    const next = Math.max(0, current + amount)
    onWeightChange(next.toFixed(3).replace(/\.?0+$/, ''))
  }

  return (
    <div className="space-y-6">
      {/* ─── 1. TOP METRIC CARDS HEADER (SPACIOUS, ELEGANT, ZERO CLIPPING) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Actual Weight */}
        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group flex flex-col justify-between min-h-[145px]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('products.actualWeightLabel', 'ទម្ងន់ពិត (Actual Weight)')}
              </span>
              <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Scale size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2.5xl font-black font-mono text-slate-900 dark:text-slate-100">
                {w > 0 ? w : '0'}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">kg</span>
            </div>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
              = {(w * 1000).toLocaleString()} {t('products.gramsUnit', 'ក្រាម (g)')}
            </span>
          </div>
        </div>

        {/* Metric 2: Volume CBM */}
        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group flex flex-col justify-between min-h-[145px]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('products.volumeLabel', 'មាត្រឌីម៉ង់ (Volume)')}
              </span>
              <div className="p-2 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Box size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2.5xl font-black font-mono text-slate-900 dark:text-slate-100">
                {volumeM3 > 0 ? volumeM3.toFixed(4) : '0.0000'}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">m³ (CBM)</span>
            </div>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
              {volumeCm3.toLocaleString()} cm³
            </span>
          </div>
        </div>

        {/* Metric 3: Volumetric Weight */}
        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group flex flex-col justify-between min-h-[145px]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('products.volumetricWeightLabel', 'ទម្ងន់មាត្រ (Dim Weight)')}
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Ruler size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2.5xl font-black font-mono text-slate-900 dark:text-slate-100">
                {volumetricWeightKg > 0 ? volumetricWeightKg.toFixed(2) : '0.00'}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">kg (Dim)</span>
            </div>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-[11px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {t('products.volumetricFormula', '(L × W × H) / 5000')}
            </span>
          </div>
        </div>

        {/* Metric 4: Billable Weight Tier (PERFECT FLOATING PILL, ZERO CLIPPING) */}
        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group flex flex-col justify-between min-h-[145px]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('products.billableWeightLabel', 'ទម្ងន់គិតថ្លៃ (Billable)')}
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Truck size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2.5xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {billableWeight > 0 ? billableWeight.toFixed(2) : '0.00'}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">kg</span>
            </div>
          </div>
          <div className="pt-2">
            {isVolumetricHigher ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-bold">
                <AlertTriangle size={13} className="shrink-0" />
                <span className="truncate">{t('products.billableVolumetricAlert', 'គិតតាមមាត្រឌីម៉ង់ (Dim > Actual)')}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                <CheckCircle2 size={13} className="shrink-0" />
                <span className="truncate">{t('products.billableActualAlert', 'គិតតាមទម្ងន់ពិត (Actual Weight)')}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN CONTENT GRID (FORM & CALCULATOR) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Dimensions & Weight Form Inputs (2 Columns width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Input Card */}
          <div className="bg-white dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {t('products.itemPackageTitle', 'ទំហំ និងទម្ងន់កញ្ចប់ទំនិញ (Item Package & Dimensions)')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('products.itemPackageDesc', 'កំណត់ទម្ងន់ និងវិមាត្រប្រអប់ដើម្បីគណនាថ្លៃដឹកជញ្ជូន និងរៀបចំកញ្ចប់')}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30 text-xs font-bold">
                <CheckCircle2 size={14} />
                <span>{packageCategory}</span>
              </div>
            </div>

            {/* Weight Input Row */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                {t('products.totalWeightKgLabel', 'ទម្ងន់កញ្ចប់សរុប (Weight in Kilograms)')}
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
                  <Scale size={18} />
                </div>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={weight}
                  onChange={(e) => onWeightChange(e.target.value)}
                  placeholder="0.000"
                  className="w-full h-11 pl-11 pr-16 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
                <span className="absolute right-4 font-mono font-bold text-xs text-slate-400 dark:text-slate-500">
                  KG
                </span>
              </div>

              {/* Quick Weight Adjust Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">{t('products.quickAddWeight', 'ថែមទម្ងន់លឿន:')}</span>
                {[
                  { label: '+100g', val: 0.1 },
                  { label: '+500g', val: 0.5 },
                  { label: '+1kg', val: 1.0 },
                  { label: '+2kg', val: 2.0 },
                  { label: '+5kg', val: 5.0 },
                ].map((b, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickWeightAdd(b.val)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 hover:bg-primary/10 hover:text-primary text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 text-[11px] font-mono font-bold transition-all cursor-pointer"
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Dimensions Grid */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                {t('products.packageDimensionsTitle', 'វិមាត្រកញ្ចប់ទំនិញ (Package Dimensions: L × W × H)')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Length */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {t('products.lengthCmLabel', 'ប្រវែង / Length (cm)')}
                  </span>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={length}
                      onChange={(e) => onLengthChange(e.target.value)}
                      placeholder="0.0"
                      className="w-full h-10 px-3.5 pr-10 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                    <span className="absolute right-3 font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      cm
                    </span>
                  </div>
                </div>

                {/* Width */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {t('products.widthCmLabel', 'ទទឹង / Width (cm)')}
                  </span>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={width}
                      onChange={(e) => onWidthChange(e.target.value)}
                      placeholder="0.0"
                      className="w-full h-10 px-3.5 pr-10 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                    <span className="absolute right-3 font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      cm
                    </span>
                  </div>
                </div>

                {/* Height */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {t('products.heightCmLabel', 'កម្ពស់ / Height (cm)')}
                  </span>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={height}
                      onChange={(e) => onHeightChange(e.target.value)}
                      placeholder="0.0"
                      className="w-full h-10 px-3.5 pr-10 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                    <span className="absolute right-3 font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      cm
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Dimension Templates (Lucide SVG Icons) */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                {t('products.presetTemplatesTitle', 'ទំហំគំរូស្វ័យប្រវត្តិ (Preset Dimension Templates)')}
              </span>
              <div className="flex flex-wrap gap-2">
                {dimensionPresets.map((p, idx) => {
                  const IconComp = p.Icon
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 hover:bg-primary/10 hover:text-primary border border-slate-200 dark:border-slate-700/80 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <IconComp size={14} className={`${p.color} shrink-0`} />
                      <span>{p.label}</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        ({p.l}x{p.w}x{p.h}cm)
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Package Diagram & Shipping Rules (1 Column width) */}
        <div className="space-y-6">
          {/* Visual 3D Package Box Diagram */}
          <div className="bg-white dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-primary" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {t('products.boxVisualizerTitle', 'តួរលេខកញ្ចប់ប្រអប់ (Box Visualizer)')}
              </h4>
            </div>

            {/* Interactive Box Illustration */}
            <div className="relative h-44 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-primary/20 flex items-center justify-center p-4">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 text-primary shadow-inner">
                  <Box size={40} className="animate-pulse" />
                </div>
                <div className="font-mono text-xs font-black text-slate-900 dark:text-slate-100">
                  {l || 0} cm × {wi || 0} cm × {h || 0} cm
                </div>
                <div className="inline-block px-3 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold font-mono border border-primary/20">
                  {volumeM3.toFixed(4)} CBM
                </div>
              </div>
            </div>

            {/* Logistics Class Guidance with Lucide SVG Icons */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{t('products.suitableDeliveryService', 'សេវាដឹកជញ្ជូនសមស្រប:')}</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                  {w > 10 || volumetricWeightKg > 10 ? (
                    <>
                      <Truck size={14} className="text-primary shrink-0" />
                      <span>{t('products.expressVan', 'រថយន្តដឹក (Express Van)')}</span>
                    </>
                  ) : (
                    <>
                      <Navigation size={14} className="text-primary shrink-0" />
                      <span>{t('products.bikeDelivery', 'ម៉ូតូដឹក (Bike Delivery)')}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{t('products.packageCategoryLabel', 'ប្រភេទកញ្ចប់:')}</span>
                <span className="font-bold text-primary">
                  {packageCategory}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. BOTTOM ACTION BAR ─── */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          disabled={isSaving}
          onClick={onSave}
          className="px-6 py-2.5 bg-gradient-primary text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          {isSaving ? (
            <span className="animate-spin text-white">⌛</span>
          ) : (
            <Save size={16} />
          )}
          <span>{t('products.saveShippingDetails', 'រក្សាទុកទំហំ និងទម្ងន់')}</span>
        </button>
      </div>
    </div>
  )
}
