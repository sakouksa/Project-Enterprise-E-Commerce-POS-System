import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Loader2,
  User,
  Briefcase,
  DollarSign,
  Building2,
  Calendar,
  Check,
  Sparkles
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Tab } from '../types'
import { EmployeeAvatar } from './EmployeeAvatar'

interface EmployeeFormModalProps {
  isOpen: boolean
  onClose: () => void
  activeTab: Tab
  selectedItem: any | null
  onSubmit: (e: React.FormEvent) => void
  isPending: boolean
  // Dropdowns data
  companiesList?: any[]
  branchesList?: any[]
  deptList?: any[]
  posList?: any[]
  usersList?: any[]
  empList?: any[]
  // Form fields
  formCompanyId: string
  setFormCompanyId: (val: string) => void
  formBranchId: string
  setFormBranchId: (val: string) => void
  formDeptId: string
  setFormDeptId: (val: string) => void
  formPosId: string
  setFormPosId: (val: string) => void
  formUserId: string
  setFormUserId: (val: string) => void
  formEmployeeNumber: string
  setFormEmployeeNumber: (val: string) => void
  formName: string
  setFormName: (val: string) => void
  formEmail: string
  setFormEmail: (val: string) => void
  formPhone: string
  setFormPhone: (val: string) => void
  formNik: string
  setFormNik: (val: string) => void
  formGender: string
  setFormGender: (val: string) => void
  formBirthDate: string
  setFormBirthDate: (val: string) => void
  formAddress: string
  setFormAddress: (val: string) => void
  formPhoto: string
  setFormPhoto: (val: string) => void
  uploadingPhoto: boolean
  handlePhotoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  getPhotoUrl: (photoPath?: string) => string | null
  formJoinDate: string
  setFormJoinDate: (val: string) => void
  formResignDate: string
  setFormResignDate: (val: string) => void
  formStatus: string
  setFormStatus: (val: string) => void
  formBasicSalary: string
  setFormBasicSalary: (val: string) => void
  // Attendance fields
  attEmployeeId: string
  setAttEmployeeId: (val: string) => void
  attDate: string
  setAttDate: (val: string) => void
  attCheckIn: string
  setAttCheckIn: (val: string) => void
  attCheckOut: string
  setAttCheckOut: (val: string) => void
  attStatus: string
  setAttStatus: (val: string) => void
  attNotes: string
  setAttNotes: (val: string) => void
  // Payroll fields
  payEmployeeId: string
  setPayEmployeeId: (val: string) => void
  payPeriodMonth: string
  setPayPeriodMonth: (val: string) => void
  payWorkingDays: string
  setPayWorkingDays: (val: string) => void
  payPresentDays: string
  setPayPresentDays: (val: string) => void
  payAllowances: string
  setPayAllowances: (val: string) => void
  payDeductions: string
  setPayDeductions: (val: string) => void
  payOvertimePay: string
  setPayOvertimePay: (val: string) => void
  payStatus: string
  setPayStatus: (val: string) => void
  payPaidAt: string
  setPayPaidAt: (val: string) => void
  payNotes: string
  setPayNotes: (val: string) => void
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  selectedItem,
  onSubmit,
  isPending,
  companiesList = [],
  branchesList = [],
  deptList = [],
  posList = [],
  empList = [],
  formCompanyId,
  setFormCompanyId,
  formBranchId,
  setFormBranchId,
  formDeptId,
  setFormDeptId,
  formPosId,
  setFormPosId,
  formEmployeeNumber,
  setFormEmployeeNumber,
  formName,
  setFormName,
  formEmail,
  setFormEmail,
  formPhone,
  setFormPhone,
  formNik,
  setFormNik,
  formGender,
  setFormGender,
  formBirthDate,
  setFormBirthDate,
  formAddress,
  setFormAddress,
  formPhoto,
  uploadingPhoto,
  handlePhotoFileChange,
  getPhotoUrl,
  formJoinDate,
  setFormJoinDate,
  formStatus,
  setFormStatus,
  formBasicSalary,
  setFormBasicSalary,
  attEmployeeId,
  setAttEmployeeId,
  attDate,
  setAttDate,
  attCheckIn,
  setAttCheckIn,
  attCheckOut,
  setAttCheckOut,
  attStatus,
  setAttStatus,
  attNotes,
  setAttNotes,
  payEmployeeId,
  setPayEmployeeId,
  payPeriodMonth,
  setPayPeriodMonth,
  payAllowances,
  setPayAllowances,
  payDeductions,
  setPayDeductions,
  payOvertimePay,
  setPayOvertimePay,
  payStatus,
  setPayStatus,
  payPaidAt,
  setPayPaidAt,
  payNotes,
  setPayNotes,
}) => {
  const { t } = useTranslation(['employees', 'common'])
  const [formSection, setFormSection] = useState<'personal' | 'job' | 'salary'>('personal')

  if (!isOpen) return null

  // Unified h-10 Input and Select style matching Enterprise standard
  const inputCls =
    'w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium dark:[color-scheme:dark]'
  const labelCls =
    'block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5'

  const getModalTitle = () => {
    if (activeTab === 'departments') {
      return selectedItem
        ? t('employees.edit_department_title', 'កែសម្រួលដេប៉ាតឺម៉ង់')
        : t('employees.add_department_title', 'បន្ថែមដេប៉ាតឺម៉ង់ថ្មី')
    }
    if (activeTab === 'positions') {
      return selectedItem
        ? t('employees.edit_position_title', 'កែសម្រួលមុខតំណែង')
        : t('employees.add_position_title', 'បន្ថែមមុខតំណែងថ្មី')
    }
    if (activeTab === 'attendance') {
      return selectedItem
        ? t('employees.edit_attendance_title', 'កែសម្រួលកំណត់ត្រាវត្តមាន')
        : t('employees.add_attendance_title', 'កត់ត្រាវត្តមានថ្មី')
    }
    if (activeTab === 'payrolls') {
      return selectedItem
        ? t('employees.edit_payroll_title', 'កែសម្រួលប័ណ្ណបើកប្រាក់ខែ')
        : t('employees.add_payroll_title', 'បង្កើតប័ណ្ណបើកប្រាក់ខែ')
    }
    return selectedItem
      ? t('employees.editEmployee', 'កែសម្រួលបុគ្គលិក')
      : t('employees.createEmployeeTitle', 'បង្កើតបុគ្គលិកថ្មី')
  }

  const getModalSubtitle = () => {
    if (activeTab === 'departments') {
      return t('employees.dept_subtitle', 'គ្រប់គ្រង និងកំណត់រចនាសម្ព័ន្ធដេប៉ាតឺម៉ង់របស់ក្រុមហ៊ុន')
    }
    if (activeTab === 'positions') {
      return t('employees.pos_subtitle', 'គ្រប់គ្រង និងកំណត់តួនាទី និងមុខតំណែងការងារក្នុងអង្គភាព')
    }
    if (activeTab === 'attendance') {
      return t('employees.att_subtitle', 'កត់ត្រា ឬកែសម្រួលម៉ោងចូលធ្វើការ និងម៉ោងចេញរបស់បុគ្គលិក')
    }
    if (activeTab === 'payrolls') {
      return t('employees.pay_subtitle', 'គណនា និងកែសម្រួលប្រាក់បៀវត្សរ៍ ប្រាក់ឧបត្ថម្ភ និងការកាត់កងប្រចាំខែ')
    }
    return t('employees.createSubtitle', 'បំពេញព័ត៌មានបុគ្គលិក ដេប៉ាតឺម៉ង់ តួនាទី ប្រាក់បៀវត្សរ៍ និងព័ត៌មានទំនាក់ទំនង')
  }

  const generateDeptCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    setFormEmployeeNumber(`DEPT-${randomNum}`)
  }

  const generatePosCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    setFormEmployeeNumber(`POS-${randomNum}`)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-card dark:bg-slate-900 w-full max-w-3xl border border-border/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border/80 dark:border-slate-800 bg-muted/20 dark:bg-slate-900/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-2xs">
                {activeTab === 'employees' && <User size={20} />}
                {activeTab === 'departments' && <Building2 size={20} />}
                {activeTab === 'positions' && <Briefcase size={20} />}
                {activeTab === 'attendance' && <Calendar size={20} />}
                {activeTab === 'payrolls' && <DollarSign size={20} />}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground dark:text-slate-100 leading-tight">
                  {getModalTitle()}
                </h3>
                <p className="text-xs text-muted-foreground dark:text-slate-400 mt-0.5 max-w-xl line-clamp-1">
                  {getModalSubtitle()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={onSubmit} className="flex-1 overflow-y-auto flex flex-col justify-between">
            <div className="p-5 sm:p-6 space-y-5">
              {/* ─── EMPLOYEES TAB (Segmented Multi-Section Form) ─────────── */}
              {activeTab === 'employees' && (
                <div className="space-y-5">
                  {/* Segmented Section Navigator */}
                  <div className="grid grid-cols-3 gap-2 p-1 bg-muted/40 dark:bg-slate-800/60 rounded-xl border border-border/80 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setFormSection('personal')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        formSection === 'personal'
                          ? 'bg-card dark:bg-slate-900 text-primary shadow-xs border border-border/60 dark:border-slate-700'
                          : 'text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white hover:bg-muted/60'
                      }`}
                    >
                      <User size={14} />
                      <span className="truncate">{t('employees.tab_personal', 'ព័ត៌មានផ្ទាល់ខ្លួន')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormSection('job')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        formSection === 'job'
                          ? 'bg-card dark:bg-slate-900 text-primary shadow-xs border border-border/60 dark:border-slate-700'
                          : 'text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white hover:bg-muted/60'
                      }`}
                    >
                      <Briefcase size={14} />
                      <span className="truncate">{t('employees.tab_job', 'ការងារ & តួនាទី')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormSection('salary')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        formSection === 'salary'
                          ? 'bg-card dark:bg-slate-900 text-primary shadow-xs border border-border/60 dark:border-slate-700'
                          : 'text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white hover:bg-muted/60'
                      }`}
                    >
                      <DollarSign size={14} />
                      <span className="truncate">{t('employees.tab_salary', 'ប្រាក់បៀវត្សរ៍ & រូបថត')}</span>
                    </button>
                  </div>

                  {/* Section 1: Personal Info */}
                  {formSection === 'personal' && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>
                            {t('employees.full_name', 'ឈ្មោះពេញ')} <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder={t('employees.namePlaceholder', 'ឧ. សុខ ចិន្តា / Sok Chenda')}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>
                            {t('employees.employee_number', 'លេខសម្គាល់បុគ្គលិក')}{' '}
                            <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formEmployeeNumber}
                            onChange={(e) => setFormEmployeeNumber(e.target.value)}
                            className={`${inputCls} font-mono`}
                            placeholder="e.g. EMP12345"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>{t('employees.gender', 'ភេទ')}</label>
                          <select
                            value={formGender}
                            onChange={(e) => setFormGender(e.target.value)}
                            className={inputCls}
                          >
                            <option value="male">{t('employees.male', 'ប្រុស')}</option>
                            <option value="female">{t('employees.female', 'ស្រី')}</option>
                            <option value="other">{t('employees.other', 'ផ្សេងទៀត')}</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>{t('employees.birth_date', 'ថ្ងៃខែឆ្នាំកំណើត')}</label>
                          <input
                            type="date"
                            value={formBirthDate}
                            onChange={(e) => setFormBirthDate(e.target.value)}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>{t('employees.nik', 'លេខអត្តសញ្ញាណប័ណ្ណ (NIK)')}</label>
                          <input
                            type="text"
                            value={formNik}
                            onChange={(e) => setFormNik(e.target.value)}
                            placeholder={t('employees.nikPlaceholder', 'ឧ. 32010203040001')}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>{t('employees.phone', 'ទូរស័ព្ទ')}</label>
                          <input
                            type="tel"
                            value={formPhone}
                            onChange={(e) => setFormPhone(e.target.value)}
                            placeholder="012 345 678"
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>{t('employees.email', 'អ៊ីមែល')}</label>
                        <input
                          type="email"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder="employee@example.com"
                          className={inputCls}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Section 2: Job */}
                  {formSection === 'job' && (
                    <motion.div
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>
                            {t('employees.company', 'ក្រុមហ៊ុន')} <span className="text-rose-500">*</span>
                          </label>
                          <select
                            required
                            value={formCompanyId}
                            onChange={(e) => setFormCompanyId(e.target.value)}
                            className={inputCls}
                          >
                            <option value="">{t('employees.select_company', '-- ជ្រើសរើសក្រុមហ៊ុន --')}</option>
                            {companiesList.map((c: any) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>
                            {t('employees.branch', 'សាខា')} <span className="text-rose-500">*</span>
                          </label>
                          <select
                            required
                            value={formBranchId}
                            onChange={(e) => setFormBranchId(e.target.value)}
                            className={inputCls}
                          >
                            <option value="">{t('employees.select_branch', '-- ជ្រើសរើសសាខា --')}</option>
                            {branchesList.map((b: any) => (
                              <option key={b.id} value={b.id}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>
                            {t('employees.department', 'ដេប៉ាតឺម៉ង់')} <span className="text-rose-500">*</span>
                          </label>
                          <select
                            required
                            value={formDeptId}
                            onChange={(e) => setFormDeptId(e.target.value)}
                            className={inputCls}
                          >
                            <option value="">{t('employees.select_department', '-- ជ្រើសរើសដេប៉ាតឺម៉ង់ --')}</option>
                            {deptList.map((d: any) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>
                            {t('employees.position', 'តួនាទី')} <span className="text-rose-500">*</span>
                          </label>
                          <select
                            required
                            value={formPosId}
                            onChange={(e) => setFormPosId(e.target.value)}
                            className={inputCls}
                          >
                            <option value="">{t('employees.select_position', '-- ជ្រើសរើសតួនាទី --')}</option>
                            {posList.map((p: any) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>{t('employees.join_date', 'ថ្ងៃចូលការងារ')}</label>
                          <input
                            type="date"
                            value={formJoinDate}
                            onChange={(e) => setFormJoinDate(e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>{t('employees.status', 'ស្ថានភាព')}</label>
                          <select
                            value={formStatus}
                            onChange={(e) => setFormStatus(e.target.value)}
                            className={inputCls}
                          >
                            <option value="active">{t('employees.active', 'សកម្ម')}</option>
                            <option value="inactive">{t('employees.inactive', 'អសកម្ម')}</option>
                            <option value="resigned">{t('employees.resigned', 'លាឈប់')}</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Section 3: Salary & Photo */}
                  {formSection === 'salary' && (
                    <motion.div
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>{t('employees.basic_salary', 'ប្រាក់ខែគោល ($)')}</label>
                          <input
                            type="number"
                            value={formBasicSalary}
                            onChange={(e) => setFormBasicSalary(e.target.value)}
                            placeholder="850.00"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>{t('employees.address', 'អាសយដ្ឋានបច្ចុប្បន្ន')}</label>
                          <input
                            type="text"
                            value={formAddress}
                            onChange={(e) => setFormAddress(e.target.value)}
                            placeholder={t('employees.addressPlaceholder', 'ផ្ទះលេខ..., ផ្លូវ..., សង្កាត់...')}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {/* Photo Upload Box */}
                      <div className="p-4 rounded-2xl border border-border/80 dark:border-slate-800 bg-muted/20 dark:bg-slate-800/40">
                        <label className={labelCls}>{t('employees.profilePhoto', 'រូបថតបុគ្គលិក')}</label>
                        <div className="flex items-center gap-4 mt-2">
                          <EmployeeAvatar
                            name={formName}
                            photo={formPhoto}
                            getPhotoUrl={getPhotoUrl}
                            size="lg"
                          />
                          <div className="space-y-1.5 flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoFileChange}
                              disabled={uploadingPhoto}
                              className="text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                            />
                            <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                              {t('employees.photoNote', 'PNG, JPG, WEBP (អតិបរមា 5MB)')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* ─── DEPARTMENTS TAB ────────────────────────────────────────── */}
              {activeTab === 'departments' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>
                        {t('employees.company', 'ក្រុមហ៊ុន')} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={formCompanyId}
                        onChange={(e) => setFormCompanyId(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">{t('employees.select_company', '-- ជ្រើសរើសក្រុមហ៊ុន --')}</option>
                        {companiesList.map((c: any) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t('employees.branch', 'សាខា')} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={formBranchId}
                        onChange={(e) => setFormBranchId(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">{t('employees.select_branch', '-- ជ្រើសរើសសាខា --')}</option>
                        {branchesList.map((b: any) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>
                        {t('employees.department_name', 'ឈ្មោះដេប៉ាតឺម៉ង់')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder={t('employees.dept_placeholder', 'ឧ. បច្ចេកវិទ្យាព័ត៌មានវិទ្យា (IT)')}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-foreground/90 dark:text-slate-200">
                          {t('employees.department_code', 'លេខកូដដេប៉ាតឺម៉ង់')}
                        </label>
                        {!selectedItem && (
                          <button
                            type="button"
                            onClick={generateDeptCode}
                            className="text-[11px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Sparkles size={12} />
                            <span>{t('employees.autoGenerate', 'ស្វ័យប្រវត្តិ')}</span>
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={formEmployeeNumber}
                        onChange={(e) => setFormEmployeeNumber(e.target.value)}
                        className={`${inputCls} font-mono`}
                        placeholder={t('employees.dept_code_placeholder', 'ឧ. DEPT-IT')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>{t('employees.status', 'ស្ថានភាព')}</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className={inputCls}
                    >
                      <option value="active">{t('employees.active', 'សកម្ម')}</option>
                      <option value="inactive">{t('employees.inactive', 'អសកម្ម')}</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>{t('employees.description', 'ការពិពណ៌នា / ចំណាំ')}</label>
                    <textarea
                      rows={2}
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder={t('employees.description_placeholder', 'បញ្ចូលព័ត៌មានលម្អិតបន្ថែម ឬចំណាំ...')}
                      className="w-full min-h-[70px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ─── POSITIONS TAB ──────────────────────────────────────────── */}
              {activeTab === 'positions' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>
                        {t('employees.company', 'ក្រុមហ៊ុន')} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={formCompanyId}
                        onChange={(e) => setFormCompanyId(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">{t('employees.select_company', '-- ជ្រើសរើសក្រុមហ៊ុន --')}</option>
                        {companiesList.map((c: any) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t('employees.department', 'ដេប៉ាតឺម៉ង់')} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={formDeptId}
                        onChange={(e) => setFormDeptId(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">{t('employees.select_department', '-- ជ្រើសរើសដេប៉ាតឺម៉ង់ --')}</option>
                        {deptList.map((d: any) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>
                        {t('employees.position_name', 'ឈ្មោះមុខតំណែង')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder={t('employees.pos_placeholder', 'ឧ. ប្រធានផ្នែកអភិវឌ្ឍន៍ (Senior Dev)')}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-foreground/90 dark:text-slate-200">
                          {t('employees.position_code', 'លេខកូដមុខតំណែង')}
                        </label>
                        {!selectedItem && (
                          <button
                            type="button"
                            onClick={generatePosCode}
                            className="text-[11px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Sparkles size={12} />
                            <span>{t('employees.autoGenerate', 'ស្វ័យប្រវត្តិ')}</span>
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={formEmployeeNumber}
                        onChange={(e) => setFormEmployeeNumber(e.target.value)}
                        className={`${inputCls} font-mono`}
                        placeholder={t('employees.pos_code_placeholder', 'ឧ. POS-ENG')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>{t('employees.status', 'ស្ថានភាព')}</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className={inputCls}
                    >
                      <option value="active">{t('employees.active', 'សកម្ម')}</option>
                      <option value="inactive">{t('employees.inactive', 'អសកម្ម')}</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>{t('employees.description', 'ការពិពណ៌នា / ចំណាំ')}</label>
                    <textarea
                      rows={2}
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder={t('employees.description_placeholder', 'បញ្ចូលព័ត៌មានលម្អិតបន្ថែម ឬចំណាំ...')}
                      className="w-full min-h-[70px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ─── ATTENDANCE TAB ─────────────────────────────────────────── */}
              {activeTab === 'attendance' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>
                      {t('employees.employee', 'បុគ្គលិក')} <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={attEmployeeId}
                      onChange={(e) => setAttEmployeeId(e.target.value)}
                      className={inputCls}
                    >
                      <option value="">{t('employees.select_employee', '-- ជ្រើសរើសបុគ្គលិក --')}</option>
                      {empList.map((emp: any) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.employee_number})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>
                        {t('employees.date', 'កាលបរិច្ឆេទ')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={attDate}
                        onChange={(e) => setAttDate(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>{t('employees.check_in_time', 'ម៉ោងចូលធ្វើការ')}</label>
                      <input
                        type="time"
                        value={attCheckIn}
                        onChange={(e) => setAttCheckIn(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>{t('employees.check_out_time', 'ម៉ោងចេញពីធ្វើការ')}</label>
                      <input
                        type="time"
                        value={attCheckOut}
                        onChange={(e) => setAttCheckOut(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>{t('employees.status', 'ស្ថានភាព')}</label>
                    <select
                      value={attStatus}
                      onChange={(e) => setAttStatus(e.target.value)}
                      className={inputCls}
                    >
                      <option value="present">{t('employees.present', 'វត្តមាន')}</option>
                      <option value="late">{t('employees.late', 'មកយឺត')}</option>
                      <option value="absent">{t('employees.absent', 'អវត្តមាន')}</option>
                      <option value="leave">{t('employees.leave', 'ច្បាប់សម្រាក')}</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>{t('employees.notes', 'កំណត់ចំណាំ')}</label>
                    <textarea
                      rows={2}
                      value={attNotes}
                      onChange={(e) => setAttNotes(e.target.value)}
                      placeholder={t('employees.notes_placeholder', 'បញ្ចូលមូលហេតុ ឬកំណត់ចំណាំ...')}
                      className="w-full min-h-[70px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ─── PAYROLL TAB ────────────────────────────────────────────── */}
              {activeTab === 'payrolls' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>
                        {t('employees.employee', 'បុគ្គលិក')} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={payEmployeeId}
                        onChange={(e) => setPayEmployeeId(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">{t('employees.select_employee', '-- ជ្រើសរើសបុគ្គលិក --')}</option>
                        {empList.map((emp: any) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.employee_number})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t('employees.period_month', 'រយៈពេលខែ')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="month"
                        required
                        value={payPeriodMonth}
                        onChange={(e) => setPayPeriodMonth(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{t('employees.basic_salary', 'ប្រាក់ខែគោល ($)')}</label>
                      <input
                        type="number"
                        value={formBasicSalary}
                        onChange={(e) => setFormBasicSalary(e.target.value)}
                        placeholder="850.00"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>{t('employees.allowances', 'ប្រាក់ឧបត្ថម្ភ ($)')}</label>
                      <input
                        type="number"
                        value={payAllowances}
                        onChange={(e) => setPayAllowances(e.target.value)}
                        placeholder="50.00"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{t('employees.deductions', 'ការកាត់កង ($)')}</label>
                      <input
                        type="number"
                        value={payDeductions}
                        onChange={(e) => setPayDeductions(e.target.value)}
                        placeholder="0.00"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>{t('employees.overtime_pay', 'ប្រាក់ម៉ោងបន្ថែម ($)')}</label>
                      <input
                        type="number"
                        value={payOvertimePay}
                        onChange={(e) => setPayOvertimePay(e.target.value)}
                        placeholder="0.00"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{t('employees.status', 'ស្ថានភាព')}</label>
                      <select
                        value={payStatus}
                        onChange={(e) => setPayStatus(e.target.value)}
                        className={inputCls}
                      >
                        <option value="pending">{t('employees.pending', 'រង់ចាំ')}</option>
                        <option value="paid">{t('employees.paid', 'បានបើកប្រាក់')}</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>{t('employees.paid_date', 'កាលបរិច្ឆេទបើកប្រាក់')}</label>
                      <input
                        type="date"
                        value={payPaidAt}
                        onChange={(e) => setPayPaidAt(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>{t('employees.notes', 'កំណត់ចំណាំ')}</label>
                    <textarea
                      rows={2}
                      value={payNotes}
                      onChange={(e) => setPayNotes(e.target.value)}
                      placeholder={t('employees.notes_placeholder', 'បញ្ចូលមូលហេតុ ឬកំណត់ចំណាំ...')}
                      className="w-full min-h-[70px] px-3.5 py-2 text-xs sm:text-[13px] rounded-lg border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/70 dark:placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 px-5 sm:px-6 py-4 border-t border-border/80 dark:border-slate-800 bg-muted/20 dark:bg-slate-900/50 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-5 rounded-xl border border-border/80 dark:border-slate-700 bg-card dark:bg-slate-800/80 text-xs sm:text-[13px] font-bold text-muted-foreground dark:text-slate-300 hover:text-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {t('employees.cancel', 'បោះបង់')}
              </button>
              <button
                type="submit"
                disabled={isPending || uploadingPhoto}
                className="h-10 inline-flex items-center gap-2 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs sm:text-[13px] font-bold shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer active:scale-95"
              >
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{t('common.saving', 'កំពុងរក្សាទុក...')}</span>
                  </>
                ) : (
                  <>
                    <Check size={14} strokeWidth={2.5} />
                    <span>{selectedItem ? t('employees.saveChanges', 'រក្សាទុកការផ្លាស់ប្តូរ') : t('common.save', 'រក្សាទុក')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default EmployeeFormModal
