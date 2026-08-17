import React from 'react'
import { useTranslation } from 'react-i18next'
import { Truck, Eye } from 'lucide-react'
import { FormHeader } from '@/components/common'
import type { Supplier } from '../types/supplier.types'

interface SupplierFormHeaderProps {
  isEdit: boolean
  supplierId: number | null
  supplierDetail: Supplier | null
  isPending: boolean
  onSubmit: (e: React.FormEvent) => void
  onOpenLivePreview?: () => void
}

export const SupplierFormHeader: React.FC<SupplierFormHeaderProps> = ({
  isEdit,
  supplierDetail,
  isPending,
  onSubmit,
  onOpenLivePreview,
}) => {
  const { t } = useTranslation(['suppliers', 'common', 'nav'])

  const statusBadge = isEdit && supplierDetail ? (
    <span
      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${
        supplierDetail.is_active
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
          : 'bg-muted text-muted-foreground border-border'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${supplierDetail.is_active ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
      {supplierDetail.is_active ? t('suppliers.active', 'សកម្ម') : t('suppliers.inactive', 'អសកម្ម')}
    </span>
  ) : undefined

  const livePreviewAction = onOpenLivePreview ? (
    <button
      type="button"
      onClick={onOpenLivePreview}
      className="h-9 px-3.5 sm:px-4 rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted text-xs sm:text-[13px] font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer active:scale-95"
      title={t('suppliers.livePreview', 'ពិនិត្យមើលផ្ទាល់')}
    >
      <Eye size={14} />
      <span>{t('suppliers.livePreview', 'ពិនិត្យមើលផ្ទាល់')}</span>
    </button>
  ) : undefined

  return (
    <FormHeader
      isEdit={isEdit}
      title={
        isEdit
          ? t('suppliers.editSupplierTitle', 'កែសម្រួលអ្នកផ្គត់ផ្គង់: {{name}}', { name: supplierDetail?.name || '' })
          : t('suppliers.createSupplierTitle', 'បន្ថែមអ្នកផ្គត់ផ្គង់ថ្មី')
      }
      subtitle={
        isEdit
          ? t('suppliers.editSubtitle', 'ធ្វើបច្ចុប្បន្នភាពទម្រង់ និងព័ត៌មានអ្នកផ្គត់ផ្គង់')
          : t('suppliers.createSubtitle', 'បំពេញព័ត៌មានដើម្បីចុះឈ្មោះអ្នកផ្គត់ផ្គង់ថ្មីក្នុងប្រព័ន្ធ')
      }
      icon={<Truck size={20} />}
      statusBadge={statusBadge}
      breadcrumbs={[
        { label: t('nav.purchases', t('common.purchases', 'ការទិញទំនិញ')), path: '/purchases' },
        { label: t('suppliers.title', t('nav.suppliers', 'អ្នកផ្គត់ផ្គង់')), path: '/suppliers' },
        {
          label: isEdit
            ? t('suppliers.editSupplier', 'កែសម្រួលអ្នកផ្គត់ផ្គង់')
            : t('suppliers.addSupplier', 'បន្ថែមថ្មី'),
        },
      ]}
      backPath="/suppliers"
      backLabel={t('common.back', 'ត្រឡប់ក្រោយ')}
      isSubmitting={isPending}
      submitLabel={isEdit ? t('suppliers.saveChanges', 'រក្សាទុកការផ្លាស់ប្តូរ') : t('suppliers.addSupplier', 'បង្កើតអ្នកផ្គត់ផ្គង់')}
      onSubmit={onSubmit}
      extraActions={livePreviewAction}
    />
  )
}

export default SupplierFormHeader
