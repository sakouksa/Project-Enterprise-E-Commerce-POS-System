import api from '@/api/client'

export const brandService = {
  list: (params = {}) =>
    api.get('/brands', { params }).then(r => r.data),

  show: (id: number) =>
    api.get(`/brands/${id}`).then(r => r.data.data),

  create: (payload: { name: string; slug?: string; description?: string; website?: string; is_active?: boolean }) =>
    api.post('/brands', payload).then(r => r.data.data),

  update: (id: number, payload: Record<string, unknown>) =>
    api.put(`/brands/${id}`, payload).then(r => r.data.data),

  delete: (id: number) =>
    api.delete(`/brands/${id}`).then(r => r.data),
}

export default brandService
