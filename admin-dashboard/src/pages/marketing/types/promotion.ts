export interface Promotion {
  id: number
  name: string
  description?: string
  type: string
  conditions: any
  rewards: any
  starts_at: string
  ends_at: string
  priority: number
  is_active: boolean
  code?: string
  category?: string
  brand?: string
  product?: string
  customer_group?: string
  view_count?: number
  click_count?: number
  customer_reach?: number
  orders_count?: number
  revenue_generated?: number
  discount_amount?: number
  marketing_cost?: number
  status?: 'running' | 'scheduled' | 'expired' | 'paused' | 'draft'
  created_at?: string
}

export interface PromotionAnalytics {
  totalPromotions: number
  runningPromotions: number
  scheduledPromotions: number
  expiredPromotions: number
  totalCustomerReach: number
  totalOrdersDriven: number
  avgConversionRate: number
  totalRevenueGenerated: number
  totalDiscountGranted: number
  campaignCost: number
  campaignProfit: number
  marketingROI: number
  avgOrderValue: number
  todayPromotions: number
  todayRevenue: number
  newCustomersAcquired: number
  repeatOrdersCount: number
  lowStockItemsInPromo: number
  endingSoonCount: number
}

export const formatJsonValue = (val: any): string => {
  if (val === null || val === undefined) return '[]'
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val)
      return typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2)
    } catch {
      return val
    }
  }
  try {
    return JSON.stringify(val, null, 2)
  } catch {
    return String(val)
  }
}

export const formatDateTimeLocal = (dateStr?: string | null): string => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) {
      const clean = dateStr.replace(' ', 'T')
      return clean.length >= 16 ? clean.slice(0, 16) : clean
    }
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch {
    return ''
  }
}
