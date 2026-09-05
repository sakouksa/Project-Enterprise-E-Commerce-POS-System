import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const ProductsPage = React.lazy(() => import('@/pages/products/ProductsPage'))
const ProductFormPage = React.lazy(() => import('@/pages/products/ProductFormPage'))
const CategoriesPage = React.lazy(() => import('@/pages/categories/CategoriesPage'))
const BrandsPage = React.lazy(() => import('@/pages/brands/BrandsPage'))
const AttributesPage = React.lazy(() => import('@/pages/attributes/AttributesPage'))
const TaxesPage = React.lazy(() => import('@/pages/products/TaxesPage'))
const UnitsPage = React.lazy(() => import('@/pages/settings/UnitsPage'))

export const productRoutes = (
  <React.Fragment>
    <Route path="/products" element={<ProtectedRoute permission={['products.view', 'product.view']}><ProductsPage /></ProtectedRoute>} />
    <Route path="/products/create" element={<ProtectedRoute permission={['products.create', 'product.create']}><ProductFormPage /></ProtectedRoute>} />
    <Route path="/products/:id/edit" element={<ProtectedRoute permission={['products.edit', 'product.update', 'product.edit']}><ProductFormPage /></ProtectedRoute>} />
    <Route path="/products/edit/:id" element={<ProtectedRoute permission={['products.edit', 'product.update', 'product.edit']}><ProductFormPage /></ProtectedRoute>} />
    <Route path="/categories" element={<ProtectedRoute permission={['categories.view', 'category.view']}><CategoriesPage /></ProtectedRoute>} />
    <Route path="/brands" element={<ProtectedRoute permission={['brands.view', 'brand.view']}><BrandsPage /></ProtectedRoute>} />
    <Route path="/units" element={<ProtectedRoute permission={['units.view', 'unit.view']}><UnitsPage /></ProtectedRoute>} />
    <Route path="/taxes" element={<ProtectedRoute permission={['taxes.view', 'tax.view']}><TaxesPage /></ProtectedRoute>} />
    <Route path="/attributes" element={<ProtectedRoute permission={['attributes.view', 'attribute.view']}><AttributesPage /></ProtectedRoute>} />
  </React.Fragment>
)
