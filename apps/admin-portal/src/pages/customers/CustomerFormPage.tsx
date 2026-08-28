import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  User,
  Phone,
  Award,
  CreditCard,
  FileText,
  Camera,
  Trash2,
  UploadCloud,
  Check,
  Loader2,
  Building2,
  Shield,
  DollarSign,
  Calendar,
  Mail,
  Receipt,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import { FormHeader, FormFooter, LoadingSpinner } from '@/components/common'
import CustomErrorMessage from '@/components/ui/CustomErrorMessage'
import { getAbsoluteImageUrl } from '@/utils/image'
import type { CustomerFormData } from './types'

const BLANK_CUSTOMER_FORM: CustomerFormData = {
  company_id: '1',
  customer_group_id: '',
  user_id: '',
  name: '',
  email: '',
  phone: '',
  gender: '',
  birth_date: '',
  credit_limit: '1000',
  tax_number: '',
  notes: '',
  is_active: true,
}

export const CustomerFormPage: React.FC = () => {
  const { t } = useTranslation(['customers', 'common', 'nav'])
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const customerId = id ? parseInt(id) : null
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()

  const [formData, setFormData] = useState<CustomerFormData>(BLANK_CUSTOMER_FORM)

  // Photo upload states
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoAction, setPhotoAction] = useState<'keep' | 'remove' | 'change'>('keep')

  const setFormField = (field: keyof CustomerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Fetch customer data if editing
  const {
    data: customerDetail,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    error: detailError,
    refetch: refetchDetail,
  } = useQuery({
    queryKey: ['customer-detail', customerId],
    queryFn: () => (customerId ? api.get(`/customers/${customerId}`).then(r => r.data.data) : null),
    enabled: isEdit && !isNaN(customerId as number),
  })

  // Queries for dropdowns
  const { data: companies = [] } = useQuery({
    queryKey: ['companies-list-dropdown'],
    queryFn: () => api.get('/companies', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: groups = [] } = useQuery({
    queryKey: ['customer-groups-list'],
    queryFn: () => api.get('/customer-groups', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: users = [] } = useQuery({
    queryKey: ['users-list-dropdown'],
    queryFn: () => api.get('/users', { params: { per_page: 200 } }).then(r => r.data.data ?? []),
  })

  useEffect(() => {
    if (customerDetail) {
      setFormData({
        company_id: customerDetail.company_id?.toString() || '1',
        customer_group_id: customerDetail.customer_group_id?.toString() || '',
        user_id: customerDetail.user_id?.toString() || '',
        name: customerDetail.name || '',
        email: customerDetail.email || '',
        phone: customerDetail.phone || '',
        gender: customerDetail.gender || '',
        birth_date: customerDetail.birth_date || '',
        credit_limit: customerDetail.credit_limit?.toString() || '1000',
        tax_number: customerDetail.tax_number || '',
        notes: customerDetail.notes || '',
        is_active: customerDetail.is_active !== undefined ? !!customerDetail.is_active : true,
      })
      if (customerDetail.photo) {
        setPhotoPreview(getAbsoluteImageUrl(customerDetail.photo))
      }
      setPhotoAction('keep')
    }
  }, [customerDetail])

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (payload: FormData) => api.post('/customers', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      qc.invalidateQueries({ queryKey: ['customers-stats'] })
      toast.success(t('toast.created', { item: t('customers.title', 'អតិថិជន') }))
      navigate('/customers')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error', 'Failed to create customer.'))
    },
  })

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => api.post(`/customers/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      qc.invalidateQueries({ queryKey: ['customers-stats'] })
      qc.invalidateQueries({ queryKey: ['customer-detail', customerId] })
      toast.success(t('toast.updated', { item: t('customers.title', 'អតិថិជន') }))
      navigate('/customers')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error', 'Failed to update customer.'))
    },
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
      setPhotoAction('change')
    }
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    setPhotoAction('remove')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error(t('customers.validation.nameRequired', 'តម្រូវឱ្យបញ្ចូលឈ្មោះអតិថិជន'))
      return
    }

    const dataPayload = new FormData()
    dataPayload.append('company_id', formData.company_id || companies?.[0]?.id?.toString() || '1')
    if (formData.customer_group_id) dataPayload.append('customer_group_id', formData.customer_group_id)
    if (formData.user_id) dataPayload.append('user_id', formData.user_id)
    dataPayload.append('name', formData.name)
    if (formData.email) dataPayload.append('email', formData.email)
    if (formData.phone) dataPayload.append('phone', formData.phone)
    if (formData.gender) dataPayload.append('gender', formData.gender)
    if (formData.birth_date) dataPayload.append('birth_date', formData.birth_date)
    if (formData.credit_limit) dataPayload.append('credit_limit', formData.credit_limit)
    if (formData.tax_number) dataPayload.append('tax_number', formData.tax_number)
    if (formData.notes) dataPayload.append('notes', formData.notes)
    dataPayload.append('is_active', formData.is_active ? '1' : '0')

    if (photoAction === 'change' && photoFile) {
      dataPayload.append('photo', photoFile)
    } else if (photoAction === 'remove') {
      dataPayload.append('photo', '')
    }

    if (isEdit && customerId) {
      dataPayload.append('_method', 'PUT')
      updateMutation.mutate({ id: customerId, data: dataPayload })
    } else {
      createMutation.mutate(dataPayload)
    }
  }

  const selectedGroup = groups.find((g: any) => String(g.id) === String(formData.customer_group_id))

  if (isEdit && isLoadingDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner />
        <span className="text-xs text-muted-foreground mt-2">{t('common.loading', 'Loading customer details...')}</span>
      </div>
    )
  }

  if (isEdit && isErrorDetail) {
    return (
      <div className="p-6">
        <CustomErrorMessage
          title={t('common.errorLoading', 'Failed to load customer profile.')}
          message={detailError?.message || t('common.error', 'An error occurred')}
          onRetry={refetchDetail}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-10 w-full">
      {/* ─── Global Form Header with Breadcrumbs & Actions ─── */}
      <FormHeader
        isEdit={isEdit}
        title={
          isEdit
            ? t('customers.editCustomerTitle', 'កែសម្រួលអតិថិជន: {{name}}', { name: formData.name || '' })
            : t('customers.createCustomerTitle', 'បន្ថែមអតិថិជនថ្មី')
        }
        subtitle={t('customers.formSubtitle', 'គ្រប់គ្រង និងបំពេញព័ត៌មានអតិថិជនក្នុងប្រព័ន្ធ CRM')}
        breadcrumbs={[
          { label: t('customers.title', 'អតិថិជន'), path: '/customers' },
          {
            label: isEdit
              ? t('customers.editCustomer', 'កែសម្រួលអតិថិជន')
              : t('customers.addCustomer', 'បន្ថែមអតិថិជនថ្មី'),
          },
        ]}
        backPath="/customers"
        backLabel={t('common.back', 'ត្រឡប់ក្រោយ')}
        isSubmitting={isSubmitting}
        submitLabel={
          isEdit
            ? t('customers.saveChanges', 'រក្សាទុកការផ្លាស់ប្តូរ')
            : t('customers.saveCustomer', 'រក្សាទុកអតិថិជន')
        }
        onSubmit={handleSubmit}
      />

      {/* ─── Form Container ─── */}
      <form onSubmit={handleSubmit} className="space-y-5 w-full">

        {/* ══════════════════════════════════════════════════
            ព័ត៌មានទូទៅ & រូបថត (SECTION 1)
        ══════════════════════════════════════════════════ */}
        <div className="bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
                <User size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground dark:text-slate-100">
                  {t('customers.formTabGeneral', 'ព័ត៌មានទូទៅ & រូបថត')}
                </h3>
                <p className="text-xs text-muted-foreground dark:text-slate-400 mt-0.5">
                  {t('customers.generalSectionHelp', 'បំពេញព័ត៌មានមូលដ្ឋាន និងរូបថតប្រវត្តិរូបរបស់អតិថិជន')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Profile Photo Upload */}
            <div className="p-4 rounded-xl border border-border/80 dark:border-slate-800 bg-muted/10 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center gap-5">
              {photoPreview ? (
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border/80 dark:border-slate-700 group shadow-xs shrink-0 bg-background dark:bg-slate-900">
                  <img src={photoPreview} alt="Customer Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="p-1.5 bg-card/90 dark:bg-slate-800/90 hover:bg-card dark:hover:bg-slate-700 text-foreground dark:text-slate-200 rounded-lg cursor-pointer transition-colors shadow-xs" title={t('customers.changePhoto', 'ប្តូររូបថត')}>
                      <Camera size={14} />
                      <input type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg cursor-pointer transition-colors shadow-xs"
                      title={t('customers.removePhoto', 'លុបរូបថត')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="w-full sm:w-auto flex-1 border-2 border-dashed border-border/80 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 rounded-xl p-4 flex items-center justify-center gap-3.5 cursor-pointer bg-background dark:bg-slate-900 hover:bg-muted/30 dark:hover:bg-slate-800/60 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <UploadCloud size={20} />
                  </div>
                  <div>
                    <span className="text-xs sm:text-[13px] font-bold text-foreground dark:text-slate-100 block">
                      {t('customers.clickUploadPhoto', 'ចុចដើម្បីបង្ហោះរូបថត')}
                    </span>
                    <span className="text-[11px] text-muted-foreground dark:text-slate-400">
                      {t('customers.photoHint', 'PNG, JPG ឬ WEBP (ទំហំអតិបរមា 2MB)')}
                    </span>
                  </div>
                  <input type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
                </label>
              )}

              {photoPreview && (
                <div className="text-xs text-muted-foreground dark:text-slate-400 space-y-1 text-center sm:text-left">
                  <span className="font-bold text-foreground dark:text-slate-100 block text-xs sm:text-[13px]">
                    {t('customers.photoUpload', 'រូបថតប្រវត្តិរូប')}
                  </span>
                  <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                    {t('customers.photoHint', 'PNG, JPG ឬ WEBP (ទំហំអតិបរមា 2MB)')}
                  </p>
                </div>
              )}
            </div>

            {/* Customer Full Name */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('customers.fullName', 'ឈ្មោះពេញអតិថិជន')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground dark:text-slate-400">
                  <User size={15} />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormField('name', e.target.value)}
                  placeholder={t('customers.namePlaceholder', t('namePlaceholder', 'ឧ. សុខ ចាន់ដារ៉ា'))}
                  className="w-full h-10 min-h-[40px] pl-9 pr-3.5 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>
            </div>

            {/* Gender & Date of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                  {t('customers.gender', t('gender', 'ភេទ'))}
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormField('gender', e.target.value)}
                  className="w-full h-10 min-h-[40px] px-3.5 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer font-medium"
                >
                  <option value="" className="dark:bg-slate-900">{t('customers.selectGender', t('selectGender', 'ជ្រើសរើសភេទ'))}</option>
                  <option value="male" className="dark:bg-slate-900">{t('customers.genderMale', t('genderMale', 'ប្រុស'))}</option>
                  <option value="female" className="dark:bg-slate-900">{t('customers.genderFemale', t('genderFemale', 'ស្រី'))}</option>
                  <option value="other" className="dark:bg-slate-900">{t('customers.genderOther', t('genderOther', 'ផ្សេងទៀត'))}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                  {t('customers.birthDate', 'ថ្ងៃខែឆ្នាំកំណើត')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground dark:text-slate-400">
                    <Calendar size={15} />
                  </div>
                  <input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormField('birth_date', e.target.value)}
                    className="w-full h-10 min-h-[40px] pl-9 pr-3.5 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium dark:[color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Active Status Switch */}
            <div className="p-4 bg-muted/15 dark:bg-slate-800/40 border border-border/80 dark:border-slate-800 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="custActivePage" className="text-xs sm:text-[13px] font-bold text-foreground dark:text-slate-100 cursor-pointer select-none">
                  {t('customers.activeCustomerAccount', 'គណនីអតិថិជនសកម្ម')}
                </label>
                <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                  {t('customers.activeAccountHelp', 'អនុញ្ញាតឱ្យអតិថិជននេះអាចទិញទំនិញ និងប្រើប្រាស់សេវាកម្មក្នុងប្រព័ន្ធ')}
                </p>
              </div>
              <input
                type="checkbox"
                id="custActivePage"
                checked={formData.is_active}
                onChange={(e) => setFormField('is_active', e.target.checked)}
                className="form-checkbox h-5 w-5 text-primary rounded border-border dark:border-slate-700 focus:ring-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            ទំនាក់ទំនង & គណនី (SECTION 2)
        ══════════════════════════════════════════════════ */}
        <div className="bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground dark:text-slate-100">
                  {t('customers.formTabContact', 'ទំនាក់ទំនង & គណនី')}
                </h3>
                <p className="text-xs text-muted-foreground dark:text-slate-400 mt-0.5">
                  {t('customers.contactSectionHelp', 'ព័ត៌មានទំនាក់ទំនង សាខាប្រតិបត្តិការ និងការភ្ជាប់គណនីចូលប្រើប្រព័ន្ធ')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                  {t('customers.email', 'អាសយដ្ឋានអ៊ីមែល')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground dark:text-slate-400">
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormField('email', e.target.value)}
                    placeholder={t('customers.emailPlaceholder', 'customer@example.com')}
                    className="w-full h-10 min-h-[40px] pl-9 pr-3.5 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                  {t('customers.phone', 'លេខទូរស័ព្ទ')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground dark:text-slate-400">
                    <Phone size={15} />
                  </div>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormField('phone', e.target.value)}
                    placeholder={t('customers.phonePlaceholder', '012 345 678 / +855...')}
                    className="w-full h-10 min-h-[40px] pl-9 pr-3.5 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                  {t('customers.selectCompany', 'ក្រុមហ៊ុន / សាខាប្រតិបត្តិការ')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground dark:text-slate-400">
                    <Building2 size={15} />
                  </div>
                  <select
                    value={formData.company_id}
                    onChange={(e) => setFormField('company_id', e.target.value)}
                    className="w-full h-10 min-h-[40px] pl-9 pr-3.5 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer font-medium"
                  >
                    {companies.map((c: any) => (
                      <option key={c.id} value={c.id} className="dark:bg-slate-900">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                  {t('customers.selectUser', 'គណនីអ្នកប្រើប្រាស់ក្នុងប្រព័ន្ធ')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground dark:text-slate-400">
                    <Shield size={15} />
                  </div>
                  <select
                    value={formData.user_id}
                    onChange={(e) => setFormField('user_id', e.target.value)}
                    className="w-full h-10 min-h-[40px] pl-9 pr-3.5 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer font-medium"
                  >
                    <option value="" className="dark:bg-slate-900">{t('customers.noLinkedUser', 'មិនទាន់ភ្ជាប់គណនីអ្នកប្រើប្រាស់')}</option>
                    {users.map((u: any) => (
                      <option key={u.id} value={u.id} className="dark:bg-slate-900">
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            ក្រុម & សមាជិកភាព (SECTION 3)
        ══════════════════════════════════════════════════ */}
        <div className="bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
                <Award size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground dark:text-slate-100">
                  {t('customers.formTabGroup', 'ក្រុម & សមាជិកភាព')}
                </h3>
                <p className="text-xs text-muted-foreground dark:text-slate-400 mt-0.5">
                  {t('customers.groupSectionHelp', 'ជ្រើសរើសក្រុមអតិថិជនដើម្បីទទួលបានការបញ្ចុះតម្លៃ និងអត្ថប្រយោជន៍ស្វ័យប្រវត្តិ')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('customers.customerGroup', 'ក្រុមអតិថិជន')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground dark:text-slate-400">
                  <Award size={15} />
                </div>
                <select
                  value={formData.customer_group_id}
                  onChange={(e) => setFormField('customer_group_id', e.target.value)}
                  className="w-full h-10 min-h-[40px] pl-9 pr-3.5 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer font-medium"
                >
                  <option value="" className="dark:bg-slate-900">{t('customers.noSpecialGroup', 'ក្រុមទូទៅ (Standard)')}</option>
                  {groups.map((g: any) => (
                    <option key={g.id} value={g.id} className="dark:bg-slate-900">
                      {g.name} {g.discount_percent ? `(បញ្ចុះតម្លៃ ${g.discount_percent}%)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Group Benefits Information Card */}
            <div className="p-4 rounded-xl border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-[13px]">
                <Sparkles size={16} />
                <span>{t('customers.groupBenefits', 'អត្ថប្រយោជន៍សមាជិកភាព')}</span>
              </div>
              <p className="text-xs text-muted-foreground dark:text-slate-300 leading-relaxed">
                {selectedGroup
                  ? t('customers.groupSelectedNotice', 'អតិថិជននេះស្ថិតក្នុងក្រុម "{{group}}" ដែលទទួលបានការបញ្ចុះតម្លៃស្វ័យប្រវត្តិចំនួន {{discount}}% លើការលក់ទំនិញ។', {
                      group: selectedGroup.name,
                      discount: selectedGroup.discount_percent || 0
                    })
                  : t('customers.groupStandardNotice', 'អតិថិជនក្នុងក្រុមទូទៅ នឹងទទួលបានតម្លៃលក់ស្តង់ដារ និងអាចសន្ំពិន្ទុភក្តីភាពបានធម្មតា។')}
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            ហិរញ្ញវត្ថុ & ពន្ធដារ (SECTION 4)
        ══════════════════════════════════════════════════ */}
        <div className="bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
                <CreditCard size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground dark:text-slate-100">
                  {t('customers.formTabFinancial', 'ហិរញ្ញវត្ថុ & ពន្ធដារ')}
                </h3>
                <p className="text-xs text-muted-foreground dark:text-slate-400 mt-0.5">
                  {t('customers.financialSectionHelp', 'កំណត់កម្រិតឥណទានទិញជំពាក់ និងលេខសម្គាល់សារពើពន្ធផ្លូវការ')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                  {t('customers.creditLimit', 'កម្រិតឥណទាន ($)')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground dark:text-slate-400">
                    <DollarSign size={15} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.credit_limit}
                    onChange={(e) => setFormField('credit_limit', e.target.value)}
                    placeholder="1000.00"
                    className="w-full h-10 min-h-[40px] pl-9 pr-3.5 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                  {t('customers.taxNumber', 'លេខសម្គាល់សារពើពន្ធ')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground dark:text-slate-400">
                    <Receipt size={15} />
                  </div>
                  <input
                    type="text"
                    value={formData.tax_number}
                    onChange={(e) => setFormField('tax_number', e.target.value)}
                    placeholder="TAX-90124"
                    className="w-full h-10 min-h-[40px] pl-9 pr-3.5 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Credit Policy Notice Card */}
            <div className="p-4 bg-muted/15 dark:bg-slate-800/40 border border-border/80 dark:border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-foreground dark:text-slate-100">
                <Info size={15} className="text-primary" />
                <span>{t('customers.creditPolicyTitle', 'គោលការណ៍ឥណទាន និងពន្ធដារ')}</span>
              </div>
              <p className="text-xs text-muted-foreground dark:text-slate-300 leading-relaxed">
                {t('customers.creditPolicyDesc', 'កម្រិតឥណទានអតិបរមាអនុញ្ញាតឱ្យអតិថិជនទិញជំពាក់លើការបញ្ជាទិញ និងវិក្កយបត្រ POS។')}
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            កំណត់ចំណាំ & សង្ខេប (SECTION 5)
        ══════════════════════════════════════════════════ */}
        <div className="bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground dark:text-slate-100">
                  {t('customers.formTabNotes', 'កំណត់ចំណាំ & សង្ខេប')}
                </h3>
                <p className="text-xs text-muted-foreground dark:text-slate-400 mt-0.5">
                  {t('customers.notesSectionHelp', 'កត់ត្រាចំណូលចិត្ត ឬព័ត៌មានបន្ថែមរបស់អតិថិជន')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('customers.internalNotes', t('internalNotes', 'កំណត់ចំណាំផ្ទៃក្នុង'))}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormField('notes', e.target.value)}
                rows={3}
                placeholder={t('customers.notesPlaceholder', t('notesPlaceholder', 'ចំណូលចិត្តរបស់អតិថិជន ឬកំណត់ចំណាំបន្ថែមសម្រាប់ការថែទាំ...'))}
                className="w-full p-3 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-medium leading-relaxed"
              />
            </div>

            {/* Live Summary Review Card */}
            <div className="p-4 sm:p-5 rounded-xl border border-border/80 dark:border-slate-800 bg-muted/15 dark:bg-slate-800/40 space-y-3.5">
              <div className="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-foreground dark:text-slate-100">
                <CheckCircle2 size={17} className="text-emerald-500" />
                <span>{t('customers.summaryTitle', t('summaryTitle', 'ផ្ទៀងផ្ទាត់ព័ត៌មានសង្ខេបមុនពេលរក្សាទុក'))}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-background/80 dark:bg-slate-900/90 p-3 rounded-lg border border-border/60 dark:border-slate-800">
                  <span className="text-[10px] text-muted-foreground dark:text-slate-400 block">{t('customers.name', t('name', 'ឈ្មោះ'))}</span>
                  <span className="font-bold text-foreground dark:text-slate-100 truncate block mt-0.5">
                    {formData.name || '—'}
                  </span>
                </div>
                <div className="bg-background/80 dark:bg-slate-900/90 p-3 rounded-lg border border-border/60 dark:border-slate-800">
                  <span className="text-[10px] text-muted-foreground dark:text-slate-400 block">{t('customers.phone', t('phone', 'ទូរស័ព្ទ'))}</span>
                  <span className="font-bold text-foreground dark:text-slate-100 truncate block mt-0.5">
                    {formData.phone || '—'}
                  </span>
                </div>
                <div className="bg-background/80 dark:bg-slate-900/90 p-3 rounded-lg border border-border/60 dark:border-slate-800">
                  <span className="text-[10px] text-muted-foreground dark:text-slate-400 block">{t('customers.customerGroup', t('customerGroup', 'ក្រុម'))}</span>
                  <span className="font-bold text-primary truncate block mt-0.5">
                    {selectedGroup?.name || t('customers.standardGroup', t('standardGroup', 'ទូទៅ'))}
                  </span>
                </div>
                <div className="bg-background/80 dark:bg-slate-900/90 p-3 rounded-lg border border-border/60 dark:border-slate-800">
                  <span className="text-[10px] text-muted-foreground dark:text-slate-400 block">{t('customers.creditLimit', t('creditLimit', 'ឥណទាន'))}</span>
                  <span className="font-mono font-bold text-foreground dark:text-slate-100 block mt-0.5">
                    ${Number(formData.credit_limit || 0).toFixed(2)}
                  </span>
                </div>
                <div className="bg-background/80 dark:bg-slate-900/90 p-3 rounded-lg border border-border/60 dark:border-slate-800">
                  <span className="text-[10px] text-muted-foreground dark:text-slate-400 block">{t('customers.taxNumber', 'លេខសារពើពន្ធ')}</span>
                  <span className="font-mono font-medium text-foreground dark:text-slate-100 truncate block mt-0.5">
                    {formData.tax_number || '—'}
                  </span>
                </div>
                <div className="bg-background/80 dark:bg-slate-900/90 p-3 rounded-lg border border-border/60 dark:border-slate-800">
                  <span className="text-[10px] text-muted-foreground dark:text-slate-400 block">{t('common.status', 'ស្ថានភាព')}</span>
                  <span className={`font-bold inline-block text-[11px] mt-0.5 ${formData.is_active ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {formData.is_active ? t('common.active', 'សកម្ម') : t('common.inactive', 'អសកម្ម')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Global Sticky Form Footer ─── */}
        <FormFooter
          cancelPath="/customers"
          cancelLabel={t('common.cancel', 'បោះបង់')}
          isSubmitting={isSubmitting}
          submitLabel={
            isEdit
              ? t('customers.saveChanges', 'រក្សាទុកការផ្លាស់ប្តូរ')
              : t('customers.saveCustomer', 'រក្សាទុកអតិថិជន')
          }
          infoSummary={
            formData.name ? (
              <span>
                {t('customers.title', 'អតិថិជន')}: <strong className="text-foreground dark:text-slate-100 font-semibold">"{formData.name}"</strong>
              </span>
            ) : (
              <span>{isEdit ? t('customers.editSubtitle', 'កែសម្រួលព័ត៌មានអតិថិជន') : t('customers.createSubtitle', 'បំពេញព័ត៌មានអតិថិជនថ្មី')}</span>
            )
          }
        />
      </form>
    </div>
  )
}

export default CustomerFormPage
