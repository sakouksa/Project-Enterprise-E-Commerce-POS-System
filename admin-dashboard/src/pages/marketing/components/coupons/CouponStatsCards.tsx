import React from 'react'
import { motion } from 'framer-motion'
import { Ticket, Percent, Coins, TrendingUp, Tag, ArrowUpRight } from 'lucide-react'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { CircularProgressRing } from '@/components/shared/CircularProgressRing'

interface CouponStatsCardsProps {
  analytics: {
    totalCoupons: number
    activeCoupons: number
    expiredCoupons: number
    disabledCoupons: number
    totalRedeemed: number
    redemptionRate: number
    unusedCoupons: number
    avgRedemptionPerCoupon: number
    totalDiscountGiven: number
    avgDiscountAmount: number
    highestDiscount: number
    todayDiscount: number
    revenueGenerated: number
    campaignCost: number
    campaignProfit: number
    roi: number
    aov: number
    todayCoupons: number
    couponsUsedToday: number
    newCustomersCoupons: number
    returningCustomersCoupons: number
    pendingCoupons: number
    expiringSoon: number
  }
}

export const CouponStatsCards: React.FC<CouponStatsCardsProps> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* CARD 1: Coupon Overview */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-5 rounded-[26px] bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              COUPON DIRECTORY
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Ticket size={11} />
                <span>Active</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ticket size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.totalCoupons} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Total Discount Vouchers</div>
            </div>
            <CircularProgressRing
              percentage={(analytics.activeCoupons / (analytics.totalCoupons || 1)) * 100}
              colorClass="text-indigo-500"
              size={48}
            />
          </div>
        </div>
        <div>
          <div className="w-full bg-indigo-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Active</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{analytics.activeCoupons}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Expired</div>
              <div className="font-bold text-rose-500 mt-0.5">{analytics.expiredCoupons}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Expiring 7d</div>
              <div className="font-bold text-amber-500 mt-0.5">{analytics.expiringSoon}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 2: Redemptions & Usage Rate */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-[26px] bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
              VOUCHER REDEMPTIONS
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Percent size={11} />
                <span>{analytics.redemptionRate}% Rate</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Percent size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.totalRedeemed} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Total Code Uses</div>
            </div>
            <CircularProgressRing percentage={analytics.redemptionRate} colorClass="text-purple-500" size={48} />
          </div>
        </div>
        <div>
          <div className="w-full bg-purple-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Today</div>
              <div className="font-bold text-foreground mt-0.5">{analytics.couponsUsedToday}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">New Buyers</div>
              <div className="font-bold text-emerald-600 mt-0.5">{analytics.newCustomersCoupons}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Returning</div>
              <div className="font-bold text-purple-600 mt-0.5">{analytics.returningCustomersCoupons}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 3: Discounts Given */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-5 rounded-[26px] bg-pink-50/50 dark:bg-pink-950/20 border border-pink-200/80 dark:border-pink-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-pink-600 dark:text-pink-400">
              DISCOUNTS ISSUED
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                <Coins size={11} />
                <span>Impact</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Coins size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.totalDiscountGiven} prefix="$" decimals={2} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Customer Savings Granted</div>
            </div>
            <CircularProgressRing percentage={85} colorClass="text-pink-500" size={48} />
          </div>
        </div>
        <div>
          <div className="w-full bg-pink-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Avg Value</div>
              <div className="font-bold text-foreground mt-0.5">${analytics.avgDiscountAmount.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Highest</div>
              <div className="font-bold text-pink-600 mt-0.5">${analytics.highestDiscount}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Today Cost</div>
              <div className="font-bold text-rose-500 mt-0.5">${analytics.todayDiscount.toFixed(0)}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 4: Campaign Revenue & ROI */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-[26px] bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              PROMOTION REVENUE
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ArrowUpRight size={11} />
                <span>+{analytics.roi}% ROI</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.revenueGenerated} prefix="$" decimals={2} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Sales Driven by Vouchers</div>
            </div>
            <CircularProgressRing percentage={90} colorClass="text-emerald-500" size={48} />
          </div>
        </div>
        <div>
          <div className="w-full bg-emerald-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Profit</div>
              <div className="font-bold text-emerald-600 mt-0.5">${analytics.campaignProfit.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Avg Order</div>
              <div className="font-bold text-foreground mt-0.5">${analytics.aov.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">ROI Ratio</div>
              <div className="font-bold text-teal-600 mt-0.5">{analytics.roi}%</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CouponStatsCards
