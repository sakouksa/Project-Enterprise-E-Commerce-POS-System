import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const CustomersPage = React.lazy(() => import('@/pages/customers/CustomersPage'))
const CustomerFormPage = React.lazy(() => import('@/pages/customers/CustomerFormPage'))
const CustomerGroupsPage = React.lazy(() => import('@/pages/customers/CustomerGroupsPage'))

export const customerRoutes = (
  <React.Fragment>
    <Route path="/customers" element={<ProtectedRoute permission="customers.view"><CustomersPage /></ProtectedRoute>} />
    <Route path="/customers/create" element={<ProtectedRoute permission="customers.create"><CustomerFormPage /></ProtectedRoute>} />
    <Route path="/customers/:id/edit" element={<ProtectedRoute permission="customers.edit"><CustomerFormPage /></ProtectedRoute>} />
    <Route path="/customers/edit/:id" element={<ProtectedRoute permission="customers.edit"><CustomerFormPage /></ProtectedRoute>} />
    <Route path="/customers/groups" element={<ProtectedRoute permission="customers.view"><CustomerGroupsPage /></ProtectedRoute>} />
  </React.Fragment>
)
