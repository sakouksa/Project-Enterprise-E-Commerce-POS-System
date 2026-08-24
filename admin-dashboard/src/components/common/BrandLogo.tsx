import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCompanyStore } from '@/stores/companyStore'
import { useAuthStore } from '@/stores/authStore'
import { getAbsoluteImageUrl } from '@/utils/image'

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  customLogo?: string | null
  customName?: string
  showText?: boolean
  showTagline?: boolean
  animated?: boolean
  onClick?: () => void
}

const SIZE_MAP = {
  xs: { box: 'w-7 h-7', img: 'w-5 h-5', text: 'text-xs', sub: 'text-[9px]' },
  sm: { box: 'w-9 h-9', img: 'w-6 h-6', text: 'text-sm', sub: 'text-[10px]' },
  md: { box: 'w-11 h-11', img: 'w-8 h-8', text: 'text-base', sub: 'text-xs' },
  lg: { box: 'w-14 h-14 sm:w-16 sm:h-16', img: 'w-10 h-10 sm:w-12 sm:h-12', text: 'text-xl', sub: 'text-xs' },
  xl: { box: 'w-20 h-20', img: 'w-16 h-16', text: 'text-2xl', sub: 'text-sm' },
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'sm',
  className = '',
  customLogo,
  customName,
  showText = false,
  showTagline = false,
  animated = false,
  onClick,
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

  const Content = (
    <div className={`inline-flex items-center gap-2.5 ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick}>
      <div className={`relative flex items-center justify-center shrink-0 rounded-2xl overflow-hidden ${dims.box}`}>
        {!imgError && logoUrl ? (
          <img
            src={logoUrl}
            alt={`${displayName} Logo`}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-200"
          />
        ) : (
          /* Sleek fallback vector icon badge */
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white font-black shadow-md">
            <span className="leading-none text-white tracking-wider font-extrabold">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col min-w-0 text-left">
          <span className={`font-black tracking-tight leading-none text-slate-900 dark:text-white ${dims.text}`}>
            {displayName}
          </span>
          {showTagline && (
            <span className={`text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5 ${dims.sub}`}>
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
