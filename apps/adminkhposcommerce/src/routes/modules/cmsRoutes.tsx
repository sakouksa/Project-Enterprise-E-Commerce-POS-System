import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const CMSPage = React.lazy(() => import('@/pages/cms/CMSPage'))
const BlogFormPage = React.lazy(() => import('@/pages/cms/BlogFormPage'))
const BannerFormPage = React.lazy(() => import('@/pages/marketing/BannerFormPage'))

export const cmsRoutes = (
  <React.Fragment>
    <Route path="/cms" element={<ProtectedRoute permission="cms.view"><CMSPage /></ProtectedRoute>} />
    <Route path="/cms/blogs/create" element={<ProtectedRoute permission="cms.create"><BlogFormPage /></ProtectedRoute>} />
    <Route path="/cms/blogs/:id/edit" element={<ProtectedRoute permission="cms.edit"><BlogFormPage /></ProtectedRoute>} />
    <Route path="/cms/blogs/edit/:id" element={<ProtectedRoute permission="cms.edit"><BlogFormPage /></ProtectedRoute>} />
    <Route path="/cms/banners/create" element={<ProtectedRoute permission="banners.create"><BannerFormPage /></ProtectedRoute>} />
    <Route path="/cms/banners/:id/edit" element={<ProtectedRoute permission="banners.edit"><BannerFormPage /></ProtectedRoute>} />
    <Route path="/cms/banners/edit/:id" element={<ProtectedRoute permission="banners.edit"><BannerFormPage /></ProtectedRoute>} />
    <Route path="/cms/create" element={<ProtectedRoute permission="cms.create"><BlogFormPage /></ProtectedRoute>} />
  </React.Fragment>
)
