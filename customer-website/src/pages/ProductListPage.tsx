import React, { useEffect, useState } from 'react'
import { useSearchParams, useParams, Link } from 'react-router-dom'
import { SlidersHorizontal, Grid, List, ChevronDown, X, Filter } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import Spinner from '@/components/ui/Spinner'
import api from '@/lib/api'

const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { slug } = useParams()

  const [products, setProducts]       = useState<any[]>([])
  const [categories, setCategories]   = useState<any[]>([])
  const [brands, setBrands]           = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const [total, setTotal]             = useState(0)
  const [lastPage, setLastPage]       = useState(1)
  const [viewMode, setViewMode]       = useState<'grid' | 'list'>('grid')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Filters state
  const sort        = searchParams.get('sort') || 'featured'
  const category    = slug || searchParams.get('category') || ''
  const brand       = searchParams.get('brand') || ''
  const search      = searchParams.get('search') || searchParams.get('q') || ''
  const minPrice    = searchParams.get('min_price') || ''
  const maxPrice    = searchParams.get('max_price') || ''
  const page        = Number(searchParams.get('page')) || 1

  useEffect(() => {
    // Fetch categories and brands for filter sidebar
    api.get('/categories').then(({ data }) => setCategories(data.data || [])).catch(() => {})
    api.get('/brands').then(({ data }) => setBrands(data.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    api.get('/products', {
      params: {
        sort,
        category,
        brand,
        search,
        min_price: minPrice,
        max_price: maxPrice,
        page,
        per_page: 12,
      }
    })
      .then(({ data }) => {
        setProducts(data.data || [])
        setTotal(data.pagination?.total || data.total || 0)
        setLastPage(data.pagination?.last_page || data.last_page || 1)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [sort, category, brand, search, minPrice, maxPrice, page])

  const updateParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams)
    if (val) next.set(key, val)
    else next.delete(key)
    next.set('page', '1')
    setSearchParams(next)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  return (
    <div className="container-site py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-900 dark:hover:text-white">Home</Link>
        <span>/</span>
        <span className="font-semibold text-gray-900 dark:text-white">Products</span>
        {category && (
          <>
            <span>/</span>
            <span className="capitalize">{category}</span>
          </>
        )}
      </div>

      {/* Title & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white font-display">
            {category ? `Category: ${category}` : search ? `Search results for "${search}"` : 'All Products'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">Showing {products.length} of {total} products</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="btn-secondary text-xs lg:hidden flex items-center gap-1.5"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Select */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="input py-2 text-xs pr-8 font-medium cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ── Filter Sidebar (Desktop) ────────────────────────────── */}
        <div className="hidden lg:block space-y-6">
          <div className="card p-5 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </h3>
              {(category || brand || search || minPrice || maxPrice) && (
                <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">
                  Reset All
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div>
              <h4 className="filter-group-title">Categories</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam('category', category === cat.slug ? '' : cat.slug)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex justify-between items-center transition-colors ${
                      category === cat.slug ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-gray-400">({cat.product_count || 0})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="filter-group-title">Price Range</h4>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="number"
                  placeholder="Min ($)"
                  value={minPrice}
                  onChange={(e) => updateParam('min_price', e.target.value)}
                  className="input py-1.5 text-xs"
                />
                <input
                  type="number"
                  placeholder="Max ($)"
                  value={maxPrice}
                  onChange={(e) => updateParam('max_price', e.target.value)}
                  className="input py-1.5 text-xs"
                />
              </div>
            </div>

            {/* Brands Filter */}
            {brands.length > 0 && (
              <div>
                <h4 className="filter-group-title">Brands</h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => updateParam('brand', brand === b.slug ? '' : b.slug)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex justify-between items-center transition-colors ${
                        brand === b.slug ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Product Grid Area ────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <div className="card p-12 text-center space-y-3">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">No products found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try adjusting your search query, price filter, or category selection to find what you're looking for.
              </p>
              <button onClick={clearFilters} className="btn-primary btn-sm mt-2">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4' : 'space-y-4'}>
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {[...Array(lastPage)].map((_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateParam('page', String(pageNum))}
                    className={`w-9 h-9 rounded-xl font-semibold text-xs transition-colors ${
                      page === pageNum
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductListPage
