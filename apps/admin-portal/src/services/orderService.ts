import api from '@/api/client'

export const orderService = {
  list: (params?: any) => api.get('/orders', { params }).then(r => r.data),
  show: (id: number | string) => api.get(`/orders/${id}`).then(r => r.data.data ?? r.data),
  create: (data: any) => api.post('/orders', data).then(r => r.data.data ?? r.data),
  update: (id: number | string, data: any) => api.put(`/orders/${id}`, data).then(r => r.data.data ?? r.data),
  delete: (id: number | string) => api.delete(`/orders/${id}`).then(r => r.data.data ?? r.data),
  updateStatus: (id: number | string, status: string) => api.put(`/orders/${id}/status`, { status }).then(r => r.data.data ?? r.data),
  export: (params?: any) => api.get('/orders/export', { params, responseType: 'blob' }).then(r => r.data),
}

export default orderService
