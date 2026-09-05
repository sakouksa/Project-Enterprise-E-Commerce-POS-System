import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const POSPage = React.lazy(() => import('@/pages/pos/POSPage'))
const SalesPage = React.lazy(() => import('@/pages/sales/SalesPage'))
const OrdersPage = React.lazy(() => import('@/pages/orders/OrdersPage'))

export const salesRoutes = (
  <React.Fragment>
    <Route path="/pos" element={<ProtectedRoute permission="pos.access"><POSPage /></ProtectedRoute>} />
    <Route path="/sales" element={<ProtectedRoute permission="sales.view"><SalesPage /></ProtectedRoute>} />
    <Route path="/orders" element={<ProtectedRoute permission="orders.view"><OrdersPage /></ProtectedRoute>} />
  </React.Fragment>
)
