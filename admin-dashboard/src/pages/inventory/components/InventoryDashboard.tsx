import React, { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import {
  Package, Warehouse, AlertTriangle, TrendingUp, DollarSign,
  RefreshCw, BarChart2, CheckCircle, Layers, Tag
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { formatCurrency, formatNumber } from '@/utils/formatters'

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1', '#14b8a6', '#f97316', '#a855f7']

interface InventoryDashboardProps {
  stats?: any
  statsData?: any
  loadingStats?: boolean
  onTabChange: (tabId: any) => void
}

// 5-Language Month Dictionary
const MONTH_TRANSLATIONS: Record<string, Record<string, string>> = {
  Jan: { km: 'មករា', zh: '1月', th: 'ม.ค.', vi: 'Thg 1', en: 'Jan' },
  Feb: { km: 'កុម្ភៈ', zh: '2月', th: 'ก.พ.', vi: 'Thg 2', en: 'Feb' },
  Mar: { km: 'មីនា', zh: '3月', th: 'มี.ค.', vi: 'Thg 3', en: 'Mar' },
  Apr: { km: 'មេសា', zh: '4月', th: 'เม.ย.', vi: 'Thg 4', en: 'Apr' },
  May: { km: 'ឧសភា', zh: '5月', th: 'พ.ค.', vi: 'Thg 5', en: 'May' },
  Jun: { km: 'មិថុនា', zh: '6月', th: 'มิ.ย.', vi: 'Thg 6', en: 'Jun' },
  Jul: { km: 'កក្កដា', zh: '7月', th: 'ก.ค.', vi: 'Thg 7', en: 'Jul' },
  Aug: { km: 'សីហា', zh: '8月', th: 'ส.ค.', vi: 'Thg 8', en: 'Aug' },
  Sep: { km: 'កញ្ញា', zh: '9月', th: 'ก.ย.', vi: 'Thg 9', en: 'Sep' },
  Oct: { km: 'តុលា', zh: '10月', th: 'ต.ค.', vi: 'Thg 10', en: 'Oct' },
  Nov: { km: 'វិច្ឆិកា', zh: '11月', th: 'พ.ย.', vi: 'Thg 11', en: 'Nov' },
  Dec: { km: 'ធ្នូ', zh: '12月', th: 'ธ.ค.', vi: 'Thg 12', en: 'Dec' },
}

// 5-Language Category Dictionary
const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  Cameras: { km: 'កាមេរ៉ា', zh: '相机', th: 'กล้องถ่ายรูป', vi: 'Máy ảnh', en: 'Cameras' },
  Headphones: { km: 'កាសស្តាប់', zh: '耳机', th: 'หูฟัง', vi: 'Tai nghe', en: 'Headphones' },
  Keyboards: { km: 'ក្តារចុច', zh: '键盘', th: 'คีย์บอร์ด', vi: 'Bàn phím', en: 'Keyboards' },
  Laptops: { km: 'កុំព្យូទ័រយួរដៃ', zh: '笔记本电脑', th: 'แล็ปท็อป', vi: 'Laptop', en: 'Laptops' },
  Mice: { km: 'កណ្តុរ (Mice)', zh: '鼠标', th: 'เมาส์', vi: 'Chuột', en: 'Mice' },
  Monitors: { km: 'អេក្រង់ (Monitors)', zh: '显示器', th: 'จอมอนิเตอร์', vi: 'Màn hình', en: 'Monitors' },
  Smartphones: { km: 'ទូរស័ព្ទឆ្លាតវៃ', zh: '智能手机', th: 'สมาร์ทโฟน', vi: 'Điện thoại', en: 'Smartphones' },
  Smartwatches: { km: 'នាឡិកាឆ្លាតវៃ', zh: '智能手表', th: 'สมาร์ทวอทช์', vi: 'Đồng hồ', en: 'Smartwatches' },
  Speakers: { km: 'បាសបំពងសំឡេង', zh: '音箱', th: 'ลำโพง', vi: 'Loa', en: 'Speakers' },
  Electronics: { km: 'គ្រឿងអេឡិចត្រូនិច', zh: '电子产品', th: 'อิเล็กทรอนิกส์', vi: 'Điện tử', en: 'Electronics' },
  Accessories: { km: 'គ្រឿងបន្លាស់', zh: '配件', th: 'อุปกรณ์เสริม', vi: 'Phụ kiện', en: 'Accessories' },
  Computers: { km: 'កុំព្យូទ័រ', zh: '电脑', th: 'คอมพิวเตอร์', vi: 'Máy tính', en: 'Computers' },
}

export const InventoryDashboard: React.FC<InventoryDashboardProps> = ({
  stats,
  statsData,
  onTabChange
}) => {
  const currentStats = stats || statsData || {}
  const { t, i18n } = useTranslation(['inventory', 'common'])
  const currentLang = (i18n.language || 'km').substring(0, 2)

  const summary = currentStats.summary || {}
  const rawCharts = currentStats.charts || {}

  // Helper to format Months in active language
  const formatMonth = (monthStr: string) => {
    if (!monthStr) return ''
    const cleanKey = monthStr.trim()
    if (MONTH_TRANSLATIONS[cleanKey]?.[currentLang]) {
      return MONTH_TRANSLATIONS[cleanKey][currentLang]
    }
    return monthStr
  }

  // Helper to format Categories in active language
  const formatCategory = (catName: string) => {
    if (!catName) return ''
    const cleanKey = catName.trim()
    if (CATEGORY_TRANSLATIONS[cleanKey]?.[currentLang]) {
      return CATEGORY_TRANSLATIONS[cleanKey][currentLang]
    }
    return catName
  }

  // Helper to format Warehouse names in active language
  const formatWarehouse = (whName: string) => {
    if (!whName) return ''
    // If it follows "Warehouse X", translate
    const match = whName.match(/Warehouse\s*(\d+)/i)
    if (match) {
      const num = match[1]
      if (currentLang === 'km') return `ឃ្លាំង ${num}`
      if (currentLang === 'zh') return `${num}号仓库`
      if (currentLang === 'th') return `คลังสินค้า ${num}`
      if (currentLang === 'vi') return `Kho ${num}`
      return `Warehouse ${num}`
    }
    return whName
  }

  const totalItems = Number(summary.total_items ?? summary.total_products ?? 0)
  const totalQty = Number(summary.total_qty ?? 0)
  const availableQty = Number(summary.available_qty ?? 0)
  const reservedQty = Number(summary.reserved_qty ?? 0)
  const lowStock = Number(summary.low_stock ?? summary.low_stock_alert ?? 0)
  const outOfStock = Number(summary.out_of_stock ?? 0)
  const overstock = Number(summary.overstock ?? 0)
  const totalWarehouses = Number(summary.warehouses ?? 1)
  const inventoryCost = Number(summary.inventory_cost ?? 0)
  const inventoryValue = Number(summary.inventory_value ?? summary.selling_value ?? 0)
  const profitPotential = Number(summary.profit_potential ?? (inventoryValue - inventoryCost))
  const turnoverRate = Number(summary.turnover_rate ?? 4.2)

  // Localized Chart Data
  const monthlyMovementData = useMemo(() => {
    const defaultData = [
      { month: 'Jan', in: 450, out: 380 },
      { month: 'Feb', in: 520, out: 430 },
      { month: 'Mar', in: 680, out: 610 },
      { month: 'Apr', in: 410, out: 430 },
      { month: 'May', in: 780, out: 640 },
      { month: 'Jun', in: 890, out: 820 }
    ]
    const data = rawCharts.monthly_movement?.length ? rawCharts.monthly_movement : defaultData
    return data.map((d: any) => ({
      ...d,
      displayMonth: formatMonth(d.month)
    }))
  }, [rawCharts.monthly_movement, currentLang])

  const warehouseData = useMemo(() => {
    const data = rawCharts.by_warehouse?.length ? rawCharts.by_warehouse : [{ name: 'Warehouse 1', value: 14723 }]
    return data.map((d: any) => ({
      ...d,
      displayName: formatWarehouse(d.name)
    }))
  }, [rawCharts.by_warehouse, currentLang])

  const categoryData = useMemo(() => {
    const data = rawCharts.by_category?.length ? rawCharts.by_category : [
      { name: 'Electronics', value: 45 },
      { name: 'Computers', value: 30 },
      { name: 'Accessories', value: 25 }
    ]
    return data.map((d: any) => ({
      ...d,
      displayName: formatCategory(d.name)
    }))
  }, [rawCharts.by_category, currentLang])

  const brandData = useMemo(() => {
    return rawCharts.by_brand?.length ? rawCharts.by_brand : [
      { name: 'Apple', value: 40 },
      { name: 'Samsung', value: 35 },
      { name: 'Dell', value: 25 }
    ]
  }, [rawCharts.by_brand])

  return (
    <div className="space-y-6">
      
      {/* ─── Financial & Operational Key Performance Cards ───────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Card 1: Total Stock Value (USD) */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('inventory_value', 'Inventory Valuation ($)')}
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-foreground tracking-tight">
              {formatCurrency(inventoryValue)}
            </h3>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <span>{t('inventory_cost', 'Cost')}:</span>
              <span className="font-bold text-foreground">{formatCurrency(inventoryCost)}</span>
            </p>
          </div>
        </motion.div>

        {/* Card 2: Profit Potential (USD) */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('profit_potential', 'Profit Potential ($)')}
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {formatCurrency(profitPotential)}
            </h3>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {inventoryCost > 0 ? `+${((profitPotential / inventoryCost) * 100).toFixed(1)}%` : '+0%'}
              </span>
              <span>{t('estimatedMargin', 'estimated margin')}</span>
            </p>
          </div>
        </motion.div>

        {/* Card 3: Stock Health & Alert Status */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => onTabChange('levels')}
          className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs relative overflow-hidden group cursor-pointer hover:border-amber-500/40 transition-colors"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('low_stock', 'Low Stock & Out of Stock')}
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
                {formatNumber(lowStock)}
              </h3>
              <span className="text-xs text-muted-foreground font-bold">
                / {formatNumber(outOfStock)} {t('out_of_stock', 'Out of stock')}
              </span>
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              {lowStock + outOfStock > 0 ? t('reorderActionRequired', 'Reorder action required') : t('allStockHealthy', 'All stock is optimal')}
            </p>
          </div>
        </motion.div>

        {/* Card 4: Inventory Turnover & Hubs */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('turnover_rate', 'Turnover Rate & Warehouses')}
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <RefreshCw size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-foreground tracking-tight">
                {turnoverRate}x
              </h3>
              <span className="text-xs text-muted-foreground font-bold">
                • {totalWarehouses} {t('activeWarehouses', 'Active Hubs')}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {t('highVelocityStock', 'High inventory velocity & fulfillment')}
            </p>
          </div>
        </motion.div>

      </div>

      {/* ─── Secondary Quantitative Mini-Metrics Row ────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="bg-card/70 border border-border/70 p-3.5 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <Package size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase truncate">{t('totalItems', 'Total SKUs')}</p>
            <p className="text-base font-black text-foreground truncate font-mono">{formatNumber(totalItems)}</p>
          </div>
        </div>

        <div className="bg-card/70 border border-border/70 p-3.5 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            <BarChart2 size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase truncate">{t('total_qty', 'Total Quantity')}</p>
            <p className="text-base font-black text-foreground truncate font-mono">{formatNumber(totalQty)}</p>
          </div>
        </div>

        <div className="bg-card/70 border border-border/70 p-3.5 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase truncate">{t('available_qty', 'Available')}</p>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400 truncate font-mono">{formatNumber(availableQty)}</p>
          </div>
        </div>

        <div className="bg-card/70 border border-border/70 p-3.5 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <AlertTriangle size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase truncate">{t('reserved_qty', 'Reserved')}</p>
            <p className="text-base font-black text-foreground truncate font-mono">{formatNumber(reservedQty)}</p>
          </div>
        </div>

        <div className="bg-card/70 border border-border/70 p-3.5 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
            <TrendingUp size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase truncate">{t('overstock', 'Overstock')}</p>
            <p className="text-base font-black text-foreground truncate font-mono">{formatNumber(overstock)}</p>
          </div>
        </div>

        <div className="bg-card/70 border border-border/70 p-3.5 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
            <Warehouse size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase truncate">{t('activeWarehouses', 'Warehouses')}</p>
            <p className="text-base font-black text-foreground truncate font-mono">{formatNumber(totalWarehouses)}</p>
          </div>
        </div>

      </div>

      {/* ─── Visual Analytical Charts Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Monthly Stock Movement (In vs Out) */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BarChart2 size={16} className="text-primary" />
                {t('monthly_movement', 'Monthly Stock Movement (In vs Out)')}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t('inflowOutflowComparison', 'Comparison of stock-in shipments versus sales outflow')}
              </p>
            </div>
          </div>
          <div className="h-72 w-full pt-2 notranslate" translate="no">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyMovementData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/60 opacity-40" />
                <XAxis
                  dataKey="displayMonth"
                  stroke="currentColor"
                  className="text-xs text-muted-foreground font-semibold"
                />
                <YAxis
                  width={50}
                  stroke="currentColor"
                  className="text-xs text-muted-foreground font-mono"
                  tickFormatter={(val) => Number(val).toLocaleString()}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${Number(value).toLocaleString()} ${t('units', 'units')}`,
                    name === 'in' ? t('stockIn', 'Stock In') : name === 'out' ? t('stockOut', 'Stock Out') : name
                  ]}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.75rem',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  formatter={(val) => val === 'in' ? t('stockIn', 'Stock In') : val === 'out' ? t('stockOut', 'Stock Out') : val}
                />
                <Bar dataKey="in" fill="#10b981" radius={[6, 6, 0, 0]} name={t('stockIn', 'Stock In')} />
                <Bar dataKey="out" fill="#ef4444" radius={[6, 6, 0, 0]} name={t('stockOut', 'Stock Out')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Stock Quantity by Warehouse */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Warehouse size={16} className="text-primary" />
                {t('stock_by_warehouse', 'Stock Quantity by Warehouse')}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t('warehouseDistributionDesc', 'Inventory volume allocated across warehouse facilities')}
              </p>
            </div>
          </div>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={warehouseData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-border/60 opacity-40" />
                <XAxis
                  type="number"
                  stroke="currentColor"
                  className="text-xs text-muted-foreground font-mono"
                  tickFormatter={(val) => Number(val).toLocaleString()}
                />
                <YAxis
                  dataKey="displayName"
                  type="category"
                  stroke="currentColor"
                  className="text-xs text-muted-foreground font-semibold"
                  width={95}
                />
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toLocaleString()} ${t('units', 'units')}`, t('colTotalQty', 'Quantity')] }
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.75rem',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]} name={t('colTotalQty', 'Quantity')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Stock Distribution by Category */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                {t('stock_by_category', 'Stock Distribution by Category')}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t('categoryShareDesc', 'Proportion of inventory catalog grouped by category')}
              </p>
            </div>
          </div>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="displayName"
                >
                  {categoryData.map((_: any, index: number) => (
                    <Cell key={`cell-cat-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${Number(value).toLocaleString()} ${t('units', 'units')}`, name]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.75rem',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Stock Distribution by Brand */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Tag size={16} className="text-primary" />
                {t('stock_by_brand', 'Stock Distribution by Brand')}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t('brandShareDesc', 'Product brand allocation across the inventory spectrum')}
              </p>
            </div>
          </div>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={brandData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {brandData.map((_: any, index: number) => (
                    <Cell key={`cell-brand-${index}`} fill={PALETTE[(index + 3) % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${Number(value).toLocaleString()} ${t('units', 'units')}`, name]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.75rem',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  )
}

export default InventoryDashboard
