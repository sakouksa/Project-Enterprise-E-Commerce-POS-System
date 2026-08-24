import React, { useState } from 'react'
import { cn, getImageUrl } from '@/lib/utils'

export interface ImageWithFallbackProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
  fallbackSrc?: string
  aspectRatio?: 'square' | 'video' | 'auto' | 'banner'
  containerClassName?: string
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Product image',
  fallbackSrc = '/images/placeholder-product.png',
  aspectRatio = 'auto',
  containerClassName,
  className,
  loading = 'lazy',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(getImageUrl(src))
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Sync state if src prop changes
  React.useEffect(() => {
    setImgSrc(getImageUrl(src))
    setHasError(false)
  }, [src])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'banner'
      ? 'aspect-[21/9]'
      : ''

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center',
        aspectClass,
        containerClassName
      )}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-all duration-300',
          !isLoaded && 'opacity-0 scale-95',
          isLoaded && 'opacity-100 scale-100',
          className
        )}
        {...props}
      />
    </div>
  )
}

export default ImageWithFallback
