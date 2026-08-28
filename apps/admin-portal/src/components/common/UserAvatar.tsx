import React, { useState } from 'react'
import { getAbsoluteImageUrl } from '@/utils/image'

interface UserAvatarProps {
  src?: string | null
  name?: string | null
  className?: string
  sizeClassName?: string
  showOnlineStatus?: boolean
  isOnline?: boolean
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  className = '',
  sizeClassName = 'w-9 h-9',
  showOnlineStatus = false,
  isOnline = true,
}) => {
  const [hasError, setHasError] = useState(false)

  const resolvedUrl = src && !hasError ? getAbsoluteImageUrl(src) : null
  const initial = (name || 'User').trim().charAt(0).toUpperCase() || 'U'

  // Deterministic gradient based on name
  const gradients = [
    'from-emerald-500 to-teal-600',
    'from-blue-600 to-indigo-600',
    'from-violet-600 to-purple-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
  ]
  const charCode = initial.charCodeAt(0) || 0
  const gradient = gradients[charCode % gradients.length]

  return (
    <div className={`relative shrink-0 ${sizeClassName} ${className}`}>
      <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden shadow-xs bg-gradient-to-br ${gradient} border border-white/20 select-none`}>
        {resolvedUrl ? (
          <img
            src={resolvedUrl}
            alt={name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
            loading="lazy"
          />
        ) : (
          <span className="text-white font-extrabold text-xs sm:text-sm drop-shadow-xs">
            {initial}
          </span>
        )}
      </div>

      {showOnlineStatus && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ring-1 ring-black/10 ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
          }`}
        />
      )}
    </div>
  )
}

export default UserAvatar
