import React from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type SpinnerVariant = 'dots' | 'ring' | 'pulse'

interface LoadingSpinnerProps {
  size?: SpinnerSize
  variant?: SpinnerVariant
  label?: string
  fullPage?: boolean   // center in full page area
  className?: string
}

// ─── Size map ────────────────────────────────────────────────────────────────

const RING_SIZES: Record<SpinnerSize, string> = {
  xs: 'w-4 h-4  border-2',
  sm: 'w-6 h-6  border-2',
  md: 'w-8 h-8  border-[3px]',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-4',
}

const DOT_SIZES: Record<SpinnerSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2   h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3   h-3',
  xl: 'w-4   h-4',
}

// ─── Component ───────────────────────────────────────────────────────────────

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'dots',
  label,
  fullPage = false,
  className = '',
}) => {
  const inner =
    variant === 'ring' ? (
      <div className={`rounded-full border-border border-t-primary animate-spin ${RING_SIZES[size]}`} />
    ) : variant === 'pulse' ? (
      <div className={`rounded-full bg-primary animate-pulse ${RING_SIZES[size]}`} />
    ) : (
      /* dots */
      <div className="flex gap-1.5 items-center">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`rounded-full bg-primary animate-bounce ${DOT_SIZES[size]}`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    )

  const wrapper = (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {inner}
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-64 w-full">
        {wrapper}
      </div>
    )
  }

  return wrapper
}

export default LoadingSpinner
