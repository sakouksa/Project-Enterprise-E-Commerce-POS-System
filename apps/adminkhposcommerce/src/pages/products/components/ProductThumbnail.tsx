import React, { useState } from 'react'
import { getAbsoluteImageUrl } from '@/utils/image'
import { getDynamicColorMatchedImage } from '../utils/colorResolver'
import { Package, Eye } from 'lucide-react'
import { Image as AntImage } from 'antd'

interface ProductThumbnailProps {
  name: string
  primaryImage?: any
  images?: any[]
  image?: any
  categoryName?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  className?: string
  rounded?: string
  alt?: string
  preview?: boolean
}

const SIZE_MAP = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
}

export const ProductThumbnail: React.FC<ProductThumbnailProps> = ({
  name,
  primaryImage,
  images,
  image,
  categoryName,
  size = 'sm',
  className = '',
  rounded = 'rounded-xl',
  alt,
  preview = true,
}) => {
  const [step, setStep] = useState<0 | 1 | 2>(0) // 0: primary, 1: category fallback, 2: icon fallback

  const primaryUrl = getAbsoluteImageUrl(
    primaryImage || (images && images.length > 0 ? images[0] : null) || image
  )

  const fallbackUrl = getDynamicColorMatchedImage('Black', categoryName || name)

  const sizeClass = typeof size === 'number' ? `w-[${size}px] h-[${size}px]` : (SIZE_MAP[size] || SIZE_MAP.sm)

  const handleError = () => {
    if (step === 0 && fallbackUrl && fallbackUrl !== primaryUrl) {
      setStep(1)
    } else {
      setStep(2)
    }
  }

  const currentSrc = step === 0 ? primaryUrl : step === 1 ? fallbackUrl : null

  return (
    <div
      className={`${sizeClass} ${rounded} bg-muted border border-border/80 overflow-hidden flex items-center justify-center shrink-0 relative select-none ${className}`}
      title={name}
      onClick={(e) => {
        if (preview && currentSrc) {
          e.stopPropagation()
        }
      }}
    >
      {currentSrc ? (
        preview ? (
          <AntImage
            src={currentSrc}
            alt={alt || name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            wrapperClassName="w-full h-full flex items-center justify-center cursor-pointer"
            preview={{
              mask: (
                <div className="flex items-center justify-center w-full h-full bg-black/40 text-white">
                  <Eye size={13} />
                </div>
              ),
            }}
            onError={handleError}
          />
        ) : (
          <img
            src={currentSrc}
            alt={alt || name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={handleError}
          />
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs">
          {name ? name.charAt(0).toUpperCase() : <Package size={16} />}
        </div>
      )}
    </div>
  )
}

export default ProductThumbnail

