import React, { useState } from 'react'
import { X, ShoppingCart, Tag, ShieldCheck, Check, Layers, Barcode, Warehouse } from 'lucide-react'
import type { Product, ProductVariant } from '../types'

interface POSProductDetailModalProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (p: Product, variant?: ProductVariant, imei?: string) => void
}

export const POSProductDetailModal: React.FC<POSProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  )
  const [imei, setImei] = useState('')
  const [activeImgIndex, setActiveImgIndex] = useState(0)

  const images = product.images && product.images.length > 0
    ? product.images.map(i => i.url)
    : [typeof product.primary_image === 'string' ? product.primary_image : product.primary_image?.url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80']

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, imei.trim() || undefined)
    onClose()
  }

  const getVariantPrice = (v?: ProductVariant): number => {
    if (!v || !v.selling_price || v.selling_price <= 0) return product.selling_price
    if (v.selling_price > product.selling_price * 10) return product.selling_price
    return v.selling_price
  }

  const currentPrice = getVariantPrice(selectedVariant)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span>SKU: {product.sku}</span>
              {product.barcode && <span>• Barcode: {product.barcode}</span>}
            </div>
            <h2 className="text-lg font-black text-foreground">{product.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Image Gallery */}
        <div className="space-y-2">
          <div className="w-full h-48 rounded-2xl bg-muted/20 border border-border/60 flex items-center justify-center p-3 overflow-hidden">
            <img
              src={images[activeImgIndex] || '/placeholder-product.svg'}
              alt={product.name}
              className="max-h-full object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-12 h-12 rounded-xl border p-1 bg-muted/20 flex-shrink-0 transition-all ${
                    activeImgIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-border opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Variants Selector */}
        {product.has_variants && product.variants && product.variants.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Layers size={14} className="text-primary" /> Select Variant
            </label>
            <div className="grid grid-cols-2 gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedVariant?.id === v.id
                      ? 'border-primary bg-primary/10 font-bold text-primary shadow-xs'
                      : 'border-border bg-card hover:bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{v.sku}</span>
                    {selectedVariant?.id === v.id && <Check size={14} />}
                  </div>
                  <div className="font-extrabold mt-1">${getVariantPrice(v).toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* IMEI / Serial Number Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Barcode size={14} className="text-primary" /> Serial Number / IMEI (Optional)
          </label>
          <input
            type="text"
            value={imei}
            onChange={(e) => setImei(e.target.value)}
            placeholder="Scan or enter device IMEI / S/N..."
            className="form-input text-xs font-mono"
          />
        </div>

        {/* Inventory & Meta Info */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-muted/30 border border-border/60 text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px]">Available Stock</span>
            <span className="font-bold text-foreground flex items-center gap-1">
              <Warehouse size={12} className="text-emerald-500" />
              {product.stock ?? 50} units
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Unit Tax / VAT</span>
            <span className="font-bold text-foreground flex items-center gap-1">
              <ShieldCheck size={12} className="text-primary" />
              10% Standard
            </span>
          </div>
        </div>

        {/* Add to Cart Action Footer */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Selected Price</span>
            <span className="text-xl font-black text-primary">${currentPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={handleAdd}
            className="btn-primary py-3 px-6 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md cursor-pointer"
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>

      </div>
    </div>
  )
}
