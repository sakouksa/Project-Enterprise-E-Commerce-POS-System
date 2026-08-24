import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCompanyStore } from '@/stores/companyStore'
import { useAuthStore } from '@/stores/authStore'
import { getAbsoluteImageUrl } from '@/utils/image'

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  imageClassName?: string
  customLogo?: string | null
  customName?: string
  showText?: boolean
  showTagline?: boolean
  animated?: boolean
  onClick?: () => void
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  bordered?: boolean
}

const SIZE_MAP = {
  xs: { box: 'w-8 h-8', text: 'text-xs', sub: 'text-[9px]' },
  sm: { box: 'w-10 h-10', text: 'text-sm', sub: 'text-[10px]' },
  md: { box: 'w-12 h-12', text: 'text-base', sub: 'text-xs' },
  lg: { box: 'w-16 h-16 sm:w-20 sm:h-20', text: 'text-xl', sub: 'text-xs' },
  xl: { box: 'w-24 h-24 sm:w-28 sm:h-28', text: 'text-2xl', sub: 'text-sm' },
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'sm',
  className = '',
  imageClassName = '',
  customLogo,
  customName,
  showText = false,
  showTagline = false,
  animated = false,
  onClick,
  rounded,
  bordered = false,
}) => {
  const { branding } = useCompanyStore()
  const { user } = useAuthStore()
  const [imgError, setImgError] = useState(false)

  // Prioritize customLogo -> dynamic branding logo -> user company logo -> default /logo.svg
  const rawLogo = customLogo !== undefined ? customLogo : (branding.logo || user?.company?.logo || '/logo.svg')
  const logoUrl = getAbsoluteImageUrl(rawLogo || '') || '/logo.svg'

  useEffect(() => {
    setImgError(false)
  }, [logoUrl])

  const displayName = customName || user?.company?.name || branding.brand_name || 'NexPOS'
  const displayTagline = branding.brand_tagline || 'Next-Generation Enterprise POS'

  const dims = SIZE_MAP[size] || SIZE_MAP.sm
  const appliedRounded = rounded ? `rounded-${rounded}` : 'rounded-2xl'

  const Content = (
    <div
      className={`inline-flex items-center gap-3 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* ─── Master Logo Container (Transparent Background, Clean Contain) ─── */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-all duration-200 ${dims.box} ${appliedRounded} ${
          bordered
            ? 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs ring-1 ring-black/5 dark:ring-white/5 p-1.5'
            : 'bg-transparent border-0 shadow-none p-0'
        }`}
      >
        {!imgError && logoUrl ? (
          <img
            src={logoUrl}
            alt={`${displayName} Logo`}
            onError={() => setImgError(true)}
            className={`w-full h-full max-w-full max-h-full object-contain select-none transition-transform duration-200 ${imageClassName}`}
          />
        ) : (
          /* Sleek fallback vector monogram badge */
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-rose-600 via-red-600 to-amber-500 flex items-center justify-center text-white font-black shadow-inner">
            <span className="leading-none text-white tracking-wider font-extrabold text-sm uppercase">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col min-w-0 text-left">
          <span className={`font-black tracking-tight leading-none text-slate-900 dark:text-white truncate ${dims.text}`}>
            {displayName}
          </span>
          {showTagline && (
            <span className={`text-slate-500 dark:text-slate-400 font-medium truncate mt-1 ${dims.sub}`}>
              {displayTagline}
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (animated) {
    return (
      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
        {Content}
      </motion.div>
    )
  }

  return Content
}

export default BrandLogo
