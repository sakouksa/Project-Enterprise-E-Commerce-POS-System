import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  MapPin, User, Home, Building2, Phone, UserCheck, Navigation,
  Globe, Compass, Tag, Package, LocateFixed, Loader2, Check,
  Store, Building, Factory, Hotel, Landmark, ShieldCheck, Sparkles, X
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import EnterpriseModal from './EnterpriseModal'
import ModalFooter from './ModalFooter'
import { MapLocationPickerModal } from './MapLocationPickerModal'

export interface CustomerAddress {
  id?: number
  customer_id: number | string
  customer?: { id?: number; name: string }
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
  latitude: string
  longitude: string
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
  const { t, i18n } = useTranslation(['customers', 'common'])
  const isKhmer = i18n.language === 'km'
  const toast = useToast()
  const qc = useQueryClient()
  const [isLocating, setIsLocating] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<'Home' | 'Office' | 'Warehouse' | 'Other'>('Home')
  const [customLabel, setCustomLabel] = useState('')
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false)
  const [showManualCoords, setShowManualCoords] = useState(false)

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
      latitude: '',
      longitude: '',
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
          latitude: initialData.latitude !== undefined && initialData.latitude !== null ? String(initialData.latitude) : '',
          longitude: initialData.longitude !== undefined && initialData.longitude !== null ? String(initialData.longitude) : '',
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
          latitude: '',
          longitude: '',
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
      country: data.country.trim(),
      postal_code: data.postal_code.trim(),
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      is_default: Boolean(data.is_default),
    }

    if (isEdit && initialData?.id) {
      await updateMutation.mutateAsync({ id: initialData.id, data: payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
  }

const CAMBODIA_CITY_COORDINATES: Record<string, { lat: string; lng: string }> = {
  'phnom penh': { lat: '11.556400', lng: '104.928200' },
  'ភ្នំពេញ': { lat: '11.556400', lng: '104.928200' },
  'kampong thom': { lat: '12.711126', lng: '104.888735' },
  'កំពង់ធំ': { lat: '12.711126', lng: '104.888735' },
  'siem reap': { lat: '13.367100', lng: '103.844800' },
  'សៀមរាប': { lat: '13.367100', lng: '103.844800' },
  'battambang': { lat: '13.095700', lng: '103.202200' },
  'បាត់ដំបង': { lat: '13.095700', lng: '103.202200' },
  'sihanoukville': { lat: '10.627500', lng: '103.522100' },
  'ព្រះសីហនុ': { lat: '10.627500', lng: '103.522100' },
  'kampong cham': { lat: '11.992400', lng: '105.464500' },
  'កំពង់ចាម': { lat: '11.992400', lng: '105.464500' },
  'kampot': { lat: '10.610400', lng: '104.181500' },
  'កំពត': { lat: '10.610400', lng: '104.181500' },
  'kandal': { lat: '11.455200', lng: '104.945000' },
  'កណ្តាល': { lat: '11.455200', lng: '104.945000' },
  'banteay meanchey': { lat: '13.585900', lng: '102.973700' },
  'បន្ទាយមានជ័យ': { lat: '13.585900', lng: '102.973700' },
  'poipet': { lat: '13.656100', lng: '102.562500' },
  'ប៉ោយប៉ែត': { lat: '13.656100', lng: '102.562500' },
  'takeo': { lat: '10.990800', lng: '104.784900' },
  'តាកែវ': { lat: '10.990800', lng: '104.784900' },
  'prey veng': { lat: '11.485100', lng: '105.325300' },
  'ព្រៃវែង': { lat: '11.485100', lng: '105.325300' },
  'svay rieng': { lat: '11.087800', lng: '105.799300' },
  'ស្វាយរៀង': { lat: '11.087800', lng: '105.799300' },
  'pursat': { lat: '12.538800', lng: '103.919200' },
  'ពោធិ៍សាត់': { lat: '12.538800', lng: '103.919200' },
  'kampong chhnang': { lat: '12.250000', lng: '104.666700' },
  'កំពង់ឆ្នាំង': { lat: '12.250000', lng: '104.666700' },
  'kampong speu': { lat: '11.453300', lng: '104.520900' },
  'កំពង់ស្ពឺ': { lat: '11.453300', lng: '104.520900' },
  'kratie': { lat: '12.488100', lng: '106.018800' },
  'ក្រចេះ': { lat: '12.488100', lng: '106.018800' },
  'stung treng': { lat: '13.525900', lng: '105.968300' },
  'ស្ទឹងត្រែង': { lat: '13.525900', lng: '105.968300' },
  'ratanakiri': { lat: '13.739400', lng: '106.987300' },
  'រតនគិរី': { lat: '13.739400', lng: '106.987300' },
  'mondulkiri': { lat: '12.455800', lng: '107.188100' },
  'មណ្ឌលគិរី': { lat: '12.455800', lng: '107.188100' },
  'koh kong': { lat: '11.615300', lng: '102.983800' },
  'កោះកុង': { lat: '11.615300', lng: '102.983800' },
  'kep': { lat: '10.482900', lng: '104.316700' },
  'កែប': { lat: '10.482900', lng: '104.316700' },
  'pailin': { lat: '12.848900', lng: '102.609300' },
  'ប៉ៃលិន': { lat: '12.848900', lng: '102.609300' },
  'preah vihear': { lat: '13.807300', lng: '104.980500' },
  'ព្រះវិហារ': { lat: '13.807300', lng: '104.980500' },
  'oddar meanchey': { lat: '14.181800', lng: '103.517600' },
  'ឧត្តរមានជ័យ': { lat: '14.181800', lng: '103.517600' },
  'tboung khmum': { lat: '11.889100', lng: '105.659200' },
  'ត្បូងឃ្មុំ': { lat: '11.889100', lng: '105.659200' },
}

  // GPS Auto-Locate feature: Prioritizes real GPS first, then City match, then IP fallback
  const handleGetLocation = () => {
    setIsLocating(true)

    const applyCoordinates = (lat: number | string, lng: number | string, sourceName?: string) => {
      setValue('latitude', Number(lat).toFixed(6), { shouldValidate: true })
      setValue('longitude', Number(lng).toFixed(6), { shouldValidate: true })
      setIsLocating(false)
      toast.success(
        sourceName
          ? `${t('customers.gpsSuccess', 'Coordinates retrieved successfully!')} (${sourceName})`
          : t('customers.gpsSuccess', 'Coordinates retrieved successfully!')
      )
    }

    const fallbackToCityOrIp = async (error?: GeolocationPositionError) => {
      if (error && error.code === error.PERMISSION_DENIED) {
        setIsLocating(false)
        toast.warning(
          isKhmer
            ? '⚠️ សូមចុច "Allow" ឬបើកសិទ្ធិចាប់ទីតាំង (Location Permission) លើ Browser/ទូរស័ព្ទរបស់អ្នក ដើម្បីចាប់ទីតាំងបច្ចុប្បន្ន។'
            : t('customers.gpsPermissionDenied', 'Location permission denied. Please allow location access in browser settings.')
        )
        return
      }

      // Check if user already typed a known City or Address matching Cambodia provinces
      const currentCity = (watch('city') || '').trim().toLowerCase()
      const currentAddress = (watch('address') || '').trim().toLowerCase()
      const currentProvince = (watch('province') || '').trim().toLowerCase()

      for (const [cityName, coords] of Object.entries(CAMBODIA_CITY_COORDINATES)) {
        if (
          (currentCity && (currentCity.includes(cityName) || cityName.includes(currentCity))) ||
          (currentProvince && (currentProvince.includes(cityName) || cityName.includes(currentProvince))) ||
          (currentAddress && currentAddress.includes(cityName))
        ) {
          applyCoordinates(coords.lat, coords.lng, cityName.toUpperCase())
          return
        }
      }

      // Try Clean IP Geolocation lookup fallback (ipwho.is)
      try {
        const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(3000) })
        if (res.ok) {
          const data = await res.json()
          if (data && data.success && data.latitude && data.longitude) {
            applyCoordinates(data.latitude, data.longitude, data.city || 'Network IP')
            if (!watch('city') && data.city) {
              setValue('city', data.city)
            }
            return
          }
        }
      } catch {
        // continue
      }

      // If all automatic methods fail, default to standard Phnom Penh coordinates
      setIsLocating(false)
      applyCoordinates(11.5564, 104.9282, 'Phnom Penh')
    }

    if (!navigator.geolocation) {
      fallbackToCityOrIp()
      return
    }

    // Step 1: Attempt Real High-Accuracy GPS first (works on Mobile/GPS devices & Wi-Fi enabled Macs)
    navigator.geolocation.getCurrentPosition(
      (pos) => applyCoordinates(pos.coords.latitude, pos.coords.longitude, 'Real GPS'),
      (errHigh) => {
        // Step 2: Fallback to standard network/Wi-Fi positioning (enableHighAccuracy: false)
        navigator.geolocation.getCurrentPosition(
          (pos) => applyCoordinates(pos.coords.latitude, pos.coords.longitude, 'Network/Wi-Fi'),
          () => fallbackToCityOrIp(errHigh),
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
        )
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
    )
  }

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending

  // Find resolved customer name if pre-locked or selected
  const resolvedCustomerName =
    customerName ||
    (customerId
      ? undefined
      : (customers as any[]).find((c) => String(c.id) === String(currentCustomerId))?.name)

  const inputCls =
    'w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium dark:[color-scheme:dark]'
  const inputWithIconCls =
    'w-full h-10 min-h-[40px] !pl-10 pr-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium dark:[color-scheme:dark]'
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
        'Manage delivery location coordinates and recipient contact details'
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
              <div className="flex items-center gap-2 h-10 px-3.5 rounded-lg border border-border/80 dark:border-slate-700/80 bg-muted/30 dark:bg-slate-800/60 text-foreground dark:text-slate-200 text-xs sm:text-[13px] font-semibold">
                <User size={15} className="text-primary shrink-0" />
                <span className="truncate">{resolvedCustomerName || `Customer #${customerId}`}</span>
              </div>
            </div>
          ) : (
            <div>
              <label className={labelCls}>
                {t('customers.customer', 'Customer')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <User size={15} />
                </div>
                <select
                  {...register('customer_id', {
                    required: t('customers.validation.customerRequired', 'Customer is required'),
                  })}
                  className={`${inputWithIconCls} cursor-pointer`}
                >
                  <option value="">{t('customers.selectCustomer', '-- Select Customer --')}</option>
                  {(customers ?? []).map((c: any) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name} {c.phone ? `(${c.phone})` : ''}
                    </option>
                  ))}
                </select>
              </div>
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
            <label className="text-xs font-bold text-foreground dark:text-slate-200 flex items-center gap-1.5">
              <Tag size={14} className="text-primary" />
              <span>{t('customers.addressLabel', 'Address Label')}</span>
              <span className="text-rose-500">*</span>
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
                  className={`h-11 px-3 rounded-xl border text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer select-none active:scale-98 ${
                    isSelected
                      ? `${type.activeBg} font-bold shadow-xs`
                      : 'border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900 text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white hover:bg-muted/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <IconComponent size={15} className={isSelected ? 'text-current shrink-0' : 'opacity-70 shrink-0'} />
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-rose-500">
                    <Tag size={14} />
                  </div>
                  <input
                    type="text"
                    value={customLabel}
                    onChange={(e) => {
                      setCustomLabel(e.target.value)
                      setValue('label', e.target.value.trim() || 'Other')
                    }}
                    placeholder={t('customers.customAddressLabelPlaceholder', 'e.g. Villa, Branch Store, Condo, Factory...')}
                    className="w-full h-9 pl-9 pr-8 text-xs sm:text-[13px] rounded-lg border border-rose-300 dark:border-rose-900/60 bg-background dark:bg-slate-900 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-rose-500/30 font-medium"
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
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <UserCheck size={15} />
              </div>
              <input
                {...register('name', {
                  required: t('customers.validation.receiverNameRequired', 'Recipient name is required'),
                })}
                placeholder={t('customers.receiverNamePlaceholder', 'e.g. Sok Chantha')}
                className={inputWithIconCls}
              />
            </div>
            {errors.name && (
              <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              {t('customers.phone', 'Phone Number')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Phone size={15} />
              </div>
              <input
                {...register('phone', {
                  required: t('customers.validation.phoneRequired', 'Phone number is required'),
                })}
                placeholder={t('customers.phonePlaceholder', '012 345 678')}
                className={`${inputWithIconCls} font-mono`}
              />
            </div>
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
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <MapPin size={15} />
            </div>
            <input
              {...register('address', {
                required: t('customers.validation.addressRequired', 'Street address is required'),
              })}
              placeholder={t('customers.streetAddressPlaceholder', 'e.g. #123 St. 456, Sangkat Boeung Keng Kang 1')}
              className={inputWithIconCls}
            />
          </div>
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
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Navigation size={14} />
              </div>
              <input
                {...register('city', {
                  required: t('customers.validation.cityRequired', 'City is required'),
                })}
                placeholder={t('customers.cityPlaceholder', 'e.g. Phnom Penh')}
                className={inputWithIconCls}
              />
            </div>
            {errors.city && (
              <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              {t('customers.province', 'Province')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Building2 size={14} />
              </div>
              <input
                {...register('province', {
                  required: t('customers.validation.provinceRequired', 'Province is required'),
                })}
                placeholder={t('customers.provincePlaceholder', 'Phnom Penh')}
                className={inputWithIconCls}
              />
            </div>
            {errors.province && (
              <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.province.message}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              {t('customers.postalCode', 'Postal Code')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Compass size={14} />
              </div>
              <input
                {...register('postal_code', {
                  required: t('customers.validation.postalCodeRequired', 'Postal code is required'),
                })}
                placeholder={t('customers.postalCodePlaceholder', '12000')}
                className={`${inputWithIconCls} font-mono`}
              />
            </div>
            {errors.postal_code && (
              <p className="text-rose-500 text-[11px] mt-1 font-medium">
                {errors.postal_code.message}
              </p>
            )}
          </div>
        </div>

        {/* ─── Map Coordinates & GPS Pinning (100% Clean & Optional for Admin) ─── */}
        <div className="p-3.5 sm:p-4 bg-muted/20 dark:bg-slate-900/60 border border-border/80 dark:border-slate-800 rounded-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <MapPin size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-[13px] font-bold text-foreground dark:text-slate-200">
                    {t('customers.mapGpsTitle', 'ទីតាំងលើផែនទី & GPS')}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {t('common.optional', 'ស្រេចចិត្ត / Optional')}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground dark:text-slate-400 mt-0.5">
                  {watch('latitude') && watch('longitude')
                    ? t('customers.coordsAttachedHelp', 'បានភ្ជាប់កូអរដោនេរួចរាល់សម្រាប់អ្នកដឹកជញ្ជូន')
                    : t('customers.coordsOptionalHelp', 'មិនបាច់ដាក់ក៏បាន (Admin បំពេញតែអាសយដ្ឋានខាងលើ ឬជ្រើសរើសលើផែនទី) ')}
                </p>
              </div>
            </div>

            {/* Clean Action Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setIsMapPickerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer select-none active:scale-95 shadow-2xs"
                title={t('customers.pickOnMap', 'ជ្រើសរើសទីតាំងលើផែនទី')}
              >
                <MapPin size={13} />
                <span>{watch('latitude') && watch('longitude') ? t('customers.changeOnMap', 'ប្តូរទីតាំងលើផែនទី') : t('customers.pickOnMap', 'ជ្រើសរើសលើផែនទី')}</span>
              </button>

              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold transition-all cursor-pointer select-none active:scale-95 shadow-2xs"
                title={t('customers.gpsLocateHelp', 'Auto-detect current GPS coordinates')}
              >
                {isLocating ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <LocateFixed size={13} />
                )}
                <span>{t('customers.locateMe', 'ចាប់ GPS')}</span>
              </button>
            </div>
          </div>

          {/* Active Coordinates Display & Actions */}
          {Boolean(watch('latitude') && watch('longitude')) && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs">
              <div className="flex items-center gap-2 font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>Lat: {Number(watch('latitude')).toFixed(6)}</span>
                <span className="opacity-40">•</span>
                <span>Lng: {Number(watch('longitude')).toFixed(6)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualCoords(!showManualCoords)}
                  className="text-[11px] text-muted-foreground hover:text-foreground font-medium underline cursor-pointer"
                >
                  {showManualCoords ? t('customers.hideDetails', 'លាក់លេខកូដ') : t('customers.editCoordinatesManual', 'កែសម្រួលលេខដោយដៃ')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue('latitude', '', { shouldValidate: true })
                    setValue('longitude', '', { shouldValidate: true })
                    toast.success(t('customers.coordsCleared', 'បានលុបកូអរដោនេទីតាំងរួចរាល់'))
                  }}
                  className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title={t('common.clear', 'លុបកូអរដោនេ')}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Manual Coordinates Input (only if admin wants to customize digits) */}
          {showManualCoords && (
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/60 dark:border-slate-800">
              <div>
                <label className={labelCls}>
                  {t('customers.latitude', 'Latitude')}
                </label>
                <input
                  step="any"
                  {...register('latitude')}
                  placeholder="11.556400"
                  className={`${inputCls} font-mono`}
                />
              </div>
              <div>
                <label className={labelCls}>
                  {t('customers.longitude', 'Longitude')}
                </label>
                <input
                  step="any"
                  {...register('longitude')}
                  placeholder="104.928200"
                  className={`${inputCls} font-mono`}
                />
              </div>
            </div>
          )}
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

      {/* ─── Map Location Picker Modal (Rendered outside form to avoid bubbling) ─── */}
      {isMapPickerOpen && (
        <MapLocationPickerModal
          isOpen={isMapPickerOpen}
          onClose={() => setIsMapPickerOpen(false)}
          initialLat={watch('latitude') ? parseFloat(watch('latitude')) : null}
          initialLng={watch('longitude') ? parseFloat(watch('longitude')) : null}
          initialCity={watch('province') || watch('city')}
          initialAddress={watch('address')}
          onSelectLocation={(loc) => {
            setValue('latitude', loc.latitude.toFixed(6), { shouldValidate: true, shouldDirty: true })
            setValue('longitude', loc.longitude.toFixed(6), { shouldValidate: true, shouldDirty: true })
            if (loc.address) {
              setValue('address', loc.address, { shouldValidate: true, shouldDirty: true })
            }
            if (loc.city) {
              setValue('city', loc.city, { shouldValidate: true, shouldDirty: true })
            }
            if (loc.province) {
              setValue('province', loc.province, { shouldValidate: true, shouldDirty: true })
            }
            if (loc.postal_code) {
              setValue('postal_code', loc.postal_code, { shouldValidate: true, shouldDirty: true })
            }
            setValue('country', 'Cambodia', { shouldValidate: true, shouldDirty: true })
            toast.success(t('customers.mapLocationSelected', 'Location selected from map successfully!'))
          }}
        />
      )}
    </EnterpriseModal>
  )
}

export default CustomerAddressModal
