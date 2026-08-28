import api from '@/api/client'

export const inventoryService = {
  list: (params = {}) =>
    api.get('/inventory', { params }).then(r => r.data),

  show: (id: number) =>
    api.get(`/inventory/${id}`).then(r => r.data.data),

  lowStock: (params = {}) =>
    api.get('/inventory/low-stock', { params }).then(r => r.data),

  byProduct: (productId: number) =>
    api.get(`/inventory/product/${productId}`).then(r => r.data.data),

  // Stock Adjustments
  listAdjustments: (params = {}) =>
    api.get('/stock-adjustments', { params }).then(r => r.data),

  createAdjustment: (payload: { warehouse_id: number; product_id: number; type: string; quantity: number; reason?: string }) =>
    api.post('/stock-adjustments', payload).then(r => r.data.data),

  approveAdjustment: (id: number) =>
    api.post(`/stock-adjustments/${id}/approve`).then(r => r.data),

  // Stock Transfers
  listTransfers: (params = {}) =>
    api.get('/stock-transfers', { params }).then(r => r.data),

  createTransfer: (payload: {
    source_warehouse_id: number
    destination_warehouse_id: number
    transfer_date: string
    notes?: string
    items: { product_id: number; quantity: number }[]
  }) => api.post('/stock-transfers', payload).then(r => r.data.data),

  shipTransfer: (id: number) =>
    api.post(`/stock-transfers/${id}/ship`).then(r => r.data),

  receiveTransfer: (id: number) =>
    api.post(`/stock-transfers/${id}/receive`).then(r => r.data),

  // Stock Opnames (Physical Inventory count)
  listOpnames: (params = {}) =>
    api.get('/stock-opnames', { params }).then(r => r.data),

  createOpname: (payload: {
    warehouse_id: number
    opname_date: string
    notes?: string
    items: { product_id: number; counted_quantity: number }[]
  }) => api.post('/stock-opnames', payload).then(r => r.data.data),

  completeOpname: (id: number) =>
    api.post(`/stock-opnames/${id}/complete`).then(r => r.data),
}

export default inventoryService
