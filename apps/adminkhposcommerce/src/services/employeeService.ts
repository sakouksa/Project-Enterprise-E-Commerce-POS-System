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
  reporting_to_id?: number | string
  is_driver?: boolean | string
  is_pos_supervisor?: boolean | string
  is_fulfillment_picker?: boolean | string
  driver_status?: string
  contract_type?: string
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

  stats: () =>
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

  // ─── LEAVE MANAGEMENT ─────────────────────────────────────────────────────
  leaveRequests: (params: Record<string, any> = {}) =>
    api.get('/leave-requests', { params }).then((r) => r.data),

  createLeaveRequest: (payload: any) =>
    api.post('/leave-requests', payload).then((r) => r.data.data ?? r.data),

  approveLeave: (id: number | string, payload: { manager_notes?: string } = {}) =>
    api.post(`/leave-requests/${id}/approve`, payload).then((r) => r.data.data ?? r.data),

  rejectLeave: (id: number | string, payload: { manager_notes: string }) =>
    api.post(`/leave-requests/${id}/reject`, payload).then((r) => r.data.data ?? r.data),

  getLeaveBalance: (employeeId: number | string, year?: number) =>
    api.get(`/leave-balances/${employeeId}`, { params: { year } }).then((r) => r.data.data ?? r.data),

  deleteLeaveRequest: (id: number | string) =>
    api.delete(`/leave-requests/${id}`).then((r) => r.data),

  // ─── PAYROLL MANAGEMENT ───────────────────────────────────────────────────
  payrolls: (params: Record<string, any> = {}) =>
    api.get('/payrolls', { params }).then((r) => r.data),

  autoGeneratePayroll: (payload: { period_month: string; company_id?: number; branch_id?: number }) =>
    api.post('/payrolls/auto-generate', payload).then((r) => r.data.data ?? r.data),

  getPayslip: (id: number | string) =>
    api.get(`/payrolls/${id}/payslip`).then((r) => r.data.data ?? r.data),

  exportAbaBulk: async (periodMonth: string) => {
    const res = await api.get('/payrolls/export-aba-bulk', {
      params: { period_month: periodMonth },
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `ABA_Bulk_Payroll_${periodMonth}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

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

  getItemsByTab: (tab: string, params: any = {}) => {
    if (tab === 'leaves') {
      return api.get('/leave-requests', { params }).then((r) => r.data)
    }
    return api.get(`/${tab}`, { params }).then((r) => r.data)
  },

  createItemByTab: (tab: string, payload: any) => {
    if (tab === 'leaves') {
      return api.post('/leave-requests', payload).then((r) => r.data.data ?? r.data)
    }
    return api.post(`/${tab}`, payload).then((r) => r.data.data ?? r.data)
  },

  updateItemByTab: (tab: string, id: number | string, payload: any) => {
    if (tab === 'leaves') {
      return api.put(`/leave-requests/${id}`, payload).then((r) => r.data.data ?? r.data)
    }
    return api.put(`/${tab}/${id}`, payload).then((r) => r.data.data ?? r.data)
  },

  deleteItemByTab: (tab: string, id: number | string) => {
    if (tab === 'leaves') {
      return api.delete(`/leave-requests/${id}`).then((r) => r.data)
    }
    return api.delete(`/${tab}/${id}`).then((r) => r.data)
  },
}

export default employeeService
