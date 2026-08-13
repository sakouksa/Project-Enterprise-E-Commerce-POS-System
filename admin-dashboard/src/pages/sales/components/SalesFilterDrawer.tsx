import React from 'react'
import { Drawer } from 'antd'
import { useTranslation } from 'react-i18next'
import { Filter, X, RotateCcw, Calendar, DollarSign, CreditCard, Shield, Layers } from 'lucide-react'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'

interface SalesFilterDrawerProps {
  open: boolean
  onClose: () => void
  statusFilter: string | undefined
  setStatusFilter: (val: string | undefined) => void
  paymentStatusFilter: string | undefined
  setPaymentStatusFilter: (val: string | undefined) => void
  paymentMethodFilter: string | undefined
  setPaymentMethodFilter: (val: string | undefined) => void
  startDate: string
  setStartDate: (val: string) => void
  endDate: string
  setEndDate: (val: string) => void
  minTotal: string
  setMinTotal: (val: string) => void
  maxTotal: string
  setMaxTotal: (val: string) => void
  onReset: () => void
  onApply: () => void
  activeFiltersCount: number
}

export const SalesFilterDrawer: React.FC<SalesFilterDrawerProps> = ({
  open,
  onClose,
  statusFilter,
  setStatusFilter,
  paymentStatusFilter,
  setPaymentStatusFilter,
  paymentMethodFilter,
  setPaymentMethodFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  minTotal,
  setMinTotal,
  maxTotal,
  setMaxTotal,
  onReset,
  onApply,
  activeFiltersCount,
}) => {
  const { t } = useTranslation('sales')

  const statusOptions = [
    { value: '', label: t('allStatuses') },
    { value: 'completed', label: t('completed') },
    { value: 'pending', label: t('pending') },
    { value: 'refunded', label: t('refunded') },
    { value: 'cancelled', label: t('cancelled') },
  ]

  const paymentStatusOptions = [
    { value: '', label: t('allPaymentStatuses') },
    { value: 'paid', label: t('paid') },
    { value: 'unpaid', label: t('unpaid') },
    { value: 'partial', label: t('partial') },
    { value: 'refunded', label: t('refunded') },
  ]

  const paymentMethodOptions = [
    { value: '', label: t('allPaymentMethods') },
    { value: 'cash', label: t('cashPayment') },
    { value: 'card', label: t('creditDebitCard') },
    { value: 'qr', label: 'ABA / KHQR' },
    { value: 'bank_transfer', label: t('bankTransfer') },
  ]

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={420}
      closeIcon={false}
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground leading-none">{t('filterSalesOrders')}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t('refinePOSTransactions')}</p>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
              {activeFiltersCount} {t('active')}
            </span>
          )}
        </div>
      }
      extra={
        <button
          onClick={onClose}
          className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      }
      footer={
        <div className="flex items-center justify-between gap-3 py-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-muted-foreground border border-border bg-card rounded-xl hover:bg-muted transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetAll')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onApply()
              onClose()
            }}
            className="flex-1 py-2 text-xs font-bold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-md cursor-pointer text-center"
          >
            {t('applyFilters')} ({activeFiltersCount})
          </button>
        </div>
      }
      className="enterprise-drawer"
    >
      <div className="space-y-4">
        {/* 1. Order Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground block">{t('orderStatus')}</label>
          <ModernSelect
            value={statusFilter || ''}
            onChange={(val) => setStatusFilter(String(val || '') || undefined)}
            options={statusOptions}
            placeholder={t('allStatuses')}
            icon={<Layers className="w-3.5 h-3.5 text-primary" />}
            size="sm"
          />
        </div>

        {/* 2. Payment Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground block">{t('paymentStatusLabel')}</label>
          <ModernSelect
            value={paymentStatusFilter || ''}
            onChange={(val) => setPaymentStatusFilter(String(val || '') || undefined)}
            options={paymentStatusOptions}
            placeholder={t('allPaymentStatuses')}
            icon={<Shield className="w-3.5 h-3.5 text-emerald-500" />}
            size="sm"
          />
        </div>

        {/* 3. Payment Method */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground block">{t('paymentMethod')}</label>
          <ModernSelect
            value={paymentMethodFilter || ''}
            onChange={(val) => setPaymentMethodFilter(String(val || '') || undefined)}
            options={paymentMethodOptions}
            placeholder={t('allPaymentMethods')}
            icon={<CreditCard className="w-3.5 h-3.5 text-indigo-500" />}
            size="sm"
          />
        </div>

        {/* 4. Date Range */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground block flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{t('transactionDateRange')}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-muted-foreground block mb-1">{t('fromDate')}</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-[34px] text-xs px-3 bg-card border border-border rounded-xl focus:outline-none focus:border-primary text-foreground"
              />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block mb-1">{t('toDate')}</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-[34px] text-xs px-3 bg-card border border-border rounded-xl focus:outline-none focus:border-primary text-foreground"
              />
            </div>
          </div>
        </div>

        {/* 5. Total Amount Range */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground block flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{t('grandTotalRange')}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder={t('minPricePlaceholder', 'Min $ (e.g. 10)')}
              value={minTotal}
              onChange={(e) => setMinTotal(e.target.value)}
              className="w-full h-[34px] text-xs px-3 bg-card border border-border rounded-xl focus:outline-none focus:border-primary text-foreground"
            />
            <input
              type="number"
              placeholder={t('maxPricePlaceholder', 'Max $ (e.g. 500)')}
              value={maxTotal}
              onChange={(e) => setMaxTotal(e.target.value)}
              className="w-full h-[34px] text-xs px-3 bg-card border border-border rounded-xl focus:outline-none focus:border-primary text-foreground"
            />
          </div>
        </div>
      </div>
    </Drawer>
  )
}
