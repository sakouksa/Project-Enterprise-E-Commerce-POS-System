export type TabType = 'expenses' | 'categories' | 'registers' | 'transactions' | 'payment_methods' | 'currencies' | 'taxes'

export interface ExpenseForm {
  title: string
  expense_category_id: string
  amount: string
  date: string
  description: string
  branch_id: string
  reference_number: string
  receipt: string
  status: string
}

export interface CategoryForm {
  name: string
  code: string
  is_active: boolean
}

export interface RegisterForm {
  title: string
  status: string
  opening_balance: string
  closing_balance: string
  branch_id: string
  store_id: string
  notes: string
}

export interface CurrencyForm {
  name: string
  code: string
  symbol: string
  exchange_rate: string
  is_active: boolean
  is_default: boolean
}

export interface TaxForm {
  name: string
  rate: string
  type: string
  is_active: boolean
}
