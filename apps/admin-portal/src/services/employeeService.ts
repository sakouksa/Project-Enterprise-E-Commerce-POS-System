import api from '@/api/client'

export interface EmployeeListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  department_id?: number | string
  designation_id?: number | string
  position_id?: number | string
  branch_id?: number | string
  sort?: string
  order?: 'asc' | 'desc'
  [key: string]: any
}

export const employeeService = {
  list: (params: EmployeeListParams = {}) =>
    api.get('/employees', { params }).then((r) => r.data),

  show: (id: number | string) =>
    api.get(`/employees/${id}`).then((r) => r.data.data ?? r.data),

  create: (payload: Record<string, any>) =>
    api.post('/employees', payload).then((r) => r.data.data ?? r.data),

  update: (id: number | string, payload: Record<string, any>) =>
    api.put(`/employees/${id}`, payload).then((r) => r.data.data ?? r.data),

  delete: (id: number | string) =>
    api.delete(`/employees/${id}`).then((r) => r.data),

  getStats: () =>
    api.get('/employees/stats').then((r) => r.data.data ?? r.data),

  departments: (params: Record<string, any> = {}) =>
    api.get('/departments', { params }).then((r) => r.data),

  positions: (params: Record<string, any> = {}) =>
    api.get('/positions', { params }).then((r) => r.data),

  designations: (params: Record<string, any> = {}) =>
    api.get('/designations', { params }).then((r) => r.data),

  shifts: (params: Record<string, any> = {}) =>
    api.get('/shifts', { params }).then((r) => r.data),

  createShift: (payload: any) =>
    api.post('/shifts', payload).then((r) => r.data.data ?? r.data),

  updateShift: (id: number | string, payload: any) =>
    api.put(`/shifts/${id}`, payload).then((r) => r.data.data ?? r.data),

  deleteShift: (id: number | string) =>
    api.delete(`/shifts/${id}`).then((r) => r.data),

  attendances: (params: Record<string, any> = {}) =>
    api.get('/attendances', { params }).then((r) => r.data),

  generateQr: (payload: any) =>
    api.post('/attendances/generate-qr', payload).then((r) => r.data.data ?? r.data),

  leaves: (params: Record<string, any> = {}) =>
    api.get('/leaves', { params }).then((r) => r.data),

  payrolls: (params: Record<string, any> = {}) =>
    api.get('/payrolls', { params }).then((r) => r.data),

  uploadPhoto: (formData: FormData) =>
    api.post('/employees/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  bulkDelete: (tab: string, ids: number[]) =>
    api.post(`/${tab}/bulk-delete`, { ids }).then((r) => r.data),

  importData: (tab: string, formData: FormData) =>
    api.post(`/${tab}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  getItemsByTab: (tab: string, params: any = {}) =>
    api.get(`/${tab}`, { params }).then((r) => r.data),

  createItemByTab: (tab: string, payload: any) =>
    api.post(`/${tab}`, payload).then((r) => r.data.data ?? r.data),

  updateItemByTab: (tab: string, id: number | string, payload: any) =>
    api.put(`/${tab}/${id}`, payload).then((r) => r.data.data ?? r.data),

  deleteItemByTab: (tab: string, id: number | string) =>
    api.delete(`/${tab}/${id}`).then((r) => r.data),
}

export default employeeService
