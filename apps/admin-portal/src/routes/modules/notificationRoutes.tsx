import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const NotificationListPage = React.lazy(() => import('@/pages/notifications/NotificationListPage'))
const NotificationTemplateListPage = React.lazy(() => import('@/pages/notifications/NotificationTemplateListPage'))
const NotificationSettingsPage = React.lazy(() => import('@/pages/notifications/NotificationSettingsPage'))

export const notificationRoutes = (
  <React.Fragment>
    <Route path="/notifications" element={<ProtectedRoute permission="notification.view"><NotificationListPage /></ProtectedRoute>} />
    <Route path="/notification-templates" element={<ProtectedRoute permission="notification.template.view"><NotificationTemplateListPage /></ProtectedRoute>} />
    <Route path="/notifications/settings" element={<ProtectedRoute permission="notification.view"><NotificationSettingsPage /></ProtectedRoute>} />
  </React.Fragment>
)
