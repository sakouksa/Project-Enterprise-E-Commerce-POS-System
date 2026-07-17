import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Key, Activity, Calendar, Award } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { UserProfile } from '@/services/profileService'

interface ProfileOverviewProps {
  profile: UserProfile
  activities: any[]
  permissionsCount: number
  loginCount: number
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  profile,
  activities,
  permissionsCount,
  loginCount,
}) => {
  const { t } = useTranslation()
  const stats = [
    {
      label: t('profile.overview_tab.account_status', 'Account Status'),
      value: profile.is_active ? t('profile.overview_tab.active', 'Active') : t('profile.overview_tab.inactive', 'Inactive'),
      icon: <Activity className="text-emerald-500" size={20} />,
      bgColor: 'bg-emerald-500/10'
    },
    {
      label: t('profile.overview_tab.role_tier', 'Role Tier'),
      value: profile.roles?.[0] ? profile.roles[0].replace('_', ' ') : 'User',
      icon: <Award className="text-blue-500" size={20} />,
      bgColor: 'bg-blue-500/10',
      capitalize: true
    },
    {
      label: t('profile.overview_tab.assigned_permissions', 'Assigned Permissions'),
      value: `${permissionsCount} ${t('profile.overview_tab.actions', 'actions')}`,
      icon: <Key className="text-amber-500" size={20} />,
      bgColor: 'bg-amber-500/10'
    },
    {
      label: t('profile.overview_tab.total_sessions', 'Total Sessions Logged'),
      value: `${loginCount} ${t('profile.overview_tab.logins', 'logins')}`,
      icon: <Shield className="text-purple-500" size={20} />,
      bgColor: 'bg-purple-500/10'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } }
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className={`p-3 rounded-xl ${stat.bgColor} flex-shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              <h4 className={`text-lg font-bold text-foreground mt-0.5 ${stat.capitalize ? 'capitalize' : ''}`}>
                {stat.value}
              </h4>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Activity Timeline Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <Activity size={18} className="text-primary" />
          {t('profile.overview_tab.recent_timeline', 'Recent Activity Timeline')}
        </h3>

        {activities.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-xl">
            <Calendar className="mx-auto mb-2 text-muted-foreground/30" size={36} />
            <p className="text-sm text-muted-foreground">{t('profile.overview_tab.no_recent_actions', 'No recent actions logged')}</p>
          </div>
        ) : (
          <div className="relative border-l border-border/60 ml-3 pl-6 space-y-6">
            {activities.slice(0, 5).map((log, idx) => {
              const date = new Date(log.created_at).toLocaleString()
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Timeline bullet */}
                  <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-card border border-background transition-transform duration-200 group-hover:scale-125" />
                  
                  <div>
                    <span className="text-xs text-muted-foreground font-mono">{date}</span>
                    <h5 className="text-sm font-semibold text-foreground mt-0.5 capitalize">
                      {log.description}
                    </h5>
                    <p className="text-xs text-muted-foreground/80 mt-0.5">
                      IP: {log.properties?.ip ?? 'N/A'} • Module: <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-primary">{log.log_name}</span>
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
