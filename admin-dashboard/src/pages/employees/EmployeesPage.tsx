import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Edit2, Trash2, RefreshCw, X, Loader2, 
  Briefcase, Users, UserCheck, DollarSign, Calendar
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'

type Tab = 'employees' | 'departments' | 'positions' | 'attendance' | 'payrolls'

const EmployeesPage: React.FC = () => {
  const qc = useQueryClient()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as Tab) || 'employees'
  const setActiveTab = (tab: Tab) => setSearchParams({ tab })

  const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    reset,
    adjustAfterDelete,
  } = useServerPagination({ storageKey: `employees_${activeTab}` })

  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  
  // Entity states
  const [editingItem, setEditingItem] = useState<any>(null)

  // Common form fields
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)

  // Employee specific fields
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [nik, setNik] = useState('')
  const [gender, setGender] = useState('male')
  const [basicSalary, setBasicSalary] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [positionId, setPositionId] = useState('')

  // Attendance specific fields
  const [employeeId, setEmployeeId] = useState('')
  const [date, setDate] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [attendanceStatus, setAttendanceStatus] = useState('present')
  const [notes, setNotes] = useState('')

  // Payroll specific fields
  const [periodMonth, setPeriodMonth] = useState('')
  const [workingDays, setWorkingDays] = useState('22')
  const [presentDays, setPresentDays] = useState('22')
  const [allowances, setAllowances] = useState('0')
  const [deductions, setDeductions] = useState('0')
  const [overtimePay, setOvertimePay] = useState('0')
  const [payrollStatus, setPayrollStatus] = useState('draft')

  // API Lists
  const { data: listData, isLoading, isFetching } = useQuery({
    queryKey: [activeTab, page, debouncedSearch, perPage],
    queryFn: () => api.get(`/${activeTab}`, { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  // List helpers for dropdowns
  const { data: deptList } = useQuery({
    queryKey: ['departments-list'],
    queryFn: () => api.get('/departments', { params: { per_page: 100 } }).then(r => r.data.data),
    enabled: activeTab === 'employees' || activeTab === 'positions',
  })

  const { data: posList } = useQuery({
    queryKey: ['positions-list'],
    queryFn: () => api.get('/positions', { params: { per_page: 100 } }).then(r => r.data.data),
    enabled: activeTab === 'employees',
  })

  const { data: empList } = useQuery({
    queryKey: ['employees-list'],
    queryFn: () => api.get('/employees', { params: { per_page: 100 } }).then(r => r.data.data),
    enabled: activeTab === 'attendance' || activeTab === 'payrolls',
  })

  const records = listData?.data ?? []
  const pagination = listData?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post(`/${activeTab}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      closeModal()
      toast.success('Created successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create item.')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/${activeTab}/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      closeModal()
      toast.success('Updated successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update item.')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/${activeTab}/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      setConfirmOpen(false)
      toast.success('Deleted successfully.')
      adjustAfterDelete(records.length)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete item. It might be referenced elsewhere.')
      setConfirmOpen(false)
    }
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setName('')
    setCode('')
    setDescription('')
    setIsActive(true)
    setEmail('')
    setPhone('')
    setNik('')
    setGender('male')
    setBasicSalary('')
    setDepartmentId('')
    setPositionId('')
    setEmployeeId('')
    setDate('')
    setCheckIn('')
    setCheckOut('')
    setAttendanceStatus('present')
    setNotes('')
    setPeriodMonth('')
    setWorkingDays('22')
    setPresentDays('22')
    setAllowances('0')
    setDeductions('0')
    setOvertimePay('0')
    setPayrollStatus('draft')
    setModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setEditingItem(item)
    setName(item.name ?? '')
    setCode(item.code ?? '')
    setDescription(item.description ?? '')
    setIsActive(item.is_active ?? true)
    setEmail(item.email ?? '')
    setPhone(item.phone ?? '')
    setNik(item.nik ?? '')
    setGender(item.gender ?? 'male')
    setBasicSalary(item.basic_salary ?? '')
    setDepartmentId(item.department_id ?? '')
    setPositionId(item.position_id ?? '')
    setEmployeeId(item.employee_id ?? '')
    setDate(item.date ?? '')
    setCheckIn(item.check_in ?? '')
    setCheckOut(item.check_out ?? '')
    setAttendanceStatus(item.status ?? 'present')
    setNotes(item.notes ?? '')
    setPeriodMonth(item.period_month ?? '')
    setWorkingDays(item.working_days?.toString() ?? '22')
    setPresentDays(item.present_days?.toString() ?? '22')
    setAllowances(item.allowances ?? '0')
    setDeductions(item.deductions ?? '0')
    setOvertimePay(item.overtime_pay ?? '0')
    setPayrollStatus(item.status ?? 'draft')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingItem(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    let payload: any = {}
    if (activeTab === 'departments') {
      payload = { company_id: 1, name, code, description, is_active: isActive ? 1 : 0 }
    } else if (activeTab === 'positions') {
      payload = { company_id: 1, department_id: Number(departmentId), name, code, description, is_active: isActive ? 1 : 0 }
    } else if (activeTab === 'employees') {
      payload = {
        company_id: 1, department_id: Number(departmentId), position_id: Number(positionId),
        name, email, phone, nik, gender, basic_salary: Number(basicSalary), employee_number: code || Math.random().toString(36).substring(7).toUpperCase()
      }
    } else if (activeTab === 'attendance') {
      payload = { employee_id: Number(employeeId), date, check_in: checkIn, check_out: checkOut, status: attendanceStatus, notes }
    } else if (activeTab === 'payrolls') {
      payload = {
        employee_id: Number(employeeId), period_month: periodMonth, working_days: Number(workingDays),
        present_days: Number(presentDays), basic_salary: Number(basicSalary), allowances: Number(allowances),
        deductions: Number(deductions), overtime_pay: Number(overtimePay), status: payrollStatus,
        net_salary: Number(basicSalary) + Number(allowances) + Number(overtimePay) - Number(deductions)
      }
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const confirmDelete = (id: number) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId)
    }
  }

  const tabsList: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'employees', label: 'Employees', icon: <Users size={16} /> },
    { id: 'departments', label: 'Departments', icon: <Briefcase size={16} /> },
    { id: 'positions', label: 'Positions', icon: <UserCheck size={16} /> },
    { id: 'attendance', label: 'Attendance', icon: <Calendar size={16} /> },
    { id: 'payrolls', label: 'Payrolls', icon: <DollarSign size={16} /> },
  ]

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Employees' }]} />
      
      <PageHeader 
        title="Employee Management" 
        subtitle="Manage employees, departments, positions, attendance, and payroll records"
        action={
          <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
            <Plus size={16} /> Add New
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        {tabsList.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); reset(); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
              activeTab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3 rounded-lg border border-border">
        <SearchInput value={search} onChange={setSearch} placeholder="Search here..." />
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button onClick={() => qc.invalidateQueries({ queryKey: [activeTab] })} className="btn btn-secondary flex items-center gap-2 w-full sm:w-auto">
            <RefreshCw size={16} /> Refresh
          </button>
          <ResetButton onClick={reset} />
        </div>
      </div>

      {/* Data Table */}
      <TableWrapper isFetching={isFetching}>
        <table className="w-full data-table">
          <thead>
            {activeTab === 'employees' && (
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Number</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            )}
            {activeTab === 'departments' && (
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Code</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            )}
            {activeTab === 'positions' && (
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Code</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            )}
            {activeTab === 'attendance' && (
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            )}
            {activeTab === 'payrolls' && (
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Period</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            )}
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingSkeleton cols={activeTab === 'employees' ? 7 : activeTab === 'departments' ? 5 : activeTab === 'positions' ? 5 : activeTab === 'attendance' ? 7 : 6} />
            ) : records.length === 0 ? (
              <EmptyState cols={activeTab === 'employees' ? 7 : activeTab === 'departments' ? 5 : activeTab === 'positions' ? 5 : activeTab === 'attendance' ? 7 : 6} message="No records found" />
            ) : (
              records.map((r: any) => (
                <tr key={r.id}>
                  {activeTab === 'employees' && (
                    <>
                      <td>{r.id}</td>
                      <td className="font-semibold text-foreground">{r.name}</td>
                      <td>{r.employee_number}</td>
                      <td>{r.email}</td>
                      <td>{r.phone}</td>
                      <td>${Number(r.basic_salary).toLocaleString()}</td>
                    </>
                  )}
                  {activeTab === 'departments' && (
                    <>
                      <td>{r.id}</td>
                      <td className="font-semibold text-foreground">{r.name}</td>
                      <td>{r.code}</td>
                      <td>
                        <span className={`badge ${r.is_active ? 'badge-success' : 'badge-muted'}`}>
                          {r.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </>
                  )}
                  {activeTab === 'positions' && (
                    <>
                      <td>{r.id}</td>
                      <td className="font-semibold text-foreground">{r.name}</td>
                      <td>{r.code}</td>
                      <td>{r.department?.name ?? 'N/A'}</td>
                    </>
                  )}
                  {activeTab === 'attendance' && (
                    <>
                      <td>{r.id}</td>
                      <td className="font-semibold text-foreground">{r.employee?.name ?? 'N/A'}</td>
                      <td>{r.date}</td>
                      <td>{r.check_in ?? 'N/A'}</td>
                      <td>{r.check_out ?? 'N/A'}</td>
                      <td>
                        <span className={`badge ${
                          r.status === 'present' ? 'badge-success' : r.status === 'absent' ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </>
                  )}
                  {activeTab === 'payrolls' && (
                    <>
                      <td>{r.id}</td>
                      <td className="font-semibold text-foreground">{r.employee?.name ?? 'N/A'}</td>
                      <td>{r.period_month}</td>
                      <td className="font-semibold">${Number(r.net_salary).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${
                          r.status === 'paid' ? 'badge-success' : 'badge-warning'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </>
                  )}
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(r)} className="btn btn-icon btn-secondary" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => confirmDelete(r.id)} className="btn btn-icon btn-danger" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableWrapper>

      <Pagination
        currentPage={pagination.current_page}
        lastPage={pagination.last_page}
        total={pagination.total}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
      />

      {/* CRUD Modal Form */}
      <AnimatePresence>
        {modalOpen && (
          <div className="modal-backdrop">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content max-w-md w-full">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <h3 className="text-lg font-bold text-foreground">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'departments' && (
                  <>
                    <div>
                      <label className="label">Department Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Department Code</label>
                      <input type="text" required value={code} onChange={e => setCode(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Description</label>
                      <textarea value={description} onChange={e => setDescription(e.target.value)} className="input w-full min-h-[80px]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="checkbox" />
                      <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">Active</label>
                    </div>
                  </>
                )}

                {activeTab === 'positions' && (
                  <>
                    <div>
                      <label className="label">Department</label>
                      <select required value={departmentId} onChange={e => setDepartmentId(e.target.value)} className="input w-full">
                        <option value="">Select Department</option>
                        {deptList?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Position Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Position Code</label>
                      <input type="text" required value={code} onChange={e => setCode(e.target.value)} className="input w-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="checkbox" />
                      <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">Active</label>
                    </div>
                  </>
                )}

                {activeTab === 'employees' && (
                  <>
                    <div>
                      <label className="label">Full Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Email Address</label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Phone Number</label>
                      <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} className="input w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">NIK / ID Card</label>
                        <input type="text" required value={nik} onChange={e => setNik(e.target.value)} className="input w-full" />
                      </div>
                      <div>
                        <label className="label">Gender</label>
                        <select value={gender} onChange={e => setGender(e.target.value)} className="input w-full">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Department</label>
                        <select required value={departmentId} onChange={e => setDepartmentId(e.target.value)} className="input w-full">
                          <option value="">Select Dept</option>
                          {deptList?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label">Position</label>
                        <select required value={positionId} onChange={e => setPositionId(e.target.value)} className="input w-full">
                          <option value="">Select Position</option>
                          {posList?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="label">Basic Salary ($)</label>
                      <input type="number" required value={basicSalary} onChange={e => setBasicSalary(e.target.value)} className="input w-full" />
                    </div>
                  </>
                )}

                {activeTab === 'attendance' && (
                  <>
                    <div>
                      <label className="label">Employee</label>
                      <select required value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="input w-full">
                        <option value="">Select Employee</option>
                        {empList?.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Date</label>
                      <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="input w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Check In</label>
                        <input type="time" required value={checkIn} onChange={e => setCheckIn(e.target.value)} className="input w-full" />
                      </div>
                      <div>
                        <label className="label">Check Out</label>
                        <input type="time" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="input w-full" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Status</label>
                      <select value={attendanceStatus} onChange={e => setAttendanceStatus(e.target.value)} className="input w-full">
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="on_leave">On Leave</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'payrolls' && (
                  <>
                    <div>
                      <label className="label">Employee</label>
                      <select required value={employeeId} onChange={e => {
                        setEmployeeId(e.target.value)
                        const selEmp = empList?.find((emp: any) => emp.id.toString() === e.target.value)
                        if (selEmp) setBasicSalary(selEmp.basic_salary?.toString() ?? '0')
                      }} className="input w-full">
                        <option value="">Select Employee</option>
                        {empList?.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Period Month</label>
                        <input type="text" placeholder="YYYY-MM" required value={periodMonth} onChange={e => setPeriodMonth(e.target.value)} className="input w-full" />
                      </div>
                      <div>
                        <label className="label">Basic Salary</label>
                        <input type="number" readOnly value={basicSalary} className="input w-full bg-muted/40 cursor-not-allowed" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Allowances</label>
                        <input type="number" value={allowances} onChange={e => setAllowances(e.target.value)} className="input w-full" />
                      </div>
                      <div>
                        <label className="label">Deductions</label>
                        <input type="number" value={deductions} onChange={e => setDeductions(e.target.value)} className="input w-full" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Overtime Pay</label>
                      <input type="number" value={overtimePay} onChange={e => setOvertimePay(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Status</label>
                      <select value={payrollStatus} onChange={e => setPayrollStatus(e.target.value)} className="input w-full">
                        <option value="draft">Draft</option>
                        <option value="approved">Approved</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2 border-t border-border pt-3 mt-4">
                  <button type="button" onClick={closeModal} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn btn-primary flex items-center gap-2">
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="animate-spin" size={16} />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog 
        open={confirmOpen} 
        onCancel={() => setConfirmOpen(false)} 
        onConfirm={handleDelete} 
        title="Are you sure you want to delete this item?"
      />
    </div>
  )
}

export default EmployeesPage
