import React, { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Trash2, RefreshCw, Briefcase, Users, UserCheck, DollarSign, Calendar,
  Download, Upload, Filter, Settings, RotateCcw, QrCode, X, AlertCircle, FileSpreadsheet, Calculator, FileText
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { employeeService } from '@/services/employeeService'
import { companyService } from '@/services/companyService'
import { userService } from '@/services/userService'
import { useToast } from '@/hooks/useToast'
import { downloadCsv } from '@/utils/export'
import Pagination from '@/components/shared/Pagination'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Breadcrumb from '@/components/common/Breadcrumb'
import {
  HeaderActionsGroup,
  AddButton,
  ExportButton,
  ImportButton,
  QrKioskButton,
  TableToolbar,
} from '@/components/common'
import WorkspaceTabs, { type WorkspaceTabItem } from '@/components/shared/WorkspaceTabs'
import { useServerPagination } from '@/hooks/useServerPagination'
import { getAbsoluteImageUrl } from '@/utils/image'
import ResetButton from '@/components/shared/ResetButton'
import ColumnSettingsPopover from '@/components/shared/ColumnSettingsPopover'
import BulkSelectionBanner from '@/components/shared/BulkSelectionBanner'
import ShiftsTab from './components/ShiftsTab'
import LeaveRequestsTab from './components/LeaveRequestsTab'
import AutoGeneratePayrollModal from './components/AutoGeneratePayrollModal'
import PayslipModal from './components/PayslipModal'
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
  const { t } = useTranslation(['employees', 'common', 'nav'])
  const navigate = useNavigate()
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
  const [selectedSegment, setSelectedSegment] = useState('')
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

  // Column Visibility Map across all sub-tabs
  const [visibleColumnsMap, setVisibleColumnsMap] = useState<Record<Tab, Record<string, boolean>>>(INITIAL_VISIBLE_COLUMNS_MAP)
  const visibleColumns = visibleColumnsMap[activeTab] || {}

  const currentColumns = useMemo(() => {
    const defaultCols = INITIAL_VISIBLE_COLUMNS_MAP[activeTab] || {}
    return Object.keys(defaultCols).map((col) => ({
      key: col,
      label: t(`employees.${col}`, col.replace(/_/g, ' ')),
    }))
  }, [activeTab, t])

  // UI Modals / Drawers states
  const [modalOpen, setModalOpen] = useState(false)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // Enterprise Modals: Payroll Generator & Payslip
  const [autoPayrollModalOpen, setAutoPayrollModalOpen] = useState(false)
  const [selectedPayslipId, setSelectedPayslipId] = useState<number | null>(null)

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
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)

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

  // Queries for Dropdowns
  const { data: companiesList = [] } = useQuery({
    queryKey: ['companies-list'],
    queryFn: () => companyService.getCompanies({ per_page: 100 }).then(r => r.data ?? []),
  })

  const { data: branchesList = [] } = useQuery({
    queryKey: ['branches-list'],
    queryFn: () => companyService.getBranches({ per_page: 100 }).then(r => r.data ?? []),
  })

  const { data: deptList = [] } = useQuery({
    queryKey: ['departments-list'],
    queryFn: () => employeeService.departments({ per_page: 100 }).then(r => r.data ?? []),
  })

  const { data: posList = [] } = useQuery({
    queryKey: ['positions-list'],
    queryFn: () => employeeService.positions({ per_page: 100 }).then(r => r.data ?? []),
  })

  const { data: usersList = [] } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => userService.list({ per_page: 150 }).then(r => r.data ?? []),
  })

  const { data: empList = [] } = useQuery({
    queryKey: ['employees-list'],
    queryFn: () => employeeService.list({ per_page: 150 }).then(r => r.data ?? []),
  })

  // Global HR Stats
  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ['employee-stats'],
    queryFn: () => employeeService.stats(),
  })

  // Main Data Query based on activeTab
  const queryParams = useMemo(() => ({
    page,
    per_page: perPage,
    search: debouncedSearch,
    sort_by: sortBy,
    sort_order: sortOrder,
    branch_id: filterBranchId || undefined,
    department_id: filterDeptId || undefined,
    position_id: filterPosId || undefined,
    status: filterStatus || (selectedSegment === 'active' ? 'active' : undefined),
    is_driver: selectedSegment === 'driver' ? true : undefined,
    is_pos_supervisor: selectedSegment === 'pos_supervisor' ? true : undefined,
    gender: filterGender || undefined,
    date_from: filterDateStart || undefined,
    date_to: filterDateEnd || undefined,
    salary_min: filterSalaryMin || undefined,
    salary_max: filterSalaryMax || undefined,
    role: filterRole || undefined,
  }), [
    page, perPage, debouncedSearch, sortBy, sortOrder,
    filterBranchId, filterDeptId, filterPosId, filterStatus, selectedSegment,
    filterGender, filterDateStart, filterDateEnd, filterSalaryMin,
    filterSalaryMax, filterRole
  ])

  const { data: currentData, isLoading, isFetching, refetch } = useQuery({
    queryKey: [activeTab, queryParams],
    queryFn: () => {
      switch (activeTab) {
        case 'departments':
          return employeeService.departments(queryParams)
        case 'positions':
          return employeeService.positions(queryParams)
        case 'attendance':
          return employeeService.attendance(queryParams)
        case 'payrolls':
          return employeeService.payrolls(queryParams)
        case 'leaves':
          return Promise.resolve({ data: [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } })
        case 'employees':
        default:
          return employeeService.list(queryParams)
      }
    },
    enabled: activeTab !== 'leaves',
  })

  const records = currentData?.data ?? []
  const pagination = currentData?.meta ?? {
    current_page: page,
    last_page: 1,
    per_page: perPage,
    total: records.length,
  }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => {
      switch (activeTab) {
        case 'departments':
          return employeeService.createDepartment(data)
        case 'positions':
          return employeeService.createPosition(data)
        case 'attendance':
          return employeeService.createAttendance(data)
        case 'payrolls':
          return employeeService.createPayroll(data)
        case 'employees':
        default:
          return employeeService.create(data)
      }
    },
    onSuccess: () => {
      toast.success(t('employees.createSuccess', 'Record created successfully.'))
      qc.invalidateQueries({ queryKey: [activeTab] })
      qc.invalidateQueries({ queryKey: ['employee-stats'] })
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('common.createFailed', 'Failed to create record.'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      switch (activeTab) {
        case 'departments':
          return employeeService.updateDepartment(id, data)
        case 'positions':
          return employeeService.updatePosition(id, data)
        case 'attendance':
          return employeeService.updateAttendance(id, data)
        case 'payrolls':
          return employeeService.updatePayroll(id, data)
        case 'employees':
        default:
          return employeeService.update(id, data)
      }
    },
    onSuccess: () => {
      toast.success(t('employees.updateSuccess', 'Record updated successfully.'))
      qc.invalidateQueries({ queryKey: [activeTab] })
      qc.invalidateQueries({ queryKey: ['employee-stats'] })
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('common.updateFailed', 'Failed to update record.'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, force }: { id: number; force?: boolean }) => {
      switch (activeTab) {
        case 'departments':
          return employeeService.deleteDepartment(id)
        case 'positions':
          return employeeService.deletePosition(id)
        case 'attendance':
          return employeeService.deleteAttendance(id)
        case 'payrolls':
          return employeeService.deletePayroll(id)
        case 'employees':
        default:
          return employeeService.delete(id, force)
      }
    },
    onSuccess: () => {
      toast.success(t('employees.deleteSuccess', 'Record deleted successfully.'))
      qc.invalidateQueries({ queryKey: [activeTab] })
      qc.invalidateQueries({ queryKey: ['employee-stats'] })
      setDeleteTarget(null)
      adjustAfterDelete(1)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('common.deleteFailed', 'Failed to delete record.'))
    },
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => employeeService.bulkDelete(activeTab, ids),
    onSuccess: () => {
      toast.success(t('employees.bulkDeleteSuccess', 'Selected records deleted successfully.'))
      qc.invalidateQueries({ queryKey: [activeTab] })
      qc.invalidateQueries({ queryKey: ['employee-stats'] })
      setSelectedRows([])
      setBulkDeleteConfirmOpen(false)
      adjustAfterDelete(selectedRows.length)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('common.bulkDeleteFailed', 'Failed to delete selected records.'))
    },
  })

  // Bulk / Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(records.map((r: any) => r.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id])
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id))
    }
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  // Photo Upload Handler for Modal
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const uploadData = new FormData()
    uploadData.append('photo', file)
    setUploadingPhoto(true)
    try {
      const res = await employeeService.uploadPhoto(uploadData)
      const photoPath = res.data?.path || res.data?.url || res.path || res.url
      setFormPhoto(photoPath)
      toast.success(t('employees.photoUploaded', 'Photo uploaded successfully.'))
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t('employees.photoUploadFailed', 'Failed to upload photo.'))
    } finally {
      setUploadingPhoto(false)
    }
  }

  // Export CSV Handler
  const handleExport = async () => {
    const toastId = toast.loading(t('employees.export_generating', 'Preparing CSV export...'))
    try {
      const res = await (async () => {
        switch (activeTab) {
          case 'departments':
            return employeeService.departments({ per_page: 500 })
          case 'positions':
            return employeeService.positions({ per_page: 500 })
          case 'attendance':
            return employeeService.attendance({ per_page: 500 })
          case 'payrolls':
            return employeeService.payrolls({ per_page: 500 })
          case 'employees':
          default:
            return employeeService.list({ per_page: 500 })
        }
      })()

      const exportRecords = res?.data ?? []
      let headers: string[] = []
      let rows: (string | number | boolean | null | undefined)[][] = []

      if (activeTab === 'departments') {
        headers = [
          t('employees.code', 'Code'),
          t('employees.name', 'Name'),
          t('employees.branch', 'Branch'),
          t('employees.description', 'Description'),
          t('employees.status', 'Status'),
        ]
        rows = exportRecords.map((dept: any) => [
          dept.code || `DEPT-${dept.id}`,
          dept.name || '',
          dept.branch?.name || '',
          dept.description || '',
          dept.is_active ? t('employees.active', 'Active') : t('employees.inactive', 'Inactive'),
        ])
      } else if (activeTab === 'positions') {
        headers = [
          t('employees.code', 'Code'),
          t('employees.name', 'Name'),
          t('employees.department', 'Department'),
          t('employees.description', 'Description'),
          t('employees.status', 'Status'),
        ]
        rows = exportRecords.map((pos: any) => [
          pos.code || `POS-${pos.id}`,
          pos.name || '',
          pos.department?.name || '',
          pos.description || '',
          pos.is_active ? t('employees.active', 'Active') : t('employees.inactive', 'Inactive'),
        ])
      } else if (activeTab === 'attendance') {
        headers = [
          t('employees.employee', 'Employee'),
          t('employees.date', 'Date'),
          t('employees.check_in', 'Check In'),
          t('employees.check_out', 'Check Out'),
          t('employees.status', 'Status'),
          t('employees.notes', 'Notes'),
        ]
        rows = exportRecords.map((att: any) => [
          att.employee?.name || `Employee #${att.employee_id}`,
          att.date ? att.date.split('T')[0] : '',
          att.check_in || '',
          att.check_out || '',
          att.status,
          att.notes || '',
        ])
      } else if (activeTab === 'payrolls') {
        headers = [
          t('employees.employee', 'Employee'),
          t('employees.period', 'Period'),
          t('employees.basic_salary', 'Basic Salary'),
          t('employees.allowances', 'Allowances'),
          t('employees.sales_commission', 'Commission'),
          t('employees.nssf_deduction', 'NSSF'),
          t('employees.tax_deduction', 'Tax'),
          t('employees.net_salary', 'Net Salary'),
          t('employees.status', 'Status'),
        ]
        rows = exportRecords.map((pay: any) => [
          pay.employee?.name || `Employee #${pay.employee_id}`,
          pay.period_month || '',
          Number(pay.basic_salary || 0).toFixed(2),
          Number(pay.allowances || 0).toFixed(2),
          Number(pay.sales_commission || 0).toFixed(2),
          Number(pay.nssf_deduction || 0).toFixed(2),
          Number(pay.tax_deduction || 0).toFixed(2),
          Number(pay.net_salary || 0).toFixed(2),
          pay.status,
        ])
      } else {
        headers = [
          t('employees.employee_number', 'Employee Number'),
          t('employees.name', 'Name'),
          t('employees.email', 'Email'),
          t('employees.phone', 'Phone'),
          t('employees.department', 'Department'),
          t('employees.position', 'Position'),
          t('employees.basic_salary', 'Basic Salary'),
          t('employees.status', 'Status'),
        ]
        rows = exportRecords.map((emp: any) => [
          emp.employee_number || `EMP-${emp.id}`,
          emp.name || '',
          emp.email || '',
          emp.phone || '',
          emp.department?.name || '',
          emp.position?.name || '',
          emp.basic_salary ? Number(emp.basic_salary).toFixed(2) : '0.00',
          emp.status,
        ])
      }

      downloadCsv(`${activeTab}`, headers, rows)
      toast.dismiss(toastId)
      toast.success(t('employees.export_success', 'Export downloaded successfully.'))
    } catch {
      toast.dismiss(toastId)
      toast.error(t('employees.export_error', 'Export failed. Please try again.'))
    }
  }

  // Export ABA Bulk CSV Handler
  const handleExportAbaBulk = async () => {
    const currentMonth = new Date().toISOString().substring(0, 7)
    const toastId = toast.loading(t('employees.exportAbaGenerating', 'Generating ABA Bank Bulk Payment CSV...'))
    try {
      const csvText = await employeeService.exportAbaBulkCsv({ period_month: currentMonth })
      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `ABA_Bulk_Payroll_${currentMonth}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.dismiss(toastId)
      toast.success(t('employees.exportAbaSuccess', 'ABA Bulk Payroll CSV downloaded successfully!'))
    } catch {
      toast.dismiss(toastId)
      toast.error(t('employees.exportAbaError', 'Failed to export ABA Bulk CSV'))
    }
  }

  // Import Upload
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!importFile) return
    setImporting(true)
    setImportResult(null)

    const formData = new FormData()
    formData.append('file', importFile)

    employeeService.importData(activeTab, formData)
      .then(res => {
        setImporting(false)
        const resData = (res.data?.data || res.data) as ImportResult
        setImportResult(resData)
        if (resData?.errors?.length === 0) {
          toast.success(`Successfully imported ${resData.success_count} records.`)
          qc.invalidateQueries({ queryKey: [activeTab] })
          refetchStats()
          closeImportModal()
        } else {
          toast.warning(`Import completed with errors. ${resData?.success_count || 0} records imported.`)
        }
      })
      .catch(err => {
        setImporting(false)
        toast.error(err?.response?.data?.message || 'Failed to import CSV.')
      })
  }

  // Modal open helpers
  const openCreateModal = () => {
    if (activeTab === 'employees') {
      navigate('/employees/create')
      return
    }
    setSelectedItem(null)
    setFormCompanyId('1')
    setFormBranchId('1')
    setFormDeptId('')
    setFormPosId('')
    setFormUserId('')
    if (activeTab === 'departments') {
      setFormEmployeeNumber(`DEPT-${Math.floor(1000 + Math.random() * 9000)}`)
    } else if (activeTab === 'positions') {
      setFormEmployeeNumber(`POS-${Math.floor(1000 + Math.random() * 9000)}`)
    } else {
      setFormEmployeeNumber(`EMP${Math.floor(100000 + Math.random() * 900000)}`)
    }
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
    if (activeTab === 'employees') {
      navigate(`/employees/${item.id}/edit`)
      return
    }
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
    setSelectedSegment('')
    reset()
  }

  const handleSelectSegment = (segmentKey: string) => {
    if (segmentKey === 'leaves') {
      setActiveTab('leaves')
      setSelectedSegment('')
      return
    }
    if (activeTab !== 'employees') {
      setActiveTab('employees')
    }
    setSelectedSegment(prev => (prev === segmentKey ? '' : segmentKey))
    setPage(1)
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

  const confirmDelete = (itemOrId: any) => {
    if (typeof itemOrId === 'object' && itemOrId !== null) {
      setDeleteTarget(itemOrId)
    } else {
      const found = records.find((r: any) => r.id === itemOrId)
      setDeleteTarget(found || { id: itemOrId })
    }
  }

  const handleDelete = () => {
    if (deleteTarget?.id) {
      deleteMutation.mutate({ id: deleteTarget.id, force: false })
    }
  }

  const getSingleDeleteTitle = () => {
    if (activeTab === 'employees') return t('employees.deleteEmployeeTitle', 'Delete Employee')
    if (activeTab === 'departments') return t('employees.deleteDepartmentTitle', 'Delete Department')
    if (activeTab === 'positions') return t('employees.deletePositionTitle', 'Delete Position')
    if (activeTab === 'attendance') return t('employees.deleteAttendanceTitle', 'Delete Attendance Record')
    if (activeTab === 'payrolls') return t('employees.deletePayrollTitle', 'Delete Payroll Record')
    return t('employees.deleteTitle', 'Delete Record')
  }

  const getDeleteTargetName = () => {
    if (!deleteTarget) return ''
    if (deleteTarget.name) return deleteTarget.name
    if (activeTab === 'attendance') {
      return deleteTarget.employee?.name ? `${deleteTarget.employee.name} (${deleteTarget.attendance_date || (deleteTarget.date ? deleteTarget.date.split('T')[0] : '')})` : (deleteTarget.attendance_date || deleteTarget.date || '')
    }
    if (activeTab === 'payrolls') {
      return deleteTarget.employee?.name ? `${deleteTarget.employee.name} (${deleteTarget.period_month || ''})` : (deleteTarget.period_month || '')
    }
    return deleteTarget.code || deleteTarget.employee_number || (deleteTarget.id ? `#${deleteTarget.id}` : '')
  }

  const getBulkDeleteTitle = () => {
    if (activeTab === 'employees') return t('employees.bulkDeleteEmployeesTitle', 'Delete Selected Employees')
    if (activeTab === 'departments') return t('employees.bulkDeleteDepartmentsTitle', 'Delete Selected Departments')
    if (activeTab === 'positions') return t('employees.bulkDeletePositionsTitle', 'Delete Selected Positions')
    if (activeTab === 'attendance') return t('employees.bulkDeleteAttendanceTitle', 'Delete Selected Attendance Logs')
    if (activeTab === 'payrolls') return t('employees.bulkDeletePayrollsTitle', 'Delete Selected Payrolls')
    return t('employees.bulkDeleteTitle', 'Delete Selected Records')
  }

  const getBulkDeleteMessage = () => {
    let msgKey = 'employees.confirmBulkDeleteMessage'
    let defaultMsg = `Are you sure you want to delete ${selectedRows.length} selected records? This action will move them to the trash.`
    if (activeTab === 'employees') {
      msgKey = 'employees.confirmBulkDeleteEmployeesMessage'
      defaultMsg = `Are you sure you want to delete ${selectedRows.length} selected employees? This action will move them to the trash.`
    } else if (activeTab === 'departments') {
      msgKey = 'employees.confirmBulkDeleteDepartmentsMessage'
      defaultMsg = `Are you sure you want to delete ${selectedRows.length} selected departments? This action cannot be undone.`
    } else if (activeTab === 'positions') {
      msgKey = 'employees.confirmBulkDeletePositionsMessage'
      defaultMsg = `Are you sure you want to delete ${selectedRows.length} selected positions? This action cannot be undone.`
    } else if (activeTab === 'attendance') {
      msgKey = 'employees.confirmBulkDeleteAttendanceMessage'
      defaultMsg = `Are you sure you want to delete ${selectedRows.length} selected attendance logs? This action cannot be undone.`
    } else if (activeTab === 'payrolls') {
      msgKey = 'employees.confirmBulkDeletePayrollsMessage'
      defaultMsg = `Are you sure you want to delete ${selectedRows.length} selected payroll records? This action cannot be undone.`
    }
    return t(msgKey, {
      count: selectedRows.length,
      defaultValue: defaultMsg
    }).replace('{{count}}', String(selectedRows.length))
  }

  const getPhotoUrl = (photoPath?: string) => {
    if (!photoPath) return null
    return getAbsoluteImageUrl(photoPath) || null
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

  const workspaceTabs: WorkspaceTabItem[] = [
    { id: 'employees', label: t('employees.employees', 'Employees'), count: empList?.length, icon: Users },
    { id: 'departments', label: t('employees.departments', 'Departments'), count: deptList?.length, icon: Briefcase },
    { id: 'positions', label: t('employees.positions', 'Positions'), count: posList?.length, icon: UserCheck },
    { id: 'attendance', label: t('employees.attendance', 'Attendance'), icon: Calendar },
    { id: 'leaves', label: t('employees.leaves', 'Leaves'), count: statsData?.pending_leaves_count, icon: Calendar },
    { id: 'payrolls', label: t('employees.payrolls', 'Payrolls'), icon: DollarSign },
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as Tab)
    setSelectedRows([])
  }

  return (
    <div className="space-y-5 print:p-0">
      <Breadcrumb
        items={[
          { label: t('nav.dashboard', 'Dashboard'), path: '/dashboard' },
          { label: t('nav.employees', 'Employees') },
        ]}
      />

      {/* Frameless Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-1 print:hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-xs">
            <Briefcase size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                {t('employees.employee_management', 'Employee Management')}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                HRMS & Operations
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('employees.subtitle_desc', 'Manage staff, departments, positions, attendance, leaves, payrolls, and work performance across the ERP system.')}
            </p>
          </div>
        </div>

        <HeaderActionsGroup>
          {activeTab === 'payrolls' && (
            <>
              <button
                type="button"
                onClick={() => setAutoPayrollModalOpen(true)}
                className="h-10 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Calculator size={15} />
                <span>{t('employees.auto_generate_payroll', 'Auto-Generate')}</span>
              </button>

              <button
                type="button"
                onClick={handleExportAbaBulk}
                className="h-10 px-3.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                title="Export ABA Bank Corporate CSV"
              >
                <FileSpreadsheet size={15} className="text-primary" />
                <span>{t('employees.export_aba_bulk', 'ABA Bulk CSV')}</span>
              </button>
            </>
          )}

          <QrKioskButton
            onClick={() => setKioskModalOpen(true)}
            label={t('employees.launch_qr_kiosk', 'Launch QR Kiosk')}
          />

          {activeTab === 'employees' && (
            <>
              <ImportButton
                onClick={() => setImportOpen(true)}
                label={t('employees.import_csv', 'Import CSV')}
              />
              <ExportButton
                onClick={handleExport}
                label={t('employees.export_csv', 'Export CSV')}
              />
            </>
          )}

          {activeTab !== 'leaves' && (
            <AddButton
              onClick={() => openCreateModal()}
              label={
                activeTab === 'attendance'
                  ? t('employees.add_attendance', 'Record Attendance')
                  : activeTab === 'payrolls'
                  ? t('employees.add_payroll_title', 'Add Payroll Slip')
                  : t('employees.add_employee', 'Add Employee')
              }
            />
          )}
        </HeaderActionsGroup>
      </div>

      {/* ─── Global Sub-tabs Navigation ─── */}
      <WorkspaceTabs
        tabs={workspaceTabs}
        activeTab={activeTab}
        onChange={handleTabChange}
        size="md"
        variant="underline"
        rightContent={
          activeTab === 'attendance' ? (
            <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border">
              <button
                onClick={() => setAttendanceSubTab('logs')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  attendanceSubTab === 'logs' ? 'bg-card text-foreground shadow-sm font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('employees.attendance_logs', 'Attendance Logs')}
              </button>
              <button
                onClick={() => setAttendanceSubTab('shifts')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  attendanceSubTab === 'shifts' ? 'bg-card text-foreground shadow-sm font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('employees.shift_schedules', 'Shift Schedules')}
              </button>
            </div>
          ) : undefined
        }
      />

      {/* Summary KPI Cards - Only on Main Employees Directory Tab */}
      {activeTab === 'employees' && (
        <EmployeeStatsCards
          statsData={statsData}
          empListLength={empList?.length ?? 0}
          activeCount={empList?.filter((e: any) => e.status === 'active').length ?? 0}
          resignedCount={empList?.filter((e: any) => e.status === 'resigned').length ?? 0}
          deptCount={deptList?.length ?? 0}
          posCount={posList?.length ?? 0}
          branchCount={branchesList?.length ?? 0}
          totalSalarySum={empList?.reduce((acc: number, e: any) => acc + (Number(e.basic_salary) || 0), 0) ?? 0}
        />
      )}

      {/* RENDER ACTIVE TAB CONTENT */}
      {activeTab === 'leaves' ? (
        <LeaveRequestsTab />
      ) : activeTab === 'attendance' && attendanceSubTab === 'shifts' ? (
        <ShiftsTab />
      ) : (
        <>
          {/* ─── Bulk actions banner ─── */}
          <BulkSelectionBanner
            selectedCount={selectedRows.length}
            onDelete={() => setBulkDeleteConfirmOpen(true)}
            onClear={() => setSelectedRows([])}
            deleteLabel={t('employees.deleteSelected', 'Delete Selected')}
            deleteLoading={bulkDeleteMutation.isPending}
          />

          {/* ─── Global Standard Table Toolbar ─── */}
          <TableToolbar
            search={search}
            onSearchChange={(val) => { setSearch(val); setPage(1); }}
            searchPlaceholder={t('employees.search_placeholder', 'Search employee name, email, phone, role...')}
            onFilterClick={() => setFilterDrawerOpen(true)}
            isFilterActive={activeFiltersCount > 0}
            onReset={handleResetFilters}
            onRefresh={() => qc.invalidateQueries({ queryKey: [activeTab] })}
            refreshLoading={isFetching}
            columns={currentColumns}
            visibleColumns={visibleColumns}
            defaultVisibleColumns={INITIAL_VISIBLE_COLUMNS_MAP[activeTab]}
            onColumnChange={(updated) =>
              setVisibleColumnsMap((prev) => ({
                ...prev,
                [activeTab]: updated,
              }))
            }
            columnSettingsTitle={t('employees.columns_visibility', t('common.columnsVisibility', 'Column Visibility'))}
          />

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

          {/* Table Section */}
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
            onOpenPayslip={(id) => setSelectedPayslipId(id)}
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

      {/* Form Modal for Depts, Positions, Attendance, Payroll */}
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

      {/* Auto-Generate Monthly Payroll Modal */}
      <AutoGeneratePayrollModal
        isOpen={autoPayrollModalOpen}
        onClose={() => setAutoPayrollModalOpen(false)}
        branchesList={branchesList}
      />

      {/* Official Payslip Modal Preview */}
      <PayslipModal
        isOpen={!!selectedPayslipId}
        onClose={() => setSelectedPayslipId(null)}
        payrollId={selectedPayslipId}
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

      {/* Single Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title={getSingleDeleteTitle()}
        itemName={getDeleteTargetName()}
        confirmText={t('common.confirmDelete', 'Delete')}
        cancelText={t('common.cancel', 'Cancel')}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Bulk Delete Dialog */}
      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        title={getBulkDeleteTitle()}
        message={getBulkDeleteMessage()}
        confirmText={t('common.confirmDelete', 'Delete')}
        cancelText={t('common.cancel', 'Cancel')}
        loading={bulkDeleteMutation.isPending}
        onConfirm={() => bulkDeleteMutation.mutate(selectedRows)}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
      />
    </div>
  )
}

export default EmployeesPage
