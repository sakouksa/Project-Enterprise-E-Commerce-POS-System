import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const SettingsPage = React.lazy(() => import('@/pages/settings/SettingsPage'))
const ReviewsPage = React.lazy(() => import('@/pages/reviews/ReviewsPage'))
const ProfilePage = React.lazy(() => import('@/pages/profile/ProfilePage'))

export const settingsRoutes = (
  <React.Fragment>
    <Route path="/settings" element={<ProtectedRoute permission="settings.view"><SettingsPage /></ProtectedRoute>} />
    <Route path="/reviews" element={<ProtectedRoute permission="reviews.view"><ReviewsPage /></ProtectedRoute>} />
    <Route path="/profile" element={<ProfilePage />} />
  </React.Fragment>
)
