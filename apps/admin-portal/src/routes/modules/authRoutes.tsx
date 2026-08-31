import React from 'react'
import { Route } from 'react-router-dom'
import { PublicRoute } from '../guards/PublicRoute'

const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'))

export const authRoutes = (
  <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
)
