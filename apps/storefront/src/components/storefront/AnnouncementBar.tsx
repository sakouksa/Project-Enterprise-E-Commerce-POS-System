import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface AnnouncementBarProps {
  announcement?: {
    enabled?: boolean
    message?: string
    link?: string
    code?: string
  }
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ announcement }) => {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !announcement || announcement.enabled === false) {
    return null
  }

  return (
    <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white text-xs font-medium py-2 px-4 shadow-sm z-30 transition-all">
      <div className="container-site flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Promo
          </span>

          <span>{announcement.message || t('nav.free_shipping')}</span>

          {announcement.code && (
            <span className="px-2 py-0.5 rounded bg-black/30 font-mono font-bold text-[11px] border border-white/20">
              {announcement.code}
            </span>
          )}

          {announcement.link && (
            <Link
              to={announcement.link}
              className="inline-flex items-center gap-0.5 underline font-bold hover:text-amber-200 transition-colors ml-1"
            >
              {t('hero.shop_now')} <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-white/70 hover:text-white transition-colors p-1 -mr-1 rounded-lg hover:bg-white/10"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export default AnnouncementBar
