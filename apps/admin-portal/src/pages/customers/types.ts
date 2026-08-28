export interface Customer {
  id: number
  company_id: number
  company?: { name: string }
  customer_group_id?: number
  group?: { name: string; discount_percent: number }
  user_id?: number
  user?: { name: string; email: string }
  name: string
  email?: string
  phone?: string
  gender?: 'male' | 'female' | 'other'
  birth_date?: string
  photo?: string
  total_spent: number
  order_count: number
  loyalty_points: number
  credit_limit?: number
  outstanding_balance?: number
  tax_number?: string
  notes?: string
  is_active: boolean
  addresses?: any[]
  sales?: any[]
  created_at: string
  updated_at: string
}

export interface CustomerFormData {
  company_id: string
  customer_group_id: string
  user_id: string
  name: string
  email: string
  phone: string
  gender: string
  birth_date: string
  credit_limit: string
  tax_number: string
  notes: string
  is_active: boolean
}

export interface CustomerAnalytics {
  totalCustomers: number
  activeCustomers: number
  inactiveCustomers: number
  totalRevenue: number
  avgRevenuePerCustomer: number
  vipCount: number
  avgLoyaltyPoints: number
}
