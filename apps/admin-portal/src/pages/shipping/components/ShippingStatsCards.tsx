import React from 'react'
import { motion } from 'framer-motion'
import { Truck, Globe, DollarSign, ArrowUpRight } from 'lucide-react'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { CircularProgressRing } from '@/components/shared/CircularProgressRing'

interface ShippingStatsCardsProps {
  analytics: {
    totalShipments: number
    deliveredCount: number
    pendingCount: number
    returnedCount: number
    failedCount: number
    onTimeRate: number
    avgDeliveryTimeDays: number
    totalShippingRevenue: number
    avgShippingFee: number
    freeShippingOrders: number
    totalShippingCost: number
    shippingProfit: number
    profitMargin: number
    todaysShipments: number
    todaysDelivered: number
    activeCouriersCount: number
    pendingPickupCount: number
    customerComplaints: number
  }
}

export const ShippingStatsCards: React.FC<ShippingStatsCardsProps> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* CARD 1: Shipments Volume */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-5 rounded-[26px] bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              LOGISTICS SHIPMENTS
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Truck size={11} />
                <span>Active</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Truck size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.totalShipments} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Total Orders Shipped</div>
            </div>
            <CircularProgressRing
              percentage={(analytics.deliveredCount / (analytics.totalShipments || 1)) * 100}
              colorClass="text-blue-500"
              size={48}
            />
          </div>
        </div>
        <div>
          <div className="w-full bg-blue-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Delivered</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{analytics.deliveredCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">In Transit</div>
              <div className="font-bold text-blue-600 mt-0.5">{analytics.pendingCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Returned</div>
              <div className="font-bold text-rose-500 mt-0.5">{analytics.returnedCount}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 2: On-Time Delivery Performance */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-[26px] bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              DELIVERY PERFORMANCE
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Globe size={11} />
                <span>On-Time</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.onTimeRate} suffix="%" decimals={1} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">On-Time Success SLA</div>
            </div>
            <CircularProgressRing percentage={analytics.onTimeRate} colorClass="text-emerald-500" size={48} />
          </div>
        </div>
        <div>
          <div className="w-full bg-emerald-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Avg SLA</div>
              <div className="font-bold text-foreground mt-0.5">{analytics.avgDeliveryTimeDays} Days</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Today</div>
              <div className="font-bold text-emerald-600 mt-0.5">{analytics.todaysDelivered}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Couriers</div>
              <div className="font-bold text-blue-600 mt-0.5">{analytics.activeCouriersCount}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 3: Shipping Revenue Collected */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-5 rounded-[26px] bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
              SHIPPING REVENUE
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <DollarSign size={11} />
                <span>Fees</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.totalShippingRevenue} prefix="$" decimals={2} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Freight Fees Collected</div>
            </div>
            <CircularProgressRing percentage={85} colorClass="text-purple-500" size={48} />
          </div>
        </div>
        <div>
          <div className="w-full bg-purple-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Avg Fee</div>
              <div className="font-bold text-foreground mt-0.5">${analytics.avgShippingFee.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Free Orders</div>
              <div className="font-bold text-purple-600 mt-0.5">{analytics.freeShippingOrders}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Cost</div>
              <div className="font-bold text-rose-500 mt-0.5">${analytics.totalShippingCost.toFixed(0)}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 4: Shipping Net Profit */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-[26px] bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
              SHIPPING MARGIN
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                <ArrowUpRight size={11} />
                <span>+{analytics.profitMargin}%</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowUpRight size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.shippingProfit} prefix="$" decimals={2} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Net Freight Margin</div>
            </div>
            <CircularProgressRing percentage={80} colorClass="text-teal-500" size={48} />
          </div>
        </div>
        <div>
          <div className="w-full bg-teal-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Pickup Pending</div>
              <div className="font-bold text-amber-500 mt-0.5">{analytics.pendingPickupCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Issues</div>
              <div className="font-bold text-rose-500 mt-0.5">{analytics.customerComplaints}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Margin %</div>
              <div className="font-bold text-teal-600 mt-0.5">{analytics.profitMargin}%</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ShippingStatsCards
