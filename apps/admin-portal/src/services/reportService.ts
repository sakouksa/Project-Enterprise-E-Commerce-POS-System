import api from '@/api/client'

export const reportService = {
  salesSummary: (params: Record<string, any> = {}) =>
    api.get('/reports/sales', { params }).then((r) => r.data),

  inventorySummary: (params: Record<string, any> = {}) =>
    api.get('/reports/inventory', { params }).then((r) => r.data),

  purchaseSummary: (params: Record<string, any> = {}) =>
    api.get('/reports/purchases', { params }).then((r) => r.data),

  exportReport: (type: 'sales' | 'inventory' | 'purchases', format: 'csv' | 'pdf' = 'csv', params: Record<string, any> = {}) =>
    api.get(`/reports/${type}/export`, {
      params: { ...params, format },
      responseType: 'blob',
    }),
}

export default reportService
