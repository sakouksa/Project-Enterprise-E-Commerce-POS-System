import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Loader2,
  Upload,
  User,
  Briefcase,
  DollarSign,
  Building2,
  Calendar,
  Phone,
  Mail,
  Shield,
  FileText,
  Trash2,
  Sparkles,
  Check
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
  usersList = [],
  empList = [],
  formCompanyId,
  setFormCompanyId,
  formBranchId,
  setFormBranchId,
  formDeptId,
  setFormDeptId,
  formPosId,
  setFormPosId,
  formUserId,
  setFormUserId,
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
  setFormPhoto,
  uploadingPhoto,
  handlePhotoFileChange,
  getPhotoUrl,
  formJoinDate,
  setFormJoinDate,
  formResignDate,
  setFormResignDate,
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
  payWorkingDays,
  setPayWorkingDays,
  payPresentDays,
  setPayPresentDays,
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

  const inputCls =
    'w-full text-xs font-semibold rounded-xl bg-background border border-border/80 text-foreground px-3.5 py-2.5 placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
  const labelCls =
    'block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5'

  const getModalTitle = () => {
    if (activeTab === 'employees') {
      return selectedItem
        ? t('employees.edit_employee', 'Edit Employee')
        : t('employees.create_employee', 'Create Employee')
    }
    if (activeTab === 'departments') {
      return selectedItem
        ? `${t('common.edit', 'Edit')} ${t('employees.department', 'Department')}`
        : `${t('common.add', 'Add')} ${t('employees.department', 'Department')}`
    }
    if (activeTab === 'positions') {
      return selectedItem
        ? `${t('common.edit', 'Edit')} ${t('employees.position', 'Position')}`
        : `${t('common.add', 'Add')} ${t('employees.position', 'Position')}`
    }
    if (activeTab === 'attendance') {
      return selectedItem
        ? `${t('common.edit', 'Edit')} ${t('employees.attendance', 'Attendance')}`
        : `${t('employees.add_attendance', 'Add Attendance')}`
    }
    if (activeTab === 'payrolls') {
      return selectedItem
        ? `${t('common.edit', 'Edit')} ${t('employees.payrolls', 'Payroll')}`
        : `${t('common.add', 'Add')} ${t('employees.payrolls', 'Payroll')}`
    }
    return t('employees.addEmployee', 'Add Employee')
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-card w-full max-w-4xl border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-2xs">
                {activeTab === 'employees' && <User size={20} />}
                {activeTab === 'departments' && <Building2 size={20} />}
                {activeTab === 'positions' && <Briefcase size={20} />}
                {activeTab === 'attendance' && <Calendar size={20} />}
                {activeTab === 'payrolls' && <DollarSign size={20} />}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                  {getModalTitle()}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedItem
                    ? `${selectedItem.employee_number || selectedItem.code || '#' + selectedItem.id} • ${t('common.lastUpdated', 'Update system records')}`
                    : t('employees.subtitle_desc', 'Fill in the information below to save records.')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={onSubmit} className="flex-1 overflow-y-auto flex flex-col justify-between">
            <div className="p-5 sm:p-6 space-y-6">
              {/* ─── EMPLOYEES TAB (Segmented Multi-Section Form) ─────────── */}
              {activeTab === 'employees' && (
                <div className="space-y-5">
                  {/* Segmented Section Navigator */}
                  <div className="grid grid-cols-3 gap-2 p-1 bg-muted/40 rounded-2xl border border-border/80">
                    <button
                      type="button"
                      onClick={() => setFormSection('personal')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        formSection === 'personal'
                          ? 'bg-card text-primary shadow-xs border border-border/60'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      }`}
                    >
                      <User size={14} />
                      <span className="truncate">{t('employees.tab_personal', 'Personal Info')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormSection('job')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        formSection === 'job'
                          ? 'bg-card text-primary shadow-xs border border-border/60'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      }`}
                    >
                      <Briefcase size={14} />
                      <span className="truncate">{t('employees.tab_job', 'Job & Employment')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormSection('salary')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        formSection === 'salary'
                          ? 'bg-card text-primary shadow-xs border border-border/60'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      }`}
                    >
                      <DollarSign size={14} />
                      <span className="truncate">{t('employees.tab_salary', 'Salary & Photo')}</span>
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
                            {t('employees.full_name', 'Full Name')} <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="e.g. John Doe / សុខ សាន"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>
                            {t('employees.employee_number', 'Employee Number')}{' '}
                            <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formEmployeeNumber}
                            onChange={(e) => setFormEmployeeNumber(e.target.value)}
                            placeholder="EMP-0001"
                            className={`${inputCls} font-mono`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>{t('employees.email', 'Email')}</label>
                          <input
                            type="email"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            placeholder="employee@enterprise-pos.com"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>{t('employees.phone', 'Phone')}</label>
                          <input
                            type="text"
                            value={formPhone}
                            onChange={(e) => setFormPhone(e.target.value)}
                            placeholder="012 345 678"
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className={labelCls}>{t('employees.nik', 'National ID (NIK)')}</label>
                          <input
                            type="text"
                            value={formNik}
                            onChange={(e) => setFormNik(e.target.value)}
                            placeholder="3273010203040001"
                            className={`${inputCls} font-mono`}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>{t('employees.gender', 'Gender')}</label>
                          <select
                            value={formGender}
                            onChange={(e) => setFormGender(e.target.value)}
                            className={inputCls}
                          >
                            <option value="male">{t('employees.male', 'Male (ប្រុស)')}</option>
                            <option value="female">{t('employees.female', 'Female (ស្រី)')}</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>{t('employees.birth_date', 'Birth Date')}</label>
                          <input
                            type="date"
                            value={formBirthDate}
                            onChange={(e) => setFormBirthDate(e.target.value)}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>{t('employees.address', 'Address')}</label>
                        <textarea
                          rows={2}
                          value={formAddress}
                          onChange={(e) => setFormAddress(e.target.value)}
                          placeholder="Current residential address..."
                          className={`${inputCls} resize-none`}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Section 2: Job & Employment Details */}
                  {formSection === 'job' && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className={labelCls}>
                            {t('employees.company', 'Company')} <span className="text-rose-500">*</span>
                          </label>
                          <select
                            required
                            value={formCompanyId}
                            onChange={(e) => setFormCompanyId(e.target.value)}
                            className={inputCls}
                          >
                            <option value="">{t('employees.select_company', 'Select Company')}</option>
                            {companiesList.map((c: any) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>
                            {t('employees.branch', 'Branch')} <span className="text-rose-500">*</span>
                          </label>
                          <select
                            required
                            value={formBranchId}
                            onChange={(e) => setFormBranchId(e.target.value)}
                            className={inputCls}
                          >
                            <option value="">{t('employees.select_branch', 'Select Branch')}</option>
                            {branchesList.map((b: any) => (
                              <option key={b.id} value={b.id}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>{t('employees.user_mapping', 'User Account Mapping')}</label>
                          <select
                            value={formUserId}
                            onChange={(e) => setFormUserId(e.target.value)}
                            className={inputCls}
                          >
                            <option value="">{t('employees.no_user_mapping', 'No user mapping')}</option>
                            {usersList.map((u: any) => (
                              <option key={u.id} value={u.id}>
                                {u.name} ({u.email})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>{t('employees.department', 'Department')}</label>
                          <select
                            value={formDeptId}
                            onChange={(e) => setFormDeptId(e.target.value)}
                            className={inputCls}
                          >
                            <option value="">{t('employees.select_department', 'Select Department')}</option>
                            {deptList.map((d: any) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>{t('employees.position', 'Position')}</label>
                          <select
                            value={formPosId}
                            onChange={(e) => setFormPosId(e.target.value)}
                            className={inputCls}
                          >
                            <option value="">{t('employees.select_position', 'Select Position')}</option>
                            {posList.map((p: any) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className={labelCls}>{t('employees.join_date', 'Join Date')}</label>
                          <input
                            type="date"
                            value={formJoinDate}
                            onChange={(e) => setFormJoinDate(e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>{t('employees.resign_date', 'Resign Date')}</label>
                          <input
                            type="date"
                            value={formResignDate}
                            onChange={(e) => setFormResignDate(e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>{t('employees.status', 'Status')}</label>
                          <select
                            value={formStatus}
                            onChange={(e) => setFormStatus(e.target.value)}
                            className={inputCls}
                          >
                            <option value="active">{t('employees.active', 'Active (សកម្ម)')}</option>
                            <option value="inactive">{t('employees.inactive', 'Inactive (អសកម្ម)')}</option>
                            <option value="resigned">{t('employees.resigned', 'Resigned (លាឈប់)')}</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Section 3: Salary & Photo */}
                  {formSection === 'salary' && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className={labelCls}>
                          {t('employees.basic_salary', 'Basic Salary ($)')}{' '}
                          <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">
                            $
                          </span>
                          <input
                            type="number"
                            required
                            step="0.01"
                            value={formBasicSalary}
                            onChange={(e) => setFormBasicSalary(e.target.value)}
                            placeholder="0.00"
                            className={`${inputCls} pl-8 font-mono text-sm font-bold`}
                          />
                        </div>
                      </div>

                      {/* Photo Section with Live Avatar Preview */}
                      <div>
                        <label className={labelCls}>{t('employees.employee_photo', 'Employee Photo')}</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/80">
                          <EmployeeAvatar
                            photo={formPhoto}
                            name={formName || 'New Employee'}
                            size="xl"
                            getPhotoUrl={getPhotoUrl}
                          />

                          <div className="space-y-2 flex-1 w-full text-center sm:text-left">
                            <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
                              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs">
                                {uploadingPhoto ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Upload size={14} />
                                )}
                                <span>
                                  {uploadingPhoto
                                    ? t('employees.uploading', 'Uploading...')
                                    : t('employees.upload_photo', 'Upload Photo')}
                                </span>
                                <input
                                  type="file"
                                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                                  onChange={handlePhotoFileChange}
                                  disabled={uploadingPhoto}
                                  className="hidden"
                                />
                              </label>

                              {formPhoto && (
                                <button
                                  type="button"
                                  onClick={() => setFormPhoto('')}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl border border-rose-500/20 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                  <span>{t('employees.remove_photo', 'Remove Photo')}</span>
                                </button>
                              )}
                            </div>

                            <input
                              type="text"
                              value={formPhoto}
                              onChange={(e) => setFormPhoto(e.target.value)}
                              className={`${inputCls} text-xs font-mono py-1.5 text-muted-foreground`}
                              placeholder={t('employees.or_photo_url', 'Or enter image URL / storage path...')}
                            />
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
                        {t('employees.company', 'Company')} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={formCompanyId}
                        onChange={(e) => setFormCompanyId(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">{t('employees.select_company', 'Select Company')}</option>
                        {companiesList.map((c: any) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t('employees.branch', 'Branch')} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={formBranchId}
                        onChange={(e) => setFormBranchId(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">{t('employees.select_branch', 'Select Branch')}</option>
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
                        {t('employees.department', 'Department Name')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Information Technology"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Department Code</label>
                      <input
                        type="text"
                        value={formEmployeeNumber}
                        onChange={(e) => setFormEmployeeNumber(e.target.value)}
                        className={`${inputCls} font-mono`}
                        placeholder="e.g. DEPT-IT"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>{t('employees.status', 'Status')}</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className={inputCls}
                    >
                      <option value="active">{t('employees.active', 'Active (សកម្ម)')}</option>
                      <option value="inactive">{t('employees.inactive', 'Inactive (អសកម្ម)')}</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea
                      rows={2}
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className={`${inputCls} resize-none`}
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
                        {t('employees.company', 'Company')} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={formCompanyId}
                        onChange={(e) => setFormCompanyId(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">{t('employees.select_company', 'Select Company')}</option>
                        {companiesList.map((c: any) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t('employees.department', 'Department')} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={formDeptId}
                        onChange={(e) => setFormDeptId(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">{t('employees.select_department', 'Select Department')}</option>
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
                        {t('employees.position', 'Position Name')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Position Code</label>
                      <input
                        type="text"
                        value={formEmployeeNumber}
                        onChange={(e) => setFormEmployeeNumber(e.target.value)}
                        className={`${inputCls} font-mono`}
                        placeholder="e.g. POS-ENG"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>{t('employees.status', 'Status')}</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className={inputCls}
                    >
                      <option value="active">{t('employees.active', 'Active (សកម្ម)')}</option>
                      <option value="inactive">{t('employees.inactive', 'Inactive (អសកម្ម)')}</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea
                      rows={2}
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>
              )}

              {/* ─── ATTENDANCE TAB ─────────────────────────────────────────── */}
              {activeTab === 'attendance' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>
                      {t('employees.employees', 'Employee')} <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={attEmployeeId}
                      onChange={(e) => setAttEmployeeId(e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Select Employee</option>
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
                        Date <span className="text-rose-500">*</span>
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
                      <label className={labelCls}>Check In</label>
                      <input
                        type="time"
                        value={attCheckIn}
                        onChange={(e) => setAttCheckIn(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Check Out</label>
                      <input
                        type="time"
                        value={attCheckOut}
                        onChange={(e) => setAttCheckOut(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>{t('employees.status', 'Status')}</label>
                    <select
                      value={attStatus}
                      onChange={(e) => setAttStatus(e.target.value)}
                      className={inputCls}
                    >
                      <option value="present">{t('employees.present', 'Present (វត្តមាន)')}</option>
                      <option value="late">{t('employees.late', 'Late (មកយឺត)')}</option>
                      <option value="absent">{t('employees.absent', 'Absent (អវត្តមាន)')}</option>
                      <option value="leave">{t('employees.leave', 'Leave (ច្បាប់សម្រាក)')}</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Notes</label>
                    <textarea
                      rows={2}
                      value={attNotes}
                      onChange={(e) => setAttNotes(e.target.value)}
                      className={`${inputCls} resize-none`}
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
                        {t('employees.employees', 'Employee')} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={payEmployeeId}
                        onChange={(e) => setPayEmployeeId(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">Select Employee</option>
                        {empList.map((emp: any) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.employee_number})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t('employees.period_month', 'Period Month')} <span className="text-rose-500">*</span>
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
                      <label className={labelCls}>{t('employees.basic_salary', 'Basic Salary ($)')}</label>
                      <input
                        type="number"
                        value={formBasicSalary}
                        onChange={(e) => setFormBasicSalary(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>{t('employees.allowances', 'Allowances ($)')}</label>
                      <input
                        type="number"
                        value={payAllowances}
                        onChange={(e) => setPayAllowances(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{t('employees.deductions', 'Deductions ($)')}</label>
                      <input
                        type="number"
                        value={payDeductions}
                        onChange={(e) => setPayDeductions(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Overtime Pay ($)</label>
                      <input
                        type="number"
                        value={payOvertimePay}
                        onChange={(e) => setPayOvertimePay(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{t('employees.status', 'Status')}</label>
                      <select
                        value={payStatus}
                        onChange={(e) => setPayStatus(e.target.value)}
                        className={inputCls}
                      >
                        <option value="pending">{t('employees.pending', 'Pending (រង់ចាំ)')}</option>
                        <option value="paid">{t('employees.paid', 'Paid (បានបើកប្រាក់)')}</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Paid Date</label>
                      <input
                        type="date"
                        value={payPaidAt}
                        onChange={(e) => setPayPaidAt(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Notes</label>
                    <textarea
                      rows={2}
                      value={payNotes}
                      onChange={(e) => setPayNotes(e.target.value)}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/20 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {t('employees.cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={isPending || uploadingPhoto}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{t('common.saving', 'Saving...')}</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>{t('employees.save_changes', 'Save Changes')}</span>
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
