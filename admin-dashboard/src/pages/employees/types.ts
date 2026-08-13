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
  },
  departments: {
    id: true,
    name: true,
    code: true,
    positions: true,
    employees: true,
    status: true,
  },
  positions: {
    id: true,
    name: true,
    code: true,
    department: true,
    employees: true,
    status: true,
  },
  attendance: {
    date: true,
    employee: true,
    dept_pos: true,
    shift: true,
    check_in: true,
    check_out: true,
    worked_hours: true,
    late: true,
    overtime: true,
    status: true,
    device_method: true,
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
    paid_at: true,
  },
}
