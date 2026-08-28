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
  draft: 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  ordered: 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  partial: 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  received: 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

export const PAYMENT_BADGE: Record<string, string> = {
  unpaid: 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  partial: 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  paid: 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
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

