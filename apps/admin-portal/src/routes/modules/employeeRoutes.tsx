import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const EmployeesPage = React.lazy(() => import('@/pages/employees/EmployeesPage'))
const EmployeeFormPage = React.lazy(() => import('@/pages/employees/EmployeeFormPage'))

export const employeeRoutes = (
  <React.Fragment>
    <Route path="/employees" element={<ProtectedRoute permission="employees.view"><EmployeesPage /></ProtectedRoute>} />
    <Route path="/employees/create" element={<ProtectedRoute permission="employees.create"><EmployeeFormPage /></ProtectedRoute>} />
    <Route path="/employees/:id/edit" element={<ProtectedRoute permission="employees.edit"><EmployeeFormPage /></ProtectedRoute>} />
    <Route path="/employees/edit/:id" element={<ProtectedRoute permission="employees.edit"><EmployeeFormPage /></ProtectedRoute>} />
  </React.Fragment>
)
