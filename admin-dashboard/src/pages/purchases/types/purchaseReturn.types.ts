export interface PurchaseReturnItem {
  id: number
  purchase_return_id: number
  purchase_item_id: number
  product_id: number
  product_variant_id?: number
  quantity: number
  unit_cost: number
  total: number
  notes?: string
  variant?: { name: string }
  product_name?: string | null
  sku?: string | null
}

export interface PurchaseReturn {
  id: number
  reference_number: string
  purchase_id: number
  supplier?: { name: string; email?: string; phone?: string; address?: string }
  user?: { name: string }
  date: string
  total_amount: number
  reason?: string
  status: string
  created_at: string
  items: PurchaseReturnItem[]
  purchase?: { reference_number: string }
}

export const RETURN_STATUS_BADGE: Record<string, string> = {
  draft:     'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  approved:  'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  completed: 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}
