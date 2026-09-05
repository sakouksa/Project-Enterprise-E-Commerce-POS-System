import React, { useState } from 'react'
import { resolveMediaUrl } from '@/utils/image'
import { User } from 'lucide-react'

export interface AvatarImageProps {
  src?: any
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  status?: 'online' | 'offline' | 'busy' | 'away'
  shape?: 'circle' | 'rounded'
  className?: string
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const getInitials = (name?: string): string => {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const getColorFromName = (name?: string): string => {
  if (!name) return 'bg-primary/10 text-primary'
  const colors = [
    'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    'bg-purple-500/15 text-purple-600 dark:text-purple-400',
    'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
    'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  name = '',
  size = 'md',
  status,
  shape = 'circle',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false)
  const resolvedUrl = resolveMediaUrl(src)

  const sizeClass = typeof size === 'string' ? SIZE_MAP[size] : `w-[${size}px] h-[${size}px]`
  const roundedClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl'
  const initials = getInitials(name)
  const colorClass = getColorFromName(name)

  const showImage = resolvedUrl && !hasError

  return (
    <div className={`relative inline-flex shrink-0 ${sizeClass}`}>
      <div
        className={`w-full h-full overflow-hidden ${roundedClass} flex items-center justify-center font-semibold select-none border border-border/50 ${
          !showImage ? colorClass : 'bg-muted/30'
        } ${className}`}
      >
        {showImage ? (
          <img
            src={resolvedUrl}
            alt={name || 'Avatar'}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <User className="w-1/2 h-1/2 opacity-60" />
        )}
      </div>

      {status && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-background ${
            shape === 'circle' ? 'translate-x-0.5 translate-y-0.5' : ''
          } ${
            status === 'online'
              ? 'bg-emerald-500 w-2.5 h-2.5'
              : status === 'busy'
              ? 'bg-rose-500 w-2.5 h-2.5'
              : status === 'away'
              ? 'bg-amber-500 w-2.5 h-2.5'
              : 'bg-muted-foreground w-2.5 h-2.5'
          }`}
        />
      )}
    </div>
  )
}

export default AvatarImage
