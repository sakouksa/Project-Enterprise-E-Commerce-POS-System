import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Loader2, Sparkles } from 'lucide-react'
import { Breadcrumb } from '@/components/common'

interface ProductFormHeaderProps {
  isEdit: boolean
  productId: number | null
  productDetail: any
  isPending: boolean
  onSubmit: (e: React.FormEvent) => void
  activeTab?: string
  setActiveTab?: (tab: any) => void
}

export const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({
  isEdit,
  productDetail,
  isPending,
  onSubmit,
}) => {
  const { t } = useTranslation(['products', 'common'])
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Back Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Breadcrumb
            items={[
              { label: t('nav.products', 'Products'), href: '/products' },
              { label: isEdit ? (productDetail?.name || t('products.editProduct', 'Edit Product')) : t('products.addProduct', 'Add Product') },
            ]}
          />
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-xs"
              title={t('common.back', 'Back')}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {isEdit ? t('products.editProduct', 'Edit Product') : t('products.addProduct', 'Create New Product')}
                </h1>
                {isEdit && productDetail && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    productDetail.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}>
                    {productDetail.status === 'active' ? t('products.active', 'Active') : t('products.inactive', 'Inactive')}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isEdit
                  ? t('products.editSubtitle', 'Modify catalog pricing, specifications, inventory rules and variant matrix')
                  : t('products.createSubtitle', 'Configure new enterprise catalog item with multi-dimensional variants and smart pricing')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {t('common.cancel', 'Cancel')}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>{t('common.saving', 'Saving...')}</span>
              </>
            ) : (
              <>
                <Check size={15} />
                <span>{isEdit ? t('products.updateProduct', 'Save Changes') : t('products.saveProduct', 'Publish Product')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
