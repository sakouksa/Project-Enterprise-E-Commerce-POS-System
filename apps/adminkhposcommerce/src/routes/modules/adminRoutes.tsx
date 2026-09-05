import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const UsersPage = React.lazy(() => import('@/pages/users/UsersPage'))
const RolesPage = React.lazy(() => import('@/pages/roles/RolesPage'))
const PermissionsPage = React.lazy(() => import('@/pages/permissions/PermissionsPage'))
const ActivityLogsPage = React.lazy(() => import('@/pages/logs/ActivityLogsPage'))
const RecycleBinPage = React.lazy(() => import('@/pages/recycle-bin/RecycleBinPage'))

export const adminRoutes = (
  <React.Fragment>
    <Route path="/users" element={<ProtectedRoute permission="user.view"><UsersPage /></ProtectedRoute>} />
    <Route path="/roles" element={<ProtectedRoute permission="role.view"><RolesPage /></ProtectedRoute>} />
    <Route path="/permissions" element={<ProtectedRoute permission="permission.view"><PermissionsPage /></ProtectedRoute>} />
    <Route path="/activity-logs" element={<ProtectedRoute permission="activity_log.view"><ActivityLogsPage /></ProtectedRoute>} />
    <Route path="/recycle-bin" element={<ProtectedRoute permission="activity_log.view"><RecycleBinPage /></ProtectedRoute>} />
  </React.Fragment>
)
