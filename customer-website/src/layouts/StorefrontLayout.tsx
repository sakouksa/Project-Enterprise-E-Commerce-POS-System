import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'
import { useCartStore } from '@/stores/cartStore'
import api from '@/lib/api'

const StorefrontLayout: React.FC = () => {
  const setCart = useCartStore((s) => s.setCart)

  // Fetch initial cart on mount
  useEffect(() => {
    api.get('/cart')
      .then(({ data }) => {
        if (data?.data) {
          setCart(data.data)
        }
      })
      .catch(() => {
        // Silently fail
      })
  }, [setCart])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

export default StorefrontLayout
