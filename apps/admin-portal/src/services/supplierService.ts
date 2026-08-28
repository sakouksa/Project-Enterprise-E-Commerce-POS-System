import api from '@/api/client'

export interface SupplierListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  country?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export const supplierService = {
  list: (params: SupplierListParams = {}) =>
    api.get('/suppliers', { params }).then((r) => r.data),

  show: (id: number | string) =>
    api.get(`/suppliers/${id}`).then((r) => r.data.data),

  create: (payload: Record<string, any>) =>
    api.post('/suppliers', payload).then((r) => r.data.data),

  update: (id: number | string, payload: Record<string, any>) =>
    api.put(`/suppliers/${id}`, payload).then((r) => r.data.data),

  delete: (id: number | string) =>
    api.delete(`/suppliers/${id}`).then((r) => r.data),
}

export default supplierService
