import React, { useState, useEffect } from 'react'
import { resolveMediaUrl, type MediaFallbackType, DEFAULT_FALLBACKS } from '@/utils/image'
import { Image as ImageIcon } from 'lucide-react'

export interface AppImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: any
  fallbackType?: MediaFallbackType
  fallbackSrc?: string
  alt?: string
  className?: string
  containerClassName?: string
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto' | string
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down'
  showSkeleton?: boolean
}

export const AppImage: React.FC<AppImageProps> = ({
  src,
  fallbackType = 'general',
  fallbackSrc,
  alt = 'Image',
  className = '',
  containerClassName = '',
  aspectRatio = 'auto',
  objectFit = 'cover',
  showSkeleton = true,
  loading = 'lazy',
  ...props
}) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string>('')

  const resolvedUrl = resolveMediaUrl(src, fallbackType) || fallbackSrc || DEFAULT_FALLBACKS[fallbackType] || ''

  useEffect(() => {
    setCurrentSrc(resolvedUrl)
    setLoaded(false)
    setError(false)
  }, [src, fallbackType, fallbackSrc])

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!error) {
      setError(true)
      const fallback = fallbackSrc || DEFAULT_FALLBACKS[fallbackType]
      if (fallback && currentSrc !== fallback) {
        setCurrentSrc(fallback)
        return
      }
    }
    props.onError?.(e)
  }

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setLoaded(true)
    props.onLoad?.(e)
  }

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'portrait'
      ? 'aspect-3/4'
      : ''

  const fitClass =
    objectFit === 'cover'
      ? 'object-cover'
      : objectFit === 'contain'
      ? 'object-contain'
      : objectFit === 'fill'
      ? 'object-fill'
      : 'object-scale-down'

  return (
    <div
      className={`relative overflow-hidden ${aspectClass} ${containerClassName}`}
    >
      {/* Loading Skeleton */}
      {showSkeleton && !loaded && !error && (
        <div className="absolute inset-0 bg-muted/40 animate-pulse flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-muted-foreground/30 animate-pulse" />
        </div>
      )}

      {currentSrc ? (
        <img
          src={currentSrc}
          alt={alt}
          loading={loading}
          onError={handleError}
          onLoad={handleLoad}
          className={`w-full h-full ${fitClass} transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted/30 text-muted-foreground">
          <ImageIcon className="w-6 h-6 opacity-40" />
        </div>
      )}
    </div>
  )
}

export default AppImage
