import React from 'react'
import {
  Smartphone,
  Laptop,
  Tv,
  Watch,
  Keyboard,
  Headphones,
  Camera,
  Zap,
  ShoppingBag,
  Layers,
  Tag,
  type LucideIcon,
} from 'lucide-react'

/**
 * Returns the Lucide icon component corresponding to a category slug.
 */
export const getCategoryIcon = (slug?: string): LucideIcon => {
  if (!slug) return Tag
  const s = slug.toLowerCase()
  if (s.includes('phone')) return Smartphone
  if (s.includes('laptop') || s.includes('computer') || s.includes('mac')) return Laptop
  if (s.includes('monitor') || s.includes('display') || s.includes('tv')) return Tv
  if (s.includes('watch')) return Watch
  if (s.includes('keyboard') || s.includes('game') || s.includes('gaming')) return Keyboard
  if (s.includes('audio') || s.includes('headphone') || s.includes('sound')) return Headphones
  if (s.includes('camera')) return Camera
  if (s.includes('charger') || s.includes('power') || s.includes('cable')) return Zap
  if (s.includes('shoe')) return ShoppingBag
  if (s.includes('apparel') || s.includes('cloth')) return Layers
  return Tag
}

/**
 * Returns a styled JSX icon element with brand theme color.
 */
export const getCategoryIconElement = (
  slug?: string,
  className = 'w-4 h-4'
): React.ReactElement => {
  if (!slug) return <Tag className={`${className} text-slate-400`} />
  const s = slug.toLowerCase()
  if (s.includes('phone')) return <Smartphone className={`${className} text-blue-500`} />
  if (s.includes('laptop') || s.includes('computer') || s.includes('mac'))
    return <Laptop className={`${className} text-indigo-500`} />
  if (s.includes('monitor') || s.includes('display') || s.includes('tv'))
    return <Tv className={`${className} text-cyan-500`} />
  if (s.includes('watch')) return <Watch className={`${className} text-amber-500`} />
  if (s.includes('keyboard') || s.includes('game') || s.includes('gaming'))
    return <Keyboard className={`${className} text-purple-500`} />
  if (s.includes('audio') || s.includes('headphone') || s.includes('sound'))
    return <Headphones className={`${className} text-rose-500`} />
  if (s.includes('camera')) return <Camera className={`${className} text-orange-500`} />
  if (s.includes('charger') || s.includes('power'))
    return <Zap className={`${className} text-yellow-500`} />
  if (s.includes('shoe')) return <ShoppingBag className={`${className} text-emerald-500`} />
  if (s.includes('apparel') || s.includes('cloth'))
    return <Layers className={`${className} text-teal-500`} />
  return <Tag className={`${className} text-slate-500`} />
}
