import React from 'react'
import FormDrawer from '@/components/common/FormDrawer'
import IconColorPicker from '@/components/common/IconColorPicker'
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
      case 'categories': return t('finance.add_category', 'Add Expense Category')
      case 'registers': return t('finance.add_register', 'Add Cash Register')
      case 'currencies': return t('finance.add_currency', 'Add Currency')
      case 'taxes': return t('finance.add_tax', 'Add Tax Rule')
      default: return t('common.save', 'Save Details')
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
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('finance.title_col', 'Expense Title')} *
            </label>
            <input
              type="text"
              required
              value={expenseForm.title}
              onChange={(e) => setExpenseForm((p) => ({ ...p, title: e.target.value }))}
              placeholder={t('finance.placeholder_title', 'e.g. Office Supplies & Equipment')}
              className="w-full h-10 px-3.5 rounded-xl text-sm bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground shadow-xs font-medium"
            />
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {t('finance.amount_col', 'Amount ($ USD)')} *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground pointer-events-none">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full h-10 pl-8 pr-3 text-sm font-mono font-bold bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground shadow-xs"
                />
              </div>
              {/* Quick Amount Suggestion Pills */}
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {['50', '100', '250', '500', '1000'].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setExpenseForm((p) => ({ ...p, amount: amt }))}
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    +${amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {t('finance.date_col', 'Date')} *
              </label>
              <input
                type="date"
                required
                value={expenseForm.date}
                onChange={(e) => setExpenseForm((p) => ({ ...p, date: e.target.value }))}
                className="w-full h-10 px-3 text-sm font-mono bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground shadow-xs"
              />
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {t('finance.category_col', 'Category')} *
              </label>
              <select
                value={expenseForm.expense_category_id}
                onChange={(e) => setExpenseForm((p) => ({ ...p, expense_category_id: e.target.value }))}
                className="w-full h-10 px-3 text-xs sm:text-sm bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground shadow-xs cursor-pointer"
              >
                <option value="">-- {t('finance.select_category', 'Select Category')} --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {t('finance.status_col', 'Approval Status')}
              </label>
              <select
                value={expenseForm.status || 'approved'}
                onChange={(e) => setExpenseForm((p) => ({ ...p, status: e.target.value }))}
                className="w-full h-10 px-3 text-xs sm:text-sm bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground shadow-xs cursor-pointer"
              >
                <option value="approved">{t('finance.status_approved', 'Approved')}</option>
                <option value="pending">{t('finance.status_pending', 'Pending')}</option>
                <option value="rejected">{t('finance.status_rejected', 'Rejected')}</option>
              </select>
            </div>
          </div>

          {/* Reference # */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('finance.reference_number', 'Invoice / Reference #')}
            </label>
            <input
              type="text"
              value={expenseForm.reference_number || ''}
              onChange={(e) => setExpenseForm((p) => ({ ...p, reference_number: e.target.value }))}
              placeholder={t('finance.placeholder_ref', 'e.g. INV-2026-0889')}
              className="w-full h-10 px-3.5 rounded-xl text-xs sm:text-sm font-mono bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground shadow-xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('finance.description_col', 'Description / Notes')}
            </label>
            <textarea
              value={expenseForm.description}
              onChange={(e) => setExpenseForm((p) => ({ ...p, description: e.target.value }))}
              placeholder={t('finance.placeholder_desc', 'Enter operational expense details...')}
              rows={2}
              className="w-full p-3 rounded-xl text-xs sm:text-sm bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground shadow-xs resize-none"
            />
          </div>

          {/* Upload Receipt */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('finance.receipt_upload', 'Digital Receipt / Invoice Attachment')}
            </label>
            <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-4 bg-muted/20 text-center transition-colors">
              {expenseForm.receipt ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                      <Upload size={16} />
                    </span>
                    <span className="text-xs font-mono font-medium text-foreground truncate">{expenseForm.receipt}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpenseForm((p) => ({ ...p, receipt: '' }))}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    {t('common.remove', 'Remove')}
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center gap-1.5 py-1">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Upload size={18} />
                  </div>
                  <p className="text-xs font-bold text-foreground">{t('finance.upload_receipt', 'Click to upload receipt')}</p>
                  <p className="text-[10px] text-muted-foreground">{t('finance.upload_receipt_hint', 'Supports PNG, JPG, PDF up to 10MB')}</p>
                  <input type="file" accept="image/*,.pdf" onChange={handleReceiptFileChange} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.category_name', 'Category Name')} *</label>
            <input
              type="text"
              required
              value={categoryForm.name}
              onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))}
              placeholder={t('finance.placeholder_cat_name', 'e.g. Travel & Transport')}
              className="w-full h-10 px-3.5 rounded-xl text-sm bg-card border border-border text-foreground shadow-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.code_col', 'Category Code')}</label>
            <input
              type="text"
              value={categoryForm.code}
              onChange={(e) => setCategoryForm((p) => ({ ...p, code: e.target.value }))}
              placeholder={t('finance.placeholder_cat_code', 'EXP-TRV')}
              className="w-full h-10 px-3.5 rounded-xl text-sm bg-card border border-border font-mono text-foreground shadow-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Icon & Color Selector with Live Preview */}
          <IconColorPicker
            selectedIcon={categoryForm.icon || 'FolderClosed'}
            onSelectIcon={(icon) => setCategoryForm((p) => ({ ...p, icon }))}
            selectedColor={categoryForm.color || 'blue'}
            onSelectColor={(color) => setCategoryForm((p) => ({ ...p, color }))}
            previewTitle={categoryForm.name}
            previewCode={categoryForm.code}
          />

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.category_description', 'Description (Optional)')}</label>
            <textarea
              rows={2}
              value={categoryForm.description || ''}
              onChange={(e) => setCategoryForm((p) => ({ ...p, description: e.target.value }))}
              placeholder={t('finance.placeholder_cat_desc', 'Brief notes about this expense category...')}
              className="w-full p-3 rounded-xl text-xs bg-card border border-border text-foreground shadow-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="catActive"
              checked={categoryForm.is_active}
              onChange={(e) => setCategoryForm((p) => ({ ...p, is_active: e.target.checked }))}
              className="checkbox h-4 w-4 rounded cursor-pointer"
            />
            <label htmlFor="catActive" className="text-xs font-bold text-foreground cursor-pointer">
              {t('finance.status_active', 'Active')}
            </label>
          </div>
        </div>
      )}

      {activeTab === 'registers' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.register_title', 'Register Title')} *</label>
            <input
              type="text"
              required
              value={registerForm.title}
              onChange={(e) => setRegisterForm((p) => ({ ...p, title: e.target.value }))}
              placeholder={t('finance.placeholder_reg_title', 'Main Counter POS Cash Drawer')}
              className="w-full h-10 px-3.5 rounded-xl text-sm bg-card border border-border text-foreground shadow-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.opening_balance', 'Opening Balance')}</label>
              <input
                type="number"
                step="0.01"
                value={registerForm.opening_balance}
                onChange={(e) => setRegisterForm((p) => ({ ...p, opening_balance: e.target.value }))}
                placeholder="500.00"
                className="w-full h-10 px-3.5 rounded-xl text-sm font-mono bg-card border border-border text-foreground shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.closing_balance', 'Closing Balance')}</label>
              <input
                type="number"
                step="0.01"
                value={registerForm.closing_balance}
                onChange={(e) => setRegisterForm((p) => ({ ...p, closing_balance: e.target.value }))}
                placeholder="1500.00"
                className="w-full h-10 px-3.5 rounded-xl text-sm font-mono bg-card border border-border text-foreground shadow-xs"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.status_col', 'Status')}</label>
            <select
              value={registerForm.status}
              onChange={(e) => setRegisterForm((p) => ({ ...p, status: e.target.value }))}
              className="w-full h-10 px-3 text-sm bg-card border border-border rounded-xl text-foreground shadow-xs cursor-pointer"
            >
              <option value="open">{t('finance.status_open', 'Open')}</option>
              <option value="closed">{t('finance.status_closed', 'Closed')}</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === 'currencies' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.currency_name', 'Currency Name')} *</label>
            <input
              type="text"
              required
              value={currencyForm.name}
              onChange={(e) => setCurrencyForm((p) => ({ ...p, name: e.target.value }))}
              placeholder={t('finance.placeholder_curr_name', 'United States Dollar')}
              className="w-full h-10 px-3.5 rounded-xl text-sm bg-card border border-border text-foreground shadow-xs"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.iso_code', 'ISO Code')} *</label>
              <input
                type="text"
                required
                value={currencyForm.code}
                onChange={(e) => setCurrencyForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="USD"
                className="w-full h-10 px-3 rounded-xl text-sm bg-card border border-border font-mono uppercase text-foreground shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.symbol_col', 'Symbol')} *</label>
              <input
                type="text"
                required
                value={currencyForm.symbol}
                onChange={(e) => setCurrencyForm((p) => ({ ...p, symbol: e.target.value }))}
                placeholder="$"
                className="w-full h-10 px-3 rounded-xl text-sm bg-card border border-border text-center font-bold text-foreground shadow-xs"
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
                className="w-full h-10 px-3 rounded-xl text-sm font-mono bg-card border border-border text-foreground shadow-xs"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'taxes' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">{t('finance.tax_rule_name', 'Tax Rule Name')} *</label>
            <input
              type="text"
              required
              value={taxForm.name}
              onChange={(e) => setTaxForm((p) => ({ ...p, name: e.target.value }))}
              placeholder={t('finance.placeholder_tax_name', 'VAT 10%')}
              className="w-full h-10 px-3.5 rounded-xl text-sm bg-card border border-border text-foreground shadow-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.tax_rate', 'Rate (%)')} *</label>
              <input
                type="number"
                step="0.01"
                required
                value={taxForm.rate}
                onChange={(e) => setTaxForm((p) => ({ ...p, rate: e.target.value }))}
                placeholder="10.00"
                className="w-full h-10 px-3.5 rounded-xl text-sm font-mono bg-card border border-border text-foreground shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">{t('finance.type_col', 'Type')}</label>
              <select
                value={taxForm.type}
                onChange={(e) => setTaxForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl text-sm bg-card border border-border text-foreground shadow-xs cursor-pointer"
              >
                <option value="percentage">{t('finance.tax_type_percentage', 'Percentage (%)')}</option>
                <option value="fixed">{t('finance.tax_type_fixed', 'Fixed')}</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </FormDrawer>
  )
}

export default FinanceFormDrawer
