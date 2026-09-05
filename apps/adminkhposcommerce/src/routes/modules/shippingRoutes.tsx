import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const ShippingPage = React.lazy(() => import('@/pages/shipping/ShippingPage'))

export const shippingRoutes = (
  <Route path="/shipping" element={<ProtectedRoute permission="shipping.view"><ShippingPage /></ProtectedRoute>} />
)
