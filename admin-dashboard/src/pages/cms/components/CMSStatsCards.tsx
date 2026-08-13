import React from 'react'
import { motion } from 'framer-motion'
import { Files, Rocket, Eye, DollarSign } from 'lucide-react'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { CircularProgressRing } from '@/components/shared/CircularProgressRing'

interface CMSStatsCardsProps {
  analytics: {
    totalContent: number
    publishedCount: number
    draftCount: number
    archivedCount: number
    pubToday: number
    scheduled: number
    pendingRev: number
    rejectedCnt: number
    totalViews: number
    uniqueVisitors: number
    avgReadingSecs: number
    bounceRate: string
    adRevenue: number
    affiliateRevenue: number
    subscriptionRevenue: number
    totalRevenue: number
    todayArticles: number
    todayViews: string
    todayNewVisitors: number
    commentsPending: number
    mediaUploadedToday: number
    seoScore: number
  }
}

export const CMSStatsCards: React.FC<CMSStatsCardsProps> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* CARD 1: Total Content */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-5 rounded-[26px] bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
              CONTENT MANAGEMENT
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                <Files size={11} />
                <span>Articles</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Files size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.totalContent} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Total CMS Assets</div>
            </div>
            <CircularProgressRing
              percentage={(analytics.publishedCount / (analytics.totalContent || 1)) * 100}
              colorClass="text-sky-500"
              size={48}
            />
          </div>
        </div>
        <div>
          <div className="w-full bg-sky-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Published</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{analytics.publishedCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Drafts</div>
              <div className="font-bold text-amber-500 mt-0.5">{analytics.draftCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Archived</div>
              <div className="font-bold text-muted-foreground mt-0.5">{analytics.archivedCount}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 2: Publishing Activity */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-[26px] bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              EDITORIAL PIPELINE
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Rocket size={11} />
                <span>Active</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Rocket size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.pubToday} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Published Today</div>
            </div>
            <CircularProgressRing percentage={88} colorClass="text-indigo-500" size={48} />
          </div>
        </div>
        <div>
          <div className="w-full bg-indigo-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Scheduled</div>
              <div className="font-bold text-blue-600 mt-0.5">{analytics.scheduled}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">In Review</div>
              <div className="font-bold text-amber-500 mt-0.5">{analytics.pendingRev}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">SEO Score</div>
              <div className="font-bold text-emerald-600 mt-0.5">{analytics.seoScore}%</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 3: Traffic & Engagement */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-5 rounded-[26px] bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
              TRAFFIC & ENGAGEMENT
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Eye size={11} />
                <span>Views</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Eye size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.totalViews} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Total Article Impressions</div>
            </div>
            <CircularProgressRing percentage={82} colorClass="text-purple-500" size={48} />
          </div>
        </div>
        <div>
          <div className="w-full bg-purple-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Unique</div>
              <div className="font-bold text-foreground mt-0.5">{analytics.uniqueVisitors}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Read Time</div>
              <div className="font-bold text-purple-600 mt-0.5">{(analytics.avgReadingSecs / 60).toFixed(1)}m</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Bounce Rate</div>
              <div className="font-bold text-teal-600 mt-0.5">{analytics.bounceRate}%</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 4: Content Monetization */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-[26px] bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 bg-card shadow-xs hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              MONETIZATION
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <DollarSign size={11} />
                <span>Revenue</span>
              </span>
              <span className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign size={18} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={analytics.totalRevenue} prefix="$" decimals={2} />
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Content Value & Revenue</div>
            </div>
            <CircularProgressRing percentage={90} colorClass="text-emerald-500" size={48} />
          </div>
        </div>
        <div>
          <div className="w-full bg-emerald-500 h-1 rounded-full my-3.5" />
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-xs">
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Ads</div>
              <div className="font-bold text-foreground mt-0.5">${analytics.adRevenue.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Affiliates</div>
              <div className="font-bold text-emerald-600 mt-0.5">${analytics.affiliateRevenue.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[11px] font-medium">Media Uploads</div>
              <div className="font-bold text-teal-600 mt-0.5">{analytics.mediaUploadedToday}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CMSStatsCards
