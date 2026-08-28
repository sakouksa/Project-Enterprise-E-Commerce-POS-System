import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Package, TrendingUp, AlertTriangle, ArrowLeftRight, Warehouse, DollarSign, Activity } from 'lucide-react'

// Animated Counter Component
export const AnimatedCounter: React.FC<{ value: number; prefix?: string; suffix?: string; decimals?: number }> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1000
    const startTime = performance.now()

    const updateCounter = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const current = start + (end - start) * easedProgress
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(updateCounter)
      }
    }

    requestAnimationFrame(updateCounter)
  }, [value])

  return (
    <span>
      {prefix}
      {decimals > 0
        ? displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : Math.round(displayValue).toLocaleString()}
      {suffix}
    </span>
  )
}

// Circular Progress Ring Component
export const CircularProgressRing: React.FC<{ percentage: number; colorClass: string; size?: number }> = ({
  percentage,
  colorClass,
  size = 48,
}) => {
  const strokeWidth = 4.5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={colorClass}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-foreground">
        {Math.round(clampedPercentage)}%
      </span>
    </div>
  )
}

interface InventoryOverviewCardsProps {
  analytics: any
}

export const InventoryOverviewCards: React.FC<InventoryOverviewCardsProps> = ({ analytics }) => {
  const { t } = useTranslation(['inventory', 'common'])

  return (
    <div className="space-y-4 print:hidden">
      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total SKUs & Stock Levels */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-shadow"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('totalItems', 'Total SKUs')}</p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight">
              <AnimatedCounter value={analytics.totalProducts} />
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="text-emerald-500 font-bold"><AnimatedCounter value={analytics.totalQty} /></span> {t('unitsInStock', 'units total')}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
            <Package size={22} />
          </div>
        </motion.div>

        {/* Card 2: Inventory Valuation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-shadow"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('inventoryValuation', 'Stock Valuation')}</p>
            <p className="text-xl font-extrabold text-foreground tracking-tight truncate max-w-[190px]">
              $<AnimatedCounter value={analytics.inventoryValue} decimals={2} />
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="text-emerald-500 font-bold">+${analytics.potentialProfit?.toFixed(2) || '0.00'}</span> margin
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500">
            <DollarSign size={22} />
          </div>
        </motion.div>

        {/* Card 3: Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-shadow"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('lowStockAlert', 'Low Stock Items')}</p>
            <p className="text-2xl font-extrabold text-amber-500 tracking-tight">
              <AnimatedCounter value={analytics.lowStock} />
            </p>
            <p className="text-[11px] text-muted-foreground">
              {analytics.lowStock > 0 ? t('reorderNeeded', 'Needs Replenishment') : t('healthyStock', 'Stock is Healthy')}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-500">
            <AlertTriangle size={22} />
          </div>
        </motion.div>

        {/* Card 4: Warehouse Utilization */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-shadow"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('warehouseUtilization', 'Capacity Rate')}</p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight">
              <AnimatedCounter value={analytics.capacityUsage} decimals={1} suffix="%" />
            </p>
            <p className="text-[11px] text-muted-foreground">
              {analytics.totalWarehouses} {t('activeWarehouses', 'Active Warehouses')}
            </p>
          </div>
          <CircularProgressRing percentage={analytics.capacityUsage} colorClass="text-primary" />
        </motion.div>
      </div>

      {/* Mini KPI summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase">{t('todayStockIn', "Today's Inflow")}</span>
          <span className="text-lg font-extrabold text-emerald-500 mt-1">+{analytics.todayStockIn} units</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase">{t('todayStockOut', "Today's Outflow")}</span>
          <span className="text-lg font-extrabold text-rose-500 mt-1">-{analytics.todayStockOut} units</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase">{t('pendingTransfers', 'In-Transit Transfers')}</span>
          <span className="text-lg font-extrabold text-blue-500 mt-1">{analytics.pendingTransfers} active</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase">{t('auditAccuracy', 'Cycle Count Accuracy')}</span>
          <span className="text-lg font-extrabold text-primary mt-1">{analytics.opnameAccuracy}%</span>
        </div>
      </div>
    </div>
  )
}
