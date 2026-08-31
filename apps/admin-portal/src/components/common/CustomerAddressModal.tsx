import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  MapPin, Home, Building2, Package, Tag, Check,
  Store, Building, Factory, Hotel, Landmark, ShieldCheck, Sparkles, X
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import EnterpriseModal from './EnterpriseModal'
import ModalFooter from './ModalFooter'
import { formatPhoneNumber } from '@/utils/formatters'

export interface CustomerAddress {
  id?: number
  customer_id: number | string
  customer?: { id?: number; name: string; email?: string; phone?: string }
  label: 'Home' | 'Office' | 'Warehouse' | 'Other' | string
  name: string
  phone: string
  address: string
  city: string
  province: string
  country: string
  postal_code: string
  latitude?: number | string
  longitude?: number | string
  is_default: boolean
  created_at?: string
}

export interface AddressFormData {
  customer_id: string
  label: string
  name: string
  phone: string
  address: string
  city: string
  province: string
  country: string
  postal_code: string
  is_default: boolean
}

export interface CustomerAddressModalProps {
  /** Whether the modal is visible */
  isOpen: boolean
  /** Close callback */
  onClose: () => void
  /** Existing address data to edit, or null/undefined to create new */
  initialData?: CustomerAddress | null
  /** Optional customer ID to lock address to a specific customer */
  customerId?: number | string
  /** Optional customer name to display when customerId is locked */
  customerName?: string
  /** Callback fired after successfully creating or updating an address */
  onSuccess?: (address: CustomerAddress) => void
  /** Optional extra CSS classes for modal container */
  className?: string
}

const PRESET_TYPES = [
  {
    value: 'Home',
    icon: Home,
    labelKey: 'customers.labelHome',
    defaultLabel: 'Home',
    activeBg: 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 dark:bg-blue-500/20 ring-2 ring-blue-500/20'
  },
  {
    value: 'Office',
    icon: Building2,
    labelKey: 'customers.labelOffice',
    defaultLabel: 'Office',
    activeBg: 'bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400 dark:bg-purple-500/20 ring-2 ring-purple-500/20'
  },
  {
    value: 'Warehouse',
    icon: Package,
    labelKey: 'customers.labelWarehouse',
    defaultLabel: 'Warehouse',
    activeBg: 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 dark:bg-amber-500/20 ring-2 ring-amber-500/20'
  },
  {
    value: 'Other',
    icon: Tag,
    labelKey: 'customers.labelOther',
    defaultLabel: 'Other',
    activeBg: 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 dark:bg-rose-500/20 ring-2 ring-rose-500/20'
  },
] as const

const QUICK_SUGGESTIONS = [
  { key: 'labelStore', defaultLabel: 'Store', icon: Store },
  { key: 'labelBranch', defaultLabel: 'Branch', icon: Building },
  { key: 'labelCondo', defaultLabel: 'Condo', icon: Building2 },
  { key: 'labelVilla', defaultLabel: 'Villa', icon: Home },
  { key: 'labelFactory', defaultLabel: 'Factory', icon: Factory },
  { key: 'labelHotel', defaultLabel: 'Hotel', icon: Hotel },
  { key: 'labelApartment', defaultLabel: 'Apartment', icon: Landmark },
  { key: 'labelHQ', defaultLabel: 'HQ', icon: ShieldCheck },
]

export const CustomerAddressModal: React.FC<CustomerAddressModalProps> = ({
  isOpen,
  onClose,
  initialData,
  customerId,
  customerName,
  onSuccess,
  className = '',
}) => {
  const { t } = useTranslation(['customers', 'common'])
  const toast = useToast()
  const qc = useQueryClient()
  const [selectedPreset, setSelectedPreset] = useState<'Home' | 'Office' | 'Warehouse' | 'Other'>('Home')
  const [customLabel, setCustomLabel] = useState('')

  const isEdit = Boolean(initialData?.id)

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    defaultValues: {
      customer_id: customerId ? String(customerId) : '',
      label: 'Home',
      name: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      country: 'Cambodia',
      postal_code: '',
      is_default: false,
    },
  })

  const currentCustomerId = watch('customer_id')

  // Fetch customers if not pre-locked
  const { data: customers = [] } = useQuery({
    queryKey: ['all-customers-select'],
    queryFn: async () => {
      const res = await api.get('/customers', { params: { per_page: 200 } })
      return res.data?.data?.data || res.data?.data || res.data || []
    },
    enabled: isOpen && !customerId,
    staleTime: 5 * 60 * 1000,
  })

  // Populate form values on open or when initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const rawLabel = initialData.label || 'Home'
        const isPreset = ['Home', 'Office', 'Warehouse'].includes(rawLabel)

        if (isPreset) {
          setSelectedPreset(rawLabel as any)
          setCustomLabel('')
        } else {
          setSelectedPreset('Other')
          setCustomLabel(rawLabel === 'Other' ? '' : rawLabel)
        }

        reset({
          customer_id: String(initialData.customer_id || customerId || ''),
          label: rawLabel,
          name: initialData.name || '',
          phone: initialData.phone || '',
          address: initialData.address || '',
          city: initialData.city || '',
          province: initialData.province || '',
          country: initialData.country || 'Cambodia',
          postal_code: initialData.postal_code || '',
          is_default: Boolean(initialData.is_default),
        })
      } else {
        setSelectedPreset('Home')
        setCustomLabel('')
        reset({
          customer_id: customerId ? String(customerId) : '',
          label: 'Home',
          name: '',
          phone: '',
          address: '',
          city: '',
          province: '',
          country: 'Cambodia',
          postal_code: '',
          is_default: false,
        })
      }
    }
  }, [isOpen, initialData, customerId, reset])

  // Extract friendly error message
  const extractErrorMessage = (err: any, defaultMsg: string) => {
    const serverErrors = err.response?.data?.errors
    let msg = err.response?.data?.message || defaultMsg
    if (serverErrors && typeof serverErrors === 'object') {
      const firstKey = Object.keys(serverErrors)[0]
      if (firstKey && Array.isArray(serverErrors[firstKey]) && serverErrors[firstKey][0]) {
        msg = `${msg}: ${serverErrors[firstKey][0]}`
      }
    }
    return msg
  }

  // Save / Update Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/customer-addresses', payload),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['customer-addresses'] })
      qc.invalidateQueries({ queryKey: ['customers'] })
      toast.success(t('customers.addressCreatedSuccess', t('common.savedSuccessfully', 'Address saved successfully!')))
      if (onSuccess) {
        onSuccess(res.data?.data || res.data)
      }
      onClose()
    },
    onError: (err: any) => {
      toast.error(extractErrorMessage(err, t('common.errorOccurred', 'Failed to save address')))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.put(`/customer-addresses/${id}`, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['customer-addresses'] })
      qc.invalidateQueries({ queryKey: ['customers'] })
      toast.success(t('customers.addressUpdatedSuccess', t('common.savedSuccessfully', 'Address updated successfully!')))
      if (onSuccess) {
        onSuccess(res.data?.data || res.data)
      }
      onClose()
    },
    onError: (err: any) => {
      toast.error(extractErrorMessage(err, t('common.errorOccurred', 'Failed to update address')))
    },
  })

  // Submit Handler
  const onSubmit = async (data: AddressFormData) => {
    const finalLabel = selectedPreset === 'Other'
      ? (customLabel.trim() || 'Other')
      : selectedPreset

    const payload = {
      customer_id: Number(data.customer_id),
      label: finalLabel,
      name: data.name.trim(),
      phone: data.phone.trim(),
      address: data.address.trim(),
      city: data.city.trim(),
      province: data.province.trim(),
      country: data.country.trim() || 'Cambodia',
      postal_code: data.postal_code.trim(),
      latitude: initialData?.latitude ? Number(initialData.latitude) : null,
      longitude: initialData?.longitude ? Number(initialData.longitude) : null,
      is_default: Boolean(data.is_default),
    }

    if (isEdit && initialData?.id) {
      await updateMutation.mutateAsync({ id: initialData.id, data: payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
  }

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending

  // Find resolved customer name if pre-locked or selected
  const resolvedCustomerName =
    customerName ||
    (customerId
      ? undefined
      : (customers as any[]).find((c) => String(c.id) === String(currentCustomerId))?.name)

  const inputCls =
    'w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/60 dark:placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium dark:[color-scheme:dark]'
  const labelCls =
    'block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5'

  return (
    <EnterpriseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEdit
          ? t('customers.editAddressTitle', t('customers.editAddress', 'Edit Delivery Address'))
          : t('customers.addAddressTitle', t('customers.addAddress', 'Add Delivery Address'))
      }
      subtitle={t(
        'customers.addressModalSubtitle',
        'Manage delivery address and recipient contact details'
      )}
      icon={<MapPin size={20} />}
      iconVariant="emerald"
      size="2xl"
      className={className}
      footer={
        <ModalFooter
          onCancel={onClose}
          isSubmitting={isSaving}
          isEdit={isEdit}
          submitLabel={
            isEdit
              ? t('customers.saveChanges', 'Save Changes')
              : t('customers.saveAddress', 'Save Address')
          }
          submitIcon={<Check size={14} strokeWidth={2.5} />}
          onSubmit={handleSubmit(onSubmit)}
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-6 space-y-4">
        {/* ─── Customer Selection ─── */}
        <div>
          {customerId ? (
            <div>
              <label className={labelCls}>
                {t('customers.customer', 'Customer')}
              </label>
              <div className="flex items-center h-10 px-3.5 rounded-lg border border-border/80 dark:border-slate-700/80 bg-muted/30 dark:bg-slate-800/60 text-foreground dark:text-slate-200 text-xs sm:text-[13px] font-semibold">
                <span className="truncate">{resolvedCustomerName || `Customer #${customerId}`}</span>
              </div>
            </div>
          ) : (
            <div>
              <label className={labelCls}>
                {t('customers.customer', 'Customer')} <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('customer_id', {
                  required: t('customers.validation.customerRequired', 'Customer is required'),
                })}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="">{t('customers.selectCustomer', '-- Select Customer --')}</option>
                {(customers ?? []).map((c: any) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name} {c.phone ? `(${c.phone})` : ''}
                  </option>
                ))}
              </select>
              {errors.customer_id && (
                <p className="text-rose-500 text-[11px] mt-1 font-medium">
                  {errors.customer_id.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ─── Address Label Selection & Custom Format ─── */}
        <div className="p-4 bg-muted/20 dark:bg-slate-900/60 border border-border/80 dark:border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground dark:text-slate-200">
              {t('customers.addressLabel', 'Address Label')} <span className="text-rose-500">*</span>
            </label>
            {selectedPreset === 'Other' && (
              <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                {customLabel.trim() ? customLabel : t('customers.labelOther', 'Other')}
              </span>
            )}
          </div>

          {/* 4 Main Preset Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_TYPES.map((type) => {
              const IconComponent = type.icon
              const isSelected = selectedPreset === type.value
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(type.value as any)
                    if (type.value !== 'Other') {
                      setValue('label', type.value)
                    } else {
                      setValue('label', customLabel.trim() || 'Other')
                    }
                  }}
                  className={`h-10 px-3 rounded-xl border text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer select-none active:scale-98 ${
                    isSelected
                      ? `${type.activeBg} font-bold shadow-xs`
                      : 'border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900 text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white hover:bg-muted/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <IconComponent size={14} className={isSelected ? 'text-current shrink-0' : 'opacity-70 shrink-0'} />
                  <span className="truncate">{t(type.labelKey, type.defaultLabel)}</span>
                </button>
              )
            })}
          </div>

          {/* Other / Custom Label Input & Suggestions */}
          {selectedPreset === 'Other' && (
            <div className="pt-2 border-t border-border/60 dark:border-slate-800 space-y-2.5 animate-in fade-in slide-in-from-top-1">
              <div>
                <label className="block text-[11px] font-semibold text-foreground/80 dark:text-slate-300 mb-1">
                  {t('customers.customAddressLabel', 'Custom Label Name')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customLabel}
                    onChange={(e) => {
                      setCustomLabel(e.target.value)
                      setValue('label', e.target.value.trim() || 'Other')
                    }}
                    placeholder={t('customers.customAddressLabelPlaceholder', 'e.g. Villa, Branch Store, Condo, Factory...')}
                    className="w-full h-9 px-3 pr-8 text-xs sm:text-[13px] rounded-lg border border-rose-300 dark:border-rose-900/60 bg-background dark:bg-slate-900 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-rose-500/30 font-medium"
                    autoFocus
                  />
                  {customLabel && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomLabel('')
                        setValue('label', 'Other')
                      }}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Suggestions Chips */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground dark:text-slate-400">
                  <Sparkles size={12} className="text-amber-500 shrink-0" />
                  <span>{t('customers.customLabelSuggestions', 'Quick suggestions:')}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SUGGESTIONS.map((sug) => {
                    const translatedSug = t(`customers.${sug.key}`, sug.defaultLabel)
                    const isChipSelected =
                      customLabel.trim().toLowerCase() === translatedSug.toLowerCase() ||
                      customLabel.trim().toLowerCase() === sug.defaultLabel.toLowerCase()
                    const Icon = sug.icon
                    return (
                      <button
                        key={sug.key}
                        type="button"
                        onClick={() => {
                          setCustomLabel(translatedSug)
                          setValue('label', translatedSug)
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer active:scale-95 ${
                          isChipSelected
                            ? 'bg-rose-500 text-white shadow-2xs font-semibold'
                            : 'bg-background dark:bg-slate-900 hover:bg-rose-500/10 text-foreground/80 dark:text-slate-300 border border-border/80 dark:border-slate-700 hover:border-rose-500/30'
                        }`}
                      >
                        <Icon size={12} className={isChipSelected ? 'text-white' : 'text-rose-500 shrink-0'} />
                        <span>{translatedSug}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Recipient Name & Phone Number ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>
              {t('customers.receiverName', 'Recipient Name')} <span className="text-rose-500">*</span>
            </label>
            <input
              {...register('name', {
                required: t('customers.validation.receiverNameRequired', 'Recipient name is required'),
              })}
              placeholder={t('customers.receiverNamePlaceholder', 'e.g. Sok Chantha')}
              className={inputCls}
            />
            {errors.name && (
              <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              {t('customers.phone', 'Phone Number')} <span className="text-rose-500">*</span>
            </label>
            <input
              {...register('phone', {
                required: t('customers.validation.phoneRequired', 'Phone number is required'),
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  e.target.value = e.target.value.replace(/[^\d+ -]/g, '')
                },
              })}
              type="tel"
              inputMode="tel"
              placeholder="012 345 678"
              className={`${inputCls} font-mono`}
            />
            {errors.phone && (
              <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* ─── Street Address ─── */}
        <div>
          <label className={labelCls}>
            {t('customers.streetAddress', 'Street Address')} <span className="text-rose-500">*</span>
          </label>
          <input
            {...register('address', {
              required: t('customers.validation.addressRequired', 'Street address is required'),
            })}
            placeholder={t('customers.streetAddressPlaceholder', 'e.g. #123 St. 456, Sangkat Boeung Keng Kang 1')}
            className={inputCls}
          />
          {errors.address && (
            <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.address.message}</p>
          )}
        </div>

        {/* ─── City, Province, Postal Code (Spacious Clean 3-column Grid) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Hidden Country field for background auto-save */}
          <input type="hidden" {...register('country')} />

          <div>
            <label className={labelCls}>
              {t('customers.city', 'City')} <span className="text-rose-500">*</span>
            </label>
            <input
              {...register('city', {
                required: t('customers.validation.cityRequired', 'City is required'),
              })}
              placeholder={t('customers.cityPlaceholder', 'e.g. Phnom Penh')}
              className={inputCls}
            />
            {errors.city && (
              <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              {t('customers.province', 'Province')} <span className="text-rose-500">*</span>
            </label>
            <input
              {...register('province', {
                required: t('customers.validation.provinceRequired', 'Province is required'),
              })}
              placeholder={t('customers.provincePlaceholder', 'Phnom Penh')}
              className={inputCls}
            />
            {errors.province && (
              <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.province.message}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              {t('customers.postalCode', 'Postal Code')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              {...register('postal_code', {
                required: t('customers.validation.postalCodeRequired', 'Postal code is required'),
                onChange: (e: any) => {
                  e.target.value = e.target.value.replace(/[^0-9a-zA-Z-]/g, '')
                }
              })}
              placeholder={t('customers.postalCodePlaceholder', '12000')}
              className={`${inputCls} font-mono`}
            />
            {errors.postal_code && (
              <p className="text-rose-500 text-[11px] mt-1 font-medium">
                {errors.postal_code.message}
              </p>
            )}
          </div>
        </div>

        {/* ─── Default Address Toggle Card ─── */}
        <div className="p-4 bg-muted/15 dark:bg-slate-900/60 border border-border/80 dark:border-slate-800 rounded-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <label
              htmlFor="isDefaultAddressCheckbox"
              className="text-xs sm:text-[13px] font-bold text-foreground dark:text-slate-100 cursor-pointer select-none block"
            >
              {t('customers.setDefault', 'Set as Default Address')}
            </label>
            <p className="text-[11px] text-muted-foreground dark:text-slate-400">
              {t(
                'customers.defaultAddressHelp',
                'Use this address as primary default for orders and POS deliveries'
              )}
            </p>
          </div>
          <input
            type="checkbox"
            id="isDefaultAddressCheckbox"
            {...register('is_default')}
            className="form-checkbox h-5 w-5 text-primary rounded border-border focus:ring-primary cursor-pointer"
          />
        </div>
      </form>
    </EnterpriseModal>
  )
}

export default CustomerAddressModal
