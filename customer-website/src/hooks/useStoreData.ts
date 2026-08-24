import { useQuery } from '@tanstack/react-query'
import { storeSettingsService, categoryService, brandService, productService } from '@/services'
import type { Category, Brand, StoreSettings, Banner } from '@/types/store'

/**
 * Global hook to fetch and cache Store Settings (logo, phone, hotlines, etc.)
 */
export const useStoreSettings = () => {
  return useQuery<StoreSettings>({
    queryKey: ['storefront', 'settings'],
    queryFn: () => storeSettingsService.getSettings(),
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  })
}

/**
 * Global hook to fetch and cache all Categories
 */
export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['storefront', 'categories'],
    queryFn: () => categoryService.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  })
}

/**
 * Global hook to fetch and cache all Official Brands
 */
export const useBrands = () => {
  return useQuery<Brand[]>({
    queryKey: ['storefront', 'brands'],
    queryFn: () => brandService.getBrands(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  })
}

/**
 * Global hook to fetch and cache Hero Banners
 */
export const useBanners = () => {
  return useQuery<Banner[]>({
    queryKey: ['storefront', 'banners'],
    queryFn: () => productService.getBanners(),
    staleTime: 5 * 60 * 1000,
  })
}
