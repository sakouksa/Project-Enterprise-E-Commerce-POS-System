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
          ? t('customers.editCustomerTitle', 'Edit Customer: {{name}}', { name: customerName || '' })
          : t('customers.createCustomerTitle', 'Add New Customer')
      }
      subtitle={t('customers.formSubtitle', 'Manage and complete customer profile in CRM')}
      icon={<User size={20} />}
      backPath="/customers"
      backLabel={t('common.back', 'Back')}
      isSubmitting={isSubmitting}
      submitLabel={
        isEdit
          ? t('customers.saveChanges', 'Save Changes')
          : t('customers.saveCustomer', 'Save Customer')
      }
      onSubmit={onSubmit}
    />
  )
}

export default CustomerFormHeader

