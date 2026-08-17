import React from 'react'
import { useTranslation } from 'react-i18next'
import { Eye } from 'lucide-react'
import { FormHeader } from '@/components/common'

interface ProductFormHeaderProps {
  isEdit: boolean
  productId: number | null
  productDetail: any
  isPending: boolean
  onSubmit: (e: React.FormEvent) => void
  onOpenLivePreview?: () => void
}

export const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({
  isEdit,
  productDetail,
  isPending,
  onSubmit,
  onOpenLivePreview,
}) => {
  const { t } = useTranslation(['products', 'common', 'nav'])

  const statusBadge = isEdit && productDetail ? (
    <span
      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${
        productDetail.status === 'active' || productDetail.is_active
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
          : 'bg-muted text-muted-foreground border-border'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          productDetail.status === 'active' || productDetail.is_active ? 'bg-emerald-500' : 'bg-muted-foreground'
        }`}
      />
      {productDetail.status === 'active' || productDetail.is_active
        ? t('products.active', 'សកម្ម')
        : t('products.inactive', 'អសកម្ម')}
    </span>
  ) : undefined

  const livePreviewAction = onOpenLivePreview ? (
    <button
      type="button"
      onClick={onOpenLivePreview}
      className="h-9 px-3.5 sm:px-4 rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted text-xs sm:text-[13px] font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer active:scale-95"
      title={t('products.livePreview', t('common.livePreview', 'ពិនិត្យមើលផ្ទាល់'))}
    >
      <Eye size={14} />
      <span>{t('products.livePreview', t('common.livePreview', 'ពិនិត្យមើលផ្ទាល់'))}</span>
    </button>
  ) : undefined

  return (
    <FormHeader
      isEdit={isEdit}
      title={
        isEdit
          ? (productDetail?.name
              ? t('products.editProductTitle', 'កែសម្រួលទំនិញ: {{name}}', { name: productDetail.name })
              : t('products.editProduct', 'កែសម្រួលទំនិញ'))
          : t('products.addProduct', 'បន្ថែមទំនិញថ្មី')
      }
      subtitle={
        isEdit
          ? t('products.editSubtitle', 'ធ្វើបច្ចុប្បន្នភាពគុណលក្ខណៈ តម្លៃ ស្តុក និងរូបភាពទំនិញ')
          : t('products.formSubtitle', 'កំណត់លក្ខណៈសម្បត្តិទំនិញ តម្លៃ វិធានស្តុក និងរូបភាពមេឌា')
      }
      statusBadge={statusBadge}
      breadcrumbs={[
        { label: t('nav.products', 'ផលិតផល'), path: '/products' },
        {
          label: isEdit
            ? t('products.editProduct', 'កែសម្រួលទំនិញ')
            : t('products.addProduct', 'បន្ថែមថ្មី'),
        },
      ]}
      backPath="/products"
      backLabel={t('common.back', 'ត្រឡប់ក្រោយ')}
      isSubmitting={isPending}
      submitLabel={isEdit ? t('products.saveChanges', 'រក្សាទុកការផ្លាស់ប្តូរ') : t('products.createProduct', 'បង្កើតទំនិញ')}
      onSubmit={onSubmit}
      extraActions={livePreviewAction}
    />
  )
}

export default ProductFormHeader
