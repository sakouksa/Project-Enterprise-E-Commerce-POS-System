import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const CompanyPage = React.lazy(() => import('@/pages/company/CompanyPage'))

export const companyRoutes = (
  <React.Fragment>
    <Route path="/branches" element={<ProtectedRoute permission="company.view"><CompanyPage activeTab="branches" /></ProtectedRoute>} />
    <Route path="/stores" element={<ProtectedRoute permission="company.view"><CompanyPage activeTab="stores" /></ProtectedRoute>} />
    <Route path="/company" element={<ProtectedRoute permission="company.view"><CompanyPage activeTab="companies" /></ProtectedRoute>} />
  </React.Fragment>
)
