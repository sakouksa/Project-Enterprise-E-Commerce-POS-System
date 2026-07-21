import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X, Loader2,
  Briefcase, Users, UserCheck, DollarSign, Calendar,
  Download, Upload, Filter, Eye, Printer, Settings,
  AlertCircle, CheckCircle2, RotateCcw, ChevronUp, ChevronDown, Check, User,
  Building, Wallet, Activity, Award, QrCode, Smartphone, MapPin, Clock
} from 'lucide-react'
import ShiftsTab from './components/ShiftsTab'
import DynamicQrKioskModal from './components/DynamicQrKioskModal'
import AttendanceDetailModal from './components/AttendanceDetailModal'
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

interface ImportResult {
  success_count: number
  errors: string[]
}

const EmployeesPage: React.FC = () => {
  const qc = useQueryClient()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as Tab) || 'employees'
  const setActiveTab = (tab: Tab) => {
    setSearchParams({ tab })
    setSelectedRows([])
  }

  // Server side pagination
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

  // Sorting
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Additional Filter States
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [filterBranchId, setFilterBranchId] = useState('')
  const [filterDeptId, setFilterDeptId] = useState('')
  const [filterPosId, setFilterPosId] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterGender, setFilterGender] = useState('')
  const [filterDateStart, setFilterDateStart] = useState('')
  const [filterDateEnd, setFilterDateEnd] = useState('')
  const [filterSalaryMin, setFilterSalaryMin] = useState('')
  const [filterSalaryMax, setFilterSalaryMax] = useState('')
  const [filterRole, setFilterRole] = useState('')

  // Trashed Recycle Bin filter
  const [recycleBinMode, setRecycleBinMode] = useState(false)

  // Column Visibility (For Employee list)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    id: true,
    photo: true,
    employee_number: true,
    name: true,
    email: true,
    phone: true,
    branch: true,
    department: true,
    position: true,
    gender: true,
    basic_salary: true,
    join_date: true,
    created_at: true,
    status: true,
  })
  const [showColSettings, setShowColSettings] = useState(false)

  // UI Modals / Drawers states
  const [modalOpen, setModalOpen] = useState(false)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // CSV Import Modal
  const [importOpen, setImportOpen] = useState(false)
  const [kioskModalOpen, setKioskModalOpen] = useState(false)
  const [selectedAttendanceDetail, setSelectedAttendanceDetail] = useState<any | null>(null)
  const [attendanceSubTab, setAttendanceSubTab] = useState<'logs' | 'shifts'>('logs')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  // Bulk actions
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  // Delete confirmations
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [forceDeleteMode, setForceDeleteMode] = useState(false)

  // Form Fields
  const [formCompanyId, setFormCompanyId] = useState('1')
  const [formBranchId, setFormBranchId] = useState('1')
  const [formDeptId, setFormDeptId] = useState('')
  const [formPosId, setFormPosId] = useState('')
  const [formUserId, setFormUserId] = useState('')
  const [formEmployeeNumber, setFormEmployeeNumber] = useState('')
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formNik, setFormNik] = useState('')
  const [formGender, setFormGender] = useState('male')
  const [formBirthDate, setFormBirthDate] = useState('')
  const [formAddress, setFormAddress] = useState('')
  const [formPhoto, setFormPhoto] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [formJoinDate, setFormJoinDate] = useState('')
  const [formResignDate, setFormResignDate] = useState('')
  const [formStatus, setFormStatus] = useState('active')
  const [formBasicSalary, setFormBasicSalary] = useState('')

  // Form Fields for Attendance
  const [attEmployeeId, setAttEmployeeId] = useState('')
  const [attDate, setAttDate] = useState('')
  const [attCheckIn, setAttCheckIn] = useState('')
  const [attCheckOut, setAttCheckOut] = useState('')
  const [attStatus, setAttStatus] = useState('present')
  const [attNotes, setAttNotes] = useState('')

  // Form Fields for Payroll
  const [payEmployeeId, setPayEmployeeId] = useState('')
  const [payPeriodMonth, setPayPeriodMonth] = useState('')
  const [payWorkingDays, setPayWorkingDays] = useState('22')
  const [payPresentDays, setPayPresentDays] = useState('22')
  const [payAllowances, setPayAllowances] = useState('0')
  const [payDeductions, setPayDeductions] = useState('0')
  const [payOvertimePay, setPayOvertimePay] = useState('0')
  const [payStatus, setPayStatus] = useState('draft')
  const [payPaidAt, setPayPaidAt] = useState('')
  const [payNotes, setPayNotes] = useState('')

  // Fetch Dashboard Stats
  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ['employee-stats'],
    queryFn: () => api.get('/employees/stats').then(r => r.data.data),
  })

  // Eager load lists for dropdown options
  const { data: companiesList } = useQuery({
    queryKey: ['companies-list'],
    queryFn: () => api.get('/companies', { params: { per_page: 100 } }).then(r => r.data.data),
  })

  const { data: branchesList } = useQuery({
    queryKey: ['branches-list'],
    queryFn: () => api.get('/branches', { params: { per_page: 100 } }).then(r => r.data.data),
  })

  const { data: deptList } = useQuery({
    queryKey: ['departments-list'],
    queryFn: () => api.get('/departments', { params: { per_page: 100 } }).then(r => r.data.data),
  })

  const { data: posList } = useQuery({
    queryKey: ['positions-list'],
    queryFn: () => api.get('/positions', { params: { per_page: 100 } }).then(r => r.data.data),
  })

  const { data: usersList } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => api.get('/users', { params: { per_page: 100 } }).then(r => r.data.data),
  })

  const { data: empList } = useQuery({
    queryKey: ['employees-list'],
    queryFn: () => api.get('/employees', { params: { per_page: 200 } }).then(r => r.data.data),
  })

  // Fetch main list data
  const buildFilters = () => {
    const f: any = {
      page,
      search: debouncedSearch,
      per_page: perPage,
      sort_by: sortBy,
      sort_order: sortOrder,
    }
    if (recycleBinMode) {
      f.status = 'deleted'
    } else {
      if (filterStatus) f.status = filterStatus
    }
    if (filterBranchId) f.branch_id = filterBranchId
    if (filterDeptId) f.department_id = filterDeptId
    if (filterPosId) f.position_id = filterPosId
    if (filterGender) f.gender = filterGender
    if (filterDateStart) {
      if (activeTab === 'attendance') f.date_start = filterDateStart
      else if (activeTab === 'payrolls') f.period_month = filterDateStart.substring(0, 7)
      else f.join_date_start = filterDateStart
    }
    if (filterDateEnd) {
      if (activeTab === 'attendance') f.date_end = filterDateEnd
      else f.join_date_end = filterDateEnd
    }
    if (filterSalaryMin) f.salary_min = filterSalaryMin
    if (filterSalaryMax) f.salary_max = filterSalaryMax
    return f
  }

  const { data: listData, isLoading, isFetching } = useQuery({
    queryKey: [activeTab, recycleBinMode, page, debouncedSearch, perPage, sortBy, sortOrder, filterBranchId, filterDeptId, filterPosId, filterStatus, filterGender, filterDateStart, filterDateEnd, filterSalaryMin, filterSalaryMax],
    queryFn: () => api.get(`/${activeTab}`, { params: buildFilters() }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const records = listData?.data ?? []
  const pagination = listData?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post(`/${activeTab}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      refetchStats()
      closeModal()
      toast.success('Record created successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create record.')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/${activeTab}/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      refetchStats()
      closeModal()
      toast.success('Record updated successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update record.')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, force }: { id: number; force: boolean }) => {
      const url = force ? `/${activeTab}/${id}/force` : `/${activeTab}/${id}`
      return api.delete(url)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      refetchStats()
      setConfirmOpen(false)
      toast.success(forceDeleteMode ? 'Record permanently deleted.' : 'Record deleted successfully.')
      adjustAfterDelete(records.length)
      setSelectedRows([])
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete record. It might be referenced elsewhere.')
      setConfirmOpen(false)
    }
  })

  const restoreMutation = useMutation({
    mutationFn: (id: number) => api.post(`/${activeTab}/${id}/restore`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      refetchStats()
      toast.success('Record restored successfully.')
      setSelectedRows([])
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to restore record.')
    }
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => api.post(`/${activeTab}/bulk-delete`, { ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      refetchStats()
      toast.success('Selected records deleted successfully.')
      setSelectedRows([])
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to perform bulk deletion.')
    }
  })

  const bulkRestoreMutation = useMutation({
    mutationFn: (ids: number[]) => api.post(`/${activeTab}/bulk-restore`, { ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      refetchStats()
      toast.success('Selected records restored successfully.')
      setSelectedRows([])
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to perform bulk restoration.')
    }
  })

  // Export
  const handleExport = () => {
    toast.info('Generating export... download will begin shortly.')
    api.get(`/${activeTab}/export`, { params: buildFilters(), responseType: 'blob' })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.download = `${activeTab}_export_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Export downloaded successfully.')
      })
      .catch(() => toast.error('Export failed. Please try again.'))
  }

  // Import Upload
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!importFile) return
    setImporting(true)
    setImportResult(null)

    const formData = new FormData()
    formData.append('file', importFile)

    api.post(`/${activeTab}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(res => {
        setImporting(false)
        const resData = res.data.data as ImportResult
        setImportResult(resData)
        if (resData.errors.length === 0) {
          toast.success(`Successfully imported ${resData.success_count} records.`)
          qc.invalidateQueries({ queryKey: [activeTab] })
          refetchStats()
          closeImportModal()
        } else {
          toast.warning(`Import completed with errors. ${resData.success_count} records imported.`)
        }
      })
      .catch(err => {
        setImporting(false)
        toast.error(err?.response?.data?.message ?? 'Failed to import CSV.')
      })
  }

  // Handle Photo File Upload
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('photo', file)

    setUploadingPhoto(true)
    try {
      const res = await api.post('/employees/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const path = res.data.data.path || res.data.data.url
      setFormPhoto(path)
      toast.success('Employee photo uploaded successfully.')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to upload photo.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  // Handle sorting trigger
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
  }

  // Row Selection logic
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(records.map((r: any) => r.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id])
    } else {
      setSelectedRows(prev => prev.filter(item => item !== id))
    }
  }

  // Open Forms
  const openCreateModal = () => {
    setSelectedItem(null)
    // Clear Employee fields
    setFormCompanyId('1')
    setFormBranchId('1')
    setFormDeptId('')
    setFormPosId('')
    setFormUserId('')
    setFormEmployeeNumber(`EMP${Math.floor(100000 + Math.random() * 900000)}`)
    setFormName('')
    setFormEmail('')
    setFormPhone('')
    setFormNik('')
    setFormGender('male')
    setFormBirthDate('')
    setFormAddress('')
    setFormPhoto('')
    setFormJoinDate(new Date().toISOString().split('T')[0])
    setFormResignDate('')
    setFormStatus('active')
    setFormBasicSalary('')

    // Clear Attendance fields
    setAttEmployeeId('')
    setAttDate(new Date().toISOString().split('T')[0])
    setAttCheckIn('08:00')
    setAttCheckOut('17:00')
    setAttStatus('present')
    setAttNotes('')

    // Clear Payroll fields
    setPayEmployeeId('')
    setPayPeriodMonth(new Date().toISOString().substring(0, 7))
    setPayWorkingDays('22')
    setPayPresentDays('22')
    setPayAllowances('0')
    setPayDeductions('0')
    setPayOvertimePay('0')
    setPayStatus('draft')
    setPayPaidAt('')
    setPayNotes('')

    setModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setSelectedItem(item)
    if (activeTab === 'departments') {
      setFormName(item.name)
      setFormEmployeeNumber(item.code ?? '')
      setFormCompanyId(item.company_id?.toString() ?? '1')
      setFormBranchId(item.branch_id?.toString() ?? '1')
      setFormAddress(item.description ?? '')
      setFormStatus(item.is_active ? 'active' : 'inactive')
    } else if (activeTab === 'positions') {
      setFormName(item.name)
      setFormEmployeeNumber(item.code ?? '')
      setFormCompanyId(item.company_id?.toString() ?? '1')
      setFormDeptId(item.department_id?.toString() ?? '')
      setFormAddress(item.description ?? '')
      setFormStatus(item.is_active ? 'active' : 'inactive')
    } else if (activeTab === 'employees') {
      setFormCompanyId(item.company_id?.toString() ?? '1')
      setFormBranchId(item.branch_id?.toString() ?? '1')
      setFormDeptId(item.department_id?.toString() ?? '')
      setFormPosId(item.position_id?.toString() ?? '')
      setFormUserId(item.user_id?.toString() ?? '')
      setFormEmployeeNumber(item.employee_number)
      setFormName(item.name)
      setFormEmail(item.email ?? '')
      setFormPhone(item.phone ?? '')
      setFormNik(item.nik ?? '')
      setFormGender(item.gender ?? 'male')
      setFormBirthDate(item.birth_date ? item.birth_date.split('T')[0] : '')
      setFormAddress(item.address ?? '')
      setFormPhoto(item.photo ?? '')
      setFormJoinDate(item.join_date ? item.join_date.split('T')[0] : '')
      setFormResignDate(item.resign_date ? item.resign_date.split('T')[0] : '')
      setFormStatus(item.status)
      setFormBasicSalary(item.basic_salary?.toString() ?? '')
    } else if (activeTab === 'attendance') {
      setAttEmployeeId(item.employee_id?.toString() ?? '')
      setAttDate(item.date ? item.date.split('T')[0] : '')
      setAttCheckIn(item.check_in ?? '')
      setAttCheckOut(item.check_out ?? '')
      setAttStatus(item.status)
      setAttNotes(item.notes ?? '')
    } else if (activeTab === 'payrolls') {
      setPayEmployeeId(item.employee_id?.toString() ?? '')
      setPayPeriodMonth(item.period_month)
      setPayWorkingDays(item.working_days?.toString() ?? '22')
      setPayPresentDays(item.present_days?.toString() ?? '22')
      setFormBasicSalary(item.basic_salary?.toString() ?? '0')
      setPayAllowances(item.allowances?.toString() ?? '0')
      setPayDeductions(item.deductions?.toString() ?? '0')
      setPayOvertimePay(item.overtime_pay?.toString() ?? '0')
      setPayStatus(item.status)
      setPayPaidAt(item.paid_at ? item.paid_at.split('T')[0] : '')
      setPayNotes(item.notes ?? '')
    }
    setModalOpen(true)
  }

  const openViewDrawer = (item: any) => {
    setSelectedItem(item)
    setDetailDrawerOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedItem(null)
  }

  const closeImportModal = () => {
    setImportOpen(false)
    setImportFile(null)
    setImportResult(null)
  }

  // Handle Filter resets
  const handleResetFilters = () => {
    setFilterBranchId('')
    setFilterDeptId('')
    setFilterPosId('')
    setFilterStatus('')
    setFilterGender('')
    setFilterDateStart('')
    setFilterDateEnd('')
    setFilterSalaryMin('')
    setFilterSalaryMax('')
    setFilterRole('')
    setRecycleBinMode(false)
    reset()
  }

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let payload: any = {}
    if (activeTab === 'departments') {
      payload = {
        company_id: Number(formCompanyId),
        branch_id: Number(formBranchId),
        name: formName,
        code: formEmployeeNumber || null,
        description: formAddress || null,
        is_active: formStatus === 'active'
      }
    } else if (activeTab === 'positions') {
      payload = {
        company_id: Number(formCompanyId),
        department_id: Number(formDeptId),
        name: formName,
        code: formEmployeeNumber || null,
        description: formAddress || null,
        is_active: formStatus === 'active'
      }
    } else if (activeTab === 'employees') {
      payload = {
        company_id: Number(formCompanyId),
        branch_id: Number(formBranchId),
        department_id: formDeptId ? Number(formDeptId) : null,
        position_id: formPosId ? Number(formPosId) : null,
        user_id: formUserId ? Number(formUserId) : null,
        employee_number: formEmployeeNumber,
        name: formName,
        email: formEmail || null,
        phone: formPhone || null,
        nik: formNik || null,
        gender: formGender,
        birth_date: formBirthDate || null,
        address: formAddress || null,
        photo: formPhoto || null,
        join_date: formJoinDate || null,
        resign_date: formResignDate || null,
        status: formStatus,
        basic_salary: formBasicSalary ? Number(formBasicSalary) : 0
      }
    } else if (activeTab === 'attendance') {
      payload = {
        employee_id: Number(attEmployeeId),
        date: attDate,
        check_in: attCheckIn || null,
        check_out: attCheckOut || null,
        status: attStatus,
        notes: attNotes || null
      }
    } else if (activeTab === 'payrolls') {
      const basic = formBasicSalary ? Number(formBasicSalary) : 0
      const allow = payAllowances ? Number(payAllowances) : 0
      const ded = payDeductions ? Number(payDeductions) : 0
      const ot = payOvertimePay ? Number(payOvertimePay) : 0
      const net = basic + allow + ot - ded
      payload = {
        employee_id: Number(payEmployeeId),
        period_month: payPeriodMonth,
        working_days: Number(payWorkingDays),
        present_days: Number(payPresentDays),
        basic_salary: basic,
        allowances: allow,
        deductions: ded,
        overtime_pay: ot,
        net_salary: net,
        status: payStatus,
        paid_at: payPaidAt || null,
        notes: payNotes || null
      }
    }

    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  // Delete Action trigger
  const confirmDelete = (id: number, force = false) => {
    setDeleteId(id)
    setForceDeleteMode(force)
    setConfirmOpen(true)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId, force: forceDeleteMode })
    }
  }

  // Get photo absolute url
  const getPhotoUrl = (photoPath?: string) => {
    if (!photoPath) return null
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) return photoPath
    const baseUrl = api.defaults.baseURL ? api.defaults.baseURL.split('/api')[0] : 'http://127.0.0.1:8001'
    return `${baseUrl}/storage/${photoPath}`
  }

  const presentCount = statsData?.attendance_today?.present ?? 0
  const lateCount = statsData?.attendance_today?.late ?? 0
  const absentCount = statsData?.attendance_today?.absent ?? 0
  const leaveCount = statsData?.attendance_today?.leave ?? 0
  const holidayCount = statsData?.attendance_today?.holiday ?? 0
  const totalToday = presentCount + lateCount + absentCount + leaveCount + holidayCount
  const attendanceRate = totalToday > 0 ? Math.round(((presentCount + lateCount) / totalToday) * 100) : 100

  const monthlyPayroll = statsData?.monthly_salary_expense ?? 0
  const averageSalary = statsData?.average_salary ?? 0

  const activeFiltersCount = [
    filterBranchId,
    filterDeptId,
    filterPosId,
    filterStatus,
    filterGender,
    filterDateStart,
    filterDateEnd,
    filterSalaryMin,
    filterSalaryMax,
    filterRole,
  ].filter(Boolean).length

  return (
    <div className="space-y-5 print:p-0">
      <Breadcrumb
        items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Employee Management' },
        ]}
      />
      {/* Premium Header Card */}
      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm print:hidden">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <span>Employee Management</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            Manage employees, departments, positions, attendance, payroll, employment status, and workforce performance across the Enterprise ERP platform.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'attendance' && (
            <button
              onClick={() => setKioskModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors shadow-sm"
            >
              <QrCode size={15} />
              <span>Launch QR Kiosk</span>
            </button>
          )}
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm"
          >
            <Upload size={15} />
            <span>Import CSV</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus size={16} />
            <span>{activeTab === 'attendance' ? 'Add Attendance' : 'Add Employee'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards (Using Real Data from Backend) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        {/* Card 1: Total Employees */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Employees</p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              {statsData?.total_employees ?? empList?.length ?? 0}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-green-500 font-bold">
                {statsData?.active_employees ?? empList?.filter((e: any) => e.status === 'active').length ?? 0} Active
              </span>
              <span>•</span>
              <span>
                {statsData?.resigned_employees ?? empList?.filter((e: any) => e.status === 'resigned').length ?? 0} Resigned
              </span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500">
            <Users size={22} />
          </div>
        </motion.div>

        {/* Card 2: Departments & Positions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Departments & Positions</p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              {statsData?.total_departments ?? deptList?.length ?? 0}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-blue-500 font-bold">
                {statsData?.total_positions ?? posList?.length ?? 0} Positions
              </span>
              <span>•</span>
              <span>{branchesList?.length ?? 0} Branches</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
            <Building size={22} />
          </div>
        </motion.div>

        {/* Card 3: Employee Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Attendance Rate</p>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">{attendanceRate}%</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-500 font-bold">{presentCount} Present</span>
              <span>•</span>
              <span className="text-rose-500 font-bold">{absentCount} Absent</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Activity size={22} />
          </div>
        </motion.div>

        {/* Card 4: Payroll Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Monthly Payroll</p>
            <p className="text-xl font-extrabold text-foreground tracking-tight truncate max-w-[190px]">
              ${monthlyPayroll.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Avg: ${averageSalary.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} | <span className="text-amber-500 font-semibold">{statsData?.payroll_draft ?? 0} Pending</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Wallet size={22} />
          </div>
        </motion.div>
      </div>

      {/* Second Row Mini Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 print:hidden">
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase">Employee Today</span>
          <span className="text-lg font-extrabold text-foreground mt-1">
            {statsData?.total_employees ?? empList?.length ?? 0}
          </span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-blue-500 font-semibold uppercase">New Today</span>
          <span className="text-lg font-extrabold text-blue-500 mt-1">
            {statsData?.new_today_employees ?? 0}
          </span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-emerald-600 font-semibold uppercase">Present Today</span>
          <span className="text-lg font-extrabold text-emerald-500 mt-1">{presentCount}</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-rose-500 font-semibold uppercase">Absent Today</span>
          <span className="text-lg font-extrabold text-rose-500 mt-1">{absentCount}</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-amber-500 font-semibold uppercase">Late Today</span>
          <span className="text-lg font-extrabold text-amber-500 mt-1">{lateCount}</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-indigo-500 font-semibold uppercase">On Leave</span>
          <span className="text-lg font-extrabold text-indigo-500 mt-1">{leaveCount}</span>
        </div>
      </div>
      {/* Enterprise Workspace Navigation Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex border border-border bg-card rounded-2xl p-1 overflow-x-auto gap-1 shadow-sm w-full md:w-auto">
          {[
            { id: 'employees', label: 'Employees', icon: <Users size={15} /> },
            { id: 'departments', label: 'Departments', icon: <Briefcase size={15} /> },
            { id: 'positions', label: 'Positions', icon: <UserCheck size={15} /> },
            { id: 'attendance', label: 'Attendance', icon: <Calendar size={15} /> },
            { id: 'payrolls', label: 'Payrolls', icon: <DollarSign size={15} /> },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id as Tab)
                setSelectedRows([])
              }}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${activeTab === t.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'attendance' && (
          <div className="flex items-center bg-muted/40 p-1 rounded-2xl border border-border/60">
            <button
              onClick={() => setAttendanceSubTab('logs')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                attendanceSubTab === 'logs' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Attendance Logs
            </button>
            <button
              onClick={() => setAttendanceSubTab('shifts')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                attendanceSubTab === 'shifts' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Shift Schedules
            </button>
          </div>
        )}
      </div>

      {/* Search + Action Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-sm print:hidden">
        {/* Left: Search & Filter Drawer Toggle & Reset */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[260px] sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search Employee Name, ID, Email, Phone, Department, Position..."
              className="form-input pl-9 w-full text-xs rounded-xl border border-border bg-card text-foreground"
            />
          </div>

          <button
            onClick={() => setFilterDrawerOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border transition-all duration-200 shadow-sm
                       ${activeFiltersCount > 0
                ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <Filter size={14} className={activeFiltersCount > 0 ? 'text-primary' : 'text-muted-foreground'} />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-primary text-white rounded-full leading-none">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {['employees', 'departments', 'positions'].includes(activeTab) && (
            <button
              onClick={() => {
                setRecycleBinMode(!recycleBinMode)
                setSelectedRows([])
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border transition-colors shadow-sm
                         ${recycleBinMode
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 font-semibold'
                  : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              title="Recycle Bin Trashed Items"
            >
              <Trash2 size={14} />
              <span>{recycleBinMode ? 'Exit Trash' : 'Trash Bin'}</span>
            </button>
          )}

          <ResetButton onClick={handleResetFilters} />
        </div>

        {/* Right: Toolbar actions */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-1.5 bg-muted/40 p-1 px-2 rounded-xl border border-border mr-1 animate-fade-in">
              <span className="text-[10px] text-muted-foreground font-semibold px-1">{selectedRows.length} Selected</span>
              {recycleBinMode ? (
                <>
                  <button
                    onClick={() => bulkRestoreMutation.mutate(selectedRows)}
                    className="p-1.5 hover:bg-green-50 dark:hover:bg-green-950/20 text-green-500 rounded-lg transition-colors"
                    title="Bulk Restore"
                  >
                    <RotateCcw size={13} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Permanently delete all selected items?')) {
                        selectedRows.forEach(id => deleteMutation.mutate({ id, force: true }))
                      }
                    }}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg transition-colors"
                    title="Bulk Permanent Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    if (confirm('Move all selected items to trash?')) {
                      bulkDeleteMutation.mutate(selectedRows)
                    }
                  }}
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg transition-colors"
                  title="Bulk Delete"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => qc.invalidateQueries({ queryKey: [activeTab] })}
            className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>

          {/* Column Visibility settings */}
          {activeTab === 'employees' && (
            <div className="relative">
              <button
                onClick={() => setShowColSettings(!showColSettings)}
                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm"
                title="Column Settings"
              >
                <Settings size={14} />
              </button>
              <AnimatePresence>
                {showColSettings && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowColSettings(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl p-2 z-20 space-y-1">
                      <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase">Toggle Columns</p>
                      <div className="max-h-56 overflow-y-auto space-y-0.5">
                        {Object.keys(visibleColumns).map(col => (
                          <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-xl text-xs cursor-pointer text-foreground capitalize">
                            <input
                              type="checkbox"
                              checked={visibleColumns[col]}
                              onChange={e => setVisibleColumns(prev => ({ ...prev, [col]: e.target.checked }))}
                              className="form-checkbox h-3.5 w-3.5 text-primary rounded border-border"
                            />
                            <span>{col.replace('_', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Employee Filters Drawer (Custom Framer Motion Drawer with full Dark/Light Mode support) */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
              onClick={() => setFilterDrawerOpen(false)}
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border shadow-2xl z-50 flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-border bg-card">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-primary" />
                  <h3 className="font-bold text-base text-foreground">
                    Advanced Employee Filters
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1.5 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Body Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-card">
                {/* Branch Filter */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Branch</label>
                  <select
                    value={filterBranchId}
                    onChange={e => setFilterBranchId(e.target.value)}
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer"
                  >
                    <option value="">All Branches</option>
                    {branchesList?.map((b: any) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Department Filter */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Department</label>
                  <select
                    value={filterDeptId}
                    onChange={e => setFilterDeptId(e.target.value)}
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer"
                  >
                    <option value="">All Departments</option>
                    {deptList?.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Position Filter */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Position</label>
                  <select
                    value={filterPosId}
                    onChange={e => setFilterPosId(e.target.value)}
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer"
                  >
                    <option value="">All Positions</option>
                    {posList?.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Role Filter */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Role</label>
                  <select
                    value={filterRole}
                    onChange={e => setFilterRole(e.target.value)}
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer"
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                {/* Employment Status Filter */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Employment Status</label>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="resigned">Resigned</option>
                  </select>
                </div>

                {/* Attendance Status Filter */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Attendance Status</label>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="leave">Leave</option>
                    <option value="holiday">Holiday</option>
                  </select>
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Gender</label>
                  <select
                    value={filterGender}
                    onChange={e => setFilterGender(e.target.value)}
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer"
                  >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Date Joined / Date Range Filter */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Date Joined / Date Start</label>
                  <input
                    type="date"
                    value={filterDateStart}
                    onChange={e => setFilterDateStart(e.target.value)}
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Date Joined / Date End</label>
                  <input
                    type="date"
                    value={filterDateEnd}
                    onChange={e => setFilterDateEnd(e.target.value)}
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2"
                  />
                </div>

                {/* Basic Salary Range */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Min Salary ($)</label>
                    <input
                      type="number"
                      value={filterSalaryMin}
                      onChange={e => setFilterSalaryMin(e.target.value)}
                      placeholder="Min"
                      className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">Max Salary ($)</label>
                    <input
                      type="number"
                      value={filterSalaryMax}
                      onChange={e => setFilterSalaryMax(e.target.value)}
                      placeholder="Max"
                      className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl border border-border transition-colors"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFilterDrawerOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted border border-border rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterDrawerOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Table Container UI or Shifts Tab */}
      {activeTab === 'attendance' && attendanceSubTab === 'shifts' ? (
        <ShiftsTab />
      ) : (
        <>
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden print:hidden">
            <TableWrapper isFetching={isFetching}>
              <div className="overflow-x-auto">
                <table className="w-full data-table border-collapse">
                  <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
                    <tr>
                      <th className="w-8 !px-3">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={records.length > 0 && selectedRows.length === records.length}
                          onChange={e => handleSelectAll(e.target.checked)}
                        />
                      </th>
                      {activeTab === 'employees' && (
                        <>
                          {visibleColumns.id && <th className="cursor-pointer select-none" onClick={() => handleSort('id')}>ID {renderSortIcon('id')}</th>}
                          {visibleColumns.photo && <th>Photo</th>}
                          {visibleColumns.employee_number && <th className="cursor-pointer select-none" onClick={() => handleSort('employee_number')}>Employee Number {renderSortIcon('employee_number')}</th>}
                          {visibleColumns.name && <th className="cursor-pointer select-none" onClick={() => handleSort('name')}>Name {renderSortIcon('name')}</th>}
                          {visibleColumns.email && <th className="cursor-pointer select-none" onClick={() => handleSort('email')}>Email {renderSortIcon('email')}</th>}
                          {visibleColumns.phone && <th>Phone</th>}
                          {visibleColumns.branch && <th>Branch</th>}
                          {visibleColumns.department && <th>Department</th>}
                          {visibleColumns.position && <th>Position</th>}
                          {visibleColumns.gender && <th>Gender</th>}
                          {visibleColumns.basic_salary && <th className="cursor-pointer select-none" onClick={() => handleSort('basic_salary')}>Basic Salary {renderSortIcon('basic_salary')}</th>}
                          {visibleColumns.join_date && <th className="cursor-pointer select-none" onClick={() => handleSort('join_date')}>Join Date {renderSortIcon('join_date')}</th>}
                          {visibleColumns.created_at && <th className="cursor-pointer select-none" onClick={() => handleSort('created_at')}>Created At {renderSortIcon('created_at')}</th>}
                          {visibleColumns.status && <th className="cursor-pointer select-none" onClick={() => handleSort('status')}>Status {renderSortIcon('status')}</th>}
                        </>
                      )}
                      {activeTab === 'departments' && (
                        <>
                          <th className="cursor-pointer select-none" onClick={() => handleSort('id')}>ID {renderSortIcon('id')}</th>
                          <th className="cursor-pointer select-none" onClick={() => handleSort('name')}>Name {renderSortIcon('name')}</th>
                          <th className="cursor-pointer select-none" onClick={() => handleSort('code')}>Code {renderSortIcon('code')}</th>
                          <th>Positions</th>
                          <th>Employees</th>
                          <th>Status</th>
                        </>
                      )}
                      {activeTab === 'positions' && (
                        <>
                          <th className="cursor-pointer select-none" onClick={() => handleSort('id')}>ID {renderSortIcon('id')}</th>
                          <th className="cursor-pointer select-none" onClick={() => handleSort('name')}>Name {renderSortIcon('name')}</th>
                          <th className="cursor-pointer select-none" onClick={() => handleSort('code')}>Code {renderSortIcon('code')}</th>
                          <th>Department</th>
                          <th>Employees</th>
                          <th>Status</th>
                        </>
                      )}
                      {activeTab === 'attendance' && (
                        <>
                          <th className="w-[12%] cursor-pointer select-none" onClick={() => handleSort('attendance_date')}>Date {renderSortIcon('attendance_date')}</th>
                          <th className="w-[18%]">Employee</th>
                          <th className="w-[14%]">Department / Position</th>
                          <th className="w-[10%]">Shift</th>
                          <th className="w-[10%] cursor-pointer select-none" onClick={() => handleSort('check_in')}>Check In {renderSortIcon('check_in')}</th>
                          <th className="w-[10%] cursor-pointer select-none" onClick={() => handleSort('check_out')}>Check Out {renderSortIcon('check_out')}</th>
                          <th className="w-[10%]">Worked Hours</th>
                          <th className="w-[8%]">Late</th>
                          <th className="w-[8%]">Overtime</th>
                          <th className="w-[10%] cursor-pointer select-none" onClick={() => handleSort('status')}>Status {renderSortIcon('status')}</th>
                          <th className="w-[12%]">Device & Method</th>
                        </>
                      )}
                      {activeTab === 'payrolls' && (
                        <>
                          <th className="cursor-pointer select-none" onClick={() => handleSort('period_month')}>Period {renderSortIcon('period_month')}</th>
                          <th>Employee</th>
                          <th className="cursor-pointer select-none" onClick={() => handleSort('basic_salary')}>Basic Salary {renderSortIcon('basic_salary')}</th>
                          <th>Allowances</th>
                          <th>Deductions</th>
                          <th>Overtime</th>
                          <th className="cursor-pointer select-none" onClick={() => handleSort('net_salary')}>Net Salary {renderSortIcon('net_salary')}</th>
                          <th className="cursor-pointer select-none" onClick={() => handleSort('status')}>Status {renderSortIcon('status')}</th>
                          <th>Paid At</th>
                        </>
                      )}
                      <th className="print:hidden">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <LoadingSkeleton cols={10} />
                    ) : records.length === 0 ? (
                      <EmptyState cols={10} message="No employee module records found" />
                    ) : (
                      records.map((r: any) => (
                        <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                          <td className="!px-3">
                            <input
                              type="checkbox"
                              className="checkbox"
                              checked={selectedRows.includes(r.id)}
                              onChange={e => handleSelectRow(r.id, e.target.checked)}
                            />
                          </td>
                          {activeTab === 'employees' && (
                            <>
                              {visibleColumns.id && <td>{r.id}</td>}
                              {visibleColumns.photo && (
                                <td>
                                  <div className="w-9 h-9 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center">
                                    {r.photo ? (
                                      <img src={getPhotoUrl(r.photo) || ''} alt="" className="object-cover w-full h-full" />
                                    ) : (
                                      <User size={16} className="text-muted-foreground" />
                                    )}
                                  </div>
                                </td>
                              )}
                              {visibleColumns.employee_number && <td className="font-mono text-xs">{r.employee_number}</td>}
                              {visibleColumns.name && (
                                <td className="font-semibold text-foreground hover:text-primary cursor-pointer" onClick={() => openViewDrawer(r)}>
                                  {r.name}
                                </td>
                              )}
                              {visibleColumns.email && <td className="text-xs text-muted-foreground">{r.email ?? 'N/A'}</td>}
                              {visibleColumns.phone && <td>{r.phone ?? 'N/A'}</td>}
                              {visibleColumns.branch && <td>{r.branch?.name ?? 'N/A'}</td>}
                              {visibleColumns.department && <td>{r.department?.name ?? 'N/A'}</td>}
                              {visibleColumns.position && <td>{r.position?.name ?? 'N/A'}</td>}
                              {visibleColumns.gender && (
                                <td className="capitalize text-xs">
                                  <span className={`px-2 py-0.5 rounded-full font-medium ${r.gender === 'male' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'}`}>
                                    {r.gender}
                                  </span>
                                </td>
                              )}
                              {visibleColumns.basic_salary && <td className="font-semibold">${Number(r.basic_salary).toLocaleString()}</td>}
                              {visibleColumns.join_date && <td>{r.join_date ? new Date(r.join_date).toLocaleDateString() : 'N/A'}</td>}
                              {visibleColumns.created_at && <td className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>}
                              {visibleColumns.status && (
                                <td>
                                  {r.status === 'active' ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize">
                                      {r.status}
                                    </span>
                                  ) : r.status === 'on_leave' || r.status === 'leave' ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 capitalize">
                                      On Leave
                                    </span>
                                  ) : r.status === 'suspended' || r.status === 'resigned' ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 capitalize">
                                      {r.status}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 capitalize">
                                      {r.status}
                                    </span>
                                  )}
                                </td>
                              )}
                            </>
                          )}
                          {activeTab === 'departments' && (
                            <>
                              <td>{r.id}</td>
                              <td className="font-semibold text-foreground">{r.name}</td>
                              <td className="font-mono text-xs">{r.code ?? 'N/A'}</td>
                              <td>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                  <Briefcase size={12} className="opacity-70" />
                                  {r.positions_count ?? 0} {r.positions_count === 1 ? 'Position' : 'Positions'}
                                </span>
                              </td>
                              <td>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                  <Users size={12} className="opacity-70" />
                                  {r.employees_count ?? 0} {r.employees_count === 1 ? 'Employee' : 'Employees'}
                                </span>
                              </td>
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
                              <td className="font-mono text-xs">{r.code ?? 'N/A'}</td>
                              <td>{r.department?.name ?? 'N/A'}</td>
                              <td>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                  <Users size={12} className="opacity-70" />
                                  {r.employees_count ?? 0} {r.employees_count === 1 ? 'Employee' : 'Employees'}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${r.is_active ? 'badge-success' : 'badge-muted'}`}>
                                  {r.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </>
                          )}
                          {activeTab === 'attendance' && (
                            <>
                              <td className="font-semibold text-xs font-mono">{r.attendance_date ?? (r.date ? new Date(r.date).toLocaleDateString() : 'N/A')}</td>
                              <td>
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs overflow-hidden border border-primary/20">
                                    {r.employee?.photo ? (
                                      <img src={r.employee.photo} alt={r.employee.name} className="w-full h-full object-cover" />
                                    ) : (
                                      r.employee?.name ? r.employee.name.substring(0, 2).toUpperCase() : 'EM'
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-foreground text-xs">{r.employee?.name ?? 'N/A'}</p>
                                    <p className="font-mono text-[10px] text-muted-foreground">{r.employee?.employee_number ?? 'N/A'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="text-xs">
                                <p className="font-semibold text-foreground">{r.department?.name ?? r.employee?.department?.name ?? 'General'}</p>
                                <p className="text-[10px] text-muted-foreground">{r.position?.name ?? r.employee?.position?.name ?? '-'}</p>
                              </td>
                              <td className="text-xs font-semibold">{r.shift?.name ?? 'Morning Shift'}</td>
                              <td className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{r.check_in ?? '--:--'}</td>
                              <td className="font-mono text-xs text-rose-500 font-semibold">{r.check_out ?? '--:--'}</td>
                              <td className="text-xs font-bold text-foreground">{r.working_hours ?? r.worked_hours_formatted ?? '-'}</td>
                              <td className={`text-xs font-semibold ${r.late_minutes > 0 ? 'text-amber-500' : 'text-muted-foreground'}`}>{r.late_time ?? r.late_time_formatted ?? '0m'}</td>
                              <td className="text-xs font-semibold text-emerald-500">{r.overtime_formatted ?? '0m'}</td>
                              <td>
                                <span className={`badge ${
                                  r.status === 'present' ? 'badge-success' :
                                  r.status === 'absent' ? 'badge-danger' :
                                  r.status === 'late' ? 'badge-warning' : 'badge-info'
                                }`}>
                                  {r.status}
                                </span>
                              </td>
                              <td className="text-[11px] text-muted-foreground">
                                <p className="font-semibold text-foreground">{r.device_name ?? 'Mobile App'}</p>
                                <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded font-mono uppercase">{r.check_in_method ?? 'QR Scan'}</span>
                              </td>
                            </>
                          )}
                          {activeTab === 'payrolls' && (
                            <>
                              <td className="font-semibold font-mono">{r.period_month}</td>
                              <td className="font-semibold text-foreground">{r.employee?.name ?? 'N/A'}</td>
                              <td>${Number(r.basic_salary).toLocaleString()}</td>
                              <td>${Number(r.allowances).toLocaleString()}</td>
                              <td>${Number(r.deductions).toLocaleString()}</td>
                              <td>${Number(r.overtime_pay).toLocaleString()}</td>
                              <td className="font-bold text-primary">${Number(r.net_salary).toLocaleString()}</td>
                              <td>
                                <span className={`badge ${r.status === 'paid' ? 'badge-success' : r.status === 'approved' ? 'badge-info' : 'badge-warning'
                                  }`}>
                                  {r.status}
                                </span>
                              </td>
                              <td className="text-xs">{r.paid_at ? new Date(r.paid_at).toLocaleDateString() : '-'}</td>
                            </>
                          )}
                          <td className="print:hidden">
                            <div className="flex items-center gap-1.5">
                              {activeTab === 'employees' && (
                                <button onClick={() => openViewDrawer(r)} className="btn btn-icon btn-secondary" title="View Detail Profile">
                                  <Eye size={13} />
                                </button>
                              )}
                              {activeTab === 'attendance' && (
                                <button onClick={() => setSelectedAttendanceDetail(r)} className="btn btn-icon btn-secondary text-primary hover:bg-primary/10" title="View Attendance Security Details">
                                  <Eye size={13} />
                                </button>
                              )}
                              {recycleBinMode ? (
                                <>
                                  <button onClick={() => restoreMutation.mutate(r.id)} className="btn btn-icon btn-success bg-green-500/10 text-green-500 hover:bg-green-500/20" title="Restore">
                                    <RotateCcw size={13} />
                                  </button>
                                  <button onClick={() => confirmDelete(r.id, true)} className="btn btn-icon btn-danger" title="Force Delete Permanently">
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => openEditModal(r)} className="btn btn-icon btn-secondary" title="Edit">
                                    <Edit2 size={13} />
                                  </button>
                                  <button onClick={() => confirmDelete(r.id, false)} className="btn btn-icon btn-danger" title="Trash Delete">
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TableWrapper>
          </div>

          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
            className="print:hidden"
          />
        </>
      )}

      {/* CRUD Modal Form Dialog */}
      <AnimatePresence>
        {modalOpen && (
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
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                          {companiesList?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label">Branch</label>
                        <select required value={formBranchId} onChange={e => setFormBranchId(e.target.value)} className="input w-full">
                          <option value="">Select Branch</option>
                          {branchesList?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
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
                          {companiesList?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label">Department</label>
                        <select required value={formDeptId} onChange={e => setFormDeptId(e.target.value)} className="input w-full">
                          <option value="">Select Department</option>
                          {deptList?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
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
                          {companiesList?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label">Branch</label>
                        <select required value={formBranchId} onChange={e => setFormBranchId(e.target.value)} className="input w-full">
                          {branchesList?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label">User Mapping</label>
                        <select value={formUserId} onChange={e => setFormUserId(e.target.value)} className="input w-full">
                          <option value="">No user mapping</option>
                          {usersList?.map((u: any) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">Department</label>
                        <select value={formDeptId} onChange={e => setFormDeptId(e.target.value)} className="input w-full">
                          <option value="">Select Dept</option>
                          {deptList?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label">Position</label>
                        <select value={formPosId} onChange={e => setFormPosId(e.target.value)} className="input w-full">
                          <option value="">Select Position</option>
                          {posList?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
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
                          <div className="relative w-16 h-16 rounded-full border-2 border-border bg-card overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
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
                        {empList?.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_number})</option>)}
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
                          const chosen = empList?.find((emp: any) => emp.id.toString() === e.target.value)
                          if (chosen) setFormBasicSalary(chosen.basic_salary?.toString() ?? '0')
                        }} className="input w-full">
                          <option value="">Select Employee</option>
                          {empList?.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_number})</option>)}
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

      {/* CSV Import Uploader Modal */}
      <AnimatePresence>
        {importOpen && (
          <div className="modal-backdrop">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content max-w-lg w-full">
              <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h3 className="text-lg font-bold text-foreground">Import {activeTab} CSV</h3>
                <button onClick={closeImportModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleImportSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-border p-6 rounded-lg text-center bg-muted/20">
                  <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-semibold text-foreground">Click to upload or drag & drop CSV file</p>
                  <p className="text-xs text-muted-foreground mt-1">Requires headers matching database table schema fields</p>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    required
                    onChange={e => setImportFile(e.target.files?.[0] ?? null)}
                    className="mt-4 mx-auto block text-xs"
                  />
                </div>

                {importResult && (
                  <div className={`p-3 rounded-lg border text-sm max-h-48 overflow-y-auto ${importResult.errors.length > 0 ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900' : 'bg-green-50 border-green-200 text-green-800'}`}>
                    <div className="flex items-center gap-2 font-bold mb-1">
                      {importResult.errors.length > 0 ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                      Import Completed ({importResult.success_count} Imported)
                    </div>
                    {importResult.errors.length > 0 && (
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                        {importResult.errors.map((err, i) => <li key={i}>{err}</li>)}
                      </ul>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 border-t pt-3">
                  <button type="button" onClick={closeImportModal} className="btn btn-secondary">Cancel</button>
                  <button type="submit" disabled={importing} className="btn btn-primary flex items-center gap-2">
                    {importing && <Loader2 size={16} className="animate-spin" />}
                    Upload & Process
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Employee Detail Drawer */}
      <AnimatePresence>
        {detailDrawerOpen && selectedItem && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-end print:static print:bg-transparent">
            <div className="absolute inset-0 print:hidden" onClick={() => setDetailDrawerOpen(false)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="bg-card w-full max-w-xl h-full shadow-2xl relative z-10 p-6 flex flex-col justify-between overflow-y-auto print:static print:w-full print:p-0 print:shadow-none"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3 print:hidden">
                  <h3 className="text-lg font-bold text-foreground">Employee Profile Card</h3>
                  <button onClick={() => setDetailDrawerOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={20} />
                  </button>
                </div>

                {/* Profile Card Header */}
                <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-xl border border-border">
                  <div className="w-20 h-20 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center">
                    {selectedItem.photo ? (
                      <img src={getPhotoUrl(selectedItem.photo) || ''} alt="" className="object-cover w-full h-full" />
                    ) : (
                      <User size={36} className="text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedItem.name}</h2>
                    <p className="font-mono text-xs text-muted-foreground">{selectedItem.employee_number}</p>
                    <span className={`badge mt-2 ${selectedItem.status === 'active' ? 'badge-success' : selectedItem.status === 'resigned' ? 'badge-danger' : 'badge-muted'}`}>
                      {selectedItem.status}
                    </span>
                  </div>
                </div>

                {/* Profile Info Details Grid */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold border-b pb-1 text-muted-foreground uppercase">General Information</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">National ID (NIK)</p>
                      <p className="font-semibold">{selectedItem.nik ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Gender / Birth Date</p>
                      <p className="font-semibold capitalize">
                        {selectedItem.gender ?? '-'} {selectedItem.birth_date ? `| ${new Date(selectedItem.birth_date).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-semibold text-primary">{selectedItem.email ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-semibold">{selectedItem.phone ?? '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Home Address</p>
                      <p className="font-semibold">{selectedItem.address ?? '-'}</p>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold border-b pb-1 text-muted-foreground uppercase pt-4">Employment Details</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Branch</p>
                      <p className="font-semibold">{selectedItem.branch?.name ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="font-semibold">{selectedItem.company?.name ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="font-semibold">{selectedItem.department?.name ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Position</p>
                      <p className="font-semibold">{selectedItem.position?.name ?? '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Basic Salary</p>
                      <p className="font-semibold font-mono text-primary text-base">${Number(selectedItem.basic_salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Join Date / Resign Date</p>
                      <p className="font-semibold">
                        {selectedItem.join_date ? new Date(selectedItem.join_date).toLocaleDateString() : '-'}
                        {selectedItem.resign_date ? ` / ${new Date(selectedItem.resign_date).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold border-b pb-1 text-muted-foreground uppercase pt-4">Workplace Summary</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Attendance Summary</p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedItem.attendance_count ?? 0} Check-ins</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Payroll Summary</p>
                      <p className="font-semibold text-primary">{selectedItem.payroll_count ?? 0} Pay slips</p>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold border-b pb-1 text-muted-foreground uppercase pt-4">System Metadata</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div>
                      <p className="text-xs">Record Created</p>
                      <p className="text-xs font-semibold">{new Date(selectedItem.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs">Record Updated</p>
                      <p className="text-xs font-semibold">{new Date(selectedItem.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 flex gap-2 justify-end print:hidden">
                <button onClick={() => setDetailDrawerOpen(false)} className="btn btn-secondary">Close Profile</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DynamicQrKioskModal open={kioskModalOpen} onClose={() => setKioskModalOpen(false)} />
      <AttendanceDetailModal attendance={selectedAttendanceDetail} onClose={() => setSelectedAttendanceDetail(null)} />

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Are you sure you want to delete this record?"
      />
    </div>
  )
}

export default EmployeesPage
