import React from 'react'
import { useTranslation } from 'react-i18next'
import FilterDrawerShell from '@/components/shared/FilterDrawerShell'
import ModernSelect from '@/components/shared/ModernSelect'

interface PurchasesFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  suppliers: any[]
  warehouses: any[]
  users: any[]
  supplierFilter: string
  setSupplierFilter: (val: string) => void
  warehouseFilter: string
  setWarehouseFilter: (val: string) => void
  statusFilter: string
  setStatusFilter: (val: string) => void
  paymentStatusFilter: string
  setPaymentStatusFilter: (val: string) => void
  purchaseDateStartFilter: string
  setPurchaseDateStartFilter: (val: string) => void
  purchaseDateEndFilter: string
  setPurchaseDateEndFilter: (val: string) => void
  dueDateStartFilter: string
  setDueDateStartFilter: (val: string) => void
  dueDateEndFilter: string
  setDueDateEndFilter: (val: string) => void
  minAmountFilter: string
  setMinAmountFilter: (val: string) => void
  maxAmountFilter: string
  setMaxAmountFilter: (val: string) => void
  createdByFilter: string
  setCreatedByFilter: (val: string) => void
  onReset: () => void
  setPage: (page: number) => void
}

const FieldLabel: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
      {label}
    </label>
    {children}
  </div>
)

export const PurchasesFilterDrawer: React.FC<PurchasesFilterDrawerProps> = ({
  isOpen,
  onClose,
  suppliers = [],
  warehouses = [],
  users = [],
  supplierFilter,
  setSupplierFilter,
  warehouseFilter,
  setWarehouseFilter,
  statusFilter,
  setStatusFilter,
  paymentStatusFilter,
  setPaymentStatusFilter,
  purchaseDateStartFilter,
  setPurchaseDateStartFilter,
  purchaseDateEndFilter,
  setPurchaseDateEndFilter,
  minAmountFilter,
  setMinAmountFilter,
  maxAmountFilter,
  setMaxAmountFilter,
  createdByFilter,
  setCreatedByFilter,
  onReset,
  setPage,
}) => {
  const { t } = useTranslation(['purchases', 'common'])

  const activeCount = [
    supplierFilter,
    warehouseFilter,
    statusFilter,
    paymentStatusFilter,
    purchaseDateStartFilter,
    purchaseDateEndFilter,
    minAmountFilter,
    maxAmountFilter,
    createdByFilter,
  ].filter(Boolean).length

  return (
    <FilterDrawerShell
      isOpen={isOpen}
      onClose={onClose}
      onReset={onReset}
      title={t('purchases.advancedFilters', 'Advanced Purchase Filters')}
      activeCount={activeCount}
      applyLabel={t('common.applyFilters', 'Apply Filters')}
      resetLabel={t('common.reset', 'Reset')}
    >
      {/* Supplier Filter */}
      <FieldLabel label={t('purchases.supplier', 'Supplier')}>
        <ModernSelect
          value={supplierFilter}
          onChange={(val) => { setSupplierFilter(String(val)); setPage(1); }}
          options={[
            { value: '', label: t('purchases.allSuppliers', 'All Suppliers') },
            ...(suppliers ?? []).map((s: any) => ({ value: String(s.id), label: s.name })),
          ]}
          placeholder={t('purchases.allSuppliers', 'All Suppliers')}
        />
      </FieldLabel>

      {/* Warehouse Filter */}
      <FieldLabel label={t('purchases.warehouse', 'Warehouse')}>
        <ModernSelect
          value={warehouseFilter}
          onChange={(val) => { setWarehouseFilter(String(val)); setPage(1); }}
          options={[
            { value: '', label: t('purchases.allWarehouses', 'All Warehouses') },
            ...(warehouses ?? []).map((w: any) => ({ value: String(w.id), label: w.name })),
          ]}
          placeholder={t('purchases.allWarehouses', 'All Warehouses')}
        />
      </FieldLabel>

      {/* Status Filter */}
      <FieldLabel label={t('purchases.status', 'Status')}>
        <ModernSelect
          value={statusFilter}
          onChange={(val) => { setStatusFilter(String(val)); setPage(1); }}
          options={[
            { value: '', label: t('purchases.allStatuses', 'All Statuses') },
            { value: 'draft', label: t('purchases.draft', 'Draft') },
            { value: 'ordered', label: t('purchases.ordered', 'Ordered') },
            { value: 'received', label: t('purchases.received', 'Received') },
            { value: 'completed', label: t('purchases.completed', 'Completed') },
            { value: 'cancelled', label: t('purchases.cancelled', 'Cancelled') },
          ]}
          placeholder={t('purchases.allStatuses', 'All Statuses')}
        />
      </FieldLabel>

      {/* Payment Status Filter */}
      <FieldLabel label={t('purchases.paymentStatus', 'Payment Status')}>
        <ModernSelect
          value={paymentStatusFilter}
          onChange={(val) => { setPaymentStatusFilter(String(val)); setPage(1); }}
          options={[
            { value: '', label: t('purchases.allPaymentStatuses', 'All Payment Statuses') },
            { value: 'unpaid', label: t('purchases.unpaid', 'Unpaid') },
            { value: 'partial', label: t('purchases.partial', 'Partial') },
            { value: 'paid', label: t('purchases.paid', 'Paid') },
          ]}
          placeholder={t('purchases.allPaymentStatuses', 'All Payment Statuses')}
        />
      </FieldLabel>

      {/* Purchase Date Range */}
      <FieldLabel label={t('purchases.purchaseDateRange', 'Purchase Date Range')}>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={purchaseDateStartFilter}
            onChange={(e) => { setPurchaseDateStartFilter(e.target.value); setPage(1); }}
            className="form-input text-xs w-full rounded-xl border border-border bg-background py-2 px-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
          <input
            type="date"
            value={purchaseDateEndFilter}
            onChange={(e) => { setPurchaseDateEndFilter(e.target.value); setPage(1); }}
            className="form-input text-xs w-full rounded-xl border border-border bg-background py-2 px-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
      </FieldLabel>

      {/* Amount Range */}
      <FieldLabel label={t('purchases.amountRange', 'Amount Range ($)')}>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder={t('purchases.minValue', 'Min')}
            value={minAmountFilter}
            onChange={(e) => { setMinAmountFilter(e.target.value); setPage(1); }}
            className="form-input text-xs w-full font-mono rounded-xl border border-border bg-background py-2 px-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
          <input
            type="number"
            placeholder={t('purchases.maxValue', 'Max')}
            value={maxAmountFilter}
            onChange={(e) => { setMaxAmountFilter(e.target.value); setPage(1); }}
            className="form-input text-xs w-full font-mono rounded-xl border border-border bg-background py-2 px-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
      </FieldLabel>

      {/* Created By User */}
      <FieldLabel label={t('purchases.createdBy', 'Created By')}>
        <ModernSelect
          value={createdByFilter}
          onChange={(val) => { setCreatedByFilter(String(val)); setPage(1); }}
          options={[
            { value: '', label: t('purchases.allUsers', 'All Users') },
            ...(users ?? []).map((u: any) => ({ value: String(u.id), label: u.name })),
          ]}
          placeholder={t('purchases.allUsers', 'All Users')}
        />
      </FieldLabel>
    </FilterDrawerShell>
  )
}

export default PurchasesFilterDrawer
