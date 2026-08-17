import React, { useState, useEffect } from 'react'

interface EmployeeAvatarProps {
  photo?: string | null
  name?: string
  id?: number | string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  getPhotoUrl?: (path?: string) => string | null
}

const colorPalettes = [
  { bg: 'bg-purple-100 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800/50' },
  { bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800/50' },
  { bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800/50' },
  { bg: 'bg-rose-100 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800/50' },
  { bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800/50' },
  { bg: 'bg-indigo-100 dark:bg-indigo-950/60', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800/50' },
  { bg: 'bg-teal-100 dark:bg-teal-950/60', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800/50' },
  { bg: 'bg-cyan-100 dark:bg-cyan-950/60', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800/50' },
]

function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'EM'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    const first = parts[0][0] || ''
    const second = parts[1][0] || ''
    return (first + second).toUpperCase()
  }
  const clean = parts[0]
  if (clean.length <= 3) return clean.toUpperCase()
  return clean.substring(0, 2).toUpperCase()
}

function getPaletteIndex(name?: string, id?: number | string): number {
  if (id !== undefined && id !== null) {
    const num = Number(id)
    if (!isNaN(num)) return Math.abs(num) % colorPalettes.length
  }
  if (!name) return 0
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % colorPalettes.length
}

export const EmployeeAvatar: React.FC<EmployeeAvatarProps> = ({
  photo,
  name = '',
  id,
  size = 'md',
  className = '',
  getPhotoUrl,
}) => {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [photo])

  const palette = colorPalettes[getPaletteIndex(name, id)]
  const initials = getInitials(name)

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-20 h-20 text-xl font-bold',
  }[size]

  const rawUrl = photo ? (getPhotoUrl ? getPhotoUrl(photo) : photo) : null
  const hasValidPhoto = Boolean(rawUrl) && !imgError

  return (
    <div
      className={`rounded-full shrink-0 overflow-hidden flex items-center justify-center font-bold font-mono select-none border transition-all ${sizeClasses} ${
        hasValidPhoto
          ? 'border-border bg-muted'
          : `${palette.bg} ${palette.text} ${palette.border} shadow-2xs`
      } ${className}`}
    >
      {hasValidPhoto ? (
        <img
          src={rawUrl!}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}

export default EmployeeAvatar
