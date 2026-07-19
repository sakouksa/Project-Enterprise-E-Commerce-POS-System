import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Edit2, Trash2, RefreshCw, X, Loader2, 
  Briefcase, Users, UserCheck, DollarSign, Calendar,
  Download, Upload, Filter, Eye, Printer, Settings,
  AlertCircle, CheckCircle2, RotateCcw, ChevronUp, ChevronDown, Check, User
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
  const [showFilters, setShowFilters] = useState(false)
  const [filterBranchId, setFilterBranchId] = useState('')
  const [filterDeptId, setFilterDeptId] = useState('')
  const [filterPosId, setFilterPosId] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterGender, setFilterGender] = useState('')
  const [filterDateStart, setFilterDateStart] = useState('')
  const [filterDateEnd, setFilterDateEnd] = useState('')
  const [filterSalaryMin, setFilterSalaryMin] = useState('')
  const [filterSalaryMax, setFilterSalaryMax] = useState('')

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

  const handlePrint = () => {
    window.print()
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
    setPayNotes('')

    setModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setSelectedItem(item)
    if (activeTab === 'departments') {
      setFormName(item.name)
      setFormEmployeeNumber(item.code ?? '')
      setFormAddress(item.description ?? '')
      setFormStatus(item.is_active ? 'active' : 'inactive')
    } else if (activeTab === 'positions') {
      setFormName(item.name)
      setFormEmployeeNumber(item.code ?? '')
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
        code: formEmployeeNumber,
        description: formAddress,
        is_active: formStatus === 'active'
      }
    } else if (activeTab === 'positions') {
      payload = {
        company_id: Number(formCompanyId),
        department_id: Number(formDeptId),
        name: formName,
        code: formEmployeeNumber,
        description: formAddress,
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

  return (
    <div className="space-y-4 print:p-0">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Employees' }]} className="print:hidden" />
      
      <PageHeader 
        title="Employee Management" 
        subtitle="Manage organization hierarchical departments, job positions, employee records, attendance schedules, and payroll."
        action={
          <div className="flex items-center gap-2 print:hidden">
            <button onClick={() => setImportOpen(true)} className="btn btn-secondary flex items-center gap-2">
              <Upload size={14} /> Import CSV
            </button>
            <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
              <Plus size={16} /> Add New
            </button>
          </div>
        }
        className="print:hidden"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="stat-card flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-semibold uppercase">Total Employees</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">{statsData?.total_employees ?? 0}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-semibold">{statsData?.active_employees ?? 0} Active</span> | {statsData?.resigned_employees ?? 0} Resigned
            </p>
          </div>
          <div className="bg-primary/10 text-primary p-3 rounded-lg"><Users size={24} /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="stat-card flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-semibold uppercase">Departments & Positions</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">{statsData?.total_departments ?? 0}</h3>
            <p className="text-xs text-muted-foreground mt-1">across {statsData?.total_positions ?? 0} active positions</p>
          </div>
          <div className="bg-blue-500/10 text-blue-500 p-3 rounded-lg"><Briefcase size={24} /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-semibold uppercase">Attendance Today</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">
              {statsData?.attendance_today?.present ?? 0}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-yellow-500 font-semibold">{statsData?.attendance_today?.late ?? 0} Late</span> | {statsData?.attendance_today?.absent ?? 0} Absent
            </p>
          </div>
          <div className="bg-green-500/10 text-green-500 p-3 rounded-lg"><Calendar size={24} /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="stat-card flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-semibold uppercase">Payroll Drafts</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">{statsData?.payroll_pending ?? 0}</h3>
            <p className="text-xs text-muted-foreground mt-1">Period: {new Date().toISOString().substring(0,7)}</p>
          </div>
          <div className="bg-yellow-500/10 text-yellow-500 p-3 rounded-lg"><DollarSign size={24} /></div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto print:hidden">
        {[
          { id: 'employees', label: 'Employees', icon: <Users size={16} /> },
          { id: 'departments', label: 'Departments', icon: <Briefcase size={16} /> },
          { id: 'positions', label: 'Positions', icon: <UserCheck size={16} /> },
          { id: 'attendance', label: 'Attendance', icon: <Calendar size={16} /> },
          { id: 'payrolls', label: 'Payrolls', icon: <DollarSign size={16} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as Tab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3 rounded-lg border border-border print:hidden">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SearchInput value={search} onChange={setSearch} placeholder="Search here..." />
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
          >
            <Filter size={16} /> Filter
          </button>
          {['employees', 'departments', 'positions'].includes(activeTab) && (
            <button 
              onClick={() => {
                setRecycleBinMode(!recycleBinMode)
                setSelectedRows([])
              }} 
              className={`btn ${recycleBinMode ? 'btn-danger' : 'btn-secondary'} flex items-center gap-2`}
              title="Recycle Bin Trashed Items"
            >
              <Trash2 size={16} /> {recycleBinMode ? 'Exit Trash' : 'Trash Bin'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2 bg-muted/60 p-1 px-2 rounded-lg border border-border mr-2 animate-fade-in">
              <span className="text-xs text-muted-foreground font-semibold">{selectedRows.length} Selected</span>
              {recycleBinMode ? (
                <>
                  <button onClick={() => bulkRestoreMutation.mutate(selectedRows)} className="btn btn-icon btn-success bg-green-500/10 text-green-500 hover:bg-green-500/20" title="Bulk Restore">
                    <RotateCcw size={14} />
                  </button>
                  <button onClick={() => {
                    if (confirm('Permanently delete all selected items?')) {
                      selectedRows.forEach(id => deleteMutation.mutate({ id, force: true }))
                    }
                  }} className="btn btn-icon btn-danger" title="Bulk Permanent Delete">
                    <Trash2 size={14} />
                  </button>
                </>
              ) : (
                <button onClick={() => {
                  if (confirm('Move all selected items to trash?')) {
                    bulkDeleteMutation.mutate(selectedRows)
                  }
                }} className="btn btn-icon btn-danger" title="Bulk Delete">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}

          {/* Column Visibility settings */}
          {activeTab === 'employees' && (
            <div className="relative">
              <button onClick={() => setShowColSettings(!showColSettings)} className="btn btn-secondary btn-icon" title="Column Settings">
                <Settings size={16} />
              </button>
              <AnimatePresence>
                {showColSettings && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute right-0 mt-2 bg-card border border-border p-3 rounded-lg shadow-lg z-30 w-56">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase border-b pb-1 mb-2">Columns Visibility</h4>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto">
                      {Object.keys(visibleColumns).map(col => (
                        <label key={col} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={visibleColumns[col]} 
                            onChange={e => setVisibleColumns(prev => ({ ...prev, [col]: e.target.checked }))} 
                            className="checkbox"
                          />
                          <span className="capitalize">{col.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          <button onClick={handleExport} className="btn btn-secondary flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => qc.invalidateQueries({ queryKey: [activeTab] })} className="btn btn-secondary btn-icon" title="Refresh data">
            <RefreshCw size={16} />
          </button>
          <ResetButton onClick={handleResetFilters} />
        </div>
      </div>

      {/* Collapsible Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-card border border-border rounded-lg p-4 print:hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Branch Filter */}
              <div>
                <label className="label">Branch</label>
                <select value={filterBranchId} onChange={e => setFilterBranchId(e.target.value)} className="input w-full">
                  <option value="">All Branches</option>
                  {branchesList?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              {/* Department Filter */}
              {['employees', 'positions', 'payrolls'].includes(activeTab) && (
                <div>
                  <label className="label">Department</label>
                  <select value={filterDeptId} onChange={e => setFilterDeptId(e.target.value)} className="input w-full">
                    <option value="">All Departments</option>
                    {deptList?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              )}

              {/* Position Filter */}
              {activeTab === 'employees' && (
                <div>
                  <label className="label">Position</label>
                  <select value={filterPosId} onChange={e => setFilterPosId(e.target.value)} className="input w-full">
                    <option value="">All Positions</option>
                    {posList?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}

              {/* Status Filter */}
              <div>
                <label className="label">Status</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input w-full">
                  <option value="">All Statuses</option>
                  {activeTab === 'employees' && (
                    <>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="resigned">Resigned</option>
                    </>
                  )}
                  {['departments', 'positions'].includes(activeTab) && (
                    <>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </>
                  )}
                  {activeTab === 'attendance' && (
                    <>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="leave">Leave</option>
                      <option value="holiday">Holiday</option>
                    </>
                  )}
                  {activeTab === 'payrolls' && (
                    <>
                      <option value="draft">Draft</option>
                      <option value="approved">Approved</option>
                      <option value="paid">Paid</option>
                    </>
                  )}
                </select>
              </div>

              {/* Gender Filter */}
              {activeTab === 'employees' && (
                <div>
                  <label className="label">Gender</label>
                  <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="input w-full">
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              )}

              {/* Date Filter */}
              <div>
                <label className="label">
                  {activeTab === 'attendance' ? 'Date Start' : activeTab === 'payrolls' ? 'Period Month' : 'Join Date Start'}
                </label>
                <input 
                  type={activeTab === 'payrolls' ? 'month' : 'date'} 
                  value={filterDateStart} 
                  onChange={e => setFilterDateStart(e.target.value)} 
                  className="input w-full" 
                />
              </div>

              {activeTab !== 'payrolls' && (
                <div>
                  <label className="label">
                    {activeTab === 'attendance' ? 'Date End' : 'Join Date End'}
                  </label>
                  <input 
                    type="date" 
                    value={filterDateEnd} 
                    onChange={e => setFilterDateEnd(e.target.value)} 
                    className="input w-full" 
                  />
                </div>
              )}

              {/* Basic Salary Ranges */}
              {activeTab === 'employees' && (
                <>
                  <div>
                    <label className="label">Min Salary ($)</label>
                    <input 
                      type="number" 
                      value={filterSalaryMin} 
                      onChange={e => setFilterSalaryMin(e.target.value)} 
                      placeholder="e.g. 500" 
                      className="input w-full" 
                    />
                  </div>
                  <div>
                    <label className="label">Max Salary ($)</label>
                    <input 
                      type="number" 
                      value={filterSalaryMax} 
                      onChange={e => setFilterSalaryMax(e.target.value)} 
                      placeholder="e.g. 5000" 
                      className="input w-full" 
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern sticky Table wrapper */}
      <TableWrapper isFetching={isFetching}>
        <div className="overflow-x-auto relative shadow-sm border border-border rounded-lg max-h-[600px]">
          <table className="w-full data-table relative border-collapse">
            <thead className="sticky top-0 bg-muted/95 backdrop-blur z-10 border-b border-border shadow-[0_1px_0_0_rgba(0,0,0,0.1)]">
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
                    <th className="cursor-pointer select-none" onClick={() => handleSort('date')}>Date {renderSortIcon('date')}</th>
                    <th>Employee Name</th>
                    <th>Employee ID</th>
                    <th className="cursor-pointer select-none" onClick={() => handleSort('check_in')}>Check In {renderSortIcon('check_in')}</th>
                    <th className="cursor-pointer select-none" onClick={() => handleSort('check_out')}>Check Out {renderSortIcon('check_out')}</th>
                    <th className="cursor-pointer select-none" onClick={() => handleSort('status')}>Status {renderSortIcon('status')}</th>
                    <th>Notes</th>
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
                            <span className={`badge ${r.status === 'active' ? 'badge-success' : r.status === 'resigned' ? 'badge-danger' : 'badge-muted'}`}>
                              {r.status}
                            </span>
                          </td>
                        )}
                      </>
                    )}
                    {activeTab === 'departments' && (
                      <>
                        <td>{r.id}</td>
                        <td className="font-semibold text-foreground">{r.name}</td>
                        <td className="font-mono text-xs">{r.code ?? 'N/A'}</td>
                        <td>{r.positions_count ?? 0}</td>
                        <td>{r.employees_count ?? 0}</td>
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
                        <td>{r.employees_count ?? 0}</td>
                        <td>
                          <span className={`badge ${r.is_active ? 'badge-success' : 'badge-muted'}`}>
                            {r.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </>
                    )}
                    {activeTab === 'attendance' && (
                      <>
                        <td className="font-semibold">{new Date(r.date).toLocaleDateString()}</td>
                        <td className="font-semibold text-foreground">{r.employee?.name ?? 'N/A'}</td>
                        <td className="font-mono text-xs">{r.employee?.employee_number ?? 'N/A'}</td>
                        <td>{r.check_in ?? '--:--'}</td>
                        <td>{r.check_out ?? '--:--'}</td>
                        <td>
                          <span className={`badge ${
                            r.status === 'present' ? 'badge-success' : r.status === 'absent' ? 'badge-danger' : r.status === 'late' ? 'badge-warning' : 'badge-info'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="max-w-xs truncate text-xs text-muted-foreground" title={r.notes}>{r.notes ?? '-'}</td>
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
                          <span className={`badge ${
                            r.status === 'paid' ? 'badge-success' : r.status === 'approved' ? 'badge-info' : 'badge-warning'
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

      <Pagination
        currentPage={pagination.current_page}
        lastPage={pagination.last_page}
        total={pagination.total}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
        className="print:hidden"
      />

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
                        <input type="text" required value={formName} onChange={e => setFormName(e.target.value)} className="input w-full" />
                      </div>
                      <div>
                        <label className="label">Department Code</label>
                        <input type="text" value={formEmployeeNumber} onChange={e => setFormEmployeeNumber(e.target.value)} className="input w-full" placeholder="e.g. IT, HR" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Description</label>
                      <textarea value={formAddress} onChange={e => setFormAddress(e.target.value)} className="input w-full min-h-[80px]" />
                    </div>
                    <div>
                      <label className="label">Status</label>
                      <select value={formStatus} onChange={e => setFormStatus(e.target.value)} className="input w-full">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'positions' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-2 gap-4">
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
                      <div>
                        <label className="label">Photo URL/Path</label>
                        <input type="text" value={formPhoto} onChange={e => setFormPhoto(e.target.value)} className="input w-full" placeholder="e.g. photos/john.jpg" />
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
                        <label className="label">Check In</label>
                        <input type="text" placeholder="HH:MM" value={attCheckIn} onChange={e => setAttCheckIn(e.target.value)} className="input w-full" />
                      </div>
                      <div>
                        <label className="label">Check Out</label>
                        <input type="text" placeholder="HH:MM" value={attCheckOut} onChange={e => setAttCheckOut(e.target.value)} className="input w-full" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Notes</label>
                      <textarea value={attNotes} onChange={e => setAttNotes(e.target.value)} className="input w-full min-h-[80px]" />
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">Status</label>
                        <select value={payStatus} onChange={e => setPayStatus(e.target.value)} className="input w-full">
                          <option value="draft">Draft</option>
                          <option value="approved">Approved</option>
                          <option value="paid">Paid</option>
                        </select>
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
                      <textarea value={payNotes} onChange={e => setPayNotes(e.target.value)} className="input w-full min-h-[70px]" />
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
