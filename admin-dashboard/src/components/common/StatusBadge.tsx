import React from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type StatusVariant =
  | 'active'   | 'inactive'
  | 'pending'  | 'approved' | 'rejected'
  | 'paid'     | 'unpaid'   | 'partial'
  | 'shipped'  | 'delivered'| 'cancelled'
  | 'draft'    | 'published'
  | 'in_stock' | 'low_stock'| 'out_of_stock'
  | string     // allow custom pass-through

interface StatusBadgeProps {
  status: StatusVariant
  label?: string            // override display text
  size?: 'xs' | 'sm' | 'md'
}

// ─── Color map ────────────────────────────────────────────────────────────────

const COLORS: Record<string, string> = {
  // generic positive
  active:        'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  approved:      'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  paid:          'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  published:     'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  delivered:     'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  in_stock:      'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  // neutral / warning
  pending:       'bg-amber-500/15  text-amber-400  border-amber-500/25',
  partial:       'bg-amber-500/15  text-amber-400  border-amber-500/25',
  low_stock:     'bg-amber-500/15  text-amber-400  border-amber-500/25',
  draft:         'bg-slate-500/15  text-slate-400  border-slate-500/25',
  // negative
  inactive:      'bg-red-500/15    text-red-400    border-red-500/25',
  rejected:      'bg-red-500/15    text-red-400    border-red-500/25',
  cancelled:     'bg-red-500/15    text-red-400    border-red-500/25',
  out_of_stock:  'bg-red-500/15    text-red-400    border-red-500/25',
  unpaid:        'bg-red-500/15    text-red-400    border-red-500/25',
  // info
  shipped:       'bg-blue-500/15   text-blue-400   border-blue-500/25',
}

const DEFAULT_COLOR = 'bg-slate-500/15 text-slate-400 border-slate-500/25'

const SIZE: Record<string, string> = {
  xs:  'text-[10px] px-1.5 py-0.5',
  sm:  'text-xs     px-2   py-0.5',
  md:  'text-xs     px-2.5 py-1',
}

// ─── Component ───────────────────────────────────────────────────────────────

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'sm' }) => {
  const key   = status?.toLowerCase().replace(/\s+/g, '_')
  const color = COLORS[key] ?? DEFAULT_COLOR
  const text  = label ?? status?.replace(/_/g, ' ')

  return (
    <span className={`inline-flex items-center rounded-full border font-medium capitalize ${color} ${SIZE[size]}`}>
      {text}
    </span>
  )
}

export default StatusBadge
