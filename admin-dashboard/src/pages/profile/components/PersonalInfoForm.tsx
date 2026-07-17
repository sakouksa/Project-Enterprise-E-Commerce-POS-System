import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { UserProfile } from '@/services/profileService'

const personalInfoSchema = z.object({
  name: z.string().min(2, 'profile.personal_tab.name_required').max(100),
  email: z.string().email('profile.personal_tab.email_invalid'),
  phone: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  date_of_birth: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  province: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
})

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>

interface PersonalInfoFormProps {
  profile: UserProfile
  onSave: (data: PersonalInfoFormData) => void
  isSaving: boolean
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  profile,
  onSave,
  isSaving,
}) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone ?? '',
      gender: profile.gender ?? '',
      date_of_birth: profile.date_of_birth ?? '',
      address: profile.address ?? '',
      country: profile.country ?? '',
      province: profile.province ?? '',
      city: profile.city ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSave)} className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-foreground pb-4 border-b border-border/40">
        {t('profile.personal_information', 'Personal Information')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            {t('profile.personal_tab.full_name', 'Full Name')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('name')}
            className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
              errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-border'
            }`}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{t(errors.name.message || '')}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            {t('profile.personal_tab.email', 'Email Address')} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            {...register('email')}
            className={`w-full px-4 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
              errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-border'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{t(errors.email.message || '')}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            {t('profile.personal_tab.phone', 'Phone Number')}
          </label>
          <input
            type="text"
            {...register('phone')}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            {t('profile.personal_tab.gender', 'Gender')}
          </label>
          <select
            {...register('gender')}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="">{t('profile.personal_tab.select_gender', 'Select Gender')}</option>
            <option value="male">{t('profile.personal_tab.male', 'Male')}</option>
            <option value="female">{t('profile.personal_tab.female', 'Female')}</option>
            <option value="other">{t('profile.personal_tab.other', 'Other')}</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            {t('profile.personal_tab.dob', 'Date of Birth')}
          </label>
          <input
            type="date"
            {...register('date_of_birth')}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            {t('profile.personal_tab.country', 'Country')}
          </label>
          <input
            type="text"
            {...register('country')}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Province */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            {t('profile.personal_tab.province', 'Province / State')}
          </label>
          <input
            type="text"
            {...register('province')}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            {t('profile.personal_tab.city', 'City')}
          </label>
          <input
            type="text"
            {...register('city')}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Address (Full-width) */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            {t('profile.personal_tab.address', 'Street Address')}
          </label>
          <textarea
            {...register('address')}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          />
        </div>

        {/* Read-only Company Info */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            {t('profile.personal_tab.company', 'Company Association')}
          </label>
          <input
            type="text"
            value={profile.company?.name ?? 'N/A'}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-muted/65 text-muted-foreground text-sm cursor-not-allowed"
          />
        </div>

        {/* Read-only Branch Info */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            {t('profile.personal_tab.branch', 'Assigned Branch')}
          </label>
          <input
            type="text"
            value={profile.branch?.name ?? 'N/A'}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-muted/65 text-muted-foreground text-sm cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border/40">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-sm font-semibold transition-colors duration-200 shadow-sm disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {t('profile.personal_tab.save_changes', 'Save Changes')}
        </button>
      </div>
    </form>
  )
}
