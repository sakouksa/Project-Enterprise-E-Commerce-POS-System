import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const ChatbotManagementPage = React.lazy(() => import('@/pages/chatbot/ChatbotManagementPage'))

export const chatbotRoutes = (
  <Route path="/chatbot" element={<ProtectedRoute><ChatbotManagementPage /></ProtectedRoute>} />
)
