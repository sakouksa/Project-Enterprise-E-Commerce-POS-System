import React, { useState } from 'react'
import { Plus, Heart, Info, Sparkles, Tag, Layers, AlertTriangle } from 'lucide-react'
import type { Product } from '../types'
import { sound } from '@/utils/sound'

interface POSProductCardProps {
  product: Product
  onAddToCart: (p: Product) => void
  onOpenDetails: (p: Product) => void
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}

export const POSProductCard: React.FC<POSProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetails,
  isFavorite,
  onToggleFavorite,
}) => {
  const [imgError, setImgError] = useState(false)

  // Resolve product image
  const fallbackImg = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80'

  const getImageUrl = (): string => {
    if (imgError) return fallbackImg
    if (typeof product.primary_image === 'string' && product.primary_image) return product.primary_image
    if (typeof product.primary_image === 'object' && product.primary_image?.url) return product.primary_image.url
    if (product.images && product.images.length > 0 && product.images[0]?.url) return product.images[0].url
    return fallbackImg
  }

  const stock = product.stock ?? 50
  const isOutOfStock = stock <= 0
  const isLowStock = stock > 0 && stock <= (product.low_stock_threshold ?? 5)
  const imageUrl = getImageUrl()

  const handleAddClick = () => {
    if (isOutOfStock) {
      sound.playError()
    } else {
      sound.playSuccess()
      onAddToCart(product)
    }
  }

  return (
    <div className={`bg-card hover:bg-accent/40 border border-border/80 hover:border-primary/40 rounded-2xl p-3 flex flex-col justify-between transition-all duration-200 group relative shadow-xs hover:shadow-md ${
      isOutOfStock ? 'opacity-70 grayscale-[0.3]' : ''
    }`}>

      {/* Top Badges & Favorite Heart */}
      <div className="flex items-center justify-between gap-1 mb-2 z-10">
        <div className="flex flex-wrap gap-1">
          {product.compare_price && product.compare_price > product.selling_price && (
            <span className="px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-black uppercase flex items-center gap-0.5 shadow-xs">
              <Tag size={10} /> Sale
            </span>
          )}
          {product.is_featured && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-black uppercase flex items-center gap-0.5 shadow-xs">
              <Sparkles size={10} /> Featured
            </span>
          )}
          {product.has_variants && (
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[9px] font-extrabold flex items-center gap-0.5">
              <Layers size={10} /> Variants
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            sound.playClick()
            onToggleFavorite(product.id)
          }}
          className={`p-1.5 rounded-full transition-colors ${
            isFavorite
              ? 'text-rose-500 bg-rose-500/10'
              : 'text-muted-foreground hover:text-rose-500 hover:bg-muted'
          }`}
          title="Toggle Favorite"
        >
          <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Image Display */}
      <div
        onClick={() => {
          sound.playClick()
          onOpenDetails(product)
        }}
        className="relative w-full h-32 rounded-xl overflow-hidden bg-muted/30 mb-2 cursor-pointer group-hover:scale-[1.02] transition-transform duration-300 border border-border/40"
      >
        <img
          src={imageUrl}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Stock status overlay pill */}
        <div className="absolute bottom-2 left-2 z-10">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[10px] shadow-sm">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-extrabold text-[10px] shadow-sm">
              Low: {stock} left
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[10px]">
              Stock: {stock}
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-1">
        <h4
          onClick={() => {
            sound.playClick()
            onOpenDetails(product)
          }}
          className="font-bold text-xs text-foreground line-clamp-2 leading-snug hover:text-primary transition-colors cursor-pointer"
        >
          {product.name}
        </h4>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <span>SKU: {product.sku}</span>
          {product.category && <span className="font-sans font-medium text-[10px] bg-muted px-1.5 py-0.2 rounded truncate max-w-[80px]">{product.category.name}</span>}
        </div>
      </div>

      {/* Price & Add to Cart Button */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/60">
        <div>
          <div className="font-black text-sm text-primary flex items-baseline gap-1">
            ${product.selling_price?.toFixed(2)}
            {product.compare_price && product.compare_price > product.selling_price && (
              <span className="text-[10px] text-muted-foreground line-through font-normal">
                ${product.compare_price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddClick}
          disabled={isOutOfStock}
          className="btn-primary p-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs hover:scale-105 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
          title="Quick Add to Cart"
        >
          <Plus size={15} />
          <span className="font-bold hidden sm:inline text-[11px]">Add</span>
        </button>
      </div>
    </div>
  )
}
