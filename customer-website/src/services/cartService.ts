import api from '@/api'

export interface CartPayloadItem {
  product_id: number
  variant_id?: number | null
  quantity: number
}

export const cartService = {
  /**
   * Fetch current active cart
   */
  async getCart(): Promise<any> {
    const res = await api.get('/cart')
    return res.data?.data || {}
  },

  /**
   * Add or sync items into cart
   */
  async addItem(item: CartPayloadItem): Promise<any> {
    const res = await api.post('/cart/items', item)
    return res.data?.data || {}
  },

  /**
   * Update quantity of an item
   */
  async updateQuantity(itemId: number, quantity: number): Promise<any> {
    const res = await api.put(`/cart/items/${itemId}`, { quantity })
    return res.data?.data || {}
  },

  /**
   * Remove item from cart
   */
  async removeItem(itemId: number): Promise<any> {
    const res = await api.delete(`/cart/items/${itemId}`)
    return res.data?.data || {}
  },

  /**
   * Apply coupon code
   */
  async applyCoupon(code: string): Promise<any> {
    const res = await api.post('/cart/coupon', { code })
    return res.data?.data || {}
  },

  /**
   * Clear applied coupon
   */
  async removeCoupon(): Promise<any> {
    const res = await api.delete('/cart/coupon')
    return res.data?.data || {}
  },
}

export default cartService
