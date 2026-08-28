import api from '@/api/client'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProductListParams {
  page?:        number
  per_page?:    number
  search?:      string
  status?:      string
  category_id?: number | string
  brand_id?:    number | string
  is_featured?: boolean
  sort?:        string
  order?:       'asc' | 'desc'
}

export interface ProductPayload {
  company_id?:          number
  name:                 string
  sku:                  string
  barcode?:             string | null
  category_id?:         number | null
  brand_id?:            number | null
  unit_id?:             number | null
  tax_id?:              number | null
  description?:         string | null
  short_description?:   string | null
  cost_price?:          number | null
  selling_price:        number
  compare_price?:       number | null
  weight?:              number | null
  length?:              number | null
  width?:               number | null
  height?:              number | null
  has_variants?:        boolean
  variants?:            any[]
  track_inventory?:     boolean
  low_stock_threshold?: number
  status:               string
  is_featured?:         boolean
  is_digital?:          boolean
  meta_title?:          string | null
  meta_description?:    string | null
  meta_keywords?:       string | null
}

// ─── Product CRUD ─────────────────────────────────────────────────────────────

export const productService = {
  /** GET /products — paginated list */
  list: (params: ProductListParams = {}) =>
    api.get('/products', { params }).then(r => r.data),

  /** GET /products/:id — full detail with relations */
  show: (id: number) =>
    api.get(`/products/${id}`).then(r => r.data.data),

  /** POST /products */
  create: (payload: ProductPayload) =>
    api.post('/products', payload).then(r => r.data.data),

  /** PUT /products/:id */
  update: (id: number, payload: Partial<ProductPayload>) =>
    api.put(`/products/${id}`, payload).then(r => r.data.data),

  /** DELETE /products/:id */
  delete: (id: number) =>
    api.delete(`/products/${id}`).then(r => r.data),

  // ── Images ──────────────────────────────────────────────────────────────────

  /** POST /products/:id/images  (multipart) */
  uploadImages: (productId: number, files: File[], primaryIndex = 0) => {
    const fd = new FormData()
    files.forEach(f => fd.append('images[]', f))
    fd.append('primary_index', String(primaryIndex))
    return api.post(`/products/${productId}/images`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },

  /** POST /product-images */
  createImage: (data: { product_id: number; image: string; alt_text?: string; is_primary?: boolean; sort_order?: number }) =>
    api.post('/product-images', data).then(r => r.data),

  /** DELETE /products/:productId/images/:imageId */
  deleteImage: (productId: number, imageId: number) =>
    api.delete(`/products/${productId}/images/${imageId}`).then(r => r.data),

  /** PUT /product-images/:id — set primary or sort_order */
  updateImage: (imageId: number, data: { is_primary?: boolean; sort_order?: number }) =>
    api.put(`/product-images/${imageId}`, data).then(r => r.data),

  // ── Variants ─────────────────────────────────────────────────────────────────

  /** GET /products/:id/variants */
  getVariants: (productId: number) =>
    api.get(`/products/${productId}/variants`).then(r => r.data.data ?? []),

  /** POST /product-variants */
  createVariant: (payload: {
    product_id: number; name: string; sku?: string
    cost_price?: number; selling_price: number; is_active?: boolean; attribute_values?: number[]
  }) => api.post('/product-variants', payload).then(r => r.data.data),

  /** PUT /product-variants/:id */
  updateVariant: (variantId: number, payload: {
    name?: string; sku?: string; cost_price?: number; selling_price?: number
    compare_price?: number; barcode?: string; is_active?: boolean; attribute_values?: number[]
  }) => api.put(`/product-variants/${variantId}`, payload).then(r => r.data.data),

  /** DELETE /product-variants/:id */
  deleteVariant: (variantId: number) =>
    api.delete(`/product-variants/${variantId}`).then(r => r.data),

  /** POST /product-variants/bulk-delete */
  bulkDeleteVariants: (ids: number[]) =>
    api.post('/product-variants/bulk-delete', { ids }).then(r => r.data),

  // ── Tiered Prices ─────────────────────────────────────────────────────────────

  /** POST /product-prices */
  createPrice: (payload: {
    product_id: number; price_type: string
    min_qty: number; price: number; currency_code?: string
    start_date?: string; end_date?: string
  }) => api.post('/product-prices', payload).then(r => r.data.data),

  /** DELETE /product-prices/:id */
  deletePrice: (priceId: number) =>
    api.delete(`/product-prices/${priceId}`).then(r => r.data),
}

export default productService
