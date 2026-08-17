export interface PurchaseItem {
  id: number
  product_id: number
  product_name: string | null
  product_variant_id?: number | null
  sku: string | null
  quantity: number
  quantity_received: number
  unit_cost: number
  discount_percent: number
  discount_amount: number
  tax_percent: number
  tax_amount: number
  subtotal: number
  total: number
  notes?: string | null
  product?: { id: number; name: string; sku: string | null } | null
  variant?: { id: number; name: string; sku: string | null } | null
}

export interface Purchase {
  id: number
  reference_number: string
  supplier?: { id: number; name: string; email?: string; phone?: string; address?: string }
  warehouse?: { id: number; name: string }
  branch?: { id: number; name: string }
  creator?: { id: number; name: string }
  date: string
  due_date?: string
  status: string
  payment_status: string
  subtotal: number
  tax_amount: number
  discount_amount: number
  shipping_cost: number
  grand_total: number
  paid_amount: number
  due_amount: number
  currency_code: string
  exchange_rate: number
  notes?: string
  created_at: string
  items_count?: number
  items?: PurchaseItem[]
}

export const STATUS_BADGE: Record<string, string> = {
  draft: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
  ordered: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  partial: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  received: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  cancelled: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
}

export const PAYMENT_BADGE: Record<string, string> = {
  unpaid: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
  partial: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  paid: 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
}

export const getDeliveryStatusLabel = (status: string, t: any): string => {
  const map: Record<string, { key: string; fallback: string }> = {
    draft: { key: 'delivery_status.draft', fallback: 'Draft' },
    ordered: { key: 'delivery_status.ordered', fallback: 'Ordered' },
    partial: { key: 'delivery_status.partial', fallback: 'Partially Received' },
    received: { key: 'delivery_status.received', fallback: 'Received' },
    cancelled: { key: 'delivery_status.cancelled', fallback: 'Cancelled' },
  }
  const item = map[status]
  if (!item) return t(`purchases.${status}`, status)
  return t(`purchases.${item.key}`, t(`purchases.${status}`, item.fallback))
}

export const getPaymentStatusLabel = (status: string, t: any): string => {
  const map: Record<string, { key: string; fallback: string }> = {
    unpaid: { key: 'payment_status.unpaid', fallback: 'Unpaid' },
    partial: { key: 'payment_status.partial', fallback: 'Partially Paid' },
    paid: { key: 'payment_status.paid', fallback: 'Paid' },
  }
  const item = map[status]
  if (!item) return t(`purchases.${status}`, status)
  return t(`purchases.${item.key}`, t(`purchases.${status}`, item.fallback))
}

