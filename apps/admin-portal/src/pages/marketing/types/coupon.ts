export interface Coupon {
  id: number
  name: string
  code: string
  type: 'fixed' | 'percentage' | 'free_shipping'
  value: number
  minimum_amount?: number
  usage_limit?: number
  used_count?: number
  expires_at?: string
  is_active: boolean
  status?: 'active' | 'expired' | 'scheduled' | 'paused' | 'inactive'
  created_at?: string
  campaign?: string
  customer_group?: string
  revenue_generated?: number
  marketing_cost?: number
}

export interface CouponAnalytics {
  totalCoupons: number
  activeCoupons: number
  expiredCoupons: number
  scheduledCoupons: number
  totalRedemptions: number
  totalUsageLimit: number
  redemptionRate: number
  totalDiscountGiven: number
  totalRevenueGenerated: number
  marketingROI: number
  avgOrderValue: number
}
