import api from '@/api/client'

export interface CustomerListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  group_id?: number | string
  gender?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export const customerService = {
  list: (params: CustomerListParams = {}) =>
    api.get('/customers', { params }).then((r) => r.data),

  show: (id: number | string) =>
    api.get(`/customers/${id}`).then((r) => r.data.data),

  create: (payload: Record<string, any>) =>
    api.post('/customers', payload).then((r) => r.data.data),

  update: (id: number | string, payload: Record<string, any>) =>
    api.put(`/customers/${id}`, payload).then((r) => r.data.data),

  delete: (id: number | string) =>
    api.delete(`/customers/${id}`).then((r) => r.data),

  groups: (params: Record<string, any> = {}) =>
    api.get('/customer-groups', { params }).then((r) => r.data),

  addresses: (customerId: number | string) =>
    api.get(`/customers/${customerId}/addresses`).then((r) => r.data.data),
}

export default customerService
