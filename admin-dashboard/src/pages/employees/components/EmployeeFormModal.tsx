import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Upload, User } from 'lucide-react'
import type { Tab } from '../types'

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
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="modal-content max-w-2xl w-full max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {selectedItem ? 'Edit' : 'Create'} {activeTab.slice(0, -1)}
              </h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {activeTab === 'departments' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Department Name</label>
                      <input type="text" required value={formName} onChange={e => setFormName(e.target.value)} className="input w-full" placeholder="e.g. Engineering" />
                    </div>
                    <div>
                      <label className="label">Department Code</label>
                      <input type="text" value={formEmployeeNumber} onChange={e => setFormEmployeeNumber(e.target.value)} className="input w-full" placeholder="e.g. IT, HR, FIN" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label">Company</label>
                      <select required value={formCompanyId} onChange={e => setFormCompanyId(e.target.value)} className="input w-full">
                        <option value="">Select Company</option>
                        {companiesList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Branch</label>
                      <select required value={formBranchId} onChange={e => setFormBranchId(e.target.value)} className="input w-full">
                        <option value="">Select Branch</option>
                        {branchesList.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Status</label>
                      <select value={formStatus} onChange={e => setFormStatus(e.target.value)} className="input w-full">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <textarea value={formAddress} onChange={e => setFormAddress(e.target.value)} className="input w-full min-h-[80px]" placeholder="Optional description..." />
                  </div>
                </div>
              )}

              {activeTab === 'positions' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label">Company</label>
                      <select required value={formCompanyId} onChange={e => setFormCompanyId(e.target.value)} className="input w-full">
                        <option value="">Select Company</option>
                        {companiesList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Department</label>
                      <select required value={formDeptId} onChange={e => setFormDeptId(e.target.value)} className="input w-full">
                        <option value="">Select Department</option>
                        {deptList.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Position Name</label>
                      <input type="text" required value={formName} onChange={e => setFormName(e.target.value)} className="input w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Position Code</label>
                      <input type="text" value={formEmployeeNumber} onChange={e => setFormEmployeeNumber(e.target.value)} className="input w-full" placeholder="e.g. SNR-DEV" />
                    </div>
                    <div>
                      <label className="label">Status</label>
                      <select value={formStatus} onChange={e => setFormStatus(e.target.value)} className="input w-full">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <textarea value={formAddress} onChange={e => setFormAddress(e.target.value)} className="input w-full min-h-[80px]" />
                  </div>
                </div>
              )}

              {activeTab === 'employees' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold border-b pb-1 text-muted-foreground">General Info</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name</label>
                      <input type="text" required value={formName} onChange={e => setFormName(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Employee Number</label>
                      <input type="text" required value={formEmployeeNumber} onChange={e => setFormEmployeeNumber(e.target.value)} className="input w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Email</label>
                      <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Phone</label>
                      <input type="text" value={formPhone} onChange={e => setFormPhone(e.target.value)} className="input w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label">NIK (National ID)</label>
                      <input type="text" value={formNik} onChange={e => setFormNik(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Gender</label>
                      <select value={formGender} onChange={e => setFormGender(e.target.value)} className="input w-full">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Birth Date</label>
                      <input type="date" value={formBirthDate} onChange={e => setFormBirthDate(e.target.value)} className="input w-full" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Address</label>
                    <textarea value={formAddress} onChange={e => setFormAddress(e.target.value)} className="input w-full min-h-[70px]" />
                  </div>

                  <h4 className="text-sm font-semibold border-b pb-1 text-muted-foreground pt-2">Employment Details</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label">Company</label>
                      <select required value={formCompanyId} onChange={e => setFormCompanyId(e.target.value)} className="input w-full">
                        <option value="">Select Company</option>
                        {companiesList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Branch</label>
                      <select required value={formBranchId} onChange={e => setFormBranchId(e.target.value)} className="input w-full">
                        {branchesList.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">User Mapping</label>
                      <select value={formUserId} onChange={e => setFormUserId(e.target.value)} className="input w-full">
                        <option value="">No user mapping</option>
                        {usersList.map((u: any) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Department</label>
                      <select value={formDeptId} onChange={e => setFormDeptId(e.target.value)} className="input w-full">
                        <option value="">Select Dept</option>
                        {deptList.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Position</label>
                      <select value={formPosId} onChange={e => setFormPosId(e.target.value)} className="input w-full">
                        <option value="">Select Position</option>
                        {posList.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label">Join Date</label>
                      <input type="date" value={formJoinDate} onChange={e => setFormJoinDate(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Resign Date</label>
                      <input type="date" value={formResignDate} onChange={e => setFormResignDate(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Status</label>
                      <select value={formStatus} onChange={e => setFormStatus(e.target.value)} className="input w-full">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="resigned">Resigned</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Basic Salary ($)</label>
                      <input type="number" required value={formBasicSalary} onChange={e => setFormBasicSalary(e.target.value)} className="input w-full" />
                    </div>
                    <div className="col-span-2">
                      <label className="label">Employee Photo</label>
                      <div className="flex items-center gap-4 bg-muted/30 p-3.5 rounded-xl border border-border">
                        <div className="relative w-16 h-16 rounded-full border-2 border-border bg-card overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs">
                          {uploadingPhoto ? (
                            <Loader2 size={22} className="animate-spin text-primary" />
                          ) : formPhoto ? (
                            <img src={getPhotoUrl(formPhoto) || ''} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <User size={28} className="text-muted-foreground" />
                          )}
                        </div>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs">
                              {uploadingPhoto ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                              <span>{uploadingPhoto ? 'Uploading Image...' : 'Upload Image File'}</span>
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
                                className="px-2.5 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-500/10 rounded-xl border border-rose-500/20 transition-colors"
                              >
                                Remove Photo
                              </button>
                            )}
                          </div>

                          <input
                            type="text"
                            value={formPhoto}
                            onChange={e => setFormPhoto(e.target.value)}
                            className="input w-full text-xs font-mono py-1 text-muted-foreground"
                            placeholder="Or enter photo URL / storage path..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'attendance' && (
                <div className="space-y-4">
                  <div>
                    <label className="label">Employee</label>
                    <select required value={attEmployeeId} onChange={e => setAttEmployeeId(e.target.value)} className="input w-full">
                      <option value="">Select Employee</option>
                      {empList.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_number})</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Date</label>
                      <input type="date" required value={attDate} onChange={e => setAttDate(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Status</label>
                      <select value={attStatus} onChange={e => setAttStatus(e.target.value)} className="input w-full">
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="leave">Leave</option>
                        <option value="holiday">Holiday</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Check In Time</label>
                      <input type="time" value={attCheckIn} onChange={e => setAttCheckIn(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Check Out Time</label>
                      <input type="time" value={attCheckOut} onChange={e => setAttCheckOut(e.target.value)} className="input w-full" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Notes</label>
                    <textarea value={attNotes} onChange={e => setAttNotes(e.target.value)} className="input w-full min-h-[80px]" placeholder="Optional notes..." />
                  </div>
                </div>
              )}

              {activeTab === 'payrolls' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Employee</label>
                      <select required value={payEmployeeId} onChange={e => {
                        setPayEmployeeId(e.target.value)
                        const chosen = empList.find((emp: any) => emp.id.toString() === e.target.value)
                        if (chosen) setFormBasicSalary(chosen.basic_salary?.toString() ?? '0')
                      }} className="input w-full">
                        <option value="">Select Employee</option>
                        {empList.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_number})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Period Month</label>
                      <input type="text" placeholder="YYYY-MM" required value={payPeriodMonth} onChange={e => setPayPeriodMonth(e.target.value)} className="input w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label">Working Days</label>
                      <input type="number" required value={payWorkingDays} onChange={e => setPayWorkingDays(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Present Days</label>
                      <input type="number" required value={payPresentDays} onChange={e => setPayPresentDays(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Basic Salary</label>
                      <input type="number" readOnly value={formBasicSalary} className="input w-full bg-muted cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label">Allowances ($)</label>
                      <input type="number" value={payAllowances} onChange={e => setPayAllowances(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Deductions ($)</label>
                      <input type="number" value={payDeductions} onChange={e => setPayDeductions(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Overtime Pay ($)</label>
                      <input type="number" value={payOvertimePay} onChange={e => setPayOvertimePay(e.target.value)} className="input w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label">Status</label>
                      <select value={payStatus} onChange={e => setPayStatus(e.target.value)} className="input w-full">
                        <option value="draft">Draft</option>
                        <option value="approved">Approved</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Paid At Date</label>
                      <input
                        type="date"
                        value={payPaidAt}
                        onChange={e => setPayPaidAt(e.target.value)}
                        className="input w-full"
                        placeholder="Leave empty if not paid"
                      />
                    </div>
                    <div>
                      <label className="label">Calculated Net Salary</label>
                      <div className="input w-full bg-muted font-bold flex items-center text-primary">
                        ${(
                          Number(formBasicSalary || 0) +
                          Number(payAllowances || 0) +
                          Number(payOvertimePay || 0) -
                          Number(payDeductions || 0)
                        ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="label">Notes</label>
                    <textarea value={payNotes} onChange={e => setPayNotes(e.target.value)} className="input w-full min-h-[70px]" placeholder="Optional payroll notes..." />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-border pt-3 mt-4">
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="btn btn-primary flex items-center gap-2">
                  {isPending && <Loader2 className="animate-spin" size={16} />}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default EmployeeFormModal
