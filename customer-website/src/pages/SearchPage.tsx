import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import Spinner from '@/components/ui/Spinner'
import api from '@/lib/api'

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) { setResults([]); setLoading(false); return }
    setLoading(true)
    api.get('/search', { params: { q: query } })
      .then(({ data }) => setResults(data.data?.results || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="container-site py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">
          Search Results for "{query}"
        </h1>
        <p className="text-xs text-gray-500 mt-1">Found {results.length} matching products</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : results.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <Search className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-lg">No results found</h3>
          <p className="text-xs text-gray-500">Try searching for keywords like "phone", "shirt", or "chair".</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {results.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage
