import api from '@/api/client'

export interface PurchaseListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  payment_status?: string
  supplier_id?: number | string
  warehouse_id?: number | string
  start_date?: string
  end_date?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export const purchaseService = {
  list: (params: PurchaseListParams = {}) =>
    api.get('/purchases', { params }).then((r) => r.data),

  show: (id: number | string) =>
    api.get(`/purchases/${id}`).then((r) => r.data.data),

  create: (payload: Record<string, any>) =>
    api.post('/purchases', payload).then((r) => r.data.data),

  update: (id: number | string, payload: Record<string, any>) =>
    api.put(`/purchases/${id}`, payload).then((r) => r.data.data),

  delete: (id: number | string) =>
    api.delete(`/purchases/${id}`).then((r) => r.data),

  returns: (params: Record<string, any> = {}) =>
    api.get('/purchases/returns', { params }).then((r) => r.data),

  receiveShipment: (id: number | string, payload: Record<string, any>) =>
    api.post(`/purchases/${id}/receive`, payload).then((r) => r.data.data),

  recordPayment: (id: number | string, payload: Record<string, any>) =>
    api.post(`/purchases/${id}/payment`, payload).then((r) => r.data.data),
}

export default purchaseService
