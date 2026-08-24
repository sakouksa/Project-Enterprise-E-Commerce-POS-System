import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  User,
  Phone,
  Mail,
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Shield,
  Upload,
  Camera,
  Trash2,
  Sparkles,
  CheckCircle2,
  Info,
  Loader2,
  Check,
  UserCheck,
  Building
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import { FormHeader, FormFooter, LoadingSpinner } from '@/components/common'
import CustomErrorMessage from '@/components/ui/CustomErrorMessage'
import { getAbsoluteImageUrl } from '@/utils/image'

export interface EmployeeFormData {
  company_id: string
  branch_id: string
  department_id: string
  position_id: string
  user_id: string
  employee_number: string
  name: string
  email: string
  phone: string
  nik: string
  gender: string
  birth_date: string
  address: string
  photo: string
  join_date: string
  resign_date: string
  status: 'active' | 'inactive' | 'resigned'
  basic_salary: string
}

const BLANK_EMPLOYEE_FORM: EmployeeFormData = {
  company_id: '1',
  branch_id: '1',
  department_id: '',
  position_id: '',
  user_id: '',
  employee_number: `EMP${Math.floor(100000 + Math.random() * 900000)}`,
  name: '',
  email: '',
  phone: '',
  nik: '',
  gender: 'male',
  birth_date: '',
  address: '',
  photo: '',
  join_date: new Date().toISOString().split('T')[0],
  resign_date: '',
  status: 'active',
  basic_salary: '',
}

export const EmployeeFormPage: React.FC = () => {
  const { t } = useTranslation(['employees', 'common', 'nav'])
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const employeeId = id ? parseInt(id) : null
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()

  const [formData, setFormData] = useState<EmployeeFormData>(BLANK_EMPLOYEE_FORM)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const setFormField = (field: keyof EmployeeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateAutoCode = () => {
    setFormField('employee_number', `EMP${Math.floor(100000 + Math.random() * 900000)}`)
  }

  // Fetch employee details if editing
  const {
    data: employeeDetail,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    error: detailError,
    refetch: refetchDetail,
  } = useQuery({
    queryKey: ['employee-detail', employeeId],
    queryFn: () => (employeeId ? api.get(`/employees/${employeeId}`).then(r => r.data.data) : null),
    enabled: isEdit && !isNaN(employeeId as number),
  })

  // Queries for Dropdowns
  const { data: companies = [] } = useQuery({
    queryKey: ['companies-list-dropdown'],
    queryFn: () => api.get('/companies', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: branches = [] } = useQuery({
    queryKey: ['branches-list-dropdown'],
    queryFn: () => api.get('/branches', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: departments = [] } = useQuery({
    queryKey: ['departments-list-dropdown'],
    queryFn: () => api.get('/departments', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: positions = [] } = useQuery({
    queryKey: ['positions-list-dropdown'],
    queryFn: () => api.get('/positions', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: users = [] } = useQuery({
    queryKey: ['users-list-dropdown'],
    queryFn: () => api.get('/users', { params: { per_page: 200 } }).then(r => r.data.data ?? []),
  })

  // Populate data in edit mode
  useEffect(() => {
    if (employeeDetail) {
      setFormData({
        company_id: employeeDetail.company_id?.toString() || '1',
        branch_id: employeeDetail.branch_id?.toString() || '1',
        department_id: employeeDetail.department_id?.toString() || '',
        position_id: employeeDetail.position_id?.toString() || '',
        user_id: employeeDetail.user_id?.toString() || '',
        employee_number: employeeDetail.employee_number || '',
        name: employeeDetail.name || '',
        email: employeeDetail.email || '',
        phone: employeeDetail.phone || '',
        nik: employeeDetail.nik || '',
        gender: employeeDetail.gender || 'male',
        birth_date: employeeDetail.birth_date ? employeeDetail.birth_date.split('T')[0] : '',
        address: employeeDetail.address || '',
        photo: employeeDetail.photo || '',
        join_date: employeeDetail.join_date ? employeeDetail.join_date.split('T')[0] : '',
        resign_date: employeeDetail.resign_date ? employeeDetail.resign_date.split('T')[0] : '',
        status: employeeDetail.status || 'active',
        basic_salary: employeeDetail.basic_salary != null ? String(parseFloat(employeeDetail.basic_salary)) : '',
      })

      if (employeeDetail.photo) {
        setPhotoPreview(getAbsoluteImageUrl(employeeDetail.photo))
      }
    }
  }, [employeeDetail])

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPhotoPreview(URL.createObjectURL(file))
    const uploadData = new FormData()
    uploadData.append('photo', file)
    setUploadingPhoto(true)

    try {
      const res = await api.post('/employees/upload-photo', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const photoPath = res.data.data.path || res.data.data.url
      setFormField('photo', photoPath)
      toast.success(t('employees.photoUploaded', 'រូបថតបុគ្គលិកត្រូវបានបញ្ចូលជោគជ័យ'))
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t('employees.photoUploadFailed', 'មិនអាចបញ្ចូលរូបថតបានទេ'))
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setFormField('photo', '')
  }

  // Mutation Save
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (isEdit && employeeId) {
        return api.put(`/employees/${employeeId}`, payload)
      }
      return api.post('/employees', payload)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] })
      qc.invalidateQueries({ queryKey: ['employees-list'] })
      qc.invalidateQueries({ queryKey: ['employees/stats'] })
      toast.success(isEdit ? t('employees.updateSuccess', 'បានកែសម្រួលព័ត៌មានបុគ្គលិកជោគជ័យ') : t('employees.createSuccess', 'បានបង្កើតបុគ្គលិកថ្មីជោគជ័យ'))
      navigate('/employees')
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || t('common.saveFailed', 'ការរក្សាទុកទិន្នន័យមិនបានជោគជ័យ')
      toast.error(message)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.warning(t('employees.nameRequired', 'សូមបញ្ចូលឈ្មោះបុគ្គលិក'))
      return
    }

    if (!formData.employee_number.trim()) {
      toast.warning(t('employees.codeRequired', 'សូមបញ្ចូលលេខកូដបុគ្គលិក'))
      return
    }

    const payload: any = {
      company_id: parseInt(formData.company_id) || 1,
      branch_id: parseInt(formData.branch_id) || 1,
      department_id: formData.department_id ? parseInt(formData.department_id) : null,
      position_id: formData.position_id ? parseInt(formData.position_id) : null,
      user_id: formData.user_id ? parseInt(formData.user_id) : null,
      employee_number: formData.employee_number.trim(),
      name: formData.name.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim() || null,
      nik: formData.nik.trim() || null,
      gender: formData.gender || 'male',
      birth_date: formData.birth_date || null,
      address: formData.address.trim() || null,
      photo: formData.photo || null,
      join_date: formData.join_date || null,
      resign_date: formData.resign_date || null,
      status: formData.status,
      basic_salary: formData.basic_salary ? parseFloat(formData.basic_salary) : null,
    }

    saveMutation.mutate(payload)
  }

  if (isEdit && isLoadingDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner />
        <span className="text-xs text-muted-foreground mt-2">{t('employees.loadingDetail', 'កំពុងទាញយកព័ត៌មានបុគ្គលិក...')}</span>
      </div>
    )
  }

  if (isEdit && isErrorDetail) {
    return (
      <div className="p-6">
        <CustomErrorMessage
          title={t('employees.errorLoading', 'មិនអាចទាញយកព័ត៌មានបុគ្គលិកបានទេ')}
          message={detailError?.message || t('common.error', 'An error occurred')}
          onRetry={() => refetchDetail()}
        />
      </div>
    )
  }

  const selectedDept = departments.find((d: any) => String(d.id) === String(formData.department_id))
  const selectedPos = positions.find((p: any) => String(p.id) === String(formData.position_id))
  const selectedBranch = branches.find((b: any) => String(b.id) === String(formData.branch_id))

  const statusBadge = (
    <span
      className={`text-[11px] font-bold px-3 py-1 rounded-full border inline-flex items-center gap-1.5 shadow-2xs ${
        formData.status === 'active'
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
          : formData.status === 'resigned'
          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
          : 'bg-muted dark:bg-slate-800 text-muted-foreground dark:text-slate-400 border-border dark:border-slate-700'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          formData.status === 'active'
            ? 'bg-emerald-500 animate-pulse'
            : formData.status === 'resigned'
            ? 'bg-rose-500'
            : 'bg-muted-foreground'
        }`}
      />
      {formData.status === 'active'
        ? t('employees.active', 'សកម្ម')
        : formData.status === 'resigned'
        ? t('employees.resigned', 'លាឈប់')
        : t('employees.inactive', 'អសកម្ម')}
    </span>
  )

  return (
    <div className="space-y-6 pb-24 w-full">
      {/* Top Form Header */}
      <FormHeader
        isEdit={isEdit}
        title={
          isEdit
            ? (formData.name
                ? t('employees.editEmployeeTitle', 'កែសម្រួលបុគ្គលិក: {{name}}', { name: formData.name })
                : t('employees.editEmployee', 'កែសម្រួលបុគ្គលិក'))
            : t('employees.createEmployeeTitle', 'បង្កើតបុគ្គលិកថ្មី')
        }
        subtitle={
          isEdit
            ? t('employees.editSubtitle', 'ធ្វើបច្ចុប្បន្នភាពទម្រង់ ដេប៉ាតឺម៉ង់ តួនាទី ប្រាក់បៀវត្សរ៍ និងព័ត៌មានបុគ្គលិក')
            : t('employees.createSubtitle', 'បំពេញព័ត៌មានបុគ្គលិក ដេប៉ាតឺម៉ង់ តួនាទី ប្រាក់បៀវត្សរ៍ និងព័ត៌មានទំនាក់ទំនង')
        }
        statusBadge={statusBadge}
        breadcrumbs={[
          { label: t('employees.employee_management', 'គ្រប់គ្រងបុគ្គលិក'), path: '/employees' },
          {
            label: isEdit
              ? t('employees.editEmployee', 'កែសម្រួលបុគ្គលិក')
              : t('employees.createEmployee', 'បន្ថែមថ្មី'),
          },
        ]}
        backPath="/employees"
        backLabel={t('employees.back', 'ត្រឡប់ក្រោយ')}
      />

      {/* Main Form Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        {/* ─── SECTION 1: ព័ត៌មានផ្ទាល់ខ្លួន & រូបថត (Personal Info & Photo Profile) ─── */}
        <div className="bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/60 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
                <User size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-foreground dark:text-slate-100">
                  {t('employees.tabPersonal', 'ព័ត៌មានផ្ទាល់ខ្លួន & រូបថត')}
                </h3>
                <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                  {t('employees.personalDesc', 'រូបថតសម្គាល់ ឈ្មោះពេញ លេខសម្គាល់បុគ្គលិក ភេទ និងថ្ងៃខែឆ្នាំកំណើត')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground dark:text-slate-400 font-medium hidden sm:inline">
                {t('employees.status', 'ស្ថានភាព')}:
              </span>
              <div className="flex items-center p-0.5 bg-muted/60 dark:bg-slate-800/80 rounded-xl border border-border/60 dark:border-slate-700">
                {(['active', 'inactive', 'resigned'] as const).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFormField('status', st)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      formData.status === st
                        ? st === 'active'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : st === 'resigned'
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-slate-700 text-white shadow-xs'
                        : 'text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-slate-200'
                    }`}
                  >
                    {st === 'active'
                      ? t('employees.active', 'សកម្ម')
                      : st === 'resigned'
                      ? t('employees.resigned', 'លាឈប់')
                      : t('employees.inactive', 'អសកម្ម')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Photo Avatar Upload */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 border border-dashed border-border/80 dark:border-slate-700/80 rounded-2xl bg-muted/10 dark:bg-slate-800/30 text-center relative group">
              <div className="relative mb-3.5">
                <div className="w-28 h-28 rounded-2xl bg-muted/40 dark:bg-slate-800 border-2 border-border/80 dark:border-slate-700 overflow-hidden flex items-center justify-center shadow-inner">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Employee Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-muted-foreground/40 dark:text-slate-500" />
                  )}
                </div>
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                    <Loader2 size={24} className="animate-spin text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-1 mb-3">
                <h4 className="text-xs font-bold text-foreground dark:text-slate-200">
                  {t('employees.profilePhoto', 'រូបថតបុគ្គលិក')}
                </h4>
                <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                  {t('employees.photoNote', 'PNG, JPG, WEBP (អតិបរមា 5MB)')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="h-9 px-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95">
                  <Camera size={14} />
                  <span>{photoPreview ? t('employees.changePhoto', 'ប្តូររូបថត') : t('employees.uploadPhoto', 'បញ្ចូលរូបថត')}</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="h-9 px-3 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                    title={t('employees.delete', 'លុប')}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* General Fields */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Employee Number / Code */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200">
                    {t('employees.employee_number', 'លេខសម្គាល់បុគ្គលិក')} <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateAutoCode}
                    className="text-[11px] text-primary hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
                  >
                    <Sparkles size={11} />
                    <span>{t('employees.autoGenerate', 'ស្វ័យប្រវត្តិ')}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.employee_number}
                  onChange={e => setFormField('employee_number', e.target.value)}
                  placeholder="EMP0001"
                  className="w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] font-mono uppercase rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                  {t('employees.name', 'ឈ្មោះពេញ')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormField('name', e.target.value)}
                  placeholder={t('employees.namePlaceholder', 'ឧ. សុខ ចិន្តា / Sok Chenda')}
                  className="w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] font-medium rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                  {t('employees.gender', 'ភេទ')}
                </label>
                <select
                  value={formData.gender}
                  onChange={e => setFormField('gender', e.target.value)}
                  className="w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium cursor-pointer"
                >
                  <option value="male" className="dark:bg-slate-900">{t('employees.male', 'ប្រុស')}</option>
                  <option value="female" className="dark:bg-slate-900">{t('employees.female', 'ស្រី')}</option>
                  <option value="other" className="dark:bg-slate-900">{t('employees.other', 'ផ្សេងទៀត')}</option>
                </select>
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                  {t('employees.birth_date', 'ថ្ងៃខែឆ្នាំកំណើត')}
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={formData.birth_date}
                    onChange={e => setFormField('birth_date', e.target.value)}
                    className="w-full h-10 min-h-[40px] pl-9 pr-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              {/* NIK / National ID */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                  {t('employees.nik', 'លេខអត្តសញ្ញាណប័ណ្ណ / NIK')}
                </label>
                <input
                  type="text"
                  value={formData.nik}
                  onChange={e => setFormField('nik', e.target.value)}
                  placeholder={t('employees.nikPlaceholder', 'ឧ. 32010203040001')}
                  className="w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] font-mono rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── SECTION 2: ការងារ ដេប៉ាតឺម៉ង់ & សាខា (Work Placement, Department & Position) ─── */}
        <div className="bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-border/60 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
              <Briefcase size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground dark:text-slate-100">
                {t('employees.tabWorkPlacement', 'ការងារ ដេប៉ាតឺម៉ង់ & សាខា')}
              </h3>
              <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                {t('employees.workPlacementDesc', 'កំណត់សាខាក្រុមហ៊ុន ដេប៉ាតឺម៉ង់ តួនាទី គណនីប្រព័ន្ធ និងកាលបរិច្ឆេទការងារ')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Company */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('employees.company', 'ក្រុមហ៊ុនមេ')} <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.company_id}
                onChange={e => setFormField('company_id', e.target.value)}
                className="w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium cursor-pointer"
              >
                {companies.map((comp: any) => (
                  <option key={comp.id} value={comp.id} className="dark:bg-slate-900">
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('employees.branch', 'សាខា')} <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.branch_id}
                onChange={e => setFormField('branch_id', e.target.value)}
                className="w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium cursor-pointer"
              >
                {branches.map((b: any) => (
                  <option key={b.id} value={b.id} className="dark:bg-slate-900">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('employees.department', 'ដេប៉ាតឺម៉ង់')}
              </label>
              <select
                value={formData.department_id}
                onChange={e => setFormField('department_id', e.target.value)}
                className="w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium cursor-pointer"
              >
                <option value="" className="dark:bg-slate-900">{t('employees.selectDepartment', '-- ជ្រើសរើសដេប៉ាតឺម៉ង់ --')}</option>
                {departments.map((dept: any) => (
                  <option key={dept.id} value={dept.id} className="dark:bg-slate-900">
                    {dept.name} {dept.code ? `(${dept.code})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Position */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('employees.position', 'តួនាទី / មុខតំណែង')}
              </label>
              <select
                value={formData.position_id}
                onChange={e => setFormField('position_id', e.target.value)}
                className="w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium cursor-pointer"
              >
                <option value="" className="dark:bg-slate-900">{t('employees.selectPosition', '-- ជ្រើសរើសតួនាទី --')}</option>
                {positions.map((pos: any) => (
                  <option key={pos.id} value={pos.id} className="dark:bg-slate-900">
                    {pos.name} {pos.code ? `(${pos.code})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* System User Account Link */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('employees.linkedUser', 'គណនីចូលប្រើប្រព័ន្ធ')}
              </label>
              <select
                value={formData.user_id}
                onChange={e => setFormField('user_id', e.target.value)}
                className="w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium cursor-pointer"
              >
                <option value="" className="dark:bg-slate-900">{t('employees.noneUser', '-- មិនភ្ជាប់គណនី --')}</option>
                {users.map((u: any) => (
                  <option key={u.id} value={u.id} className="dark:bg-slate-900">
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Basic Salary */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('employees.basic_salary', 'ប្រាក់ខែគោល ($)')}
              </label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-slate-400 pointer-events-none" />
                <input
                  type="number"
                  step="0.01"
                  value={formData.basic_salary}
                  onChange={e => setFormField('basic_salary', e.target.value)}
                  placeholder="850.00"
                  className="w-full h-10 min-h-[40px] pl-9 pr-3.5 py-2 text-xs sm:text-[13px] font-mono rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>
            </div>

            {/* Join Date */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('employees.join_date', 'ថ្ងៃចូលបម្រើការងារ')}
              </label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={formData.join_date}
                  onChange={e => setFormField('join_date', e.target.value)}
                  className="w-full h-10 min-h-[40px] pl-9 pr-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium dark:[color-scheme:dark]"
                />
              </div>
            </div>

            {/* Resign Date */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('employees.resign_date', 'ថ្ងៃលាឈប់ពីការងារ')}
              </label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={formData.resign_date}
                  onChange={e => setFormField('resign_date', e.target.value)}
                  className="w-full h-10 min-h-[40px] pl-9 pr-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium dark:[color-scheme:dark]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── SECTION 3: ទំនាក់ទំនង & អាសយដ្ឋាន (Contact & Residential Address) ─── */}
        <div className="bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-border/60 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground dark:text-slate-100">
                {t('employees.tabContact', 'ទំនាក់ទំនង & អាសយដ្ឋានស្នាក់នៅ')}
              </h3>
              <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                {t('employees.contactDesc', 'អ៊ីមែល លេខទូរស័ព្ទផ្ទាល់ខ្លួន និងអាសយដ្ឋានបច្ចុប្បន្ន')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('employees.email', 'អាសយដ្ឋានអ៊ីមែល')}
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormField('email', e.target.value)}
                  placeholder="employee@enterprise-pos.com"
                  className="w-full h-10 min-h-[40px] pl-9 pr-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('employees.phone', 'លេខទូរស័ព្ទ')}
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormField('phone', e.target.value)}
                  placeholder="+855 12 345 678"
                  className="w-full h-10 min-h-[40px] pl-9 pr-3.5 py-2 text-xs sm:text-[13px] font-mono rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('employees.address', 'អាសយដ្ឋានបច្ចុប្បន្ន')}
              </label>
              <textarea
                value={formData.address}
                onChange={e => setFormField('address', e.target.value)}
                rows={3}
                placeholder={t('employees.addressPlaceholder', 'ផ្ទះលេខ..., ផ្លូវ..., សង្កាត់..., ខណ្ឌ..., រាជធានីភ្នំពេញ')}
                className="w-full p-3.5 text-xs sm:text-[13px] resize-none rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 leading-relaxed focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* ─── SECTION 4: កាតសង្ខេបព័ត៌មានបុគ្គលិក (Employee Summary Card) ─── */}
        <div className="bg-gradient-to-br from-primary/5 via-card to-card dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-primary/20 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Info size={16} className="text-primary" />
            <h4 className="text-xs font-bold text-foreground dark:text-slate-100 uppercase tracking-wider">
              {t('employees.reviewSummary', 'សង្ខេបព័ត៌មានបុគ្គលិក (Live Preview)')}
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-background/80 dark:bg-slate-800/60 border border-border/70 dark:border-slate-700">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-base overflow-hidden shrink-0">
                {photoPreview ? (
                  <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : formData.name ? (
                  formData.name.slice(0, 2).toUpperCase()
                ) : (
                  <User size={22} />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-foreground dark:text-slate-100">
                    {formData.name || t('employees.unnamed', 'ឈ្មោះបុគ្គលិក...')}
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted dark:bg-slate-700 text-muted-foreground dark:text-slate-300 font-bold">
                    {formData.employee_number || 'EMP0000'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-slate-400 flex-wrap">
                  <span>{selectedDept?.name || t('employees.noDept', 'គ្មានដេប៉ាតឺម៉ង់')}</span>
                  <span>•</span>
                  <span>{selectedPos?.name || t('employees.noPos', 'គ្មានតួនាទី')}</span>
                  <span>•</span>
                  <span>{selectedBranch?.name || t('employees.noBranch', 'សាខា')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {formData.basic_salary && (
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground dark:text-slate-400 block">{t('employees.basic_salary', 'ប្រាក់ខែគោល')}</span>
                  <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ${parseFloat(formData.basic_salary).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              {statusBadge}
            </div>
          </div>
        </div>

        {/* Global Sticky Form Footer */}
        <FormFooter
          cancelPath="/employees"
          cancelLabel={t('employees.cancel', 'បោះបង់')}
          isSubmitting={saveMutation.isPending}
          submitLabel={isEdit ? t('employees.saveChanges', 'រក្សាទុកការផ្លាស់ប្តូរ') : t('employees.createEmployee', 'បង្កើតបុគ្គលិក')}
          infoSummary={
            formData.name ? (
              <span>
                {t('employees.name', 'បុគ្គលិក')}: <strong className="text-foreground dark:text-slate-100 font-semibold">"{formData.name}"</strong> ({formData.employee_number})
              </span>
            ) : (
              <span>{isEdit ? t('employees.editSubtitle', 'ធ្វើបច្ចុប្បន្នភាពទម្រង់បុគ្គលិក') : t('employees.createSubtitle', 'បំពេញព័ត៌មានដើម្បីចុះឈ្មោះបុគ្គលិកថ្មី')}</span>
            )
          }
        />
      </form>
    </div>
  )
}

export default EmployeeFormPage
