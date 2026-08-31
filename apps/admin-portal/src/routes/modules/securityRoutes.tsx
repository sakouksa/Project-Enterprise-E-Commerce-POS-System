import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const SecurityOverviewDashboard = React.lazy(() => import('@/pages/security/SecurityOverviewDashboard'))
const DeviceManagementPage = React.lazy(() => import('@/pages/security/DeviceManagementPage'))
const SecuritySettingsPage = React.lazy(() => import('@/pages/security/SecuritySettingsPage'))

export const securityRoutes = (
  <React.Fragment>
    <Route path="/security" element={<ProtectedRoute><SecurityOverviewDashboard /></ProtectedRoute>} />
    <Route path="/security/overview" element={<ProtectedRoute><SecurityOverviewDashboard /></ProtectedRoute>} />
    <Route path="/security/devices" element={<ProtectedRoute><DeviceManagementPage /></ProtectedRoute>} />
    <Route path="/security/settings" element={<ProtectedRoute permission="settings.view"><SecuritySettingsPage /></ProtectedRoute>} />
  </React.Fragment>
)
