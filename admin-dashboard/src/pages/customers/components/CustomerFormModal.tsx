import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
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
  Info
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Customer } from '../types'

interface CustomerFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingCustomer: Customer | null
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  register: any
  errors: any
  companies?: any[]
  groups?: any[]
  users?: any[]
  photoPreview: string | null
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removePhoto: () => void
  watch?: any
  setValue?: any
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  editingCustomer,
  onSubmit,
  isSubmitting,
  register,
  errors,
  companies = [],
  groups = [],
  users = [],
  photoPreview,
  onPhotoChange,
  removePhoto,
  watch
}) => {
  const { t } = useTranslation(['customers', 'common'])

  const watchedValues = watch ? watch() : {}
  const selectedGroupId = watchedValues?.customer_group_id
  const selectedGroup = groups.find((g: any) => String(g.id) === String(selectedGroupId))

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border/80 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* ─── MODAL HEADER ─── */}
            <div className="px-5 py-3.5 border-b border-border/80 flex items-center justify-between bg-muted/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold shadow-2xs">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                    <span>
                      {editingCustomer
                        ? t('customers.editCustomerProfile', 'កែសម្រួលប្រវត្តិរូបអតិថិជន')
                        : t('customers.registerCustomer', 'ចុះឈ្មោះអតិថិជនថ្មី')}
                    </span>
                    {editingCustomer && (
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
                        #{editingCustomer.id}
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {t('customers.formSubtitle', 'គ្រប់គ្រង និងបំពេញព័ត៌មានអតិថិជនតាម ៥ ផ្នែកក្នុងប្រព័ន្ធ CRM')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center cursor-pointer"
                title={t('common.close', 'បិទ')}
              >
                <X size={16} />
              </button>
            </div>

            {/* ─── SCROLLABLE 5-SECTION FORM BODY ─── */}
            <form onSubmit={onSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                
                {/* ══════════════════════════════════════════════════
                    ផ្នែកទី ១: ព័ត៌មានទូទៅ & រូបថត (SECTION 1)
                ══════════════════════════════════════════════════ */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2.5 pb-1 border-b border-border/60">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                      1
                    </span>
                    <User size={16} className="text-primary shrink-0" />
                    <h4 className="text-xs sm:text-[13px] font-bold text-foreground">
                      {t('customers.formTabGeneral', 'ព័ត៌មានទូទៅ & រូបថត')}
                    </h4>
                  </div>

                  <div className="p-4 rounded-xl border border-border/80 bg-muted/10 space-y-4">
                    {/* Profile Photo Upload */}
                    <div className="p-3.5 rounded-xl border border-border/80 bg-background/80 flex flex-col sm:flex-row items-center gap-4">
                      {photoPreview ? (
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-border/80 group shadow-xs shrink-0 bg-background">
                          <img src={photoPreview} alt="Customer Avatar" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            <label className="p-1.5 bg-card/80 hover:bg-card text-foreground rounded-lg cursor-pointer transition-colors" title={t('customers.changePhoto', 'ប្តូររូបថត')}>
                              <Camera size={13} />
                              <input type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
                            </label>
                            <button
                              type="button"
                              onClick={removePhoto}
                              className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg cursor-pointer transition-colors"
                              title={t('customers.removePhoto', 'លុបរូបថត')}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="w-full sm:w-auto flex-1 border-2 border-dashed border-border/80 hover:border-primary/50 rounded-xl p-3 flex items-center justify-center gap-3 cursor-pointer bg-muted/10 hover:bg-muted/30 transition-all">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <UploadCloud size={16} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-foreground block">
                              {t('customers.clickUploadPhoto', 'ចុចដើម្បីបង្ហោះរូបថត')}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {t('customers.photoHint', 'PNG, JPG ឬ WEBP (ទំហំអតិបរមា 2MB)')}
                            </span>
                          </div>
                          <input type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
                        </label>
                      )}

                      {photoPreview && (
                        <div className="text-xs text-muted-foreground space-y-0.5 text-center sm:text-left">
                          <span className="font-bold text-foreground block text-xs">
                            {t('customers.photoUpload', 'រូបថតប្រវត្តិរូប')}
                          </span>
                          <p className="text-[11px] text-muted-foreground">
                            {t('customers.photoHint', 'PNG, JPG ឬ WEBP (ទំហំអតិបរមា 2MB)')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Customer Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1">
                        {t('customers.fullName', 'ឈ្មោះពេញអតិថិជន')} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <User size={15} />
                        </div>
                        <input
                          type="text"
                          {...register('name', { required: t('customers.validation.nameRequired', 'តម្រូវឱ្យបញ្ចូលឈ្មោះអតិថិជន') })}
                          placeholder={t('customers.namePlaceholder', t('namePlaceholder', 'ឧ. សុខ ចាន់ដារ៉ា'))}
                          className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      {errors.name && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name.message}</p>}
                    </div>

                    {/* Gender & Date of Birth */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-foreground/90 mb-1">
                          {t('customers.gender', t('gender', 'ភេទ'))}
                        </label>
                        <select
                          {...register('gender')}
                          className="form-input w-full h-9 px-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer font-medium"
                        >
                          <option value="">{t('customers.selectGender', t('selectGender', 'ជ្រើសរើសភេទ'))}</option>
                          <option value="male">{t('customers.genderMale', t('genderMale', 'ប្រុស'))}</option>
                          <option value="female">{t('customers.genderFemale', t('genderFemale', 'ស្រី'))}</option>
                          <option value="other">{t('customers.genderOther', t('genderOther', 'ផ្សេងទៀត'))}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground/90 mb-1">
                          {t('customers.birthDate', 'ថ្ងៃខែឆ្នាំកំណើត')}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <Calendar size={15} />
                          </div>
                          <input
                            type="date"
                            {...register('birth_date')}
                            className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Active Status Switch */}
                    <div className="p-3 bg-background/80 border border-border/80 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label htmlFor="custActive" className="text-xs font-bold text-foreground cursor-pointer select-none">
                          {t('customers.activeCustomerAccount', 'គណនីអតិថិជនសកម្ម')}
                        </label>
                        <p className="text-[11px] text-muted-foreground">
                          {t('customers.activeAccountHelp', 'អនុញ្ញាតឱ្យអតិថិជននេះអាចទិញទំនិញ និងប្រើប្រាស់សេវាកម្មក្នុងប្រព័ន្ធ')}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        id="custActive"
                        {...register('is_active')}
                        className="form-checkbox h-4.5 w-4.5 text-primary rounded border-border focus:ring-primary cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    ផ្នែកទី ២: ទំនាក់ទំនង & គណនី (SECTION 2)
                ══════════════════════════════════════════════════ */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2.5 pb-1 border-b border-border/60">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                      2
                    </span>
                    <Phone size={16} className="text-primary shrink-0" />
                    <h4 className="text-xs sm:text-[13px] font-bold text-foreground">
                      {t('customers.formTabContact', 'ទំនាក់ទំនង & គណនី')}
                    </h4>
                  </div>

                  <div className="p-4 rounded-xl border border-border/80 bg-muted/10 space-y-4">
                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-foreground/90 mb-1">
                          {t('customers.email', 'អាសយដ្ឋានអ៊ីមែល')}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <Mail size={15} />
                          </div>
                          <input
                            type="email"
                            {...register('email')}
                            placeholder={t('customers.emailPlaceholder', 'customer@example.com')}
                            className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground/90 mb-1">
                          {t('customers.phone', 'លេខទូរស័ព្ទ')}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <Phone size={15} />
                          </div>
                          <input
                            type="text"
                            {...register('phone')}
                            placeholder={t('customers.phonePlaceholder', '012 345 678 / +855...')}
                            className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Company Branch & Linked User Account */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-foreground/90 mb-1">
                          {t('customers.selectCompany', 'ក្រុមហ៊ុន / សាខាប្រតិបត្តិការ')}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <Building2 size={15} />
                          </div>
                          <select
                            {...register('company_id')}
                            className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer font-medium"
                          >
                            {companies.map((c: any) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground/90 mb-1">
                          {t('customers.selectUser', t('selectUser', 'គណនីអ្នកប្រើប្រាស់ក្នុងប្រព័ន្ធ'))}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <Shield size={15} />
                          </div>
                          <select
                            {...register('user_id')}
                            className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer font-medium"
                          >
                            <option value="">{t('customers.noLinkedUser', t('noLinkedUser', 'មិនទាន់ភ្ជាប់គណនីអ្នកប្រើប្រាស់'))}</option>
                            {users.map((u: any) => (
                              <option key={u.id} value={u.id}>
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
                    ផ្នែកទី ៣: ក្រុម & សមាជិកភាព (SECTION 3)
                ══════════════════════════════════════════════════ */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2.5 pb-1 border-b border-border/60">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                      3
                    </span>
                    <Award size={16} className="text-primary shrink-0" />
                    <h4 className="text-xs sm:text-[13px] font-bold text-foreground">
                      {t('customers.formTabGroup', t('formTabGroup', 'ក្រុម & សមាជិកភាព'))}
                    </h4>
                  </div>

                  <div className="p-4 rounded-xl border border-border/80 bg-muted/10 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1">
                        {t('customers.customerGroup', t('customerGroup', 'ក្រុមអតិថិជន'))}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Award size={15} />
                        </div>
                        <select
                          {...register('customer_group_id')}
                          className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer font-medium"
                        >
                          <option value="">{t('customers.noSpecialGroup', t('noSpecialGroup', 'ក្រុមទូទៅ (Standard)'))}</option>
                          {groups.map((g: any) => (
                            <option key={g.id} value={g.id}>
                              {g.name} {g.discount_percent ? `(បញ្ចុះតម្លៃ ${g.discount_percent}%)` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Group Benefits Information Card */}
                    <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-1.5">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs">
                        <Sparkles size={15} />
                        <span>{t('customers.groupBenefits', t('groupBenefits', 'អត្ថប្រយោជន៍សមាជិកភាព'))}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
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
                    ផ្នែកទី ៤: ហិរញ្ញវត្ថុ & ពន្ធដារ (SECTION 4)
                ══════════════════════════════════════════════════ */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2.5 pb-1 border-b border-border/60">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                      4
                    </span>
                    <CreditCard size={16} className="text-primary shrink-0" />
                    <h4 className="text-xs sm:text-[13px] font-bold text-foreground">
                      {t('customers.formTabFinancial', t('formTabFinancial', 'ហិរញ្ញវត្ថុ & ពន្ធដារ'))}
                    </h4>
                  </div>

                  <div className="p-4 rounded-xl border border-border/80 bg-muted/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Credit Limit */}
                      <div>
                        <label className="block text-xs font-semibold text-foreground/90 mb-1">
                          {t('customers.creditLimit', t('creditLimit', 'កម្រិតឥណទាន ($)'))}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <DollarSign size={15} />
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            {...register('credit_limit')}
                            placeholder="1000.00"
                            className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-mono font-medium"
                          />
                        </div>
                      </div>

                      {/* Tax Number */}
                      <div>
                        <label className="block text-xs font-semibold text-foreground/90 mb-1">
                          {t('customers.taxNumber', t('taxNumber', 'លេខសម្គាល់សារពើពន្ធ (TIN / TAX ID)'))}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <Receipt size={15} />
                          </div>
                          <input
                            type="text"
                            {...register('tax_number')}
                            placeholder="TAX-90124"
                            className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-mono font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Credit Policy Info Card */}
                    <div className="p-3 bg-background/80 border border-border/80 rounded-xl space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Info size={14} className="text-primary" />
                        <span>{t('customers.creditPolicyTitle', 'គោលការណ៍ឥណទាន និងពន្ធដារ')}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {t('customers.creditPolicyDesc', 'កម្រិតឥណទានអតិបរមាអនុញ្ញាតឱ្យអតិថិជនទិញជំពាក់លើការបញ្ជាទិញ និងវិក្កយបត្រ POS។')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    ផ្នែកទី ៥: កំណត់ចំណាំ & សង្ខេប (SECTION 5)
                ══════════════════════════════════════════════════ */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2.5 pb-1 border-b border-border/60">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                      5
                    </span>
                    <FileText size={16} className="text-primary shrink-0" />
                    <h4 className="text-xs sm:text-[13px] font-bold text-foreground">
                      {t('customers.formTabNotes', 'កំណត់ចំណាំ & សង្ខេប')}
                    </h4>
                  </div>

                  <div className="p-4 rounded-xl border border-border/80 bg-muted/10 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1">
                        {t('customers.internalNotes', 'កំណត់ចំណាំផ្ទៃក្នុង')}
                      </label>
                      <textarea
                        {...register('notes')}
                        rows={3}
                        placeholder={t('customers.notesPlaceholder', 'ចំណូលចិត្តរបស់អតិថិជន ឬកំណត់ចំណាំបន្ថែមសម្រាប់ការថែទាំ...')}
                        className="form-input w-full p-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* ─── MODAL FOOTER ─── */}
              <div className="px-5 py-3.5 border-t border-border/80 bg-muted/20 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 px-4 text-xs sm:text-[13px] font-bold border border-border/80 bg-card rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  {t('common.cancel', 'បោះបង់')}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 px-5 text-xs sm:text-[13px] bg-primary text-primary-foreground rounded-lg font-bold shadow-xs hover:bg-primary/90 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>
                    {editingCustomer
                      ? t('customers.saveChanges', t('saveChanges', 'រក្សាទុកការផ្លាស់ប្តូរ'))
                      : t('customers.saveCustomer', t('saveCustomer', 'រក្សាទុកអតិថិជន'))}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CustomerFormModal
