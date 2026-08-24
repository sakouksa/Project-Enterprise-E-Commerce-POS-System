import React, { useEffect, useState } from 'react'
import ProductCard from '@/components/ecommerce/ProductCard'
import EmptyState from '@/components/common/EmptyState'
import Spinner from '@/components/ui/Spinner'
import PageTransition from '@/components/common/PageTransition'
import SEOHead from '@/components/seo/SEOHead'
import wishlistService, { type WishlistItem } from '@/services/wishlistService'

export const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    wishlistService
      .getWishlist()
      .then((items) => setWishlist(items))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const seoElement = (
    <SEOHead
      title="My Wishlist"
      description="Saved products in your Enterprise Store wishlist."
      canonical="/wishlist"
      robots="noindex, follow"
    />
  )

  if (loading) {
    return (
      <>
        {seoElement}
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      </>
    )
  }

  return (
    <>
      {seoElement}
      <PageTransition className="container-site py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            My Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">Saved products to buy later</p>
        </div>

        {wishlist.length === 0 ? (
          <EmptyState variant="empty-wishlist" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {wishlist.map(
              (item) =>
                item.product && (
                  <ProductCard key={item.id} product={item.product} />
                )
            )}
          </div>
        )}
      </PageTransition>
    </>
  )
}

export default WishlistPage
