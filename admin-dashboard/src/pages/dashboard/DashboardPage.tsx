import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react'
import api from '@/api/client'

// Subcomponents imports
import DashboardHeader from './components/DashboardHeader'
import DashboardStats from './components/DashboardStats'
import DashboardCharts from './components/DashboardCharts'
import DashboardRow3 from './components/DashboardRow3'
import DashboardRow4 from './components/DashboardRow4'
import DashboardRow5 from './components/DashboardRow5'
import QuickActions from './components/QuickActions'
import RecentActivities from './components/RecentActivities'
import BusinessAlertsWidget from './components/BusinessAlertsWidget'
import SystemHealthWidget from './components/SystemHealthWidget'

const DashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(undefined)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Real backend query for stats
  const { 
    data: statsRes, 
    isLoading: statsLoading, 
    isError: statsError,
    refetch: refetchStats 
  } = useQuery({
    queryKey: ['dashboard-stats', selectedBranchId],
    queryFn: () => api.get('/dashboard/stats', { params: { branch_id: selectedBranchId } }).then((r) => r.data.data),
    staleTime: 30000,
  })

  // Real backend query for multi-dataset charts
  const { 
    data: chartsRes, 
    isLoading: chartsLoading,
    refetch: refetchCharts
  } = useQuery({
    queryKey: ['dashboard-charts', selectedBranchId],
    queryFn: () => api.get('/dashboard/charts', { params: { branch_id: selectedBranchId } }).then((r) => r.data.data),
    staleTime: 60000,
  })

  // Real backend query for sales chart fallback
  const { data: salesChartRes } = useQuery({
    queryKey: ['sales-chart', selectedBranchId],
    queryFn: () => api.get('/dashboard/sales-chart', { params: { branch_id: selectedBranchId } }).then((r) => r.data.data),
    staleTime: 60000,
  })

  // Real backend query for operation panels
  const { data: panelsRes, refetch: refetchPanels } = useQuery({
    queryKey: ['dashboard-operation-panels'],
    queryFn: () => api.get('/dashboard/operation-panels').then((r) => r.data.data),
    staleTime: 30000,
  })

  // Real backend query for business alerts
  const { data: alertsRes, isLoading: alertsLoading, refetch: refetchAlerts } = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: () => api.get('/dashboard/alerts').then((r) => r.data.data),
    staleTime: 30000,
  })

  // Real backend query for system health
  const { data: healthRes, isLoading: healthLoading, refetch: refetchHealth } = useQuery({
    queryKey: ['dashboard-system-health'],
    queryFn: () => api.get('/dashboard/system-health').then((r) => r.data.data),
    staleTime: 60000,
  })

  // Legacy fallback queries
  const { data: topProductsRes } = useQuery({
    queryKey: ['top-products'],
    queryFn: () => api.get('/dashboard/top-products').then((r) => r.data.data),
  })

  const { data: lowStockRes } = useQuery({
    queryKey: ['low-stock'],
    queryFn: () => api.get('/dashboard/low-stock').then((r) => r.data.data),
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([
      refetchStats(),
      refetchCharts(),
      refetchPanels(),
      refetchAlerts(),
      refetchHealth(),
    ])
    setIsRefreshing(false)
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  }

  const itemVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6 max-w-[1700px] mx-auto p-2 sm:p-4"
    >
      {/* Dashboard Top Header */}
      <motion.div variants={itemVariants}>
        <DashboardHeader 
          onBranchChange={(bId) => setSelectedBranchId(bId)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      </motion.div>

      {/* Error state banner */}
      {statsError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-rose-700 dark:text-rose-400 text-xs font-bold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{t('dashboard.errorLoading')}</span>
          </div>
          <button 
            onClick={handleRefresh}
            className="px-3 py-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            {t('dashboard.retry')}
          </button>
        </div>
      )}

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Main Center Panel (3 columns on XL) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Business Alerts Feed Widget */}
          <motion.div variants={itemVariants}>
            <BusinessAlertsWidget alerts={alertsRes || []} isLoading={alertsLoading} />
          </motion.div>

          {/* 3 Rows of Real PostgreSQL Enterprise KPI Cards */}
          <motion.div variants={itemVariants}>
            <DashboardStats stats={statsRes} isLoading={statsLoading} />
          </motion.div>

          {/* Primary Analytics Charts */}
          <motion.div variants={itemVariants}>
            <DashboardCharts 
              salesData={salesChartRes || []} 
              chartsData={chartsRes} 
              isLoading={chartsLoading} 
            />
          </motion.div>

          {/* Row 3: Top Selling, Recent Orders, Latest Customers */}
          <motion.div variants={itemVariants}>
            <DashboardRow3 
              topProducts={topProductsRes || []} 
              recentOrders={panelsRes?.pending_orders || []}
              latestCustomers={panelsRes?.latest_customers || []} 
            />
          </motion.div>

          {/* Row 4: Inventory & Warehouse Summary */}
          <motion.div variants={itemVariants}>
            <DashboardRow4 
              lowStockList={lowStockRes || []} 
              stats={statsRes} 
            />
          </motion.div>

          {/* Row 5: Financial Metrics & Margins */}
          <motion.div variants={itemVariants}>
            <DashboardRow5 stats={statsRes} />
          </motion.div>

          {/* System Health Diagnostics Monitor */}
          <motion.div variants={itemVariants}>
            <SystemHealthWidget healthData={healthRes} isLoading={healthLoading} />
          </motion.div>
        </div>

        {/* Right Sidebar Widgets (Quick Actions & Activity Timeline) */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <QuickActions />
          </motion.div>

          <motion.div variants={itemVariants}>
            <RecentActivities 
              activityLog={panelsRes?.activity_log || []} 
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default DashboardPage
