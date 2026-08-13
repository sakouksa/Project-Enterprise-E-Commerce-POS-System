import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, Star, Edit2 } from 'lucide-react'
import { getAbsoluteImageUrl } from '@/utils/image'
import type { Product } from '../types/productsPage.types'

interface ProductDetailDrawerProps {
  product: Product | null
  onClose: () => void
  onEdit: (product: Product) => void
  formatCurrency: (val: number) => string
}

export const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({
  product,
  onClose,
  onEdit,
  formatCurrency,
}) => {
  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end print:static print:bg-transparent">
          <div className="absolute inset-0 print:hidden" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="bg-card w-full max-w-xl h-full shadow-2xl relative z-10 p-6 flex flex-col justify-between overflow-y-auto print:static print:w-full print:p-0 print:shadow-none"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 print:hidden">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Package size={18} className="text-primary" />
                  <span>Product Details</span>
                </h3>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              {/* Product Header */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-purple-500/10 border border-blue-500/20 flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center border border-primary/20 shrink-0 overflow-hidden">
                  {product.primary_image?.image ? (
                    <img src={getAbsoluteImageUrl(product.primary_image.image)} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={32} />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-foreground">{product.name}</h2>
                  <p className="text-xs font-mono font-bold text-primary tracking-wider mt-0.5">SKU: {product.sku}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      product.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                      {product.status}
                    </span>
                    {product.is_featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1">
                        <Star size={10} fill="currentColor" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b pb-1">Pricing & Inventory</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Selling Price</p>
                    <p className="font-bold text-emerald-600 text-lg">{formatCurrency(product.selling_price)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cost Price</p>
                    <p className="font-semibold text-foreground">{product.cost_price ? formatCurrency(product.cost_price) : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock On Hand</p>
                    <p className="font-semibold text-foreground">{product.stock ?? 0} units</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-semibold text-foreground">{product.category?.name || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Brand</p>
                    <p className="font-semibold text-foreground">{product.brand?.name || 'Unbranded'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Unit</p>
                    <p className="font-semibold text-foreground">{product.unit?.name || 'PCS'}</p>
                  </div>
                </div>

                {product.description && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p className="text-xs text-foreground bg-muted/40 p-3 rounded-xl border border-border">{product.description}</p>
                  </div>
                )}

                <div className="pt-3 flex gap-2">
                  <button
                    onClick={() => { onClose(); onEdit(product); }}
                    className="flex-1 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:opacity-90 flex items-center justify-center gap-1.5"
                  >
                    <Edit2 size={14} />
                    <span>Edit Product</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-end print:hidden">
              <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-muted hover:bg-muted/80 text-foreground rounded-xl border border-border">
                Close Drawer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ProductDetailDrawer
