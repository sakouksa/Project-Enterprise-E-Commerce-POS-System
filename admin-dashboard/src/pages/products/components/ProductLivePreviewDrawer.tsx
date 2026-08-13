import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, X, Star, ShoppingBag, ShieldCheck, Check, Truck } from 'lucide-react'
import { getAbsoluteImageUrl } from '@/utils/image'

interface ProductLivePreviewDrawerProps {
  isOpen: boolean
  onClose: () => void
  form: any
  productDetail: any
  categories: any[]
  brands: any[]
  createImagePreviews: any[]
}

export const ProductLivePreviewDrawer: React.FC<ProductLivePreviewDrawerProps> = ({
  isOpen,
  onClose,
  form,
  productDetail,
  categories,
  brands,
  createImagePreviews,
}) => {
  const { t } = useTranslation(['products', 'common'])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)

  // Collect all display images
  const allImages: string[] = []
  if (createImagePreviews && createImagePreviews.length > 0) {
    createImagePreviews.forEach(p => allImages.push(p.url))
  }
  if (productDetail?.images && productDetail.images.length > 0) {
    productDetail.images.forEach((img: any) => allImages.push(getAbsoluteImageUrl(img.url || img.image)))
  }
  if (allImages.length === 0) {
    allImages.push('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80')
  }

  const categoryName = categories?.find(c => String(c.id) === String(form.category_id))?.name || productDetail?.category?.name || 'Category'
  const brandName = brands?.find(b => String(b.id) === String(form.brand_id))?.name || productDetail?.brand?.name || 'Brand'
  const variants: any[] = productDetail?.variants || []

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-card w-full max-w-md border-l border-border h-full flex flex-col justify-between shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/70 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Eye size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{t('products.livePreviewTitle', 'Live Storefront Preview')}</h3>
                  <p className="text-[11px] text-muted-foreground">{t('products.livePreviewSub', 'Interactive customer shopping view')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {/* Product Hero Image */}
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden border border-border bg-muted/20 aspect-square relative shadow-xs">
                  <img
                    src={allImages[selectedImageIndex] || allImages[0]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {form.is_featured && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {allImages.map((src, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          selectedImageIndex === idx ? 'border-primary shadow-xs' : 'border-border opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={src} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Meta & Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                  <span className="text-primary">{brandName}</span>
                  <span>·</span>
                  <span>{categoryName}</span>
                </div>
                <h2 className="text-base font-bold text-foreground leading-snug">
                  {form.name || 'Product Title'}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-extrabold text-primary font-mono">
                    ${Number(form.selling_price || 0).toFixed(2)}
                  </span>
                  {form.compare_price && Number(form.compare_price) > Number(form.selling_price) && (
                    <span className="text-xs text-muted-foreground line-through font-mono">
                      ${Number(form.compare_price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Short Description */}
              {form.short_description && (
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {form.short_description}
                </p>
              )}

              {/* Variants Selector */}
              {variants.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <span className="font-bold text-foreground text-xs block">Available Options:</span>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v: any) => {
                      const isSelected = selectedVariantId === v.id
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                              : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <span>{v.name}</span>
                          <span className="ml-1 opacity-80">(${Number(v.selling_price || 0).toFixed(2)})</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Value Badges */}
              <div className="p-4 bg-muted/20 rounded-2xl border border-border/60 space-y-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-primary shrink-0" />
                  <span>100% Genuine Enterprise Certified Product</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-primary shrink-0" />
                  <span>Instant POS & Fast Warehouse Dispatch</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 transition-opacity cursor-pointer text-center"
              >
                {t('common.close', 'Close Preview')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
