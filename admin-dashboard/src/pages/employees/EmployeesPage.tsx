import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Trash2, RefreshCw, Briefcase, Users, UserCheck, DollarSign, Calendar,
  Download, Upload, Filter, Settings, RotateCcw, QrCode
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useServerPagination } from '@/hooks/useServerPagination'
import ResetButton from '@/components/shared/ResetButton'
import ShiftsTab from './components/ShiftsTab'
import DynamicQrKioskModal from './components/DynamicQrKioskModal'
import AttendanceDetailModal from './components/AttendanceDetailModal'
import { EmployeeStatsCards } from './components/EmployeeStatsCards'
import { EmployeeFilterDrawer } from './components/EmployeeFilterDrawer'
import { EmployeeDetailDrawer } from './components/EmployeeDetailDrawer'
import { EmployeeFormModal } from './components/EmployeeFormModal'
import { EmployeeImportModal } from './components/EmployeeImportModal'
import { EmployeeTableSection } from './components/EmployeeTableSection'
import { INITIAL_VISIBLE_COLUMNS_MAP, type Tab, type ImportResult } from './types'

const EmployeesPage: React.FC = () => {
  const { t } = useTranslation(['employees', 'common'])
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

  // Column Visibility Map across all sub-tabs
  const [visibleColumnsMap, setVisibleColumnsMap] = useState<Record<Tab, Record<string, boolean>>>(INITIAL_VISIBLE_COLUMNS_MAP)
  const visibleColumns = visibleColumnsMap[activeTab] || {}
  const [showColSettings, setShowColSettings] = useState(false)

  // UI Modals / Drawers states
  const [modalOpen, setModalOpen] = useState(false)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // CSV Import Modal & QR Kiosk
  const [importOpen, setImportOpen] = useState(false)
  const [kioskModalOpen, setKioskModalOpen] = useState(false)
  const [selectedAttendanceDetail, setSelectedAttendanceDetail] = useState<any | null>(null)
  const [attendanceSubTab, setAttendanceSubTab] = useState<'logs' | 'shifts'>('logs')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  // Bulk actions & Delete confirmations
  const [selectedRows, setSelectedRows] = useState<number[]>([])
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

  // Fetch Dashboard Stats & Lists
  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ['employee-stats'],
    queryFn: () => api.get('/employees/stats').then(r => r.data.data),
  })

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
    } else if (filterStatus) {
      f.status = filterStatus
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
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to create record.')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/${activeTab}/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      refetchStats()
      closeModal()
      toast.success('Record updated successfully.')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to update record.')
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
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to restore record.')
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => api.post(`/${activeTab}/bulk-delete`, { ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      refetchStats()
      toast.success('Selected records deleted successfully.')
      setSelectedRows([])
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to perform bulk deletion.')
  })

  const bulkRestoreMutation = useMutation({
    mutationFn: (ids: number[]) => api.post(`/${activeTab}/bulk-restore`, { ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      refetchStats()
      toast.success('Selected records restored successfully.')
      setSelectedRows([])
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to perform bulk restoration.')
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

  // Photo upload
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

  // Sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1)
  }

  // Selection
  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? records.map((r: any) => r.id) : [])
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    setSelectedRows(prev => checked ? [...prev, id] : prev.filter(item => item !== id))
  }

  const openCreateModal = () => {
    setSelectedItem(null)
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
    setAttEmployeeId('')
    setAttDate(new Date().toISOString().split('T')[0])
    setAttCheckIn('08:00')
    setAttCheckOut('17:00')
    setAttStatus('present')
    setAttNotes('')
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

  const getPhotoUrl = (photoPath?: string) => {
    if (!photoPath) return null
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) return photoPath
    const baseUrl = api.defaults.baseURL ? api.defaults.baseURL.split('/api')[0] : 'http://127.0.0.1:8001'
    return `${baseUrl}/storage/${photoPath}`
  }

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

      {/* Header Card */}
      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs print:hidden">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <span>{t('employees.employee_management', 'Employee Management')}</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            {t('employees.subtitle_desc', 'Manage employees, departments, positions, attendance, payroll, employment status, and workforce performance across the Enterprise ERP platform.')}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'attendance' && (
            <button
              onClick={() => setKioskModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors shadow-xs"
            >
              <QrCode size={15} />
              <span>{t('employees.launch_qr_kiosk', 'Launch QR Kiosk')}</span>
            </button>
          )}
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-xs"
          >
            <Upload size={15} />
            <span>{t('employees.import_csv', 'Import CSV')}</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-xs"
          >
            <Download size={15} />
            <span>{t('employees.export_csv', 'Export CSV')}</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus size={16} />
            <span>{activeTab === 'attendance' ? t('employees.add_attendance', 'Add Attendance') : t('employees.add_employee', 'Add Employee')}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <EmployeeStatsCards
        statsData={statsData}
        empListLength={empList?.length ?? 0}
        activeCount={empList?.filter((e: any) => e.status === 'active').length ?? 0}
        resignedCount={empList?.filter((e: any) => e.status === 'resigned').length ?? 0}
        deptCount={deptList?.length ?? 0}
        posCount={posList?.length ?? 0}
        branchCount={branchesList?.length ?? 0}
      />

      {/* Workspace Navigation Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex border border-border bg-card rounded-2xl p-1 overflow-x-auto gap-1 shadow-xs w-full md:w-auto">
          {[
            { id: 'employees', label: t('employees.employees', 'Employees'), icon: <Users size={15} /> },
            { id: 'departments', label: t('employees.departments', 'Departments'), icon: <Briefcase size={15} /> },
            { id: 'positions', label: t('employees.positions', 'Positions'), icon: <UserCheck size={15} /> },
            { id: 'attendance', label: t('employees.attendance', 'Attendance'), icon: <Calendar size={15} /> },
            { id: 'payrolls', label: t('employees.payrolls', 'Payrolls'), icon: <DollarSign size={15} /> },
          ].map(tabItem => (
            <button
              key={tabItem.id}
              onClick={() => setActiveTab(tabItem.id as Tab)}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${activeTab === tabItem.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              {tabItem.icon}
              <span>{tabItem.label}</span>
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
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-xs print:hidden">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[260px] sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t('employees.search_placeholder', 'Search Employee Name, ID, Email, Phone, Department, Position...')}
              className="form-input pl-9 w-full text-xs rounded-xl border border-border bg-card text-foreground"
            />
          </div>

          <button
            onClick={() => setFilterDrawerOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border transition-all duration-200 shadow-xs
                       ${activeFiltersCount > 0
                ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <Filter size={14} className={activeFiltersCount > 0 ? 'text-primary' : 'text-muted-foreground'} />
            <span>{t('employees.filter', 'Filter')}</span>
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
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border transition-colors shadow-xs
                         ${recycleBinMode
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 font-semibold'
                  : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              title="Recycle Bin Trashed Items"
            >
              <Trash2 size={14} />
              <span>{recycleBinMode ? t('employees.exit_trash', 'Exit Trash') : t('employees.trash_bin', 'Trash Bin')}</span>
            </button>
          )}

          <ResetButton onClick={handleResetFilters} />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-1.5 bg-muted/40 p-1 px-2 rounded-xl border border-border mr-1">
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
            className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-xs"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>

          {/* Column Visibility settings */}
          <div className="relative">
            <button
              onClick={() => setShowColSettings(!showColSettings)}
              className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-xs"
              title={t('employees.column_settings', 'Column Settings')}
            >
              <Settings size={14} />
            </button>
            <AnimatePresence>
              {showColSettings && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowColSettings(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl p-2 z-20 space-y-1">
                    <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase">{t('employees.columns_visibility', 'Toggle Columns')}</p>
                    <div className="max-h-56 overflow-y-auto space-y-0.5">
                      {Object.keys(visibleColumns).map(col => (
                        <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-xl text-xs cursor-pointer text-foreground capitalize">
                          <input
                            type="checkbox"
                            checked={visibleColumns[col]}
                            onChange={e =>
                              setVisibleColumnsMap(prev => ({
                                ...prev,
                                [activeTab]: {
                                  ...prev[activeTab],
                                  [col]: e.target.checked,
                                },
                              }))
                            }
                            className="form-checkbox h-3.5 w-3.5 text-primary rounded border-border"
                          />
                          <span>{t(`employees.${col}`, col.replace('_', ' '))}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      <EmployeeFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        branchesList={branchesList}
        deptList={deptList}
        posList={posList}
        filterBranchId={filterBranchId}
        setFilterBranchId={setFilterBranchId}
        filterDeptId={filterDeptId}
        setFilterDeptId={setFilterDeptId}
        filterPosId={filterPosId}
        setFilterPosId={setFilterPosId}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterGender={filterGender}
        setFilterGender={setFilterGender}
        filterDateStart={filterDateStart}
        setFilterDateStart={setFilterDateStart}
        filterDateEnd={filterDateEnd}
        setFilterDateEnd={setFilterDateEnd}
        filterSalaryMin={filterSalaryMin}
        setFilterSalaryMin={setFilterSalaryMin}
        filterSalaryMax={filterSalaryMax}
        setFilterSalaryMax={setFilterSalaryMax}
        onReset={handleResetFilters}
      />

      {/* Tables or Shifts */}
      {activeTab === 'attendance' && attendanceSubTab === 'shifts' ? (
        <ShiftsTab />
      ) : (
        <>
          <EmployeeTableSection
            activeTab={activeTab}
            records={records}
            isLoading={isLoading}
            isFetching={isFetching}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            visibleColumns={visibleColumns}
            sortBy={sortBy}
            sortOrder={sortOrder}
            handleSort={handleSort}
            getPhotoUrl={getPhotoUrl}
            openViewDrawer={openViewDrawer}
            setSelectedAttendanceDetail={setSelectedAttendanceDetail}
            openEditModal={openEditModal}
            confirmDelete={confirmDelete}
            recycleBinMode={recycleBinMode}
            restoreRecord={(id) => restoreMutation.mutate(id)}
          />

          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </>
      )}

      {/* Form Modal */}
      <EmployeeFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        activeTab={activeTab}
        selectedItem={selectedItem}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
        companiesList={companiesList}
        branchesList={branchesList}
        deptList={deptList}
        posList={posList}
        usersList={usersList}
        empList={empList}
        formCompanyId={formCompanyId}
        setFormCompanyId={setFormCompanyId}
        formBranchId={formBranchId}
        setFormBranchId={setFormBranchId}
        formDeptId={formDeptId}
        setFormDeptId={setFormDeptId}
        formPosId={formPosId}
        setFormPosId={setFormPosId}
        formUserId={formUserId}
        setFormUserId={setFormUserId}
        formEmployeeNumber={formEmployeeNumber}
        setFormEmployeeNumber={setFormEmployeeNumber}
        formName={formName}
        setFormName={setFormName}
        formEmail={formEmail}
        setFormEmail={setFormEmail}
        formPhone={formPhone}
        setFormPhone={setFormPhone}
        formNik={formNik}
        setFormNik={setFormNik}
        formGender={formGender}
        setFormGender={setFormGender}
        formBirthDate={formBirthDate}
        setFormBirthDate={setFormBirthDate}
        formAddress={formAddress}
        setFormAddress={setFormAddress}
        formPhoto={formPhoto}
        setFormPhoto={setFormPhoto}
        uploadingPhoto={uploadingPhoto}
        handlePhotoFileChange={handlePhotoFileChange}
        getPhotoUrl={getPhotoUrl}
        formJoinDate={formJoinDate}
        setFormJoinDate={setFormJoinDate}
        formResignDate={formResignDate}
        setFormResignDate={setFormResignDate}
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        formBasicSalary={formBasicSalary}
        setFormBasicSalary={setFormBasicSalary}
        attEmployeeId={attEmployeeId}
        setAttEmployeeId={setAttEmployeeId}
        attDate={attDate}
        setAttDate={setAttDate}
        attCheckIn={attCheckIn}
        setAttCheckIn={setAttCheckIn}
        attCheckOut={attCheckOut}
        setAttCheckOut={setAttCheckOut}
        attStatus={attStatus}
        setAttStatus={setAttStatus}
        attNotes={attNotes}
        setAttNotes={setAttNotes}
        payEmployeeId={payEmployeeId}
        setPayEmployeeId={setPayEmployeeId}
        payPeriodMonth={payPeriodMonth}
        setPayPeriodMonth={setPayPeriodMonth}
        payWorkingDays={payWorkingDays}
        setPayWorkingDays={setPayWorkingDays}
        payPresentDays={payPresentDays}
        setPayPresentDays={setPayPresentDays}
        payAllowances={payAllowances}
        setPayAllowances={setPayAllowances}
        payDeductions={payDeductions}
        setPayDeductions={setPayDeductions}
        payOvertimePay={payOvertimePay}
        setPayOvertimePay={setPayOvertimePay}
        payStatus={payStatus}
        setPayStatus={setPayStatus}
        payPaidAt={payPaidAt}
        setPayPaidAt={setPayPaidAt}
        payNotes={payNotes}
        setPayNotes={setPayNotes}
      />

      {/* CSV Import Uploader Modal */}
      <EmployeeImportModal
        isOpen={importOpen}
        onClose={closeImportModal}
        activeTab={activeTab}
        importFile={importFile}
        setImportFile={setImportFile}
        importing={importing}
        importResult={importResult}
        onSubmit={handleImportSubmit}
      />

      {/* Employee Detail Drawer */}
      <EmployeeDetailDrawer
        isOpen={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        selectedItem={selectedItem}
        getPhotoUrl={getPhotoUrl}
      />

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
