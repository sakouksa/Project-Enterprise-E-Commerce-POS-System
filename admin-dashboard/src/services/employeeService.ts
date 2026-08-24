import api from '@/api/client'

export interface EmployeeListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  department_id?: number | string
  designation_id?: number | string
  branch_id?: number | string
  sort?: string
  order?: 'asc' | 'desc'
}

export const employeeService = {
  list: (params: EmployeeListParams = {}) =>
    api.get('/employees', { params }).then((r) => r.data),

  show: (id: number | string) =>
    api.get(`/employees/${id}`).then((r) => r.data.data),

  create: (payload: Record<string, any>) =>
    api.post('/employees', payload).then((r) => r.data.data),

  update: (id: number | string, payload: Record<string, any>) =>
    api.put(`/employees/${id}`, payload).then((r) => r.data.data),

  delete: (id: number | string) =>
    api.delete(`/employees/${id}`).then((r) => r.data),

  departments: (params: Record<string, any> = {}) =>
    api.get('/departments', { params }).then((r) => r.data),

  designations: (params: Record<string, any> = {}) =>
    api.get('/designations', { params }).then((r) => r.data),

  attendances: (params: Record<string, any> = {}) =>
    api.get('/attendances', { params }).then((r) => r.data),

  leaves: (params: Record<string, any> = {}) =>
    api.get('/leaves', { params }).then((r) => r.data),

  payrolls: (params: Record<string, any> = {}) =>
    api.get('/payrolls', { params }).then((r) => r.data),
}

export default employeeService
