import React from 'react'
import { Check, Edit, Eye, Trash2, Printer, Plus, User, Briefcase, Users, RotateCcw, ChevronUp, ChevronDown, Phone, Mail, Building2 } from 'lucide-react'
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
                    {visibleColumns.employee !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('name')}>
                        {t('employees.employee', 'Employee')} {renderSortIcon('name')}
                      </th>
                    )}
                    {visibleColumns.contact !== false && (
                      <th>{t('employees.contact', 'Contact')}</th>
                    )}
                    {visibleColumns.department !== false && (
                      <th>{t('employees.department_and_position', 'Department & Role')}</th>
                    )}
                    {visibleColumns.basic_salary !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('basic_salary')}>
                        {t('employees.basic_salary', 'Basic Salary')} {renderSortIcon('basic_salary')}
                      </th>
                    )}
                    {visibleColumns.status !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('status')}>
                        {t('employees.status', 'Status')} {renderSortIcon('status')}
                      </th>
                    )}
                  </>
                )}
                {activeTab === 'departments' && (
                  <>
                    {visibleColumns.name !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('name')}>
                        {t('employees.name', 'Name')} {renderSortIcon('name')}
                      </th>
                    )}
                    {visibleColumns.code !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('code')}>
                        {t('employees.code', 'Code')} {renderSortIcon('code')}
                      </th>
                    )}
                    {visibleColumns.positions !== false && (
                      <th>{t('employees.positions', 'Positions')}</th>
                    )}
                    {visibleColumns.employees !== false && (
                      <th>{t('employees.employees', 'Employees')}</th>
                    )}
                    {visibleColumns.status !== false && (
                      <th>{t('employees.status', 'Status')}</th>
                    )}
                  </>
                )}
                {activeTab === 'positions' && (
                  <>
                    {visibleColumns.name !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('name')}>
                        {t('employees.name', 'Name')} {renderSortIcon('name')}
                      </th>
                    )}
                    {visibleColumns.code !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('code')}>
                        {t('employees.code', 'Code')} {renderSortIcon('code')}
                      </th>
                    )}
                    {visibleColumns.department !== false && (
                      <th>{t('employees.department', 'Department')}</th>
                    )}
                    {visibleColumns.employees !== false && (
                      <th>{t('employees.employees', 'Employees')}</th>
                    )}
                    {visibleColumns.status !== false && (
                      <th>{t('employees.status', 'Status')}</th>
                    )}
                  </>
                )}
                {activeTab === 'attendance' && (
                  <>
                    {visibleColumns.date !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('attendance_date')}>
                        {t('employees.date', 'Date')} {renderSortIcon('attendance_date')}
                      </th>
                    )}
                    {visibleColumns.employee !== false && (
                      <th>{t('employees.employee', 'Employee')}</th>
                    )}
                    {visibleColumns.shift !== false && (
                      <th>{t('employees.shift', 'Shift')}</th>
                    )}
                    {visibleColumns.check_in !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('check_in')}>
                        {t('employees.check_in', 'Check In')} {renderSortIcon('check_in')}
                      </th>
                    )}
                    {visibleColumns.check_out !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('check_out')}>
                        {t('employees.check_out', 'Check Out')} {renderSortIcon('check_out')}
                      </th>
                    )}
                    {visibleColumns.worked_hours !== false && (
                      <th>{t('employees.worked_hours', 'Worked Hours')}</th>
                    )}
                    {visibleColumns.status !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('status')}>
                        {t('employees.status', 'Status')} {renderSortIcon('status')}
                      </th>
                    )}
                  </>
                )}
                {activeTab === 'payrolls' && (
                  <>
                    {visibleColumns.period_month !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('period_month')}>
                        {t('employees.period_month', 'Period')} {renderSortIcon('period_month')}
                      </th>
                    )}
                    {visibleColumns.employee !== false && (
                      <th>{t('employees.employee', 'Employee')}</th>
                    )}
                    {visibleColumns.basic_salary !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('basic_salary')}>
                        {t('employees.basic_salary', 'Basic Salary')} {renderSortIcon('basic_salary')}
                      </th>
                    )}
                    {visibleColumns.allowances !== false && (
                      <th>{t('employees.allowances', 'Allowances')}</th>
                    )}
                    {visibleColumns.deductions !== false && (
                      <th>{t('employees.deductions', 'Deductions')}</th>
                    )}
                    {visibleColumns.overtime !== false && (
                      <th>{t('employees.overtime', 'Overtime')}</th>
                    )}
                    {visibleColumns.net_salary !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('net_salary')}>
                        {t('employees.net_salary', 'Net Salary')} {renderSortIcon('net_salary')}
                      </th>
                    )}
                    {visibleColumns.status !== false && (
                      <th className="cursor-pointer select-none" onClick={() => handleSort('status')}>
                        {t('employees.status', 'Status')} {renderSortIcon('status')}
                      </th>
                    )}
                  </>
                )}
                <th className="print:hidden !text-right pr-6">{t('common.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={7} />
              ) : records.length === 0 ? (
                <EmptyState cols={7} message={t('employees.no_records', 'No employee module records found')} />
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
                        {visibleColumns.employee !== false && (
                          <td className="py-2.5">
                            <div className="flex items-center gap-3">
                              <EmployeeAvatar
                                photo={r.photo}
                                name={r.name}
                                id={r.id}
                                size="md"
                                getPhotoUrl={getPhotoUrl}
                              />
                              <div>
                                <span
                                  className="font-bold text-sm text-foreground hover:text-primary cursor-pointer transition-colors block"
                                  onClick={() => openViewDrawer(r)}
                                >
                                  {r.name}
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[11px] font-medium text-primary/80 bg-primary/10 dark:bg-primary/20 px-1.5 py-0.2 rounded">
                                    {r.employee_number || `EMP-${String(r.id).padStart(4, '0')}`}
                                  </span>
                                  {r.gender && (
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                                      r.gender === 'male'
                                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        : 'bg-pink-500/10 text-pink-600 dark:text-pink-400'
                                    }`}>
                                      {r.gender === 'male' ? t('employees.male', 'Male') : t('employees.female', 'Female')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        )}
                        {visibleColumns.contact !== false && (
                          <td>
                            <div className="space-y-0.5">
                              <div className="text-xs font-medium text-foreground">{r.email ?? 'N/A'}</div>
                              {r.phone && (
                                <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                                  <Phone size={10} className="opacity-70" />
                                  <span>{r.phone}</span>
                                </div>
                              )}
                            </div>
                          </td>
                        )}
                        {visibleColumns.department !== false && (
                          <td>
                            <div className="space-y-0.5">
                              <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <Briefcase size={12} className="text-primary/70 shrink-0" />
                                <span>{r.department?.name ?? 'General'}</span>
                              </div>
                              <div className="text-[11px] text-muted-foreground pl-4">
                                {r.position?.name ?? '-'}
                              </div>
                            </div>
                          </td>
                        )}
                        {visibleColumns.basic_salary !== false && (
                          <td className="font-semibold font-mono text-sm text-foreground">
                            ${Number(r.basic_salary ?? 0).toLocaleString()}
                          </td>
                        )}
                        {visibleColumns.status !== false && (
                          <td>
                            <StatusBadge status={r.status} />
                          </td>
                        )}
                      </>
                    )}
                    {activeTab === 'departments' && (
                      <>
                        {visibleColumns.name !== false && <td className="font-semibold text-foreground">{r.name}</td>}
                        {visibleColumns.code !== false && <td className="font-mono text-xs">{r.code ?? 'N/A'}</td>}
                        {visibleColumns.positions !== false && (
                          <td>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              <Briefcase size={12} className="opacity-70" />
                              {r.positions_count ?? 0} {t('employees.positions', 'Positions')}
                            </span>
                          </td>
                        )}
                        {visibleColumns.employees !== false && (
                          <td>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              <Users size={12} className="opacity-70" />
                              {r.employees_count ?? 0} {t('employees.employees', 'Employees')}
                            </span>
                          </td>
                        )}
                        {visibleColumns.status !== false && (
                          <td>
                            <StatusBadge status={r.is_active} />
                          </td>
                        )}
                      </>
                    )}
                    {activeTab === 'positions' && (
                      <>
                        {visibleColumns.name !== false && <td className="font-semibold text-foreground">{r.name}</td>}
                        {visibleColumns.code !== false && <td className="font-mono text-xs">{r.code ?? 'N/A'}</td>}
                        {visibleColumns.department !== false && <td>{r.department?.name ?? 'N/A'}</td>}
                        {visibleColumns.employees !== false && (
                          <td>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              <Users size={12} className="opacity-70" />
                              {r.employees_count ?? 0} {t('employees.employees', 'Employees')}
                            </span>
                          </td>
                        )}
                        {visibleColumns.status !== false && (
                          <td>
                            <StatusBadge status={r.is_active} />
                          </td>
                        )}
                      </>
                    )}
                    {activeTab === 'attendance' && (
                      <>
                        {visibleColumns.date !== false && <td className="font-semibold text-xs font-mono">{r.attendance_date ?? (r.date ? new Date(r.date).toLocaleDateString() : 'N/A')}</td>}
                        {visibleColumns.employee !== false && (
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
                        {visibleColumns.shift !== false && <td className="text-xs font-semibold">{r.shift?.name ?? 'Morning Shift'}</td>}
                        {visibleColumns.check_in !== false && <td className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{r.check_in ?? '--:--'}</td>}
                        {visibleColumns.check_out !== false && <td className="font-mono text-xs text-rose-500 font-semibold">{r.check_out ?? '--:--'}</td>}
                        {visibleColumns.worked_hours !== false && <td className="text-xs font-bold text-foreground">{r.working_hours ?? r.worked_hours_formatted ?? '-'}</td>}
                        {visibleColumns.status !== false && (
                          <td>
                            <StatusBadge status={r.status} />
                          </td>
                        )}
                      </>
                    )}
                    {activeTab === 'payrolls' && (
                      <>
                        {visibleColumns.period_month !== false && <td className="font-semibold font-mono">{r.period_month}</td>}
                        {visibleColumns.employee !== false && <td className="font-semibold text-foreground">{r.employee?.name ?? 'N/A'}</td>}
                        {visibleColumns.basic_salary !== false && <td className="font-mono">${Number(r.basic_salary).toLocaleString()}</td>}
                        {visibleColumns.allowances !== false && <td className="font-mono">${Number(r.allowances).toLocaleString()}</td>}
                        {visibleColumns.deductions !== false && <td className="font-mono">${Number(r.deductions).toLocaleString()}</td>}
                        {visibleColumns.overtime !== false && <td className="font-mono">${Number(r.overtime_pay).toLocaleString()}</td>}
                        {visibleColumns.net_salary !== false && <td className="font-bold text-primary font-mono">${Number(r.net_salary).toLocaleString()}</td>}
                        {visibleColumns.status !== false && (
                          <td>
                            <StatusBadge status={r.status} />
                          </td>
                        )}
                      </>
                    )}
                    <td className="print:hidden !text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end">
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
                      </div>
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

