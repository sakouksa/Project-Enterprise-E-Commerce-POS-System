import React from 'react'
import { motion } from 'framer-motion'
import { Package, DollarSign, Award, Layers } from 'lucide-react'
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* CARD 1: Total Products */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-5 rounded-[26px] bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              PRODUCT CATALOG
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Package size={11} />
                <span>Active</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.totalProducts} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Total Product SKUs</div>
            </div>
            <CircularProgressRing
              percentage={(analytics.activeProducts / (analytics.totalProducts || 1)) * 100}
              colorClass="text-blue-500"
            />
          </div>
        </div>
        <div>
          <div className="w-full bg-blue-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Active</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{analytics.activeProducts}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Out of Stock</div>
              <div className="font-bold text-rose-500 mt-0.5">{analytics.outOfStock}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Categories</div>
              <div className="font-bold text-blue-600 mt-0.5">{analytics.categoriesCount}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 2: Inventory Selling Value */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-[26px] bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              INVENTORY VALUE
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <DollarSign size={11} />
                <span>Value</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.sellingValue} prefix="$" decimals={2} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Total Selling Inventory Value</div>
            </div>
            <CircularProgressRing percentage={88} colorClass="text-emerald-500" />
          </div>
        </div>
        <div>
          <div className="w-full bg-emerald-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Cost Basis</div>
              <div className="font-bold text-foreground mt-0.5">${analytics.costValue.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Est Profit</div>
              <div className="font-bold text-emerald-600 mt-0.5">${analytics.potentialProfit.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Avg Price</div>
              <div className="font-bold text-blue-600 mt-0.5">${analytics.averagePrice.toFixed(1)}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 3: Sales Performance & Rating */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-5 rounded-[26px] bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              SALES PERFORMANCE
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Award size={11} />
                <span>Top Sellers</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.bestSelling} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Best Selling Products</div>
            </div>
            <CircularProgressRing percentage={80} colorClass="text-amber-500" />
          </div>
        </div>
        <div>
          <div className="w-full bg-amber-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Brands</div>
              <div className="font-bold text-foreground mt-0.5">{analytics.brandsCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Variants</div>
              <div className="font-bold text-purple-600 mt-0.5">{analytics.variantsCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Avg Rating</div>
              <div className="font-bold text-amber-500 mt-0.5">{analytics.averageRating} ★</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 4: Stock Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-[26px] bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
              INVENTORY ALERTS
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Layers size={11} />
                <span>Stock</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.lowStockProducts} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Low Stock Warning Items</div>
            </div>
            <CircularProgressRing percentage={75} colorClass="text-purple-500" />
          </div>
        </div>
        <div>
          <div className="w-full bg-purple-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">New Today</div>
              <div className="font-bold text-emerald-600 mt-0.5">{analytics.todayNewProducts}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">On Sale</div>
              <div className="font-bold text-rose-500 mt-0.5">{analytics.productsOnSale}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Updated</div>
              <div className="font-bold text-blue-600 mt-0.5">{analytics.recentlyUpdated}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductStatsCards
