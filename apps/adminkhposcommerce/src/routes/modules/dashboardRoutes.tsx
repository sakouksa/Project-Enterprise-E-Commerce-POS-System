import React from 'react'
import { Route } from 'react-router-dom'

const DashboardPage = React.lazy(() => import('@/pages/dashboard/DashboardPage'))

export const dashboardRoutes = (
  <Route path="/dashboard" element={<DashboardPage />} />
)
