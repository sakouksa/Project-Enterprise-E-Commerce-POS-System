import React from 'react'
import FormDrawer from '@/components/common/FormDrawer'
import { Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type {
  TabType, ExpenseForm, CategoryForm, RegisterForm, CurrencyForm, TaxForm
} from '../types'

interface FinanceFormDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeTab: TabType
  editingItem: any | null
  onSubmit: () => void
  isPending: boolean
  categories: any[]
  expenseForm: ExpenseForm
  setExpenseForm: React.Dispatch<React.SetStateAction<ExpenseForm>>
  handleReceiptFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  categoryForm: CategoryForm
  setCategoryForm: React.Dispatch<React.SetStateAction<CategoryForm>>
  registerForm: RegisterForm
  setRegisterForm: React.Dispatch<React.SetStateAction<RegisterForm>>
  currencyForm: CurrencyForm
  setCurrencyForm: React.Dispatch<React.SetStateAction<CurrencyForm>>
  taxForm: TaxForm
  setTaxForm: React.Dispatch<React.SetStateAction<TaxForm>>
}

export const FinanceFormDrawer: React.FC<FinanceFormDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  editingItem,
  onSubmit,
  isPending,
  categories = [],
  expenseForm,
  setExpenseForm,
  handleReceiptFileChange,
  categoryForm,
  setCategoryForm,
  registerForm,
  setRegisterForm,
  currencyForm,
  setCurrencyForm,
  taxForm,
  setTaxForm,
}) => {
  const { t } = useTranslation(['finance', 'common'])

  const getAddButtonLabel = () => {
    switch (activeTab) {
      case 'expenses': return t('finance.add_expense', 'Add Expense')
      case 'categories': return t('finance.add_category', 'Add Category')
      case 'registers': return t('finance.add_register', 'Add Register')
      case 'currencies': return t('finance.add_currency', 'Add Currency')
      case 'taxes': return t('finance.add_tax', 'Add Tax Rule')
      default: return 'Save Details'
    }
  }

  return (
    <FormDrawer
      open={isOpen}
      onClose={onClose}
      title={editingItem ? `${t('common.edit', 'Edit')} ${getAddButtonLabel()}` : getAddButtonLabel()}
      onSubmit={onSubmit}
      isSubmitting={isPending}
    >
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.expense_title', 'Title *')}</label>
            <input
              type="text"
              required
              value={expenseForm.title}
              onChange={(e) => setExpenseForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Office Supplies Purchase"
              className="form-input rounded-xl text-sm w-full bg-card border-border"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.amount_col', 'Amount ($) *')}</label>
              <input
                type="number"
                step="0.01"
                required
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm((p) => ({ ...p, amount: e.target.value }))}
                placeholder="0.00"
                className="form-input rounded-xl text-sm w-full bg-card border-border"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.date_col', 'Date')}</label>
              <input
                type="date"
                required
                value={expenseForm.date}
                onChange={(e) => setExpenseForm((p) => ({ ...p, date: e.target.value }))}
                className="form-input rounded-xl text-sm w-full bg-card border-border"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.category_col', 'Category')}</label>
            <select
              value={expenseForm.expense_category_id}
              onChange={(e) => setExpenseForm((p) => ({ ...p, expense_category_id: e.target.value }))}
              className="form-input rounded-xl text-sm w-full bg-card border-border cursor-pointer"
            >
              <option value="">-- {t('finance.select_category', 'Select Expense Category')} --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.description_col', 'Description & Details')}</label>
            <textarea
              value={expenseForm.description}
              onChange={(e) => setExpenseForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Notes or justification..."
              rows={3}
              className="form-input rounded-xl text-sm w-full bg-card border-border resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.receipt_upload', 'Attach Digital Receipt')}</label>
            <div className="border border-dashed border-border rounded-xl p-3 bg-muted/20 text-center">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg hover:opacity-90">
                <Upload size={13} />
                <span>Upload Receipt</span>
                <input type="file" accept="image/*,.pdf" onChange={handleReceiptFileChange} className="hidden" />
              </label>
              {expenseForm.receipt && (
                <p className="text-[11px] font-mono text-emerald-500 mt-1 truncate">{expenseForm.receipt}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.category_name', 'Category Name *')}</label>
            <input
              type="text"
              required
              value={categoryForm.name}
              onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Travel & Transport"
              className="form-input rounded-xl text-sm w-full bg-card border-border"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.code_col', 'Category Code')}</label>
            <input
              type="text"
              value={categoryForm.code}
              onChange={(e) => setCategoryForm((p) => ({ ...p, code: e.target.value }))}
              placeholder="EXP-TRV"
              className="form-input rounded-xl text-sm w-full bg-card border-border font-mono"
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="catActive"
              checked={categoryForm.is_active}
              onChange={(e) => setCategoryForm((p) => ({ ...p, is_active: e.target.checked }))}
              className="checkbox h-4 w-4"
            />
            <label htmlFor="catActive" className="text-xs font-bold text-foreground cursor-pointer">
              {t('finance.active_category', 'Enable active status for this category')}
            </label>
          </div>
        </div>
      )}

      {activeTab === 'registers' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.register_title', 'Register Name *')}</label>
            <input
              type="text"
              required
              value={registerForm.title}
              onChange={(e) => setRegisterForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Main Counter POS Cash Drawer"
              className="form-input rounded-xl text-sm w-full bg-card border-border"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.opening_balance', 'Opening Balance ($)')}</label>
              <input
                type="number"
                step="0.01"
                value={registerForm.opening_balance}
                onChange={(e) => setRegisterForm((p) => ({ ...p, opening_balance: e.target.value }))}
                placeholder="500.00"
                className="form-input rounded-xl text-sm w-full bg-card border-border"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.closing_balance', 'Closing Balance ($)')}</label>
              <input
                type="number"
                step="0.01"
                value={registerForm.closing_balance}
                onChange={(e) => setRegisterForm((p) => ({ ...p, closing_balance: e.target.value }))}
                placeholder="1500.00"
                className="form-input rounded-xl text-sm w-full bg-card border-border"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.register_status', 'Register Status')}</label>
            <select
              value={registerForm.status}
              onChange={(e) => setRegisterForm((p) => ({ ...p, status: e.target.value }))}
              className="form-input rounded-xl text-sm w-full bg-card border-border cursor-pointer"
            >
              <option value="open">Open Till Session</option>
              <option value="closed">Closed Till Session</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === 'currencies' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.currency_name', 'Currency Name *')}</label>
            <input
              type="text"
              required
              value={currencyForm.name}
              onChange={(e) => setCurrencyForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="United States Dollar"
              className="form-input rounded-xl text-sm w-full bg-card border-border"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.code_col', 'ISO Code *')}</label>
              <input
                type="text"
                required
                value={currencyForm.code}
                onChange={(e) => setCurrencyForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="USD"
                className="form-input rounded-xl text-sm w-full bg-card border-border font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.symbol_col', 'Symbol *')}</label>
              <input
                type="text"
                required
                value={currencyForm.symbol}
                onChange={(e) => setCurrencyForm((p) => ({ ...p, symbol: e.target.value }))}
                placeholder="$"
                className="form-input rounded-xl text-sm w-full bg-card border-border text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.exchange_rate', 'Rate')}</label>
              <input
                type="number"
                step="0.0001"
                required
                value={currencyForm.exchange_rate}
                onChange={(e) => setCurrencyForm((p) => ({ ...p, exchange_rate: e.target.value }))}
                placeholder="1.0000"
                className="form-input rounded-xl text-sm w-full bg-card border-border"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'taxes' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.tax_rule_name', 'Tax Rule Name *')}</label>
            <input
              type="text"
              required
              value={taxForm.name}
              onChange={(e) => setTaxForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="VAT 10%"
              className="form-input rounded-xl text-sm w-full bg-card border-border"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.tax_rate', 'Rate (%) *')}</label>
              <input
                type="number"
                step="0.01"
                required
                value={taxForm.rate}
                onChange={(e) => setTaxForm((p) => ({ ...p, rate: e.target.value }))}
                placeholder="10.00"
                className="form-input rounded-xl text-sm w-full bg-card border-border"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.type_col', 'Type')}</label>
              <select
                value={taxForm.type}
                onChange={(e) => setTaxForm((p) => ({ ...p, type: e.target.value }))}
                className="form-input rounded-xl text-sm w-full bg-card border-border cursor-pointer"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </FormDrawer>
  )
}

export default FinanceFormDrawer
