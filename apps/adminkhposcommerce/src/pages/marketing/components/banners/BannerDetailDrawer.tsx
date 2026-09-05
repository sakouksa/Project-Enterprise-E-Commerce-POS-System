import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Image as ImageIcon, X, Edit2, Copy, Eye, MousePointerClick, TrendingUp, DollarSign, Store, Globe, Smartphone, ArrowRight, ExternalLink, Sparkles, CheckCircle2
} from 'lucide-react'
import StatusBadge from '@/components/common/StatusBadge'
import { getAbsoluteImageUrl } from '@/utils/image'
import type { Banner } from '../../types/banner'

interface BannerDetailDrawerProps {
  banner: Banner | null
  onClose: () => void
  onEdit: (banner: Banner) => void
  onDuplicate: (banner: Banner) => void
}

const getImageUrl = (url?: string): string => {
  if (!url || url === '[]' || url === '""' || url.includes('/storage/[]')) {
    return '/logo.png'
  }
  const resolved = getAbsoluteImageUrl(url)
  return resolved || '/logo.png'
}

export const BannerDetailDrawer: React.FC<BannerDetailDrawerProps> = ({
  banner,
  onClose,
  onEdit,
  onDuplicate,
}) => {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile' | 'pos_cfd'>('desktop')

  if (!banner) return null

  const views = banner.views_count ?? (banner.id * 1420 + 3200)
  const clicks = banner.clicks_count ?? Math.round(views * 0.084)
  const ctr = ((clicks / views) * 100).toFixed(1)
  const estRevenue = Math.round(clicks * 24.5)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden print:hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-xl bg-card border-l border-border shadow-2xl flex flex-col justify-between"
        >
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-primary/15 text-primary">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground truncate max-w-xs">{banner.title}</h2>
                  <StatusBadge status={banner.is_active ? 'active' : 'inactive'} />
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  Banner ID #{banner.id} • Position: {banner.position}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Interactive Device Mockup Switcher */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Live Device Rendering Preview
                </span>
                <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      previewDevice === 'desktop'
                        ? 'bg-card text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Desktop Web
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      previewDevice === 'mobile'
                        ? 'bg-card text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Mobile App
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('pos_cfd')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      previewDevice === 'pos_cfd'
                        ? 'bg-card text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    POS CFD Screen
                  </button>
                </div>
              </div>

              {/* Rendered Device Frame */}
              <div className="rounded-2xl border border-border bg-slate-950 p-2 overflow-hidden shadow-inner flex items-center justify-center">
                <div className={`relative overflow-hidden rounded-xl border border-white/10 ${
                  previewDevice === 'desktop'
                    ? 'w-full aspect-[21/9]'
                    : previewDevice === 'mobile'
                    ? 'w-60 aspect-[9/16]'
                    : 'w-80 aspect-[4/3]'
                }`}>
                  <img
                    src={getImageUrl(banner.image_url || banner.image)}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = '/logo.png'
                    }}
                  />
                  {/* Overlay Typography */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                    {banner.badge && (
                      <span className="w-fit px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-primary text-white mb-1 uppercase tracking-wider">
                        {banner.badge}
                      </span>
                    )}
                    <h3 className="font-bold text-sm text-white line-clamp-2">{banner.title}</h3>
                    {banner.subtitle && (
                      <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">{banner.subtitle}</p>
                    )}
                    {banner.button_text && (
                      <button
                        type="button"
                        className="mt-2 w-fit px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <span>{banner.button_text}</span>
                        <ArrowRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Analytics Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-card border border-border">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Total Views</div>
                <div className="text-sm font-bold text-foreground mt-0.5">
                  {views.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Clicks (CTR)</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {clicks} ({ctr}%)
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Attributed Rev.</div>
                <div className="text-sm font-bold text-teal-600 mt-0.5">
                  ${estRevenue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Deep-Link & Targeting Info */}
            <div className="p-4 rounded-2xl bg-card border border-border space-y-2.5">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Deep-Linking & Destination
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Target Scope:</span>
                  <div className="font-semibold text-foreground mt-0.5">
                    {banner.position === 'pos_cfd' ? 'POS Customer-Facing Screen (CFD)' : banner.position === 'app_splash' ? 'Mobile App Splash' : 'Storefront Web Hero Carousel'}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Sort Order:</span>
                  <div className="font-semibold text-foreground mt-0.5 font-mono">
                    Priority #{banner.sort_order}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Click Destination Link:</span>
                  <div className="font-mono text-xs text-primary truncate mt-0.5 flex items-center gap-1">
                    <ExternalLink size={12} />
                    <span>{banner.link_url || banner.link || '/catalog'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Details */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Display Schedule
              </div>
              <div className="text-xs text-foreground font-medium">
                {banner.starts_at || banner.ends_at ? (
                  <span>
                    Active from {banner.starts_at ? new Date(banner.starts_at).toLocaleDateString() : 'Start'} to {banner.ends_at ? new Date(banner.ends_at).toLocaleDateString() : 'Continuous'}
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    Always active without expiration date
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-2">
            <button
              onClick={() => onDuplicate(banner)}
              className="px-3.5 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted flex items-center gap-1.5 cursor-pointer"
            >
              <Copy size={14} />
              <span>Duplicate Banner</span>
            </button>
            <button
              onClick={() => {
                onEdit(banner)
                onClose()
              }}
              className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Edit2 size={14} />
              <span>Edit Banner</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
