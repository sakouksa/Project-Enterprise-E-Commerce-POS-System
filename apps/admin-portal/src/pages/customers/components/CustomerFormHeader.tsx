import React from 'react'
import { useTranslation } from 'react-i18next'
import { User } from 'lucide-react'
import { FormHeader } from '@/components/common'

interface CustomerFormHeaderProps {
  isEdit: boolean
  customerName?: string
  isSubmitting: boolean
  onSubmit?: (e: React.FormEvent) => void
}

export const CustomerFormHeader: React.FC<CustomerFormHeaderProps> = ({
  isEdit,
  customerName,
  isSubmitting,
  onSubmit,
}) => {
  const { t } = useTranslation(['customers', 'common'])

  return (
    <FormHeader
      title={
        isEdit
          ? t('customers.editCustomerTitle', 'កែសម្រួលអតិថិជន: {{name}}', { name: customerName || '' })
          : t('customers.createCustomerTitle', 'បន្ថែមអតិថិជនថ្មី')
      }
      subtitle={t('customers.formSubtitle', 'គ្រប់គ្រង និងបំពេញព័ត៌មានអតិថិជនក្នុងប្រព័ន្ធ CRM')}
      icon={<User size={20} />}
      backPath="/customers"
      backLabel={t('common.back', 'ត្រឡប់ក្រោយ')}
      isSubmitting={isSubmitting}
      submitLabel={
        isEdit
          ? t('customers.saveChanges', 'រក្សាទុកការផ្លាស់ប្តូរ')
          : t('customers.saveCustomer', 'រក្សាទុកអតិថិជន')
      }
      onSubmit={onSubmit}
    />
  )
}

export default CustomerFormHeader

