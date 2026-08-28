export type Tab = 'employees' | 'departments' | 'positions' | 'attendance' | 'payrolls'

export interface ImportResult {
  success_count: number
  errors: string[]
}

export interface EmployeeStatsData {
  total_employees?: number
  active_employees?: number
  resigned_employees?: number
  total_departments?: number
  total_positions?: number
  monthly_salary_expense?: number
  average_salary?: number
  payroll_draft?: number
  new_today_employees?: number
  attendance_today?: {
    present: number
    late: number
    absent: number
    leave: number
    holiday: number
  }
}

export const INITIAL_VISIBLE_COLUMNS_MAP: Record<Tab, Record<string, boolean>> = {
  employees: {
    employee: true,
    contact: true,
    department: true,
    basic_salary: true,
    status: true,
    branch: false,
    gender: false,
    join_date: false,
    created_at: false,
    id: false,
  },
  departments: {
    name: true,
    code: true,
    positions: true,
    employees: true,
    status: true,
    id: false,
  },
  positions: {
    name: true,
    code: true,
    department: true,
    employees: true,
    status: true,
    id: false,
  },
  attendance: {
    date: true,
    employee: true,
    shift: true,
    check_in: true,
    check_out: true,
    worked_hours: true,
    status: true,
    dept_pos: false,
    late: false,
    overtime: false,
    device_method: false,
  },
  payrolls: {
    period_month: true,
    employee: true,
    basic_salary: true,
    allowances: true,
    deductions: true,
    overtime: true,
    net_salary: true,
    status: true,
    paid_at: false,
  },
}

