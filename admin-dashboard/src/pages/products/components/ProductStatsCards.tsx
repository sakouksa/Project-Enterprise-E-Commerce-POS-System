import React from 'react'
import { motion } from 'framer-motion'
import { Package, DollarSign, Award, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { CircularProgressRing } from '@/components/shared/CircularProgressRing'

interface ProductStatsCardsProps {
  analytics: {
    totalProducts: number
    activeProducts: number
    inactiveProducts: number
    outOfStock: number
    categoriesCount: number
    brandsCount: number
    attributesCount: number
    variantsCount: number
    costValue: number
    sellingValue: number
    potentialProfit: number
    averagePrice: number
    bestSelling: number
    lowSelling: number
    mostViewed: number
    averageRating: number
    todayNewProducts: number
    lowStockProducts: number
    productsOnSale: number
    productsWithDiscount: number
    recentlyUpdated: number
  }
  formatCurrency: (val: number) => string
}

export const ProductStatsCards: React.FC<ProductStatsCardsProps> = ({ analytics, formatCurrency }) => {
  const { t } = useTranslation(['products', 'common', 'inventory'])

  const activePercent = (analytics.activeProducts / (analytics.totalProducts || 1)) * 100

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 print:hidden">
      {/* ─── CARD 1: Total Products (Blue Theme) ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.25 }}
        className="rounded-2xl border-l-[5px] border-l-blue-500 border-y border-r border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-blue-500/[0.12] via-blue-500/[0.03] to-white/95 dark:from-blue-500/[0.20] dark:via-slate-900/90 dark:to-slate-900/90 backdrop-blur-xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:from-blue-500/[0.18] dark:hover:from-blue-500/[0.28] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span
              title={t('inventoryOverview', 'Inventory Overview')}
              className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 line-clamp-1"
            >
              {t('inventoryOverview', 'Inventory Overview')}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Package size={11} />
                <span>{t('active', 'Active')}</span>
              </span>
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
                <Package size={15} />
              </span>
            </div>
          </div>

          {/* Main Metric */}
          <div className="flex items-center justify-between gap-3 my-1.5">
            <div className="min-w-0 flex-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                <AnimatedCounter value={analytics.totalProducts} />
              </div>
              <div
                title={t('totalProducts', 'Total System Products')}
                className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium line-clamp-1"
              >
                {t('totalProducts', 'Total System Products')}
              </div>
            </div>
            <div className="flex-shrink-0">
              <CircularProgressRing
                percentage={activePercent}
                colorClass="text-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Sub-metrics */}
        <div>
          <div className="w-full border-t border-slate-200/60 dark:border-slate-800/80 my-3" />
          <div className="grid grid-cols-3 gap-2 text-left">
            <div className="min-w-0" title={`${t('active', 'Active')}: ${analytics.activeProducts}`}>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-tight line-clamp-1">
                {t('active', 'Active')}
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-emerald-600 dark:text-emerald-400 mt-0.5 leading-tight">
                {analytics.activeProducts}
              </div>
            </div>
            <div className="min-w-0" title={`${t('outOfStock', 'Out of Stock')}: ${analytics.outOfStock}`}>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-tight line-clamp-1">
                {t('outOfStock', 'Out of Stock')}
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-rose-500 dark:text-rose-400 mt-0.5 leading-tight">
                {analytics.outOfStock}
              </div>
            </div>
            <div className="min-w-0" title={`${t('categoriesConfigured', 'Categories')}: ${analytics.categoriesCount}`}>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-tight line-clamp-1">
                {t('categoriesConfigured', 'Categories')}
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-blue-600 dark:text-blue-400 mt-0.5 leading-tight">
                {analytics.categoriesCount}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── CARD 2: Inventory Value (Emerald Theme) ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.25 }}
        className="rounded-2xl border-l-[5px] border-l-emerald-500 border-y border-r border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-emerald-500/[0.12] via-emerald-500/[0.03] to-white/95 dark:from-emerald-500/[0.20] dark:via-slate-900/90 dark:to-slate-900/90 backdrop-blur-xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:from-emerald-500/[0.18] dark:hover:from-emerald-500/[0.28] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span
              title={t('inventoryValueHeader', 'Inventory Value ($)')}
              className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 line-clamp-1"
            >
              {t('inventoryValueHeader', 'Inventory Value ($)')}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <DollarSign size={11} />
                <span>{t('value', 'Value')}</span>
              </span>
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                <DollarSign size={15} />
              </span>
            </div>
          </div>

          {/* Main Metric */}
          <div className="flex items-center justify-between gap-3 my-1.5">
            <div className="min-w-0 flex-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                <AnimatedCounter value={analytics.sellingValue} prefix="$" decimals={2} />
              </div>
              <div
                title={t('totalSellingValue', 'Total Selling Value')}
                className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium line-clamp-1"
              >
                {t('totalSellingValue', 'Total Selling Value')}
              </div>
            </div>
            <div className="flex-shrink-0">
              <CircularProgressRing percentage={88} colorClass="text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Sub-metrics */}
        <div>
          <div className="w-full border-t border-slate-200/60 dark:border-slate-800/80 my-3" />
          <div className="grid grid-cols-3 gap-2 text-left">
            <div className="min-w-0" title={`${t('costValue', 'Cost Value')}: ${formatCurrency(analytics.costValue)}`}>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-tight line-clamp-1">
                {t('costValue', 'Cost Value')}
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 mt-0.5 leading-tight truncate">
                {formatCurrency(analytics.costValue)}
              </div>
            </div>
            <div className="min-w-0" title={`${t('potentialProfit', 'Potential Profit')}: ${formatCurrency(analytics.potentialProfit)}`}>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-tight line-clamp-1">
                {t('potentialProfit', 'Potential Profit')}
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-emerald-600 dark:text-emerald-400 mt-0.5 leading-tight truncate">
                {formatCurrency(analytics.potentialProfit)}
              </div>
            </div>
            <div className="min-w-0" title={`${t('avgPrice', 'Avg Price')}: ${formatCurrency(analytics.averagePrice)}`}>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-tight line-clamp-1">
                {t('avgPrice', 'Avg Price')}
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-blue-600 dark:text-blue-400 mt-0.5 leading-tight truncate">
                {formatCurrency(analytics.averagePrice)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── CARD 3: Sales Performance (Amber Theme) ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.25 }}
        className="rounded-2xl border-l-[5px] border-l-amber-500 border-y border-r border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-amber-500/[0.12] via-amber-500/[0.03] to-white/95 dark:from-amber-500/[0.20] dark:via-slate-900/90 dark:to-slate-900/90 backdrop-blur-xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:from-amber-500/[0.18] dark:hover:from-amber-500/[0.28] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span
              title={t('productPerformance', 'Product Performance')}
              className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 line-clamp-1"
            >
              {t('productPerformance', 'Product Performance')}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Award size={11} />
                <span>{t('highSales', 'High Sales')}</span>
              </span>
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
                <Award size={15} />
              </span>
            </div>
          </div>

          {/* Main Metric */}
          <div className="flex items-center justify-between gap-3 my-1.5">
            <div className="min-w-0 flex-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                <AnimatedCounter value={analytics.bestSelling} />
              </div>
              <div
                title={t('totalItemsSold', 'Total Items Sold')}
                className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium line-clamp-1"
              >
                {t('totalItemsSold', 'Total Items Sold')}
              </div>
            </div>
            <div className="flex-shrink-0">
              <CircularProgressRing percentage={80} colorClass="text-amber-500" />
            </div>
          </div>
        </div>

        {/* Sub-metrics */}
        <div>
          <div className="w-full border-t border-slate-200/60 dark:border-slate-800/80 my-3" />
          <div className="grid grid-cols-3 gap-2 text-left">
            <div className="min-w-0" title={`${t('brands', 'Brands')}: ${analytics.brandsCount}`}>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-tight line-clamp-1">
                {t('brands', 'Brands')}
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 mt-0.5 leading-tight truncate">
                {analytics.brandsCount}
              </div>
            </div>
            <div className="min-w-0" title={`${t('variants', 'Variants')}: ${analytics.variantsCount}`}>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-tight line-clamp-1">
                {t('variants', 'Variants')}
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-purple-600 dark:text-purple-400 mt-0.5 leading-tight truncate">
                {analytics.variantsCount}
              </div>
            </div>
            <div className="min-w-0" title={`${t('avgRating', 'Avg Rating')}: ${analytics.averageRating} ★`}>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-tight line-clamp-1">
                {t('avgRating', 'Avg Rating')}
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-amber-500 dark:text-amber-400 mt-0.5 leading-tight truncate">
                {analytics.averageRating} ★
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── CARD 4: Stock Alerts (Purple Theme) ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.25 }}
        className="rounded-2xl border-l-[5px] border-l-purple-500 border-y border-r border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-purple-500/[0.12] via-purple-500/[0.03] to-white/95 dark:from-purple-500/[0.20] dark:via-slate-900/90 dark:to-slate-900/90 backdrop-blur-xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:from-purple-500/[0.18] dark:hover:from-purple-500/[0.28] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span
              title={t('lowStock', 'Low Stock')}
              className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 line-clamp-1"
            >
              {t('lowStock', 'Low Stock')}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Layers size={11} />
                <span>{t('stock', 'Stock')}</span>
              </span>
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform flex-shrink-0">
                <Layers size={15} />
              </span>
            </div>
          </div>

          {/* Main Metric */}
          <div className="flex items-center justify-between gap-3 my-1.5">
            <div className="min-w-0 flex-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                <AnimatedCounter value={analytics.lowStockProducts} />
              </div>
              <div
                title={t('lowStockProducts', 'Low Stock Warning Items')}
                className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium line-clamp-1"
              >
                {t('lowStockProducts', 'Low Stock Warning Items')}
              </div>
            </div>
            <div className="flex-shrink-0">
              <CircularProgressRing percentage={75} colorClass="text-purple-500" />
            </div>
          </div>
        </div>

        {/* Sub-metrics */}
        <div>
          <div className="w-full border-t border-slate-200/60 dark:border-slate-800/80 my-3" />
          <div className="grid grid-cols-3 gap-2 text-left">
            <div className="min-w-0" title={`${t('todayNew', 'Today New')}: ${analytics.todayNewProducts}`}>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-tight line-clamp-1">
                {t('todayNew', 'Today New')}
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-emerald-600 dark:text-emerald-400 mt-0.5 leading-tight truncate">
                {analytics.todayNewProducts}
              </div>
            </div>
            <div className="min-w-0" title={`${t('onSale', 'On Sale')}: ${analytics.productsOnSale}`}>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-tight line-clamp-1">
                {t('onSale', 'On Sale')}
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-rose-500 dark:text-rose-400 mt-0.5 leading-tight truncate">
                {analytics.productsOnSale}
              </div>
            </div>
            <div className="min-w-0" title={`${t('recentUpdated', 'Recent Updated')}: ${analytics.recentlyUpdated}`}>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-tight line-clamp-1">
                {t('recentUpdated', 'Recent Updated')}
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-blue-600 dark:text-blue-400 mt-0.5 leading-tight truncate">
                {analytics.recentlyUpdated}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductStatsCards
