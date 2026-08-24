import api from '@/api/client'

export interface SalesListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  payment_status?: string
  channel?: string
  branch_id?: number | string
  customer_id?: number | string
  start_date?: string
  end_date?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export const salesService = {
  list: (params: SalesListParams = {}) =>
    api.get('/sales', { params }).then((r) => r.data),

  show: (id: number | string) =>
    api.get(`/sales/${id}`).then((r) => r.data.data),

  create: (payload: Record<string, any>) =>
    api.post('/sales', payload).then((r) => r.data.data),

  orders: (params: Record<string, any> = {}) =>
    api.get('/orders', { params }).then((r) => r.data),

  orderDetail: (id: number | string) =>
    api.get(`/orders/${id}`).then((r) => r.data.data),

  processRefund: (id: number | string, payload: Record<string, any>) =>
    api.post(`/sales/${id}/refund`, payload).then((r) => r.data.data),
}

export default salesService
