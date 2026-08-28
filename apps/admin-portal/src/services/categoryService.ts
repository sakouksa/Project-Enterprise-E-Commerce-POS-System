import api from '@/api/client'

export const categoryService = {
  list: (params = {}) =>
    api.get('/categories', { params }).then(r => r.data),

  show: (id: number) =>
    api.get(`/categories/${id}`).then(r => r.data.data),

  create: (payload: { name: string; slug?: string; parent_id?: number | null; description?: string; status?: string }) =>
    api.post('/categories', payload).then(r => r.data.data),

  update: (id: number, payload: Record<string, unknown>) =>
    api.put(`/categories/${id}`, payload).then(r => r.data.data),

  delete: (id: number) =>
    api.delete(`/categories/${id}`).then(r => r.data),
}

export default categoryService
