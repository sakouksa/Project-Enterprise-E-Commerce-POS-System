import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import Spinner from '@/components/ui/Spinner'
import api from '@/lib/api'

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/wishlist')
      .then(({ data }) => setWishlist(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  return (
    <div className="container-site py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">
          My Wishlist ({wishlist.length})
        </h1>
        <p className="text-xs text-gray-500 mt-1">Saved products to buy later</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <Heart className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Your wishlist is empty</h3>
          <p className="text-xs text-gray-500">Explore our catalog and click the heart icon to save products.</p>
          <Link to="/products" className="btn-primary btn-sm">Explore Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {wishlist.map((item) => item.product && (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistPage
