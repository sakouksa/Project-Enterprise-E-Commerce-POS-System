import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import api from '@/api/client'

// Subcomponents imports
import DashboardHeader from './components/DashboardHeader'
import DashboardStats from './components/DashboardStats'
import DashboardCharts from './components/DashboardCharts'
import DashboardRow3 from './components/DashboardRow3'
import DashboardRow4 from './components/DashboardRow4'
import DashboardRow5 from './components/DashboardRow5'
import DashboardRow6 from './components/DashboardRow6'
import DashboardRow7 from './components/DashboardRow7'
import DashboardRow8 from './components/DashboardRow8'
import DashboardRow9 from './components/DashboardRow9'
import DashboardRow10 from './components/DashboardRow10'
import QuickActions from './components/QuickActions'
import RecentActivities from './components/RecentActivities'

const DashboardPage: React.FC = () => {
  const { t } = useTranslation()

  // Real backend queries
  const { data: statsRes, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats').then((r) => r.data.data),
  })

  const { data: chartRes, isLoading: chartLoading } = useQuery({
    queryKey: ['sales-chart'],
    queryFn: () => api.get('/dashboard/sales-chart').then((r) => r.data.data),
  })

  const { data: topProducts } = useQuery({
    queryKey: ['top-products'],
    queryFn: () => api.get('/dashboard/top-products').then((r) => r.data.data),
  })

  const { data: recentOrders } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: () => api.get('/dashboard/recent-orders').then((r) => r.data.data),
  })

  const { data: lowStock } = useQuery({
    queryKey: ['low-stock'],
    queryFn: () => api.get('/dashboard/low-stock').then((r) => r.data.data),
  })

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6 max-w-[1600px] mx-auto p-1.5"
    >
      {/* Welcome & Branch selection */}
      <motion.div variants={itemVariants}>
        <DashboardHeader />
      </motion.div>

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Left side main content widgets (Row 1 to 10) */}
        <div className="xl:col-span-3 space-y-6">
          {/* ROW 1: Gradient Stats Cards */}
          <motion.div variants={itemVariants}>
            <DashboardStats stats={statsRes} isLoading={statsLoading} />
          </motion.div>

          {/* ROW 2: Primary Analytics Charts */}
          <motion.div variants={itemVariants}>
            <DashboardCharts salesData={chartRes ?? []} />
          </motion.div>

          {/* ROW 3: Top Selling, Recent Orders, Customers */}
          <motion.div variants={itemVariants}>
            <DashboardRow3 topProducts={topProducts ?? []} recentOrders={recentOrders ?? []} />
          </motion.div>

          {/* ROW 4: Inventory summary */}
          <motion.div variants={itemVariants}>
            <DashboardRow4 lowStockList={lowStock ?? []} />
          </motion.div>

          {/* ROW 5: Finance details */}
          <motion.div variants={itemVariants}>
            <DashboardRow5 />
          </motion.div>

          {/* ROW 6: Marketing promotions */}
          <motion.div variants={itemVariants}>
            <DashboardRow6 />
          </motion.div>

          {/* ROW 7: Customer analytics */}
          <motion.div variants={itemVariants}>
            <DashboardRow7 />
          </motion.div>

          {/* ROW 8: Website traffic */}
          <motion.div variants={itemVariants}>
            <DashboardRow8 />
          </motion.div>

          {/* ROW 9: Mobile App downloads */}
          <motion.div variants={itemVariants}>
            <DashboardRow9 />
          </motion.div>

          {/* ROW 10: HR & Employee stats */}
          <motion.div variants={itemVariants}>
            <DashboardRow10 />
          </motion.div>
        </div>

        {/* Right side widgets (Quick Actions & Recent Activity) */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <QuickActions />
          </motion.div>

          <motion.div variants={itemVariants}>
            <RecentActivities />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default DashboardPage
