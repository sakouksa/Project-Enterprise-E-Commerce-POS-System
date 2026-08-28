import React from 'react'
import { motion } from 'framer-motion'
import { Users, Shield, ShieldCheck, Key } from 'lucide-react'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { CircularProgressRing } from '@/components/shared/CircularProgressRing'

interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  newUsersMonth: number
  verifiedUsers: number
  blockedUsers: number
  twoFactorUsers: number
  securityScore: number
  totalRoles: number
  totalPermissions: number
  adminUsers: number
  todayLogin: number
  activeSessions: number
  avgSessionTime: string
}

interface UserStatsCardsProps {
  analytics: AnalyticsData
}

export const UserStatsCards: React.FC<UserStatsCardsProps> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* Card 1: Total Users */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all"
      >
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Total Users Directory
          </p>
          <div className="text-3xl font-extrabold text-foreground tracking-tight">
            <AnimatedCounter value={analytics.totalUsers} />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span className="text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {analytics.activeUsers} Active
            </span>
            <span>•</span>
            <span className="text-amber-500 font-medium">{analytics.inactiveUsers} Inactive</span>
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-primary/10 text-primary">
          <Users size={24} />
        </div>
      </motion.div>

      {/* Card 2: Security & Authentication */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all"
      >
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Verified Security
          </p>
          <div className="text-3xl font-extrabold text-foreground tracking-tight">
            <AnimatedCounter value={analytics.verifiedUsers} />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span className="text-blue-500 font-bold">{analytics.twoFactorUsers} 2FA Enrolled</span>
            <span>•</span>
            <span className="text-rose-500 font-medium">{analytics.blockedUsers} Blocked</span>
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-500">
          <ShieldCheck size={24} />
        </div>
      </motion.div>

      {/* Card 3: System Roles & Permissions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all"
      >
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Roles & Permissions
          </p>
          <div className="text-3xl font-extrabold text-foreground tracking-tight">
            <AnimatedCounter value={analytics.totalRoles} /> <span className="text-sm font-normal text-muted-foreground">Roles</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span className="text-purple-500 font-bold">{analytics.totalPermissions} Rights</span>
            <span>•</span>
            <span className="text-foreground font-medium">{analytics.adminUsers} Admins</span>
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-500">
          <Shield size={24} />
        </div>
      </motion.div>

      {/* Card 4: Health Score Progress Ring */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all"
      >
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Security Health
          </p>
          <div className="text-2xl font-extrabold text-foreground tracking-tight flex items-baseline gap-1">
            <AnimatedCounter value={analytics.securityScore} decimals={1} suffix="%" />
          </div>
          <p className="text-xs text-muted-foreground">
            {analytics.todayLogin} logins today ({analytics.activeSessions} active)
          </p>
        </div>
        <div className="flex items-center justify-center p-1">
          <CircularProgressRing percentage={analytics.securityScore} colorClass="text-emerald-500" size={50} />
        </div>
      </motion.div>
    </div>
  )
}

export default UserStatsCards
