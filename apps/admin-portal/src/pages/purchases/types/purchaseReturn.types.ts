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
  draft:     'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20',
  approved:  'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
  completed: 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
  cancelled: 'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20',
}
