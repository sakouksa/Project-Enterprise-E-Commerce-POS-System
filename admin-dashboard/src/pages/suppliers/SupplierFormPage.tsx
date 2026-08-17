import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  Building, Mail, Phone, MapPin, CreditCard,
  User, FileText, Check, Loader2, Plus, Trash2, Globe,
  ArrowLeft, ShieldCheck, Sparkles
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import { FormFooter, LoadingSpinner } from '@/components/common'
import CustomErrorMessage from '@/components/ui/CustomErrorMessage'

// Modular Form Components
import { SupplierFormHeader } from './components/SupplierFormHeader'
import { SupplierLivePreviewDrawer } from './components/SupplierLivePreviewDrawer'

// Types
import { BLANK_SUPPLIER_FORM, type SupplierFormData, type SupplierContact } from './types/supplier.types'

const SupplierFormPage: React.FC = () => {
  const { t } = useTranslation(['suppliers', 'common', 'nav'])
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const supplierId = id ? parseInt(id) : null
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()

  // Form State
  const [formData, setFormData] = useState<SupplierFormData>(BLANK_SUPPLIER_FORM)
  const [contacts, setContacts] = useState<SupplierContact[]>([])
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState(false)

  const setFormField = (field: keyof SupplierFormData | string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Fetch supplier data if editing
  const {
    data: supplierDetail,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    error: detailError,
    refetch: refetchDetail,
  } = useQuery({
    queryKey: ['supplier-detail', supplierId],
    queryFn: () => (supplierId ? api.get(`/suppliers/${supplierId}`).then(r => r.data.data) : null),
    enabled: isEdit && !isNaN(supplierId as number),
  })

  useEffect(() => {
    if (supplierDetail) {
      setFormData({
        name: supplierDetail.name || '',
        code: supplierDetail.code || '',
        email: supplierDetail.email || '',
        phone: supplierDetail.phone || '',
        fax: supplierDetail.fax || '',
        address: supplierDetail.address || '',
        city: supplierDetail.city || '',
        province: supplierDetail.province || '',
        country: supplierDetail.country || '',
        postal_code: supplierDetail.postal_code || '',
        tax_number: supplierDetail.tax_number || '',
        bank_name: supplierDetail.bank_name || '',
        bank_account_number: supplierDetail.bank_account_number || '',
        bank_account_name: supplierDetail.bank_account_name || '',
        notes: supplierDetail.notes || '',
        is_active: !!supplierDetail.is_active,
        ...supplierDetail,
      })
      setContacts(supplierDetail.contacts ? [...supplierDetail.contacts] : [])
    }
  }, [supplierDetail])

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/suppliers', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      qc.invalidateQueries({ queryKey: ['suppliers-list'] })
      toast.success(t('suppliers.toast.createdSuccess', 'Supplier created successfully.'))
      navigate('/suppliers')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('common.error', 'Failed to save supplier.'))
    },
  })

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => api.put(`/suppliers/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      qc.invalidateQueries({ queryKey: ['suppliers-list'] })
      qc.invalidateQueries({ queryKey: ['supplier-detail', supplierId] })
      toast.success(t('suppliers.toast.updatedSuccess', 'Supplier updated successfully.'))
      navigate('/suppliers')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('common.error', 'Failed to update supplier.'))
    },
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error(t('suppliers.nameRequired', 'Supplier Name is required.'))
      return
    }
    if (!formData.code.trim()) {
      toast.error(t('suppliers.codeRequired', 'Supplier Code is required.'))
      return
    }

    const payload = {
      ...formData,
      contacts: contacts.filter(c => c.name.trim().length > 0),
    }

    if (isEdit && supplierId) {
      updateMutation.mutate({ id: supplierId, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const addContactRow = () => {
    setContacts(prev => [...prev, { name: '', title: '', email: '', phone: '', is_primary: prev.length === 0 }])
  }

  const removeContactRow = (idx: number) => {
    setContacts(prev => prev.filter((_, i) => i !== idx))
  }

  const updateContactField = (idx: number, field: keyof SupplierContact, value: any) => {
    setContacts(prev => {
      const copy = [...prev]
      copy[idx] = { ...copy[idx], [field]: value }
      return copy
    })
  }

  const generateAutoCode = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900)
    setFormField('code', `SPL-${randomSuffix}`)
  }

  if (isEdit && isLoadingDetail) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (isEdit && isErrorDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] p-6 max-w-xl mx-auto text-center">
        <CustomErrorMessage
          variant="card"
          severity="error"
          code={(detailError as any)?.response?.status || 500}
          title={t('suppliers.loadErrorTitle', 'Unable to Load Supplier')}
          message={(detailError as any)?.response?.data?.message || t('suppliers.loadErrorDesc', 'Failed to retrieve supplier details.')}
          details={(detailError as any)?.response?.data}
          onRetry={() => refetchDetail()}
          action={{
            label: t('common.back', 'Back to Suppliers'),
            onClick: () => navigate('/suppliers'),
          }}
          className="w-full shadow-2xl"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10 w-full">
      {/* Top Header */}
      <SupplierFormHeader
        isEdit={isEdit}
        supplierId={supplierId}
        supplierDetail={supplierDetail}
        isPending={isSubmitting}
        onSubmit={handleSubmit}
        onOpenLivePreview={() => setIsLivePreviewOpen(true)}
      />

      {/* Main Single-Page Form */}
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        {/* ─── ព័ត៌មានទូទៅ & ស្ថានភាពក្រុមហ៊ុន (General Info & Status) ─── */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
                <Building size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-foreground">
                  {t('suppliers.tabGeneral', 'ព័ត៌មានទូទៅ & ស្ថានភាព')}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {t('suppliers.generalInfoDesc', 'ព័ត៌មានសម្គាល់ទូទៅនៃអ្នកផ្គត់ផ្គង់ កូដ និងពន្ធដារ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                {t('suppliers.status', 'ស្ថានភាព')}:
              </span>
              <button
                type="button"
                onClick={() => setFormField('is_active', !formData.is_active)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  formData.is_active
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-2xs'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${formData.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
                {formData.is_active ? t('suppliers.active', 'សកម្ម') : t('suppliers.inactive', 'អសកម្ម')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Supplier Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-foreground/90">
                  {t('suppliers.code', 'កូដអ្នកផ្គត់ផ្គង់')} <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={generateAutoCode}
                  className="text-[11px] text-primary hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
                >
                  <Sparkles size={11} />
                  <span>{t('buttons:autoGenerate', t('common.autoGenerate', 'ស្វ័យប្រវត្តិ'))}</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.code}
                onChange={e => setFormField('code', e.target.value)}
                placeholder={t('suppliers.codePlaceholder', 'SPL-001')}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] font-mono uppercase rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            {/* Supplier Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.name', 'ឈ្មោះក្រុមហ៊ុន / អ្នកផ្គត់ផ្គង់')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormField('name', e.target.value)}
                placeholder={t('suppliers.namePlaceholder', 'ឧ. ក្រុមហ៊ុន ភីអូនា អេឡិចត្រូនិក')}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] font-medium rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Tax Number */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.taxNumber', 'លេខសារពើពន្ធ')}
              </label>
              <input
                type="text"
                value={formData.tax_number}
                onChange={e => setFormField('tax_number', e.target.value)}
                placeholder={t('suppliers.taxPlaceholder', '01.002.003.4-005.002')}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] font-mono rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            {/* Business / Supplier Type */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.supplierType', 'ប្រភេទអ្នកផ្គត់ផ្គង់')}
              </label>
              <select
                value={(formData as any).supplier_type || 'distributor'}
                onChange={e => setFormField('supplier_type', e.target.value)}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium cursor-pointer"
              >
                <option value="distributor">{t('suppliers.distributor', 'អ្នកចែកចាយ')}</option>
                <option value="manufacturer">{t('suppliers.manufacturer', 'រោងចក្រផលិតផ្ទាល់')}</option>
                <option value="importer">{t('suppliers.importer', 'តំណាងនាំចូលផ្លូវការ')}</option>
                <option value="service">{t('suppliers.serviceProvider', 'សេវាកម្មដឹកជញ្ជូន')}</option>
                <option value="other">{t('suppliers.other', 'ដៃគូពាណិជ្ជកម្មផ្សេងទៀត')}</option>
              </select>
            </div>

            {/* Partner Tier */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.partnerStatus', 'ស្ថានភាពដៃគូ')}
              </label>
              <select
                value={(formData as any).partner_tier || 'regular'}
                onChange={e => setFormField('partner_tier', e.target.value)}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium cursor-pointer"
              >
                <option value="topTier">{t('suppliers.topTier', 'ដៃគូយុទ្ធសាស្ត្រ')}</option>
                <option value="regular">{t('suppliers.regular', 'ធម្មតា')}</option>
                <option value="new">{t('suppliers.new', 'ថ្មី')}</option>
              </select>
            </div>
          </div>

          {/* Overview / Summary */}
          <div>
            <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
              {t('suppliers.corporateProfile', 'ព័ត៌មានសង្ខេបក្រុមហ៊ុន')}
            </label>
            <textarea
              value={(formData as any).description || formData.notes || ''}
              onChange={e => setFormField('description', e.target.value)}
              rows={2}
              placeholder={t('suppliers.summaryPlaceholder', 'ព័ត៌មានសង្ខេបអំពីសមត្ថភាពផលិត ឬការចែកចាយផលិតផលរបស់អ្នកផ្គត់ផ្គង់...')}
              className="form-input w-full p-3 text-xs sm:text-[13px] resize-none rounded-lg border border-border/80 bg-background leading-relaxed focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>

          {/* Operational Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border/70 bg-muted/15 hover:bg-muted/30 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={e => setFormField('is_active', e.target.checked)}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block">
                  {t('suppliers.active', 'សកម្ម')}
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight block">
                  {t('suppliers.activeDesc', 'បើកដំណើរការសម្រាប់ការបញ្ជាទិញ និងស្តុក')}
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border/70 bg-muted/15 hover:bg-muted/30 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={!!(formData as any).is_strategic}
                onChange={e => setFormField('is_strategic', e.target.checked)}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block">
                  {t('suppliers.isStrategic', 'ដៃគូលក់ដុំ')}
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight block">
                  {t('suppliers.strategicDesc', 'អាទិភាពខ្ពស់ក្នុងការផ្គត់ផ្គង់')}
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border/70 bg-muted/15 hover:bg-muted/30 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={!!(formData as any).direct_delivery}
                onChange={e => setFormField('direct_delivery', e.target.checked)}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block">
                  {t('suppliers.directDelivery', 'ដឹកជញ្ជូនផ្ទាល់')}
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight block">
                  {t('suppliers.directDeliveryDesc', 'ដឹកដល់ឃ្លាំងដោយផ្ទាល់')}
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border/70 bg-muted/15 hover:bg-muted/30 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={!!(formData as any).credit_payment}
                onChange={e => setFormField('credit_payment', e.target.checked)}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block">
                  {t('suppliers.creditPayment', 'ឥណទានទូទាត់')}
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight block">
                  {t('suppliers.creditPaymentDesc', 'អនុញ្ញាតទូទាត់ក្រោយ')}
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* ─── ព័ត៌មានទំនាក់ទំនង & គេហទំព័រ (Contact Details & Web) ─── */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-border/60">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">
                {t('suppliers.tabContact', 'ព័ត៌មានទំនាក់ទំនង & គេហទំព័រ')}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {t('suppliers.contactInfoDesc', 'ទូរស័ព្ទក្រុមហ៊ុន អ៊ីមែលចម្បង ទូរសារ និងប្រព័ន្ធទំនាក់ទំនងបម្រើអតិថិជន')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primary Email */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.email', 'អ៊ីមែលចម្បង')}
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormField('email', e.target.value)}
                  placeholder={t('suppliers.emailPlaceholder', 'sales@supplier.com')}
                  className="form-input w-full h-9 pl-9 pr-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>

            {/* Primary Telephone */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.phone', 'លេខទូរស័ព្ទ')}
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormField('phone', e.target.value)}
                  placeholder={t('suppliers.phonePlaceholder', '+855 12 345 678')}
                  className="form-input w-full h-9 pl-9 pr-3 py-1.5 text-xs sm:text-[13px] font-mono rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>

            {/* Fax Number */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.fax', 'លេខទូរសារ')}
              </label>
              <input
                type="text"
                value={formData.fax}
                onChange={e => setFormField('fax', e.target.value)}
                placeholder={t('suppliers.faxPlaceholder', '+855 23 888 999')}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] font-mono rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.website', 'គេហទំព័រផ្លូវការ')}
              </label>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="url"
                  value={(formData as any).website || ''}
                  onChange={e => setFormField('website', e.target.value)}
                  placeholder={t('suppliers.websitePlaceholder', 'https://www.supplier.com')}
                  className="form-input w-full h-9 pl-9 pr-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>

            {/* Hotline */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.hotline', 'ទូរស័ព្ទទាន់ហេតុការណ៍')}
              </label>
              <input
                type="text"
                value={(formData as any).hotline || ''}
                onChange={e => setFormField('hotline', e.target.value)}
                placeholder={t('suppliers.hotlinePlaceholder', '+855 23 999 000')}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] font-mono rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            {/* Support Email */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.supportEmail', 'អ៊ីមែលផ្នែកបម្រើអតិថិជន')}
              </label>
              <input
                type="email"
                value={(formData as any).support_email || ''}
                onChange={e => setFormField('support_email', e.target.value)}
                placeholder={t('suppliers.supportEmailPlaceholder', 'rma@supplier.com')}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* ─── ទីតាំង & អាសយដ្ឋានដឹកជញ្ជូន (Location & Address) ─── */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-border/60">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">
                {t('suppliers.tabLocation', 'ទីតាំង & អាសយដ្ឋាន')}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {t('suppliers.locationDesc', 'អាសយដ្ឋានជាក់ស្តែងសម្រាប់ការដឹកជញ្ជូនឃ្លាំង វិក្កយបត្រ និងការបញ្ជូនទំនិញ')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.address', 'អាសយដ្ឋានផ្លូវ / អគារ')}
              </label>
              <textarea
                value={formData.address}
                onChange={e => setFormField('address', e.target.value)}
                rows={2}
                placeholder={t('suppliers.addressPlaceholder', 'អគារលេខ ១២, ផ្លូវ ២៧១, សង្កាត់បឹងទំពុន, ខណ្ឌមានជ័យ...')}
                className="form-input w-full p-3 text-xs sm:text-[13px] resize-none rounded-lg border border-border/80 bg-background leading-relaxed focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                  {t('suppliers.city', 'រាជធានី / ក្រុង')}
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormField('city', e.target.value)}
                  placeholder={t('suppliers.cityPlaceholder', 'ភ្នំពេញ')}
                  className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                  {t('suppliers.province', 'ខេត្ត / រដ្ឋ')}
                </label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={e => setFormField('province', e.target.value)}
                  placeholder={t('suppliers.provincePlaceholder', 'ភ្នំពេញ')}
                  className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                  {t('suppliers.country', 'ប្រទេស')}
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={e => setFormField('country', e.target.value)}
                  placeholder={t('suppliers.countryPlaceholder', 'កម្ពុជា')}
                  className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                  {t('suppliers.postalCode', 'កូដប្រៃសណីយ៍')}
                </label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={e => setFormField('postal_code', e.target.value)}
                  placeholder={t('suppliers.postalCodePlaceholder', '12000')}
                  className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] font-mono rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── ព័ត៌មានធនាគារ & លក្ខខណ្ឌទូទាត់ (Banking Details & Payment Terms) ─── */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-border/60">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">
                {t('suppliers.tabBanking', 'ព័ត៌មានធនាគារ & លក្ខខណ្ឌទូទាត់')}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {t('suppliers.bankingDesc', 'គណនីធនាគារសម្រាប់ទូទាត់ប្រាក់ ឈ្មោះម្ចាស់គណនី រូបិយប័ណ្ណ និងលក្ខខណ្ឌឥណទាន')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.bankName', 'ឈ្មោះធនាគារ')}
              </label>
              <input
                type="text"
                value={formData.bank_name}
                onChange={e => setFormField('bank_name', e.target.value)}
                placeholder={t('suppliers.bankNamePlaceholder', 'ABA Bank / Canadia Bank')}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.bankAccountNumber', 'លេខគណនីធនាគារ')}
              </label>
              <input
                type="text"
                value={formData.bank_account_number}
                onChange={e => setFormField('bank_account_number', e.target.value)}
                placeholder={t('suppliers.bankAccountPlaceholder', '000 123 456')}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] font-mono rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.bankAccountName', 'ឈ្មោះម្ចាស់គណនី')}
              </label>
              <input
                type="text"
                value={formData.bank_account_name}
                onChange={e => setFormField('bank_account_name', e.target.value)}
                placeholder={t('suppliers.bankBeneficiaryPlaceholder', 'PT Pioneer Electronics Co., Ltd.')}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.swiftCode', 'លេខកូដ SWIFT / BIC')}
              </label>
              <input
                type="text"
                value={(formData as any).swift_code || ''}
                onChange={e => setFormField('swift_code', e.target.value)}
                placeholder={t('suppliers.swiftPlaceholder', 'ABAAKHPP')}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] font-mono uppercase rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.currency', 'រូបិយប័ណ្ណទូទាត់')}
              </label>
              <select
                value={(formData as any).currency || 'USD'}
                onChange={e => setFormField('currency', e.target.value)}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium cursor-pointer"
              >
                <option value="USD">{t('suppliers.currencyUsd', 'USD ($ - ដុល្លារអាមេរិក)')}</option>
                <option value="KHR">{t('suppliers.currencyKhr', 'KHR (៛ - រៀលខ្មែរ)')}</option>
                <option value="CNY">{t('suppliers.currencyCny', 'CNY (¥ - យ័នចិន)')}</option>
                <option value="THB">{t('suppliers.currencyThb', 'THB (฿ - បាតថៃ)')}</option>
                <option value="VND">{t('suppliers.currencyVnd', 'VND (₫ - ដុងវៀតណាម)')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.paymentTerms', 'លក្ខខណ្ឌឥណទានទូទាត់')}
              </label>
              <select
                value={(formData as any).payment_terms || 'Net 30'}
                onChange={e => setFormField('payment_terms', e.target.value)}
                className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium cursor-pointer"
              >
                <option value="Cash on Delivery">{t('suppliers.paymentCod', 'ទូទាត់ពេលទទួលទំនិញ')}</option>
                <option value="Net 15">{t('suppliers.paymentNet15', 'រយៈពេលឥណទាន ១៥ ថ្ងៃ')}</option>
                <option value="Net 30">{t('suppliers.paymentNet30', 'រយៈពេលឥណទាន ៣០ ថ្ងៃ')}</option>
                <option value="Net 60">{t('suppliers.paymentNet60', 'រយៈពេលឥណទាន ៦០ ថ្ងៃ')}</option>
                <option value="Advance Payment">{t('suppliers.paymentAdvance', 'ទូទាត់មុន ១០០%')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* ─── តំណាងអ្នកផ្គត់ផ្គង់ & បុគ្គលិកទំនាក់ទំនង (Representatives & Contacts) ─── */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
                <User size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-foreground">
                  {t('suppliers.tabRepresentatives', 'តំណាងអ្នកផ្គត់ផ្គង់ & បុគ្គលិកទំនាក់ទំនង')}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {t('suppliers.representativesDesc', 'បុគ្គលិកផ្នែកលក់ អ្នកគ្រប់គ្រងគណនី និងអ្នកសម្របសម្រួលដឹកជញ្ជូន')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={addContactRow}
              className="h-8 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Plus size={14} /> {t('suppliers.addContact', 'បន្ថែមបុគ្គលិកទំនាក់ទំនង')}
            </button>
          </div>

          {contacts.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-border/80 rounded-xl bg-muted/10">
              <User size={30} className="mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                {t('suppliers.noContactsYet', 'មិនទាន់មានតំណាងទំនាក់ទំនងនៅឡើយទេ។ ចុច "+ បន្ថែមទំនាក់ទំនង" ខាងលើ។')}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 max-w-sm mx-auto">
                {t('suppliers.noContactsSub', 'បន្ថែមអ្នកគ្រប់គ្រងផ្នែកលក់ ឬអ្នកសម្របសម្រួលដឹកជញ្ជូន ដើម្បីងាយស្រួលទាក់ទងពេលបញ្ជាទិញ។')}
              </p>
              <button
                type="button"
                onClick={addContactRow}
                className="mt-3 px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <Plus size={14} /> {t('suppliers.addContact', 'បន្ថែមបុគ្គលិកទំនាក់ទំនង')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map((c, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-muted/20 border border-border/80 rounded-2xl space-y-4 relative hover:border-border transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                        <User size={14} />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {c.name ? c.name : t('suppliers.contactPerson', 'អ្នកទំនាក់ទំនង')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeContactRow(idx)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                      title={t('common.delete', 'លុប')}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('suppliers.contactName', 'ឈ្មោះពេញ')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={c.name}
                        onChange={e => updateContactField(idx, 'name', e.target.value)}
                        placeholder={t('suppliers.contactNamePlaceholder', 'ឧ. សុខ ចិន្តា')}
                        required
                        className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('suppliers.contactTitle', 'តួនាទី / មុខតំណែង')}
                      </label>
                      <input
                        type="text"
                        value={c.title || (c as any).position || ''}
                        onChange={e => updateContactField(idx, 'title', e.target.value)}
                        placeholder={t('suppliers.contactRolePlaceholder', 'អ្នកគ្រប់គ្រងផ្នែកលក់')}
                        className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('suppliers.email', 'អាសយដ្ឋានអ៊ីមែល')}
                      </label>
                      <input
                        type="email"
                        value={c.email || ''}
                        onChange={e => updateContactField(idx, 'email', e.target.value)}
                        placeholder={t('suppliers.emailPlaceholder', 'sales@example.com')}
                        className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('suppliers.phone', 'លេខទូរស័ព្ទ')}
                      </label>
                      <input
                        type="text"
                        value={c.phone || ''}
                        onChange={e => updateContactField(idx, 'phone', e.target.value)}
                        placeholder={t('suppliers.phonePlaceholder', '+855 12 888 777')}
                        className="form-input w-full h-9 px-3 py-1.5 text-xs sm:text-[13px] font-mono rounded-lg border border-border/80 bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── កំណត់ចំណាំ & កិច្ចព្រមព្រៀងផ្គត់ផ្គង់ (Notes & Guidelines) ─── */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-border/60">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">
                {t('suppliers.tabTerms', 'កំណត់ចំណាំ & កិច្ចព្រមព្រៀងផ្គត់ផ្គង់')}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {t('suppliers.notesDesc', 'កិច្ចព្រមព្រៀងអ្នកផ្គត់ផ្គង់ ការណែនាំអំពីការដឹកជញ្ជូន គោលការណ៍ធានា និងកំណត់ចំណាំផ្ទៃក្នុង')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                {t('suppliers.notesPlaceholder', 'បញ្ចូលលក្ខខណ្ឌផ្គត់ផ្គង់សំខាន់ៗ កាលវិភាគទូទាត់ ឬកំណត់ចំណាំបន្ថែម...')}
              </label>
              <textarea
                value={formData.notes}
                onChange={e => setFormField('notes', e.target.value)}
                rows={4}
                placeholder={t('suppliers.notesPlaceholder', 'បញ្ចូលលក្ខខណ្ឌផ្គត់ផ្គង់សំខាន់ៗ កាលវិភាគទូទាត់ ឬកំណត់ចំណាំបន្ថែម...')}
                className="form-input w-full p-3 text-xs sm:text-[13px] resize-none rounded-lg border border-border/80 bg-background leading-relaxed focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-primary/10 border border-primary/20 flex items-start gap-3">
              <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  {t('suppliers.procurementPartner', 'ការរួមបញ្ចូលប្រព័ន្ធបញ្ជាទិញ & ខ្សែសង្វាក់ផ្គត់ផ្គង់')}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  {t('suppliers.guidelineText', 'ព័ត៌មានអ្នកផ្គត់ផ្គង់នេះនឹងត្រូវបានប្រើប្រាស់ដោយផ្ទាល់នៅក្នុងការបញ្ជាទិញ (PO), ប័ណ្ណទទួលទំនិញចូលស្តុក (GRN) និងការទូទាត់។')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Sticky Form Footer */}
        <FormFooter
          cancelPath="/suppliers"
          cancelLabel={t('common.cancel', 'បោះបង់')}
          isSubmitting={isSubmitting}
          submitLabel={isEdit ? t('suppliers.saveChanges', 'រក្សាទុកការផ្លាស់ប្តូរ') : t('suppliers.addSupplier', 'បង្កើតអ្នកផ្គត់ផ្គង់')}
          infoSummary={
            formData.name ? (
              <span>
                {t('suppliers.tableSupplier', 'អ្នកផ្គត់ផ្គង់')}: <strong className="text-foreground font-semibold">"{formData.name}"</strong>
              </span>
            ) : (
              <span>{isEdit ? t('suppliers.editSubtitle', 'ធ្វើបច្ចុប្បន្នភាពទម្រង់ និងព័ត៌មានអ្នកផ្គត់ផ្គង់') : t('suppliers.createSubtitle', 'បំពេញព័ត៌មានដើម្បីចុះឈ្មោះអ្នកផ្គត់ផ្គង់ថ្មី')}</span>
            )
          }
        />
      </form>

      {/* Live Preview Slide-over Drawer */}
      <SupplierLivePreviewDrawer
        isOpen={isLivePreviewOpen}
        onClose={() => setIsLivePreviewOpen(false)}
        formData={formData}
        contacts={contacts}
      />
    </div>
  )
}

export default SupplierFormPage
