import React from 'react'
import { Check, Edit, Eye, Trash2, Printer, Plus, User, Briefcase, Users, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react'
import { EmployeeAvatar } from './EmployeeAvatar'
import { useTranslation } from 'react-i18next'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'
import StatusBadge from '@/components/common/StatusBadge'
import type { Tab } from '../types'

interface EmployeeTableSectionProps {
  activeTab: Tab
  records: any[]
  isLoading: boolean
  isFetching: boolean
  selectedRows: number[]
  handleSelectAll: (checked: boolean) => void
  handleSelectRow: (id: number, checked: boolean) => void
  visibleColumns: Record<string, boolean>
  sortBy: string
  sortOrder: 'asc' | 'desc'
  handleSort: (field: string) => void
  getPhotoUrl: (photoPath?: string) => string | null
  openViewDrawer: (item: any) => void
  setSelectedAttendanceDetail: (item: any) => void
  openEditModal: (item: any) => void
  confirmDelete: (itemOrId: any, force?: boolean) => void
}

export const EmployeeTableSection: React.FC<EmployeeTableSectionProps> = ({
  activeTab,
  records,
  isLoading,
  isFetching,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  visibleColumns,
  sortBy,
  sortOrder,
  handleSort,
  getPhotoUrl,
  openViewDrawer,
  setSelectedAttendanceDetail,
  openEditModal,
  confirmDelete,
}) => {
  const { t } = useTranslation(['employees', 'common'])

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden print:hidden">
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
                    {visibleColumns.id && <th className="cursor-pointer select-none" onClick={() => handleSort('id')}>{t('employees.id', 'ID')} {renderSortIcon('id')}</th>}
                    {visibleColumns.photo && <th>{t('employees.photo', 'Photo')}</th>}
                    {visibleColumns.employee_number && <th className="cursor-pointer select-none" onClick={() => handleSort('employee_number')}>{t('employees.employee_number', 'Employee Number')} {renderSortIcon('employee_number')}</th>}
                    {visibleColumns.name && <th className="cursor-pointer select-none" onClick={() => handleSort('name')}>{t('employees.name', 'Name')} {renderSortIcon('name')}</th>}
                    {visibleColumns.email && <th className="cursor-pointer select-none" onClick={() => handleSort('email')}>{t('employees.email', 'Email')} {renderSortIcon('email')}</th>}
                    {visibleColumns.phone && <th>{t('employees.phone', 'Phone')}</th>}
                    {visibleColumns.branch && <th>{t('employees.branch', 'Branch')}</th>}
                    {visibleColumns.department && <th>{t('employees.department', 'Department')}</th>}
                    {visibleColumns.position && <th>{t('employees.position', 'Position')}</th>}
                    {visibleColumns.gender && <th>{t('employees.gender', 'Gender')}</th>}
                    {visibleColumns.basic_salary && <th className="cursor-pointer select-none" onClick={() => handleSort('basic_salary')}>{t('employees.basic_salary', 'Basic Salary')} {renderSortIcon('basic_salary')}</th>}
                    {visibleColumns.join_date && <th className="cursor-pointer select-none" onClick={() => handleSort('join_date')}>{t('employees.join_date', 'Join Date')} {renderSortIcon('join_date')}</th>}
                    {visibleColumns.created_at && <th className="cursor-pointer select-none" onClick={() => handleSort('created_at')}>{t('employees.created_at', 'Created At')} {renderSortIcon('created_at')}</th>}
                    {visibleColumns.status && <th className="cursor-pointer select-none" onClick={() => handleSort('status')}>{t('employees.status', 'Status')} {renderSortIcon('status')}</th>}
                  </>
                )}
                {activeTab === 'departments' && (
                  <>
                    {visibleColumns.id && <th className="cursor-pointer select-none" onClick={() => handleSort('id')}>{t('employees.id', 'ID')} {renderSortIcon('id')}</th>}
                    {visibleColumns.name && <th className="cursor-pointer select-none" onClick={() => handleSort('name')}>{t('employees.name', 'Name')} {renderSortIcon('name')}</th>}
                    {visibleColumns.code && <th className="cursor-pointer select-none" onClick={() => handleSort('code')}>{t('employees.code', 'Code')} {renderSortIcon('code')}</th>}
                    {visibleColumns.positions && <th>{t('employees.positions', 'Positions')}</th>}
                    {visibleColumns.employees && <th>{t('employees.employees', 'Employees')}</th>}
                    {visibleColumns.status && <th>{t('employees.status', 'Status')}</th>}
                  </>
                )}
                {activeTab === 'positions' && (
                  <>
                    {visibleColumns.id && <th className="cursor-pointer select-none" onClick={() => handleSort('id')}>{t('employees.id', 'ID')} {renderSortIcon('id')}</th>}
                    {visibleColumns.name && <th className="cursor-pointer select-none" onClick={() => handleSort('name')}>{t('employees.name', 'Name')} {renderSortIcon('name')}</th>}
                    {visibleColumns.code && <th className="cursor-pointer select-none" onClick={() => handleSort('code')}>{t('employees.code', 'Code')} {renderSortIcon('code')}</th>}
                    {visibleColumns.department && <th>{t('employees.department', 'Department')}</th>}
                    {visibleColumns.employees && <th>{t('employees.employees', 'Employees')}</th>}
                    {visibleColumns.status && <th>{t('employees.status', 'Status')}</th>}
                  </>
                )}
                {activeTab === 'attendance' && (
                  <>
                    {visibleColumns.date && <th className="cursor-pointer select-none" onClick={() => handleSort('attendance_date')}>{t('employees.date', 'Date')} {renderSortIcon('attendance_date')}</th>}
                    {visibleColumns.employee && <th>{t('employees.employee', 'Employee')}</th>}
                    {visibleColumns.dept_pos && <th>{t('employees.dept_pos', 'Department / Position')}</th>}
                    {visibleColumns.shift && <th>{t('employees.shift', 'Shift')}</th>}
                    {visibleColumns.check_in && <th className="cursor-pointer select-none" onClick={() => handleSort('check_in')}>{t('employees.check_in', 'Check In')} {renderSortIcon('check_in')}</th>}
                    {visibleColumns.check_out && <th className="cursor-pointer select-none" onClick={() => handleSort('check_out')}>{t('employees.check_out', 'Check Out')} {renderSortIcon('check_out')}</th>}
                    {visibleColumns.worked_hours && <th>{t('employees.worked_hours', 'Worked Hours')}</th>}
                    {visibleColumns.late && <th>{t('employees.late', 'Late')}</th>}
                    {visibleColumns.overtime && <th>{t('employees.overtime', 'Overtime')}</th>}
                    {visibleColumns.status && <th className="cursor-pointer select-none" onClick={() => handleSort('status')}>{t('employees.status', 'Status')} {renderSortIcon('status')}</th>}
                    {visibleColumns.device_method && <th>{t('employees.device_method', 'Device & Method')}</th>}
                  </>
                )}
                {activeTab === 'payrolls' && (
                  <>
                    {visibleColumns.period_month && <th className="cursor-pointer select-none" onClick={() => handleSort('period_month')}>{t('employees.period_month', 'Period')} {renderSortIcon('period_month')}</th>}
                    {visibleColumns.employee && <th>{t('employees.employee', 'Employee')}</th>}
                    {visibleColumns.basic_salary && <th className="cursor-pointer select-none" onClick={() => handleSort('basic_salary')}>{t('employees.basic_salary', 'Basic Salary')} {renderSortIcon('basic_salary')}</th>}
                    {visibleColumns.allowances && <th>{t('employees.allowances', 'Allowances')}</th>}
                    {visibleColumns.deductions && <th>{t('employees.deductions', 'Deductions')}</th>}
                    {visibleColumns.overtime && <th>{t('employees.overtime', 'Overtime')}</th>}
                    {visibleColumns.net_salary && <th className="cursor-pointer select-none" onClick={() => handleSort('net_salary')}>{t('employees.net_salary', 'Net Salary')} {renderSortIcon('net_salary')}</th>}
                    {visibleColumns.status && <th className="cursor-pointer select-none" onClick={() => handleSort('status')}>{t('employees.status', 'Status')} {renderSortIcon('status')}</th>}
                    {visibleColumns.paid_at && <th>{t('employees.paid_at', 'Paid At')}</th>}
                  </>
                )}
                <th className="print:hidden text-right">{t('common.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={10} />
              ) : records.length === 0 ? (
                <EmptyState cols={50} message={t('employees.no_records', 'No employee module records found')} />
              ) : (
                records.map((r: any) => {
                  const isSelected = selectedRows.includes(r.id)
                  return (
                    <tr
                      key={r.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-primary/8 dark:bg-primary/15'
                          : 'hover:bg-muted/40'
                      }`}
                    >
                      <td className="!px-3">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(r.id, e.target.checked)}
                        />
                      </td>
                    {activeTab === 'employees' && (
                      <>
                        {visibleColumns.id && <td>{r.id}</td>}
                        {visibleColumns.photo && (
                          <td>
                            <EmployeeAvatar
                              photo={r.photo}
                              name={r.name}
                              id={r.id}
                              size="md"
                              getPhotoUrl={getPhotoUrl}
                            />
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
                              {r.gender === 'male' ? t('employees.male', 'Male') : r.gender === 'female' ? t('employees.female', 'Female') : r.gender}
                            </span>
                          </td>
                        )}
                        {visibleColumns.basic_salary && <td className="font-semibold font-mono">${Number(r.basic_salary).toLocaleString()}</td>}
                        {visibleColumns.join_date && <td>{r.join_date ? new Date(r.join_date).toLocaleDateString() : 'N/A'}</td>}
                        {visibleColumns.created_at && <td className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>}
                        {visibleColumns.status && (
                          <td>
                            <StatusBadge status={r.status} />
                          </td>
                        )}
                      </>
                    )}
                    {activeTab === 'departments' && (
                      <>
                        {visibleColumns.id && <td>{r.id}</td>}
                        {visibleColumns.name && <td className="font-semibold text-foreground">{r.name}</td>}
                        {visibleColumns.code && <td className="font-mono text-xs">{r.code ?? 'N/A'}</td>}
                        {visibleColumns.positions && (
                          <td>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              <Briefcase size={12} className="opacity-70" />
                              {r.positions_count ?? 0} {t('employees.positions', 'Positions')}
                            </span>
                          </td>
                        )}
                        {visibleColumns.employees && (
                          <td>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              <Users size={12} className="opacity-70" />
                              {r.employees_count ?? 0} {t('employees.employees', 'Employees')}
                            </span>
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td>
                            <StatusBadge status={r.is_active} />
                          </td>
                        )}
                      </>
                    )}
                    {activeTab === 'positions' && (
                      <>
                        {visibleColumns.id && <td>{r.id}</td>}
                        {visibleColumns.name && <td className="font-semibold text-foreground">{r.name}</td>}
                        {visibleColumns.code && <td className="font-mono text-xs">{r.code ?? 'N/A'}</td>}
                        {visibleColumns.department && <td>{r.department?.name ?? 'N/A'}</td>}
                        {visibleColumns.employees && (
                          <td>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              <Users size={12} className="opacity-70" />
                              {r.employees_count ?? 0} {t('employees.employees', 'Employees')}
                            </span>
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td>
                            <StatusBadge status={r.is_active} />
                          </td>
                        )}
                      </>
                    )}
                    {activeTab === 'attendance' && (
                      <>
                        {visibleColumns.date && <td className="font-semibold text-xs font-mono">{r.attendance_date ?? (r.date ? new Date(r.date).toLocaleDateString() : 'N/A')}</td>}
                        {visibleColumns.employee && (
                          <td>
                            <div className="flex items-center gap-2">
                              <EmployeeAvatar
                                photo={r.employee?.photo}
                                name={r.employee?.name}
                                id={r.employee?.id ?? r.employee_id}
                                size="sm"
                                getPhotoUrl={getPhotoUrl}
                              />
                              <div>
                                <p className="font-bold text-foreground text-xs">{r.employee?.name ?? 'N/A'}</p>
                                <p className="font-mono text-[10px] text-muted-foreground">{r.employee?.employee_number ?? 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                        )}
                        {visibleColumns.dept_pos && (
                          <td className="text-xs">
                            <p className="font-semibold text-foreground">{r.department?.name ?? r.employee?.department?.name ?? 'General'}</p>
                            <p className="text-[10px] text-muted-foreground">{r.position?.name ?? r.employee?.position?.name ?? '-'}</p>
                          </td>
                        )}
                        {visibleColumns.shift && <td className="text-xs font-semibold">{r.shift?.name ?? 'Morning Shift'}</td>}
                        {visibleColumns.check_in && <td className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{r.check_in ?? '--:--'}</td>}
                        {visibleColumns.check_out && <td className="font-mono text-xs text-rose-500 font-semibold">{r.check_out ?? '--:--'}</td>}
                        {visibleColumns.worked_hours && <td className="text-xs font-bold text-foreground">{r.working_hours ?? r.worked_hours_formatted ?? '-'}</td>}
                        {visibleColumns.late && <td className={`text-xs font-semibold ${r.late_minutes > 0 ? 'text-amber-500' : 'text-muted-foreground'}`}>{r.late_time ?? r.late_time_formatted ?? '0m'}</td>}
                        {visibleColumns.overtime && <td className="text-xs font-semibold text-emerald-500">{r.overtime_formatted ?? '0m'}</td>}
                        {visibleColumns.status && (
                          <td>
                            <StatusBadge status={r.status} />
                          </td>
                        )}
                        {visibleColumns.device_method && (
                          <td className="text-[11px] text-muted-foreground">
                            <p className="font-semibold text-foreground">{r.device_name ?? 'Mobile App'}</p>
                            <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded font-mono uppercase">{r.check_in_method ?? 'QR Scan'}</span>
                          </td>
                        )}
                      </>
                    )}
                    {activeTab === 'payrolls' && (
                      <>
                        {visibleColumns.period_month && <td className="font-semibold font-mono">{r.period_month}</td>}
                        {visibleColumns.employee && <td className="font-semibold text-foreground">{r.employee?.name ?? 'N/A'}</td>}
                        {visibleColumns.basic_salary && <td className="font-mono">${Number(r.basic_salary).toLocaleString()}</td>}
                        {visibleColumns.allowances && <td className="font-mono">${Number(r.allowances).toLocaleString()}</td>}
                        {visibleColumns.deductions && <td className="font-mono">${Number(r.deductions).toLocaleString()}</td>}
                        {visibleColumns.overtime && <td className="font-mono">${Number(r.overtime_pay).toLocaleString()}</td>}
                        {visibleColumns.net_salary && <td className="font-bold text-primary font-mono">${Number(r.net_salary).toLocaleString()}</td>}
                        {visibleColumns.status && (
                          <td>
                            <StatusBadge status={r.status} />
                          </td>
                        )}
                        {visibleColumns.paid_at && <td className="text-xs">{r.paid_at ? new Date(r.paid_at).toLocaleDateString() : '-'}</td>}
                      </>
                    )}
                    <td className="print:hidden text-right" onClick={(e) => e.stopPropagation()}>
                      <TableActionMenu
                        onView={
                          activeTab === 'employees'
                            ? () => openViewDrawer(r)
                            : activeTab === 'attendance'
                            ? () => setSelectedAttendanceDetail(r)
                            : undefined
                        }
                        onEdit={() => openEditModal(r)}
                        onDelete={() => confirmDelete(r, false)}
                      />
                    </td>
                  </tr>
                )
              }))}
            </tbody>
          </table>
        </div>
      </TableWrapper>
    </div>
  )
}

export default EmployeeTableSection
