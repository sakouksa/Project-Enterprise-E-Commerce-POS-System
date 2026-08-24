import React, { useEffect } from 'react'
import { useStoreSettings } from '@/hooks/useStoreData'

export interface FaviconProviderProps {
  children: React.ReactNode
}

/**
 * FaviconProvider ensures the browser tab icon and search engine logo
 * dynamically synchronize with the authentic store logo / favicon.
 */
export const FaviconProvider: React.FC<FaviconProviderProps> = ({ children }) => {
  const { data: storeSettings } = useStoreSettings()

  useEffect(() => {
    const customFavicon = storeSettings?.favicon || storeSettings?.site_logo
    if (!customFavicon) return

    // Update or create SVG / ICO / PNG favicon link
    const iconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']")
    iconLinks.forEach((link) => {
      link.href = customFavicon
    })

    // Update Apple Touch Icon
    const appleTouchLink = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']")
    if (appleTouchLink) {
      appleTouchLink.href = customFavicon
    }
  }, [storeSettings?.favicon, storeSettings?.site_logo])

  return <>{children}</>
}

export default FaviconProvider
