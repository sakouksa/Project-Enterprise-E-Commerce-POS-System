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
  draft: 'px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  ordered: 'px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  partial: 'px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  received: 'px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

export const PAYMENT_BADGE: Record<string, string> = {
  unpaid: 'px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  partial: 'px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  paid: 'px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
}
