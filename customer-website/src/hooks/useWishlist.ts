import { useState, useCallback } from 'react'
import { useWishlistStore } from '@/stores'
import wishlistService from '@/services/wishlistService'

export function useWishlist() {
  const { items, addItem, removeItem, has } = useWishlistStore()
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const isWishlisted = useCallback(
    (productId: number) => has(productId),
    [has]
  )

  const toggleWishlist = useCallback(
    async (productId: number, e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }

      setLoadingId(productId)
      const currentlySaved = has(productId)

      // Optimistic state update
      if (currentlySaved) {
        removeItem(productId)
      } else {
        addItem(productId)
      }

      try {
        if (currentlySaved) {
          await wishlistService.removeFromWishlist(productId)
        } else {
          await wishlistService.addToWishlist(productId)
        }
      } catch {
        // Revert on failure
        if (currentlySaved) {
          addItem(productId)
        } else {
          removeItem(productId)
        }
      } finally {
        setLoadingId(null)
      }
    },
    [has, addItem, removeItem]
  )

  return {
    wishlistItems: items,
    wishlistCount: items.length,
    isWishlisted,
    toggleWishlist,
    loadingId,
  }
}

export default useWishlist
