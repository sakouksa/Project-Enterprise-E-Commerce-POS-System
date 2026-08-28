import React from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Target, ShoppingBag, TrendingUp, ArrowUpRight } from 'lucide-react'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { CircularProgressRing } from '@/components/shared/CircularProgressRing'

interface PromotionStatsCardsProps {
  analytics: {
    totalPromotions: number
    runningPromotions: number
    scheduledPromotions: number
    expiredPromotions: number
    pausedPromotions: number
    draftPromotions: number
    totalViews: number
    totalClicks: number
    totalCustomersReached: number
    conversionRate: number
    totalOrdersGenerated: number
    totalRevenueGenerated: number
    aov: number
    totalPromotionDiscount: number
    totalMarketingCost: number
    netProfit: number
    roi: number
    profitMargin: number
    todaysPromotions: number
    endingToday: number
    startingTomorrow: number
    topCampaignName: string
    highestRevenueVal: number
    pendingApproval: number
  }
}

export const PromotionStatsCards: React.FC<PromotionStatsCardsProps> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* CARD 1: Campaign Overview */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-5 rounded-[26px] bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              PROMOTION CAMPAIGNS
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Megaphone size={11} />
                <span>Running</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Megaphone size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.totalPromotions} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Total Promo Rules</div>
            </div>
            <CircularProgressRing
              percentage={(analytics.runningPromotions / (analytics.totalPromotions || 1)) * 100}
              colorClass="text-amber-500"
              size={48}
            />
          </div>
        </div>
        <div>
          <div className="w-full bg-amber-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Running</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{analytics.runningPromotions}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Scheduled</div>
              <div className="font-bold text-blue-500 mt-0.5">{analytics.scheduledPromotions}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Expired</div>
              <div className="font-bold text-muted-foreground mt-0.5">{analytics.expiredPromotions}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 2: Reach & Conversion */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-[26px] bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              REACH & CONVERSION
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Target size={11} />
                <span>{analytics.conversionRate}% Conv</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.totalCustomersReached} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Customers Engaged</div>
            </div>
            <CircularProgressRing percentage={analytics.conversionRate} colorClass="text-blue-500" size={48} />
          </div>
        </div>
        <div>
          <div className="w-full bg-blue-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Views</div>
              <div className="font-bold text-foreground mt-0.5">{analytics.totalViews}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Clicks</div>
              <div className="font-bold text-blue-600 mt-0.5">{analytics.totalClicks}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Orders</div>
              <div className="font-bold text-emerald-600 mt-0.5">{analytics.totalOrdersGenerated}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 3: Sales Volume Generated */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-5 rounded-[26px] bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              CAMPAIGN REVENUE
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShoppingBag size={11} />
                <span>Sales</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.totalRevenueGenerated} prefix="$" decimals={2} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Gross Revenue Driven</div>
            </div>
            <CircularProgressRing percentage={88} colorClass="text-emerald-500" size={48} />
          </div>
        </div>
        <div>
          <div className="w-full bg-emerald-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Discounts</div>
              <div className="font-bold text-rose-500 mt-0.5">${analytics.totalPromotionDiscount.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Avg Order</div>
              <div className="font-bold text-foreground mt-0.5">${analytics.aov.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Top Campaign</div>
              <div className="font-bold text-emerald-600 truncate mt-0.5" title={analytics.topCampaignName}>{analytics.topCampaignName}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 4: Marketing ROI */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-[26px] bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
              MARKETING ROI
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <ArrowUpRight size={11} />
                <span>+{analytics.roi}%</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.netProfit} prefix="$" decimals={2} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Net Campaign Profit</div>
            </div>
            <CircularProgressRing percentage={82} colorClass="text-purple-500" size={48} />
          </div>
        </div>
        <div>
          <div className="w-full bg-purple-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Cost</div>
              <div className="font-bold text-rose-500 mt-0.5">${analytics.totalMarketingCost.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">ROI Ratio</div>
              <div className="font-bold text-purple-600 mt-0.5">{analytics.roi}%</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Margin</div>
              <div className="font-bold text-teal-600 mt-0.5">{analytics.profitMargin}%</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PromotionStatsCards
