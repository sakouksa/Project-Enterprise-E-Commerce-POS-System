import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Filter,
  RefreshCw,
  Search,
  User,
  AlertCircle,
  FileText,
  Building2,
  Trash2,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { employeeService } from '@/services/employeeService'
import { useToast } from '@/hooks/useToast'
import TableWrapper from '@/components/shared/TableWrapper'
import StatusBadge from '@/components/common/StatusBadge'
import Pagination from '@/components/shared/Pagination'
import { EnterpriseModal, ModalFooter, EnterpriseSelect, ConfirmModal, EmptyState } from '@/components/common'

export const LeaveRequestsTab: React.FC = () => {
  const { t } = useTranslation(['employees', 'common'])
  const qc = useQueryClient()
  const toast = useToast()

  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [actionModal, setActionModal] = useState<{
    open: boolean
    type: 'approve' | 'reject'
    id: number | null
    notes: string
  }>({
    open: false,
    type: 'approve',
    id: null,
    notes: '',
  })
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean
    id: number | null
    name: string
  }>({
    open: false,
    id: null,
    name: '',
  })

  // Create form state
  const [formEmployeeId, setFormEmployeeId] = useState('')
  const [formLeaveType, setFormLeaveType] = useState('annual')
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0])
  const [formEndDate, setFormEndDate] = useState(new Date().toISOString().split('T')[0])
  const [formReason, setFormReason] = useState('')

  // Query leave requests
  const { data: leavesData, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['leave-requests', page, perPage, search, filterStatus, filterType],
    queryFn: () =>
      employeeService.leaveRequests({
        page,
        per_page: perPage,
        search,
        status: filterStatus || undefined,
        leave_type: filterType || undefined,
      }),
  })

  // Query employees for dropdown
  const { data: empList = [] } = useQuery({
    queryKey: ['employees-for-leave-select'],
    queryFn: () => employeeService.list({ per_page: 150 }).then((r) => r.data ?? []),
  })

  // Memoized Select Options
  const employeeOptions = useMemo(() => {
    return empList.map((emp: any) => ({
      value: String(emp.id),
      label: emp.name || `Employee #${emp.id}`,
      subtitle: `${emp.employee_number || ''}${emp.department?.name ? ` • ${emp.department.name}` : ''}`,
      badge: emp.department?.name,
      badgeColor: 'blue',
      avatar: emp.photo,
    }))
  }, [empList])

  const leaveTypeOptions = useMemo(
    () => [
      { value: 'annual', label: t('employees.annual_leave', 'Annual Leave') },
      { value: 'sick', label: t('employees.sick_leave', 'Sick Leave') },
      { value: 'special', label: t('employees.special_leave', 'Special Leave') },
      { value: 'maternity', label: t('employees.maternity_leave', 'Maternity Leave') },
      { value: 'unpaid', label: t('employees.unpaid_leave', 'Unpaid Leave') },
    ],
    [t]
  )

  // Mutations
  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) =>
      employeeService.approveLeave(id, { manager_notes: notes }),
    onSuccess: () => {
      toast.success(t('employees.leave_approved_success', 'Leave request approved successfully!'))
      qc.invalidateQueries({ queryKey: ['leave-requests'] })
      qc.invalidateQueries({ queryKey: ['attendances'] })
      qc.invalidateQueries({ queryKey: ['employee-stats'] })
      setActionModal({ open: false, type: 'approve', id: null, notes: '' })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to approve leave')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) =>
      employeeService.rejectLeave(id, { manager_notes: notes }),
    onSuccess: () => {
      toast.success(t('employees.leave_rejected_success', 'Leave request rejected'))
      qc.invalidateQueries({ queryKey: ['leave-requests'] })
      setActionModal({ open: false, type: 'reject', id: null, notes: '' })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to reject leave')
    },
  })

  const createMutation = useMutation({
    mutationFn: (payload: any) => employeeService.createLeaveRequest(payload),
    onSuccess: () => {
      toast.success(t('employees.leave_submitted_success', 'Leave request submitted successfully!'))
      qc.invalidateQueries({ queryKey: ['leave-requests'] })
      setCreateModalOpen(false)
      setFormEmployeeId('')
      setFormReason('')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit leave')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeeService.deleteLeaveRequest(id),
    onSuccess: () => {
      toast.success(t('employees.delete_leave_success', t('employees.deleteSuccess', 'Leave request deleted successfully')))
      qc.invalidateQueries({ queryKey: ['leave-requests'] })
      setDeleteModal({ open: false, id: null, name: '' })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete record')
    },
  })

  const records = leavesData?.data ?? []
  const pagination = leavesData?.meta ?? {
    current_page: page,
    last_page: 1,
    per_page: perPage,
    total: records.length,
  }

  const handleCreateSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!formEmployeeId) {
      toast.error(t('employees.select_employee_required', 'Please select an employee'))
      return
    }
    createMutation.mutate({
      employee_id: parseInt(formEmployeeId),
      leave_type: formLeaveType,
      start_date: formStartDate,
      end_date: formEndDate,
      reason: formReason,
    })
  }

  const handleActionSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!actionModal.id) return
    if (actionModal.type === 'approve') {
      approveMutation.mutate({ id: actionModal.id, notes: actionModal.notes })
    } else {
      if (!actionModal.notes.trim()) {
        toast.error(t('employees.rejection_reason_required', 'Please provide a reason for rejection'))
        return
      }
      rejectMutation.mutate({ id: actionModal.id, notes: actionModal.notes })
    }
  }

  const getLeaveTypeBadge = (type: string) => {
    switch (type) {
      case 'annual':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            {t('employees.annual_leave', 'Annual Leave')}
          </span>
        )
      case 'sick':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            {t('employees.sick_leave', 'Sick Leave')}
          </span>
        )
      case 'maternity':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
            {t('employees.maternity_leave', 'Maternity Leave')}
          </span>
        )
      case 'special':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            {t('employees.special_leave', 'Special Leave')}
          </span>
        )
      case 'unpaid':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
            {t('employees.unpaid_leave', 'Unpaid Leave')}
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
            {type}
          </span>
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Controls Bar (Matching Global Standard) */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto flex-1">
          <div className="relative min-w-[240px] sm:min-w-[300px] flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t('employees.search_placeholder', 'Search employee name, ID, reason...')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full h-10 min-h-[40px] pl-9 pr-8 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background hover:border-muted-foreground/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all placeholder:text-muted-foreground shadow-xs font-medium"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setPage(1); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
                type="button"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              setPage(1)
            }}
            className="h-10 min-h-[40px] px-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background hover:bg-muted font-medium cursor-pointer"
          >
            <option value="">{t('employees.all_statuses', 'All Statuses')}</option>
            <option value="pending">{t('employees.pending', 'Pending')}</option>
            <option value="approved">{t('employees.approved', 'Approved')}</option>
            <option value="rejected">{t('employees.rejected', 'Rejected')}</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value)
              setPage(1)
            }}
            className="h-10 min-h-[40px] px-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background hover:bg-muted font-medium cursor-pointer"
          >
            <option value="">{t('employees.leave_type', 'All Leave Types')}</option>
            <option value="annual">{t('employees.annual_leave', 'Annual Leave')}</option>
            <option value="sick">{t('employees.sick_leave', 'Sick Leave')}</option>
            <option value="maternity">{t('employees.maternity_leave', 'Maternity Leave')}</option>
            <option value="special">{t('employees.special_leave', 'Special Leave')}</option>
            <option value="unpaid">{t('employees.unpaid_leave', 'Unpaid Leave')}</option>
          </select>

          {(search || filterStatus || filterType) && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setFilterStatus('')
                setFilterType('')
                setPage(1)
              }}
              className="inline-flex items-center gap-1.5 h-10 min-h-[40px] px-3.5 text-xs sm:text-[13px] font-semibold rounded-lg border border-border/80 bg-background hover:bg-muted text-foreground transition-all duration-200 shadow-xs cursor-pointer"
            >
              <span>{t('common.reset', 'Reset')}</span>
            </button>
          )}

          <button
            onClick={() => refetch()}
            className="h-10 w-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground border border-border/80 bg-background hover:bg-muted transition-all duration-200 shadow-xs hover:shadow active:scale-[0.98] cursor-pointer shrink-0"
            title="Refresh"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          </button>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="w-full sm:w-auto h-10 min-h-[40px] px-4 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs sm:text-[13px] font-bold inline-flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Plus size={15} />
          <span>{t('employees.add_leave', 'Request Leave')}</span>
        </button>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <TableWrapper isFetching={isFetching}>
          <div className="overflow-x-auto">
            <table className="w-full data-table border-collapse">
              <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
                <tr>
                  <th className="!py-3 !px-4 text-left">{t('employees.employee', 'Employee')}</th>
                  <th className="text-left">{t('employees.leave_type', 'Leave Type')}</th>
                  <th className="text-left">{t('employees.duration_and_dates', t('employees.period', 'Duration & Dates'))}</th>
                  <th className="text-left">{t('employees.reason_and_notes', t('employees.reason', 'Reason & Notes'))}</th>
                  <th className="text-left">{t('employees.status', 'Status')}</th>
                  <th className="text-left">{t('employees.approver', 'Approver')}</th>
                  <th className="text-right !pr-4">{t('employees.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                      {t('employees.loading_leaves', 'Loading leave requests...')}
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <EmptyState
                    cols={7}
                    icon={<Calendar size={32} className="text-muted-foreground/50 stroke-1" />}
                    title={t('employees.no_leaves_found', 'No leave requests found')}
                    description={t('employees.no_leaves_desc', 'Create a new leave request or adjust filter criteria')}
                  />
                ) : (
                  records.map((item: any) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="!py-3 !px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                            {item.employee?.name ? item.employee.name.substring(0, 2) : 'EM'}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-xs">{item.employee?.name ?? '-'}</p>
                            <p className="text-[11px] font-mono text-muted-foreground">{item.employee?.employee_number}</p>
                          </div>
                        </div>
                      </td>
                      <td>{getLeaveTypeBadge(item.leave_type)}</td>
                      <td>
                        <div>
                          <p className="font-medium text-xs text-foreground">
                            {item.start_date} → {item.end_date}
                          </p>
                          <p className="text-[11px] font-semibold text-primary">
                            {item.total_days} {t('employees.days', 'days')}
                          </p>
                        </div>
                      </td>
                      <td className="max-w-[220px]">
                        <p className="text-xs text-foreground truncate" title={item.reason}>{item.reason || '-'}</p>
                        {item.manager_notes && (
                          <p className="text-[11px] text-muted-foreground italic truncate" title={item.manager_notes}>
                            Note: {item.manager_notes}
                          </p>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td>
                        {item.approver ? (
                          <span className="text-xs text-foreground font-medium">{item.approver.name}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="!pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === 'pending' && (
                            <>
                              <button
                                onClick={() =>
                                  setActionModal({ open: true, type: 'approve', id: item.id, notes: '' })
                                }
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/80 text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer"
                                title={t('employees.approve', 'Approve')}
                              >
                                <CheckCircle2 size={13} />
                                <span>{t('employees.approve', 'Approve')}</span>
                              </button>

                              <button
                                onClick={() =>
                                  setActionModal({ open: true, type: 'reject', id: item.id, notes: '' })
                                }
                                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/80 text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer"
                                title={t('employees.reject', 'Reject')}
                              >
                                <XCircle size={13} />
                                <span>{t('employees.reject', 'Reject')}</span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => {
                              setDeleteModal({
                                open: true,
                                id: item.id,
                                name: item.employee?.name ? `${item.employee.name} (${item.leave_type})` : `#${item.id}`,
                              })
                            }}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                            title={t('common.delete', 'Delete')}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TableWrapper>

        {records.length > 0 && (
          <div className="p-3 border-t border-border bg-card">
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.last_page}
              perPage={pagination.per_page}
              totalItems={pagination.total}
              onPageChange={setPage}
              onPerPageChange={(p) => {
                setPerPage(p)
                setPage(1)
              }}
            />
          </div>
        )}
      </div>

      {/* CREATE LEAVE REQUEST MODAL */}
      <EnterpriseModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={t('employees.leave_request_title', t('employees.add_leave', 'Request Leave'))}
        subtitle={t(
          'employees.leave_request_subtitle',
          'Submit an employee leave or absence request for manager approval'
        )}
        icon={<Calendar size={20} />}
        iconVariant="blue"
        size="lg"
        footer={
          <ModalFooter
            onCancel={() => setCreateModalOpen(false)}
            cancelLabel={t('common.cancel', 'Cancel')}
            onSubmit={handleCreateSubmit}
            isSubmitting={createMutation.isPending}
            submitLabel={t('employees.submit_request', 'Submit Request')}
            submitVariant="primary"
          />
        }
      >
        <form onSubmit={handleCreateSubmit} className="p-5 sm:p-6 space-y-4">
          <EnterpriseSelect
            label={t('employees.select_employee_label', 'Select Employee')}
            required
            options={employeeOptions}
            value={formEmployeeId}
            onChange={(val) => setFormEmployeeId(val ? String(val) : '')}
            placeholder={t('employees.select_employee', '-- Select Employee --')}
            searchPlaceholder={t('employees.search_employee_placeholder', 'Search employee name or code...')}
            clearable
          />

          <EnterpriseSelect
            label={t('employees.leave_type', 'Leave Type')}
            required
            options={leaveTypeOptions}
            value={formLeaveType}
            onChange={(val) => setFormLeaveType(val ? String(val) : 'annual')}
            clearable={false}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('employees.start_date', 'Start Date')} <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="date"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                className="w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-xl border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium cursor-pointer"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
                {t('employees.end_date', 'End Date')} <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="date"
                value={formEndDate}
                min={formStartDate}
                onChange={(e) => setFormEndDate(e.target.value)}
                className="w-full h-10 min-h-[40px] px-3.5 py-2 text-xs sm:text-[13px] rounded-xl border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium cursor-pointer"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
              {t('employees.reason_for_leave', t('employees.reason', 'Reason for Leave'))}
            </label>
            <textarea
              value={formReason}
              onChange={(e) => setFormReason(e.target.value)}
              rows={3}
              placeholder={t('employees.reason_placeholder', 'e.g. Travel vacation, doctor appointment, family ceremony...')}
              className="w-full px-3.5 py-2.5 text-xs sm:text-[13px] rounded-xl border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
            />
          </div>
        </form>
      </EnterpriseModal>

      {/* APPROVE / REJECT MODAL */}
      <EnterpriseModal
        isOpen={actionModal.open}
        onClose={() => setActionModal({ open: false, type: 'approve', id: null, notes: '' })}
        title={
          actionModal.type === 'approve'
            ? t('employees.approve_leave', 'Approve Leave Request')
            : t('employees.reject_leave', 'Reject Leave Request')
        }
        subtitle={t('employees.leave_decision_subtitle', 'Provide comments or notes for this leave decision')}
        icon={actionModal.type === 'approve' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
        iconVariant={actionModal.type === 'approve' ? 'emerald' : 'rose'}
        size="md"
        footer={
          <ModalFooter
            onCancel={() => setActionModal({ open: false, type: 'approve', id: null, notes: '' })}
            cancelLabel={t('common.cancel', 'Cancel')}
            onSubmit={handleActionSubmit}
            isSubmitting={approveMutation.isPending || rejectMutation.isPending}
            submitLabel={actionModal.type === 'approve' ? t('employees.approve', 'Approve') : t('employees.reject', 'Reject')}
            submitVariant={actionModal.type === 'approve' ? 'emerald' : 'danger'}
          />
        }
      >
        <form onSubmit={handleActionSubmit} className="p-5 sm:p-6 space-y-4">
          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
              actionModal.type === 'approve'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300'
            }`}
          >
            {actionModal.type === 'approve' ? (
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            )}
            <p>
              {actionModal.type === 'approve'
                ? t(
                    'employees.approve_leave_desc',
                    'Approving this request will automatically deduct leave balance and mark the employee as ON LEAVE in attendance logs for the requested dates.'
                  )
                : t(
                    'employees.reject_leave_desc',
                    'Please provide a clear reason for rejecting this leave request.'
                  )}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/90 dark:text-slate-200 mb-1.5">
              {t('employees.manager_notes', 'Manager / HR Notes')}{' '}
              {actionModal.type === 'reject' && <span className="text-rose-500 font-bold">*</span>}
            </label>
            <textarea
              value={actionModal.notes}
              onChange={(e) => setActionModal((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder={
                actionModal.type === 'approve'
                  ? t('employees.approval_notes_placeholder', 'Optional approval note...')
                  : t('employees.rejection_notes_placeholder', 'Reason for rejection (required)...')
              }
              className="w-full px-3.5 py-2.5 text-xs sm:text-[13px] rounded-xl border border-border/80 dark:border-slate-700/80 bg-background dark:bg-slate-900/90 text-foreground dark:text-slate-100 placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
              required={actionModal.type === 'reject'}
            />
          </div>
        </form>
      </EnterpriseModal>

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={deleteModal.open}
        variant="danger"
        actionType="delete"
        title={t('employees.delete_leave_title', 'Delete Leave Request')}
        itemName={deleteModal.name}
        warningText={t('employees.delete_leave_confirm', {
          name: deleteModal.name,
          defaultValue: `Are you sure you want to delete this leave request for ${deleteModal.name}? This action cannot be undone.`,
        })}
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteModal.id) {
            deleteMutation.mutate(deleteModal.id)
          }
        }}
        onCancel={() => setDeleteModal({ open: false, id: null, name: '' })}
      />
    </div>
  )
}

export default LeaveRequestsTab
