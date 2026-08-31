import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const ReportsPage = React.lazy(() => import('@/pages/reports/ReportsPage'))
const SalesReportPage = React.lazy(() => import('@/pages/reports/SalesReportPage'))
const PurchaseReportPage = React.lazy(() => import('@/pages/reports/PurchaseReportPage'))

export const reportRoutes = (
  <React.Fragment>
    <Route path="/reports" element={<ProtectedRoute permission="reports.view"><ReportsPage type="sales" /></ProtectedRoute>} />
    <Route path="/reports/sales" element={<ProtectedRoute permission="reports.view"><SalesReportPage /></ProtectedRoute>} />
    <Route path="/reports/purchase" element={<ProtectedRoute permission="reports.view"><PurchaseReportPage /></ProtectedRoute>} />
    <Route path="/reports/purchases" element={<ProtectedRoute permission="reports.view"><PurchaseReportPage /></ProtectedRoute>} />
    <Route path="/reports/inventory" element={<ProtectedRoute permission="reports.view"><ReportsPage type="inventory" /></ProtectedRoute>} />
    <Route path="/reports/profit-loss" element={<ProtectedRoute permission="reports.view"><ReportsPage type="profit-loss" /></ProtectedRoute>} />
  </React.Fragment>
)
