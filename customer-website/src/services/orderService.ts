import api from '@/api'

export const orderService = {
  /**
   * Track order by tracking number or order number
   */
  async trackOrder(orderNumber: string): Promise<any> {
    const res = await api.get(`/orders/track/${orderNumber}`)
    return res.data?.data || null
  },

  /**
   * Verify warranty by serial number
   */
  async checkWarranty(serialNumber: string): Promise<any> {
    const res = await api.get(`/warranty/check/${serialNumber}`)
    return res.data?.data || null
  },

  /**
   * Place checkout order
   */
  async createOrder(payload: any): Promise<any> {
    const res = await api.post('/checkout', payload)
    return res.data?.data || {}
  },
}

export default orderService
