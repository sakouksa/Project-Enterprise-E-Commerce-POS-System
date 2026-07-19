import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, ShoppingBag, Lock, Cpu, Settings2, ShieldAlert } from 'lucide-react'

const MOCK_ACTIVITIES = [
  {
    id: 1,
    type: 'sale',
    title: 'Sale Order completed',
    desc: 'Rp 1,438,000 paid by cash via POS terminal',
    time: '2 mins ago',
    icon: <ShoppingCart className="w-3 h-3 text-blue-500" />,
    bg: 'bg-blue-500/10'
  },
  {
    id: 2,
    type: 'inventory',
    title: 'Stock Adjustment',
    desc: 'JBL Laptop 2 increased +10 pieces (Purchase Order received)',
    time: '15 mins ago',
    icon: <Settings2 className="w-3 h-3 text-emerald-500" />,
    bg: 'bg-emerald-500/10'
  },
  {
    id: 3,
    type: 'login',
    title: 'Secure login detected',
    desc: 'Super Admin signed in from IP 127.0.0.1 (Windows Chrome)',
    time: '1 hour ago',
    icon: <Lock className="w-3 h-3 text-purple-500" />,
    bg: 'bg-purple-500/10'
  },
  {
    id: 4,
    type: 'purchase',
    title: 'PO Created',
    desc: 'Purchase Order #PO-20260718-5080 sent to Supplier JBL',
    time: '3 hours ago',
    icon: <ShoppingBag className="w-3 h-3 text-pink-500" />,
    bg: 'bg-pink-500/10'
  },
  {
    id: 5,
    type: 'system',
    title: 'Audit Warning',
    desc: 'Low stock threshold triggered for product SKU-JBL-LAP-0002',
    time: '12 hours ago',
    icon: <ShieldAlert className="w-3 h-3 text-rose-500" />,
    bg: 'bg-rose-500/10'
  },
]

export const RecentActivities: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-sm text-foreground mb-4">
        {t('dashboard.recentActivities', 'Recent Activity')}
      </h3>
      <div className="relative border-l border-border/60 ml-2.5 pl-5 space-y-5">
        {MOCK_ACTIVITIES.map((act, idx) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="relative"
          >
            {/* Dot icon */}
            <span className={`absolute -left-[30px] top-0 p-1.5 rounded-lg flex items-center justify-center ${act.bg}`}>
              {act.icon}
            </span>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-foreground leading-none">{act.title}</span>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{act.time}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                {act.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default RecentActivities
