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

export { formatJsonValue, formatDateTimeLocal } from '@/utils/formatters'
