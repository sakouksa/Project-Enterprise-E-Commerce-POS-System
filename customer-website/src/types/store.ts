// ─── Global Store & Domain TypeScript Types ───────────────────────────────

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string | null
  icon?: string | null
  parent_id?: number | null
  products_count?: number
  is_active?: boolean
  children?: Category[]
}

export interface Brand {
  id: number
  name: string
  slug: string
  description?: string
  logo?: string | null
  website?: string | null
  products_count?: number
  is_active?: boolean
}

export interface StoreSettings {
  site_name?: string
  site_subtitle?: string
  site_logo?: string | null
  favicon?: string | null
  company_phone?: string
  company_email?: string
  company_address?: string
  hotlines?: string[]
  social_facebook?: string
  social_telegram?: string
  social_tiktok?: string
  social_youtube?: string
  currency?: string
  exchange_rate_khr?: number
  free_shipping_min?: number
}

export interface Product {
  id: number
  name: string
  slug: string
  sku?: string
  barcode?: string
  price: number
  compare_price?: number
  cost_price?: number
  stock_quantity?: number
  image?: string | null
  images?: string[]
  brand_id?: number
  category_id?: number
  brand?: Brand
  category?: Category
  short_description?: string
  description?: string
  rating?: number
  reviews_count?: number
  is_featured?: boolean
  is_active?: boolean
  tags?: string[]
}

export interface Banner {
  id: number
  title?: string
  subtitle?: string
  badge?: string
  badge_color?: string
  image?: string
  link?: string
  button_text?: string
  category_tag?: string
  order?: number
}

export interface SearchSuggestion {
  id: number
  name: string
  slug: string
  sku?: string
  barcode?: string
  price: number
  compare_price?: number
  image?: string
  brand?: string
  category?: string
}

export interface PaginationMeta {
  total?: number
  per_page: number
  current_page?: number
  last_page?: number
  has_more: boolean
  next_page?: number | null
  next_cursor?: string | null
  prev_cursor?: string | null
  query?: string
  search_type?: string
  suggestions?: string[]
}

export interface InfinitePaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
  total?: number
  current_page?: number
  last_page?: number
}

